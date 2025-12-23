import React, { useState, useEffect } from 'react';
import Map2D from './Map2D';
import Map3D from './Map3D';
import './MapView.css';

const MapView = ({ defaultView = '2d' }) => {
  const [viewMode, setViewMode] = useState(defaultView);
  const [mapCenter, setMapCenter] = useState([2.2137, 46.2276]);
  const [mapZoom, setMapZoom] = useState(5);

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  const handleZoomIn = () => {
    setMapZoom(prev => prev + 1);
  };

  const handleZoomOut = () => {
    setMapZoom(prev => prev - 1);
  };

  return (
    <div className="map-view">
      <div className="view-controls">
        <div className="view-selector">
          <button 
            className={`view-btn ${viewMode === '2d' ? 'active' : ''}`}
            onClick={() => handleViewChange('2d')}
          >
            <span className="btn-icon"></span>
            <span className="btn-text">2D</span>
          </button>
          <button 
            className={`view-btn ${viewMode === '3d' ? 'active' : ''}`}
            onClick={() => handleViewChange('3d')}
          >
            <span className="btn-icon"></span>
            <span className="btn-text">3D</span>
          </button>
        </div>
        
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={handleZoomIn}>+</button>
          <div className="zoom-level">Zoom: {mapZoom}</div>
          <button className="zoom-btn" onClick={handleZoomOut}>-</button>
        </div>
        
        <div className="coord-display">
          Lat: {mapCenter[1].toFixed(4)}Ãƒâ€šÃ‚Â°, Lon: {mapCenter[0].toFixed(4)}Ãƒâ€šÃ‚Â°
        </div>
      </div>
      
      <div className="view-content">
        {viewMode === '2d' ? (
          <Map2D center={mapCenter} zoom={mapZoom} />
        ) : (
          <Map3D />
        )}
      </div>
    </div>
  );
};

export default MapView;
