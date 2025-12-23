// src/scripts/geospatial/geometryOperations.js
export class GeometryOperations {
  /**
   * Découpage (Clip) - Intersection entre une géométrie et un polygone de découpe
   */
  static clip(geometry, clipPolygon) {
    if (!geometry || !clipPolygon) {
      throw new Error('Géométries requises');
    }

    // Implémentation simplifiée du découpage
    // Dans une vraie application, utiliser une lib comme Turf.js
    return {
      type: 'Feature',
      geometry: {
        type: geometry.type,
        coordinates: this.performClipping(geometry.coordinates, clipPolygon)
      },
      properties: geometry.properties || {}
    };
  }

  /**
   * Fusion (Merge) - Union de plusieurs géométries
   */
  static merge(geometries) {
    if (!geometries || geometries.length === 0) {
      throw new Error('Au moins une géométrie requise');
    }

    // Fusion simplifiée - dans la réalité, utiliser un algorithme d'union
    const allCoordinates = [];
    
    geometries.forEach(geom => {
      if (geom.type === 'Polygon') {
        allCoordinates.push(...geom.coordinates[0]);
      } else if (geom.type === 'MultiPolygon') {
        geom.coordinates.forEach(poly => {
          allCoordinates.push(...poly[0]);
        });
      }
    });

    return {
      type: 'Polygon',
      coordinates: [this.convexHull(allCoordinates)]
    };
  }

  /**
   * Tampon (Buffer) - Création d'une zone tampon autour d'une géométrie
   */
  static buffer(geometry, distance, unit = 'km') {
    if (!geometry) {
      throw new Error('Géométrie requise');
    }

    const bufferDistance = this.convertDistanceToDegrees(distance, unit);
    
    switch(geometry.type) {
      case 'Point':
        return this.bufferPoint(geometry.coordinates, bufferDistance);
      case 'LineString':
        return this.bufferLineString(geometry.coordinates, bufferDistance);
      case 'Polygon':
        return this.bufferPolygon(geometry.coordinates, bufferDistance);
      default:
        throw new Error(`Type non supporté pour buffer: ${geometry.type}`);
    }
  }

  /**
   * Intersection - Géométrie commune entre deux géométries
   */
  static intersect(geometry1, geometry2) {
    // Implémentation simplifiée
    const bbox1 = this.getBoundingBox(geometry1);
    const bbox2 = this.getBoundingBox(geometry2);
    
    if (!this.bboxIntersect(bbox1, bbox2)) {
      return null; // Pas d'intersection
    }
    
    // Logique d'intersection simplifiée
    return {
      type: 'GeometryCollection',
      geometries: [geometry1, geometry2]
    };
  }

  /**
   * Différence - Géométrie 1 moins Géométrie 2
   */
  static difference(geometry1, geometry2) {
    // Logique simplifiée
    return geometry1; // Dans la réalité, calculer la différence
  }

  /**
   * Union - Fusion de deux géométries
   */
  static union(geometry1, geometry2) {
    return this.merge([geometry1, geometry2]);
  }

  /**
   * Enveloppe convexe (Convex Hull)
   */
  static convexHull(points) {
    if (points.length < 3) {
      return points;
    }

    // Algorithme de Graham Scan simplifié
    const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    
    const lower = [];
    for (const point of sorted) {
      while (lower.length >= 2 && 
             this.cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
        lower.pop();
      }
      lower.push(point);
    }
    
    const upper = [];
    for (let i = sorted.length - 1; i >= 0; i--) {
      const point = sorted[i];
      while (upper.length >= 2 && 
             this.cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
        upper.pop();
      }
      upper.push(point);
    }
    
    lower.pop();
    upper.pop();
    
    return [...lower, ...upper];
  }

  /**
   * Calcul du point le plus proche (Nearest Point)
   */
  static nearestPoint(targetPoint, points) {
    if (!targetPoint || !points || points.length === 0) {
      return null;
    }

    let minDistance = Infinity;
    let nearest = null;
    
    for (const point of points) {
      const dx = point[0] - targetPoint[0];
      const dy = point[1] - targetPoint[1];
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < minDistance) {
        minDistance = distance;
        nearest = point;
      }
    }
    
    return {
      point: nearest,
      distance: minDistance
    };
  }

  // Méthodes utilitaires
  static performClipping(coordinates, clipPolygon) {
    // Implémentation simplifiée - utiliser Sutherland-Hodgman en réalité
    return coordinates.filter(coord => 
      this.pointInPolygon(coord, clipPolygon)
    );
  }

  static bufferPoint(coordinates, distance) {
    const points = [];
    const steps = 36; // Nombre de points pour le cercle
    
    for (let i = 0; i < steps; i++) {
      const angle = (i * 2 * Math.PI) / steps;
      const x = coordinates[0] + distance * Math.cos(angle);
      const y = coordinates[1] + distance * Math.sin(angle);
      points.push([x, y]);
    }
    
    // Fermer le polygone
    points.push(points[0]);
    
    return {
      type: 'Polygon',
      coordinates: [points]
    };
  }

  static bufferLineString(coordinates, distance) {
    // Implémentation simplifiée
    return {
      type: 'Polygon',
      coordinates: [coordinates]
    };
  }

  static bufferPolygon(coordinates, distance) {
    // Implémentation simplifiée
    return {
      type: 'Polygon',
      coordinates: coordinates
    };
  }

  static pointInPolygon(point, polygon) {
    const [x, y] = point;
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];
      
      const intersect = ((yi > y) !== (yj > y)) &&
                       (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      
      if (intersect) inside = !inside;
    }
    
    return inside;
  }

  static getBoundingBox(geometry) {
    const coords = this.extractAllCoordinates(geometry);
    
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

  static extractAllCoordinates(geometry) {
    const coords = [];
    
    const extract = (coordinates) => {
      if (Array.isArray(coordinates[0])) {
        coordinates.forEach(coord => extract(coord));
      } else {
        coords.push(coordinates);
      }
    };
    
    extract(geometry.coordinates);
    return coords;
  }

  static bboxIntersect(bbox1, bbox2) {
    return !(bbox1.maxX < bbox2.minX || 
             bbox1.minX > bbox2.maxX || 
             bbox1.maxY < bbox2.minY || 
             bbox1.minY > bbox2.maxY);
  }

  static cross(o, a, b) {
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  }

  static convertDistanceToDegrees(distance, unit) {
    // Approximation: 1 degré ≈ 111 km à l'équateur
    const km = unit === 'km' ? distance : 
               unit === 'm' ? distance / 1000 : 
               unit === 'miles' ? distance * 1.60934 : distance;
    
    return km / 111;
  }
}