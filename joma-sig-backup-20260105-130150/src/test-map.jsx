// src/test-map.jsx
import React, { useRef, useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';

export default function TestMap() {
  const mapRef = useRef(null);
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    const map = new Map({
      target: mapRef.current,
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({
        center: fromLonLat([2.2137, 46.2276]),
        zoom: 5
      })
    });
    
    return () => map.setTarget(null);
  }, []);
  
  return <div ref={mapRef} style={{ width: '600px', height: '400px' }} />;
}
