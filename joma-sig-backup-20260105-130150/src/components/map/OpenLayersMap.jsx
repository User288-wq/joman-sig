import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import 'ol/ol.css';
import { Box } from '@mui/material';

const OpenLayersMap = forwardRef(({ center = [2.3522, 48.8566], zoom = 10, style = {} }, ref) => {
  const mapRef = useRef();
  const mapInstance = useRef(null);

  // Exposer des méthodes au parent via ref
  useImperativeHandle(ref, () => ({
    getMap: () => mapInstance.current,
    setCenter: (coordinates) => {
      if (mapInstance.current) {
        mapInstance.current.getView().setCenter(fromLonLat(coordinates));
      }
    },
    setZoom: (level) => {
      if (mapInstance.current) {
        mapInstance.current.getView().setZoom(level);
      }
    },
    addLayer: (layer) => {
      if (mapInstance.current) {
        mapInstance.current.addLayer(layer);
      }
    },
    removeLayer: (layer) => {
      if (mapInstance.current) {
        mapInstance.current.removeLayer(layer);
      }
    },
    getLayers: () => {
      return mapInstance.current ? mapInstance.current.getLayers() : [];
    }
  }));

  useEffect(() => {
    if (!mapInstance.current) {
      // Initialiser la carte
      mapInstance.current = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
            properties: { name: 'base-osm' }
          })
        ],
        view: new View({
          center: fromLonLat(center),
          zoom: zoom,
          minZoom: 2,
          maxZoom: 18
        }),
        controls: defaultControls({
          zoom: true,
          rotate: false,
          attribution: true
        })
      });

      // Écouter les changements de zoom
      mapInstance.current.getView().on('change:resolution', () => {
        const currentZoom = mapInstance.current.getView().getZoom();
        // Vous pouvez émettre un événement ou mettre à jour un état ici
        console.log('Zoom changed to:', currentZoom);
      });

      // Écouter les changements de centre
      mapInstance.current.getView().on('change:center', () => {
        const currentCenter = mapInstance.current.getView().getCenter();
        console.log('Center changed to:', currentCenter);
      });
    }

    // Mettre à jour la vue si les props changent
    if (mapInstance.current) {
      mapInstance.current.getView().setCenter(fromLonLat(center));
      mapInstance.current.getView().setZoom(zoom);
    }

    // Nettoyage
    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(null);
      }
    };
  }, [center, zoom]);

  return (
    <Box
      ref={mapRef}
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        '& .ol-control': {
          backgroundColor: 'rgba(255,255,255,0.8)',
        },
        '& .ol-attribution': {
          fontSize: '10px',
        },
        ...style
      }}
    />
  );
});

OpenLayersMap.displayName = 'OpenLayersMap';

export default OpenLayersMap;