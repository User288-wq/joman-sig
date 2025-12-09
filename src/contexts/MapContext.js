import React, { createContext, useContext, useState } from "react";

const MapContext = createContext();

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap doit être utilisé dans MapProvider");
  }
  return context;
};

export const MapProvider = ({ children }) => {
  const [map, setMap] = useState(null);
  const [view, setView] = useState(null);
  const [layers, setLayers] = useState([]);
  const [center, setCenter] = useState([0, 0]);
  const [zoom, setZoom] = useState(2);

  const value = {
    map,
    setMap,
    view,
    setView,
    layers,
    setLayers,
    center,
    setCenter,
    zoom,
    setZoom,
    addLayer: (layer) => {
      setLayers(prev => [...prev, layer]);
    },
    removeLayer: (layerId) => {
      setLayers(prev => prev.filter(l => l.id !== layerId));
    },
    zoomToExtent: (extent) => {
      // console.log("Zoom vers étendue:", extent);
    }
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};
