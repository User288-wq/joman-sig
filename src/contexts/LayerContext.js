import React, { createContext, useState, useContext } from "react";

const LayerContext = createContext();

export const useLayer = () => {
  const context = useContext(LayerContext);
  if (!context) {
    throw new Error("useLayer doit être utilisé dans LayerProvider");
  }
  return context;
};

export const LayerProvider = ({ children }) => {
  const [layers, setLayers] = useState([
    { id: 1, name: "Carte de base", type: "base", visible: true },
    { id: 2, name: "Routes", type: "vector", visible: true },
    { id: 3, name: "Bâtiments", type: "vector", visible: false },
    { id: 4, name: "Points d'intérêt", type: "point", visible: true }
  ]);

  const toggleLayer = (layerId) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === layerId
          ? { ...layer, visible: !layer.visible }
          : layer
      )
    );
  };

  const addLayer = (newLayer) => {
    setLayers(prev => [...prev, {
      id: Date.now(),
      ...newLayer,
      visible: true
    }]);
  };

  const removeLayer = (layerId) => {
    setLayers(prev => prev.filter(layer => layer.id !== layerId));
  };

  const value = {
    layers,
    toggleLayer,
    addLayer,
    removeLayer,
    visibleLayers: layers.filter(l => l.visible),
    hiddenLayers: layers.filter(l => !l.visible)
  };

  return (
    <LayerContext.Provider value={value}>
      {children}
    </LayerContext.Provider>
  );
};

export default LayerContext;
