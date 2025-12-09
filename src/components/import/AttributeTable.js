import React, { useState, useEffect } from "react";
import { useLayer } from "../../contexts/LayerContext";

const AttributeTable = () => {
  const { layers } = useLayer();
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [features, setFeatures] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);

  // Simuler des données d'attributs
  const sampleFeatures = [
    { id: 1, name: "Bâtiment A", type: "Polygone", area: "1250 m²", address: "123 Rue Exemple" },
    { id: 2, name: "Route Principale", type: "Ligne", length: "2.5 km", lanes: 4 },
    { id: 3, name: "Parc Central", type: "Polygone", area: "5.2 ha", amenities: "Jeux, Bancs" },
    { id: 4, name: "Station Métro", type: "Point", lines: "A, B, C", passengers: "10k/jour" },
    { id: 5, name: "Pont", type: "Ligne", length: "350 m", material: "Acier" }
  ];

  useEffect(() => {
    if (layers.length > 0 && !selectedLayer) {
      setSelectedLayer(layers[0].id);
    }
  }, [layers, selectedLayer]);

  useEffect(() => {
    // Simuler le chargement des entités
    setFeatures(sampleFeatures);
  }, [selectedLayer]);

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
    // Ici, vous pourriez zoomer sur l'entité ou la mettre en surbrillance
    // console.log("Entité sélectionnée:", feature);
  };

  return (
    <div style={{
      background: "#2d3748",
      color: "#e2e8f0",
      borderRadius: "8px",
      overflow: "hidden",
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{
        padding: "15px",
        background: "#1a202c",
        borderBottom: "1px solid #4a5568"
      }}>
        <h4 style={{ margin: 0 }}> Table Attributaire</h4>
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          <select
            value={selectedLayer || ""}
            onChange={(e) => setSelectedLayer(e.target.value)}
            style={{
              padding: "5px 10px",
              background: "#4a5568",
              color: "white",
              border: "none",
              borderRadius: "4px",
              flex: 1
            }}
          >
            {layers.map(layer => (
              <option key={layer.id} value={layer.id}>
                {layer.name} ({layer.type})
              </option>
            ))}
          </select>
          <div style={{
            padding: "5px 10px",
            background: "#4a5568",
            borderRadius: "4px",
            fontSize: "12px"
          }}>
            {features.length} entités
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "12px"
        }}>
          <thead>
            <tr style={{
              background: "#4a5568",
              position: "sticky",
              top: 0
            }}>
              <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #718096" }}>ID</th>
              <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #718096" }}>Nom</th>
              <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #718096" }}>Type</th>
              <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #718096" }}>Attributs</th>
              <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #718096" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {features.map(feature => (
              <tr
                key={feature.id}
                onClick={() => handleFeatureClick(feature)}
                style={{
                  cursor: "pointer",
                  background: selectedFeature?.id === feature.id ? "#4299e1" : "transparent",
                  transition: "background 0.2s",
                  borderBottom: "1px solid #4a5568"
                }}
              >
                <td style={{ padding: "10px" }}>{feature.id}</td>
                <td style={{ padding: "10px" }}>{feature.name}</td>
                <td style={{ padding: "10px" }}>{feature.type}</td>
                <td style={{ padding: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#a0aec0" }}>
                    {Object.entries(feature)
                      .filter(([key]) => !["id", "name", "type"].includes(key))
                      .map(([key, value]) => (
                        <div key={key}>
                          <strong>{key}:</strong> {value}
                        </div>
                      ))}
                  </div>
                </td>
                <td style={{ padding: "10px" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // console.log("Zoom sur:", feature);
                    }}
                    style={{
                      padding: "3px 8px",
                      background: "#48bb78",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      fontSize: "11px",
                      cursor: "pointer"
                    }}
                  >
                    Zoom
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedFeature && (
        <div style={{
          padding: "15px",
          background: "#1a202c",
          borderTop: "1px solid #4a5568"
        }}>
          <h5 style={{ marginTop: 0, marginBottom: "10px" }}>
            Entité sélectionnée: {selectedFeature.name}
          </h5>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "10px",
            fontSize: "12px"
          }}>
            {Object.entries(selectedFeature).map(([key, value]) => (
              <div key={key}>
                <strong style={{ color: "#a0aec0" }}>{key}:</strong>
                <div style={{ color: "#e2e8f0" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttributeTable;
