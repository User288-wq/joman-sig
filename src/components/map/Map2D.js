import React, { useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";

const Map2D = ({ center = [0, 0], zoom = 2, layers = [] }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Initialiser la carte OpenLayers
    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
          name: "OpenStreetMap"
        })
      ],
      view: new View({
        center: fromLonLat(center),
        zoom: zoom,
        minZoom: 1,
        maxZoom: 18
      }),
      controls: []
    });

    setMap(initialMap);

    // Nettoyage
    return () => {
      if (initialMap) {
        initialMap.setTarget(null);
      }
    };
  }, [center, zoom]);

  // Mettre à jour la vue
  useEffect(() => {
    if (map) {
      map.getView().setCenter(fromLonLat(center));
      map.getView().setZoom(zoom);
    }
  }, [map, center, zoom]);

  // Gérer les couches
  useEffect(() => {
    if (map && layers.length > 0) {
      // Ajouter des couches supplémentaires ici
      // console.log("Couches à ajouter:", layers);
    }
  }, [map, layers]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
      />
      <div style={{
        position: "absolute",
        bottom: "10px",
        right: "10px",
        background: "rgba(255, 255, 255, 0.9)",
        padding: "5px 10px",
        borderRadius: "4px",
        fontSize: "12px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
      }}>
        OpenLayers
      </div>
    </div>
  );
};

export default Map2D;
