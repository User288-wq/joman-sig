import React from 'react';
import './Map3D.css';

const Map3D = () => {
  return (
    <div className="map-3d-container">
      <div className="map-3d-placeholder">
        <div className="placeholder-content">
          <div className="placeholder-icon">ÃƒÂ°Ã…Â¸Ã…â€™Ã‚Â</div>
          <div className="placeholder-title">Carte 3D</div>
          <div className="placeholder-desc">
            IntÃƒÆ’Ã‚Â©gration CesiumJS ou Mapbox GL JS
          </div>
          <div className="placeholder-features">
            <span className="feature"> Vue 3D terrain</span>
            <span className="feature"> ModÃƒÆ’Ã‚Â¨les 3D</span>
            <span className="feature"> Navigation libre</span>
          </div>
        </div>
      </div>
      <div className="map-3d-controls">
        <button className="control-btn">Tilt</button>
        <button className="control-btn">Rotation</button>
        <button className="control-btn">Altitude</button>
      </div>
    </div>
  );
};

export default Map3D;
