import React, { useState } from "react";
import { useMap } from "../../contexts/MapContext";

const MeasureTools = () => {
  const { map } = useMap();
  const [measureMode, setMeasureMode] = useState(null);
  const [measurements, setMeasurements] = useState([]);

  const startMeasure = (type) => {
    setMeasureMode(type);
    // Implémenter la logique de mesure ici
    console.log(`Début de mesure: ${type}`);
  };

  const clearMeasurements = () => {
    setMeasurements([]);
    setMeasureMode(null);
  };

  return (
    <div style={{
      background: "#2d3748",
      padding: "15px",
      borderRadius: "8px",
      color: "#e2e8f0",
      minWidth: "250px"
    }}>
      <h4 style={{ marginTop: 0, marginBottom: "15px" }}> Outils de Mesure</h4>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          onClick={() => startMeasure("distance")}
          style={{
            padding: "10px",
            background: measureMode === "distance" ? "#4299e1" : "#4a5568",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <span>📐</span>
          <span>Mesurer une distance</span>
        </button>

        <button
          onClick={() => startMeasure("area")}
          style={{
            padding: "10px",
            background: measureMode === "area" ? "#4299e1" : "#4a5568",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <span></span>
          <span>Mesurer une surface</span>
        </button>

        <button
          onClick={() => startMeasure("point")}
          style={{
            padding: "10px",
            background: measureMode === "point" ? "#4299e1" : "#4a5568",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <span></span>
          <span>Coordonnées d'un point</span>
        </button>

        {measurements.length > 0 && (
          <div style={{ marginTop: "15px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px"
            }}>
              <strong>Mesures:</strong>
              <button
                onClick={clearMeasurements}
                style={{
                  padding: "5px 10px",
                  background: "#e53e3e",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                Effacer tout
              </button>
            </div>
            
            {measurements.map((measurement, index) => (
              <div key={index} style={{
                padding: "8px",
                background: "#4a5568",
                borderRadius: "4px",
                marginBottom: "5px",
                fontSize: "12px"
              }}>
                <div><strong>{measurement.type}:</strong> {measurement.value}</div>
                <div style={{ color: "#a0aec0", fontSize: "11px" }}>
                  {measurement.timestamp}
                </div>
              </div>
            ))}
          </div>
        )}

        {measureMode && (
          <div style={{
            marginTop: "10px",
            padding: "10px",
            background: "#4299e1",
            color: "white",
            borderRadius: "4px",
            textAlign: "center",
            fontSize: "12px"
          }}>
            Mode {measureMode} actif - Cliquez sur la carte pour mesurer
          </div>
        )}

        <div style={{
          marginTop: "15px",
          paddingTop: "10px",
          borderTop: "1px solid #4a5568",
          fontSize: "11px",
          color: "#a0aec0"
        }}>
          <p>Instructions:</p>
          <ul style={{ margin: "5px 0", paddingLeft: "15px" }}>
            <li>Cliquez pour ajouter des points</li>
            <li>Double-cliquez pour terminer</li>
            <li>ESC pour annuler</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MeasureTools;
