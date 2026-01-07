import React, { createContext, useContext, useState, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

const MapContext = createContext(null);

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap doit ÃƒÆ’Ã‚Âªtre utilisÃƒÆ’Ã‚Â© dans MapProvider');
  }
  return context;
};

export const MapProvider = ({ children }) => {
  const [map, setMap] = useState(null);
  const [viewMode, setViewMode] = useState('2D');
  const [center, setCenter] = useState([2.2137, 46.2276]); // France centre
  const [zoom, setZoom] = useState(5);
  const [layers, setLayers] = useState([]);
  
  const mapRef = useRef(null);

  // Initialiser la carte
  const initMap = (targetElement) => {
    if (map) return map;
    
    const newMap = new Map({
      target: targetElement,
      layers: [
        new TileLayer({
          source: new OSM(),
          visible: true
        })
      ],
      view: new View({
        center: fromLonLat(center),
        zoom: zoom,
        projection: 'EPSG:3857'
      })
    });

    setMap(newMap);
    mapRef.current = newMap;
    return newMap;
  };

  // Changer le mode de vue
  const changeViewMode = (mode) => {
    setViewMode(mode);
    console.log(`Mode de vue changÃƒÆ’Ã‚Â©: ${mode}`);
    
    // Logique spÃƒÆ’Ã‚Â©cifique au mode
    if (mode === '3D') {
      // PrÃƒÆ’Ã‚Â©parer pour le 3D
    } else if (mode === 'canvas') {
      // Mode dessin
    }
  };

  // Ajouter une couche
  const addLayer = (layer) => {
    if (map) {
      map.addLayer(layer);
      setLayers(prev => [...prev, layer]);
    }
  };

  // Supprimer une couche
  const removeLayer = (layer) => {
    if (map) {
      map.removeLayer(layer);
      setLayers(prev => prev.filter(l => l !== layer));
    }
  };

  // Centre et zoom
  const setMapCenter = (newCenter) => {
    setCenter(newCenter);
    if (map) {
      map.getView().setCenter(fromLonLat(newCenter));
    }
  };

  const setMapZoom = (newZoom) => {
    setZoom(newZoom);
    if (map) {
      map.getView().setZoom(newZoom);
    }
  };

  const value = {
    map,
    mapRef,
    viewMode,
    center,
    zoom,
    layers,
    initMap,
    changeViewMode,
    addLayer,
    removeLayer,
    setMapCenter,
    setMapZoom
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};
