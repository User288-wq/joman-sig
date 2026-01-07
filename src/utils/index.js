// src/utils/index.js
// Export de toutes les fonctions utilitaires

export * from './projections';
export * from './WorkflowAutomation';
export * from './coordinateSystem';
export * from './dataProcessor';
export * from './geometricCalculator';
export * from './geometryOperations';
export * from './handleBuffer';
export * from './handleMeasureDistanceAdvanced';

// Fonctions SIG
export const calculateArea = (geometry) => {
  const area = geometry.getArea();
  return {
    km2: (area / 1000000).toFixed(2),
    ha: (area / 10000).toFixed(2),
    m2: area.toFixed(2)
  };
};

export const calculateLength = (geometry) => {
  const length = geometry.getLength();
  return {
    km: (length / 1000).toFixed(2),
    m: length.toFixed(2)
  };
};
