import React, { useState } from 'react';
import './MeasureTools.css';

const MeasureTools = ({ viewMode }) => {
  const [activeTool, setActiveTool] = useState(null);

  const tools = [
    { id: 'distance', name: 'Distance', icon: '', description: 'Mesurer une distance' },
    { id: 'area', name: 'Surface', icon: '', description: 'Mesurer une surface' },
    { id: 'angle', name: 'Angle', icon: '', description: 'Mesurer un angle' },
    { id: 'point', name: 'Coordonnées', icon: '', description: 'Obtenir les coordonnées' }
  ];

  const handleToolSelect = (toolId) => {
    setActiveTool(toolId);
    console.log(`Outil de mesure activé: ${toolId} en mode ${viewMode}`);
  };

  return (
    <div className="measure-tools">
      <div className="measure-header">
        <h3> Outils de mesure</h3>
        <span className="measure-mode">Mode: {viewMode}</span>
      </div>
      
      <div className="tool-selection">
        {tools.map(tool => (
          <button
            key={tool.id}
            className={`measure-tool ${activeTool === tool.id ? 'active' : ''}`}
            onClick={() => handleToolSelect(tool.id)}
            title={tool.description}
          >
            <span className="tool-icon">{tool.icon}</span>
            <span className="tool-name">{tool.name}</span>
          </button>
        ))}
      </div>
      
      <div className="tool-instructions">
        <p>Sélectionnez un outil et cliquez sur la carte pour mesurer</p>
      </div>
    </div>
  );
};

export default MeasureTools;
