import React, { useState, useRef } from 'react';
import { useLayers } from '../../contexts/LayerContext';
import './GeoJSONImporter.css';

const GeoJSONImporter = () => {
  const { addLayer } = useLayers();
  const [isDragging, setIsDragging] = useState(false);
  const [importedFiles, setImportedFiles] = useState([]);
  const [importMethod, setImportMethod] = useState('file');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    setIsLoading(true);
    
    for (const file of files) {
      try {
        const text = await file.text();
        const geojson = JSON.parse(text);
        
        const newLayer = {
          name: file.name.replace(/\.[^/.]+$/, ""),
          type: 'vector',
          source: 'geojson',
          data: geojson,
          fileSize: formatFileSize(file.size),
          importDate: new Date().toLocaleString()
        };

        addLayer(newLayer);
        setImportedFiles(prev => [...prev, newLayer]);
        
      } catch (error) {
        console.error('Erreur lors de l\'import du fichier:', error);
        alert(`Erreur avec ${file.name}: ${error.message}`);
      }
    }
    
    setIsLoading(false);
  };

  const handleUrlImport = async () => {
    if (!url.trim()) {
      alert('Veuillez entrer une URL');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('ÃƒÆ’Ã¢â‚¬Â°chec du tÃƒÆ’Ã‚Â©lÃƒÆ’Ã‚Â©chargement');
      
      const geojson = await response.json();
      
      const newLayer = {
        name: `Import_${Date.now()}`,
        type: 'vector',
        source: 'url',
        data: geojson,
        url: url,
        importDate: new Date().toLocaleString()
      };

      addLayer(newLayer);
      setImportedFiles(prev => [...prev, newLayer]);
      setUrl('');
      
    } catch (error) {
      console.error('Erreur lors de l\'import URL:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (index) => {
    setImportedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="geojson-importer">
      <div className="importer-header">
        <h3> Importer GeoJSON</h3>
        <div className="import-methods">
          <button 
            className={`method-btn ${importMethod === 'file' ? 'active' : ''}`}
            onClick={() => setImportMethod('file')}
          >
             Fichier
          </button>
          <button 
            className={`method-btn ${importMethod === 'url' ? 'active' : ''}`}
            onClick={() => setImportMethod('url')}
          >
             URL
          </button>
        </div>
      </div>

      {importMethod === 'file' ? (
        <div 
          className={`drop-zone ${isDragging ? 'dragging' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <div className="drop-content">
            <div className="drop-icon"></div>
            <p className="drop-text">
              Glissez-dÃƒÆ’Ã‚Â©posez vos fichiers GeoJSON ici<br />
              ou cliquez pour parcourir
            </p>
            <p className="drop-hint">Formats supportÃƒÆ’Ã‚Â©s: .geojson, .json</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".geojson,.json"
            multiple
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div className="url-import">
          <div className="url-input-group">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/data.geojson"
              className="url-input"
            />
            <button 
              onClick={handleUrlImport}
              disabled={isLoading || !url.trim()}
              className="btn-fetch"
            >
              {isLoading ? '' : ''}
            </button>
          </div>
          <p className="url-hint">
            Entrez l'URL d'un fichier GeoJSON directement accessible
          </p>
        </div>
      )}

      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <span>Import en cours...</span>
        </div>
      )}

      {importedFiles.length > 0 && (
        <div className="imported-files">
          <h4>Fichiers importÃƒÆ’Ã‚Â©s ({importedFiles.length})</h4>
          <div className="files-list">
            {importedFiles.map((file, index) => (
              <div key={index} className="file-item">
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-details">
                    {file.source === 'file' ? ` ${file.fileSize}` : ' URL'}
                  </span>
                </div>
                <div className="file-actions">
                  <button className="btn-preview" title="PrÃƒÆ’Ã‚Â©visualiser"></button>
                  <button 
                    className="btn-remove" 
                    onClick={() => removeFile(index)}
                    title="Supprimer"
                  >
                    
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="importer-actions">
        <button className="btn-clear-all" onClick={() => setImportedFiles([])}>
           Tout effacer
        </button>
        <button className="btn-export-list">
           Exporter la liste
        </button>
      </div>

      <div className="import-info">
        <p><strong> Astuces:</strong></p>
        <ul>
          <li>Les fichiers GeoJSON doivent ÃƒÆ’Ã‚Âªtre valides</li>
          <li>Limite de taille: 10MB par fichier</li>
          <li>Support des projections WGS84 (EPSG:4326)</li>
        </ul>
      </div>
    </div>
  );
};

export default GeoJSONImporter;
