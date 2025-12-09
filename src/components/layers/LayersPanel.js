import React from "react";

const LayersPanel = () => {
  const layers = [
    { id: 1, name: "Carte de base", visible: true, type: "base" },
    { id: 2, name: "Routes", visible: true, type: "line" },
    { id: 3, name: "Bâtiments", visible: false, type: "polygon" },
    { id: 4, name: "Points d'intérêt", visible: true, type: "point" },
  ];

  return (
    <div style={{
      width: "280px",
      background: "#2d3748",
      color: "#e2e8f0",
      padding: "20px",
      height: "100%",
      borderRight: "1px solid #4a5568",
      overflowY: "auto"
    }}>
      <h3 style={{ marginTop: 0, marginBottom: "20px" }}>📁 Gestion des couches</h3>
      
      <div style={{ marginBottom: "20px" }}>
        <button style={{
          background: "#4299e1",
          border: "none",
          color: "white",
          padding: "8px 15px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          width: "100%",
          marginBottom: "10px"
        }}>
          + Ajouter une couche
        </button>
        
        <button style={{
          background: "none",
          border: "1px solid #4a5568",
          color: "#a0aec0",
          padding: "8px 15px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          width: "100%"
        }}>
          Importer GeoJSON
        </button>
      </div>
      
      <div>
        <h4 style={{ marginBottom: "15px", color: "#cbd5e0" }}>Couches actives</h4>
        {layers.map(layer => (
          <div key={layer.id} style={{
            background: "rgba(0,0,0,0.2)",
            padding: "10px",
            marginBottom: "8px",
            borderRadius: "4px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input 
                type="checkbox" 
                checked={layer.visible}
                onChange={() => {}}
                style={{ cursor: "pointer" }}
              />
              <div>
                <div style={{ fontWeight: "500" }}>{layer.name}</div>
                <div style={{ fontSize: "12px", color: "#a0aec0" }}>Type: {layer.type}</div>
              </div>
            </div>
            <button style={{
              background: "none",
              border: "none",
              color: "#fc8181",
              cursor: "pointer",
              fontSize: "12px"
            }}>
              
            </button>
          </div>
        ))}
      </div>
      
      <div style={{
        marginTop: "20px",
        paddingTop: "15px",
        borderTop: "1px solid #4a5568",
        fontSize: "12px",
        color: "#a0aec0"
      }}>
        {layers.filter(l => l.visible).length} / {layers.length} couches visibles
      </div>
    </div>
  );
};

export default LayersPanel;
