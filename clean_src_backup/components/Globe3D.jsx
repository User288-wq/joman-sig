import React from 'react';

const Globe3D = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #000033 0%, #000066 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      position: 'relative'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px'
      }}>
        <div style={{
          fontSize: '5rem',
          marginBottom: '20px'
        }}>
          
        </div>
        <h2 style={{ margin: '0 0 10px 0' }}>Visualisation 3D</h2>
        <p style={{ opacity: 0.8, marginBottom: '30px' }}>
          Mode globe terrestre activé
        </p>
        
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <button style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
             Rotation
          </button>
          <button style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
             Satellite
          </button>
          <button style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
             Nuit/Jour
          </button>
        </div>
        
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          background: 'rgba(0,0,0,0.5)',
          padding: '15px',
          borderRadius: '8px',
          fontSize: '0.9rem'
        }}>
          <p style={{ margin: '0 0 10px 0' }}><strong>Instructions:</strong></p>
          <ul style={{ margin: 0, paddingLeft: '20px', opacity: 0.8 }}>
            <li>Rotation: clic gauche + glisser</li>
            <li>Zoom: molette de la souris</li>
            <li>Panoramique: clic droit + glisser</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Globe3D;
