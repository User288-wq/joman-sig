import React from 'react';

const MapCanvas = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#333',
      position: 'relative'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}></div>
        <h2 style={{ margin: '0 0 10px 0' }}>Mode Dessin</h2>
        <p>Dessinez directement sur la carte</p>
        
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <button style={{
            padding: '10px',
            background: '#4dabf7',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
             Dessiner
          </button>
          <button style={{
            padding: '10px',
            background: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
             Effacer
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapCanvas;
