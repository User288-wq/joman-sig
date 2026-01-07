// src/scripts/geospatial/cartographicGeneralization.js
export class CartographicGeneralization {
  /**
   * Algorithme de Douglas-Peucker pour la simplification de lignes
   */
  static douglasPeucker(points, tolerance) {
    if (points.length < 3) return points;
    
    // Trouver le point le plus éloigné
    let maxDistance = 0;
    let maxIndex = 0;
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    
    for (let i = 1; i < points.length - 1; i++) {
      const distance = this.perpendicularDistance(
        points[i], 
        firstPoint, 
        lastPoint
      );
      
      if (distance > maxDistance) {
        maxDistance = distance;
        maxIndex = i;
      }
    }
    
    // Récursion
    let result = [];
    
    if (maxDistance > tolerance) {
      // Diviser la ligne en deux segments
      const recResults1 = this.douglasPeucker(
        points.slice(0, maxIndex + 1), 
        tolerance
      );
      const recResults2 = this.douglasPeucker(
        points.slice(maxIndex), 
        tolerance
      );
      
      // Combiner les résultats (éviter la duplication du point de division)
      result = recResults1.slice(0, -1).concat(recResults2);
    } else {
      // Garder seulement les extrémités
      result = [firstPoint, lastPoint];
    }
    
    return result;
  }

  /**
   * Distance perpendiculaire d'un point à une ligne
   */
  static perpendicularDistance(point, lineStart, lineEnd) {
    const [x, y] = point;
    const [x1, y1] = lineStart;
    const [x2, y2] = lineEnd;
    
    // Si la ligne est un point
    if (x1 === x2 && y1 === y2) {
      return Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
    }
    
    // Calcul de la distance
    const numerator = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1);
    const denominator = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
    
