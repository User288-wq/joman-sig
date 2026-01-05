import React, { createContext, useState, useContext } from 'react';

const LayerContext = createContext();

export const useLayers = () => useContext(LayerContext);

export const LayerProvider = ({ children }) => {
  const [layers, setLayers] = useState([]);
  
  const addLayer = (layer) => {
    setLayers(prev => [...prev, layer]);
  };
  
  const removeLayer = (layerId) => {
    setLayers(prev => prev.filter(l => l.id !== layerId));
  };
  
  return (
    <LayerContext.Provider value={{ layers, addLayer, removeLayer, setLayers }}>
      {children}
    </LayerContext.Provider>
  );
};