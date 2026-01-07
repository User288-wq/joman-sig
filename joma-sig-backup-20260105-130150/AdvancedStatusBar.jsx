// AdvancedStatusBar.jsx
import React, { useState, useEffect } from 'react';

const AdvancedStatusBar = ({ map, layers, projection }) => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0, proj: '' });
  const [scale, setScale] = useState('1:1,000');
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [selectionInfo, setSelectionInfo] = useState({ count: 0, type: '' });
  const [renderTime, setRenderTime] = useState(0);

  // Mettre à jour les coordonnées en temps réel
  useEffect(() => {
    if (!map) return;

    const updateCoordinates = (event) => {
      const coords = map.getEventCoordinate(event);
      const projCoords = toLonLat(coords);
      setCoordinates({
        x: projCoords[0].toFixed(6),
        y: projCoords[1].toFixed(6),
        proj: projection
      });
    };

    map.on('pointermove', updateCoordinates);
    return () => map.un('pointermove', updateCoordinates);
  }, [map, projection]);

  // Calculer l'échelle
  useEffect(() => {
    if (!map) return;

    const updateScale = () => {
      const resolution = map.getView().getResolution();
      const units = map.getView().getProjection().getUnits();
      const dpi = 96;
      const inchesPerMeter = 39.37;
      
      let scaleDenominator;
      if (units === 'degrees') {
        scaleDenominator = resolution * (dpi * inchesPerMeter * 111325);
      } else {
        scaleDenominator = resolution * dpi * inchesPerMeter;
      }
      
      const roundedScale = Math.round(scaleDenominator);
      setScale(`1:${roundedScale.toLocaleString()}`);
    };

    map.getView().on('change:resolution', updateScale);
    updateScale();
  }, [map]);

  return (
    <div className="advanced-statusbar">
      {/* Coordonnées */}
      <div className="status-item coordinates">
        <span className="status-label">📌</span>
        <span className="status-value">
          {coordinates.x}, {coordinates.y}
        </span>
        <span className="status-projection">[{coordinates.proj}]</span>
      </div>

      {/* Échelle */}
      <div className="status-item scale">
        <span className="status-label">📏</span>
        <span className="status-value">{scale}</span>
      </div>

      {/* Couches */}
      <div className="status-item layers">
        <span className="status-label">🗺️</span>
        <span className="status-value">
          {layers.filter(l => l.visible).length}/{layers.length}
        </span>
      </div>

      {/* Sélection */}
      <div className="status-item selection">
        <span className="status-label">🎯</span>
        <span className="status-value">
          {selectionInfo.count > 0 ? `${selectionInfo.count} sélectionnés` : 'Aucune sélection'}
        </span>
      </div>

      {/* Mémoire */}
      <div className="status-item memory">
        <span className="status-label">💾</span>
        <span className="status-value">
          {(memoryUsage / 1024 / 1024).toFixed(1)} MB
        </span>
      </div>

      {/* Performance */}
      <div className="status-item performance">
        <span className="status-label">⚡</span>
        <span className="status-value">{renderTime}ms</span>
      </div>

      {/* Projection */}
      <div className="status-item projection">
        <span className="status-label">🌍</span>
        <span className="status-value">{projection}</span>
      </div>

      {/* Boutons rapides */}
      <div className="status-actions">
        <button 
          className="status-btn"
          title="Capture d'écran"
          onClick={() => alert('Capture d\'écran')}
        >
          📷
        </button>
        
        <button 
          className="status-btn"
          title="Mesures rapides"
          onClick={() => alert('Outils de mesure')}
        >
          📐
        </button>
        
        <button 
          className="status-btn"
          title="Options d'affichage"
          onClick={() => alert('Options')}
        >
          ⚙️
        </button>
        
        <div className="status-divider">|</div>
        
        <button 
          className="status-btn"
          title="Aide rapide"
          onClick={() => window.open('https://openlayers.org', '_blank')}
        >
          ❓
        </button>
      </div>
    </div>
  );
};