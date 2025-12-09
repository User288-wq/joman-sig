import React from "react";

export default function MapCanvas() {
  const handleMapClick = () => {
    alert("Clic sur la carte !");
  };

  return (
    <div 
      onClick={handleMapClick}
      style={{
        flex: 1,
        backgroundColor: "#cce5ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        border: "2px dashed #007acc",
        margin: "10px",
        cursor: "pointer",
        transition: "background-color 0.3s"
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#b3d9ff"}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#cce5ff"}
    >
      <div style={{ textAlign: "center", color: "#0056b3" }}>
        <h2 style={{ marginBottom: "10px" }}>🌍 Zone Carte SIG</h2>
        <p>Cliquez pour interagir avec la carte</p>
        <p style={{ fontSize: "14px", marginTop: "10px", color: "#666" }}>
          [Fonctionnalité carte à implémenter]
        </p>
      </div>
    </div>
  );
}