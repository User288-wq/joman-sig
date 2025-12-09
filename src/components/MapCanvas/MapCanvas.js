import React, { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "ol/ol.css";

export default function MapCanvas() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({
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

    return () => map.setTarget(null);
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#dfe6e9",
      }}
    />
  );
}
