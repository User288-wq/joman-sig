import React from 'react';
import './LoadingOverlay.css';

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay" style={{ display: 'none' }}>
      <div className="loading-spinner"></div>
      <div className="loading-text">Chargement...</div>
    </div>
  );
};

export default LoadingOverlay;
