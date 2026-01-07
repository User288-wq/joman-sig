// src/scripts/geospatial/dataProcessor.js
export class DataProcessor {
  /**
   * Filtrage de données par attribut
   */
  static filterByAttribute(features, attribute, value, operator = '==') {
    if (!features || !Array.isArray(features)) {
      throw new Error('Features invalides');
    }

    return features.filter(feature => {
      const propValue = feature.properties?.[attribute];
      
      switch(operator) {
        case '==':
          return propValue === value;
        case '!=':
          return propValue !== value;
        case '>':
          return propValue > value;
        case '<':
          return propValue < value;
        case '>=':
          return propValue >= value;
        case '<=':
          return propValue <= value;
        case 'contains':
          return String(propValue).includes(String(value));
        case 'startsWith':
          return String(propValue).startsWith(String(value));
        case 'endsWith':
          return String(propValue).endsWith(String(value));
        default:
          return false;
      }
    });
  }

  /**
   * Filtrage spatial - Dans une bounding box
   */
  static filterByBoundingBox(features, bbox) {
    if (!features || !bbox || bbox.length !== 4) {
      throw new Error('Paramètres invalides');
    }

    const [minX, minY, maxX, maxY] = bbox;
    
    return features.filter(feature => {
      if (!feature.geometry || !feature.geometry.coordinates) {
        return false;
      }
      
      const coords = this.extractCoordinates(feature.geometry);
      return coords.some(([x, y]) => 
        x >= minX && x <= maxX && y >= minY && y <= maxY
      );
    });
  }

