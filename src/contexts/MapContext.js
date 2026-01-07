// contexts/MapContext.js
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

const MapContext = createContext(null);

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};

export const MapProvider = ({ children }) => {
  const [mapInstance, setMapInstance] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);
  const initialCenter = fromLonLat([-17.4464, 14.6928]); // Dakar par défaut
  const initialZoom = 12;

  // Initialiser la carte
  useEffect(() => {
    if (!mapRef.current || mapInstance) return;

    console.log('🗺️ Initialisation de la carte...');

    try {
      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
            visible: true
          })
        ],
        view: new View({
          center: initialCenter,
          zoom: initialZoom,
          minZoom: 2,
          maxZoom: 20
        }),
        controls: []
      });

      setMapInstance(map);
      setMapReady(true);
      
      console.log('✅ Carte initialisée avec succès');
      
      // Nettoyage
      return () => {
        if (map) {
          map.setTarget(null);
        }
      };
    } catch (error) {
      console.error('❌ Erreur initialisation carte:', error);
    }
  }, []);

  // Fonctions utilitaires
  const zoomToExtent = (extent, padding = 50) => {
    if (mapInstance && extent) {
      mapInstance.getView().fit(extent, {
        padding: [padding, padding, padding, padding],
        duration: 1000
      });
    }
  };

  const setCenter = (coordinates, zoom = null) => {
    if (mapInstance) {
      const view = mapInstance.getView();
      view.setCenter(fromLonLat(coordinates));
      if (zoom !== null) {
        view.setZoom(zoom);
      }
    }
  };

  const addLayer = (layer) => {
    if (mapInstance) {
      mapInstance.addLayer(layer);
    }
  };

  const removeLayer = (layer) => {
    if (mapInstance) {
      mapInstance.removeLayer(layer);
    }
  };

  const getLayers = () => {
    return mapInstance ? mapInstance.getLayers().getArray() : [];
  };

  const value = {
    mapInstance,
    mapReady,
    mapRef,
    zoomToExtent,
    setCenter,
    addLayer,
    removeLayer,
    getLayers
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};