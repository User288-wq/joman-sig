import { useState, useCallback } from 'react';

export const useDrawing = () => {
  const [drawingMode, setDrawingMode] = useState(null);
  const [drawingFeatures, setDrawingFeatures] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = useCallback((type) => {
    setDrawingMode(type);
    setIsDrawing(true);
    console.log(`Début du dessin: ${type}`);
  }, []);

  const stopDrawing = useCallback(() => {
    setDrawingMode(null);
    setIsDrawing(false);
    console.log('Fin du dessin');
  }, []);

  const addFeature = useCallback((feature) => {
    setDrawingFeatures(prev => [...prev, feature]);
  }, []);

  const clearDrawing = useCallback(() => {
    setDrawingFeatures([]);
  }, []);

  return {
    drawingMode,
    drawingFeatures,
    isDrawing,
    startDrawing,
    stopDrawing,
    addFeature,
    clearDrawing
  };
};
