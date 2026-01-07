const handleBuffer = () => {
  if (!selectedFeature) {
    alert("⚠️ Sélectionnez d'abord une entité sur la carte");
    return;
  }
  
  const distance = parseFloat(prompt("Distance du buffer (mètres):", "100"));
  if (!distance || isNaN(distance)) return;
  
  try {
    // Convertir la feature OpenLayers en GeoJSON
    const format = new GeoJSON();
    const geojson = format.writeFeatureObject(selectedFeature.feature);
    
    // Créer le buffer avec Turf.js
    const buffered = turf.buffer(geojson, distance / 1000, { units: 'kilometers' });
    
    // Ajouter le buffer à la carte
    const bufferSource = new VectorSource({
      features: format.readFeatures(buffered)
    });
    
    const bufferLayer = new VectorLayer({
      source: bufferSource,
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
      visible: true
    }]);
    
    alert(`✅ Buffer de ${distance}m créé !`);
    
  } catch (error) {
    console.error("❌ Erreur buffer:", error);
    alert("Erreur lors de la création du buffer");
  }
};