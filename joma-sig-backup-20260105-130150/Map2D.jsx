// src/components/map/Map2D.jsx - Version avec OpenLayers
import React, { useRef, useEffect } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

const Map2D = ({ center = [2.2137, 46.2276], zoom = 5 }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // 1. Initialisation (une seule fois)
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Initialiser la carte OpenLayers
    mapInstance.current = new Map({
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
      })
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(null);
      }
    };
  }, []); // <-- Tableau VIDE : s'exÃƒÆ’Ã‚Â©cute une fois

  // 2. Mise ÃƒÆ’Ã‚Â  jour de la vue quand center/zoom changent
  useEffect(() => {
    if (mapInstance.current) {
      const view = mapInstance.current.getView();
      view.setCenter(fromLonLat(center));
      view.setZoom(zoom);
    }
  }, [center, zoom]); // <-- S'exÃƒÆ’Ã‚Â©cute ÃƒÆ’Ã‚Â  chaque changement

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative'
    }}>
      <div 
        ref={mapRef} 
        style={{ width: '100%', height: '100%' }}
      />
      
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <button 
          onClick={() => mapInstance.current?.getView().setZoom(mapInstance.current.getView().getZoom() + 1)}
          style={{
            padding: '10px',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}
        >
          +
        </button>
        <button 
          onClick={() => mapInstance.current?.getView().setZoom(mapInstance.current.getView().getZoom() - 1)}
          style={{
            padding: '10px',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default Map2D;
