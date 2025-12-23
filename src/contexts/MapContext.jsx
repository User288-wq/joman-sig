import React, { createContext, useContext, useState, useCallback } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [mapInstance, setMapInstance] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  const initializeMap = useCallback((targetElement) => {
    if (mapInstance) {
      mapInstance.setTarget(null);
    }

    const newMap = new Map({
      target: targetElement,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });

    setMapInstance(newMap);
    setMapReady(true);
    
    return newMap;
  }, [mapInstance]);

  const updateMapView = useCallback((center, zoom) => {
    if (mapInstance) {
      const view = mapInstance.getView();
      view.setCenter(center);
      view.setZoom(zoom);
    }
  }, [mapInstance]);

  const addLayer = useCallback((layer) => {
    if (mapInstance && layer) {
      mapInstance.addLayer(layer);
    }
  }, [mapInstance]);

  const removeLayer = useCallback((layer) => {
    if (mapInstance && layer) {
      mapInstance.removeLayer(layer);
    }
  }, [mapInstance]);

  const value = {
    mapInstance,
    mapReady,
    initializeMap,
    updateMapView,
    addLayer,
    removeLayer,
    setMapInstance
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap doit être utilisé dans MapProvider');
  }
  return context;
};
