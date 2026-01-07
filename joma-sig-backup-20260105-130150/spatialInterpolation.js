// src/scripts/geospatial/spatialInterpolation.js
export class SpatialInterpolation {
  /**
   * Interpolation par Inverse Distance Weighting (IDW)
   */
  static idwInterpolation(points, grid, power = 2, radius = null) {
    const { xMin, xMax, yMin, yMax, cellSize, rows, cols } = grid;
    const interpolated = Array(rows).fill().map(() => Array(cols).fill(null));
    
    for (let i = 0; i < rows; i++) {
      const y = yMax - (i * cellSize) - (cellSize / 2);
      
      for (let j = 0; j < cols; j++) {
        const x = xMin + (j * cellSize) + (cellSize / 2);
        
        let numerator = 0;
        let denominator = 0;
        let pointCount = 0;
        
        points.forEach(point => {
          const distance = Math.sqrt(
            Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)
          );
          
          if (distance === 0) {
            numerator = point.value;
            denominator = 1;
            return;
          }
          
          if (!radius || distance <= radius) {
            const weight = 1 / Math.pow(distance, power);
            numerator += point.value * weight;
            denominator += weight;
            pointCount++;
          }
        });
        
        if (denominator > 0 && pointCount > 0) {
          interpolated[i][j] = numerator / denominator;
        }
      }
    }
    
