import { saveAs } from 'file-saver';
import * as turf from '@turf/turf';

class ExportService {
  static exportToGeoJSON(features, filename = 'export.geojson') {
    const geojson = {
      type: 'FeatureCollection',
      features: features.map(feature => ({
        type: 'Feature',
        geometry: feature.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'),
        properties: feature.getProperties()
      }))
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: 'application/json;charset=utf-8'
    });
    
    saveAs(blob, filename);
  }

  static exportToCSV(features, filename = 'export.csv') {
    if (features.length === 0) {
      throw new Error('Aucune donnée à exporter');
    }

    const headers = Object.keys(features[0].getProperties());
    const rows = features.map(feature => {
      const props = feature.getProperties();
      return headers.map(header => `"${props[header] || ''}"`).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    
    saveAs(blob, filename);
  }

  static exportToKML(features, filename = 'export.kml') {
    const kmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${filename}</name>`;

    const kmlFooter = `  </Document>
</kml>`;

    const placemarks = features.map(feature => {
      const geometry = feature.getGeometry();
      const props = feature.getProperties();
      
      let coordinates = '';
      if (geometry.getType() === 'Point') {
        const coord = geometry.getCoordinates();
        coordinates = `${coord[0]},${coord[1]},0`;
      }
      
      return `    <Placemark>
      <name>${props.name || 'Feature'}</name>
      <Point>
        <coordinates>${coordinates}</coordinates>
      </Point>
    </Placemark>`;
    }).join('\n');

    const kmlContent = [kmlHeader, placemarks, kmlFooter].join('\n');
    const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
    
    saveAs(blob, filename);
  }

  static exportToShapefile(features) {
    // Note: Cette fonction nécessiterait une bibliothèque supplémentaire
    // comme shp-write ou shapefile-js
    console.warn('Export Shapefile non implémenté. Utilisez GeoJSON ou CSV.');
    this.exportToGeoJSON(features, 'export.geojson');
  }
}

export default ExportService;
