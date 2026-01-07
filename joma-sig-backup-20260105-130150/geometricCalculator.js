// src/scripts/geospatial/geometricCalculator.js
export class GeometricCalculator {
  // Constantes
  static EARTH_RADIUS_KM = 6371;
  static EARTH_RADIUS_M = 6371000;

  /**
   * Calcul de la distance entre deux points (sphère terrestre)
   * Utilise la formule de Haversine
   */
  static calculateDistance(point1, point2, unit = 'km') {
    const [lon1, lat1] = this.degreesToRadians(point1);
    const [lon2, lat2] = this.degreesToRadians(point2);
    
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    const radius = unit === 'km' ? this.EARTH_RADIUS_KM : this.EARTH_RADIUS_M;
    return radius * c;
  }

  /**
   * Calcul de la surface d'un polygone (plan)
   * Utilise la formule de l'algorithme de Gauss (shoelace)
   */
  static calculateArea(coordinates) {
    if (!coordinates || coordinates.length < 3) {
      return 0;
    }

    let area = 0;
    const n = coordinates.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += coordinates[i][0] * coordinates[j][1];
      area -= coordinates[j][0] * coordinates[i][1];
    }
    
    return Math.abs(area) / 2;
  }

  /**
   * Calcul de la surface d'un polygone sur sphère
   * Utilise la formule de l'excès sphérique
   */
  static calculateSphericalArea(coordinates, unit = 'km²') {
    if (!coordinates || coordinates.length < 3) {
      return 0;
    }

    const radCoords = coordinates.map(coord => this.degreesToRadians(coord));
    let area = 0;
    const n = radCoords.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += this.calculateSphericalTriangleArea(radCoords[i], radCoords[j]);
    }
    
    const radius = unit === 'km²' ? this.EARTH_RADIUS_KM : this.EARTH_RADIUS_M;
    return Math.abs(area) * radius * radius;
  }

  static calculateSphericalTriangleArea(point1, point2) {
    const [lon1, lat1] = point1;
    const [lon2, lat2] = point2;
    
    // Approximations pour petits triangles
    return 0.5 * Math.abs(lon2 - lon1) * Math.sin(lat1);
  }

  /**
   * Calcul du périmètre d'un polygone
   */
  static calculatePerimeter(coordinates, unit = 'km') {
    if (!coordinates || coordinates.length < 2) {
      return 0;
    }

    let perimeter = 0;
    const n = coordinates.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      perimeter += this.calculateDistance(coordinates[i], coordinates[j], unit);
    }
    
    return perimeter;
  }

  /**
   * Calcul du centre de gravité (centroïde)
   */
  static calculateCentroid(coordinates) {
    if (!coordinates || coordinates.length === 0) {
      return null;
    }

    let sumX = 0;
    let sumY = 0;
    
    for (const [x, y] of coordinates) {
      sumX += x;
      sumY += y;
    }
    
    return [sumX / coordinates.length, sumY / coordinates.length];
  }

  /**
   * Calcul de la bounding box
   */
  static calculateBoundingBox(coordinates) {
    if (!coordinates || coordinates.length === 0) {
      return null;
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    
    for (const [x, y] of coordinates) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    
    return {
      min: [minX, minY],
      max: [maxX, maxY],
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /**
   * Calcul de la longueur d'une ligne
   */
  static calculateLineLength(coordinates, unit = 'km') {
    if (!coordinates || coordinates.length < 2) {
      return 0;
    }

    let length = 0;
    
    for (let i = 0; i < coordinates.length - 1; i++) {
      length += this.calculateDistance(coordinates[i], coordinates[i + 1], unit);
    }
    
    return length;
  }

  /**
   * Conversion degrés -> radians
   */
  static degreesToRadians(coordinate) {
    return [coordinate[0] * Math.PI / 180, coordinate[1] * Math.PI / 180];
  }

  /**
   * Conversion radians -> degrés
   */
  static radiansToDegrees(coordinate) {
    return [coordinate[0] * 180 / Math.PI, coordinate[1] * 180 / Math.PI];
  }

  /**
   * Conversion d'unités
   */
  static convertArea(area, fromUnit, toUnit) {
    const conversions = {
      'm²': 1,
      'km²': 0.000001,
      'ha': 0.0001,
      'acres': 0.000247105
    };
    
    if (!conversions[fromUnit] || !conversions[toUnit]) {
      throw new Error('Unité non supportée');
    }
    
    return area * (conversions[fromUnit] / conversions[toUnit]);
  }

  static convertDistance(distance, fromUnit, toUnit) {
    const conversions = {
      'm': 1,
      'km': 0.001,
      'miles': 0.000621371,
      'feet': 3.28084
    };
    
    if (!conversions[fromUnit] || !conversions[toUnit]) {
      throw new Error('Unité non supportée');
    }
    
    return distance * (conversions[fromUnit] / conversions[toUnit]);
  }
}