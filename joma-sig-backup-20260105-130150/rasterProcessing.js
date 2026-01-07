// src/scripts/geospatial/rasterProcessing.js
export class RasterProcessing {
  /**
   * Calcul de l'Indice de Différence Normalisée (NDVI)
   * NDVI = (NIR - RED) / (NIR + RED)
   */
  static calculateNDVI(redBand, nirBand, options = {}) {
    const { minValue = -1, maxValue = 1, nodata = -9999 } = options;
    
    if (!redBand || !nirBand || redBand.length !== nirBand.length) {
      throw new Error('Bandes de taille différente');
    }
    
    const ndvi = new Array(redBand.length);
    
    for (let i = 0; i < redBand.length; i++) {
      const red = redBand[i];
      const nir = nirBand[i];
      
      if (red === nodata || nir === nodata) {
        ndvi[i] = nodata;
      } else {
        const denominator = nir + red;
        
        if (denominator === 0) {
          ndvi[i] = 0;
        } else {
          let value = (nir - red) / denominator;
          
          // Normalisation
          if (value < minValue) value = minValue;
          if (value > maxValue) value = maxValue;
          
          ndvi[i] = value;
        }
      }
    }
    
    return ndvi;
  }

  /**
   * Calcul de l'Indice de Végétation par Différence (DVI)
   */
  static calculateDVI(nirBand, redBand) {
    if (!redBand || !nirBand || redBand.length !== nirBand.length) {
      throw new Error('Bandes de taille différente');
    }
    
    const dvi = new Array(redBand.length);
    
    for (let i = 0; i < redBand.length; i++) {
      dvi[i] = nirBand[i] - redBand[i];
    }
    
    return dvi;
  }

  /**
   * Calcul de l'Indice d'Eau par Différence Normalisée (NDWI)
   * NDWI = (GREEN - NIR) / (GREEN + NIR)
   */
  static calculateNDWI(greenBand, nirBand) {
    if (!greenBand || !nirBand || greenBand.length !== nirBand.length) {
      throw new Error('Bandes de taille différente');
    }
    
    const ndwi = new Array(greenBand.length);
    
    for (let i = 0; i < greenBand.length; i++) {
      const green = greenBand[i];
      const nir = nirBand[i];
      const denominator = green + nir;
      
      if (denominator === 0) {
        ndwi[i] = 0;
      } else {
        ndwi[i] = (green - nir) / denominator;
      }
    }
    
    return ndwi;
  }

  /**
   * Calcul de l'Indice de Sol Normalisé (NDSI)
   */
  static calculateNDSI(greenBand, swirBand) {
    if (!greenBand || !swirBand || greenBand.length !== swirBand.length) {
      throw new Error('Bandes de taille différente');
    }
    
    const ndsi = new Array(greenBand.length);
    
    for (let i = 0; i < greenBand.length; i++) {
      const green = greenBand[i];
      const swir = swirBand[i];
      const denominator = green + swir;
      
      if (denominator === 0) {
        ndsi[i] = 0;
      } else {
        ndsi[i] = (green - swir) / denominator;
      }
    }
    
    return ndsi;
  }

  /**
   * Classification supervisée (Maximum de Vraisemblance)
   */
  static maximumLikelihoodClassification(bands, trainingData, options = {}) {
    const { probabilityThreshold = 0.5, nodata = -9999 } = options;
    const numClasses = trainingData.length;
    const numBands = bands.length;
    const numPixels = bands[0].length;
    
    // Calculer les statistiques pour chaque classe
    const classStats = trainingData.map(cls => 
      this.calculateClassStatistics(cls.samples, numBands)
    );
    
    const classification = new Array(numPixels);
    const probabilities = new Array(numPixels).fill().map(() => new Array(numClasses));
    
    for (let p = 0; p < numPixels; p++) {
      // Vérifier si le pixel est nodata
      let hasNodata = false;
      for (let b = 0; b < numBands; b++) {
        if (bands[b][p] === nodata) {
          hasNodata = true;
          break;
        }
      }
      
      if (hasNodata) {
        classification[p] = nodata;
        continue;
      }
      
      // Calculer les probabilités pour chaque classe
      const pixelValues = bands.map(band => band[p]);
      let maxProb = -Infinity;
      let bestClass = nodata;
      
      for (let c = 0; c < numClasses; c++) {
        const prob = this.calculateGaussianProbability(
          pixelValues, 
          classStats[c].mean, 
          classStats[c].covariance
        );
        
        probabilities[p][c] = prob;
        
        if (prob > maxProb) {
          maxProb = prob;
          bestClass = trainingData[c].classId;
        }
      }
      
      // Seuil de probabilité
      if (maxProb >= probabilityThreshold) {
        classification[p] = bestClass;
      } else {
        classification[p] = nodata; // Non classé
      }
    }
    
    return {
      classification,
      probabilities,
      classStats
    };
  }

