import React, { useEffect, useRef } from "react";
import { Viewer, Cartesian3, Color } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

const Map3D = ({ center = [0, 0, 1000000] }) => {
  const cesiumContainer = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!cesiumContainer.current) return;

    // Initialiser Cesium Viewer
    const viewer = new Viewer(cesiumContainer.current, {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      scene3DOnly: true,
      shouldAnimate: true,
      skyBox: false,
      skyAtmosphere: false,
    });

    // Configuration de base
    viewer.scene.backgroundColor = Color.TRANSPARENT;
    
    // Position initiale
    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(center[0], center[1], center[2])
    });

    viewerRef.current = viewer;

    // Nettoyage
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [center]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        ref={cesiumContainer}
        style={{ width: "100%", height: "100%" }}
      />
      <div style={{
        position: "absolute",
        bottom: "10px",
        right: "10px",
        background: "rgba(0, 0, 0, 0.7)",
        color: "white",
        padding: "5px 10px",
        borderRadius: "4px",
        fontSize: "12px"
      }}>
        Cesium 3D Viewer
      </div>
    </div>
  );
};

export default Map3D;
