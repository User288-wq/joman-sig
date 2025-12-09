import React from "react";

const MenuBar = () => {
  return (
    <div style={{
      background: "#1a202c",
      color: "#e2e8f0",
      padding: "10px 20px",
      borderBottom: "1px solid #4a5568",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span style={{ fontWeight: "bold", fontSize: "18px" }}> Joman SIG</span>
        <nav style={{ display: "flex", gap: "10px" }}>
          <button style={navButtonStyle}>Fichier</button>
          <button style={navButtonStyle}>Carte</button>
          <button style={navButtonStyle}>Couches</button>
          <button style={navButtonStyle}>Outils</button>
          <button style={navButtonStyle}>Aide</button>
        </nav>
      </div>
      <div style={{ fontSize: "12px", color: "#a0aec0" }}>
        Version 1.0
      </div>
    </div>
  );
};

const navButtonStyle = {
  background: "none",
  border: "none",
  color: "#e2e8f0",
  cursor: "pointer",
  padding: "5px 10px",
  borderRadius: "4px",
  fontSize: "14px"
};

export default MenuBar;
