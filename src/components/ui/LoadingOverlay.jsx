import React from 'react';
import './LoadingOverlay.css';

const LoadingOverlay = ({ isLoading, message = 'Chargement...' }) => {
  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <div className="loading-message">{message}</div>
        <div className="loading-progress">
          <div className="progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
