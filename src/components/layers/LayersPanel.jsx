import React from 'react';
import { useLayers } from '../../contexts/LayerContext';
import './LayersPanel.css';

const LayersPanel = () => {
  const { layerList, toggleLayer, updateLayerOpacity, reorderLayers } = useLayers();
  const [draggedIndex, setDraggedIndex] = React.useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderLayers(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="layers-panel">
      <div className="panel-header">
        <h3> Gestion des couches</h3>
        <span className="layer-count">{layerList.length} couches</span>
      </div>
      
      <div className="panel-body">
        <div className="layer-list">
          {layerList.map((layer, index) => (
            <div 
              key={layer.id}
              className={`layer-item ${layer.visible ? 'visible' : 'hidden'}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className="layer-info">
                <button 
                  className="visibility-toggle"
                  onClick={() => toggleLayer(layer.id)}
                  title={layer.visible ? "Masquer" : "Afficher"}
                >
                  {layer.visible ? '' : ''}
                </button>
                <span className="layer-name">{layer.name}</span>
                <span className="layer-type">{layer.type}</span>
              </div>
              
              <div className="layer-controls">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={layer.opacity}
                  onChange={(e) => updateLayerOpacity(layer.id, parseFloat(e.target.value))}
                  className="opacity-slider"
                  title="OpacitÃƒÆ’Ã‚Â©"
                />
                <span className="opacity-value">{Math.round(layer.opacity * 100)}%</span>
                <button 
                  className="remove-layer"
                  onClick={() => {}}
                  title="Supprimer"
                >
                  
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="panel-actions">
          <button className="btn-add-layer">+ Ajouter une couche</button>
          <button className="btn-import-layers"> Importer</button>
          <button className="btn-save-layers"> Sauvegarder</button>
        </div>
        
        <div className="layer-stats">
          <div className="stat">
            <span className="stat-label">Visibles:</span>
            <span className="stat-value">
              {layerList.filter(l => l.visible).length}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Vectorielles:</span>
            <span className="stat-value">
              {layerList.filter(l => l.type === 'vector').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayersPanel;
