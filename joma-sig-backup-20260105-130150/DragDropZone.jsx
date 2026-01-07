// DragDropZone.jsx
import React, { useCallback } from 'react';

const DragDropZone = ({ onFilesDropped }) => {
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && onFilesDropped) {
      onFilesDropped(files);
    }
  }, [onFilesDropped]);

  return (
    <div
      className="drag-drop-zone"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="drag-drop-content">
        <div className="drag-icon">📁</div>
        <div className="drag-text">Glissez vos fichiers SIG ici</div>
        <div className="drag-subtext">GeoJSON, Shapefile, KML, GPX, CSV, etc.</div>
      </div>
    </div>
  );
};