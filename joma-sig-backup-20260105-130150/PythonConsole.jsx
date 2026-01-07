// PythonConsole.jsx - Console pour expressions et scripts
const PythonConsole = ({ map, layers }) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // Exécuter du code Python via WebAssembly (Pyodide)
  const executePython = async () => {
    setIsRunning(true);
    
    try {
      // Charger Pyodide si nécessaire
      if (!window.pyodide) {
        window.pyodide = await loadPyodide();
        
        // Ajouter des packages SIG
        await window.pyodide.loadPackage(['numpy', 'pandas', 'geopandas']);
      }
      
      // Exécuter le code
      const result = await window.pyodide.runPythonAsync(code);
      
      setOutput(prev => [...prev, 
        { type: 'input', content: code },
        { type: 'output', content: String(result) }
      ]);
      
      // Appliquer les résultats à la carte si pertinent
      if (result && result.geometry) {
        applyToMap(result);
      }
      
    } catch (error) {
      setOutput(prev => [...prev, 
        { type: 'input', content: code },
        { type: 'error', content: error.message }
      ]);
    } finally {
      setIsRunning(false);
      setCode('');
    }
  };

  // Templates de code
  const codeTemplates = [
    {
      name: 'Buffer',
      code: `import geopandas as gpd
from shapely.geometry import Point

# Créer un buffer
point = Point(2.3522, 48.8566)
buffer = point.buffer(0.01)  # 1km environ
buffer`
    },
    {
      name: 'Intersection',
      code: `# Intersection de deux couches
layer1 = load_layer('couche1')
layer2 = load_layer('couche2')
intersection = layer1.intersection(layer2)
intersection`
    },
    {
      name: 'Statistiques',
      code: `# Statistiques spatiales
import numpy as np
areas = [feature.area for feature in features]
print(f"Moyenne: {np.mean(areas):.2f}")
print(f"Max: {np.max(areas):.2f}")
print(f"Min: {np.min(areas):.2f}")`
    }
  ];

  return (
    <div className="python-console">
      <div className="console-header">
        <h3>🐍 Console Python</h3>
        <div className="console-actions">
          <button onClick={executePython} disabled={isRunning}>
            {isRunning ? '▶️ Exécution...' : '▶ Exécuter'}
          </button>
          <button onClick={() => setOutput([])}>🗑️ Effacer</button>
        </div>
      </div>
      
      <div className="code-editor">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Entrez du code Python ici..."
          spellCheck="false"
        />
        <div className="editor-actions">
          <span className="language-badge">Python 3.11</span>
          <button onClick={() => setCode('import geopandas as gpd\n')}>
            + GeoPandas
          </button>
        </div>
      </div>
      
      <div className="code-templates">
        <h4>📋 Templates</h4>
        <div className="templates-grid">
          {codeTemplates.map(template => (
            <div 
              key={template.name}
              className="template-card"
              onClick={() => setCode(template.code)}
            >
              <div className="template-name">{template.name}</div>
              <div className="template-desc">Cliquez pour charger</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="console-output">
        <h4>📤 Sortie</h4>
        <div className="output-content">
          {output.map((item, idx) => (
            <div key={idx} className={`output-line ${item.type}`}>
              <span className="output-prefix">
                {item.type === 'input' ? '>>>' : 
                 item.type === 'output' ? '<<<' : '!!!'}
              </span>
              <pre>{item.content}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};