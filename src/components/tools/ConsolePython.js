import React from "react";

const ConsolePython = () => {
  return (
    <div style={{
      background: "#1a202c",
      color: "#e2e8f0",
      padding: "15px",
      borderRadius: "8px",
      border: "1px solid #4a5568",
      fontFamily: "monospace"
    }}>
      <h4 style={{ marginTop: 0 }}>Console Python</h4>
      <div style={{
        background: "#0d1117",
        padding: "10px",
        borderRadius: "4px",
        marginBottom: "10px"
      }}>
        <span style={{ color: "#58a6ff" }}>&gt;&gt;&gt;</span> print("Bienvenue dans Joman SIG")
      </div>
    </div>
  );
};

export default ConsolePython;
