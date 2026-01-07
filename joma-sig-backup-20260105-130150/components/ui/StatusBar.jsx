import React from 'react';
import './StatusBar.css';

const StatusBar = ({ coordinates = null, scale = null, projection = 'EPSG:3857' }) => {
  const formatCoords = (coords) => {
    if (!coords) return 'N/A';
    return `${coords[0].toFixed(2)}, ${coords[1].toFixed(2)}`;
  };

  return (
    <div className="status-bar">
      <div className="status-item">
        <span className="status-label">CoordonnÃƒÆ’Ã‚Â©es:</span>
        <span className="status-value">{formatCoords(coordinates)}</span>
      </div>
      <div className="status-item">
        <span className="status-label">ÃƒÆ’Ã¢â‚¬Â°chelle:</span>
        <span className="status-value">{scale ? `1:${scale}` : 'N/A'}</span>
      </div>
      <div className="status-item">
        <span className="status-label">Projection:</span>
        <span className="status-value">{projection}</span>
      </div>
      <div className="status-item">
        <span className="status-label">Couches actives:</span>
        <span className="status-value">3</span>
      </div>
      <div className="status-actions">
        <button className="btn-coords"></button>
        <button className="btn-projection"></button>
      </div>
    </div>
  );
};

export default StatusBar;
