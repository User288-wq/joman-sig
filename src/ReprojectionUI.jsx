// ReprojectionUI.jsx
import React, { useState, useEffect } from 'react';
import ProjectionAwareImporter from './ProjectionAwareImporter';
import ProjectionSelector from './ProjectionSelector';

const ReprojectionUI = ({ file, onReprojected }) => {
  const [detectedProjection, setDetectedProjection] = useState('EPSG:4326');
  const [targetProjection, setTargetProjection] = useState('EPSG:3857');
  const [isDetecting, setIsDetecting] = useState(false);
  const [isReprojecting, setIsReprojecting] = useState(false);
  const [detectedWithConfidence, setDetectedWithConfidence] = useState('medium');
  const [fileInfo, setFileInfo] = useState(null);

  const importer = new ProjectionAwareImporter(targetProjection);

  // Détecter la projection au chargement
  useEffect(() => {
    if (file) {
      detectProjection();
    }
  }, [file]);

  const detectProjection = async () => {
    setIsDetecting(true);
    try {
      const projection = await importer.detectFileProjection(
        file, 
        file.name.match(/\.[^.]+$/)?.[0] || ''
      );
      
      setDetectedProjection(projection);
      
      // Évaluer la confiance
      const filename = file.name.toLowerCase();
      let confidence = 'low';
      
      if (filename.includes('.prj')) {
        confidence = 'high';
      } else if (filename.includes('lambert93') || filename.includes('wgs84')) {
        confidence = 'high';
      } else if (file.name.endsWith('.geojson') || file.name.endsWith('.kml')) {
        confidence = 'medium';
      }
      
      setDetectedWithConfidence(confidence);
      
    } catch (error) {
      console.error('❌ Erreur détection projection:', error);
      setDetectedProjection('EPSG:4326');
      setDetectedWithConfidence('low');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleReproject = async () => {
    if (!file || detectedProjection === targetProjection) {
      alert('Aucun changement de projection nécessaire');
      return;
    }

    setIsReprojecting(true);
    try {
      const result = await importer.readFileWithProjection(
        file, 
        detectedProjection
      );

      setFileInfo(result.metadata);
      
      if (onReprojected) {
        onReprojected(result.features, result.metadata);
      }

      alert(`✅ Données reprojetées de ${detectedProjection} à ${targetProjection}`);

    } catch (error) {
      console.error('❌ Erreur reprojection:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setIsReprojecting(false);
    }
  };

  const handleManualProjection = (projCode) => {
    setDetectedProjection(projCode);
    setDetectedWithConfidence('manual');
  };

  const confidenceColor = {
    high: '#10b981',
    medium: '#f59e0b',
    low: '#ef4444',
    manual: '#3b82f6'
  };

  const confidenceText = {
    high: 'Élevée',
    medium: 'Moyenne',
    low: 'Faible',
    manual: 'Manuelle'
  };

  return (
    <div className="reprojection-ui">
      <div className="reprojection-header">
        <h3>🔄 Reprojection de données</h3>
        <div className="file-info">
          {file && (
            <div className="file-details">
              <span className="filename">{file.name}</span>
              <span className="filesize">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="projection-sections">
        {/* Section source */}
        <div className="projection-section source">
          <h4>Source</h4>
          <div className="detection-status">
            {isDetecting ? (
              <div className="detecting">
                <div className="spinner small"></div>
                <span>Détection en cours...</span>
              </div>
            ) : (
              <div className="detected">
                <span className="detected-label">Projection détectée:</span>
                <div className="detected-info">
                  <span className="proj-code">{detectedProjection}</span>
                  <span 
                    className="confidence-badge"
                    style={{ 
                      backgroundColor: confidenceColor[detectedWithConfidence],
                      color: 'white'
                    }}
                  >
                    {confidenceText[detectedWithConfidence]}
                  </span>
                </div>
                <button 
                  className="btn-small"
                  onClick={detectProjection}
                >
                  Redétecter
                </button>
              </div>
            )}
          </div>

          <div className="manual-override">
            <label>Forcer une projection:</label>
            <ProjectionSelector
              currentProjection={detectedProjection}
              onProjectionChange={handleManualProjection}
              showAdvanced={false}
            />
          </div>
        </div>

        {/* Flèche de conversion */}
        <div className="conversion-arrow">
          <div className="arrow-icon">➡️</div>
          <div className="arrow-text">Vers</div>
        </div>

        {/* Section cible */}
        <div className="projection-section target">
          <h4>Cible (carte)</h4>
          <ProjectionSelector
            currentProjection={targetProjection}
            onProjectionChange={setTargetProjection}
            showAdvanced={true}
          />
        </div>
      </div>

      {/* Bouton d'action */}
      <div className="reprojection-actions">
        <button
          className={`btn-primary ${isReprojecting ? 'loading' : ''}`}
          onClick={handleReproject}
          disabled={isReprojecting || detectedProjection === targetProjection}
        >
          {isReprojecting ? (
            <>
              <div className="spinner white"></div>
              <span>Reprojection en cours...</span>
            </>
          ) : (
            <>
              <span>🔄 Reprojecter les données</span>
              <span className="action-subtext">
                {detectedProjection} → {targetProjection}
              </span>
            </>
          )}
        </button>

        {detectedProjection === targetProjection && (
          <div className="no-change-needed">
            ✅ Les données sont déjà dans la bonne projection
          </div>
        )}
      </div>

      {/* Informations techniques */}
      {fileInfo && (
        <div className="technical-info">
          <h4>📊 Informations techniques</h4>
          <div className="info-grid">
            <div className="info-item">
              <span>Projection source:</span>
              <strong>{fileInfo.sourceProjection}</strong>
            </div>
            <div className="info-item">
              <span>Projection cible:</span>
              <strong>{fileInfo.targetProjection}</strong>
            </div>
            <div className="info-item">
              <span>Nombre d'entités:</span>
              <strong>{fileInfo.featureCount}</strong>
            </div>
            <div className="info-item">
              <span>Taille fichier:</span>
              <strong>{(fileInfo.fileSize / 1024).toFixed(2)} KB</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReprojectionUI;