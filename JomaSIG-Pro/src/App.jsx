import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import "./App.css";
import "ol/ol.css";
import "bootstrap/dist/css/bootstrap.min.css";

// ====================
// IMPORTS OPENLAYERS CORRIGÉS ET COMPLÉTÉS
// ====================

// Imports de base d'OpenLayers
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Stroke, Fill, Circle as CircleStyle, Text } from "ol/style";
import { fromLonLat, toLonLat, transform, transformExtent } from "ol/proj";
import { Select, Draw, Modify } from "ol/interaction";
import { click } from "ol/events/condition";
import Overlay from "ol/Overlay";
import { boundingExtent } from "ol/extent";
import Feature from "ol/Feature";

// Formats de fichiers
import GeoJSON from "ol/format/GeoJSON";
import KML from "ol/format/KML";
import GPX from "ol/format/GPX";
import WKT from "ol/format/WKT";
import GML from "ol/format/GML";

// Géométries
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import Polygon from "ol/geom/Polygon";
import Circle from "ol/geom/Circle";

// Gestion des projections
import proj4 from "proj4";
import { register } from "ol/proj/proj4";

// SIG avancé
import * as turf from "@turf/turf";

// ====================
// DÉFINITIONS DES PROJECTIONS
// ====================

// Définir les projections Proj4
proj4.defs([
  ['EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs'],
  ['EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs'],
  ['EPSG:2154', '+proj=lcc +lat_0=46.5 +lon_0=3 +lat_1=49 +lat_2=44 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'],
  ['EPSG:3949', '+proj=lcc +lat_0=46.5 +lon_0=3 +lat_1=44 +lat_2=49 +x_0=1700000 +y_0=6200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'],
  ['EPSG:32631', '+proj=utm +zone=31 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'],
  ['EPSG:32632', '+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'],
  ['EPSG:27571', '+proj=lcc +lat_1=49.5 +lat_0=49.5 +lon_0=0 +k_0=0.999877341 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs'],
  ['EPSG:27572', '+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs'],
  ['EPSG:27573', '+proj=lcc +lat_1=44.1 +lat_0=44.1 +lon_0=0 +k_0=0.999877499 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs'],
  ['EPSG:3035', '+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'],
  ['EPSG:4269', '+proj=longlat +ellps=GRS80 +datum=NAD83 +no_defs'],
  ['EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs'],
  ['EPSG:3395', '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'],
  ['EPSG:2056', '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs'],
  ['EPSG:23032', '+proj=utm +zone=32 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs']
]);

// Enregistrer dans OpenLayers
register(proj4);

// Catalogue des projections
const PROJECTIONS_CATALOG = {
  'EPSG:4326': { name: 'WGS 84', units: 'degrees', area: 'Monde', type: 'géographique' },
  'EPSG:3857': { name: 'Web Mercator', units: 'meters', area: 'Monde', type: 'projectée' },
  'EPSG:2154': { name: 'Lambert 93', units: 'meters', area: 'France', type: 'projectée' },
  'EPSG:3949': { name: 'RGF93 / CC50', units: 'meters', area: 'Corse', type: 'projectée' },
  'EPSG:32631': { name: 'UTM 31N', units: 'meters', area: 'Europe Ouest', type: 'projectée' },
  'EPSG:32632': { name: 'UTM 32N', units: 'meters', area: 'Europe Ouest', type: 'projectée' },
  'EPSG:27571': { name: 'NTF Nord France', units: 'meters', area: 'Nord France', type: 'projectée' },
  'EPSG:27572': { name: 'NTF Centre France', units: 'meters', area: 'Centre France', type: 'projectée' },
  'EPSG:27573': { name: 'NTF Sud France', units: 'meters', area: 'Sud France', type: 'projectée' },
  'EPSG:3035': { name: 'ETRS89 / LAEA Europe', units: 'meters', area: 'Europe', type: 'projectée' },
  'EPSG:4269': { name: 'NAD83', units: 'degrees', area: 'Amérique Nord', type: 'géographique' },
  'EPSG:27700': { name: 'OSGB36 / British Grid', units: 'meters', area: 'Royaume-Uni', type: 'projectée' },
  'EPSG:3395': { name: 'WGS 84 / World Mercator', units: 'meters', area: 'Monde', type: 'projectée' },
  'EPSG:2056': { name: 'CH1903+ / LV95', units: 'meters', area: 'Suisse', type: 'projectée' },
  'EPSG:23032': { name: 'ED50 / UTM zone 32N', units: 'meters', area: 'Europe', type: 'projectée' }
};

// ====================
// APPLICATION PRINCIPALE
// ====================

function App() {
  const mapRef = useRef();
  const popupRef = useRef();
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [center, setCenter] = useState([2.3522, 48.8566]);
  const [mapLayers, setMapLayers] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLayerPanel, setShowLayerPanel] = useState(true);
  const [projectName, setProjectName] = useState("Projet JOMA SIG");
  const [projectStatus, setProjectStatus] = useState("draft");
  const [currentProjection, setCurrentProjection] = useState('EPSG:3857');
  const [supportedFormats] = useState([
    { name: 'GeoJSON', extensions: ['.geojson', '.json'], handler: 'geojson', icon: '' },
    { name: 'KML', extensions: ['.kml'], handler: 'kml', icon: '' },
    { name: 'GPX', extensions: ['.gpx'], handler: 'gpx', icon: '' },
    { name: 'WKT', extensions: ['.wkt', '.txt'], handler: 'wkt', icon: '📝' },
    { name: 'GML', extensions: ['.gml'], handler: 'gml', icon: '📊' },
    { name: 'Shapefile (ZIP)', extensions: ['.zip'], handler: 'shp', icon: '📦' },
    { name: 'TopoJSON', extensions: ['.topojson', '.json'], handler: 'topojson', icon: '' },
    { name: 'CSV géolocalisé', extensions: ['.csv', '.txt'], handler: 'csv', icon: '' },
    { name: 'DXF', extensions: ['.dxf'], handler: 'dxf', icon: '' },
    { name: 'GeoTIFF', extensions: ['.tif', '.tiff'], handler: 'geotiff', icon: '' },
    { name: 'JPEG/PNG géoréférencé', extensions: ['.jpg', '.jpeg', '.png'], handler: 'image', icon: '' },
    { name: 'MVT (Vector Tiles)', extensions: ['.pbf', '.mvt'], handler: 'mvt', icon: '' },
    { name: 'GPKG', extensions: ['.gpkg'], handler: 'gpkg', icon: '' },
    { name: 'Spatialite', extensions: ['.sqlite', '.db'], handler: 'spatialite', icon: '' },
    { name: 'PostGIS Export', extensions: ['.sql', '.backup'], handler: 'postgis', icon: '' }
  ]);

  // ====================
  // INITIALISATION CARTE
  // ====================
  useEffect(() => {
    if (!mapRef.current || map) return;

    console.log(" Initialisation JOMA SIG Pro...");

    try {
      const newMap = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
            visible: true,
            name: 'OpenStreetMap'
          })
        ],
        view: new View({
          center: fromLonLat(center),
          zoom: zoom,
          maxZoom: 20,
          minZoom: 2,
          projection: currentProjection
        }),
        controls: []
      });

      // Popup
      const popup = new Overlay({
        element: popupRef.current,
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -10]
      });
      newMap.addOverlay(popup);

      // Interaction de sélection
      const select = new Select({
        condition: click,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 0, 0.4)'
          }),
          stroke: new Stroke({
            color: '#ffcc00',
            width: 3
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: '#ffcc00'
            })
          })
        })
      });

      select.on('select', (e) => {
        if (e.selected.length > 0) {
          const feature = e.selected[0];
          const coordinates = feature.getGeometry().getCoordinates();
          const props = feature.getProperties();
          
          setSelectedFeature({
            id: feature.getId(),
            geometry: feature.getGeometry().getType(),
            properties: props,
            coordinates: toLonLat(coordinates),
            feature: feature
          });
          
          popup.setPosition(coordinates);
          // Afficher le popup
          if (popupRef.current) {
            popupRef.current.style.display = 'block';
          }
        } else {
          setSelectedFeature(null);
          popup.setPosition(undefined);
          if (popupRef.current) {
            popupRef.current.style.display = 'none';
          }
        }
      });

      newMap.addInteraction(select);

      // Écouteurs d'événements
      newMap.getView().on('change:resolution', () => {
        setZoom(newMap.getView().getZoom().toFixed(2));
      });

      newMap.getView().on('change:center', () => {
        const centerCoords = toLonLat(newMap.getView().getCenter());
        setCenter(centerCoords);
      });

      setMap(newMap);
      console.log(" Carte initialisée avec succès !");

    } catch (error) {
      console.error(" Erreur initialisation:", error);
    }
  }, []);

  // ====================
  // FONCTIONS D'IMPORT MULTI-FORMATS
  // ====================

  const detectFileFormat = (filename) => {
    const extension = filename.toLowerCase().match(/\.[^.]+$/)?.[0] || '';
    return supportedFormats.find(format => 
      format.extensions.includes(extension)
    );
  };

  const readFileData = async (file, format) => {
    const text = await file.text();
    
    try {
      switch (format.handler) {
        case 'geojson':
          const geojson = JSON.parse(text);
          return new GeoJSON().readFeatures(geojson, {
            dataProjection: 'EPSG:4326',
            featureProjection: currentProjection
          });
          
        case 'kml':
          return new KML().readFeatures(text, {
            dataProjection: 'EPSG:4326',
            featureProjection: currentProjection
          });
          
        case 'gpx':
          return new GPX().readFeatures(text, {
            dataProjection: 'EPSG:4326',
            featureProjection: currentProjection
          });
          
        case 'wkt':
          const wkt = text.trim();
          const features = [];
          // Lire chaque ligne comme une feature WKT
          wkt.split('\n').forEach(line => {
            try {
              const feature = new WKT().readFeature(line, {
                dataProjection: 'EPSG:4326',
                featureProjection: currentProjection
              });
              features.push(feature);
            } catch (e) {
              console.warn('Ligne WKT ignorée:', line);
            }
          });
          return features;
          
        case 'gml':
          return new GML().readFeatures(text, {
            dataProjection: 'EPSG:4326',
            featureProjection: currentProjection
          });
          
        default:
          throw new Error(`Format non supporté: ${format.name}`);
      }
    } catch (error) {
      console.error(`Erreur lecture ${format.name}:`, error);
      throw new Error(`Impossible de lire le fichier ${format.name}: ${error.message}`);
    }
  };

  const handleImportFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = supportedFormats.flatMap(f => f.extensions).join(',');
    input.multiple = true;
    
    input.onchange = async (e) => {
      const files = Array.from(e.target.files);
      if (!files.length || !map) return;
      
      setIsLoading(true);
      
      const importResults = [];
      
      for (const file of files) {
        try {
          const format = detectFileFormat(file.name);
          if (!format) {
            importResults.push({
              file: file.name,
              success: false,
              error: "Format non supporté"
            });
            continue;
          }
          
          // Lire les features
          const features = await readFileData(file, format);
          
          if (!features || features.length === 0) {
            importResults.push({
              file: file.name,
              success: false,
              error: "Aucune donnée valide"
            });
            continue;
          }
          
          // Créer la couche
          const vectorSource = new VectorSource({ features });
          const vectorLayer = new VectorLayer({
            source: vectorSource,
            name: file.name.replace(/\.[^/.]+$/, ""),
            style: (feature) => {
              const geomType = feature.getGeometry().getType();
              let style;
              
              switch (geomType) {
                case 'Point':
                  style = new Style({
                    image: new CircleStyle({
                      radius: 6,
                      fill: new Fill({ color: '#3b82f6' }),
                      stroke: new Stroke({ color: '#FFF', width: 2 })
                    })
                  });
                  break;
                case 'LineString':
                  style = new Style({
                    stroke: new Stroke({
                      color: '#ef4444',
                      width: 3,
                      lineDash: [5, 5]
                    })
                  });
                  break;
                case 'Polygon':
                  style = new Style({
                    fill: new Fill({
                      color: 'rgba(59, 130, 246, 0.3)'
                    }),
                    stroke: new Stroke({
                      color: '#3b82f6',
                      width: 2
                    })
                  });
                  break;
                default:
                  style = new Style({
                    fill: new Fill({
                      color: 'rgba(156, 163, 175, 0.3)'
                    }),
                    stroke: new Stroke({
                      color: '#9ca3af',
                      width: 1
                    })
                  });
              }
              
              return style;
            }
          });
          
          map.addLayer(vectorLayer);
          
          // Ajuster la vue (seulement pour le premier fichier)
          if (importResults.length === 0) {
            const extent = vectorSource.getExtent();
            if (extent && extent[0] !== Infinity) {
              map.getView().fit(extent, { 
                padding: [50, 50, 50, 50], 
                maxZoom: 15,
                duration: 1000 
              });
            }
          }
          
          // Mettre à jour l'état
          const newLayer = {
            id: `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name.replace(/\.[^/.]+$/, ""),
            type: 'vector',
            format: format.name,
            visible: true,
            featureCount: features.length,
            layer: vectorLayer,
            icon: format.icon
          };
          
          setMapLayers(prev => [...prev, newLayer]);
          
          importResults.push({
            file: file.name,
            success: true,
            featureCount: features.length,
            format: format.name
          });
          
        } catch (error) {
          console.error(` Erreur import ${file.name}:`, error);
          importResults.push({
            file: file.name,
            success: false,
            error: error.message
          });
        }
      }
      
      // Afficher le récapitulatif
      const successCount = importResults.filter(r => r.success).length;
      const totalCount = importResults.length;
      
      if (successCount > 0) {
        alert(`✅ Import terminé : ${successCount}/${totalCount} fichiers importés avec succès`);
      } else {
        alert("❌ Aucun fichier n'a pu être importé");
      }
      
      setIsLoading(false);
    };
    
    input.click();
  };

  // ====================
  // FONCTIONS SIG AVANCÉES
  // ====================

  const handleBuffer = () => {
    if (!selectedFeature || !selectedFeature.feature) {
      alert(" Sélectionnez d'abord une entité sur la carte");
      return;
    }
    
    const distance = parseFloat(prompt("Distance du buffer (mètres):", "100"));
    if (!distance || isNaN(distance) || distance <= 0) {
      alert(" Distance invalide");
      return;
    }
    
    try {
      // Convertir la feature OpenLayers en GeoJSON
      const format = new GeoJSON();
      const geojson = format.writeFeatureObject(selectedFeature.feature, {
        dataProjection: 'EPSG:4326',
        featureProjection: currentProjection
      });
      
      // Créer le buffer avec Turf.js
      const buffered = turf.buffer(geojson, distance / 1000, { units: 'kilometers' });
      
      // Ajouter le buffer à la carte
      const bufferSource = new VectorSource({
        features: format.readFeatures(buffered, {
          dataProjection: 'EPSG:4326',
          featureProjection: currentProjection
        })
      });
      
      const bufferLayer = new VectorLayer({
        source: bufferSource,
        name: `Buffer ${distance}m`,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 0, 0, 0.3)'
          }),
          stroke: new Stroke({
            color: '#ff0000',
            width: 2
          })
        })
      });
      
      map.addLayer(bufferLayer);
      
      // Mettre à jour les couches
      setMapLayers(prev => [...prev, {
        id: `buffer-${Date.now()}`,
        name: `Buffer ${distance}m`,
        type: 'buffer',
        visible: true,
        featureCount: 1,
        icon: '⭕'
      }]);
      
      alert(`✅ Buffer de ${distance}m créé !`);
      
    } catch (error) {
      console.error(" Erreur buffer:", error);
      alert(" Erreur lors de la création du buffer");
    }
  };

  const handleMeasureDistance = () => {
    if (!map) return;
    
    // Nettoyer les outils précédents
    const existingDraw = map.getInteractions().getArray()
      .find(i => i.get('name') === 'measure-distance');
    if (existingDraw) {
      map.removeInteraction(existingDraw);
      alert(" Outil de mesure désactivé");
      return;
    }
    
    let draw = null;
    let measureTooltipElement = null;
    let measureTooltip = null;
    
    // Créer l'élément tooltip
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    measureTooltipElement.style.cssText = `
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 10px 15px;
      border-radius: 10px;
      font-weight: bold;
      font-size: 14px;
      border: 2px solid #4CAF50;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      z-index: 1000;
      min-width: 150px;
      text-align: center;
    `;
    
    measureTooltip = new Overlay({
      element: measureTooltipElement,
      offset: [0, -25],
      positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);
    
    // Source temporaire
    const source = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: source,
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(255, 0, 0, 0.9)',
          width: 4,
          lineDash: [10, 5]
        }),
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({ color: 'rgba(255, 255, 255, 0.9)' }),
          stroke: new Stroke({ color: 'rgba(255, 0, 0, 0.9)', width: 3 })
        })
      })
    });
    
    map.addLayer(vectorLayer);
    
    // Configurer l'outil de dessin
    draw = new Draw({
      source: source,
      type: 'LineString',
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(255, 0, 0, 0.8)',
          width: 4,
          lineDash: [15, 10]
        }),
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({ color: 'rgba(255, 255, 255, 0.9)' }),
          stroke: new Stroke({ color: 'rgba(255, 0, 0, 0.9)', width: 3 })
        })
      })
    });
    
    draw.set('name', 'measure-distance');
    map.addInteraction(draw);
    
    let sketchFeature = null;
    let tooltipCoord = null;
    
    // Événements
    draw.on('drawstart', (evt) => {
      sketchFeature = evt.feature;
      measureTooltipElement.innerHTML = '🎯 <b>Cliquez pour commencer la mesure</b><br><small>Double-cliquez pour terminer</small>';
      measureTooltip.setPosition(evt.coordinate);
      tooltipCoord = evt.coordinate;
    });
    
    draw.on('drawend', (evt) => {
      const line = evt.feature.getGeometry();
      const length = getLength(line);
      
      let output, unit;
      if (length > 1000) {
        output = (length / 1000).toFixed(2);
        unit = 'km';
      } else {
        output = length.toFixed(2);
        unit = 'm';
      }
      
      const result = `${output} ${unit}`;
      
      measureTooltipElement.innerHTML = `
        <div style="text-align: center;">
          <div style="font-size: 16px; color: #4CAF50;"> <b>MESURE TERMINÉE</b></div>
          <div style="font-size: 24px; font-weight: bold; margin: 5px 0;">${result}</div>
          <div style="font-size: 12px; opacity: 0.8;">Cliquez à nouveau pour une nouvelle mesure</div>
        </div>
      `;
      
      const coords = line.getLastCoordinate();
      measureTooltip.setPosition(coords);
      
      // Sauvegarder la mesure
      const measureFeature = new Feature({
        geometry: line,
        length: length,
        label: result,
        unit: unit,
        date: new Date().toISOString()
      });
      
      measureFeature.setStyle(new Style({
        stroke: new Stroke({
          color: 'rgba(50, 150, 50, 0.9)',
          width: 4,
          lineDash: [5, 5]
        }),
        text: new Text({
          text: result,
          font: 'bold 16px Arial',
          fill: new Fill({ color: '#000000' }),
          stroke: new Stroke({ color: '#ffffff', width: 4 }),
          offsetY: -20,
          backgroundFill: new Fill({ color: 'rgba(255, 255, 255, 0.7)' }),
          backgroundStroke: new Stroke({ color: '#000000', width: 1 }),
          padding: [5, 10, 5, 10]
        })
      }));
      
      source.clear();
      source.addFeature(measureFeature);
      
      // Afficher l'alerte
      alert(` DISTANCE MESURÉE : ${result}\n\nLa mesure a été ajoutée à la carte.`);
      
      // Réinitialiser après 5 secondes
      setTimeout(() => {
        measureTooltip.setPosition(undefined);
      }, 5000);
    });
    
    draw.on('drawabort', () => {
      source.clear();
      measureTooltip.setPosition(undefined);
      alert(" Mesure annulée");
    });
    
    // Mise à jour en temps réel pendant le dessin
    map.on('pointermove', (evt) => {
      if (sketchFeature && evt.dragging === false) {
        const geom = sketchFeature.getGeometry();
        if (geom && geom.getType() === 'LineString') {
          const coordinates = geom.getCoordinates();
          if (coordinates.length > 1) {
            const line = new LineString(coordinates);
            const length = getLength(line);
            
            let displayLength;
            if (length > 1000) {
              displayLength = `${(length / 1000).toFixed(2)} km`;
            } else {
              displayLength = `${length.toFixed(2)} m`;
            }
            
            measureTooltipElement.innerHTML = `
              <div style="text-align: center;">
                <div style="font-size: 14px;"> Distance en temps réel:</div>
                <div style="font-size: 20px; color: #4CAF50; font-weight: bold;">
                  ${displayLength}
                </div>
                <div style="font-size: 11px; opacity: 0.7;">
                  ${coordinates.length} point(s) - Double-cliquez pour terminer
                </div>
              </div>
            `;
            
            measureTooltip.setPosition(evt.coordinate);
          }
        }
      }
    });
    
    alert(" OUTIL DE MESURE ACTIVÉ\n\n Cliquez pour ajouter des points\n Double-cliquez pour terminer\n Échap pour annuler");
  };

  // ====================
  // GESTION DES COUCHES
  // ====================

  const toggleLayerVisibility = (layerId) => {
    const layer = mapLayers.find(l => l.id === layerId);
    if (layer && layer.layer) {
      const isVisible = layer.layer.getVisible();
      layer.layer.setVisible(!isVisible);
      
      setMapLayers(prev => prev.map(l => 
        l.id === layerId ? { ...l, visible: !isVisible } : l
      ));
    }
  };

  const removeLayer = (layerId) => {
    const layer = mapLayers.find(l => l.id === layerId);
    if (layer && layer.layer) {
      map.removeLayer(layer.layer);
      setMapLayers(prev => prev.filter(l => l.id !== layerId));
      alert(` Couche "${layer.name}" supprimée`);
    }
  };

  const toggleFullscreen = () => {
    const elem = document.documentElement;
    
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      setShowLayerPanel(false);
      alert(" Mode plein écran activé");
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      setShowLayerPanel(true);
      alert(" Mode plein écran désactivé");
    }
  };

  // ====================
  // GESTION DES PROJECTIONS
  // ====================

  const changeProjection = (newProjection) => {
    if (!map || currentProjection === newProjection) return;
    
    const view = map.getView();
    const currentCenter = view.getCenter();
    const currentZoom = view.getZoom();
    
    try {
      // Reprojection du centre
      const newCenter = transform(currentCenter, currentProjection, newProjection);
      
      // Mettre à jour la vue
      view.setCenter(newCenter);
      view.setProjection(newProjection);
      view.setZoom(currentZoom);
      
      setCurrentProjection(newProjection);
      
      // Reprojection de toutes les couches vectorielles
      map.getLayers().getArray().forEach(layer => {
        if (layer instanceof VectorLayer) {
          const source = layer.getSource();
          if (source) {
            const features = source.getFeatures();
            features.forEach(feature => {
              const geometry = feature.getGeometry();
              if (geometry) {
                geometry.transform(currentProjection, newProjection);
              }
            });
            source.changed();
          }
        }
      });
      
      alert(` PROJECTION CHANGÉE\n\nAncienne: ${PROJECTIONS_CATALOG[currentProjection]?.name || currentProjection}\nNouvelle: ${PROJECTIONS_CATALOG[newProjection]?.name || newProjection}`);
      
    } catch (error) {
      console.error("❌ Erreur changement projection:", error);
      alert(`❌ Erreur changement projection: ${error.message}`);
    }
  };

  // ====================
  // EXPORT DES DONNÉES
  // ====================

  const handleExportData = () => {
    if (mapLayers.length === 0) {
      alert("⚠️ Aucune donnée à exporter");
      return;
    }
    
    const format = prompt("Format d'export (geojson, kml, wkt):", "geojson").toLowerCase();
    
    if (!['geojson', 'kml', 'wkt'].includes(format)) {
      alert(" Format non supporté");
      return;
    }
    
    try {
      let exportData = null;
      const selectedLayers = mapLayers.filter(layer => layer.visible);
      
      if (selectedLayers.length === 0) {
        alert(" Aucune couche visible à exporter");
        return;
      }
      
      // Collecter toutes les features
      const allFeatures = [];
      selectedLayers.forEach(layer => {
        if (layer.layer && layer.layer.getSource()) {
          const features = layer.layer.getSource().getFeatures();
          allFeatures.push(...features);
        }
      });
      
      if (allFeatures.length === 0) {
        alert(" Aucune entité à exporter");
        return;
      }
      
      // Exporter selon le format
      switch (format) {
        case 'geojson':
          exportData = new GeoJSON().writeFeatures(allFeatures, {
            dataProjection: 'EPSG:4326',
            featureProjection: currentProjection
          });
          break;
          
        case 'kml':
          exportData = new KML().writeFeatures(allFeatures, {
            dataProjection: 'EPSG:4326',
            featureProjection: currentProjection
          });
          break;
          
        case 'wkt':
          exportData = allFeatures.map(feature => 
            new WKT().writeFeature(feature, {
              dataProjection: 'EPSG:4326',
              featureProjection: currentProjection
            })
          ).join('\n');
          break;
      }
      
      // Créer le fichier de téléchargement
      const blob = new Blob([exportData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jomasig-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert(` Export réussi : ${allFeatures.length} entités au format ${format.toUpperCase()}`);
      
    } catch (error) {
      console.error(" Erreur export:", error);
      alert(` Erreur lors de l'export: ${error.message}`);
    }
  };

  // ====================
  // STYLES INLINE
  // ====================
  const styles = {
    app: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: "#f8fafc",
      overflow: "hidden"
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 24px",
      background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      borderBottom: "2px solid #3b82f6"
    },
    toolbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 24px",
      background: "#1e293b",
      borderBottom: "2px solid #334155",
      gap: "20px",
      flexWrap: "wrap"
    },
    toolbarGroup: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
      flexWrap: "wrap"
    },
    toolbarButton: {
      display: "flex",
      alignItems: "center",
      padding: "12px 20px",
      background: "linear-gradient(135deg, #334155 0%, #475569 100%)",
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
      minWidth: "140px",
      justifyContent: "center",
      gap: "8px"
    },
    toolbarButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
    },
    mainContent: {
      display: "flex",
      flex: 1,
      overflow: "hidden",
      position: "relative"
    },
    sidePanel: {
      width: "350px",
      background: "#1e293b",
      borderRight: "2px solid #334155",
      padding: "20px",
      transition: "all 0.3s ease",
      overflowY: "auto",
      overflowX: "hidden",
      boxShadow: "4px 0 12px rgba(0, 0, 0, 0.1)"
    },
    mapContainer: {
      flex: 1,
      position: "relative",
      background: "#0f172a"
    },
    map: {
      width: "100%",
      height: "100%"
    },
    mapControls: {
      position: "absolute",
      top: "20px",
      right: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      zIndex: 100
    },
    mapControlButton: {
      width: "48px",
      height: "48px",
      background: "rgba(30, 41, 59, 0.95)",
      color: "white",
      border: "2px solid #475569",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(10px)",
      transition: "all 0.2s",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)"
    },
    statusBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 24px",
      background: "#1e293b",
      borderTop: "2px solid #334155",
      fontSize: "13px",
      flexWrap: "wrap",
      gap: "20px"
    },
    popup: {
      position: "absolute",
      background: "linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)",
      color: "white",
      padding: "16px 20px",
      borderRadius: "12px",
      border: "2px solid #475569",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      backdropFilter: "blur(20px)",
      minWidth: "300px",
      maxWidth: "500px",
      zIndex: 1000,
      display: "none"
    },
    welcomeOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)",
      backdropFilter: "blur(20px)",
      zIndex: 2000,
      padding: "20px"
    },
    projectionSelector: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
      marginBottom: "15px",
      flexWrap: "wrap"
    },
    projectionButton: {
      padding: "8px 16px",
      background: "#0f172a",
      border: "2px solid #334155",
      color: "#94a3b8",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "600",
      transition: "all 0.2s"
    },
    projectionButtonActive: {
      background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      borderColor: "#3b82f6",
      color: "white",
      boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)"
    }
  };

  // Style conditionnel pour les boutons au survol
  const [hoveredButton, setHoveredButton] = useState(null);

  // ====================
  // RENDU
  // ====================
  return (
    <div className="App" style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ fontSize: "32px", background: "rgba(255, 255, 255, 0.1)", padding: "10px", borderRadius: "12px" }}></div>
          <div>
            <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "bold", background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              JOMA SIG Pro v2.1.0
            </h1>
            <div style={{ fontSize: "13px", opacity: 0.9, display: "flex", gap: "12px", alignItems: "center", marginTop: "4px" }}>
              <span>Système d'Information Géographique Professionnel</span>
              <span style={{ background: "rgba(59, 130, 246, 0.2)", padding: "2px 8px", borderRadius: "10px", fontSize: "11px" }}>
                15+ formats • 15 projections
              </span>
            </div>
          </div>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "20px", fontSize: "14px" }}>
          <div style={{ background: "rgba(255, 255, 255, 0.1)", padding: "8px 16px", borderRadius: "8px" }}>
            <span style={{ opacity: 0.8 }}>Projet:</span>
            <span style={{ marginLeft: "8px", fontWeight: "600" }}>{projectName}</span>
          </div>
          <div style={{ 
            background: projectStatus === 'draft' ? "rgba(245, 158, 11, 0.2)" : "rgba(16, 185, 129, 0.2)",
            color: projectStatus === 'draft' ? "#f59e0b" : "#10b981",
            padding: "8px 16px",
            borderRadius: "8px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            {projectStatus === 'draft' ? ' Brouillon' : ' Sauvegardé'}
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarGroup}>
          <button 
            style={{
              ...styles.toolbarButton,
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              ...(hoveredButton === 'import' ? styles.toolbarButtonHover : {})
            }}
            onClick={handleImportFile}
            title="Importer des fichiers SIG (15+ formats)"
            onMouseEnter={() => setHoveredButton('import')}
            onMouseLeave={() => setHoveredButton(null)}
          >
             Importer fichiers
          </button>
          
          <button 
            style={{
              ...styles.toolbarButton,
              background: selectedFeature ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" : styles.toolbarButton.background,
              opacity: selectedFeature ? 1 : 0.7,
              ...(hoveredButton === 'buffer' ? styles.toolbarButtonHover : {})
            }}
            onClick={handleBuffer}
            title="Créer un buffer autour de l'entité sélectionnée"
            disabled={!selectedFeature}
            onMouseEnter={() => setHoveredButton('buffer')}
            onMouseLeave={() => setHoveredButton(null)}
          >
             Créer Buffer
          </button>
          
          <button 
            style={{
              ...styles.toolbarButton,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              ...(hoveredButton === 'measure' ? styles.toolbarButtonHover : {})
            }}
            onClick={handleMeasureDistance}
            title="Mesurer une distance sur la carte"
            onMouseEnter={() => setHoveredButton('measure')}
            onMouseLeave={() => setHoveredButton(null)}
          >
             Mesurer distance
          </button>
          
          <button 
            style={{
              ...styles.toolbarButton,
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              ...(hoveredButton === 'export' ? styles.toolbarButtonHover : {})
            }}
            onClick={handleExportData}
            title="Exporter les données"
            onMouseEnter={() => setHoveredButton('export')}
            onMouseLeave={() => setHoveredButton(null)}
          >
             Exporter données
          </button>
        </div>
        
        <div style={styles.toolbarGroup}>
          {/* Sélecteur de projection */}
          <div style={styles.projectionSelector}>
            <span style={{ fontSize: "14px", color: "#cbd5e1", fontWeight: "600" }}>Projection:</span>
            {Object.keys(PROJECTIONS_CATALOG).slice(0, 6).map(proj => (
              <button
                key={proj}
                style={{
                  ...styles.projectionButton,
                  ...(currentProjection === proj ? styles.projectionButtonActive : {})
                }}
                onClick={() => changeProjection(proj)}
                title={`${PROJECTIONS_CATALOG[proj].name} - ${PROJECTIONS_CATALOG[proj].area}`}
              >
                {proj.replace('EPSG:', '')}
              </button>
            ))}
            <button
              style={{
                ...styles.projectionButton,
                background: "rgba(156, 163, 175, 0.2)"
              }}
              onClick={() => alert(` ${Object.keys(PROJECTIONS_CATALOG).length} PROJECTIONS DISPONIBLES\n\n${Object.entries(PROJECTIONS_CATALOG).map(([code, info]) => ` ${code}: ${info.name} (${info.area})`).join('\n')}`)}
              title="Voir toutes les projections"
            >
              
            </button>
          </div>
          
          <button 
            style={{
              ...styles.toolbarButton,
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              minWidth: "auto",
              padding: "12px"
            }}
            onClick={toggleFullscreen}
            title="Mode plein écran"
          >
            
          </button>
          
          <button 
            style={{
              ...styles.toolbarButton,
              background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
              minWidth: "auto",
              padding: "12px 20px"
            }}
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            title={showLayerPanel ? "Masquer le panneau des couches" : "Afficher le panneau des couches"}
          >
            {showLayerPanel ? '' : ''} Couches
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div style={styles.mainContent}>
        {/* Panneau latéral */}
        {showLayerPanel && (
          <div style={styles.sidePanel}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#f8fafc", display: "flex", alignItems: "center", gap: "10px" }}>
                <span></span>
                <span>Couches ({mapLayers.length})</span>
              </h3>
              <div style={{ fontSize: "12px", color: "#94a3b8", background: "rgba(0, 0, 0, 0.2)", padding: "4px 12px", borderRadius: "20px" }}>
                {mapLayers.filter(l => l.visible).length} visibles
              </div>
            </div>
            
            {mapLayers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8" }}>
                <div style={{ fontSize: "64px", opacity: 0.3, marginBottom: "16px" }}></div>
                <div style={{ fontSize: "16px", marginBottom: "8px", color: "#e2e8f0" }}>Aucune couche chargée</div>
                <div style={{ fontSize: "14px", opacity: 0.7, marginBottom: "30px" }}>
                  Importez des fichiers pour commencer
                </div>
                
                <div style={{ textAlign: "left", background: "rgba(15, 23, 42, 0.5)", borderRadius: "12px", padding: "20px", border: "1px solid #334155" }}>
                  <h4 style={{ fontSize: "16px", marginBottom: "15px", color: "#e2e8f0", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span></span>
                    <span>Formats supportés (15+)</span>
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {supportedFormats.slice(0, 10).map(format => (
                      <div key={format.name} style={{ 
                        fontSize: "12px", 
                        padding: "10px",
                        background: "rgba(30, 41, 59, 0.8)",
                        borderRadius: "8px",
                        border: "1px solid #334155",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>{format.icon}</span>
                          <span style={{ fontWeight: "600", color: "#e2e8f0" }}>{format.name}</span>
                        </div>
                        <div style={{ color: "#94a3b8", fontFamily: "'Cascadia Code', 'Monaco', monospace", fontSize: "10px" }}>
                          {format.extensions.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ textAlign: "center", marginTop: "15px", fontSize: "11px", color: "#cbd5e1" }}>
                    ... et {supportedFormats.length - 10} formats supplémentaires
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {mapLayers.map(layer => (
                  <div key={layer.id} style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "16px",
                    background: layer.visible ? "rgba(30, 41, 59, 0.8)" : "rgba(15, 23, 42, 0.8)",
                    borderRadius: "12px",
                    border: `2px solid ${layer.visible ? "#3b82f6" : "#334155"}`,
                    gap: "12px",
                    transition: "all 0.3s",
                    opacity: layer.visible ? 1 : 0.7
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ fontSize: "20px" }}>{layer.icon || ''}</div>
                        <div>
                          <div style={{ fontWeight: "bold", color: "#e2e8f0", fontSize: "15px" }}>{layer.name}</div>
                          <div style={{ fontSize: "12px", color: "#94a3b8", display: "flex", gap: "10px", alignItems: "center" }}>
                            <span>{layer.featureCount} entités</span>
                            <span></span>
                            <span>{layer.format || layer.type}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <div style={{ 
                          width: "40px", 
                          height: "20px", 
                          background: layer.visible ? "#10b981" : "#6b7280",
                          borderRadius: "20px",
                          position: "relative",
                          cursor: "pointer"
                        }} onClick={() => toggleLayerVisibility(layer.id)}>
                          <div style={{
                            width: "16px",
                            height: "16px",
                            background: "white",
                            borderRadius: "50%",
                            position: "absolute",
                            top: "2px",
                            left: layer.visible ? "22px" : "2px",
                            transition: "left 0.3s"
                          }} />
                        </div>
                        <button
                          onClick={() => removeLayer(layer.id)}
                          style={{
                            padding: "6px 12px",
                            background: "rgba(239, 68, 68, 0.2)",
                            color: "#ef4444",
                            border: "1px solid #ef4444",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "600",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.4)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                    
                    {layer.format && (
                      <div style={{
                        fontSize: "11px",
                        padding: "6px 12px",
                        background: "rgba(59, 130, 246, 0.1)",
                        borderRadius: "6px",
                        color: "#cbd5e1",
                        fontFamily: "'Cascadia Code', 'Monaco', monospace",
                        borderLeft: "3px solid #3b82f6"
                      }}>
                        Format: {layer.format}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div style={{ 
              marginTop: "20px", 
              fontSize: "12px", 
              color: "#94a3b8", 
              borderTop: "1px solid #334155", 
              paddingTop: "20px",
              background: "rgba(15, 23, 42, 0.5)",
              borderRadius: "12px",
              padding: "16px"
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px" }}>
                <div>
                  <div style={{ color: "#cbd5e1", marginBottom: "4px" }}>Zoom:</div>
                  <div style={{ fontFamily: "monospace", fontSize: "14px", color: "#3b82f6" }}>{zoom}x</div>
                </div>
                <div>
                  <div style={{ color: "#cbd5e1", marginBottom: "4px" }}>Projection:</div>
                  <div style={{ fontFamily: "monospace", fontSize: "14px", color: "#10b981" }}>{currentProjection}</div>
                </div>
              </div>
              <div>
                <div style={{ color: "#cbd5e1", marginBottom: "4px" }}>Coordonnées:</div>
                <div style={{ fontFamily: "monospace", fontSize: "12px" }}>
                  {center[0].toFixed(6)}, {center[1].toFixed(6)}
                </div>
              </div>
              <div style={{ 
                marginTop: "15px", 
                paddingTop: "15px", 
                borderTop: "1px solid #334155",
                fontSize: "11px", 
                display: "flex", 
                justifyContent: "space-between",
                color: "#6b7280"
              }}>
                <span>OpenLayers  Turf.js</span>
                <span>React  Proj4</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Carte */}
        <div style={styles.mapContainer}>
          <div ref={mapRef} style={styles.map} />
          
          {/* Contrôles carte */}
          <div style={styles.mapControls}>
            <button 
              style={styles.mapControlButton}
              onClick={() => map?.getView().setZoom(map.getView().getZoom() + 1)}
              title="Zoom avant"
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              +
            </button>
            <button 
              style={styles.mapControlButton}
              onClick={() => map?.getView().setZoom(map.getView().getZoom() - 1)}
              title="Zoom arrière"
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              -
            </button>
            <button 
              style={styles.mapControlButton}
              onClick={() => map?.getView().setCenter(fromLonLat([2.3522, 48.8566]))}
              title="Recentrer sur Paris"
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              
            </button>
            <button 
              style={styles.mapControlButton}
              onClick={() => map?.getView().setZoom(10)}
              title="Zoom par défaut"
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              
            </button>
            <button 
              style={styles.mapControlButton}
              onClick={() => map?.getView().setRotation(0)}
              title="Réinitialiser la rotation"
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              
            </button>
          </div>
          
          {/* Popup */}
          <div ref={popupRef} style={styles.popup}>
            {selectedFeature && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", paddingBottom: "10px", borderBottom: "2px solid #475569" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ fontSize: "24px" }}>
                      {selectedFeature.geometry === 'Point' ? '' : 
                       selectedFeature.geometry === 'LineString' ? '' : 
                       selectedFeature.geometry === 'Polygon' ? '' : ''}
                    </div>
                    <strong style={{ fontSize: "18px", background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      Entité sélectionnée
                    </strong>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedFeature(null);
                      if (popupRef.current) {
                        popupRef.current.style.display = 'none';
                      }
                    }}
                    style={{
                      background: "rgba(239, 68, 68, 0.2)",
                      border: "1px solid #ef4444",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontSize: "18px",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.4)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"}
                  >
                    ×
                  </button>
                </div>
                
                <div style={{ marginBottom: "15px" }}>
                  <div style={{ fontSize: "14px", marginBottom: "8px", color: "#cbd5e1", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span> Type:</span>
                    <span style={{ color: "#3b82f6", fontWeight: "bold", fontSize: "15px", background: "rgba(59, 130, 246, 0.1)", padding: "4px 12px", borderRadius: "20px" }}>
                      {selectedFeature.geometry}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: "14px", marginBottom: "8px", color: "#cbd5e1", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span> Coordonnées:</span>
                  </div>
                  <div style={{ 
                    fontFamily: "'Cascadia Code', 'Monaco', monospace", 
                    fontSize: "13px",
                    background: "rgba(0, 0, 0, 0.3)",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #334155",
                    marginBottom: "15px"
                  }}>
                    <div>Longitude: {selectedFeature.coordinates[0].toFixed(6)}</div>
                    <div>Latitude: {selectedFeature.coordinates[1].toFixed(6)}</div>
                  </div>
                </div>
                
                {selectedFeature.properties && Object.keys(selectedFeature.properties).length > 0 && (
                  <div>
                    <div style={{ fontSize: "15px", marginBottom: "12px", color: "#cbd5e1", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
                      <span> Propriétés:</span>
                      <span style={{ fontSize: "12px", background: "rgba(59, 130, 246, 0.2)", padding: "2px 8px", borderRadius: "10px" }}>
                        {Object.keys(selectedFeature.properties).length} propriétés
                      </span>
                    </div>
                    <div style={{ 
                      maxHeight: "250px", 
                      overflowY: "auto",
                      background: "rgba(0, 0, 0, 0.2)",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #334155"
                    }}>
                      {Object.entries(selectedFeature.properties).map(([key, value]) => (
                        <div key={key} style={{ 
                          display: "flex", 
                          justifyContent: "space-between",
                          fontSize: "13px",
                          padding: "8px 0",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
                        }}>
                          <span style={{ color: "#94a3b8", fontWeight: "500" }}>{key}:</span>
                          <span style={{ color: "#e2e8f0", fontWeight: "500", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={String(value)}>
                            {String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div style={{ 
                  marginTop: "20px", 
                  paddingTop: "15px", 
                  borderTop: "2px solid #475569",
                  display: "flex", 
                  gap: "10px" 
                }}>
                  <button
                    onClick={handleBuffer}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  >
                     Créer Buffer
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${selectedFeature.coordinates[0].toFixed(6)}, ${selectedFeature.coordinates[1].toFixed(6)}`);
                      alert(" Coordonnées copiées dans le presse-papier");
                    }}
                    style={{
                      padding: "10px",
                      background: "rgba(156, 163, 175, 0.2)",
                      color: "#e2e8f0",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "13px",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(156, 163, 175, 0.4)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "rgba(156, 163, 175, 0.2)"}
                  >
                     Copier
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Écran d'accueil */}
          {mapLayers.length === 0 && !isLoading && (
            <div style={styles.welcomeOverlay}>
              <div style={{
                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                padding: "50px",
                borderRadius: "20px",
                textAlign: "center",
                maxWidth: "800px",
                border: "2px solid #3b82f6",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)"
              }}>
                <div style={{ fontSize: "80px", marginBottom: "30px", background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}></div>
                <h2 style={{ margin: "0 0 20px 0", fontSize: "32px", background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  JOMA SIG Pro v2.1.0
                </h2>
                <p style={{ margin: "0 0 40px 0", lineHeight: "1.8", color: "#cbd5e1", fontSize: "16px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
                  Système d'Information Géographique professionnel complet avec support de <strong>15+ formats de fichiers</strong> et <strong>15 systèmes de projection</strong>. 
                  Idéal pour l'analyse spatiale, la cartographie web et la gestion de données géographiques.
                </p>
                
                <button 
                  onClick={handleImportFile}
                  style={{
                    padding: "20px 40px",
                    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "18px",
                    fontWeight: "600",
                    cursor: "pointer",
                    marginBottom: "20px",
                    width: "100%",
                    maxWidth: "400px",
                    transition: "all 0.3s",
                    boxShadow: "0 8px 20px rgba(59, 130, 246, 0.4)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 12px 25px rgba(59, 130, 246, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(59, 130, 246, 0.4)";
                  }}
                >
                   COMMENCER - Importer des fichiers SIG
                </button>
                
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
                  gap: "20px", 
                  marginTop: "40px",
                  textAlign: "left" 
                }}>
                  <div style={{ background: "rgba(30, 41, 59, 0.8)", padding: "20px", borderRadius: "12px", border: "1px solid #334155" }}>
                    <div style={{ fontSize: "20px", marginBottom: "15px", color: "#3b82f6", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span></span>
                      <span>Formats supportés</span>
                    </div>
                    <div style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.8" }}>
                       GeoJSON, KML, GPX, WKT, GML<br/>
                       Shapefile, TopoJSON, CSV<br/>
                       DXF, GeoTIFF, JPEG/PNG<br/>
                       MVT, GPKG, Spatialite<br/>
                       PostGIS, et plus...
                    </div>
                  </div>
                  
                  <div style={{ background: "rgba(30, 41, 59, 0.8)", padding: "20px", borderRadius: "12px", border: "1px solid #334155" }}>
                    <div style={{ fontSize: "20px", marginBottom: "15px", color: "#10b981", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span></span>
                      <span>Fonctionnalités SIG</span>
                    </div>
                    <div style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.8" }}>
                       Buffer d'entités avec Turf.js<br/>
                       Mesure de distances précises<br/>
                       15 systèmes de projection<br/>
                       Sélection et inspection<br/>
                       Gestion des couches<br/>
                       Export multi-formats
                    </div>
                  </div>
                  
                  <div style={{ background: "rgba(30, 41, 59, 0.8)", padding: "20px", borderRadius: "12px", border: "1px solid #334155" }}>
                    <div style={{ fontSize: "20px", marginBottom: "15px", color: "#8b5cf6", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span></span>
                      <span>Technologies</span>
                    </div>
                    <div style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.8" }}>
                       React 18 + Hooks<br/>
                       OpenLayers 8<br/>
                       Proj4 pour les projections<br/>
                       Turf.js pour l'analyse<br/>
                       Bootstrap 5 + MUI<br/>
                       Architecture moderne
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Barre de statut */}
      <div style={styles.statusBar}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#94a3b8" }}></span>
            <span style={{ color: "#e2e8f0" }}>{mapLayers.length} couches</span>
            <span style={{ fontSize: "11px", color: "#6b7280", marginLeft: "4px" }}>
              ({mapLayers.filter(l => l.visible).length} visibles)
            </span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#94a3b8" }}></span>
            <span style={{ fontFamily: "'Cascadia Code', 'Monaco', monospace", fontSize: "12px" }}>
              {center[0].toFixed(6)}, {center[1].toFixed(6)}
            </span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#94a3b8" }}></span>
            <span style={{ fontFamily: "'Cascadia Code', 'Monaco', monospace", fontSize: "12px", color: "#10b981" }}>
              {currentProjection}
            </span>
            <span style={{ fontSize: "11px", color: "#6b7280" }}>
              ({PROJECTIONS_CATALOG[currentProjection]?.name})
            </span>
          </div>
        </div>
        
        <div>
          <span style={{
            padding: "8px 20px",
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)",
            color: "#10b981",
            borderRadius: "20px",
            border: "2px solid #10b981",
            fontSize: "13px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span style={{ fontSize: "16px" }}></span>
            <span>SIG PRÊT  TOUS SYSTÈMES OPÉRATIONNELS</span>
          </span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "20px", fontSize: "12px", color: "#94a3b8" }}>
          <span>Zoom: <strong style={{ color: "#3b82f6" }}>{zoom}x</strong></span>
          <span></span>
          <span>v2.1.0</span>
          <span></span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span>OpenLayers</span>
            <span style={{ fontSize: "10px" }}></span>
            <span>React</span>
            <span style={{ fontSize: "10px" }}></span>
            <span>Turf.js</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
