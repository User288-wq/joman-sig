// AdvancedTools.jsx
import React, { useState } from 'react';

const AdvancedTools = ({ map, selectedFeature }) => {
  const [activeTool, setActiveTool] = useState(null);
  const [toolResults, setToolResults] = useState([]);

  const TOOLS = [
    {
      id: 'union',
      name: 'Union',
      icon: '🔗',
      description: 'Fusionner plusieurs polygones'
    },
    {
      id: 'intersection',
      name: 'Intersection',
      icon: '⨉',
      description: 'Zone commune entre polygones'
    },
    {
      id: 'difference',
      name: 'Différence',
      icon: '➖',
      description: 'Soustraire une géométrie'
    },
    {
      id: 'clip',
      name: 'Découper',
      icon: '✂️',
      description: 'Découper avec un polygone'
    },
    {
      id: 'merge',
      name: 'Fusionner',
      icon: '🔄',
      description: 'Fusionner des entités'
    },
    {
      id: 'dissolve',
      name: 'Dissoudre',
      icon: '🫧',
      description: 'Dissoudre les limites'
    },
    {
      id: 'buffer-variable',
      name: 'Buffer variable',
      icon: '🌀',
      description: 'Buffer avec distance variable'
    },
    {
      id: 'voronoi',
      name: 'Diagramme de Voronoi',
      icon: '🧩',
      description: 'Créer des polygones de Voronoi'
    },
    {
      id: 'convex-hull',
      name: 'Enveloppe convexe',
      icon: '🟦',
      description: 'Plus petit polygone convexe'
    },
    {
      id: 'centroid',
      name: 'Centroïdes',
      icon: '⚫',
      description: 'Calculer les centroïdes'
    }
  ];

  // Exécuter un outil avec Turf.js
  const executeTool = async (toolId) => {
    setActiveTool(toolId);
    
    try {
      let result = null;
      const format = new GeoJSON();
      
      switch (toolId) {
        case 'union':
          // Logique d'union
          break;
        case 'intersection':
          // Logique d'intersection
          break;
        case 'centroid':
          if (selectedFeature) {
            const geojson = format.writeFeatureObject(selectedFeature.feature);
            const centroid = turf.centroid(geojson);
            result = {
              type: 'Feature',
              geometry: centroid.geometry,
              properties: { tool: 'centroid', source: selectedFeature.id }
            };
          }
          break;
        // ... autres outils
      }
      
      if (result) {
        setToolResults(prev => [...prev, {
          id: Date.now(),
          tool: toolId,
          result: result,
          timestamp: new Date().toISOString()
        }]);
        
        // Ajouter à la carte
        const vectorSource = new VectorSource({
          features: format.readFeatures(result)
        });
        
        const vectorLayer = new VectorLayer({
          source: vectorSource,
          name: `Résultat: ${TOOLS.find(t => t.id === toolId).name}`,
          style: new Style({
            fill: new Fill({ color: 'rgba(0, 255, 0, 0.3)' }),
            stroke: new Stroke({ color: '#00ff00', width: 2 })
          })
        });
        
        map.addLayer(vectorLayer);
      }
      
    } catch (error) {
      console.error(`Erreur outil ${toolId}:`, error);
      alert(`❌ Erreur: ${error.message}`);
    } finally {
      setActiveTool(null);
    }
  };

  // Interface en mode grille (comme QGIS)
  return (
    <div className="advanced-tools">
      <div className="tools-header">
        <h3>🛠️ Outils SIG avancés</h3>
        <div className="tools-info">
          {selectedFeature ? (
            <span className="tool-ready">✅ Prêt: {selectedFeature.geometry}</span>
          ) : (
            <span className="tool-waiting">⚠️ Sélectionnez une entité</span>
          )}
        </div>
      </div>

      {/* Grille d'outils */}
      <div className="tools-grid">
        {TOOLS.map(tool => (
          <div
            key={tool.id}
            className={`tool-card ${activeTool === tool.id ? 'active' : ''} ${!selectedFeature ? 'disabled' : ''}`}
            onClick={() => selectedFeature && executeTool(tool.id)}
            title={tool.description}
          >
            <div className="tool-icon">{tool.icon}</div>
            <div className="tool-name">{tool.name}</div>
            {activeTool === tool.id && (
              <div className="tool-loading">
                <div className="spinner"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Historique des résultats */}
      {toolResults.length > 0 && (
        <div className="tool-results">
          <h4>📋 Historique des opérations</h4>
          <div className="results-list">
            {toolResults.slice(-5).reverse().map(result => (
              <div key={result.id} className="result-item">
                <div className="result-header">
                  <span className="result-tool">
                    {TOOLS.find(t => t.id === result.tool)?.icon}
                    {TOOLS.find(t => t.id === result.tool)?.name}
                  </span>
                  <span className="result-time">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <button 
                  className="btn-small"
                  onClick={() => {
                    // Zoom sur le résultat
                    console.log('Zoom sur résultat', result.id);
                  }}
                >
                  🎯 Voir
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Outils de traitement par lots */}
      <div className="batch-processing">
        <h4>⚡ Traitement par lots</h4>
        <div className="batch-options">
          <button className="btn-secondary">
            📁 Appliquer à toutes les entités
          </button>
          <button className="btn-secondary">
            🔄 Traitement en chaîne
          </button>
          <button className="btn-secondary">
            ⚙️ Paramètres avancés
          </button>
        </div>
      </div>
    </div>
  );
};