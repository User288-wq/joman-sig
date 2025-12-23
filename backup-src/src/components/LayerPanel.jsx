import React from "react";
import "./LayerPanel.css";

export default function LayerPanel({ activeLayers, setActiveLayers }) {
  const toggle = (l) => {
    setActiveLayers({ ...activeLayers, [l]: !activeLayers[l] });
  };

  return (
    <div className="layer-panel">
      <h3>Layers</h3>

      {Object.keys(activeLayers).map((key) => (
        <div key={key}>
          <input type="checkbox" checked={activeLayers[key]} onChange={() => toggle(key)} />
          <label>{key}</label>
        </div>
      ))}
    </div>
  );
}
