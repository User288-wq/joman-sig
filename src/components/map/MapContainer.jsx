import React from "react";
import Map2D from "./Map2D";
import CesiumMap from "./CesiumMap";
import CanvasMap from "./CanvasMap";

const MapContainer = ({ mode, onMapLoad, activeLayers }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {mode === "2D" && (
        <Map2D onMapLoad={onMapLoad} activeLayers={activeLayers} />
      )}

      {mode === "3D" && (
        <CesiumMap onMapLoad={onMapLoad} />
      )}

      {mode === "canvas" && (
        <CanvasMap onMapLoad={onMapLoad} />
      )}
    </div>
  );
};

export default MapContainer;
