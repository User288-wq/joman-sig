// ProjectionAwareImporter.js
import { 
  GeoJSON, 
  KML, 
  GPX, 
  WKT 
} from 'ol/format';
import { 
  transformCoordinate, 
  transformExtent,
  detectProjectionFromPRJ 
} from './projections';
import Feature from 'ol/Feature';

class ProjectionAwareImporter {
  constructor(targetProjection = 'EPSG:3857') {
    this.targetProjection = targetProjection;
    this.formats = {
      'geojson': new GeoJSON(),
      'kml': new KML(),
      'gpx': new GPX(),
      'wkt': new WKT()
    };
  }

  // Détecter la projection d'un fichier
  async detectFileProjection(file, extension) {
    // 1. Vérifier si c'est un fichier PRJ
    if (extension === '.prj') {
      return await detectProjectionFromPRJ(file);
    }

    // 2. Vérifier si le nom contient une indication
    const filename = file.name.toLowerCase();
    if (filename.includes('lambert93') || filename.includes('rgf93')) {
      return 'EPSG:2154';
    } else if (filename.includes('wgs84') || filename.includes('4326')) {
      return 'EPSG:4326';
    } else if (filename.includes('utm')) {
      if (filename.includes('31n')) return 'EPSG:32631';
      if (filename.includes('32n')) return 'EPSG:32632';
    }

    // 3. Par défaut selon l'extension
    const defaults = {
      '.geojson': 'EPSG:4326',  // GeoJSON est toujours en WGS84
      '.kml': 'EPSG:4326',      // KML aussi
      '.gpx': 'EPSG:4326',      // GPX aussi
      '.shp': 'EPSG:4326',      // Shapefile souvent en WGS84 ou local
      '.csv': 'EPSG:4326'       // CSV avec lat/lon
    };

    return defaults[extension] || 'EPSG:4326';
  }

  // Lire un fichier avec reprojection
  async readFileWithProjection(file, sourceProjection = null) {
    const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] || '';
    
    // Détecter la projection si non fournie
    if (!sourceProjection) {
      sourceProjection = await this.detectFileProjection(file, extension);
    }

    // Lire le fichier selon son format
    const text = await file.text();
    let features = [];

    switch (extension) {
      case '.geojson':
      case '.json':
        const geojson = JSON.parse(text);
        
        // Vérifier la projection dans le GeoJSON
        if (geojson.crs && geojson.crs.properties && geojson.crs.properties.name) {
          const crsName = geojson.crs.properties.name;
          if (crsName.includes('EPSG:')) {
            sourceProjection = crsName;
          }
        }
        
        features = this.formats.geojson.readFeatures(geojson, {
          dataProjection: sourceProjection,
          featureProjection: this.targetProjection
        });
        break;

      case '.kml':
        features = this.formats.kml.readFeatures(text, {
          dataProjection: sourceProjection,
          featureProjection: this.targetProjection
        });
        break;

      case '.gpx':
        features = this.formats.gpx.readFeatures(text, {
          dataProjection: sourceProjection,
          featureProjection: this.targetProjection
        });
        break;

      case '.wkt':
        const wktFeatures = this.formats.wkt.readFeatures(text, {
          dataProjection: sourceProjection,
          featureProjection: this.targetProjection
        });
        features = wktFeatures;
        break;

      default:
        throw new Error(`Format non supporté: ${extension}`);
    }

    // Ajouter les métadonnées de projection
    features.forEach(feature => {
      feature.set('sourceProjection', sourceProjection);
      feature.set('targetProjection', this.targetProjection);
      feature.set('importDate', new Date().toISOString());
    });

    return {
      features,
      metadata: {
        filename: file.name,
        sourceProjection,
        targetProjection: this.targetProjection,
        featureCount: features.length,
        fileSize: file.size,
        extension
      }
    };
  }

  // Reprojection manuelle d'une feature
  reprojectFeature(feature, targetProj) {
    const geometry = feature.getGeometry();
    if (!geometry) return feature;

    const sourceProj = feature.get('sourceProjection') || 'EPSG:4326';
    
    // Cloner la feature
    const newFeature = feature.clone();
    
    // Reprojection des coordonnées
    geometry.applyTransform((coordinates, output, dimension) => {
      const transformed = [];
      
      for (let i = 0; i < coordinates.length; i += dimension) {
        const point = coordinates.slice(i, i + dimension);
        const transformedPoint = transformCoordinate(
          point, 
          sourceProj, 
          targetProj
        );
        transformed.push(...transformedPoint);
      }
      
      return transformed;
    });
    
    newFeature.set('targetProjection', targetProj);
    newFeature.setGeometry(geometry);
    
    return newFeature;
  }

  // Convertir entre systèmes
  async convertFile(file, targetProjection, format = 'geojson') {
    const { features, metadata } = await this.readFileWithProjection(file);
    
    // Reprojecter si nécessaire
    if (metadata.sourceProjection !== targetProjection) {
      features.forEach(feature => {
        this.reprojectFeature(feature, targetProjection);
      });
    }
    
    // Exporter dans le format demandé
    return this.exportFeatures(features, format, targetProjection);
  }

  // Exporter des features
  exportFeatures(features, format = 'geojson', projection = 'EPSG:4326') {
    switch (format.toLowerCase()) {
      case 'geojson':
        return this.formats.geojson.writeFeatures(features, {
          dataProjection: projection,
          featureProjection: this.targetProjection
        });
        
      case 'kml':
        return this.formats.kml.writeFeatures(features, {
          dataProjection: projection,
          featureProjection: this.targetProjection
        });
        
      default:
        throw new Error(`Format d'export non supporté: ${format}`);
    }
  }
}

export default ProjectionAwareImporter;