import React, { useEffect } from "react";

const CesiumMap = ({ onMapLoad }) => {
  useEffect(() => {
    if (onMapLoad) onMapLoad("cesium");
  }, [onMapLoad]);

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #000033 0%, #000066 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <h2>ÃƒÂ°Ã…Â¸Ã…â€™Ã‚Â Visualisation Globe 3D (Cesium)</h2>
    </div>
  );
};

export default CesiumMap;
