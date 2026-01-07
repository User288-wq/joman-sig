import React, { createContext, useContext, useState, useCallback } from 'react';

const LayerContext = createContext(null);

export const useLayers = () => {
  const context = useContext(LayerContext);
  if (!context) {
    throw new Error('useLayers doit ÃƒÆ’Ã‚Âªtre utilisÃƒÆ’Ã‚Â© dans LayerProvider');
  }
  return context;
};

export const LayerProvider = ({ children }) => {
  const [activeLayers, setActiveLayers] = useState({
    baseMap: true,
    roads: true,
    buildings: false,
    poi: true,
    terrain3D: false,
    canvasOverlay: false
  });

  const [layerList, setLayerList] = useState([
    { id: 'osm', name: 'Carte OSM', type: 'base', visible: true, opacity: 1 },
    { id: 'satellite', name: 'Satellite', type: 'base', visible: false, opacity: 1 },
    { id: 'roads', name: 'Routes', type: 'vector', visible: true, opacity: 0.8 },
    { id: 'buildings', name: 'BÃƒÆ’Ã‚Â¢timents', type: 'vector', visible: false, opacity: 0.6 },
    { id: 'water', name: 'RiviÃƒÆ’Ã‚Â¨res/Lacs', type: 'vector', visible: true, opacity: 0.7 },
    { id: 'parks', name: 'Parcs', type: 'vector', visible: true, opacity: 0.9 }
  ]);

  const toggleLayer = useCallback((layerId) => {
    setLayerList(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, visible: !layer.visible }
        : layer
    ));
  }, []);

  const addLayer = useCallback((layerData) => {
    const newLayer = {
      id: `layer-${Date.now()}`,
      ...layerData,
      visible: true,
      opacity: 1
    };
    setLayerList(prev => [newLayer, ...prev]);
  }, []);

  const removeLayer = useCallback((layerId) => {
    setLayerList(prev => prev.filter(layer => layer.id !== layerId));
  }, []);

  const updateLayerOpacity = useCallback((layerId, opacity) => {
    setLayerList(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, opacity }
        : layer
    ));
  }, []);

  const reorderLayers = useCallback((startIndex, endIndex) => {
    const result = Array.from(layerList);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setLayerList(result);
  }, [layerList]);

  const value = {
    activeLayers,
    layerList,
    toggleLayer,
    addLayer,
    removeLayer,
    updateLayerOpacity,
    reorderLayers,
    setActiveLayers
  };

  return (
    <LayerContext.Provider value={value}>
      {children}
    </LayerContext.Provider>
  );
};
