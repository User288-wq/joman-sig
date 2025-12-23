import React, { useState } from 'react';
import './MapContainer.css';

const MapContainer = ({ children, activeTab = '2d' }) => {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const tabs = [
    { id: '2d', label: '2D', icon: '' },
    { id: '3d', label: '3D', icon: '' },
    { id: 'compare', label: 'Comparer', icon: '' },
    { id: 'print', label: 'Exporter', icon: '' }
  ];

  return (
    <div className="map-container">
      <div className="map-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`map-tab ${currentTab === tab.id ? 'active' : ''}`}
            onClick={() => setCurrentTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
      
      <div className="map-content">
        {children && children[currentTab]}
        
        {!children && (
          <div className="map-placeholder">
            SÃƒÆ’Ã‚Â©lectionnez un mode de visualisation
          </div>
        )}
      </div>
      
      <div className="map-footer">
        <div className="map-info">
          <span className="info-item">Projection: WGS84</span>
          <span className="info-item">UnitÃƒÆ’Ã‚Â©s: mÃƒÆ’Ã‚Â¨tres</span>
          <span className="info-item">PrÃƒÆ’Ã‚Â©cision: 1:1000</span>
        </div>
      </div>
    </div>
  );
};

export default MapContainer;