    return {
      grid: interpolated,
      xMin, xMax, yMin, yMax,
      cellSize, rows, cols
    };
  }

  /**
   * Kriging ordinaire
   */
  static ordinaryKriging(points, grid, variogramModel = 'spherical') {
    // Calcul du variogramme expérimental
    const variogram = this.calculateVariogram(points);
    
    // Ajustement du modèle de variogramme
    const modelParams = this.fitVariogramModel(variogram, variogramModel);
    
    // Interpolation par kriging
    return this.krigingInterpolation(points, grid, modelParams);
  }

  /**
   * Calcul du variogramme expérimental
   */
  static calculateVariogram(points, maxLag = null, numLags = 20) {
    // Calculer les distances maximales entre points
    let maxDistance = 0;
    const n = points.length;
    
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dist = this.calculateDistance(points[i], points[j]);
        maxDistance = Math.max(maxDistance, dist);
      }
    }
    
    const lagDistance = maxLag || (maxDistance / 2);
    const lagSize = lagDistance / numLags;
    const variogram = {
      lags: [],
      semivariances: [],
      pairs: []
    };
    
    // Initialiser les bins
    for (let i = 0; i < numLags; i++) {
      variogram.lags.push((i + 0.5) * lagSize);
      variogram.semivariances.push(0);
      variogram.pairs.push(0);
    }
    
    // Calculer les semivariances
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dist = this.calculateDistance(points[i], points[j]);
        const lagIndex = Math.floor(dist / lagSize);
        
        if (lagIndex < numLags) {
          const semivariance = Math.pow(points[i].value - points[j].value, 2) / 2;
          variogram.semivariances[lagIndex] += semivariance;
          variogram.pairs[lagIndex]++;
        }
      }
    }
    
    // Moyenne des semivariances
    for (let i = 0; i < numLags; i++) {
      if (variogram.pairs[i] > 0) {
        variogram.semivariances[i] /= variogram.pairs[i];
      }
    }
    
    return variogram;
  }

  /**
   * Ajustement d'un modèle de variogramme
   */
  static fitVariogramModel(variogram, modelType) {
    const { lags, semivariances } = variogram;
    
    // Filtrer les valeurs valides
    const validLags = [];
    const validSemivariances = [];
    
    for (let i = 0; i < lags.length; i++) {
      if (semivariances[i] > 0) {
        validLags.push(lags[i]);
        validSemivariances.push(semivariances[i]);
      }
    }
    
    if (validLags.length < 3) {
      throw new Error('Pas assez de points pour ajuster le variogramme');
    }
    
    // Ajustement des paramètres selon le modèle
    switch (modelType) {
      case 'spherical':
        return this.fitSphericalModel(validLags, validSemivariances);
      case 'exponential':
        return this.fitExponentialModel(validLags, validSemivariances);
      case 'gaussian':
        return this.fitGaussianModel(validLags, validSemivariances);
      default:
        throw new Error(`Modèle de variogramme non supporté: ${modelType}`);
    }
  }

  static fitSphericalModel(lags, semivariances) {
    // Paramètres initiaux
    const nugget = semivariances[0];
    const maxSemivariance = Math.max(...semivariances);
    const range = lags[semivariances.indexOf(maxSemivariance)];
    
    // Ajustement par moindres carrés
    let bestParams = { nugget, sill: maxSemivariance, range };
    let minError = Infinity;
    
    // Recherche des paramètres optimaux
    for (let n = nugget * 0.5; n <= nugget * 2; n += nugget * 0.1) {
      for (let s = maxSemivariance * 0.5; s <= maxSemivariance * 2; s += maxSemivariance * 0.1) {
        for (let r = range * 0.5; r <= range * 2; r += range * 0.1) {
          let error = 0;
          
          for (let i = 0; i < lags.length; i++) {
            const predicted = this.sphericalFunction(lags[i], n, s, r);
            error += Math.pow(predicted - semivariances[i], 2);
          }
          
          if (error < minError) {
            minError = error;
            bestParams = { nugget: n, sill: s, range: r };
          }
        }
      }
    }
    
    return {
      type: 'spherical',
      ...bestParams,
      error: minError
    };
  }

  static sphericalFunction(h, nugget, sill, range) {
    if (h === 0) return nugget;
    if (h >= range) return sill;
    
    return nugget + (sill - nugget) * (1.5 * (h / range) - 0.5 * Math.pow(h / range, 3));
  }

  /**
   * Interpolation par kriging
   */
  static krigingInterpolation(points, grid, variogramParams) {
    const { xMin, xMax, yMin, yMax, cellSize, rows, cols } = grid;
    const n = points.length;
    const interpolated = Array(rows).fill().map(() => Array(cols).fill(null));
    
    // Pré-calculer la matrice de covariance
    const covarianceMatrix = this.buildCovarianceMatrix(points, variogramParams);
    const covarianceVector = new Array(n).fill(0);
    const weights = new Array(n).fill(0);
    
    // Inverser la matrice de covariance
    const invCovariance = this.invertMatrix(covarianceMatrix);
    
    for (let i = 0; i < rows; i++) {
      const y = yMax - (i * cellSize) - (cellSize / 2);
      
      for (let j = 0; j < cols; j++) {
        const x = xMin + (j * cellSize) + (cellSize / 2);
        
        // Construire le vecteur de covariance pour le point courant
        for (let k = 0; k < n; k++) {
          const dist = this.calculateDistance({ x, y }, points[k]);
          covarianceVector[k] = this.covarianceFunction(dist, variogramParams);
        }
        
        // Calculer les poids
        this.matrixVectorMultiply(invCovariance, covarianceVector, weights);
        
        // Interpolation
        let estimate = 0;
        for (let k = 0; k < n; k++) {
          estimate += weights[k] * points[k].value;
        }
        
        interpolated[i][j] = estimate;
      }
    }
    
    return {
      grid: interpolated,
      xMin, xMax, yMin, yMax,
      cellSize, rows, cols,
      variogramParams
    };
  }

  // Méthodes utilitaires
  static calculateDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  static covarianceFunction(h, params) {
    switch (params.type) {
      case 'spherical':
        if (h >= params.range) return 0;
        return params.sill - this.sphericalFunction(h, params.nugget, params.sill, params.range);
      default:
        return Math.exp(-h / params.range); // Simplification
    }
  }

  static buildCovarianceMatrix(points, params) {
    const n = points.length;
    const matrix = Array(n).fill().map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          matrix[i][j] = params.sill; // Variance
        } else {
          const dist = this.calculateDistance(points[i], points[j]);
          matrix[i][j] = this.covarianceFunction(dist, params);
        }
      }
    }
    
    return matrix;
  }

  static invertMatrix(matrix) {
    // Algorithme d'inversion de matrice (Gauss-Jordan simplifié)
    const n = matrix.length;
    const identity = Array(n).fill().map((_, i) => 
      Array(n).fill().map((_, j) => i === j ? 1 : 0)
    );
    
    const augmented = matrix.map((row, i) => [...row, ...identity[i]]);
    
    // Élimination de Gauss-Jordan
    for (let i = 0; i < n; i++) {
      // Pivot
      let pivot = augmented[i][i];
      if (Math.abs(pivot) < 1e-10) {
        // Recherche d'un pivot non nul
        for (let j = i + 1; j < n; j++) {
          if (Math.abs(augmented[j][i]) > 1e-10) {
            [augmented[i], augmented[j]] = [augmented[j], augmented[i]];
            pivot = augmented[i][i];
            break;
          }
        }
      }
      
      if (Math.abs(pivot) < 1e-10) {
        throw new Error('Matrice non inversible');
      }
      
      // Normaliser la ligne du pivot
      for (let j = 0; j < 2 * n; j++) {
        augmented[i][j] /= pivot;
      }
      
      // Éliminer les autres lignes
      for (let j = 0; j < n; j++) {
        if (j !== i) {
          const factor = augmented[j][i];
          for (let k = 0; k < 2 * n; k++) {
            augmented[j][k] -= factor * augmented[i][k];
          }
        }
      }
    }
    
    // Extraire la matrice inverse
    return augmented.map(row => row.slice(n));
  }

  static matrixVectorMultiply(matrix, vector, result) {
    const n = matrix.length;
    for (let i = 0; i < n; i++) {
      result[i] = 0;
      for (let j = 0; j < n; j++) {
        result[i] += matrix[i][j] * vector[j];
      }
    }
  }

  /**
   * Générer une grille d'interpolation à partir d'une bounding box
   */
  static createGridFromBBox(bbox, cellSize) {
    const [xMin, yMin, xMax, yMax] = bbox;
    const width = xMax - xMin;
    const height = yMax - yMin;
    
    const cols = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);
    
    return {
      xMin, xMax, yMin, yMax,
      cellSize,
      rows,
      cols,
      width,
      height
    };
  }

  /**
   * Convertir les résultats d'interpolation en GeoJSON
   */
  static gridToGeoJSON(gridResult) {
    const { grid, xMin, yMax, cellSize, rows, cols } = gridResult;
    const features = [];
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const value = grid[i][j];
        if (value !== null) {
          const x = xMin + (j * cellSize) + (cellSize / 2);
          const y = yMax - (i * cellSize) - (cellSize / 2);
          
          // Créer un carré pour la cellule
          const halfCell = cellSize / 2;
          const coordinates = [
            [
              [x - halfCell, y - halfCell],
              [x + halfCell, y - halfCell],
              [x + halfCell, y + halfCell],
              [x - halfCell, y + halfCell],
              [x - halfCell, y - halfCell]
            ]
          ];
          
          features.push({
            type: 'Feature',
            properties: {
              value: value,
              row: i,
              col: j,
              x: x,
              y: y
            },
            geometry: {
              type: 'Polygon',
              coordinates: coordinates
            }
          });
        }
      }
    }
    
    return {
      type: 'FeatureCollection',
      features: features
    };
  }
}