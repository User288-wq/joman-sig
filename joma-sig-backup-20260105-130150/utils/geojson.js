/**
 * Utilitaires pour manipuler les données GeoJSON
 */

export const validateGeoJSON = (geojson) => {
  if (!geojson || typeof geojson !== 'object') {
    return { valid: false, error: 'Données invalides' };
  }

  if (geojson.type !== 'FeatureCollection') {
    return { valid: false, error: 'Le GeoJSON doit être une FeatureCollection' };
  }

  if (!Array.isArray(geojson.features)) {
    return { valid: false, error: 'Features doit être un tableau' };
  }

  return { valid: true };
};

export const convertToGeoJSON = (features, properties = {}) => {
  return {
    type: 'FeatureCollection',
    features: features.map((feature, index) => ({
      type: 'Feature',
      geometry: feature.geometry,
      properties: {
        id: index + 1,
        ...properties,
        ...feature.properties
      }
    })),
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
      }
    }
  };
};

export const downloadGeoJSON = (geojson, filename = 'export.geojson') => {
  const dataStr = JSON.stringify(geojson, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const calculateBounds = (geojson) => {
  if (!geojson.features || geojson.features.length === 0) {
    return null;
  }

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  geojson.features.forEach(feature => {
    const coords = getCoordinates(feature.geometry);
    coords.forEach(([x, y]) => {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });
  });

  return [[minX, minY], [maxX, maxY]];
};

const getCoordinates = (geometry) => {
  if (!geometry) return [];
  
  switch (geometry.type) {
    case 'Point':
      return [geometry.coordinates];
    case 'LineString':
      return geometry.coordinates;
    case 'Polygon':
      return geometry.coordinates.flat();
    case 'MultiPoint':
      return geometry.coordinates;
    case 'MultiLineString':
      return geometry.coordinates.flat();
    case 'MultiPolygon':
      return geometry.coordinates.flat(2);
    default:
      return [];
  }
};
