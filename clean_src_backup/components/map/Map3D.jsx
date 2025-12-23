import React from 'react';

const Map3D = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}></div>
        <h2 style={{ margin: '0 0 10px 0' }}>Carte 3D</h2>
        <p>Visualisation 3D avec terrain</p>
        <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            Tilt
          </button>
          <button style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            Rotation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Map3D;
