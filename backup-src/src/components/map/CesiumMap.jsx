import React from 'react';

const CesiumMap = ({ onMapLoad }) => {
  React.useEffect(() => {
    if (onMapLoad) {
      onMapLoad({ type: '3D', status: 'ready' });
    }
  }, [onMapLoad]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      color: 'white',
      fontSize: '24px',
      textAlign: 'center'
    }}>
      <div>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}></div>
        <div>Vue 3D Cesium</div>
        <div style={{ fontSize: '14px', marginTop: '10px', opacity: 0.8 }}>
          (Ãƒâ‚¬ implÃƒÂ©menter avec CesiumJS)
        </div>
      </div>
    </div>
  );
};

export default CesiumMap;
