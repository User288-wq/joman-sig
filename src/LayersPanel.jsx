// components/layers/LayersPanel.jsx
import React, { useState } from 'react';
import './LayersPanel.css';

const LayersPanel = ({ 
  activeLayers, 
  toggleLayer, 
  selectedLayers = [], 
  setSelectedLayers 
}) => {
  const [expanded, setExpanded] = useState(true);
  const [showOnlyVisible, setShowOnlyVisible] = useState(false);
  const [layerSearch, setLayerSearch] = useState('');
  const [contextMenu, setContextMenu] = useState(null);

  // Données de démonstration
  const layerDefinitions = [
    { id: 'baseMap', name: 'Fond de carte OSM', type: 'raster', editable: false },
    { id: 'roads', name: 'Routes principales', type: 'line', editable: true },
    { id: 'buildings', name: 'Bâtiments', type: 'polygon', editable: true },
    { id: 'poi', name: 'Points d\'intérêt', type: 'point', editable: true },
    { id: 'zones', name: 'Zones administratives', type: 'polygon', editable: true },
    { id: 'hydro', name: 'Réseau hydrographique', type: 'line', editable: true }
  ];

  const handleLayerClick = (layerId, event) => {
    if (event.ctrlKey || event.metaKey) {
      // Sélection multiple
      if (selectedLayers.includes(layerId)) {
        setSelectedLayers(selectedLayers.filter(id => id !== layerId));
      } else {
        setSelectedLayers([...selectedLayers, layerId]);
      }
    } else {
      // Sélection simple
      setSelectedLayers([layerId]);
    }
  };

  const handleContextMenu = (layerId, event) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      layerId
    });
  };

  const handleLayerAction = (action, layerId) => {
    console.log(`Action ${action} sur couche ${layerId}`);
    setContextMenu(null);
    
    switch(action) {
      case 'zoom':
        alert(`Zoom sur ${layerId}`);
        break;
      case 'style':
        alert(`Style ${layerId}`);
        break;
      case 'export':
        alert(`Export ${layerId}`);
        break;
      case 'properties':
        alert(`Propriétés ${layerId}`);
        break;
    }
  };

  const filteredLayers = layerDefinitions.filter(layer => {
    const matchesSearch = layer.name.toLowerCase().includes(layerSearch.toLowerCase());
    const matchesVisibility = !showOnlyVisible || activeLayers[layer.id];
    return matchesSearch && matchesVisibility;
  });

  const getLayerIcon = (type) => {
    switch(type) {
      case 'point': return '📍';
      case 'line': return '🛣️';
      case 'polygon': return '🗺️';
      case 'raster': return '🖼️';
      default: return '🔷';
    }
  };

  return (
    <div className={`layers-panel ${expanded ? 'expanded' : 'collapsed'}`}>
      {/* En-tête */}
      <div className="panel-header" onClick={() => setExpanded(!expanded)}>
        <h3>📂 Couches</h3>
        <span className="toggle-icon">{expanded ? '▼' : '▶'}</span>
      </div>

      {expanded && (
        <div className="panel-content">
          {/* Barre d'outils */}
          <div className="layer-toolbar">
            <input
              type="text"
              placeholder="Rechercher une couche..."
              value={layerSearch}
              onChange={(e) => setLayerSearch(e.target.value)}
              className="layer-search"
            />
            <button 
              className={`toolbar-btn ${showOnlyVisible ? 'active' : ''}`}
              onClick={() => setShowOnlyVisible(!showOnlyVisible)}
              title="Afficher uniquement les couches visibles"
            >
              👁️
            </button>
            <button 
              className="toolbar-btn"
              onClick={() => {
                // Afficher toutes les couches
                Object.keys(activeLayers).forEach(key => {
                  if (!activeLayers[key]) toggleLayer(key);
                });
              }}
              title="Tout afficher"
            >
              ✅
            </button>
            <button 
              className="toolbar-btn"
              onClick={() => {
                // Masquer toutes les couches (sauf baseMap)
                Object.keys(activeLayers).forEach(key => {
                  if (key !== 'baseMap' && activeLayers[key]) toggleLayer(key);
                });
              }}
              title="Tout masquer"
            >
              ❌
            </button>
          </div>

          {/* Liste des couches */}
          <div className="layers-list">
            {filteredLayers.length === 0 ? (
              <div className="empty-message">
                {layerSearch ? 'Aucune couche ne correspond à la recherche' : 'Aucune couche disponible'}
              </div>
            ) : (
              filteredLayers.map(layer => {
                const isVisible = activeLayers[layer.id];
                const isSelected = selectedLayers.includes(layer.id);
                
                return (
                  <div 
                    key={layer.id}
                    className={`layer-item ${isSelected ? 'selected' : ''} ${isVisible ? 'visible' : 'hidden'}`}
                    onClick={(e) => handleLayerClick(layer.id, e)}
                    onContextMenu={(e) => handleContextMenu(layer.id, e)}
                  >
                    <div className="layer-main">
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={() => toggleLayer(layer.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="layer-checkbox"
                      />
                      <span className="layer-icon">{getLayerIcon(layer.type)}</span>
                      <span className="layer-name">{layer.name}</span>
                      {layer.editable && <span className="editable-badge">✏️</span>}
                    </div>
                    
                    {isSelected && (
                      <div className="layer-actions">
                        <button className="action-btn" title="Zoom">
                          🔍
                        </button>
                        <button className="action-btn" title="Style">
                          🎨
                        </button>
                        <button className="action-btn" title="Propriétés">
                          ℹ️
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Statistiques */}
          <div className="layer-stats">
            <div className="stat-item">
              <span className="stat-label">Total:</span>
              <span className="stat-value">{layerDefinitions.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Visibles:</span>
              <span className="stat-value">
                {Object.values(activeLayers).filter(v => v).length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Sélection:</span>
              <span className="stat-value">{selectedLayers.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Menu contextuel */}
      {contextMenu && (
        <>
          <div 
            className="context-menu-overlay"
            onClick={() => setContextMenu(null)}
          />
          <div 
            className="context-menu"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <div className="context-menu-header">
              {layerDefinitions.find(l => l.id === contextMenu.layerId)?.name}
            </div>
            <div className="context-menu-item" onClick={() => handleLayerAction('zoom', contextMenu.layerId)}>
              🔍 Zoom sur la couche
            </div>
            <div className="context-menu-item" onClick={() => handleLayerAction('style', contextMenu.layerId)}>
              🎨 Modifier le style...
            </div>
            <div className="context-menu-item" onClick={() => handleLayerAction('export', contextMenu.layerId)}>
              📤 Exporter la couche...
            </div>
            <div className="context-menu-divider" />
            <div className="context-menu-item" onClick={() => handleLayerAction('properties', contextMenu.layerId)}>
              ℹ️ Propriétés...
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LayersPanel;