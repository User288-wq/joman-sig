// src/store/layersStore.js
import React, { createContext, useContext, useState } from "react";

const LayersContext = createContext();

export const LayersProvider = ({ children }) => {
  const [layers, setLayers] = useState([]);

  const addLayer = (layer) => {
    setLayers((prev) => [...prev, layer]);
  };

  const removeLayer = (id) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <LayersContext.Provider value={{ layers, addLayer, removeLayer }}>
      {children}
    </LayersContext.Provider>
  );
};

export const useLayers = () => useContext(LayersContext);
