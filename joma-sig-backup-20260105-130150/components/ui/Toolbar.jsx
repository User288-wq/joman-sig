import React from "react";

const Toolbar = () => {
  const tools = [
    { name: "SÃƒÆ’Ã‚Â©lection", icon: "" },
    { name: "Zoom +", icon: "+" },
    { name: "Zoom -", icon: "-" },
    { name: "Mesure", icon: "ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â" },
    { name: "Dessin", icon: "ÃƒÂ¢Ã…â€œÃ‚Â" }
  ];

  return (
    <div style={{
      position: "absolute",
      top: "20px",
      left: "20px",
      background: "white",
      borderRadius: "8px",
      padding: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      zIndex: 1000,
      display: "flex",
      gap: "5px"
    }}>
      {tools.map((tool, index) => (
        <button
          key={index}
          style={{
            padding: "8px 12px",
            border: "1px solid #ddd",
            background: "#f5f5f5",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}
          title={tool.name}
        >
          <span>{tool.icon}</span>
          <span style={{ fontSize: "12px" }}>{tool.name}</span>
        </button>
      ))}
    </div>
  );
};

export default Toolbar;
