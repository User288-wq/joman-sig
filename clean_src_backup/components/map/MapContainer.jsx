import React, { useEffect, useRef, useCallback } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import { fromLonLat, toLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import { Style, Fill, Stroke, Circle } from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';
import 'ol/ol.css';
import './MapContainer.css';

const MapContainer = ({ viewState, layers }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const vectorSourceRef = useRef(new VectorSource());

  // Initialisation de la carte
  const initMap = useCallback(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = new Map({
      target: mapRef.current,
      controls: defaultControls({
        attributionOptions: { collapsible: true }
      }).extend([]),
      view: new View({
        center: fromLonLat(viewState.center),
        zoom: viewState.zoom,
        rotation: viewState.rotation,
        constrainResolution: true
      })
    });

    // Couche vectorielle par défaut
    const vectorLayer = new VectorLayer({
      source: vectorSourceRef.current,
      style: new Style({
        fill: new Fill({
          color: 'rgba(33, 150, 243, 0.2)'
        }),
        stroke: new Stroke({
          color: '#2196f3',
          width: 2
        }),
        image: new Circle({
          radius: 7,
          fill: new Fill({ color: '#2196f3' }),
          stroke: new Stroke({ color: '#fff', width: 2 })
        })
      })
    });

    map.addLayer(vectorLayer);
    mapInstance.current = map;

    // Événements
    map.on('moveend', () => {
      const view = map.getView();
      const center = toLonLat(view.getCenter());
      const zoom = view.getZoom();
      // Mettre à jour le store si nécessaire
    });

    return () => map.setTarget(null);
  }, []);

  // Mise à jour des couches
  useEffect(() => {
    if (!mapInstance.current) return;

    const map = mapInstance.current;
    
    // Supprimer toutes les couches sauf la vectorielle
    map.getLayers().forEach((layer, index) => {
      if (index > 0) map.removeLayer(layer);
    });

    // Ajouter les couches visibles
    layers.forEach(layer => {
      if (!layer.visible) return;

      let olLayer;
      
      switch (layer.source.type) {
        case 'osm':
          olLayer = new TileLayer({
            source: new OSM(),
            opacity: layer.opacity,
            className: 'osm-layer'
          });
          break;
          
        case 'xyz':
          olLayer = new TileLayer({
            source: new XYZ({
              url: layer.source.url,
              attributions: layer.source.attributions
            }),
            opacity: layer.opacity
          });
          break;
          
        case 'geojson':
          if (layer.source.data) {
            const format = new GeoJSON();
            const features = format.readFeatures(layer.source.data, {
              featureProjection: 'EPSG:3857'
            });
            
            const source = new VectorSource({ features });
            olLayer = new VectorLayer({
              source,
              opacity: layer.opacity,
              style: new Style({
                fill: new Fill({ color: 'rgba(76, 175, 80, 0.3)' }),
                stroke: new Stroke({ color: '#4caf50', width: 2 })
              })
            });
          }
          break;
          
        default:
          console.warn(`Type de source non supporté: ${layer.source.type}`);
      }

      if (olLayer) {
        map.addLayer(olLayer);
      }
    });
  }, [layers]);

  // Mise à jour de la vue
  useEffect(() => {
    if (!mapInstance.current) return;

    const map = mapInstance.current;
    const view = map.getView();
    
    view.setCenter(fromLonLat(viewState.center));
    view.setZoom(viewState.zoom);
    view.setRotation(viewState.rotation);
  }, [viewState]);

  useEffect(() => {
    initMap();
  }, [initMap]);

  return (
    <div className="map-container">
      <div 
        ref={mapRef} 
        className="ol-map"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Overlay pour les coordonnées */}
      <div className="coordinates-overlay">
        <div className="coordinate-display">
          Lat: {viewState.center[1].toFixed(4)}, Lon: {viewState.center[0].toFixed(4)}
        </div>
        <div className="zoom-display">
          Zoom: {Math.round(viewState.zoom)}
        </div>
      </div>
    </div>
  );
};

export default MapContainer;
