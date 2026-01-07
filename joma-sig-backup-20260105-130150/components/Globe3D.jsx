import React from "react";

const Globe3D = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #000033 0%, #000066 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        position: "relative",
      }}
    >
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2 style={{ margin: "0 0 10px 0" }}>Visualisation 3D</h2>
        <p style={{ opacity: 0.8, marginBottom: "30px" }}>Mode globe terrestre activÃƒÆ’Ã‚Â©</p>
      </div>
    </div>
  );
};

export default Globe3D;
