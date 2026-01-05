import React from 'react';

const ProfessionalToolbar = ({ mapInstance, onToolSelect, activeTool, onMapViewModeChange, mapViewMode }) => {
  const tools = [
    { id: 'pan', label: 'Déplacer', icon: '👆' },
    { id: 'zoom-in', label: 'Zoom +', icon: '➕' },
    { id: 'zoom-out', label: 'Zoom -', icon: '➖' },
    { id: 'select', label: 'Sélection', icon: '🎯' },
    { id: 'measure', label: 'Mesure', icon: '📏' }
  ];

  const viewModes = [
    { id: '2D', label: '2D', icon: '🗺️' },
    { id: '3D', label: '3D', icon: '🌍' }
  ];

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'rgba(30, 41, 59, 0.9)',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #475569',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      {/* Outils */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {tools.map(tool => (
          <button
            key={tool.id}
            style={{
              width: '40px',
              height: '40px',
              background: activeTool === tool.id ? '#3b82f6' : '#334155',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              transition: 'all 0.2s'
            }}
            onClick={() => onToolSelect(tool.id)}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>
      
      {/* Séparateur */}
      <div style={{ height: '1px', background: '#475569', margin: '8px 0' }} />
      
      {/* Modes de vue */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {viewModes.map(mode => (
          <button
            key={mode.id}
            style={{
              width: '40px',
              height: '40px',
              background: mapViewMode === mode.id ? '#10b981' : '#334155',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}
            onClick={() => onMapViewModeChange(mode.id)}
            title={mode.label}
          >
            {mode.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalToolbar;