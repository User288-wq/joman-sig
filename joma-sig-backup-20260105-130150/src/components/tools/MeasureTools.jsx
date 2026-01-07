import React, { useState } from 'react';
import { useMap } from '../../contexts/MapContext';
import './MeasureTools.css';

const MeasureTools = ({ viewMode }) => {
  const { map } = useMap();
  const [activeTool, setActiveTool] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [unit, setUnit] = useState('meters');

  const tools = [
    { id: 'distance', name: 'Distance', icon: '', description: 'Mesurer une distance' },
    { id: 'area', name: 'Surface', icon: '', description: 'Mesurer une surface' },
    { id: 'angle', name: 'Angle', icon: '', description: 'Mesurer un angle' },
    { id: 'point', name: 'CoordonnÃƒÆ’Ã‚Â©es', icon: '', description: 'Obtenir les coordonnÃƒÆ’Ã‚Â©es' },
    { id: 'clear', name: 'Effacer', icon: '', description: 'Effacer toutes les mesures' }
  ];

  const handleToolSelect = (toolId) => {
    setActiveTool(toolId);
    
    if (toolId === 'clear') {
      setMeasurements([]);
      // Ici: effacer les mesures de la carte
      return;
    }
    
    // Pour le vrai SIG, ici on activerait les interactions de mesure OpenLayers
    console.log(`Outil de mesure activÃƒÆ’Ã‚Â©: ${toolId} en mode ${viewMode}`);
  };

  const convertUnits = (value) => {
    if (unit === 'meters') return value;
    if (unit === 'kilometers') return value / 1000;
    if (unit === 'miles') return value * 0.000621371;
    return value;
  };

  const formatValue = (value) => {
    const converted = convertUnits(value);
    return `${converted.toFixed(2)} ${unit}`;
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
      
      <div className="unit-selector">
        <label>UnitÃƒÆ’Ã‚Â©s:</label>
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="meters">MÃƒÆ’Ã‚Â¨tres</option>
          <option value="kilometers">KilomÃƒÆ’Ã‚Â¨tres</option>
          <option value="miles">Miles</option>
        </select>
      </div>
      
      {activeTool && activeTool !== 'clear' && (
        <div className="tool-instructions">
          <p>
            {activeTool === 'distance' && 'Cliquez sur la carte pour commencer, puis cliquez pour ajouter des points. Double-cliquez pour terminer.'}
            {activeTool === 'area' && 'Cliquez pour dessiner un polygone. Double-cliquez pour fermer et calculer la surface.'}
            {activeTool === 'angle' && 'Cliquez pour placer les 3 points de l\'angle.'}
            {activeTool === 'point' && 'Cliquez sur la carte pour obtenir les coordonnÃƒÆ’Ã‚Â©es.'}
          </p>
        </div>
      )}
      
      <div className="measurements-list">
        <h4>Mesures rÃƒÆ’Ã‚Â©centes:</h4>
        {measurements.length > 0 ? (
          measurements.map((measurement, index) => (
            <div key={index} className="measurement-item">
              <span className="measurement-type">{measurement.type}</span>
              <span className="measurement-value">{formatValue(measurement.value)}</span>
              <button className="btn-remove-measurement">ÃƒÆ’Ã¢â‚¬â€</button>
            </div>
          ))
        ) : (
          <p className="no-measurements">Aucune mesure effectuÃƒÆ’Ã‚Â©e</p>
        )}
      </div>
      
      <div className="measure-actions">
        <button className="btn-export-measurements"> Copier</button>
        <button className="btn-save-measurements"> Sauvegarder</button>
      </div>
    </div>
  );
};

export default MeasureTools;
