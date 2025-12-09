import React from "react";

const MainToolbar = () => {
  return (
    <div style={{
      position: "absolute",
      top: "15px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(26, 32, 44, 0.9)",
      padding: "10px 20px",
      borderRadius: "8px",
      display: "flex",
      gap: "10px",
      zIndex: 1000,
      border: "1px solid #4a5568",
      backdropFilter: "blur(5px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
    }}>
      <button style={toolButtonStyle}>
         Ajouter point
      </button>
      <button style={toolButtonStyle}>
         Mesurer
      </button>
      <button style={toolButtonStyle}>
         Effacer
      </button>
      <div style={{ width: "1px", background: "#4a5568", margin: "0 5px" }}></div>
      <button style={toolButtonStyle}>
         Zoom +
      </button>
      <button style={toolButtonStyle}>
         Zoom -
      </button>
      <button style={toolButtonStyle}>
         Centrer
      </button>
    </div>
  );
};

const toolButtonStyle = {
  background: "#2d3748",
  border: "1px solid #4a5568",
  color: "#e2e8f0",
  padding: "8px 15px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  gap: "5px"
};

export default MainToolbar;
