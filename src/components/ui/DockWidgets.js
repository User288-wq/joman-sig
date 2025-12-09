import React from "react";

const DockWidgets = () => {
  return (
    <div style={{
      position: "absolute",
      right: "20px",
      top: "80px",
      width: "300px",
      background: "rgba(26, 32, 44, 0.9)",
      borderRadius: "8px",
      border: "1px solid #4a5568",
      padding: "15px",
      color: "#e2e8f0",
      zIndex: 1000
    }}>
      <h4 style={{ marginTop: 0 }}>Widgets</h4>
      <p style={{ color: "#a0aec0", fontSize: "14px" }}>
        Panneaux ancrables pour outils SIG
      </p>
    </div>
  );
};

export default DockWidgets;
