// ThemeCustomizer.jsx - Personnalisation complète de l'interface
const ThemeCustomizer = () => {
  const [theme, setTheme] = useState({
    mode: 'dark', // dark, light, auto
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    backgroundColor: '#0f172a',
    cardBackground: '#1e293b',
    textColor: '#f8fafc',
    borderRadius: '12px',
    fontFamily: "'Inter', sans-serif",
    spacing: '8px',
    shadows: true,
    animations: true,
    compactMode: false
  });

  const predefinedThemes = {
    'Dark Professional': {
      primaryColor: '#3b82f6',
      backgroundColor: '#0f172a',
      textColor: '#f8fafc'
    },
    'Light Modern': {
      primaryColor: '#2563eb',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      mode: 'light'
    },
    'Nature': {
      primaryColor: '#10b981',
      secondaryColor: '#3b82f6',
      backgroundColor: '#064e3b',
      textColor: '#d1fae5'
    },
    'High Contrast': {
      primaryColor: '#000000',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      mode: 'light'
    }
  };

  const applyTheme = (themeName) => {
    if (predefinedThemes[themeName]) {
      setTheme(prev => ({ ...prev, ...predefinedThemes[themeName] }));
    }
  };

  // Appliquer le thème au document
  useEffect(() => {
    const root = document.documentElement;
    
    Object.entries(theme).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--${key}`, value);
      }
    });
    
    // Appliquer la classe de mode
    root.setAttribute('data-theme', theme.mode);
  }, [theme]);

  return (
    <div className="theme-customizer">
      <h3>🎨 Personnalisation du thème</h3>
      
      <div className="theme-presets">
        <h4>Thèmes prédéfinis</h4>
        <div className="presets-grid">
          {Object.keys(predefinedThemes).map(name => (
            <div 
              key={name}
              className="preset-card"
              onClick={() => applyTheme(name)}
              style={{
                background: predefinedThemes[name].backgroundColor,
                color: predefinedThemes[name].textColor
              }}
            >
              <div className="preset-name">{name}</div>
              <div className="preset-colors">
                <span style={{ background: predefinedThemes[name].primaryColor }}></span>
                <span style={{ background: predefinedThemes[name].secondaryColor }}></span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="theme-editor">
        <h4>Éditeur avancé</h4>
        
        <div className="editor-section">
          <label>Couleur principale</label>
          <input 
            type="color" 
            value={theme.primaryColor}
            onChange={(e) => setTheme({...theme, primaryColor: e.target.value})}
          />
        </div>
        
        <div className="editor-section">
          <label>Mode</label>
          <select 
            value={theme.mode}
            onChange={(e) => setTheme({...theme, mode: e.target.value})}
          >
            <option value="dark">Sombre</option>
            <option value="light">Clair</option>
            <option value="auto">Auto (système)</option>
          </select>
        </div>
        
        <div className="editor-section">
          <label>Police</label>
          <select 
            value={theme.fontFamily}
            onChange={(e) => setTheme({...theme, fontFamily: e.target.value})}
          >
            <option value="'Inter', sans-serif">Inter</option>
            <option value="'Roboto', sans-serif">Roboto</option>
            <option value="'Open Sans', sans-serif">Open Sans</option>
            <option value="'Montserrat', sans-serif">Montserrat</option>
            <option value="monospace">Monospace</option>
          </select>
        </div>
        
        <div className="editor-section">
          <label>
            <input 
              type="checkbox"
              checked={theme.shadows}
              onChange={(e) => setTheme({...theme, shadows: e.target.checked})}
            />
            Ombres portées
          </label>
          
          <label>
            <input 
              type="checkbox"
              checked={theme.animations}
              onChange={(e) => setTheme({...theme, animations: e.target.checked})}
            />
            Animations
          </label>
          
          <label>
            <input 
              type="checkbox"
              checked={theme.compactMode}
              onChange={(e) => setTheme({...theme, compactMode: e.target.checked})}
            />
            Mode compact
          </label>
        </div>
      </div>
      
      <div className="theme-actions">
        <button className="btn-primary">
          💾 Sauvegarder le thème
        </button>
        <button 
          className="btn-secondary"
          onClick={() => setTheme({
            mode: 'dark',
            primaryColor: '#3b82f6',
            secondaryColor: '#10b981',
            backgroundColor: '#0f172a',
            cardBackground: '#1e293b',
            textColor: '#f8fafc',
            borderRadius: '12px',
            fontFamily: "'Inter', sans-serif",
            spacing: '8px',
            shadows: true,
            animations: true,
            compactMode: false
          })}
        >
          ↩️ Réinitialiser
        </button>
      </div>
    </div>
  );
};