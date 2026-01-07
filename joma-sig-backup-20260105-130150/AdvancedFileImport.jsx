// AdvancedFileImport.jsx
import React, { useState } from 'react';
import { VectorLayer, VectorSource } from 'ol';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import FILE_HANDLERS from './FileImportManager';

const AdvancedFileImport = ({ map, onLayerAdded }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importHistory, setImportHistory] = useState([]);

  // Liste des formats supportés
  const SUPPORTED_FORMATS = [
    { name: 'GeoJSON', extensions: ['.geojson', '.json'] },
    { name: 'Shapefile (ZIP)', extensions: ['.zip'] },
    { name: 'KML', extensions: ['.kml'] },
    { name: 'GPX', extensions: ['.gpx'] },
    { name: 'CSV', extensions: ['.csv'] },
    { name: 'WKT', extensions: ['.wkt', '.txt'] },
    { name: 'GML', extensions: ['.gml'] },
    { name: 'DXF', extensions: ['.dxf'] },
    { name: 'TopoJSON', extensions: ['.topojson'] },
    { name: 'GeoTIFF', extensions: ['.tif', '.tiff'] },
    { name: 'Images géoréférencées', extensions: ['.jpg', '.jpeg', '.png'] }
  ];

  // Fonction d'import principale
  const handleFileImport = async (event) => {
    const files = event.target.files;
    if (!files.length || !map) return;
    
    setIsImporting(true);
    const results = [];
    
    for (const file of files) {
      try {
        const result = await processSingleFile(file);
        results.push(result);
      } catch (error) {
        console.error(`❌ Erreur sur ${file.name}:`, error);
        results.push({
          file: file.name,
          success: false,
          error: error.message
        });
      }
    }
    
    setImportHistory(prev => [...prev, ...results]);
    setIsImporting(false);
    
    // Afficher le récapitulatif
    const successCount = results.filter(r => r.success).length;
    alert(`✅ Import terminé : ${successCount}/${files.length} fichiers importés`);
  };

  // Traitement d'un seul fichier
  const processSingleFile = async (file) => {
    const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] || '';
    const handler = findHandler(extension, file);
    
    if (!handler) {
      throw new Error(`Format non supporté: ${extension}`);
    }
    
    // Lire et convertir les données
    const features = await handler(file);
    
    // Créer la couche
    const source = new VectorSource({ features });
    const layer = new VectorLayer({
      source,
      name: file.name.replace(extension, ''),
      type: 'imported',
      visible: true,
      style: getStyleForExtension(extension)
    });
    
    // Ajouter à la carte
    map.addLayer(layer);
    
    // Ajuster la vue si c'est la première couche
    const extent = source.getExtent();
    if (extent[0] !== Infinity) {
      map.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        maxZoom: 15,
        duration: 1000
      });
    }
    
    // Notifier le parent
    if (onLayerAdded) {
      onLayerAdded({
        id: `layer-${Date.now()}`,
        name: file.name.replace(extension, ''),
        type: 'vector',
        format: extension.replace('.', '').toUpperCase(),
        featureCount: features.length,
        fileSize: file.size,
        visible: true
      });
    }
    
    return {
      file: file.name,
      success: true,
      featureCount: features.length,
      extension
    };
  };

  // Trouver le bon handler
  const findHandler = (extension, file) => {
    // Pour les ZIP, vérifier si c'est un shapefile
    if (extension === '.zip') {
      return FILE_HANDLERS['.shp'];
    }
    
    // Pour les autres extensions
    return FILE_HANDLERS[extension] || null;
  };

  // Style selon le format
  const getStyleForExtension = (extension) => {
    const styles = {
      '.geojson': new Style({
        fill: new Fill({ color: 'rgba(59, 130, 246, 0.3)' }),
        stroke: new Stroke({ color: '#3b82f6', width: 2 })
      }),
      '.kml': new Style({
        fill: new Fill({ color: 'rgba(239, 68, 68, 0.3)' }),
        stroke: new Stroke({ color: '#ef4444', width: 2 })
      }),
      '.gpx': new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: '#10b981' }),
          stroke: new Stroke({ color: '#fff', width: 2 })
        })
      }),
      '.csv': new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: '#8b5cf6' }),
          stroke: new Stroke({ color: '#fff', width: 1 })
        })
      })
    };
    
    return styles[extension] || new Style({
      fill: new Fill({ color: 'rgba(156, 163, 175, 0.3)' }),
      stroke: new Stroke({ color: '#9ca3af', width: 1 })
    });
  };

  return (
    <div className="file-import-container">
      <div className="formats-list">
        <h4>📁 Formats supportés</h4>
        <div className="formats-grid">
          {SUPPORTED_FORMATS.map(format => (
            <div key={format.name} className="format-item">
              <div className="format-name">{format.name}</div>
              <div className="format-extensions">
                {format.extensions.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="import-section">
        <label className="file-input-label">
          <input
            type="file"
            multiple
            accept={SUPPORTED_FORMATS.flatMap(f => f.extensions).join(',')}
            onChange={handleFileImport}
            style={{ display: 'none' }}
          />
          <div className="import-button">
            📥 Importer fichiers SIG
            <div className="subtext">Glissez-déposez ou cliquez pour sélectionner</div>
          </div>
        </label>
        
        {isImporting && (
          <div className="importing-overlay">
            <div className="spinner"></div>
            <div>Import en cours...</div>
          </div>
        )}
      </div>
      
      {importHistory.length > 0 && (
        <div className="import-history">
          <h4>📋 Historique d'import</h4>
          <div className="history-list">
            {importHistory.map((item, index) => (
              <div key={index} className={`history-item ${item.success ? 'success' : 'error'}`}>
                <div className="file-name">{item.file}</div>
                <div className="file-status">
                  {item.success ? (
                    <span className="success-text">
                      ✅ {item.featureCount} entités
                    </span>
                  ) : (
                    <span className="error-text">
                      ❌ {item.error}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFileImport;