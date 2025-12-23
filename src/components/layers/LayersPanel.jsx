import React from 'react';
import './LayersPanel.css';

const LayersPanel = ({ activeLayers, toggleLayer }) => {
  const layers = [
    { id: 'baseMap', name: 'Carte de base', icon: 'ÃƒÂ¯Ã‚Â¿Ã‚Â½ÃƒÂ¯Ã‚Â¿Ã‚Â½ÃƒÂ¯Ã‚Â¸Ã‚Â' },
    { id: 'roads', name: 'Routes', icon: 'ÃƒÂ¯Ã‚Â¿Ã‚Â½ÃƒÂ¯Ã‚Â¿Ã‚Â½ÃƒÂ¯Ã‚Â¸Ã‚Â' },
    { id: 'buildings', name: 'BÃƒÆ’Ã‚Â¢timents', icon: 'ÃƒÂ°Ã…Â¸Ã‚ÂÃ‚Â¢' },
    { id: 'poi', name: 'Points d\'intÃƒÆ’Ã‚Â©rÃƒÆ’Ã‚Âªt', icon: 'ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â' },
    { id: 'terrain3D', name: 'Relief 3D', icon: 'ÃƒÂ¢Ã¢â‚¬ÂºÃ‚Â°ÃƒÂ¯Ã‚Â¸Ã‚Â' },
    { id: 'canvasOverlay', name: 'Dessin', icon: 'ÃƒÂ°Ã…Â¸Ã…Â½Ã‚Â¨' }
  ];

  return (
    <div className="layers-panel">
      <div className="panel-header">
        <h3>ÃƒÂ°Ã…Â¸Ã¢â‚¬â€Ã‚ÂºÃƒÂ¯Ã‚Â¸Ã‚Â Gestion des couches</h3>
        <span className="layer-count">{layers.length} couches</span>
      </div>
      
      <div className="panel-body">
        <div className="layer-list">
          {layers.map(layer => (
            <div 
              key={layer.id}
              className={`layer-item ${activeLayers[layer.id] ? 'visible' : 'hidden'}`}
              onClick={() => toggleLayer(layer.id)}
            >
              <div className="layer-info">
                <button 
                  className="visibility-toggle"
                  title={activeLayers[layer.id] ? "Masquer" : "Afficher"}
                >
                  {activeLayers[layer.id] ? '' : ''}
                </button>
                <span className="layer-name">{layer.name}</span>
                <span className="layer-type">vector</span>
              </div>
              
              <div className="layer-controls">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value="1"
                  className="opacity-slider"
                  title="OpacitÃƒÆ’Ã‚Â©"
                  onChange={() => {}}
                />
                <span className="opacity-value">100%</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="panel-actions">
          <button className="btn-add-layer">+ Ajouter une couche</button>
        </div>
      </div>
    </div>
  );
};

export default LayersPanel;
