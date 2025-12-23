import React from 'react';

const Map2D = ({ center = [2.2137, 46.2276], zoom = 5 }) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#006064',
      position: 'relative'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🗺️</div>
        <h2 style={{ margin: '0 0 10px 0' }}>Carte OpenLayers 2D</h2>
        <p style={{ marginBottom: '5px' }}>Centre: {center[0].toFixed(4)}°, {center[1].toFixed(4)}°</p>
        <p style={{ marginBottom: '20px' }}>Zoom: {zoom}</p>
        
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <button style={{
            padding: '10px',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            +
          </button>
          <button style={{
            padding: '10px',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            -
          </button>
          <button style={{
            padding: '10px',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            
          </button>
        </div>
        
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          background: 'rgba(255,255,255,0.9)',
          padding: '10px 15px',
          borderRadius: '6px',
          fontSize: '0.9rem'
        }}>
          <p style={{ margin: 0 }}>OpenLayers 10.7.0 + ol-ext 4.0.37</p>
        </div>
      </div>
    </div>
  );
};

export default Map2D;
