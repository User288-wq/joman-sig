import React, { useState } from 'react';
import './MainToolbar.css';

const MainToolbar = ({ onToolSelect }) => {
  const [activeTool, setActiveTool] = useState(null);

  const tools = [
    { id: 'select', label: 'SÃƒÆ’Ã‚Â©lection', icon: '', hotkey: 'V' },
    { id: 'pan', label: 'Navigation', icon: '', hotkey: 'H' },
    { id: 'zoom-in', label: 'Zoom +', icon: '', hotkey: '+' },
    { id: 'zoom-out', label: 'Zoom -', icon: '', hotkey: '-' },
    { id: 'measure', label: 'Mesurer', icon: '', hotkey: 'M' },
    { id: 'draw-point', label: 'Point', icon: '', hotkey: 'P' },
    { id: 'draw-line', label: 'Ligne', icon: '', hotkey: 'L' },
    { id: 'draw-polygon', label: 'Polygone', icon: '', hotkey: 'G' },
    { id: 'info', label: 'Info', icon: 'ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¹', hotkey: 'I' },
    { id: 'print', label: 'Imprimer', icon: '', hotkey: 'Ctrl+P' }
  ];

  const handleToolClick = (toolId) => {
    setActiveTool(toolId);
    if (onToolSelect) {
      onToolSelect(toolId);
    }
  };

  return (
    <div className="main-toolbar">
      <div className="toolbar-section">
        <div className="section-title">Navigation</div>
        <div className="tool-group">
          {tools.slice(0, 4).map(tool => (
            <button
              key={tool.id}
              className={`tool-btn ${activeTool === tool.id ? 'active' : ''}`}
              onClick={() => handleToolClick(tool.id)}
              title={`${tool.label} (${tool.hotkey})`}
            >
              <span className="tool-icon">{tool.icon}</span>
              <span className="tool-label">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-section">
        <div className="section-title">Dessin</div>
        <div className="tool-group">
          {tools.slice(4, 8).map(tool => (
            <button
              key={tool.id}
              className={`tool-btn ${activeTool === tool.id ? 'active' : ''}`}
              onClick={() => handleToolClick(tool.id)}
              title={`${tool.label} (${tool.hotkey})`}
            >
              <span className="tool-icon">{tool.icon}</span>
              <span className="tool-label">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-section">
        <div className="section-title">Outils</div>
        <div className="tool-group">
          {tools.slice(8).map(tool => (
            <button
              key={tool.id}
              className={`tool-btn ${activeTool === tool.id ? 'active' : ''}`}
              onClick={() => handleToolClick(tool.id)}
              title={`${tool.label} (${tool.hotkey})`}
            >
              <span className="tool-icon">{tool.icon}</span>
              <span className="tool-label">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-actions">
        <button className="action-btn btn-clear">Effacer</button>
        <button className="action-btn btn-save">Sauvegarder</button>
        <button className="action-btn btn-export">Exporter</button>
      </div>
    </div>
  );
};

export default MainToolbar;
