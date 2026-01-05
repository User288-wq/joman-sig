import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import "ol/ol.css";

// Imports OpenLayers
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import KML from "ol/format/KML";
import GML from "ol/format/GML";
import GPX from "ol/format/GPX";
import { Style, Stroke, Fill, Circle as CircleStyle, Icon, Text } from "ol/style";
import { fromLonLat, toLonLat, transform } from "ol/proj";
import { Select, Draw, Modify, Snap } from "ol/interaction";
import { click } from "ol/events/condition";
import Overlay from "ol/Overlay";
import { toStringHDMS } from "ol/coordinate";
import { boundingExtent } from "ol/extent";
import { getArea, getLength } from "ol/sphere";
import { LineString, Polygon } from "ol/geom";

// Turf.js pour les opérations spatiales
import * as turf from "@turf/turf";

// TopoJSON
import { feature } from "topojson-client";

// React Icons
import { 
  FaMap, FaUpload, FaBuffer, FaObjectGroup, FaCrosshairs, 
  FaDownload, FaLayerGroup, FaRuler, FaInfoCircle, 
  FaFilter, FaTrash, FaExpand, FaCompress, FaSearch,
  FaPrint, FaShareAlt, FaCog, FaDatabase, FaChartBar,
  FaEye, FaEyeSlash, FaEdit, FaCopy, FaMagic, FaDrawPolygon,
  FaRulerCombined, FaCalculator, FaMapMarkerAlt, FaGlobe,
  FaCloudUploadAlt, FaHistory, FaPalette, FaTools,
  FaUserCircle, FaBell, FaQuestionCircle, FaExclamationTriangle
} from 'react-icons/fa';

// Composants UI personnalisés
import Notification from "./components/Notification";
import LoadingSpinner from "./components/LoadingSpinner";
import AttributeTable from "./components/AttributeTable";

// Formats supportés
const SUPPORTED_FORMATS = [
  { id: "geojson", name: "GeoJSON", extensions: [".json", ".geojson"], icon: "", color: "#4299e1" },
  { id: "shapefile", name: "Shapefile", extensions: [".shp", ".dbf", ".shx"], icon: "", color: "#ed8936" },
  { id: "kml", name: "KML/KMZ", extensions: [".kml", ".kmz"], icon: "", color: "#48bb78" },
  { id: "gml", name: "GML", extensions: [".gml", ".xml"], icon: "", color: "#9f7aea" },
  { id: "topojson", name: "TopoJSON", extensions: [".topojson", ".json"], icon: "", color: "#f687b3" },
  { id: "gpkg", name: "Geopackage", extensions: [".gpkg"], icon: "", color: "#4fd1c7" },
  { id: "csv", name: "CSV", extensions: [".csv"], icon: "", color: "#f6ad55" },
  { id: "gpx", name: "GPX", extensions: [".gpx"], icon: "", color: "#68d391" },
  { id: "tab", name: "TAB", extensions: [".tab"], icon: "", color: "#d53f8c" },
  { id: "dwg", name: "DWG/DXF", extensions: [".dwg", ".dxf"], icon: "", color: "#667eea" },
  { id: "geotiff", name: "GeoTIFF", extensions: [".tif", ".tiff"], icon: "", color: "#ed64a6" },
  { id: "las", name: "LAS/LAZ", extensions: [".las", ".laz"], icon: "", color: "#a0aec0" },
  { id: "postgis", name: "PostGIS", extensions: [".sql", ".backup"], icon: "", color: "#38b2ac" },
  { id: "rdf", name: "RDF", extensions: [".rdf", ".ttl"], icon: "", color: "#805ad5" },
  { id: "excel", name: "Excel", extensions: [".xlsx", ".xls"], icon: "", color: "#38a169" }
];

// Styles de carte disponibles
const MAP_STYLES = [
  { id: "osm", name: "OpenStreetMap", url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png", icon: "" },
  { id: "topo", name: "Topographique", url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png", icon: "" },
  { id: "satellite", name: "Satellite", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", icon: "" },
  { id: "dark", name: "Mode Nuit", url: "https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png", icon: "" },
  { id: "cycle", name: "Vélo", url: "https://{a-c}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png", icon: "" }
];

function App() {
  // Références
  const mapRef = useRef();
  const popupRef = useRef();
  const fileInputRef = useRef();
  
  // État principal
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [center, setCenter] = useState([2.3522, 48.8566]);
  const [mapLayers, setMapLayers] = useState([]);
  const [activeTab, setActiveTab] = useState("layers");
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState("geojson");
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLayerPanel, setShowLayerPanel] = useState(true);
  const [mapStyle, setMapStyle] = useState("osm");
  const [searchQuery, setSearchQuery] = useState("");
  const [drawingMode, setDrawingMode] = useState(null);
  const [measurement, setMeasurement] = useState(null);
  
  // État avancé
  const [notifications, setNotifications] = useState([]);
  const [processingHistory, setProcessingHistory] = useState([]);
  const [attributeData, setAttributeData] = useState([]);
  const [statistics, setStatistics] = useState({
    totalFeatures: 0,
    totalLayers: 0,
    byType: { point: 0, line: 0, polygon: 0 }
  });
  
  // Références OpenLayers
  const selectInteractionRef = useRef(null);
  const drawInteractionRef = useRef(null);
  const measureInteractionRef = useRef(null);
  const vectorSourceRef = useRef(new VectorSource());

  // ====================
  // INITIALISATION CARTE
  // ====================
  useEffect(() => {
    if (!mapRef.current || map) return;
    
    try {
      console.log(" Initialisation JOMA SIG Pro...");
      
      // Créer la carte
      const newMap = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM({
              url: MAP_STYLES.find(s => s.id === mapStyle)?.url
            }),
            visible: true
          })
        ],
        view: new View({
          center: fromLonLat(center),
          zoom: zoom,
          maxZoom: 20,
          minZoom: 2
        }),
        controls: [],
        interactions: []
      });
      
      // Couche pour les dessins et mesures
      const drawingLayer = new VectorLayer({
        source: vectorSourceRef.current,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 0, 0.2)'
          }),
          stroke: new Stroke({
            color: '#ffcc00',
            width: 2
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: '#ffcc00'
            })
          })
        })
      });
      
      newMap.addLayer(drawingLayer);
      
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
            layer: feature.get('layerName')
          });
          
          popup.setPosition(coordinates);
          
          // Ajouter notification
          addNotification("info", `Entité sélectionnée: ${props.name || 'Sans nom'}`);
        } else {
          setSelectedFeature(null);
          popup.setPosition(undefined);
        }
      });
      
      newMap.addInteraction(select);
      selectInteractionRef.current = select;
      
      // Écouteurs d'événements
      newMap.getView().on('change:resolution', () => {
        setZoom(newMap.getView().getZoom().toFixed(2));
      });
      
      newMap.getView().on('change:center', () => {
        const centerCoords = toLonLat(newMap.getView().getCenter());
        setCenter(centerCoords);
      });
      
      // Gestion plein écran
      document.addEventListener('fullscreenchange', () => {
        setIsFullscreen(!!document.fullscreenElement);
      });
      
      setMap(newMap);
      addNotification("success", "Carte JOMA SIG Pro initialisée avec succès !");
      
    } catch (error) {
      console.error(" Erreur initialisation:", error);
      addNotification("error", `Erreur d'initialisation: ${error.message}`);
    }
  }, []);
  
  // ====================
  // NOTIFICATIONS
  // ====================
  const addNotification = (type, message, duration = 5000) => {
    const id = Date.now();
    const notification = { id, type, message };
    
    setNotifications(prev => [notification, ...prev]);
    
    // Auto-remove
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  };
  
  // ====================
  // GESTION DES COUCHES
  // ====================
  const addLayerToMap = useCallback((features, layerName, options = {}) => {
    if (!map || !features || features.length === 0) return null;
    
    const layerId = `layer-${Date.now()}`;
    const { color = '#4299e1', visible = true } = options;
    
    // Convertir les features en format OpenLayers
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures({
        type: 'FeatureCollection',
        features: features
      }, {
        featureProjection: 'EPSG:3857'
      })
    });
    
    // Compter les types
    const featureTypes = {
      point: features.filter(f => f.geometry.type === 'Point').length,
      line: features.filter(f => f.geometry.type.includes('Line')).length,
      polygon: features.filter(f => f.geometry.type.includes('Polygon')).length
    };
    
    // Style dynamique
    const styleFunction = (feature) => {
      const geomType = feature.getGeometry().getType();
      const styles = {
        'Point': new Style({
          image: new CircleStyle({
            radius: 6,
            fill: new Fill({ color: color }),
            stroke: new Stroke({ color: '#FFF', width: 2 })
          })
        }),
        'LineString': new Style({
          stroke: new Stroke({
            color: color,
            width: 3
          })
        }),
        'Polygon': new Style({
          fill: new Fill({
            color: color + '30' // Ajouter transparence
          }),
          stroke: new Stroke({
            color: color,
            width: 2
          })
        })
      };
      
      return styles[geomType] || new Style({
        fill: new Fill({ color: color + '30' }),
        stroke: new Stroke({ color: color, width: 2 })
      });
    };
    
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: styleFunction,
      visible: visible
    });
    
    // Ajouter à la carte
    map.addLayer(vectorLayer);
    
    // Créer objet layer
    const layerObj = {
      id: layerId,
      name: layerName || `Couche ${mapLayers.length + 1}`,
      type: 'vector',
      visible: visible,
      source: vectorSource,
      layer: vectorLayer,
      color: color,
      featureCount: features.length,
      featureTypes: featureTypes,
      attributes: features[0]?.properties ? Object.keys(features[0].properties) : []
    };
    
    // Mettre à jour l'état
    setMapLayers(prev => [...prev, layerObj]);
    
    // Mettre à jour les statistiques
    updateStatistics();
    
    // Ajuster la vue
    const extent = vectorSource.getExtent();
    if (extent && extent[0] !== Infinity) {
      map.getView().fit(extent, { 
        padding: [50, 50, 50, 50], 
        maxZoom: 15,
        duration: 1000 
      });
    }
    
    // Ajouter à l'historique
    addToHistory('import', `${features.length} entités importées dans ${layerName}`);
    
    // Notification
    addNotification("success", `Couche "${layerName}" ajoutée (${features.length} entités)`);
    
    return layerId;
  }, [map, mapLayers]);
  
  const removeLayer = (layerId) => {
    const layer = mapLayers.find(l => l.id === layerId);
    if (layer && layer.layer) {
      map.removeLayer(layer.layer);
      setMapLayers(prev => prev.filter(l => l.id !== layerId));
      addNotification("info", `Couche "${layer.name}" supprimée`);
      updateStatistics();
    }
  };
  
  const toggleLayerVisibility = (layerId) => {
    setMapLayers(prev => 
      prev.map(layer => {
        if (layer.id === layerId && layer.layer) {
          const newVisibility = !layer.visible;
          layer.layer.setVisible(newVisibility);
          return { ...layer, visible: newVisibility };
        }
        return layer;
      })
    );
  };
  
  // ====================
  // IMPORT DE FICHIERS
  // ====================
  const handleFileImport = async () => {
    const format = SUPPORTED_FORMATS.find(f => f.id === selectedFormat);
    if (!format) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = format.extensions.join(',');
    input.multiple = format.id === 'shapefile';
    
    input.onchange = async (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;
      
      setIsLoading(true);
      addNotification("info", `Import ${format.name} en cours...`);
      
      try {
        // Simuler l'import (à remplacer par la vraie logique)
        const mockFeatures = generateMockFeatures(50, format.id);
        const layerName = `${format.name} - ${files[0].name}`;
        
        addLayerToMap(mockFeatures, layerName, { 
          color: format.color 
        });
        
      } catch (error) {
        console.error(" Erreur import:", error);
        addNotification("error", `Erreur import: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    input.click();
  };
  
  // ====================
  // OUTILS DE DESSIN
  // ====================
  const activateDrawingTool = (type) => {
    if (!map || drawingMode === type) {
      deactivateDrawingTool();
      return;
    }
    
    // Désactiver les autres interactions
    deactivateDrawingTool();
    
    setDrawingMode(type);
    addNotification("info", `Mode dessin: ${type}`);
    
    // Créer l'interaction de dessin
    const draw = new Draw({
      source: vectorSourceRef.current,
      type: type,
      style: new Style({
        fill: new Fill({
          color: 'rgba(66, 153, 225, 0.2)'
        }),
        stroke: new Stroke({
          color: '#4299e1',
          width: 2
        }),
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: '#4299e1'
          })
        })
      })
    });
    
    draw.on('drawend', (event) => {
      const feature = event.feature;
      const geometry = feature.getGeometry();
      const area = geometry.getType() === 'Polygon' ? getArea(geometry) : null;
      const length = geometry.getType() === 'LineString' ? getLength(geometry) : null;
      
      addNotification("success", 
        `Dessin terminé: ${geometry.getType()} ${area ? `(${(area/10000).toFixed(2)} ha)` : ''}`
      );
      
      // Ajouter aux couches
      const layerId = addLayerToMap([{
        type: 'Feature',
        geometry: geometry.getCoordinates(),
        properties: {
          name: `Dessin ${geometry.getType()}`,
          type: geometry.getType(),
          area: area,
          length: length
        }
      }], `Dessin ${geometry.getType()}`, { color: '#4299e1' });
    });
    
    map.addInteraction(draw);
    drawInteractionRef.current = draw;
  };
  
  const deactivateDrawingTool = () => {
    if (drawInteractionRef.current) {
      map.removeInteraction(drawInteractionRef.current);
      drawInteractionRef.current = null;
    }
    setDrawingMode(null);
  };
  
  // ====================
  // OUTILS DE MESURE
  // ====================
  const activateMeasureTool = (type) => {
    if (!map) return;
    
    deactivateDrawingTool();
    setMeasurement({ type, active: true });
    
    const draw = new Draw({
      source: vectorSourceRef.current,
      type: type === 'area' ? 'Polygon' : 'LineString',
      style: new Style({
        fill: new Fill({
          color: 'rgba(72, 187, 120, 0.2)'
        }),
        stroke: new Stroke({
          color: '#48bb78',
          width: 2
        }),
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: '#48bb78'
          })
        })
      })
    });
    
    let sketch;
    draw.on('drawstart', (event) => {
      sketch = event.feature;
    });
    
    draw.on('drawend', (event) => {
      const geometry = event.feature.getGeometry();
      let measureText = '';
      
      if (type === 'distance') {
        const length = getLength(geometry);
        measureText = `Distance: ${(length/1000).toFixed(2)} km`;
      } else {
        const area = getArea(geometry);
        measureText = `Surface: ${(area/10000).toFixed(2)} ha`;
      }
      
      addNotification("success", measureText);
      
      // Ajouter label
      const coordinates = geometry.getType() === 'Polygon' 
        ? geometry.getInteriorPoint().getCoordinates()
        : geometry.getLastCoordinate();
      
      const label = new Text({
        text: measureText,
        font: 'bold 14px Arial',
        fill: new Fill({ color: '#000' }),
        stroke: new Stroke({ color: '#fff', width: 3 }),
        offsetY: -20
      });
      
      const labelFeature = new VectorSource({
        features: [new Feature({
          geometry: new Point(coordinates),
          name: measureText
        })]
      });
      
      map.addLayer(new VectorLayer({
        source: labelFeature,
        style: new Style({ text: label })
      }));
    });
    
    map.addInteraction(draw);
    measureInteractionRef.current = draw;
  };
  
  // ====================
  // OPÉRATIONS SPATIALES
  // ====================
  const handleBuffer = () => {
    if (!selectedFeature) {
      addNotification("warning", "Sélectionnez d'abord une entité");
      return;
    }
    
    const distance = prompt("Distance du buffer (mètres):", "100");
    if (!distance || isNaN(distance)) return;
    
    setIsLoading(true);
    
    // Simuler le buffer
    setTimeout(() => {
      const mockBuffer = generateMockFeatures(10, 'buffer');
      addLayerToMap(mockBuffer, `Buffer ${distance}m`, { color: '#ed8936' });
      
      addToHistory('buffer', `Buffer de ${distance}m appliqué`);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleUnion = () => {
    const vectorLayers = mapLayers.filter(l => l.type === 'vector');
    if (vectorLayers.length < 2) {
      addNotification("warning", "Besoin d'au moins 2 couches vectorielles");
      return;
    }
    
    setIsLoading(true);
    
    // Simuler l'union
    setTimeout(() => {
      const mockUnion = generateMockFeatures(15, 'union');
      addLayerToMap(mockUnion, "Union", { color: '#9f7aea' });
      
      addToHistory('union', `Union de ${vectorLayers.length} couches`);
      setIsLoading(false);
    }, 1500);
  };
  
  // ====================
  // GESTION STYLES CARTE
  // ====================
  const changeMapStyle = (styleId) => {
    if (!map) return;
    
    const style = MAP_STYLES.find(s => s.id === styleId);
    if (!style) return;
    
    // Remplacer la couche de base
    const baseLayer = map.getLayers().item(0);
    baseLayer.setSource(new OSM({ url: style.url }));
    
    setMapStyle(styleId);
    addNotification("info", `Style de carte: ${style.name}`);
  };
  
  // ====================
  // UTILITAIRES
  // ====================
  const generateMockFeatures = (count, type = 'generic') => {
    return Array.from({ length: count }, (_, i) => {
      const geometryType = ['Point', 'LineString', 'Polygon'][Math.floor(Math.random() * 3)];
      return {
        type: 'Feature',
        properties: {
          id: i + 1,
          name: `${type} ${i + 1}`,
          type: geometryType,
          value: Math.random() * 100,
          date: new Date().toISOString().split('T')[0]
        },
        geometry: {
          type: geometryType,
          coordinates: geometryType === 'Point' 
            ? [2.35 + Math.random() * 0.1, 48.85 + Math.random() * 0.1]
            : geometryType === 'LineString'
            ? [[2.35, 48.85], [2.36, 48.86], [2.37, 48.85]]
            : [[[2.35, 48.85], [2.36, 48.85], [2.36, 48.86], [2.35, 48.86], [2.35, 48.85]]]
        }
      };
    });
  };
  
  const updateStatistics = () => {
    const totalFeatures = mapLayers.reduce((sum, layer) => sum + layer.featureCount, 0);
    const byType = { point: 0, line: 0, polygon: 0 };
    
    mapLayers.forEach(layer => {
      if (layer.featureTypes) {
        byType.point += layer.featureTypes.point || 0;
        byType.line += layer.featureTypes.line || 0;
        byType.polygon += layer.featureTypes.polygon || 0;
      }
    });
    
    setStatistics({
      totalFeatures,
      totalLayers: mapLayers.length,
      byType
    });
  };
  
  const addToHistory = (action, description) => {
    setProcessingHistory(prev => [{
      id: Date.now(),
      action,
      description,
      timestamp: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString()
    }, ...prev.slice(0, 49)]); // Garder 50 max
  };
  
  const toggleFullscreen = () => {
    const elem = document.documentElement;
    
    if (!isFullscreen) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      setShowLayerPanel(false);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      setShowLayerPanel(true);
    }
  };
  
  const exportData = (format = 'geojson') => {
    // Exporter les données
    const data = {
      type: 'FeatureCollection',
      features: []
    };
    
    mapLayers.forEach(layer => {
      if (layer.type === 'vector' && layer.source) {
        const features = layer.source.getFeatures();
        features.forEach(feature => {
          data.features.push({
            type: 'Feature',
            properties: feature.getProperties(),
            geometry: feature.getGeometry().getCoordinates()
          });
        });
      }
    });
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const link = document.createElement('a');
    link.download = `joma-sig-export-${new Date().toISOString().slice(0,10)}.geojson`;
    link.href = dataUri;
    link.click();
    
    addNotification("success", "Données exportées en GeoJSON");
  };
  
  // ====================
  // RENDU
  // ====================
  return (
    <div className="App" style={styles.app}>
      {/* Notifications */}
      <div style={styles.notifications}>
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            style={{
              ...styles.notification,
              ...styles[`notification_${notification.type}`]
            }}
          >
            {notification.type === 'success' && ' '}
            {notification.type === 'error' && ' '}
            {notification.type === 'warning' && ' '}
            {notification.type === 'info' && 'ℹ '}
            {notification.message}
          </div>
        ))}
      </div>
      
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>
            <FaGlobe size={28} style={{ marginRight: 12 }} />
            <div>
              <h1 style={styles.title}>JOMA SIG Pro</h1>
              <div style={styles.subtitle}>Système d'Information Géographique Professionnel</div>
            </div>
          </div>
        </div>
        
        <div style={styles.headerCenter}>
          <div style={styles.searchContainer}>
            <FaSearch size={16} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Rechercher une adresse, une parcelle, une coordonnée..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            <button style={styles.searchButton}>
              <FaSearch size={14} />
            </button>
          </div>
        </div>
        
        <div style={styles.headerRight}>
          <button style={styles.headerButton} title="Notifications">
            <FaBell size={18} />
            <span style={styles.badge}>3</span>
          </button>
          <button style={styles.headerButton} title="Aide">
            <FaQuestionCircle size={18} />
          </button>
          <div style={styles.userProfile}>
            <FaUserCircle size={32} />
            <div style={styles.userInfo}>
              <div style={{ fontWeight: 'bold' }}>JOMA Utilisateur</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Administrateur</div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Toolbar principale */}
      <div style={styles.toolbar}>
        {/* Groupe Import/Export */}
        <div style={styles.toolbarGroup}>
          <button 
            style={styles.toolbarButton}
            onClick={handleFileImport}
            title="Importer des données"
          >
            <FaCloudUploadAlt style={{ marginRight: 8 }} />
            Importer
          </button>
          
          <select 
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            style={styles.formatSelect}
          >
            {SUPPORTED_FORMATS.map(format => (
              <option key={format.id} value={format.id}>
                {format.icon} {format.name}
              </option>
            ))}
          </select>
          
          <button 
            style={{...styles.toolbarButton, background: '#38a169'}}
            onClick={() => exportData()}
            title="Exporter les données"
          >
            <FaDownload style={{ marginRight: 8 }} />
            Exporter
          </button>
        </div>
        
        {/* Groupe Outils */}
        <div style={styles.toolbarGroup}>
          <button 
            style={{
              ...styles.toolbarButton,
              background: drawingMode === 'Point' ? '#4fd1c7' : '#334155'
            }}
            onClick={() => activateDrawingTool('Point')}
            title="Dessiner un point"
          >
            <FaMapMarkerAlt style={{ marginRight: 8 }} />
            Point
          </button>
          
          <button 
            style={{
              ...styles.toolbarButton,
              background: drawingMode === 'LineString' ? '#4fd1c7' : '#334155'
            }}
            onClick={() => activateDrawingTool('LineString')}
            title="Dessiner une ligne"
          >
            <FaRulerCombined style={{ marginRight: 8 }} />
            Ligne
          </button>
          
          <button 
            style={{
              ...styles.toolbarButton,
              background: drawingMode === 'Polygon' ? '#4fd1c7' : '#334155'
            }}
            onClick={() => activateDrawingTool('Polygon')}
            title="Dessiner un polygone"
          >
            <FaDrawPolygon style={{ marginRight: 8 }} />
            Polygone
          </button>
        </div>
        
        {/* Groupe Analyse */}
        <div style={styles.toolbarGroup}>
          <button 
            style={styles.toolbarButton}
            onClick={handleBuffer}
            title="Créer un buffer"
          >
            <FaBuffer style={{ marginRight: 8 }} />
            Buffer
          </button>
          
          <button 
            style={styles.toolbarButton}
            onClick={handleUnion}
            title="Union de couches"
          >
            <FaObjectGroup style={{ marginRight: 8 }} />
            Union
          </button>
          
          <button 
            style={styles.toolbarButton}
            onClick={() => activateMeasureTool('distance')}
            title="Mesurer une distance"
          >
            <FaRuler style={{ marginRight: 8 }} />
            Mesurer
          </button>
          
          <button 
            style={styles.toolbarButton}
            onClick={() => activateMeasureTool('area')}
            title="Mesurer une surface"
          >
            <FaCalculator style={{ marginRight: 8 }} />
            Surface
          </button>
        </div>
        
        {/* Groupe Affichage */}
        <div style={styles.toolbarGroup}>
          <button 
            style={styles.toolbarButton}
            onClick={toggleFullscreen}
            title="Plein écran"
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
          
          <button 
            style={styles.toolbarButton}
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            title="Afficher/Masquer le panneau"
          >
            {showLayerPanel ? '' : ''}
          </button>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div style={styles.mainContent}>
        {/* Panneau latéral */}
        {showLayerPanel && (
          <div style={styles.sidePanel}>
            {/* Tabs */}
            <div style={styles.tabs}>
              {[
                { id: 'layers', label: 'Couches', icon: <FaLayerGroup /> },
                { id: 'data', label: 'Données', icon: <FaDatabase /> },
                { id: 'history', label: 'Historique', icon: <FaHistory /> },
                { id: 'styles', label: 'Styles', icon: <FaPalette /> },
                { id: 'tools', label: 'Outils', icon: <FaTools /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  style={{
                    ...styles.tabButton,
                    ...(activeTab === tab.id && styles.tabButtonActive)
                  }}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span style={{ marginLeft: 8 }}>{tab.label}</span>
                </button>
              ))}
            </div>
            
            {/* Contenu des tabs */}
            <div style={styles.tabContent}>
              {/* Tab Couches */}
              {activeTab === 'layers' && (
                <div>
                  <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}> Couches ({mapLayers.length})</h3>
                    <div style={styles.sectionActions}>
                      <button style={styles.smallButton}>
                        <FaEye /> Tout
                      </button>
                      <button style={styles.smallButton}>
                        <FaEyeSlash /> Rien
                      </button>
                    </div>
                  </div>
                  
                  <div style={styles.layerList}>
                    {mapLayers.map(layer => (
                      <div key={layer.id} style={styles.layerItem}>
                        <div style={styles.layerHeader}>
                          <input
                            type="checkbox"
                            checked={layer.visible}
                            onChange={() => toggleLayerVisibility(layer.id)}
                            style={styles.checkbox}
                          />
                          <div 
                            style={{ 
                              width: 12, 
                              height: 12, 
                              borderRadius: '50%',
                              backgroundColor: layer.color,
                              marginRight: 10 
                            }} 
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold' }}>{layer.name}</div>
                            <div style={{ fontSize: 12, opacity: 0.7 }}>
                              {layer.featureCount} entités  {layer.featureTypes?.point || 0}P, {layer.featureTypes?.line || 0}L, {layer.featureTypes?.polygon || 0}Z
                            </div>
                          </div>
                          <button 
                            onClick={() => removeLayer(layer.id)}
                            style={styles.deleteButton}
                            title="Supprimer la couche"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                        
                        <div style={styles.layerControls}>
                          <button style={styles.layerControlButton}>
                            <FaEdit size={12} />
                          </button>
                          <button style={styles.layerControlButton}>
                            <FaFilter size={12} />
                          </button>
                          <button style={styles.layerControlButton}>
                            <FaInfoCircle size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {mapLayers.length === 0 && (
                      <div style={styles.emptyState}>
                        <div style={{ fontSize: 48, opacity: 0.3 }}></div>
                        <div style={{ marginTop: 10 }}>Aucune couche</div>
                        <div style={{ fontSize: 12, opacity: 0.7 }}>
                          Importez ou dessinez des données
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Tab Données */}
              {activeTab === 'data' && (
                <div>
                  <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}> Statistiques</h3>
                  </div>
                  
                  <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                      <div style={styles.statValue}>{statistics.totalFeatures}</div>
                      <div style={styles.statLabel}>Entités totales</div>
                    </div>
                    <div style={styles.statCard}>
                      <div style={styles.statValue}>{statistics.totalLayers}</div>
                      <div style={styles.statLabel}>Couches</div>
                    </div>
                    <div style={styles.statCard}>
                      <div style={styles.statValue}>{statistics.byType.point}</div>
                      <div style={styles.statLabel}>Points</div>
                    </div>
                    <div style={styles.statCard}>
                      <div style={styles.statValue}>{statistics.byType.line}</div>
                      <div style={styles.statLabel}>Lignes</div>
                    </div>
                    <div style={styles.statCard}>
                      <div style={styles.statValue}>{statistics.byType.polygon}</div>
                      <div style={styles.statLabel}>Polygones</div>
                    </div>
                  </div>
                  
                  {selectedFeature && (
                    <div style={styles.featurePanel}>
                      <h4 style={styles.featureTitle}> Entité sélectionnée</h4>
                      <div style={styles.featureDetails}>
                        <div style={styles.featureRow}>
                          <span style={styles.featureLabel}>Type:</span>
                          <span style={styles.featureValue}>{selectedFeature.geometry}</span>
                        </div>
                        <div style={styles.featureRow}>
                          <span style={styles.featureLabel}>Couche:</span>
                          <span style={styles.featureValue}>{selectedFeature.layer}</span>
                        </div>
                        {Object.entries(selectedFeature.properties || {}).map(([key, value]) => (
                          <div key={key} style={styles.featureRow}>
                            <span style={styles.featureLabel}>{key}:</span>
                            <span style={styles.featureValue}>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Tab Historique */}
              {activeTab === 'history' && (
                <div>
                  <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}> Historique</h3>
                    <button 
                      style={styles.clearButton}
                      onClick={() => setProcessingHistory([])}
                    >
                      <FaTrash size={12} /> Effacer
                    </button>
                  </div>
                  
                  <div style={styles.historyList}>
                    {processingHistory.map(item => (
                      <div key={item.id} style={styles.historyItem}>
                        <div style={styles.historyIcon}>
                          {item.action === 'import' && ''}
                          {item.action === 'buffer' && ''}
                          {item.action === 'union' && ''}
                          {item.action === 'draw' && ''}
                          {item.action === 'measure' && ''}
                        </div>
                        <div style={styles.historyContent}>
                          <div style={{ fontWeight: 'bold' }}>{item.description}</div>
                          <div style={{ fontSize: 12, opacity: 0.7 }}>
                            {item.date}  {item.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {processingHistory.length === 0 && (
                      <div style={styles.emptyState}>
                        <div style={{ fontSize: 48, opacity: 0.3 }}></div>
                        <div style={{ marginTop: 10 }}>Aucun historique</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Tab Styles */}
              {activeTab === 'styles' && (
                <div>
                  <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}> Styles de carte</h3>
                  </div>
                  
                  <div style={styles.stylesGrid}>
                    {MAP_STYLES.map(style => (
                      <div 
                        key={style.id}
                        style={{
                          ...styles.styleCard,
                          borderColor: mapStyle === style.id ? style.color || '#4299e1' : '#334155'
                        }}
                        onClick={() => changeMapStyle(style.id)}
                      >
                        <div style={styles.styleIcon}>{style.icon}</div>
                        <div style={styles.styleName}>{style.name}</div>
                        {mapStyle === style.id && (
                          <div style={styles.styleActive}></div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div style={styles.styleSettings}>
                    <h4 style={styles.settingsTitle}> Paramètres</h4>
                    <div style={styles.settingItem}>
                      <label style={styles.settingLabel}>Transparence</label>
                      <input type="range" min="0" max="100" defaultValue="100" style={styles.slider} />
                    </div>
                    <div style={styles.settingItem}>
                      <label style={styles.settingLabel}>Épaisseur</label>
                      <input type="range" min="1" max="10" defaultValue="2" style={styles.slider} />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Tab Outils */}
              {activeTab === 'tools' && (
                <div>
                  <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}> Outils avancés</h3>
                  </div>
                  
                  <div style={styles.toolsGrid}>
                    {[
                      { icon: '', name: 'Géocodage', color: '#4299e1' },
                      { icon: '', name: 'Géoréférencement', color: '#48bb78' },
                      { icon: '', name: 'Statistiques', color: '#ed8936' },
                      { icon: '', name: 'Requête spatiale', color: '#9f7aea' },
                      { icon: '', name: 'Graphiques', color: '#f687b3' },
                      { icon: '', name: 'Reprojection', color: '#4fd1c7' },
                      { icon: '', name: 'Découpage', color: '#d53f8c' },
                      { icon: '', name: 'Fusion', color: '#667eea' }
                    ].map(tool => (
                      <div key={tool.name} style={styles.toolCard}>
                        <div style={{ ...styles.toolIcon, background: tool.color }}>
                          {tool.icon}
                        </div>
                        <div style={styles.toolName}>{tool.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
            >
              +
            </button>
            <button 
              style={styles.mapControlButton}
              onClick={() => map?.getView().setZoom(map.getView().getZoom() - 1)}
              title="Zoom arrière"
            >
              -
            </button>
            <button 
              style={styles.mapControlButton}
              onClick={() => map?.getView().setZoom(10)}
              title="Zoom par défaut"
            >
              
            </button>
            <button 
              style={styles.mapControlButton}
              onClick={() => {
                if (mapLayers.length > 1) {
                  const layers = mapLayers.filter(l => l.type !== 'base');
                  const extents = layers.map(l => l.source?.getExtent()).filter(e => e && e[0] !== Infinity);
                  if (extents.length > 0) {
                    const overallExtent = boundingExtent(extents.flat());
                    map.getView().fit(overallExtent, { padding: [50, 50, 50, 50] });
                  }
                }
              }}
              title="Ajuster à toutes les couches"
            >
              
            </button>
          </div>
          
          {/* Coordonnées */}
          <div style={styles.coordinates}>
            {center[0].toFixed(4)}, {center[1].toFixed(4)}  Zoom: {zoom}x
          </div>
          
          {/* Popup */}
          <div ref={popupRef} style={styles.popup}>
            {selectedFeature && (
              <div style={styles.popupContent}>
                <strong>{selectedFeature.properties?.name || 'Entité'}</strong>
                <div style={{ fontSize: 12 }}>{selectedFeature.geometry}</div>
              </div>
            )}
          </div>
          
          {/* Écran d'accueil */}
          {mapLayers.length === 0 && !isLoading && (
            <div style={styles.welcomeOverlay}>
              <div style={styles.welcomeCard}>
                <div style={{ fontSize: 64, marginBottom: 20 }}></div>
                <h2 style={styles.welcomeTitle}>Bienvenue sur JOMA SIG Pro</h2>
                <p style={styles.welcomeText}>
                  Système d'Information Géographique professionnel<br/>
                  avec support pour 15 formats de données
                </p>
                
                <div style={styles.welcomeActions}>
                  <button 
                    onClick={handleFileImport}
                    style={styles.welcomeButton}
                  >
                    <FaUpload style={{ marginRight: 10 }} />
                    Commencer avec GeoJSON
                  </button>
                  
                  <button 
                    onClick={() => activateDrawingTool('Polygon')}
                    style={{...styles.welcomeButton, background: '#334155'}}
                  >
                    <FaDrawPolygon style={{ marginRight: 10 }} />
                    Dessiner un polygone
                  </button>
                </div>
                
                <div style={styles.welcomeTips}>
                  <div style={styles.tip}>
                    <FaSearch size={14} />
                    <span>Utilisez la barre de recherche pour trouver des lieux</span>
                  </div>
                  <div style={styles.tip}>
                    <FaDrawPolygon size={14} />
                    <span>Cliquez sur les outils de dessin pour créer des formes</span>
                  </div>
                  <div style={styles.tip}>
                    <FaBuffer size={14} />
                    <span>Utilisez les outils d'analyse pour traiter vos données</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Barre de statut */}
      <div style={styles.statusBar}>
        <div style={styles.statusLeft}>
          <div style={styles.statusItem}>
            <FaMap style={{ marginRight: 8 }} />
            {statistics.totalLayers} couches  {statistics.totalFeatures} entités
          </div>
          <div style={styles.statusItem}>
            <FaExclamationTriangle style={{ marginRight: 8 }} />
            En production  v2.1.0
          </div>
        </div>
        
        <div style={styles.statusCenter}>
          <div style={styles.statusMessage}>
            {isLoading ? ' Traitement en cours...' : ' Système prêt'}
          </div>
        </div>
        
        <div style={styles.statusRight}>
          <div style={styles.statusItem}>
            <FaDatabase style={{ marginRight: 8 }} />
            OpenLayers 10.7.0  Turf.js 6.5.0
          </div>
        </div>
      </div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingContent}>
            <div style={styles.spinner}></div>
            <div style={{ marginTop: 20, fontSize: 18 }}>Traitement en cours...</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles complets
const styles = {
  app: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: "#f8fafc"
  },
  
  // Notifications
  notifications: {
    position: "fixed",
    top: 20,
    right: 20,
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: 10
  },
  notification: {
    padding: "12px 20px",
    borderRadius: "8px",
    background: "#1e293b",
    border: "1px solid #334155",
    backdropFilter: "blur(10px)",
    animation: "slideIn 0.3s ease-out",
    maxWidth: "400px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
  },
  notification_success: {
    borderLeft: "4px solid #48bb78",
    background: "rgba(72, 187, 120, 0.1)"
  },
  notification_error: {
    borderLeft: "4px solid #e53e3e",
    background: "rgba(229, 62, 62, 0.1)"
  },
  notification_warning: {
    borderLeft: "4px solid #ed8936",
    background: "rgba(237, 137, 54, 0.1)"
  },
  notification_info: {
    borderLeft: "4px solid #4299e1",
    background: "rgba(66, 153, 225, 0.1)"
  },
  
  // Header
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 100
  },
  headerLeft: {
    display: "flex",
    alignItems: "center"
  },
  logo: {
    display: "flex",
    alignItems: "center"
  },
  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  subtitle: {
    fontSize: "12px",
    opacity: 0.8,
    marginTop: "2px"
  },
  headerCenter: {
    flex: 1,
    maxWidth: "600px",
    margin: "0 40px"
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    overflow: "hidden",
    backdropFilter: "blur(10px)"
  },
  searchIcon: {
    margin: "0 12px",
    opacity: 0.7
  },
  searchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "14px",
    padding: "12px 0",
    outline: "none",
    "&::placeholder": {
      color: "rgba(255, 255, 255, 0.5)"
    }
  },
  searchButton: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "12px 20px",
    cursor: "pointer",
    transition: "background 0.2s",
    "&:hover": {
      background: "#2563eb"
    }
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  headerButton: {
    background: "transparent",
    color: "white",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    cursor: "pointer",
    position: "relative",
    transition: "background 0.2s",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)"
    }
  },
  badge: {
    position: "absolute",
    top: "-2px",
    right: "-2px",
    background: "#e53e3e",
    color: "white",
    fontSize: "10px",
    padding: "2px 6px",
    borderRadius: "10px",
    minWidth: "16px",
    textAlign: "center"
  },
  userProfile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 12px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background 0.2s",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.15)"
    }
  },
  userInfo: {
    display: "flex",
    flexDirection: "column"
  },
  
  // Toolbar
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    background: "#1e293b",
    borderBottom: "1px solid #334155",
    gap: "20px"
  },
  toolbarGroup: {
    display: "flex",
    gap: "10px",
    alignItems: "center"
  },
  toolbarButton: {
    display: "flex",
    alignItems: "center",
    padding: "10px 16px",
    background: "#334155",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s",
    "&:hover": {
      background: "#475569",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
    }
  },
  formatSelect: {
    padding: "10px 16px",
    background: "#475569",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    minWidth: "200px",
    "&:hover": {
      background: "#4a5568"
    }
  },
  
  // Main content
  mainContent: {
    display: "flex",
    flex: 1,
    overflow: "hidden"
  },
  
  // Side panel
  sidePanel: {
    width: "320px",
    background: "#1e293b",
    borderRight: "1px solid #334155",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transition: "width 0.3s"
  },
  tabs: {
    display: "flex",
    padding: "16px 16px 0",
    background: "#0f172a",
    gap: "2px"
  },
  tabButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px",
    background: "transparent",
    color: "#94a3b8",
    border: "none",
    borderRadius: "8px 8px 0 0",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s"
  },
  tabButtonActive: {
    background: "#1e293b",
    color: "#60a5fa",
    fontWeight: "600"
  },
  tabContent: {
    flex: 1,
    padding: "20px",
    overflowY: "auto"
  },
  
  // Section styles
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },
  sectionTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600"
  },
  sectionActions: {
    display: "flex",
    gap: "8px"
  },
  smallButton: {
    padding: "6px 12px",
    background: "#334155",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  clearButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    background: "rgba(220, 38, 38, 0.2)",
    color: "#dc2626",
    border: "1px solid #dc2626",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
    "&:hover": {
      background: "rgba(220, 38, 38, 0.3)"
    }
  },
  
  // Layer list
  layerList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px"
  },
  layerItem: {
    background: "#0f172a",
    borderRadius: "8px",
    padding: "12px",
    border: "1px solid #334155",
    transition: "border-color 0.2s",
    "&:hover": {
      borderColor: "#475569"
    }
  },
  layerHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px"
  },
  checkbox: {
    marginRight: "10px",
    cursor: "pointer",
    width: "16px",
    height: "16px"
  },
  deleteButton: {
    background: "rgba(220, 38, 38, 0.2)",
    color: "#dc2626",
    border: "1px solid #dc2626",
    borderRadius: "4px",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    "&:hover": {
      background: "rgba(220, 38, 38, 0.3)",
      transform: "scale(1.1)"
    }
  },
  layerControls: {
    display: "flex",
    gap: "8px",
    marginTop: "8px"
  },
  layerControlButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px",
    background: "#334155",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "11px",
    cursor: "pointer",
    transition: "background 0.2s",
    "&:hover": {
      background: "#475569"
    }
  },
  
  // Empty state
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#94a3b8",
    background: "rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    marginTop: "20px"
  },
  
  // Stats
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
    marginBottom: "20px"
  },
  statCard: {
    background: "#0f172a",
    borderRadius: "8px",
    padding: "16px",
    textAlign: "center",
    border: "1px solid #334155"
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#60a5fa",
    marginBottom: "4px"
  },
  statLabel: {
    fontSize: "12px",
    color: "#94a3b8"
  },
  
  // Feature panel
  featurePanel: {
    background: "#0f172a",
    borderRadius: "8px",
    padding: "16px",
    border: "1px solid #334155",
    marginTop: "20px"
  },
  featureTitle: {
    margin: "0 0 12px 0",
    fontSize: "14px",
    fontWeight: "600"
  },
  featureDetails: {
    fontSize: "13px"
  },
  featureRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    borderBottom: "1px solid #334155",
    "&:last-child": {
      borderBottom: "none"
    }
  },
  featureLabel: {
    fontWeight: "600",
    color: "#94a3b8"
  },
  featureValue: {
    color: "#f8fafc",
    maxWidth: "60%",
    textAlign: "right",
    wordBreak: "break-word"
  },
  
  // History
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  historyItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    background: "#0f172a",
    borderRadius: "8px",
    border: "1px solid #334155",
    transition: "border-color 0.2s",
    "&:hover": {
      borderColor: "#475569"
    }
  },
  historyIcon: {
    fontSize: "20px",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#1e293b",
    borderRadius: "6px"
  },
  historyContent: {
    flex: 1
  },
  
  // Styles
  stylesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
    marginBottom: "20px"
  },
  styleCard: {
    background: "#0f172a",
    borderRadius: "8px",
    padding: "16px",
    textAlign: "center",
    border: "2px solid",
    cursor: "pointer",
    position: "relative",
    transition: "all 0.2s",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
    }
  },
  styleIcon: {
    fontSize: "32px",
    marginBottom: "8px"
  },
  styleName: {
    fontSize: "12px",
    fontWeight: "600"
  },
  styleActive: {
    position: "absolute",
    top: "8px",
    right: "8px",
    background: "#48bb78",
    color: "white",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px"
  },
  styleSettings: {
    marginTop: "20px"
  },
  settingsTitle: {
    margin: "0 0 16px 0",
    fontSize: "14px",
    fontWeight: "600"
  },
  settingItem: {
    marginBottom: "16px"
  },
  settingLabel: {
    display: "block",
    marginBottom: "8px",
    fontSize: "12px",
    color: "#94a3b8"
  },
  slider: {
    width: "100%",
    height: "6px",
    borderRadius: "3px",
    background: "#334155",
    outline: "none",
    appearance: "none",
    "&::-webkit-slider-thumb": {
      appearance: "none",
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      background: "#60a5fa",
      cursor: "pointer"
    }
  },
  
  // Tools
  toolsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px"
  },
  toolCard: {
    background: "#0f172a",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
    border: "1px solid #334155",
    cursor: "pointer",
    transition: "all 0.2s",
    "&:hover": {
      borderColor: "#60a5fa",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
    }
  },
  toolIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 10px",
    fontSize: "20px",
    color: "white"
  },
  toolName: {
    fontSize: "12px",
    fontWeight: "600"
  },
  
  // Map container
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
    gap: "8px",
    zIndex: 100
  },
  mapControlButton: {
    width: "40px",
    height: "40px",
    background: "rgba(30, 41, 59, 0.9)",
    color: "white",
    border: "1px solid #475569",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
    transition: "all 0.2s",
    "&:hover": {
      background: "#334155",
      transform: "scale(1.05)"
    }
  },
  coordinates: {
    position: "absolute",
    bottom: "60px",
    left: "20px",
    background: "rgba(30, 41, 59, 0.9)",
    color: "white",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "12px",
    backdropFilter: "blur(10px)",
    border: "1px solid #475569",
    zIndex: 100
  },
  
  // Popup
  popup: {
    position: "absolute",
    background: "rgba(30, 41, 59, 0.95)",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #475569",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(10px)",
    minWidth: "200px",
    transform: "translate(-50%, -100%)",
    display: "none",
    zIndex: 1000
  },
  popupContent: {
    fontSize: "12px"
  },
  
  // Welcome overlay
  welcomeOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(15, 23, 42, 0.9)",
    backdropFilter: "blur(10px)",
    zIndex: 1000
  },
  welcomeCard: {
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    padding: "48px",
    borderRadius: "16px",
    textAlign: "center",
    maxWidth: "500px",
    border: "1px solid #334155",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
  },
  welcomeTitle: {
    margin: "0 0 16px 0",
    fontSize: "24px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  welcomeText: {
    color: "#94a3b8",
    lineHeight: "1.6",
    marginBottom: "32px"
  },
  welcomeActions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "32px"
  },
  welcomeButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 20px rgba(59, 130, 246, 0.4)"
    }
  },
  welcomeTips: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    textAlign: "left"
  },
  tip: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#94a3b8",
    fontSize: "14px"
  },
  
  // Status bar
  statusBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 24px",
    background: "#1e293b",
    borderTop: "1px solid #334155",
    fontSize: "13px",
    zIndex: 100
  },
  statusLeft: {
    display: "flex",
    gap: "24px"
  },
  statusCenter: {
    flex: 1,
    display: "flex",
    justifyContent: "center"
  },
  statusRight: {
    display: "flex",
    gap: "24px"
  },
  statusItem: {
    display: "flex",
    alignItems: "center",
    color: "#94a3b8"
  },
  statusMessage: {
    padding: "6px 16px",
    background: "rgba(72, 187, 120, 0.2)",
    color: "#48bb78",
    borderRadius: "20px",
    border: "1px solid #48bb78",
    fontSize: "12px",
    fontWeight: "600"
  },
  
  // Loading overlay
  loadingOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(15, 23, 42, 0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    backdropFilter: "blur(10px)"
  },
  loadingContent: {
    textAlign: "center",
    color: "white"
  },
  spinner: {
    width: "60px",
    height: "60px",
    border: "4px solid #334155",
    borderTopColor: "#60a5fa",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto"
  }
};

// Animations CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);

export default App;