    return numerator / denominator;
  }

  /**
   * Algorithme de Visvalingam-Whyatt pour la simplification
   */
  static visvalingamWhyatt(points, targetCount) {
    if (points.length <= targetCount) return points;
    
    const n = points.length;
    const triangles = new Array(n);
    
    // Calculer l'aire effective pour chaque point
    for (let i = 1; i < n - 1; i++) {
      triangles[i] = {
        index: i,
        area: this.triangleArea(points[i-1], points[i], points[i+1])
      };
    }
    
    // Trier par aire
    const priorityQueue = triangles.slice(1, -1)
      .filter(t => t !== undefined)
      .sort((a, b) => a.area - b.area);
    
    const removed = new Set();
    
    while (points.length - removed.size > targetCount && priorityQueue.length > 0) {
      const triangle = priorityQueue.shift();
      removed.add(triangle.index);
      
      // Mettre à jour les triangles adjacents
      const prevIndex = this.findPreviousIndex(triangle.index, removed);
      const nextIndex = this.findNextIndex(triangle.index, removed, n);
      
      if (prevIndex !== -1 && nextIndex !== -1) {
        // Mettre à jour l'aire du point précédent
        const prevTriangleIndex = priorityQueue.findIndex(t => t.index === prevIndex);
        if (prevTriangleIndex !== -1) {
          priorityQueue[prevTriangleIndex].area = this.triangleArea(
            points[this.findPreviousIndex(prevIndex, removed)],
            points[prevIndex],
            points[nextIndex]
          );
          priorityQueue.sort((a, b) => a.area - b.area);
        }
        
        // Mettre à jour l'aire du point suivant
        const nextTriangleIndex = priorityQueue.findIndex(t => t.index === nextIndex);
        if (nextTriangleIndex !== -1) {
          priorityQueue[nextTriangleIndex].area = this.triangleArea(
            points[prevIndex],
            points[nextIndex],
            points[this.findNextIndex(nextIndex, removed, n)]
          );
          priorityQueue.sort((a, b) => a.area - b.area);
        }
      }
    }
    
    // Reconstruire la ligne simplifiée
    return points.filter((_, index) => !removed.has(index));
  }

  /**
   * Aire d'un triangle (formule de shoelace)
   */
  static triangleArea(a, b, c) {
    return Math.abs(
      a[0] * (b[1] - c[1]) +
      b[0] * (c[1] - a[1]) +
      c[0] * (a[1] - b[1])
    ) / 2;
  }

  static findPreviousIndex(index, removed) {
    for (let i = index - 1; i >= 0; i--) {
      if (!removed.has(i)) return i;
    }
    return -1;
  }

  static findNextIndex(index, removed, maxIndex) {
    for (let i = index + 1; i < maxIndex; i++) {
      if (!removed.has(i)) return i;
    }
    return -1;
  }

  /**
   * Lissage de ligne (algorithme de Chaikin)
   */
  static chaikinSmoothing(points, iterations = 1, ratio = 0.25) {
    if (points.length < 3 || iterations === 0) return points;
    
    let smoothed = points;
    
    for (let iter = 0; iter < iterations; iter++) {
      const newPoints = [];
      const n = smoothed.length;
      
      // Conserver le premier point
      newPoints.push(smoothed[0]);
      
      // Ajouter des points intermédiaires
      for (let i = 0; i < n - 1; i++) {
        const [x1, y1] = smoothed[i];
        const [x2, y2] = smoothed[i + 1];
        
        newPoints.push([
          x1 + ratio * (x2 - x1),
          y1 + ratio * (y2 - y1)
        ]);
        
        newPoints.push([
          x1 + (1 - ratio) * (x2 - x1),
          y1 + (1 - ratio) * (y2 - y1)
        ]);
      }
      
      // Conserver le dernier point
      newPoints.push(smoothed[n - 1]);
      smoothed = newPoints;
    }
    
    return smoothed;
  }

  /**
   * Agrégation de polygones (dissolve)
   */
  static dissolvePolygons(polygons, attribute = null, value = null) {
    if (polygons.length === 0) return [];
    
    const dissolved = [];
    
    if (attribute && value !== null) {
      // Dissoudre par attribut
      const groups = {};
      
      polygons.forEach(polygon => {
        const attrValue = polygon.properties?.[attribute];
        if (attrValue === value) {
          const key = JSON.stringify(polygon.geometry.coordinates);
          if (!groups[key]) {
            groups[key] = polygon;
          }
        }
      });
      
      dissolved.push(...Object.values(groups));
    } else {
      // Dissoudre tous les polygones
      // Recherche de polygones adjacents
      const merged = [];
      const visited = new Set();
      
      for (let i = 0; i < polygons.length; i++) {
        if (visited.has(i)) continue;
        
        const currentGroup = [i];
        visited.add(i);
        
        // Recherche récursive des polygones adjacents
        let changed = true;
        while (changed) {
          changed = false;
          
          for (let j = 0; j < polygons.length; j++) {
            if (visited.has(j)) continue;
            
            // Vérifier l'adjacence
            if (this.arePolygonsAdjacent(polygons[i].geometry, polygons[j].geometry)) {
              currentGroup.push(j);
              visited.add(j);
              changed = true;
            }
          }
        }
        
        if (currentGroup.length > 0) {
          merged.push(currentGroup);
        }
      }
      
      // Fusionner les polygones de chaque groupe
      merged.forEach(group => {
        if (group.length === 1) {
          dissolved.push(polygons[group[0]]);
        } else {
          const mergedPolygon = this.mergePolygons(
            group.map(idx => polygons[idx])
          );
          if (mergedPolygon) {
            dissolved.push(mergedPolygon);
          }
        }
      });
    }
    
    return dissolved;
  }

  /**
   * Vérification d'adjacence entre polygones
   */
  static arePolygonsAdjacent(polygon1, polygon2, tolerance = 0.001) {
    const coords1 = polygon1.coordinates[0]; // Externe ring
    const coords2 = polygon2.coordinates[0];
    
    // Vérifier si les polygones partagent un segment
    for (let i = 0; i < coords1.length - 1; i++) {
      const segment1 = [coords1[i], coords1[i + 1]];
      
      for (let j = 0; j < coords2.length - 1; j++) {
        const segment2 = [coords2[j], coords2[j + 1]];
        
        if (this.segmentsAreEqual(segment1, segment2, tolerance)) {
          return true;
        }
      }
    }
    
    return false;
  }

  static segmentsAreEqual(segment1, segment2, tolerance) {
    const [a1, b1] = segment1;
    const [a2, b2] = segment2;
    
    // Vérifier si les segments sont identiques (même ordre ou ordre inverse)
    const directMatch = 
      this.pointsAreEqual(a1, a2, tolerance) && 
      this.pointsAreEqual(b1, b2, tolerance);
    
    const reverseMatch = 
      this.pointsAreEqual(a1, b2, tolerance) && 
      this.pointsAreEqual(b1, a2, tolerance);
    
    return directMatch || reverseMatch;
  }

  static pointsAreEqual(point1, point2, tolerance) {
    return Math.abs(point1[0] - point2[0]) < tolerance && 
           Math.abs(point1[1] - point2[1]) < tolerance;
  }

  /**
   * Fusion de polygones
   */
  static mergePolygons(polygons) {
    if (polygons.length === 0) return null;
    if (polygons.length === 1) return polygons[0];
    
    // Algorithme simplifié de fusion
    // Dans une vraie application, utiliser un algorithme d'union de polygones
    const allCoordinates = [];
    
    polygons.forEach(polygon => {
      if (polygon.geometry.type === 'Polygon') {
        allCoordinates.push(...polygon.geometry.coordinates[0]);
      } else if (polygon.geometry.type === 'MultiPolygon') {
        polygon.geometry.coordinates.forEach(poly => {
          allCoordinates.push(...poly[0]);
        });
      }
    });
    
    // Calculer l'enveloppe convexe des points
    const hull = this.convexHull(allCoordinates);
    
    return {
      type: 'Feature',
      properties: {
        ...polygons[0].properties,
        merged: true,
        sourceCount: polygons.length
      },
      geometry: {
        type: 'Polygon',
        coordinates: [hull]
      }
    };
  }

  /**
   * Enveloppe convexe (algorithme de Graham Scan)
   */
  static convexHull(points) {
    if (points.length < 3) return points;
    
    // Trouver le point le plus bas (et le plus à gauche en cas d'égalité)
    let start = points[0];
    for (let i = 1; i < points.length; i++) {
      if (points[i][1] < start[1] || 
          (points[i][1] === start[1] && points[i][0] < start[0])) {
        start = points[i];
      }
    }
    
    // Trier les points par angle polaire
    const sorted = points
      .filter(p => p !== start)
      .sort((a, b) => {
        const angleA = Math.atan2(a[1] - start[1], a[0] - start[0]);
        const angleB = Math.atan2(b[1] - start[1], b[0] - start[0]);
        
        if (angleA < angleB) return -1;
        if (angleA > angleB) return 1;
        
        // Si les angles sont égaux, prendre le plus proche
        const distA = Math.pow(a[0] - start[0], 2) + Math.pow(a[1] - start[1], 2);
        const distB = Math.pow(b[0] - start[0], 2) + Math.pow(b[1] - start[1], 2);
        return distA - distB;
      });
    
    // Construction de l'enveloppe
    const hull = [start];
    
    sorted.forEach(point => {
      while (hull.length >= 2) {
        const a = hull[hull.length - 2];
        const b = hull[hull.length - 1];
        
        if (this.cross(a, b, point) <= 0) {
          hull.pop();
        } else {
          break;
        }
      }
      hull.push(point);
    });
    
    return hull;
  }

  static cross(o, a, b) {
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  }

  /**
   * Généralisation par simplification et lissage
   */
  static generalizeGeometry(geometry, options = {}) {
    const {
      simplifyTolerance = 0.01,
      smoothIterations = 1,
      smoothRatio = 0.25,
      method = 'douglas-peucker'
    } = options;
    
    if (!geometry || !geometry.coordinates) {
      throw new Error('Géométrie invalide');
    }
    
    const generalized = { ...geometry };
    
    switch (geometry.type) {
      case 'LineString':
        if (method === 'douglas-peucker') {
          generalized.coordinates = this.douglasPeucker(
            geometry.coordinates, 
            simplifyTolerance
          );
        } else if (method === 'visvalingam') {
          const targetCount = Math.max(
            2, 
            Math.floor(geometry.coordinates.length * (1 - simplifyTolerance))
          );
          generalized.coordinates = this.visvalingamWhyatt(
            geometry.coordinates, 
            targetCount
          );
        }
        
        if (smoothIterations > 0) {
          generalized.coordinates = this.chaikinSmoothing(
            generalized.coordinates, 
            smoothIterations, 
            smoothRatio
          );
        }
        break;
        
      case 'Polygon':
        // Simplifier chaque anneau
        generalized.coordinates = geometry.coordinates.map(ring => {
          let simplified = ring;
          
          if (method === 'douglas-peucker') {
            simplified = this.douglasPeucker(ring, simplifyTolerance);
          }
          
          if (smoothIterations > 0) {
            simplified = this.chaikinSmoothing(
              simplified, 
              smoothIterations, 
              smoothRatio
            );
          }
          
          // S'assurer que le polygone est fermé
          if (simplified.length > 0 && 
              !this.pointsAreEqual(simplified[0], simplified[simplified.length - 1])) {
            simplified.push(simplified[0]);
          }
          
          return simplified;
        });
        break;
        
      case 'MultiLineString':
      case 'MultiPolygon':
        // Appliquer récursivement
        generalized.coordinates = geometry.coordinates.map(part => {
          const partGeometry = {
            type: geometry.type === 'MultiLineString' ? 'LineString' : 'Polygon',
            coordinates: part
          };
          
          const generalizedPart = this.generalizeGeometry(partGeometry, options);
          return generalizedPart.coordinates;
        });
        break;
    }
    
    return generalized;
  }
}