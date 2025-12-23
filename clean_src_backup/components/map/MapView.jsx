import React, { useState } from 'react';
import Map2D from './Map2D';
import Globe3D from './Globe3D';

const MapView = ({ activeLayers, onMapLoad, viewMode }) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative'
    }}>
      {viewMode === '3D' ? (
        <Globe3D />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}></div>
            <h3>Carte 2D</h3>
            <p>Mode {viewMode} activé</p>
            <div style={{ marginTop: '20px' }}>
              <p>Couches actives:</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                {Object.entries(activeLayers)
                  .filter(([_, isActive]) => isActive)
                  .map(([layer]) => (
                    <span key={layer} style={{
                      padding: '5px 10px',
                      background: '#4dabf7',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '0.8rem'
                    }}>
                      {layer}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
