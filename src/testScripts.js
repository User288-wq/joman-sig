// src/scripts/geospatial/testScripts.js
import { NetworkAnalysis } from './networkAnalysis';
import { SpatialInterpolation } from './spatialInterpolation';
import { RasterProcessing } from './rasterProcessing';
import { CartographicGeneralization } from './cartographicGeneralization';

export class GeospatialTestRunner {
  static runAllTests() {
    console.log('🚀 Démarrage des tests géospatiales...\n');
    
    this.testNetworkAnalysis();
    this.testSpatialInterpolation();
    this.testRasterProcessing();
    this.testCartographicGeneralization();
    
    console.log('\n✅ Tous les tests terminés !');
  }
  
  static testNetworkAnalysis() {
    console.log('🧪 Test: Analyse de réseau');
    
    const lineStrings = [
      { coordinates: [[0, 0], [10, 0]] },
      { coordinates: [[10, 0], [10, 10]] },
      { coordinates: [[0, 0], [0, 10]] },
      { coordinates: [[0, 10], [10, 10]] }
    ];
    
    const network = NetworkAnalysis.createNetworkFromLineStrings(lineStrings);
    console.log('✓ Réseau créé:', Object.keys(network.graph).length, 'nœuds');
    
    const path = network.dijkstra('node_1', 'node_4');
    console.log('✓ Plus court chemin calculé:', path.path.length, 'étapes');
    
    const isochrone = network.calculateIsochrone('node_1', 15);
    console.log('✓ Isochrone calculé:', isochrone.accessibleNodes.length, 'nœuds accessibles');
  }
  
  static testSpatialInterpolation() {
    console.log('\n🧪 Test: Interpolation spatiale');
    
    const points = [
      { x: 0, y: 0, value: 10 },
      { x: 10, y: 0, value: 20 },
      { x: 0, y: 10, value: 15 },
      { x: 10, y: 10, value: 25 }
    ];
    
    const grid = SpatialInterpolation.createGridFromBBox([0, 0, 10, 10], 2);
    console.log('✓ Grille créée:', grid.rows, 'x', grid.cols, 'cellules');
    
    const idwResult = SpatialInterpolation.idwInterpolation(points, grid, 2);
    console.log('✓ Interpolation IDW effectuée');
    
    const variogram = SpatialInterpolation.calculateVariogram(points);
    console.log('✓ Variogramme calculé:', variogram.lags.length, 'lags');
  }
  
  static testRasterProcessing() {
    console.log('\n🧪 Test: Traitement raster');
    
    const redBand = [10, 20, 30, 40, 50];
    const nirBand = [20, 30, 40, 50, 60];
    
    const ndvi = RasterProcessing.calculateNDVI(redBand, nirBand);
    console.log('✓ NDVI calculé:', ndvi);
    
    const dem = [
      [100, 105, 110],
      [102, 108, 115],
      [105, 112, 120]
    ];
    
    const slope = RasterProcessing.calculateSlopeAspect(dem, 30);
    console.log('✓ Pente calculée:', slope.slope[1][1]?.toFixed(2), 'degrés');
  }
  
  static testCartographicGeneralization() {
    console.log('\n🧪 Test: Généralisation cartographique');
    
    const line = [
      [0, 0], [1, 0.1], [2, -0.1], [3, 0.2],
      [4, -0.2], [5, 0.1], [6, 0], [7, 0.1]
    ];
    
    const simplified = CartographicGeneralization.douglasPeucker(line, 0.15);
    console.log('✓ Ligne simplifiée:', simplified.length, 'points (originel:', line.length, ')');
    
    const smoothed = CartographicGeneralization.chaikinSmoothing(line, 2);
    console.log('✓ Ligne lissée:', smoothed.length, 'points');
  }
}

// Pour exécuter: GeospatialTestRunner.runAllTests();