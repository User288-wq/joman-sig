import React, { useRef, useEffect, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import './Map2D.css';

const Map2D = ({ center = [2.2137, 46.2276], zoom = 5 }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Initialiser la carte
    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat(center),
        zoom: zoom,
        projection: 'EPSG:3857'
      }),
      controls: defaultControls({
        zoom: true,
        rotate: true,
        attribution: true
      })
    });

    setMap(initialMap);

    // Cleanup
    return () => {
      if (initialMap) {
        initialMap.setTarget(null);
      }
    };
  }, []);

  // Mettre ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  jour le centre et zoom
  useEffect(() => {
    if (map) {
      const view = map.getView();
      view.setCenter(fromLonLat(center));
      view.setZoom(zoom);
    }
  }, [center, zoom, map]);

  return (
    <div className="map-2d-container">
      <div ref={mapRef} className="map-2d" />
      <div className="map-controls">
        <button className="map-btn" onClick={() => map.getView().setZoom(map.getView().getZoom() + 1)}>+</button>
        <button className="map-btn" onClick={() => map.getView().setZoom(map.getView().getZoom() - 1)}>-</button>
        <button className="map-btn" onClick={() => map.getView().setRotation(0)}></button>
      </div>
    </div>
  );
};

export default Map2D;
