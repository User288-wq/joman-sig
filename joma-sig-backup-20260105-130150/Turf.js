// src/contexts/GeospatialContext.jsx (extension)
import { NetworkAnalysis } from '../scripts/geospatial/networkAnalysis';
import { SpatialInterpolation } from '../scripts/geospatial/spatialInterpolation';
import { RasterProcessing } from '../scripts/geospatial/rasterProcessing';
import { CartographicGeneralization } from '../scripts/geospatial/cartographicGeneralization';

// Ajouter dans la valeur du contexte
const value = {
  // ... fonctions existantes
  
  // Analyse de réseau
  networkAnalysis: {
    createNetwork: (lineStrings) => NetworkAnalysis.createNetworkFromLineStrings(lineStrings),
    shortestPath: (network, start, end) => network.dijkstra(start, end),
    calculateIsochrone: (network, start, distance) => network.calculateIsochrone(start, distance),
    travelingSalesman: (network, points, start) => network.travelingSalesmanProblem(points, start)
  },
  
  // Interpolation spatiale
  spatialInterpolation: {
    idw: (points, grid, power) => SpatialInterpolation.idwInterpolation(points, grid, power),
    kriging: (points, grid, model) => SpatialInterpolation.ordinaryKriging(points, grid, model),
    createGrid: (bbox, cellSize) => SpatialInterpolation.createGridFromBBox(bbox, cellSize),
    gridToGeoJSON: (gridResult) => SpatialInterpolation.gridToGeoJSON(gridResult)
  },
  
  // Traitement raster
  rasterProcessing: {
    calculateNDVI: (red, nir, options) => RasterProcessing.calculateNDVI(red, nir, options),
    calculateSlope: (dem, cellSize) => RasterProcessing.calculateSlopeAspect(dem, cellSize),
    calculateHillshade: (dem, cellSize, azimuth, altitude) => 
      RasterProcessing.calculateHillshade(dem, cellSize, azimuth, altitude),
    classify: (bands, trainingData) => 
      RasterProcessing.maximumLikelihoodClassification(bands, trainingData)
  },
  
  // Généralisation cartographique
  cartographicGeneralization: {
    simplify: (geometry, tolerance, method) => 
      CartographicGeneralization.generalizeGeometry(geometry, { 
        simplifyTolerance: tolerance,
        method 
      }),
    smooth: (geometry, iterations, ratio) =>
      CartographicGeneralization.chaikinSmoothing(geometry, iterations, ratio),
    dissolve: (polygons, attribute, value) =>
      CartographicGeneralization.dissolvePolygons(polygons, attribute, value)
  }
};