import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMap } from "../../contexts/MapContext";

const GeoJSONImporter = () => {
  const { addLayer } = useMap();
  const [importedData, setImportedData] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setError(null);
    const file = acceptedFiles[0];
    
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        
        // Pour l'instant, simuler l'import GeoJSON
        // Dans une vraie implémentation, utiliserait ol/format/GeoJSON
        const mockFeatures = [
          { 
            id: 1, 
            type: "Point", 
            coordinates: [0, 0], 
            properties: { 
              name: "Point d'intérêt 1",
              description: "Un point d'intérêt important"
            } 
          },
          { 
            id: 2, 
            type: "LineString", 
            coordinates: [[0, 0], [1, 1]], 
            properties: { 
              name: "Route principale",
              length: "1.4 km"
            } 
          },
          { 
            id: 3, 
            type: "Polygon", 
            coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]], 
            properties: { 
              name: "Zone d'étude",
              area: "1 km²"
            } 
          }
        ];

        const layer = {
          id: `geojson-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          type: "geojson",
          features: mockFeatures,
          visible: true,
          style: {
            fill: "rgba(66, 153, 225, 0.4)",
            stroke: "#4299e1",
            strokeWidth: 2,
            pointRadius: 6
          }
        };

        addLayer(layer);
        setImportedData({
          name: file.name,
          featureCount: mockFeatures.length,
          type: "GeoJSON",
          timestamp: new Date().toLocaleTimeString()
        });

      } catch (err) {
        setError("Erreur de lecture du fichier: " + err.message);
      }
    };

    reader.readAsText(file);
  }, [addLayer]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".geojson", ".json"],
      "application/geo+json": [".geojson"]
    },
    multiple: false
  });

  return (
    <div style={{
      background: "#2d3748",
      padding: "20px",
      borderRadius: "8px",
      color: "#e2e8f0",
      minHeight: "200px",
      display: "flex",
      flexDirection: "column"
    }}>
      <h3 style={{ marginTop: 0, marginBottom: "20px" }}> Import GeoJSON</h3>
      
      <div
        {...getRootProps()}
        style={{
          padding: "40px",
          textAlign: "center",
          border: `2px dashed ${isDragActive ? "#4299e1" : "#4a5568"}`,
          borderRadius: "8px",
          backgroundColor: isDragActive ? "rgba(66, 153, 225, 0.1)" : "transparent",
          cursor: "pointer",
          transition: "all 0.2s",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <input {...getInputProps()} />
        <div style={{ fontSize: "48px", marginBottom: "15px" }}>
          {isDragActive ? "" : ""}
        </div>
        {isDragActive ? (
          <p style={{ fontSize: "16px", fontWeight: "bold" }}>
            Déposez le fichier GeoJSON ici...
          </p>
        ) : (
          <div>
            <p style={{ fontSize: "16px", marginBottom: "10px" }}>
              Glissez-déposez un fichier GeoJSON ici
            </p>
            <p style={{ fontSize: "14px", color: "#a0aec0" }}>
              ou <span style={{ color: "#4299e1", textDecoration: "underline" }}>cliquez pour parcourir</span>
            </p>
          </div>
        )}
        <p style={{ 
          fontSize: "12px", 
          color: "#a0aec0", 
          marginTop: "15px",
          maxWidth: "80%"
        }}>
          Formats supportés: .geojson, .json
        </p>
      </div>

      {error && (
        <div style={{
          marginTop: "15px",
          padding: "10px",
          background: "#fed7d7",
          color: "#9b2c2c",
          borderRadius: "4px",
          textAlign: "center",
          fontSize: "14px"
        }}>
           {error}
        </div>
      )}

      {importedData && (
        <div style={{
          marginTop: "15px",
          padding: "15px",
          background: "#c6f6d5",
          color: "#22543d",
          borderRadius: "6px",
          borderLeft: "4px solid #38a169"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
            <span style={{ fontSize: "20px" }}></span>
            <strong style={{ fontSize: "14px" }}>Import réussi</strong>
          </div>
          <div style={{ fontSize: "12px", marginLeft: "30px" }}>
            <div><strong>Fichier:</strong> {importedData.name}</div>
            <div><strong>Entités:</strong> {importedData.featureCount}</div>
            <div><strong>Type:</strong> {importedData.type}</div>
            <div><strong>Heure:</strong> {importedData.timestamp}</div>
          </div>
        </div>
      )}

      <div style={{
        marginTop: "20px",
        fontSize: "12px",
        color: "#a0aec0",
        borderTop: "1px solid #4a5568",
        paddingTop: "15px"
      }}>
        <p style={{ marginBottom: "5px" }}>
          <strong>ℹ Informations:</strong>
        </p>
        <ul style={{ margin: "5px 0", paddingLeft: "15px" }}>
          <li>L'import ajoutera une nouvelle couche à votre carte</li>
          <li>Formats supportés: Points, Lignes, Polygones</li>
          <li>Les propriétés des entités seront disponibles dans la table attributaire</li>
        </ul>
      </div>
    </div>
  );
};

export default GeoJSONImporter;
