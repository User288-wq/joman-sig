import React, { useState, useEffect, useCallback } from "react";
import Map2D from "./Map2D";
import Map3D from "./Map3D";
import MapCanvas from "./MapCanvas";

const MapView = ({ activeLayers, onMapLoad, viewMode = "2D" }) => {
  const [center, setCenter] = useState([0, 0]);
  const [zoom, setZoom] = useState(2);

  // Mémoirez la fonction onMapLoad avec useCallback
  const memoizedOnMapLoad = useCallback((mapInstance) => {
    if (onMapLoad) {
      onMapLoad(mapInstance);
    }
  }, [onMapLoad]);

  useEffect(() => {
    // Simuler une instance de carte
    const mockMap = {
      getCenter: () => center,
      getZoom: () => zoom,
      setView: (newCenter, newZoom) => {
        setCenter(newCenter);
        setZoom(newZoom);
      },
      addLayer: (layer) => {
        // console.log("Couche ajoutée:", layer);
      },
      removeLayer: (layerId) => {
        // console.log("Couche retirée:", layerId);
      }
    };

    memoizedOnMapLoad(mockMap);
  }, [center, zoom, memoizedOnMapLoad]);

  const renderMap = () => {
    switch (viewMode) {
      case "2D":
        return <Map2D center={center} zoom={zoom} layers={activeLayers} />;
      case "3D":
        return <Map3D center={[...center, 1000000]} />;
      case "canvas":
        return <MapCanvas center={center} zoom={zoom} />;
      default:
        return <Map2D center={center} zoom={zoom} layers={activeLayers} />;
    }
  };

  return (
    <div style={{
      width: "100%",
      height: "100%",
      position: "relative",
      background: "#1a202c",
      borderRadius: "8px",
      overflow: "hidden"
    }}>
      {/* Sélecteur de mode de vue */}
      <div style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        zIndex: 1000,
        display: "flex",
        gap: "5px",
        background: "rgba(0, 0, 0, 0.7)",
        padding: "5px",
        borderRadius: "4px"
      }}>
        {["2D", "3D", "canvas"].map((mode) => (
          <button
            key={mode}
            onClick={() => {
              // console.log("Changer à", mode);
            }}
            style={{
              padding: "5px 10px",
              background: viewMode === mode ? "#4299e1" : "#4a5568",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Carte */}
      <div style={{ width: "100%", height: "100%" }}>
        {renderMap()}
      </div>

      {/* Contrôles */}
      <div style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "8px",
        minWidth: "200px"
      }}>
        <div style={{ fontSize: "14px", marginBottom: "5px" }}>
          <strong>Vue: {viewMode}</strong>
        </div>
        <div style={{ fontSize: "12px", color: "#a0aec0" }}>
          Centre: {center[0].toFixed(4)}°, {center[1].toFixed(4)}°
        </div>
        <div style={{ fontSize: "12px", color: "#a0aec0" }}>
          Zoom: {zoom}x
        </div>
        <div style={{ fontSize: "12px", color: "#a0aec0", marginTop: "5px" }}>
          Couches actives: {Object.keys(activeLayers).filter(k => activeLayers[k]).length}
        </div>
      </div>
    </div>
  );
};

export default MapView;
