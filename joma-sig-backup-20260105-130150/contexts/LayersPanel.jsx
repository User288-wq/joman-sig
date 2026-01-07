import React from 'react';

const LayersPanel = ({ activeLayers, toggleLayer, selectedLayers, setSelectedLayers }) => {
  const layers = [
    { id: 'baseMap', name: 'Fond de carte OSM', type: 'raster' },
    { id: 'roads', name: 'Routes principales', type: 'line' },
    { id: 'buildings', name: 'Bâtiments', type: 'polygon' },
    { id: 'poi', name: 'Points d\'intérêt', type: 'point' }
  ];

  return (
    <div style={{
      width: '280px',
      background: '#1e293b',
      color: 'white',
      borderRight: '1px solid #334155',
      padding: '16px',
      height: '100%'
    }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>📂 Couches</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {layers.map(layer => (
          <div key={layer.id} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
            background: selectedLayers.includes(layer.id) ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
            borderRadius: '6px',
            cursor: 'pointer',
            border: selectedLayers.includes(layer.id) ? '1px solid #3b82f6' : '1px solid transparent'
          }}
          onClick={() => setSelectedLayers([layer.id])}
          >
            <input
              type="checkbox"
              checked={activeLayers[layer.id] || false}
              onChange={() => toggleLayer(layer.id)}
              style={{ marginRight: '10px' }}
            />
            
            <div style={{
              width: '16px',
              height: '16px',
              background: layer.type === 'point' ? '#ef4444' : 
                         layer.type === 'line' ? '#3b82f6' : 
                         layer.type === 'polygon' ? '#10b981' : '#6b7280',
              borderRadius: layer.type === 'point' ? '50%' : '4px',
              marginRight: '10px'
            }} />
            
            <span style={{ flex: 1, fontSize: '14px' }}>{layer.name}</span>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '12px', opacity: 0.7 }}>
        {Object.values(activeLayers).filter(v => v).length} couches visibles
      </div>
    </div>
  );
};

export default LayersPanel;