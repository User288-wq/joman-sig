// src/components/MapContainer.js
import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

function MapContainer() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100%", background: "#ddd" }}
    ></div>
  );
}

export default MapContainer;
