import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
  iconUrl: require("leaflet/dist/images/marker-icon.png").default,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").default
});

const MapCanvas = ({ center = [0, 0], zoom = 2 }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    // Initialiser la carte Leaflet
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView(center, zoom);

    // Ajouter la couche OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // Ajouter un marqueur au centre
    L.marker(center)
      .addTo(map)
      .bindPopup("Centre de la carte")
      .openPopup();

    mapInstance.current = map;

    // Nettoyage
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, [center, zoom]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
      />
      <div style={{
        position: "absolute",
        bottom: "10px",
        left: "10px",
        background: "rgba(255, 255, 255, 0.9)",
        padding: "5px 10px",
        borderRadius: "4px",
        fontSize: "12px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
      }}>
        Leaflet
      </div>
    </div>
  );
};

export default MapCanvas;
