// ====================
// CONSOLE PYTHON AVEC PYODIDE
// ====================

import { loadPyodide } from "pyodide";

const PythonConsole = () => {
  const [pyodide, setPyodide] = useState(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Initialiser Pyodide
  useEffect(() => {
    const initPyodide = async () => {
      setIsLoading(true);
      try {
        const pyodideInstance = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
        });
        
        // Installer les packages SIG
        await pyodideInstance.loadPackage(["numpy", "pandas", "geopandas", "shapely"]);
        
        // Exposer des données de la carte à Python
        pyodideInstance.globals.set("ol", { map: map });
        
        setPyodide(pyodideInstance);
        setOutput("✅ Pyodide initialisé ! Packages disponibles:\n- numpy\n- pandas\n- geopandas\n- shapely");
      } catch (error) {
        setOutput(`❌ Erreur initialisation Pyodide: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    initPyodide();
  }, []);

  // Exécuter du code Python
  const executePythonCode = async (pythonCode) => {
    if (!pyodide) return;
    
    setIsLoading(true);
    try {
      // Exposer les couches actuelles à Python
      const layersData = mapLayers.map(layer => ({
        name: layer.name,
        features: layer.featureCount,
        type: layer.type
      }));
      
      pyodide.globals.set("sig_layers", layersData);
      
      // Exécuter le code
      const result = await pyodide.runPythonAsync(`
import json
import numpy as np
from shapely.geometry import shape, mapping

# Code utilisateur
${pythonCode}

# Retourner le résultat
result = locals().get('result', 'Execution réussie')
str(result) if result else "None"
`);
      
      const newHistory = [...history, {
        timestamp: new Date().toISOString(),
        code: pythonCode,
        output: result
      }];
      
      setHistory(newHistory.slice(-10)); // Garder les 10 derniers
      setOutput(`>>> ${pythonCode}\n${result}`);
      
      // Si le code retourne des géométries, les ajouter à la carte
      if (result && typeof result === 'string' && result.includes('geometry')) {
        try {
          const geojson = JSON.parse(result);
          addFeaturesFromPython(geojson);
        } catch (e) {
          // Ce n'est pas du GeoJSON, continuer
        }
      }
    } catch (error) {
      setOutput(`❌ Erreur Python:\n${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Exemples de scripts Python pré-définis
  const pythonExamples = [
    {
      name: "Buffer toutes les couches",
      code: `# Créer un buffer de 500m sur toutes les entités
import geopandas as gpd
from shapely.geometry import shape, mapping

result = []
for layer in sig_layers:
    print(f"Traitement de {layer['name']}")
    # Ici, vous récupéreriez les vraies géométries
    # Pour l'exemple, on crée une géométrie test
    result.append({
        "layer": layer['name'],
        "buffer_500m": "généré"
    })
result`
    },
    {
      name: "Statistiques spatiales",
      code: `# Calculer des statistiques
import numpy as np

stats = {
    "nombre_couches": len(sig_layers),
    "total_entités": sum(layer['features'] for layer in sig_layers),
    "types_uniques": list(set(layer['type'] for layer in sig_layers))
}
stats`
    }
  ];

  return (
    <div style={{
      position: "fixed",
      top: "80px",
      right: "20px",
      width: "500px",
      height: "400px",
      background: "rgba(15, 23, 42, 0.95)",
      border: "1px solid #334155",
      borderRadius: "12px",
      zIndex: 1000,
      backdropFilter: "blur(10px)",
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{
        padding: "15px",
        borderBottom: "1px solid #334155",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h3 style={{ margin: 0 }}>🐍 Console Python</h3>
        <div style={{ display: "flex", gap: "8px" }}>
          {pythonExamples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => setCode(example.code)}
              style={{
                padding: "4px 8px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              {example.name}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ flex: 1, display: "flex" }}>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="# Écrivez votre code Python ici...
# Accès aux couches SIG via 'sig_layers'
# Ex: print(sig_layers)"
          style={{
            flex: 1,
            background: "#0f172a",
            color: "#e2e8f0",
            border: "none",
            padding: "15px",
            fontFamily: "'Monaco', 'Courier New', monospace",
            fontSize: "14px",
            resize: "none",
            outline: "none"
          }}
          rows={10}
        />
        
        <div style={{
          width: "200px",
          padding: "15px",
          background: "#1e293b",
          overflowY: "auto",
          fontSize: "12px"
        }}>
          <strong>Variables disponibles:</strong>
          <ul style={{ paddingLeft: "20px" }}>
            <li>sig_layers: liste des couches</li>
            <li>numpy (np)</li>
            <li>pandas (pd)</li>
            <li>geopandas (gpd)</li>
            <li>shapely</li>
          </ul>
        </div>
      </div>
      
      <div style={{
        padding: "15px",
        background: "#1e293b",
        borderTop: "1px solid #334155"
      }}>
        <button
          onClick={() => executePythonCode(code)}
          disabled={isLoading || !pyodide}
          style={{
            padding: "8px 20px",
            background: isLoading ? "#475569" : "#10b981",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontWeight: "bold"
          }}
        >
          {isLoading ? "⏳ Exécution..." : "▶ Exécuter"}
        </button>
        
        <div style={{
          marginTop: "10px",
          padding: "10px",
          background: "#0f172a",
          borderRadius: "6px",
          fontSize: "13px",
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          maxHeight: "150px",
          overflowY: "auto"
        }}>
          {output}
        </div>
      </div>
    </div>
  );
};