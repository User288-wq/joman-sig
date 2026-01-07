import React, { createContext, useState, useContext, useCallback } from "react";

// ============================================
// CONTEXTE GÉOSPATIAL - VERSION CORRIGÉE
// Sans imports manquants
// ============================================

const GeospatialContext = createContext();

export const useGeospatial = () => {
  const context = useContext(GeospatialContext);
  if (!context) {
    throw new Error("useGeospatial doit être utilisé dans GeospatialProvider");
  }
  return context;
};

export const GeospatialProvider = ({ children }) => {
  // États pour les données géospatiales
  const [networkData, setNetworkData] = useState(null);
  const [rasterData, setRasterData] = useState(null);
  const [interpolationResults, setInterpolationResults] = useState(null);
  const [generalizationHistory, setGeneralizationHistory] = useState([]);

  // ============================================
  // FONCTIONS UTILITAIRES GÉNÉRIQUES
  // ============================================
  
  const calculateDistance = useCallback((point1, point2) => {
    const [x1, y1] = point1;
    const [x2, y2] = point2;
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }, []);

  const calculateBoundingBox = useCallback((features) => {
    if (!features || features.length === 0) {
      return [0, 0, 100, 100]; // Bbox par défaut
    }
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    features.forEach(feature => {
      const coords = feature.geometry?.coordinates;
      if (!coords) return;
      
      if (feature.geometry.type === "Point") {
        const [x, y] = coords;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      } else if (feature.geometry.type === "LineString" || feature.geometry.type === "Polygon") {
        const points = feature.geometry.type === "Polygon" ? coords[0] : coords;
        points.forEach(([x, y]) => {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        });
      }
    });
    
    return [minX, minY, maxX, maxY];
  }, []);

  // ============================================
  // ANALYSE DE RÉSEAU (Placeholder)
  // ============================================
  
  const networkAnalysis = {
    createNetwork: (lineStrings) => {
      console.log(" Création de réseau à partir de", lineStrings?.length || 0, "lignes");
      
      if (!lineStrings || lineStrings.length === 0) {
        console.warn(" Aucune LineString fournie pour créer un réseau");
        return { nodes: [], edges: [], bbox: [0, 0, 100, 100] };
      }
      
      const nodes = [];
      const edges = [];
      let nodeId = 0;
      let edgeId = 0;
      
      lineStrings.forEach((lineString, lineIndex) => {
        const coords = lineString.geometry?.coordinates;
        if (!coords || coords.length < 2) return;
        
        for (let i = 0; i < coords.length; i++) {
          const [x, y] = coords[i];
          const node = { id: nodeId++, x, y, connections: [] };
          nodes.push(node);
          
          if (i > 0) {
            const prevNode = nodes[nodes.length - 2];
            const distance = calculateDistance([prevNode.x, prevNode.y], [x, y]);
            
            const edge = {
              id: edgeId++,
              from: prevNode.id,
              to: node.id,
              distance: distance,
              lineIndex: lineIndex
            };
            
            edges.push(edge);
            prevNode.connections.push({ to: node.id, distance });
            node.connections.push({ to: prevNode.id, distance });
          }
        }
      });
      
      const result = { nodes, edges, bbox: calculateBoundingBox(lineStrings) };
      setNetworkData(result);
      return result;
    },
    
    shortestPath: (network, startNodeId, endNodeId) => {
      console.log(" Calcul du plus court chemin de", startNodeId, "à", endNodeId);
      
      if (!network || !network.nodes || !network.edges) {
        console.warn(" Réseau invalide pour shortestPath");
        return { path: [], distance: 0, nodes: [] };
      }
      
      // Implémentation Dijkstra simplifiée
      const distances = {};
      const previous = {};
      const unvisited = new Set();
      
      network.nodes.forEach(node => {
        distances[node.id] = Infinity;
        previous[node.id] = null;
        unvisited.add(node.id);
      });
      
      distances[startNodeId] = 0;
      
      while (unvisited.size > 0) {
        // Trouver le nœud avec la plus petite distance
        let current = null;
        let minDist = Infinity;
        
        for (const nodeId of unvisited) {
          if (distances[nodeId] < minDist) {
            minDist = distances[nodeId];
            current = nodeId;
          }
        }
        
        if (current === null || current === endNodeId) break;
        unvisited.delete(current);
        
        // Mettre à jour les distances des voisins
        const currentNode = network.nodes.find(n => n.id === current);
        if (!currentNode) continue;
        
        currentNode.connections.forEach(conn => {
          if (unvisited.has(conn.to)) {
            const alt = distances[current] + conn.distance;
            if (alt < distances[conn.to]) {
              distances[conn.to] = alt;
              previous[conn.to] = current;
            }
          }
        });
      }
      
      // Reconstruire le chemin
      const path = [];
      let current = endNodeId;
      const pathNodes = [];
      
      while (current !== null) {
        const node = network.nodes.find(n => n.id === current);
        if (node) {
          path.unshift([node.x, node.y]);
          pathNodes.unshift(node);
        }
        current = previous[current];
      }
      
      const result = {
        path,
        distance: distances[endNodeId],
        nodes: pathNodes,
        isValid: distances[endNodeId] < Infinity
      };
      
      console.log(" Chemin trouvé : distance =", result.distance.toFixed(2));
      return result;
    },
    
    calculateIsochrone: (network, startNodeId, maxDistance) => {
      console.log("  Calcul d'isochrone depuis", startNodeId, "distance max:", maxDistance);
      
      if (!network || !network.nodes) {
        return { accessibleNodes: [], polygons: [], maxDistance };
      }
      
      const accessibleNodes = [];
      const visited = new Set();
      const queue = [{ nodeId: startNodeId, distance: 0 }];
      
      while (queue.length > 0) {
        const { nodeId, distance } = queue.shift();
        
        if (visited.has(nodeId)) continue;
        visited.add(nodeId);
        
        const node = network.nodes.find(n => n.id === nodeId);
        if (node) {
          accessibleNodes.push({ ...node, distanceFromStart: distance });
          
          // Explorer les voisins
          node.connections.forEach(conn => {
            const newDist = distance + conn.distance;
            if (newDist <= maxDistance && !visited.has(conn.to)) {
              queue.push({ nodeId: conn.to, distance: newDist });
            }
          });
        }
      }
      
      return {
        accessibleNodes,
        polygons: [], // À compléter avec un buffer/convex hull
        maxDistance,
        nodeCount: accessibleNodes.length
      };
    },
    
    travelingSalesman: (network, points, start) => {
      console.warn(" TSP non implémenté - utilisation de shortestPath comme fallback");
      if (points.length === 0) return { path: [], distance: 0 };
      
      // Solution naïve : visiter dans l'ordre donné
      let totalPath = [];
      let totalDistance = 0;
      let current = start;
      
      for (const point of points) {
        const result = networkAnalysis.shortestPath(network, current, point);
        if (result.isValid) {
          totalPath = [...totalPath, ...result.path];
          totalDistance += result.distance;
          current = point;
        }
      }
      
      return {
        path: totalPath,
        distance: totalDistance,
        pointOrder: points
      };
    }
  };

  // ============================================
  // INTERPOLATION SPATIALE (Placeholder)
  // ============================================
  
  const spatialInterpolation = {
    idw: (points, grid, power = 2) => {
      console.log(" Interpolation IDW avec", points?.length || 0, "points, puissance:", power);
      
      if (!points || points.length === 0) {
        console.warn("⚠️ Aucun point fourni pour l'interpolation");
        return { grid: [], min: 0, max: 1, method: "idw" };
      }
      
      // Implémentation IDW simplifiée
      const gridValues = [];
      let minVal = Infinity;
      let maxVal = -Infinity;
      
      // Créer une grille simple si non fournie
      if (!grid || grid.length === 0) {
        const bbox = calculateBoundingBox(points);
        const [minX, minY, maxX, maxY] = bbox;
        const cellSize = Math.max((maxX - minX) / 20, (maxY - minY) / 20);
        
        for (let x = minX; x <= maxX; x += cellSize) {
          for (let y = minY; y <= maxY; y += cellSize) {
            grid.push([x, y]);
          }
        }
      }
      
      // Calculer les valeurs pour chaque point de la grille
      grid.forEach(([x, y]) => {
        let numerator = 0;
        let denominator = 0;
        
        points.forEach(point => {
          const [px, py, value = 0] = point.geometry?.coordinates || [0, 0, 0];
          const distance = calculateDistance([x, y], [px, py]);
          
          if (distance > 0) {
            const weight = 1 / Math.pow(distance, power);
            numerator += value * weight;
            denominator += weight;
          } else {
            // Exactement sur un point connu
            numerator = value;
            denominator = 1;
          }
        });
        
        const interpolatedValue = denominator > 0 ? numerator / denominator : 0;
        gridValues.push(interpolatedValue);
        
        minVal = Math.min(minVal, interpolatedValue);
        maxVal = Math.max(maxVal, interpolatedValue);
      });
      
      const result = {
        grid: gridValues,
        coordinates: grid,
        min: minVal,
        max: maxVal,
        method: "idw",
        power: power
      };
      
      setInterpolationResults(result);
      return result;
    },
    
    kriging: (points, grid, model = "exponential") => {
      console.warn(" Kriging non implémenté - utilisation d'IDW comme fallback");
      return spatialInterpolation.idw(points, grid, 2);
    },
    
    createGrid: (bbox, cellSize) => {
      const [minX, minY, maxX, maxY] = bbox;
      const grid = [];
      
      for (let x = minX; x <= maxX; x += cellSize) {
        for (let y = minY; y <= maxY; y += cellSize) {
          grid.push([x, y]);
        }
      }
      
      console.log(" Grille créée :", grid.length, "cellules, résolution:", cellSize);
      return grid;
    },
    
    gridToGeoJSON: (gridResult) => {
      if (!gridResult || !gridResult.grid || !gridResult.coordinates) {
        console.warn(" Données de grille invalides pour conversion GeoJSON");
        return { type: "FeatureCollection", features: [] };
      }
      
      const features = gridResult.grid.map((value, index) => {
        const coords = gridResult.coordinates[index];
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: coords
          },
          properties: {
            value: value,
            normalized: gridResult.max > gridResult.min ? 
              (value - gridResult.min) / (gridResult.max - gridResult.min) : 0
          }
        };
      });
      
      return {
        type: "FeatureCollection",
        features: features,
        metadata: {
          method: gridResult.method,
          min: gridResult.min,
          max: gridResult.max,
          count: features.length
        }
      };
    }
  };

  // ============================================
  // TRAITEMENT RASTER (Placeholder)
  // ============================================
  
  const rasterProcessing = {
    calculateNDVI: (red, nir, options = {}) => {
      console.log(" Calcul NDVI", options);
      
      // Simulation de calcul NDVI
      const width = 100;
      const height = 100;
      const ndvi = [];
      
      for (let i = 0; i < width * height; i++) {
        // Valeur NDVI aléatoire entre -1 et 1 pour la démo
        const value = Math.random() * 2 - 1;
        ndvi.push(value);
      }
      
      return {
        ndvi: ndvi,
        min: -1,
        max: 1,
        width: width,
        height: height,
        validPixels: ndvi.filter(v => v > 0).length
      };
    },
    
    calculateSlope: (dem, cellSize) => {
      console.warn(" Calcul de pente non implémenté");
      return { slope: [], aspect: [], cellSize };
    },
    
    calculateHillshade: (dem, cellSize, azimuth = 315, altitude = 45) => {
      console.log("  Calcul hillshade - azimuth:", azimuth, "altitude:", altitude);
      return { hillshade: [], azimuth, altitude };
    },
    
    classify: (bands, trainingData) => {
      console.log(" Classification avec", trainingData?.length || 0, "zones d'entraînement");
      return { classes: [], confidence: [], method: "maximumLikelihood" };
    }
  };

  // ============================================
  // GÉNÉRALISATION CARTOGRAPHIQUE (Placeholder)
  // ============================================
  
  const cartographicGeneralization = {
    simplify: (geometry, tolerance, method = "douglas-peucker") => {
      console.log(" Simplification", method, "tolérance:", tolerance);
      
      // Pour l'instant, retourne la géométrie originale
      // À intégrer avec Turf.js plus tard
      return {
        original: geometry,
        simplified: geometry,
        tolerance: tolerance,
        method: method,
        vertexReduction: "0%"
      };
    },
    
    smooth: (geometry, iterations = 2, ratio = 0.25) => {
      console.log("〰  Lissage - itérations:", iterations, "ratio:", ratio);
      return {
        original: geometry,
        smoothed: geometry,
        iterations: iterations,
        ratio: ratio
      };
    },
    
    dissolve: (polygons, attribute, value) => {
      console.log(" Dissolve par attribut:", attribute, "valeur:", value);
      
      if (!polygons || polygons.length === 0) {
        return { dissolved: [], attribute, value };
      }
      
      // Simulation de dissolve - regroupe tous les polygones
      const dissolved = polygons.map(poly => ({ ...poly }));
      
      const historyEntry = {
        type: "dissolve",
        attribute: attribute,
        value: value,
        inputCount: polygons.length,
        outputCount: 1,
        timestamp: new Date().toISOString()
      };
      
      setGeneralizationHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
      
      return {
        dissolved: dissolved,
        attribute: attribute,
        value: value,
        history: historyEntry
      };
    }
  };

  // ============================================
  // VALEUR DU CONTEXTE
  // ============================================
  
  const value = {
    // États
    networkData,
    rasterData,
    interpolationResults,
    generalizationHistory,
    
    // Setters
    setNetworkData,
    setRasterData,
    setInterpolationResults,
    
    // Modules fonctionnels
    networkAnalysis,
    spatialInterpolation,
    rasterProcessing,
    cartographicGeneralization,
    
    // Utilitaires
    calculateDistance,
    calculateBoundingBox,
    
    // Version
    version: "1.0.0",
    lastUpdated: new Date().toISOString()
  };

  return (
    <GeospatialContext.Provider value={value}>
      {children}
    </GeospatialContext.Provider>
  );
};

export default GeospatialContext;
