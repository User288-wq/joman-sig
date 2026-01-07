// src/scripts/geospatial/wktToGeoJSON.js
export class WKTToGeoJSONConverter {
  static convert(wkt) {
    if (!wkt || typeof wkt !== 'string') {
      throw new Error('WKT invalide');
    }

    const normalized = wkt.toUpperCase().trim();
    const geometryType = normalized.split(' ')[0];
    
    switch(geometryType) {
      case 'POINT':
        return this.parsePoint(normalized);
      case 'LINESTRING':
        return this.parseLineString(normalized);
      case 'POLYGON':
        return this.parsePolygon(normalized);
      case 'MULTIPOINT':
        return this.parseMultiPoint(normalized);
      case 'MULTILINESTRING':
        return this.parseMultiLineString(normalized);
      case 'MULTIPOLYGON':
        return this.parseMultiPolygon(normalized);
      case 'GEOMETRYCOLLECTION':
        return this.parseGeometryCollection(normalized);
      default:
        throw new Error(`Type WKT non supporté: ${geometryType}`);
    }
  }

  static parsePoint(wkt) {
    const coords = this.extractCoordinates(wkt);
    return {
      type: 'Point',
      coordinates: coords[0]
    };
  }

  static parseLineString(wkt) {
    const coords = this.extractCoordinates(wkt);
    return {
      type: 'LineString',
      coordinates: coords
    };
  }

  static parsePolygon(wkt) {
    const rings = this.extractRings(wkt);
    return {
      type: 'Polygon',
      coordinates: rings
    };
  }

  static parseMultiPoint(wkt) {
    const points = this.extractMultiCoordinates(wkt);
    return {
      type: 'MultiPoint',
      coordinates: points
    };
  }

  static parseMultiLineString(wkt) {
    const lines = this.extractMultiCoordinates(wkt);
    return {
      type: 'MultiLineString',
      coordinates: lines
    };
  }

  static parseMultiPolygon(wkt) {
    const polygons = this.extractMultiPolygons(wkt);
    return {
      type: 'MultiPolygon',
      coordinates: polygons
    };
  }

  static parseGeometryCollection(wkt) {
    const content = wkt.match(/GEOMETRYCOLLECTION\s*\((.+)\)/i);
    if (!content) {
      throw new Error('Format GEOMETRYCOLLECTION invalide');
    }
    
    const geometries = this.splitGeometryCollection(content[1]);
    return {
      type: 'GeometryCollection',
      geometries: geometries.map(geom => this.convert(geom))
    };
  }

  static extractCoordinates(wkt) {
    const match = wkt.match(/\(([^()]+)\)/);
    if (!match) throw new Error('Format WKT invalide');
    
    return match[1].trim().split(',').map(coord => {
      const parts = coord.trim().split(/\s+/).map(Number);
      return parts.length >= 2 ? parts : null;
    }).filter(coord => coord !== null);
  }

  static extractRings(wkt) {
    const match = wkt.match(/POLYGON\s*\((\([^)]+\)(?:,\s*\([^)]+\))*)\)/i);
    if (!match) throw new Error('Format POLYGON invalide');
    
    return match[1].split(/\),\s*\(/).map(ring => {
      return ring.replace(/[()]/g, '').split(',').map(coord => {
        const parts = coord.trim().split(/\s+/).map(Number);
        return parts.length >= 2 ? parts : null;
      }).filter(coord => coord !== null);
    });
  }

  static extractMultiCoordinates(wkt) {
    const match = wkt.match(/\(([^)]+)\)/);
    if (!match) throw new Error('Format WKT invalide');
    
    return match[1].split(/\),\s*\(/).map(group => {
      return group.replace(/[()]/g, '').split(',').map(coord => {
        const parts = coord.trim().split(/\s+/).map(Number);
        return parts.length >= 2 ? parts : null;
      }).filter(coord => coord !== null);
    });
  }

  static extractMultiPolygons(wkt) {
    const match = wkt.match(/MULTIPOLYGON\s*\((\([^)]+\)(?:,\s*\([^)]+\))*)\)/i);
    if (!match) throw new Error('Format MULTIPOLYGON invalide');
    
    return match[1].split(/\)\s*,\s*\(/).map(polygon => {
      return polygon.replace(/[()]/g, '').split(/\),\s*\(/).map(ring => {
        return ring.split(',').map(coord => {
          const parts = coord.trim().split(/\s+/).map(Number);
          return parts.length >= 2 ? parts : null;
        }).filter(coord => coord !== null);
      });
    });
  }

  static splitGeometryCollection(content) {
    const geometries = [];
    let depth = 0;
    let current = '';
    
    for (let char of content) {
      if (char === '(') depth++;
      if (char === ')') depth--;
      
      if (char === ',' && depth === 0) {
        geometries.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    if (current.trim()) {
      geometries.push(current.trim());
    }
    
    return geometries;
  }
}