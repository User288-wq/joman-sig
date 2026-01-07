import React, { createContext, useContext, useState, useCallback } from 'react';

const LayerContext = createContext();

export const LayerProvider = ({ children }) => {
  const [layers, setLayers] = useState([]);
  const [activeLayers, setActiveLayers] = useState({});
  const [selectedLayer, setSelectedLayer] = useState(null);

  const addLayer = useCallback((layer) => {
    if (!layer.id) {
      layer.id = `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    setLayers(prev => [...prev, layer]);
    setActiveLayers(prev => ({ ...prev, [layer.id]: true }));
    
    return layer.id;
  }, []);

  const removeLayer = useCallback((layerId) => {
    setLayers(prev => prev.filter(layer => layer.id !== layerId));
    setActiveLayers(prev => {
      const newActive = { ...prev };
      delete newActive[layerId];
      return newActive;
    });
    
    if (selectedLayer === layerId) {
      setSelectedLayer(null);
    }
  }, [selectedLayer]);

  const toggleLayerVisibility = useCallback((layerId) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  }, []);

  const updateLayer = useCallback((layerId, updates) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, ...updates } : layer
    ));
  }, []);

  const getLayerById = useCallback((layerId) => {
    return layers.find(layer => layer.id === layerId);
  }, [layers]);

  const getVisibleLayers = useCallback(() => {
    return layers.filter(layer => activeLayers[layer.id]);
  }, [layers, activeLayers]);

  const value = {
    layers,
    activeLayers,
    selectedLayer,
    setSelectedLayer,
    addLayer,
    removeLayer,
    toggleLayerVisibility,
    updateLayer,
    getLayerById,
    getVisibleLayers
  };

  return (
    <LayerContext.Provider value={value}>
      {children}
    </LayerContext.Provider>
  );
};

export const useLayers = () => {
  const context = useContext(LayerContext);
  if (!context) {
    throw new Error('useLayers doit être utilisé dans LayerProvider');
  }
  return context;
};
