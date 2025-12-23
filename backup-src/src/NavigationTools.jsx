// src/components/NavigationTools.js
import React from "react";

export default function NavigationTools({ map }) {

  const zoomIn = () => {
    if (!map) return;
    const view = map.getView();
    view.setZoom(view.getZoom() + 1);
  };

  const zoomOut = () => {
    if (!map) return;
    const view = map.getView();
    view.setZoom(view.getZoom() - 1);
  };

  return (
    <div style={{
      position: "absolute",
      top: 10,
      right: 10,
      background: "#fff",
      padding: 10,
      borderRadius: 6,
      boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
    }}>
      <button onClick={zoomIn}>Zoom +</button>
      <button onClick={zoomOut}>Zoom -</button>
    </div>
  );
}
