import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Stroke, Fill, Circle as CircleStyle } from "ol/style";
import { fromLonLat, toLonLat } from "ol/proj";
import { Draw } from "ol/interaction";
import { getArea, getLength } from "ol/sphere";

function App() {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [center] = useState([2.3522, 48.8566]);
  const [zoom] = useState(10);
  const [drawingMode, setDrawingMode] = useState(null);
  const [layers, setLayers] = useState([]);
  const vectorSourceRef = useRef(new VectorSource());
  const drawInteractionRef = useRef(null);

  // Initialisation de la carte
  useEffect(() => {
    if (!mapRef.current || map) return;

    const newMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat(center),
        zoom: zoom,
        maxZoom: 20,
        minZoom: 2
      })
    });

    // Couche de dessin
    const drawingLayer = new VectorLayer({
      source: vectorSourceRef.current,
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

    newMap.addLayer(drawingLayer);
    setMap(newMap);

    return () => newMap.setTarget(null);
  }, []);

  // Fonction pour activer le dessin
  const activateDrawingTool = (type) => {
    if (!map || drawingMode === type) {
      deactivateDrawingTool();
      return;
    }

    deactivateDrawingTool();
    setDrawingMode(type);

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
      
      alert(`Dessin terminé: ${geometry.getType()}\n${
        area ? `Surface: ${(area/10000).toFixed(2)} ha` : 
        length ? `Longueur: ${(length/1000).toFixed(2)} km` : ''
      }`);
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

  // Ajouter une couche d'exemple
  const addSampleLayer = () => {
    if (!map) return;

    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 100, 100, 0.3)'
        }),
        stroke: new Stroke({
          color: '#ff0000',
          width: 2
        })
      })
    });

    map.addLayer(vectorLayer);
    setLayers(prev => [...prev, `Couche ${prev.length + 1}`]);
    alert("Couche d'exemple ajoutée !");
  };

  // Styles
  const styles = {
    app: {
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#0f172a',
      color: '#f8fafc',
      fontFamily: "'Segoe UI', sans-serif"
    },
    header: {
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
      padding: '15px 25px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
    },
    title: {
      margin: 0,
      fontSize: '24px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    subtitle: {
      margin: '5px 0 0 0',
      fontSize: '12px',
      opacity: 0.8
    },
    toolbar: {
      background: '#1e293b',
      padding: '12px 25px',
      display: 'flex',
      gap: '15px',
      borderBottom: '1px solid #334155'
    },
    button: {
      padding: '10px 20px',
      background: '#334155',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s'
    },
    buttonActive: {
      background: '#4299e1'
    },
    mapContainer: {
      flex: 1,
      position: 'relative',
      background: '#0f172a'
    },
    map: {
      width: '100%',
      height: '100%'
    },
    controls: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 100
    },
    controlButton: {
      width: '45px',
      height: '45px',
      background: 'rgba(30, 41, 59, 0.9)',
      color: 'white',
      border: '1px solid #475569',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.2s'
    },
    panel: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      background: 'rgba(30, 41, 59, 0.9)',
      color: 'white',
      padding: '20px',
      borderRadius: '12px',
      width: '300px',
      backdropFilter: 'blur(10px)',
      border: '1px solid #475569',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      zIndex: 100
    },
    panelTitle: {
      margin: '0 0 15px 0',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#60a5fa'
    },
    statusBar: {
      background: '#1e293b',
      padding: '10px 25px',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '13px',
      color: '#94a3b8',
      borderTop: '1px solid #334155'
    }
  };

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}> JOMA SIG Pro</h1>
          <p style={styles.subtitle}>Système d'Information Géographique Professionnel v2.1.0</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold' }}>Administrateur</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>Session active</div>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4299e1 0%, #667eea 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            JS
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <button 
          style={styles.button}
          onClick={addSampleLayer}
        >
           Ajouter une couche
        </button>
        
        <button 
          style={{
            ...styles.button,
            ...(drawingMode === 'Point' && styles.buttonActive)
          }}
          onClick={() => activateDrawingTool('Point')}
        >
           Point
        </button>
        
        <button 
          style={{
            ...styles.button,
            ...(drawingMode === 'LineString' && styles.buttonActive)
          }}
          onClick={() => activateDrawingTool('LineString')}
        >
           Ligne
        </button>
        
        <button 
          style={{
            ...styles.button,
            ...(drawingMode === 'Polygon' && styles.buttonActive)
          }}
          onClick={() => activateDrawingTool('Polygon')}
        >
           Polygone
        </button>
        
        <button 
          style={styles.button}
          onClick={() => alert('Export fonctionnel !')}
        >
           Exporter
        </button>
      </div>

      {/* Map Container */}
      <div style={styles.mapContainer}>
        <div ref={mapRef} style={styles.map} />
        
        {/* Panel latéral */}
        <div style={styles.panel}>
          <h3 style={styles.panelTitle}> Panneau de contrôle</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Couches actives ({layers.length})</h4>
            {layers.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {layers.map((layer, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{layer}</li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.7 }}>
                Aucune couche chargée
              </p>
            )}
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Mode actuel</h4>
            <div style={{
              padding: '10px',
              background: drawingMode ? '#0f172a' : 'transparent',
              borderRadius: '6px',
              border: '1px solid #334155'
            }}>
              {drawingMode ? `Dessin: ${drawingMode}` : 'Navigation'}
            </div>
          </div>
          
          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Instructions</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px' }}>
              <li>Cliquez sur les boutons pour dessiner</li>
              <li>Double-cliquez pour terminer un dessin</li>
              <li>Utilisez la molette pour zoomer</li>
              <li>Maintenez Shift pour déplacer la carte</li>
            </ul>
          </div>
        </div>

        {/* Contrôles carte */}
        <div style={styles.controls}>
          <button 
            style={styles.controlButton}
            onClick={() => map?.getView().setZoom(map.getView().getZoom() + 1)}
            title="Zoom avant"
          >
            +
          </button>
          <button 
            style={styles.controlButton}
            onClick={() => map?.getView().setZoom(map.getView().getZoom() - 1)}
            title="Zoom arrière"
          >
            -
          </button>
          <button 
            style={styles.controlButton}
            onClick={() => map?.getView().setZoom(10)}
            title="Zoom par défaut"
          >
            
          </button>
        </div>

        {/* Coordonnées */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          background: 'rgba(30, 41, 59, 0.9)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '8px',
          fontSize: '13px',
          backdropFilter: 'blur(10px)',
          border: '1px solid #475569'
        }}>
          Paris: {center[0].toFixed(4)}, {center[1].toFixed(4)}  Zoom: {zoom}x
        </div>
      </div>

      {/* Status Bar */}
      <div style={styles.statusBar}>
        <div>
           JOMA SIG Pro  v2.1.0  OpenLayers 7.3.0
        </div>
        <div>
          {layers.length} couches  Mode: {drawingMode || 'Navigation'}
        </div>
        <div>
          © 2024 JOMA Tech  Tous droits réservés
        </div>
      </div>
    </div>
  );
}

export default App;
