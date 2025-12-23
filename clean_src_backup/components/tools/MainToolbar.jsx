import React, { useState } from 'react';

const MainToolbar = ({ mapRef, onWidgetSelect, activeWidget, viewMode, onViewModeChange }) => {
  const [activeTool, setActiveTool] = useState('pan');
  
  const tools = [
    { id: 'pan', icon: '', label: 'Navigation' },
    { id: 'zoom-in', icon: '', label: 'Zoom +' },
    { id: 'zoom-out', icon: '', label: 'Zoom -' },
    { id: 'measure', icon: '', label: 'Mesurer' },
    { id: 'draw', icon: '', label: 'Dessiner' },
    { id: 'select', icon: '', label: 'Sélectionner' }
  ];
  
  const widgets = [
    { id: 'measure', icon: '', label: 'Mesures' },
    { id: 'import', icon: '', label: 'Importer' },
    { id: 'table', icon: '', label: 'Table' }
  ];
  
  const viewModes = [
    { id: '2D', icon: '', label: '2D' },
    { id: '3D', icon: '', label: '3D' },
    { id: 'canvas', icon: '', label: 'Canvas' }
  ];

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      background: 'white',
      borderRadius: '10px',
      padding: '15px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    }}>
      {/* Outils de navigation */}
      <div>
        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px' }}>
          Navigation
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              style={{
                padding: '10px',
                border: `2px solid ${activeTool === tool.id ? '#4dabf7' : '#e0e0e0'}`,
                background: activeTool === tool.id ? '#e8f4fd' : 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45px',
                height: '45px'
              }}
              title={tool.label}
            >
              {tool.icon}
            </button>
          ))}
        </div>
      </div>
      
      {/* Widgets */}
      <div>
        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px' }}>
          Widgets
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {widgets.map(widget => (
            <button
              key={widget.id}
              onClick={() => onWidgetSelect(widget.id === activeWidget ? null : widget.id)}
              style={{
                padding: '10px',
                border: `2px solid ${activeWidget === widget.id ? '#4dabf7' : '#e0e0e0'}`,
                background: activeWidget === widget.id ? '#e8f4fd' : 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45px',
                height: '45px'
              }}
              title={widget.label}
            >
              {widget.icon}
            </button>
          ))}
        </div>
      </div>
      
      {/* Mode de vue */}
      <div>
        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px' }}>
          Mode de vue
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {viewModes.map(mode => (
            <button
              key={mode.id}
              onClick={() => onViewModeChange(mode.id)}
              style={{
                padding: '8px 12px',
                border: `2px solid ${viewMode === mode.id ? '#4dabf7' : '#e0e0e0'}`,
                background: viewMode === mode.id ? '#e8f4fd' : 'white',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainToolbar;
