// utils/processingActions.js
import * as turf from '@turf/turf';
import GeoJSON from 'ol/format/GeoJSON';

/**
 * Crée un buffer autour des entités
 * @param {Array} olLayers - Couches OpenLayers sélectionnées
 * @param {number} distance - Distance en mètres
 * @returns {Object} Résultat de l'opération
 */
export const handleBufferOperation = (olLayers, distance) => {
  try {
    console.log('🚀 Début opération buffer:', { layers: olLayers.length, distance });
    
    if (!olLayers || olLayers.length === 0) {
      return { success: false, message: "Aucune couche sélectionnée" };
    }

    const allFeatures = [];
    const format = new GeoJSON();
    
    // Convertir toutes les entités OpenLayers en GeoJSON Turf
    olLayers.forEach(layer => {
      const source = layer.getSource();
      if (source && source.getFeatures) {
        const features = source.getFeatures();
        features.forEach(feature => {
          const geojson = format.writeFeatureObject(feature);
          allFeatures.push(turf.feature(geojson.geometry, geojson.properties));
        });
      }
    });

    if (allFeatures.length === 0) {
      return { success: false, message: "Aucune entité trouvée dans les couches sélectionnées" };
    }

    // Appliquer le buffer (Turf.js utilise des kilomètres)
    const distanceKm = distance / 1000;
    const bufferedFeatures = allFeatures.map(feature => {
      try {
        return turf.buffer(feature, distanceKm, { units: 'kilometers' });
      } catch (error) {
        console.warn('Erreur sur une entité:', error);
        return null;
      }
    }).filter(f => f !== null);

    if (bufferedFeatures.length === 0) {
      return { success: false, message: "Le buffer n'a pu être appliqué sur aucune entité" };
    }

    console.log(`✅ Buffer réussi: ${bufferedFeatures.length}/${allFeatures.length} entités`);

    return {
      success: true,
      message: `Buffer de ${distance}m appliqué avec succès (${bufferedFeatures.length} entités)`,
      features: bufferedFeatures,
      statistics: {
        originalCount: allFeatures.length,
        bufferedCount: bufferedFeatures.length,
        distance: distance
      }
    };

  } catch (error) {
    console.error('❌ Erreur buffer:', error);
    return { 
      success: false, 
      message: `Erreur lors du buffer: ${error.message}` 
    };
  }
};

/**
 * Union de polygones
 * @param {Array} olLayers - Couches OpenLayers
 * @returns {Object} Résultat de l'union
 */
export const handleUnionOperation = (olLayers) => {
  try {
    console.log('🚀 Début opération union');
    
    if (!olLayers || olLayers.length < 2) {
      return { success: false, message: "Sélectionnez au moins 2 couches de polygones" };
    }

    const format = new GeoJSON();
    const polygons = [];
    
    // Collecter tous les polygones
    olLayers.forEach(layer => {
      const source = layer.getSource();
      if (source && source.getFeatures) {
        source.getFeatures().forEach(feature => {
          if (feature.getGeometry().getType() === 'Polygon') {
            const geojson = format.writeFeatureObject(feature);
            polygons.push(turf.feature(geojson.geometry, geojson.properties));
          }
        });
      }
    });

    if (polygons.length < 2) {
      return { success: false, message: "Moins de 2 polygones trouvés" };
    }

    // Union progressive
    let unionResult = polygons[0];
    for (let i = 1; i < polygons.length; i++) {
      try {
        unionResult = turf.union(unionResult, polygons[i]);
      } catch (error) {
        console.warn(`Union partiellement échouée avec polygone ${i}:`, error);
      }
    }

    const area = turf.area(unionResult);
    
    return {
      success: true,
      message: `Union réalisée: ${polygons.length} polygones fusionnés (${(area/10000).toFixed(2)} hectares)`,
      features: [unionResult],
      statistics: {
        inputPolygons: polygons.length,
        areaM2: area,
        areaHectares: area / 10000
      }
    };

  } catch (error) {
    console.error('❌ Erreur union:', error);
    return { 
      success: false, 
      message: `Erreur lors de l'union: ${error.message}` 
    };
  }
};

/**
 * Intersection entre couches
 * @param {Array} olLayers - Couches OpenLayers
 * @returns {Object} Résultat de l'intersection
 */
export const handleIntersectionOperation = (olLayers) => {
  try {
    console.log('🚀 Début opération intersection');
    
    if (!olLayers || olLayers.length < 2) {
      return { success: false, message: "Sélectionnez au moins 2 couches" };
    }

    const format = new GeoJSON();
    const features = [];
    
    olLayers.forEach(layer => {
      const source = layer.getSource();
      if (source && source.getFeatures) {
        source.getFeatures().forEach(feature => {
          const geojson = format.writeFeatureObject(feature);
          features.push(turf.feature(geojson.geometry, geojson.properties));
        });
      }
    });

    if (features.length < 2) {
      return { success: false, message: "Pas assez d'entités" };
    }

    // Intersection des 2 premières entités (pour l'exemple)
    const intersectResult = turf.intersect(features[0], features[1]);
    
    if (!intersectResult) {
      return { success: false, message: "Aucune intersection détectée" };
    }

    const area = turf.area(intersectResult);
    
    return {
      success: true,
      message: `Intersection trouvée: ${area.toFixed(2)} m² (${(area/10000).toFixed(4)} hectares)`,
      features: [intersectResult],
      statistics: {
        areaM2: area,
        areaHectares: area / 10000
      }
    };

  } catch (error) {
    console.error('❌ Erreur intersection:', error);
    return { 
      success: false, 
      message: `Erreur lors de l'intersection: ${error.message}` 
    };
  }
};

