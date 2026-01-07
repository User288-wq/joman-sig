import React, { useEffect } from "react";

const CanvasMap = ({ onMapLoad }) => {
  useEffect(() => {
    if (onMapLoad) onMapLoad("canvas");
  }, [onMapLoad]);

  return (
    <div
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
        transition: "background-color 0.3s",
      }}
      onClick={() => alert("Clic sur la carte !")}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b3d9ff")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#cce5ff")}
    >
      <div style={{ textAlign: "center", color: "#0056b3" }}>
        <h2 style={{ marginBottom: "10px" }}>ÃƒÂ°Ã…Â¸Ã…â€™Ã‚Â Zone Carte Canvas</h2>
        <p>Cliquez pour interagir avec la carte</p>
      </div>
    </div>
  );
};

export default CanvasMap;