  /**
   * Agrégation de données par attribut
   */
  static aggregateByAttribute(features, groupByAttribute, aggregateAttribute, operation = 'sum') {
    if (!features || !groupByAttribute) {
      throw new Error('Paramètres invalides');
    }

    const groups = {};
    
    features.forEach(feature => {
      const groupKey = feature.properties?.[groupByAttribute];
      if (groupKey === undefined) return;
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          features: [],
          values: []
        };
      }
      
      groups[groupKey].features.push(feature);
      
      const value = feature.properties?.[aggregateAttribute];
      if (value !== undefined) {
        groups[groupKey].values.push(Number(value));
      }
    });

    const results = [];
    
    Object.entries(groups).forEach(([groupKey, group]) => {
      let aggregatedValue;
      
      switch(operation) {
        case 'sum':
          aggregatedValue = group.values.reduce((a, b) => a + b, 0);
          break;
        case 'average':
          aggregatedValue = group.values.length > 0 ? 
            group.values.reduce((a, b) => a + b, 0) / group.values.length : 0;
          break;
        case 'count':
          aggregatedValue = group.features.length;
          break;
        case 'min':
          aggregatedValue = Math.min(...group.values);
          break;
        case 'max':
          aggregatedValue = Math.max(...group.values);
          break;
        default:
          aggregatedValue = group.values.length;
      }
      
      results.push({
        group: groupKey,
        value: aggregatedValue,
        featureCount: group.features.length,
        features: group.features
      });
    });
    
    return results;
  }

  /**
   * Jointure spatiale (Spatial Join)
   */
  static spatialJoin(targetFeatures, joinFeatures, operation = 'intersects') {
    if (!targetFeatures || !joinFeatures) {
      throw new Error('Features invalides');
    }

    const result = [];
    
    targetFeatures.forEach(target => {
      const joinedProperties = {};
      
      joinFeatures.forEach(join => {
        if (this.spatialRelation(target.geometry, join.geometry, operation)) {
          Object.assign(joinedProperties, join.properties);
        }
      });
      
      result.push({
        ...target,
        properties: {
          ...target.properties,
          ...joinedProperties
        }
      });
    });
    
    return result;
  }

  /**
   * Calcul de statistiques
   */
  static calculateStatistics(features, attribute) {
    if (!features || !attribute) {
      throw new Error('Paramètres invalides');
    }

    const values = features
      .map(f => f.properties?.[attribute])
      .filter(v => v !== undefined && v !== null)
      .map(Number);
    
    if (values.length === 0) {
      return null;
    }
    
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / values.length;
    
    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted.length % 2 === 0 ?
      (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2 :
      sorted[Math.floor(sorted.length / 2)];
    
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return {
      count: values.length,
      sum,
      mean,
      median,
      min,
      max,
      range: max - min,
      variance,
      stdDev,
      values
    };
  }

  /**
   * Normalisation de données
   */
  static normalizeData(features, attribute, method = 'minmax') {
    if (!features || !attribute) {
      throw new Error('Paramètres invalides');
    }

    const values = features
      .map(f => f.properties?.[attribute])
      .filter(v => v !== undefined)
      .map(Number);
    
    if (values.length === 0) {
      return features;
    }
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
    );
    
    return features.map(feature => {
      const value = feature.properties?.[attribute];
      if (value === undefined) return feature;
      
      let normalized;
      
      switch(method) {
        case 'minmax':
          normalized = (value - min) / (max - min);
          break;
        case 'zscore':
          normalized = (value - mean) / stdDev;
          break;
        case 'decimal':
          normalized = value / Math.pow(10, Math.ceil(Math.log10(max)));
          break;
        default:
          normalized = value;
      }
      
      return {
        ...feature,
        properties: {
          ...feature.properties,
          [`${attribute}_normalized`]: normalized
        }
      };
    });
  }

  /**
   * Classification de données (Choroplèthe)
   */
  static classifyData(features, attribute, method = 'quantile', classes = 5) {
    if (!features || !attribute || classes < 2) {
      throw new Error('Paramètres invalides');
    }

    const values = features
      .map(f => f.properties?.[attribute])
      .filter(v => v !== undefined)
      .map(Number)
      .sort((a, b) => a - b);
    
    if (values.length === 0) {
      return features;
    }
    
    let breaks = [];
    
    switch(method) {
      case 'quantile':
        for (let i = 1; i < classes; i++) {
          const index = Math.floor((i * values.length) / classes);
          breaks.push(values[index]);
        }
        break;
        
      case 'equal':
        const range = values[values.length - 1] - values[0];
        const interval = range / classes;
        for (let i = 1; i < classes; i++) {
          breaks.push(values[0] + i * interval);
        }
        break;
        
      case 'jenks':
        // Algorithme de Jenks simplifié
        breaks = this.calculateJenksBreaks(values, classes);
        break;
        
      default:
        throw new Error('Méthode de classification non supportée');
    }
    
    breaks = [...new Set(breaks)].sort((a, b) => a - b);
    
    return features.map(feature => {
      const value = feature.properties?.[attribute];
      if (value === undefined) return feature;
      
      let classIndex = 0;
      for (let i = 0; i < breaks.length; i++) {
        if (value <= breaks[i]) {
          classIndex = i;
          break;
        }
        if (i === breaks.length - 1) {
          classIndex = breaks.length;
        }
      }
      
      return {
        ...feature,
        properties: {
          ...feature.properties,
          [`${attribute}_class`]: classIndex,
          [`${attribute}_breaks`]: breaks
        }
      };
    });
  }

  // Méthodes utilitaires
  static extractCoordinates(geometry) {
    const coords = [];
    
    const extract = (coordinate) => {
      if (Array.isArray(coordinate[0])) {
        coordinate.forEach(c => extract(c));
      } else {
        coords.push(coordinate);
      }
    };
    
    extract(geometry.coordinates);
    return coords;
  }

  static spatialRelation(geom1, geom2, relation) {
    // Implémentation simplifiée
    const bbox1 = this.getGeometryBBox(geom1);
    const bbox2 = this.getGeometryBBox(geom2);
    
    switch(relation) {
      case 'intersects':
        return this.bboxesIntersect(bbox1, bbox2);
      case 'contains':
        return this.bboxContains(bbox1, bbox2);
      case 'within':
        return this.bboxContains(bbox2, bbox1);
      case 'touches':
        return this.bboxesTouch(bbox1, bbox2);
      default:
        return false;
    }
  }

  static getGeometryBBox(geometry) {
    const coords = this.extractCoordinates(geometry);
    
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    for (const [x, y] of coords) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    
    return { minX, maxX, minY, maxY };
  }

  static bboxesIntersect(bbox1, bbox2) {
    return !(bbox1.maxX < bbox2.minX || 
             bbox1.minX > bbox2.maxX || 
             bbox1.maxY < bbox2.minY || 
             bbox1.minY > bbox2.maxY);
  }

  static bboxContains(bbox1, bbox2) {
    return bbox1.minX <= bbox2.minX &&
           bbox1.maxX >= bbox2.maxX &&
           bbox1.minY <= bbox2.minY &&
           bbox1.maxY >= bbox2.maxY;
  }

  static bboxesTouch(bbox1, bbox2) {
    return bbox1.maxX === bbox2.minX ||
           bbox1.minX === bbox2.maxX ||
           bbox1.maxY === bbox2.minY ||
           bbox1.minY === bbox2.maxY;
  }

  static calculateJenksBreaks(data, classes) {
    // Algorithme de Jenks simplifié
    if (data.length <= classes) {
      return [...new Set(data)].slice(1, -1);
    }
    
    const sorted = [...data].sort((a, b) => a - b);
    const breaks = [];
    
    for (let i = 1; i < classes; i++) {
      const index = Math.floor((i * sorted.length) / classes);
      breaks.push(sorted[index]);
    }
    
    return breaks;
  }
}