// 6. TRAITEMENTS - VERSION COMPLÈTE AVEC TURF.JS
const handleProcessingActions = (action, details) => {
  console.log(`🚀 Traitement: ${action}`, details);

  // Import des utilitaires (à ajuster selon ton chemin)
  const { 
    handleBufferOperation, 
    handleUnionOperation, 
    handleIntersectionOperation,
    handleFieldCalculation 
  } = require('./utils/processingActions');

  // Fonction pour récupérer les géométries sélectionnées
  const getSelectedGeometries = () => {
    if (!selectedLayers || selectedLayers.length === 0) return [];
    return selectedLayers.flatMap(layer => 
      (layer.features || []).map(f => f.geometry).filter(g => g)
    );
  };

  switch(action) {
    case 'buffer':
      const geometries = getSelectedGeometries();
      if (geometries.length === 0) {
        alert("⚠️ Sélectionnez d'abord des géométries");
        return;
      }
      
      const distanceInput = prompt("📏 Distance du tampon (mètres):", "100");
      if (!distanceInput) return;
      
      const distance = parseFloat(distanceInput);
      if (isNaN(distance) || distance <= 0) {
        alert("❌ Distance invalide");
        return;
      }

      try {
        const result = handleBufferOperation(selectedLayers, distance);
        if (result.success) {
          alert(`✅ Buffer créé sur ${result.features.length} entité(s)`);
          setCurrentOperation({
            type: 'buffer',
            result: result.features,
            params: { distance }
          });
        }
      } catch (error) {
        console.error("Erreur buffer:", error);
        alert("❌ Erreur lors du calcul du buffer");
      }
      break;

    case 'union':
      try {
        const result = handleUnionOperation(selectedLayers);
        if (result.success) {
          alert(result.message);
          setCurrentOperation({
            type: 'union',
            result: result.features
          });
        }
      } catch (error) {
        console.error("Erreur union:", error);
        alert("❌ Erreur lors de l'union");
      }
      break;

    case 'intersection':
      try {
        const result = handleIntersectionOperation(selectedLayers);
        if (result.success) {
          alert(result.message);
          setCurrentOperation({
            type: 'intersection',
            result: result.features
          });
        }
      } catch (error) {
        console.error("Erreur intersection:", error);
        alert("❌ Erreur lors de l'intersection");
      }
      break;

    case 'dissolve':
      alert("Dissoudre (à implémenter avec Turf.js)");
      break;

    case 'clip':
      alert("Découpage (à implémenter avec Turf.js)");
      break;

    case 'field-calc':
      try {
        // Récupère les features sélectionnées
        const selectedFeatures = selectedLayers?.flatMap(l => l.features || []) || [];
        const result = handleFieldCalculation(selectedFeatures);
        if (result.success) {
          alert(result.message);
        }
      } catch (error) {
        console.error("Erreur calcul champ:", error);
        alert("❌ Erreur lors du calcul");
      }
      break;

    default:
      console.log("Action traitement non gérée:", action);
      alert(`Traitement "${action}" non encore implémenté`);
  }
};