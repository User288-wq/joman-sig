import React, { useState, useRef } from 'react';
import './GeoJSONImporter.css';

const GeoJSONImporter = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [importMethod, setImportMethod] = useState('file');
  const [url, setUrl] = useState('');
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

  const handleFiles = (files) => {
    files.forEach(file => {
      console.log('Fichier sélectionné:', file.name);
      alert(`Fichier ${file.name} prêt pour l'import`);
    });
  };

  const handleUrlImport = () => {
    if (!url.trim()) {
      alert('Veuillez entrer une URL');
      return;
    }
    console.log('Import depuis URL:', url);
    alert(`Import depuis: ${url}`);
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
              Glissez-déposez vos fichiers GeoJSON ici<br />
              ou cliquez pour parcourir
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".geojson,.json"
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
            <button onClick={handleUrlImport} className="btn-fetch">
               Importer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeoJSONImporter;
