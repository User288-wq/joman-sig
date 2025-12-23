// ============================================
// IMPORT CORRECT DES ACTIONS DE TRAITEMENT
// ============================================

import {
  handleBufferOperation,
  handleUnionOperation,
  handleIntersectionOperation,
  handleFieldCalculation,
  handleClipOperation
} from "./utils/processingActions";

// ============================================
// FONCTION AMÉLIORÉE handleProcessingActions
// ============================================

const handleProcessingActions = (action, details) => {
  console.log(\ Traitement: \\, details);

  // Récupère les couches sélectionnées (à adapter à ton état réel)
  const getSelectedOlLayers = () => {
    if (!selectedLayers || selectedLayers.length === 0) return [];
    
    // Version simplifiée : retourne des objets mock
    return selectedLayers.map(layer => ({
      getSource: () => ({
        getFeatures: () => [
          {
            getGeometry: () => ({
              getType: () => 'Polygon',
              getCoordinates: () => [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]
            }),
            getProperties: () => ({ id: 1, name: 'Test Feature' }),
            getId: () => 1
          }
        ]
      })
    }));
  };

  switch(action) {
    case 'buffer':
      const olLayers = getSelectedOlLayers();
      if (olLayers.length === 0) {
        alert(" Sélectionnez d'abord des couches");
        return;
      }
      
      const distanceInput = prompt(" Distance du tampon (mètres):", "100");
      if (!distanceInput) return;
      
      const distance = parseFloat(distanceInput);
      if (isNaN(distance) || distance <= 0) {
        alert(" Distance invalide");
        return;
      }

      const bufferResult = handleBufferOperation(olLayers, distance);
      if (bufferResult.success) {
        alert(bufferResult.message);
        
        // Simulation d'ajout de couche
        console.log('Nouvelle couche créée:', bufferResult.features);
        
        setCurrentOperation({
          type: 'buffer',
          result: bufferResult.features,
          params: { distance }
        });
        
        // Historique
        setProcessingHistory(prev => [...prev, {
          type: 'buffer',
          timestamp: new Date(),
          params: { distance },
          resultCount: bufferResult.features.length
        }]);
        
        // ICI : ajouter la logique pour afficher sur la carte
        // addResultAsLayer(bufferResult.features, \Buffer_\m\);
        
      } else {
        alert(\❌ \\);
      }
      break;

    case 'union':
      const unionResult = handleUnionOperation(getSelectedOlLayers());
      alert(unionResult.message);
      break;

    case 'intersection':
      const intersectResult = handleIntersectionOperation(getSelectedOlLayers());
      alert(intersectResult.message);
      break;

    case 'field-calc':
      const features = selectedLayers?.flatMap(l => l.features || []) || [];
      const calcResult = handleFieldCalculation(features);
      alert(calcResult.message);
      break;

    case 'clip':
      alert("Découpage (clip) - Connecte les couches réelles");
      break;

    case 'dissolve':
      alert("Dissoudre - À implémenter avec Turf.js");
      break;

    default:
      console.log("Action traitement non gérée:", action);
      alert(\Traitement "\" non encore implémenté\);
  }
};

// ============================================
// FONCTION UTILITAIRE POUR AJOUTER DES COUCHES
// ============================================

const addResultAsLayer = (features, layerName) => {
  if (!mapInstance || !features || features.length === 0) return;
  
  console.log(\Ajout de la couche \ avec \ features\);
  
  // ICI : code réel pour ajouter une couche OpenLayers
  // const vectorSource = new (require('ol/source/Vector'))({ features });
  // const vectorLayer = new (require('ol/layer/Vector'))({ ... });
  // mapInstance.addLayer(vectorLayer);
  
  // Mise à jour du state
  setSelectedLayers(prev => [...prev, {
    id: \esult_\\,
    name: layerName,
    type: 'result',
    features: features
  }]);
};
