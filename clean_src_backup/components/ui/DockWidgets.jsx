import React, { useState } from 'react';

const DockWidgets = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const widgets = [
    { id: 'layers', title: 'Couches', icon: '', content: 'Gestion des couches' },
    { id: 'legend', title: 'Légende', icon: '', content: 'Légende de la carte' },
    { id: 'attributes', title: 'Attributs', icon: '', content: 'Données attributaires' }
  ];
  
  return (
    <div style={{
      position: 'absolute',
      top: '100px',
      right: '20px',
      width: isCollapsed ? '50px' : '300px',
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      transition: 'width 0.3s ease',
      zIndex: 1000
    }}>
      <div style={{
        padding: '15px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {!isCollapsed && <h4 style={{ margin: 0 }}>Widgets</h4>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
        >
          {isCollapsed ? '' : ''}
        </button>
      </div>
      
      {!isCollapsed && (
        <div style={{ padding: '15px' }}>
          {widgets.map(widget => (
            <div key={widget.id} style={{
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #eee',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '1.2rem' }}>{widget.icon}</span>
              <div>
                <div style={{ fontWeight: 'bold' }}>{widget.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>{widget.content}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DockWidgets;
