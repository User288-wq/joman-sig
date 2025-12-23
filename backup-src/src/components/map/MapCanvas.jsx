import React from 'react';
import './MapCanvas.css';

const MapCanvas = ({ children, onCanvasClick }) => {
  const handleCanvasClick = (e) => {
    if (onCanvasClick) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onCanvasClick({ x, y });
    }
  };

  return (
    <div className="map-canvas" onClick={handleCanvasClick}>
      {children}
      <div className="canvas-grid"></div>
      <div className="canvas-overlay">
        <div className="overlay-tools">
          <div className="tool-cursor"></div>
          <div className="tool-measure"></div>
          <div className="tool-draw"></div>
        </div>
      </div>
    </div>
  );
};

export default MapCanvas;