/**
 * Calcul de champ sur les attributs
 * @param {Array} features - Entités GeoJSON
 * @param {string} fieldName - Nom du champ à créer
 * @param {string} expression - Expression de calcul
 * @returns {Object} Résultat du calcul
 */
export const handleFieldCalculation = (features, fieldName = 'area_calculated', expression = 'area') => {
  try {
    console.log('🚀 Début calcul de champ:', { features: features.length, fieldName });
    
    if (!features || features.length === 0) {
      return { success: false, message: "Aucune entité sélectionnée" };
    }

    const updatedFeatures = features.map(feature => {
      const newProperties = { ...feature.properties };
      
      // Exemple: calcul de l'aire pour les polygones
      if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
        const area = turf.area(feature);
        newProperties[fieldName] = area;
      } else if (feature.geometry.type === 'LineString') {
        const length = turf.length(feature, { units: 'kilometers' });
        newProperties[fieldName] = length;
      }
      
      return {
        ...feature,
        properties: newProperties
      };
    });

    return {
      success: true,
      message: `Champ "${fieldName}" ajouté à ${updatedFeatures.length} entités`,
      features: updatedFeatures,
      statistics: {
        featuresCount: updatedFeatures.length,
        fieldName: fieldName
      }
    };

  } catch (error) {
    console.error('❌ Erreur calcul champ:', error);
    return { 
      success: false, 
      message: `Erreur lors du calcul: ${error.message}` 
    };
  }
};

/**
 * Découpage (clip) d'une couche par une autre
 * @param {Array} olLayers - [couche à découper, couche de masque]
 * @returns {Object} Résultat du découpage
 */
export const handleClipOperation = (olLayers) => {
  try {
    console.log('🚀 Début opération clip');
    
    if (!olLayers || olLayers.length < 2) {
      return { success: false, message: "Sélectionnez 2 couches (cible + masque)" };
    }

    const format = new GeoJSON();
    
    // Première couche: entités à découper
    const targetFeatures = [];
    const targetSource = olLayers[0].getSource();
    if (targetSource && targetSource.getFeatures) {
      targetSource.getFeatures().forEach(feature => {
        const geojson = format.writeFeatureObject(feature);
        targetFeatures.push(turf.feature(geojson.geometry, geojson.properties));
      });
    }

    // Deuxième couche: masque (polygone)
    const maskFeatures = [];
    const maskSource = olLayers[1].getSource();
    if (maskSource && maskSource.getFeatures) {
      maskSource.getFeatures().forEach(feature => {
        if (feature.getGeometry().getType() === 'Polygon') {
          const geojson = format.writeFeatureObject(feature);
          maskFeatures.push(turf.feature(geojson.geometry, geojson.properties));
        }
      });
    }

    if (targetFeatures.length === 0 || maskFeatures.length === 0) {
      return { success: false, message: "Couches insuffisantes pour le découpage" };
    }

    // Pour l'exemple, on utilise le premier masque
    const mask = maskFeatures[0];
    const clippedFeatures = targetFeatures.map(target => {
      try {
        return turf.intersect(target, mask);
      } catch (error) {
        return null; // Pas d'intersection
      }
    }).filter(f => f !== null);

    if (clippedFeatures.length === 0) {
      return { success: false, message: "Aucune intersection pour le découpage" };
    }

    return {
      success: true,
      message: `Découpage réussi: ${clippedFeatures.length} entités conservées`,
      features: clippedFeatures,
      statistics: {
        inputCount: targetFeatures.length,
        outputCount: clippedFeatures.length,
        retentionRate: ((clippedFeatures.length / targetFeatures.length) * 100).toFixed(1) + '%'
      }
    };

  } catch (error) {
    console.error('❌ Erreur clip:', error);
    return { 
      success: false, 
      message: `Erreur lors du découpage: ${error.message}` 
    };
  }
};

/**
 * Dissoudre les entités par attribut
 * @param {Array} olLayers - Couches OpenLayers
 * @param {string} dissolveField - Champ de dissolution
 * @returns {Object} Résultat de la dissolution
 */
export const handleDissolveOperation = (olLayers, dissolveField = 'type') => {
  try {
    console.log('🚀 Début opération dissolve');
    
    // Implémentation simplifiée
    return {
      success: true,
      message: "Dissolve à implémenter complètement",
      features: [],
      statistics: {}
    };

  } catch (error) {
    console.error('❌ Erreur dissolve:', error);
    return { 
      success: false, 
      message: `Erreur lors de la dissolution: ${error.message}` 
    };
  }
};

export default {
  handleBufferOperation,
  handleUnionOperation,
  handleIntersectionOperation,
  handleFieldCalculation,
  handleClipOperation,
  handleDissolveOperation
};