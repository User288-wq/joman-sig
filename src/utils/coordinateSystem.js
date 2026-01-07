// src/scripts/geospatial/coordinateSystem.js
export class CoordinateSystem {
  // Définitions EPSG courantes
  static EPSG_CODES = {
    'EPSG:4326': { // WGS 84
      name: 'WGS 84',
      proj4: '+proj=longlat +datum=WGS84 +no_defs',
      unit: 'degrees',
      bounds: [-180, -90, 180, 90]
    },
    'EPSG:3857': { // Web Mercator
      name: 'Web Mercator',
      proj4: '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs',
      unit: 'meters',
      bounds: [-20037508.34, -20048966.10, 20037508.34, 20048966.10]
    },
    'EPSG:2154': { // Lambert 93
      name: 'RGF93 / Lambert-93',
      proj4: '+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      unit: 'meters',
      bounds: [-378305.81, 6093287.28, 1212610.74, 7186901.68]
    },
    'EPSG:32631': { // UTM Zone 31N
      name: 'WGS 84 / UTM zone 31N',
      proj4: '+proj=utm +zone=31 +datum=WGS84 +units=m +no_defs',
      unit: 'meters',
      bounds: [166021.44, 0.00, 833978.55, 9329005.18]
    }
  };

  /**
   * Conversion de coordonnées entre systèmes
   */
  static transform(coordinates, fromEPSG, toEPSG) {
    if (!coordinates || !fromEPSG || !toEPSG) {
      throw new Error('Paramètres invalides');
    }

    if (fromEPSG === toEPSG) {
      return coordinates;
    }

    const fromDef = this.EPSG_CODES[fromEPSG];
    const toDef = this.EPSG_CODES[toEPSG];
    
    if (!fromDef || !toDef) {
      throw new Error(`Système de coordonnées non supporté: ${fromEPSG} ou ${toEPSG}`);
    }

    // Conversions simplifiées - dans la réalité, utiliser Proj4js
    if (fromEPSG === 'EPSG:4326' && toEPSG === 'EPSG:3857') {
      return this.wgs84ToWebMercator(coordinates);
    } else if (fromEPSG === 'EPSG:3857' && toEPSG === 'EPSG:4326') {
      return this.webMercatorToWgs84(coordinates);
    } else {
      // Conversion générique (approximative)
      return this.genericTransform(coordinates, fromDef, toDef);
    }
  }

  /**
   * WGS84 (degrés) -> Web Mercator (mètres)
   */
  static wgs84ToWebMercator(coordinates) {
    const transformPoint = (lon, lat) => {
      const x = lon * 20037508.34 / 180;
      let y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
      y = y * 20037508.34 / 180;
      return [x, y];
    };

    return this.transformGeometry(coordinates, transformPoint);
  }

  /**
   * Web Mercator (mètres) -> WGS84 (degrés)
   */
  static webMercatorToWgs84(coordinates) {
    const transformPoint = (x, y) => {
      const lon = (x / 20037508.34) * 180;
      let lat = (y / 20037508.34) * 180;
      lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
      return [lon, lat];
    };

    return this.transformGeometry(coordinates, transformPoint);
  }

  /**
   * Transformation générique
   */
  static genericTransform(coordinates, fromDef, toDef) {
    // Pour une vraie application, intégrer Proj4js
    console.warn('Transformation générique - précision limitée');
    return coordinates;
  }

  /**
   * Vérification des limites d'un système de coordonnées
   */
  static isInBounds(coordinates, epsgCode) {
    const def = this.EPSG_CODES[epsgCode];
    if (!def || !def.bounds) {
      return true; // Pas de vérification possible
    }

    const [minX, minY, maxX, maxY] = def.bounds;
    const coords = this.extractAllCoordinates(coordinates);
    
    return coords.every(([x, y]) => 
      x >= minX && x <= maxX && y >= minY && y <= maxY
    );
  }

  /**
   * Obtention des informations d'un système de coordonnées
   */
  static getCRSInfo(epsgCode) {
    const def = this.EPSG_CODES[epsgCode];
    if (!def) {
      throw new Error(`Code EPSG non supporté: ${epsgCode}`);
    }

    return {
      code: epsgCode,
      name: def.name,
      unit: def.unit,
      bounds: def.bounds,
      proj4: def.proj4
    };
  }

  /**
   * Liste des systèmes de coordonnées supportés
   */
  static getSupportedCRS() {
    return Object.keys(this.EPSG_CODES).map(code => ({
      code,
      ...this.EPSG_CODES[code]
    }));
  }

  // Méthodes utilitaires
  static transformGeometry(coordinates, transformPoint) {
    if (Array.isArray(coordinates[0]) && Array.isArray(coordinates[0][0])) {
      // Tableau de tableaux (ligne ou polygone)
      return coordinates.map(ring => 
        ring.map(coord => transformPoint(coord[0], coord[1]))
      );
    } else if (Array.isArray(coordinates[0])) {
      // Tableau de points
      return coordinates.map(coord => transformPoint(coord[0], coord[1]));
    } else {
      // Point unique
      return transformPoint(coordinates[0], coordinates[1]);
    }
  }

  static extractAllCoordinates(geometry) {
    const coords = [];
    
    const extract = (coord) => {
      if (Array.isArray(coord[0])) {
        coord.forEach(c => extract(c));
      } else {
        coords.push(coord);
      }
    };
    
    extract(geometry);
    return coords;
  }

  /**
   * Calcul de la résolution à une échelle donnée
   */
  static calculateResolution(scale, epsgCode = 'EPSG:3857', dpi = 96) {
    const def = this.EPSG_CODES[epsgCode];
    if (!def) {
      throw new Error(`Code EPSG non supporté: ${epsgCode}`);
    }

    // Formule: resolution = scale * 0.0254 / dpi
    const inchesPerMeter = def.unit === 'meters' ? 39.3701 : 1;
    return (scale * 0.0254) / (dpi * inchesPerMeter);
  }

  /**
   * Calcul de l'échelle à une résolution donnée
   */
  static calculateScale(resolution, epsgCode = 'EPSG:3857', dpi = 96) {
    const def = this.EPSG_CODES[epsgCode];
    if (!def) {
      throw new Error(`Code EPSG non supporté: ${epsgCode}`);
    }

    const inchesPerMeter = def.unit === 'meters' ? 39.3701 : 1;
    return (resolution * dpi * inchesPerMeter) / 0.0254;
  }
}