const handleMeasureDistanceAdvanced = () => {
  if (!map) return;

  // Désactiver si déjà actif
  const existingDraw = map.getInteractions().getArray()
    .find(i => i.get('name') === 'measure-distance-advanced');
  if (existingDraw) {
    map.removeInteraction(existingDraw);
    // Supprimer aussi la couche
    const measureLayer = map.getLayers().getArray()
      .find(l => l.get('name') === 'measurements-layer');
    if (measureLayer) map.removeLayer(measureLayer);
    
    const existingTooltip = map.getOverlays().getArray()
      .find(o => o.get('name') === 'measure-tooltip');
    if (existingTooltip) map.removeOverlay(existingTooltip);
    
    return;
  }

  // Couche pour stocker les mesures
  const measureSource = new VectorSource();
  const measureLayer = new VectorLayer({
    source: measureSource,
    name: 'measurements-layer',
    style: (feature) => {
      const length = feature.get('length');
      const color = length > 1000 ? '#ff6600' : '#0066cc';
      
      return new Style({
        stroke: new Stroke({
          color: color,
          width: 3,
          lineDash: [10, 5]
        }),
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: '#ffffff' }),
          stroke: new Stroke({ color: color, width: 2 })
        }),
        text: new Text({
          text: `${feature.get('label')}`,
          font: 'bold 14px Arial',
          fill: new Fill({ color: '#000000' }),
          stroke: new Stroke({ color: '#ffffff', width: 3 }),
          offsetY: -15,
          overflow: true
        })
      });
    }
  });
  
  map.addLayer(measureLayer);

  // Tooltip pour afficher la mesure en temps réel
  const measureTooltipElement = document.createElement('div');
  measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
  measureTooltipElement.style.cssText = `
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 14px;
    border: 2px solid #4CAF50;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  `;
  
  const measureTooltip = new Overlay({
    element: measureTooltipElement,
    offset: [0, -20],
    positioning: 'bottom-center'
  });
  measureTooltip.set('name', 'measure-tooltip');
  map.addOverlay(measureTooltip);

  // Outil de dessin
  const draw = new Draw({
    source: new VectorSource(),
    type: 'LineString',
    style: new Style({
      stroke: new Stroke({
        color: 'rgba(255, 0, 0, 0.8)',
        width: 3,
        lineDash: [15, 10]
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({ color: 'rgba(255, 255, 255, 0.9)' }),
        stroke: new Stroke({ color: 'rgba(255, 0, 0, 0.9)', width: 2 })
      })
    })
  });
  
  draw.set('name', 'measure-distance-advanced');
  map.addInteraction(draw);

  // Variables pour suivre la mesure
  let sketchFeature = null;
  let tooltipCoord = null;

  // Événement : début du dessin
  draw.on('drawstart', (evt) => {
    sketchFeature = evt.feature;
    measureTooltipElement.innerHTML = 'Début de la mesure...';
  });

  // Événement : dessin en cours (mesure en temps réel)
  draw.on('drawend', (evt) => {
    const line = evt.feature.getGeometry();
    const length = getLength(line);
    
    // Formater la distance
    let distance, unit, label;
    if (length > 1000) {
      distance = (length / 1000).toFixed(2);
      unit = 'km';
    } else {
      distance = length.toFixed(2);
      unit = 'm';
    }
    
    label = `${distance} ${unit}`;
    
    // Créer la feature de mesure finale
    const measureFeature = new Feature({
      geometry: line,
      length: length,
      label: label,
      timestamp: new Date().toISOString(),
      type: 'measurement'
    });
    
    measureSource.addFeature(measureFeature);
    
    // Afficher le résultat final
    measureTooltipElement.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 16px; color: #4CAF50;">✅ Mesure terminée</div>
        <div style="font-size: 18px; margin: 5px 0;">${label}</div>
        <div style="font-size: 12px; opacity: 0.8;">Double-cliquez pour terminer</div>
      </div>
    `;
    
    // Garder le tooltip visible
    const coords = line.getLastCoordinate();
    measureTooltip.setPosition(coords);
    
    // Ajouter au log des mesures
    const measurement = {
      id: Date.now(),
      distance: length,
      label: label,
      coordinates: line.getCoordinates(),
      date: new Date().toLocaleString()
    };
    
    console.log('📏 Mesure enregistrée:', measurement);
    
    // Option : sauvegarde automatique
    saveMeasurementToState(measurement);
  });

  // Événement : dessin en cours (mise à jour en temps réel)
  draw.on('drawabort', () => {
    sketchFeature = null;
    tooltipCoord = null;
    measureTooltip.setPosition(undefined);
  });

  // Suivi de la souris pour mise à jour en temps réel
  map.on('pointermove', (evt) => {
    if (sketchFeature && evt.dragging === false) {
      const geom = sketchFeature.getGeometry();
      if (geom && geom.getType() === 'LineString') {
        const coordinates = geom.getCoordinates();
        if (coordinates.length > 1) {
          // Calculer la longueur actuelle
          const line = new LineString(coordinates);
          const length = getLength(line);
          
          // Formater l'affichage
          let displayLength;
          if (length > 1000) {
            displayLength = `${(length / 1000).toFixed(2)} km`;
          } else {
            displayLength = `${length.toFixed(2)} m`;
          }
          
          // Mettre à jour le tooltip
          measureTooltipElement.innerHTML = `
            <div style="text-align: center;">
              <div style="font-size: 14px;">Distance :</div>
              <div style="font-size: 18px; color: #4CAF50; font-weight: bold;">
                ${displayLength}
              </div>
              <div style="font-size: 11px; opacity: 0.7;">
                ${coordinates.length} point(s)
              </div>
            </div>
          `;
          
          measureTooltip.setPosition(evt.coordinate);
        }
      }
    }
  });

  // Fonction utilitaire pour sauvegarder
  const saveMeasurementToState = (measurement) => {
    // Stocker dans le state React ou dans un store
    console.log('💾 Mesure sauvegardée:', measurement);
    // Exemple : setMeasurements(prev => [...prev, measurement]);
  };
};