  /**
   * Calcul des statistiques d'une classe
   */
  static calculateClassStatistics(samples, numBands) {
    const numSamples = samples.length;
    const mean = new Array(numBands).fill(0);
    const covariance = Array(numBands).fill().map(() => new Array(numBands).fill(0));
    
    // Calcul de la moyenne
    samples.forEach(sample => {
      for (let b = 0; b < numBands; b++) {
        mean[b] += sample[b];
      }
    });
    
    for (let b = 0; b < numBands; b++) {
      mean[b] /= numSamples;
    }
    
    // Calcul de la matrice de covariance
    samples.forEach(sample => {
      for (let i = 0; i < numBands; i++) {
        for (let j = 0; j < numBands; j++) {
          covariance[i][j] += (sample[i] - mean[i]) * (sample[j] - mean[j]);
        }
      }
    });
    
    for (let i = 0; i < numBands; i++) {
      for (let j = 0; j < numBands; j++) {
        covariance[i][j] /= (numSamples - 1);
      }
    }
    
    return { mean, covariance };
  }

  /**
   * Calcul de la probabilité gaussienne
   */
  static calculateGaussianProbability(values, mean, covariance) {
    const n = values.length;
    
    // Calcul du déterminant
    const det = this.matrixDeterminant(covariance);
    if (det <= 0) return 0;
    
    // Calcul de l'inverse de la matrice de covariance
    const invCov = this.invertMatrix(covariance);
    
    // Calcul de l'exposant
    let exponent = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const diffI = values[i] - mean[i];
        const diffJ = values[j] - mean[j];
        exponent += diffI * invCov[i][j] * diffJ;
      }
    }
    
    // Formule de la distribution normale multivariée
    const probability = Math.exp(-0.5 * exponent) / 
                       Math.sqrt(Math.pow(2 * Math.PI, n) * det);
    
    return probability;
  }

  /**
   * Calcul de pente et d'aspect à partir d'un MNT
   */
  static calculateSlopeAspect(dem, cellSize, zFactor = 1) {
    const rows = dem.length;
    const cols = dem[0].length;
    
    const slope = Array(rows).fill().map(() => Array(cols).fill(0));
    const aspect = Array(rows).fill().map(() => Array(cols).fill(0));
    
    for (let i = 1; i < rows - 1; i++) {
      for (let j = 1; j < cols - 1; j++) {
        // Coefficients de la fenêtre 3x3
        const a = dem[i-1][j-1];
        const b = dem[i-1][j];
        const c = dem[i-1][j+1];
        const d = dem[i][j-1];
        const e = dem[i][j];
        const f = dem[i][j+1];
        const g = dem[i+1][j-1];
        const h = dem[i+1][j];
        const k = dem[i+1][j+1];
        
        // Calcul des dérivées selon l'algorithme de Horn
        const dz_dx = ((c + 2*f + k) - (a + 2*d + g)) / (8 * cellSize);
        const dz_dy = ((g + 2*h + k) - (a + 2*b + c)) / (8 * cellSize);
        
        // Calcul de la pente (en degrés)
        const slopeRad = Math.sqrt(dz_dx * dz_dx + dz_dy * dz_dy);
        slope[i][j] = Math.atan(slopeRad) * (180 / Math.PI);
        
        // Calcul de l'aspect (en degrés)
        if (dz_dx !== 0) {
          aspect[i][j] = Math.atan2(dz_dy, -dz_dx) * (180 / Math.PI);
          
          if (aspect[i][j] < 0) {
            aspect[i][j] += 360;
          }
        } else {
          aspect[i][j] = dz_dy > 0 ? 90 : dz_dy < 0 ? 270 : 0;
        }
      }
    }
    
    return { slope, aspect };
  }

  /**
   * Calcul d'ombrage (hillshade)
   */
  static calculateHillshade(dem, cellSize, azimuth = 315, altitude = 45) {
    const { slope, aspect } = this.calculateSlopeAspect(dem, cellSize);
    const rows = dem.length;
    const cols = dem[0].length;
    
    const hillshade = Array(rows).fill().map(() => Array(cols).fill(0));
    
    // Conversion des angles en radians
    const azimuthRad = azimuth * Math.PI / 180;
    const altitudeRad = altitude * Math.PI / 180;
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const slopeRad = slope[i][j] * Math.PI / 180;
        const aspectRad = aspect[i][j] * Math.PI / 180;
        
        // Formule de l'ombrage
        const hillshadeValue = Math.cos(altitudeRad) * Math.cos(slopeRad) +
                              Math.sin(altitudeRad) * Math.sin(slopeRad) * 
                              Math.cos(azimuthRad - aspectRad);
        
        // Normalisation entre 0 et 255
        hillshade[i][j] = Math.max(0, Math.min(255, hillshadeValue * 255));
      }
    }
    
    return hillshade;
  }

  // Méthodes utilitaires
  static matrixDeterminant(matrix) {
    const n = matrix.length;
    
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    let det = 0;
    for (let i = 0; i < n; i++) {
      const subMatrix = [];
      for (let j = 1; j < n; j++) {
        subMatrix.push(matrix[j].filter((_, idx) => idx !== i));
      }
      det += matrix[0][i] * Math.pow(-1, i) * this.matrixDeterminant(subMatrix);
    }
    
    return det;
  }

  static invertMatrix(matrix) {
    const n = matrix.length;
    const identity = Array(n).fill().map((_, i) => 
      Array(n).fill().map((_, j) => i === j ? 1 : 0)
    );
    
    const augmented = matrix.map((row, i) => [...row, ...identity[i]]);
    
    // Élimination de Gauss-Jordan
    for (let i = 0; i < n; i++) {
      // Recherche du pivot
      let pivotRow = i;
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(augmented[j][i]) > Math.abs(augmented[pivotRow][i])) {
          pivotRow = j;
        }
      }
      
      if (Math.abs(augmented[pivotRow][i]) < 1e-10) {
        throw new Error('Matrice non inversible');
      }
      
      // Échanger les lignes
      if (pivotRow !== i) {
        [augmented[i], augmented[pivotRow]] = [augmented[pivotRow], augmented[i]];
      }
      
      // Normaliser la ligne du pivot
      const pivot = augmented[i][i];
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

  /**
   * Filtrage de convolution
   */
  static convolve(image, kernel) {
    const rows = image.length;
    const cols = image[0].length;
    const kRows = kernel.length;
    const kCols = kernel[0].length;
    const kCenterRow = Math.floor(kRows / 2);
    const kCenterCol = Math.floor(kCols / 2);
    
    const result = Array(rows).fill().map(() => Array(cols).fill(0));
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let sum = 0;
        let weightSum = 0;
        
        for (let ki = 0; ki < kRows; ki++) {
          for (let kj = 0; kj < kCols; kj++) {
            const imgRow = i + ki - kCenterRow;
            const imgCol = j + kj - kCenterCol;
            
            if (imgRow >= 0 && imgRow < rows && imgCol >= 0 && imgCol < cols) {
              sum += image[imgRow][imgCol] * kernel[ki][kj];
              weightSum += Math.abs(kernel[ki][kj]);
            }
          }
        }
        
        result[i][j] = weightSum !== 0 ? sum / weightSum : sum;
      }
    }
    
    return result;
  }

  /**
   * Créer des noyaux de convolution prédéfinis
   */
  static getKernel(type, size = 3) {
    switch (type) {
      case 'gaussian':
        return this.createGaussianKernel(size);
      case 'sobelX':
        return [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
      case 'sobelY':
        return [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
      case 'laplacian':
        return [[0, 1, 0], [1, -4, 1], [0, 1, 0]];
      case 'mean':
        const value = 1 / (size * size);
        return Array(size).fill().map(() => Array(size).fill(value));
      default:
        throw new Error('Type de noyau non supporté');
    }
  }

  static createGaussianKernel(size, sigma = 1) {
    const kernel = Array(size).fill().map(() => Array(size).fill(0));
    const center = Math.floor(size / 2);
    let sum = 0;
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const x = i - center;
        const y = j - center;
        kernel[i][j] = Math.exp(-(x * x + y * y) / (2 * sigma * sigma)) / 
                      (2 * Math.PI * sigma * sigma);
        sum += kernel[i][j];
      }
    }
    
    // Normalisation
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        kernel[i][j] /= sum;
      }
    }
    
    return kernel;
  }
}