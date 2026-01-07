// ProjectionSelector.jsx
import React, { useState, useEffect } from 'react';
import { PROJECTIONS_CATALOG, getProjectionsByRegion } from './projections';

const ProjectionSelector = ({ 
  currentProjection, 
  onProjectionChange,
  showAdvanced = false 
}) => {
  const [region, setRegion] = useState('all');
  const [customCode, setCustomCode] = useState('');
  const [availableProjections, setAvailableProjections] = useState(
    Object.values(PROJECTIONS_CATALOG)
  );

  // Filtrer par région
  useEffect(() => {
    setAvailableProjections(getProjectionsByRegion(region));
  }, [region]);

  // Régions disponibles
  const REGIONS = [
    { id: 'all', name: '🌍 Toutes les régions' },
    { id: 'france', name: '🇫🇷 France' },
    { id: 'europe', name: '🇪🇺 Europe' },
    { id: 'north america', name: '🇺🇸 Amérique du Nord' },
    { id: 'world', name: '🌐 Monde' }
  ];

  // Formater la distance selon les unités
  const formatUnits = (units) => {
    const map = {
      'degrees': 'degrés',
      'meters': 'mètres',
      'feet': 'pieds'
    };
    return map[units] || units;
  };

  return (
    <div className="projection-selector">
      <div className="selector-header">
        <h3>🗺️ Système de coordonnées</h3>
        <div className="current-projection">
          <span className="current-label">Projection actuelle:</span>
          <span className="current-code">{currentProjection}</span>
          <span className="current-name">
            {PROJECTIONS_CATALOG[currentProjection]?.name || 'Inconnue'}
          </span>
        </div>
      </div>

      {/* Filtre par région */}
      <div className="region-filter">
        <label>Filtrer par région:</label>
        <div className="region-buttons">
          {REGIONS.map(reg => (
            <button
              key={reg.id}
              className={`region-btn ${region === reg.id ? 'active' : ''}`}
              onClick={() => setRegion(reg.id)}
            >
              {reg.name}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des projections */}
      <div className="projections-list">
        {availableProjections.map(proj => (
          <div
            key={proj.code}
            className={`projection-item ${
              currentProjection === proj.code ? 'selected' : ''
            }`}
            onClick={() => onProjectionChange(proj.code)}
          >
            <div className="projection-main">
              <div className="projection-code">{proj.code}</div>
              <div className="projection-name">{proj.name}</div>
            </div>
            <div className="projection-details">
              <span className="projection-area">{proj.area}</span>
              <span className="projection-units">
                {formatUnits(proj.units)}
              </span>
              <span className={`projection-accuracy ${proj.accuracy.toLowerCase()}`}>
                {proj.accuracy}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Entrée personnalisée */}
      {showAdvanced && (
        <div className="custom-projection">
          <label>Code EPSG personnalisé:</label>
          <div className="custom-input">
            <input
              type="text"
              placeholder="Ex: EPSG:32631"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
            />
            <button
              onClick={() => {
                if (customCode && customCode.startsWith('EPSG:')) {
                  onProjectionChange(customCode);
                }
              }}
              disabled={!customCode.startsWith('EPSG:')}
            >
              Appliquer
            </button>
          </div>
          <div className="custom-hint">
            Les codes EPSG doivent commencer par "EPSG:"
          </div>
        </div>
      )}

      {/* Information détaillée */}
      {currentProjection in PROJECTIONS_CATALOG && (
        <div className="projection-info">
          <h4>📋 Informations détaillées</h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Code:</span>
              <span className="info-value">{currentProjection}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Nom:</span>
              <span className="info-value">
                {PROJECTIONS_CATALOG[currentProjection].name}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Zone:</span>
              <span className="info-value">
                {PROJECTIONS_CATALOG[currentProjection].area}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Unités:</span>
              <span className="info-value">
                {formatUnits(PROJECTIONS_CATALOG[currentProjection].units)}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Type:</span>
              <span className="info-value">
                {PROJECTIONS_CATALOG[currentProjection].type}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Précision:</span>
              <span className={`info-value accuracy ${PROJECTIONS_CATALOG[currentProjection].accuracy.toLowerCase()}`}>
                {PROJECTIONS_CATALOG[currentProjection].accuracy}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectionSelector;