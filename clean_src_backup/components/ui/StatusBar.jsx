import React from 'react';

const StatusBar = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      background: '#2c3e50',
      color: 'white',
      padding: '0 20px',
      height: '40px',
      fontSize: '0.9rem',
      borderTop: '1px solid #34495e'
    }}>
      <div style={{ display: 'flex', gap: '30px' }}>
        <div>
          <span style={{ opacity: 0.7 }}>Coordonnées: </span>
          <span>48.8566° N, 2.3522° E</span>
        </div>
        <div>
          <span style={{ opacity: 0.7 }}>Échelle: </span>
          <span>1:10,000</span>
        </div>
        <div>
          <span style={{ opacity: 0.7 }}>Projection: </span>
          <span>WGS84</span>
        </div>
      </div>
      
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px' }}>
        <span>3 couches actives</span>
        <span style={{ color: '#4dabf7' }}> Connecté</span>
      </div>
    </div>
  );
};

export default StatusBar;
