// src/scripts/geospatial/networkAnalysis.js
export class NetworkAnalysis {
  constructor(graph) {
    this.graph = graph || {};
    this.nodes = new Map();
    this.edges = new Map();
  }

  /**
   * Algorithme de Dijkstra pour le plus court chemin
   */
  dijkstra(startNodeId, endNodeId) {
    const distances = {};
    const previous = {};
    const unvisited = new Set();
    
    // Initialisation
    Object.keys(this.graph).forEach(nodeId => {
      distances[nodeId] = nodeId === startNodeId ? 0 : Infinity;
      previous[nodeId] = null;
      unvisited.add(nodeId);
    });
    
    while (unvisited.size > 0) {
      // Trouver le nœud non visité avec la distance minimale
      let currentNode = null;
      let minDistance = Infinity;
      
      unvisited.forEach(nodeId => {
        if (distances[nodeId] < minDistance) {
          minDistance = distances[nodeId];
          currentNode = nodeId;
        }
      });
      
      if (currentNode === endNodeId || minDistance === Infinity) {
        break;
      }
      
      unvisited.delete(currentNode);
      
      // Mettre à jour les distances des voisins
      const neighbors = this.graph[currentNode] || {};
      Object.entries(neighbors).forEach(([neighborId, weight]) => {
        const alt = distances[currentNode] + weight;
        if (alt < distances[neighborId]) {
          distances[neighborId] = alt;
          previous[neighborId] = currentNode;
        }
      });
    }
    
    // Reconstruire le chemin
    const path = [];
    let currentNode = endNodeId;
    
    while (currentNode !== null) {
      path.unshift(currentNode);
      currentNode = previous[currentNode];
    }
    
    return {
      path: path[0] === startNodeId ? path : [],
      distance: distances[endNodeId],
      distances: distances
    };
  }

  /**
   * Calcul d'isochrones (zone accessible dans un temps/distance donné)
   */
  calculateIsochrone(startNodeId, maxDistance, metric = 'distance') {
    const distances = {};
    const visited = new Set();
    const priorityQueue = [];
    
    distances[startNodeId] = 0;
    priorityQueue.push({ node: startNodeId, distance: 0 });
    
    while (priorityQueue.length > 0) {
      priorityQueue.sort((a, b) => a.distance - b.distance);
      const { node: currentNode, distance: currentDistance } = priorityQueue.shift();
      
      if (visited.has(currentNode)) continue;
      visited.add(currentNode);
      
      const neighbors = this.graph[currentNode] || {};
      Object.entries(neighbors).forEach(([neighborId, weight]) => {
        const newDistance = currentDistance + weight;
        
        if (newDistance <= maxDistance) {
          if (!distances[neighborId] || newDistance < distances[neighborId]) {
            distances[neighborId] = newDistance;
            priorityQueue.push({ node: neighborId, distance: newDistance });
          }
        }
      });
    }
    
    // Convertir les distances en géométrie (points accessibles)
    const accessibleNodes = Object.keys(distances).map(nodeId => ({
      nodeId,
      distance: distances[nodeId],
      coordinates: this.getNodeCoordinates(nodeId)
    }));
    
    return {
      startNode: startNodeId,
      maxDistance,
      accessibleNodes,
      count: accessibleNodes.length
    };
  }

  /**
   * Trouver le point le plus proche sur le réseau
   */
  findNearestNode(point, maxDistance = 1000) {
    let nearestNode = null;
    let minDistance = Infinity;
    
    Object.entries(this.nodes).forEach(([nodeId, nodeCoords]) => {
      const distance = this.calculateDistance(point, nodeCoords);
      
      if (distance < minDistance && distance <= maxDistance) {
        minDistance = distance;
        nearestNode = {
          id: nodeId,
          coordinates: nodeCoords,
          distance: distance
        };
      }
    });
    
    return nearestNode;
  }

  /**
   * Analyse de centralité (entre-degrés)
   */
  calculateBetweennessCentrality() {
    const centrality = {};
    const nodes = Object.keys(this.graph);
    
    // Initialiser la centralité à 0 pour tous les nœuds
    nodes.forEach(node => {
      centrality[node] = 0;
    });
    
    // Pour chaque paire de nœuds
    nodes.forEach(source => {
      nodes.forEach(target => {
        if (source !== target) {
          const result = this.dijkstra(source, target);
          if (result.path.length > 0) {
            // Compter les nœuds intermédiaires
            const intermediateNodes = result.path.slice(1, -1);
            intermediateNodes.forEach(node => {
              centrality[node] = (centrality[node] || 0) + 1;
            });
          }
        }
      });
    });
    
    // Normaliser
    const totalPairs = nodes.length * (nodes.length - 1);
    Object.keys(centrality).forEach(node => {
      centrality[node] = centrality[node] / totalPairs;
    });
    
    return centrality;
  }

  /**
   * Créer un réseau à partir de données linéaires
   */
  static createNetworkFromLineStrings(lineStrings, nodeRadius = 0.001) {
    const network = new NetworkAnalysis();
    const nodeMap = new Map();
    let nodeCounter = 1;
    
    lineStrings.forEach((lineString, lineIndex) => {
      const coordinates = lineString.coordinates || lineString;
      
      // Créer ou récupérer les nœuds pour chaque extrémité
      const startPoint = coordinates[0];
      const endPoint = coordinates[coordinates.length - 1];
      
      const startNodeId = this.findOrCreateNode(nodeMap, startPoint, nodeRadius, nodeCounter);
      const endNodeId = this.findOrCreateNode(nodeMap, endPoint, nodeRadius, nodeCounter);
      
      if (startNodeId !== endNodeId) {
        // Calculer la longueur de la ligne
        const length = this.calculateLineLength(coordinates);
        
        // Ajouter l'arête dans les deux directions (graphe non orienté)
        if (!network.graph[startNodeId]) network.graph[startNodeId] = {};
        if (!network.graph[endNodeId]) network.graph[endNodeId] = {};
        
        network.graph[startNodeId][endNodeId] = length;
        network.graph[endNodeId][startNodeId] = length;
      }
    });
    
    // Stocker les coordonnées des nœuds
    nodeMap.forEach((node, nodeId) => {
      network.nodes[nodeId] = node.coordinates;
    });
    
    return network;
  }

  /**
   * Générer des itinéraires optimaux pour plusieurs points
   */
  travelingSalesmanProblem(nodes, startNode = null, returnToStart = true) {
    if (nodes.length < 2) return { path: nodes, distance: 0 };
    
    const start = startNode || nodes[0];
    const unvisited = new Set(nodes.filter(node => node !== start));
    const path = [start];
    let totalDistance = 0;
    let current = start;
    
    while (unvisited.size > 0) {
      let nearest = null;
      let minDist = Infinity;
      
      unvisited.forEach(node => {
        const dist = this.calculateDistance(current, node);
        if (dist < minDist) {
          minDist = dist;
          nearest = node;
        }
      });
      
      if (nearest) {
        path.push(nearest);
        totalDistance += minDist;
        current = nearest;
        unvisited.delete(nearest);
      }
    }
    
    // Retour au point de départ si demandé
    if (returnToStart) {
      const returnDist = this.calculateDistance(current, start);
      totalDistance += returnDist;
      path.push(start);
    }
    
    return {
      path,
      distance: totalDistance,
      optimized: true
    };
  }

  // Méthodes utilitaires
  static findOrCreateNode(nodeMap, point, radius, counter) {
    // Chercher un nœud existant dans le rayon donné
    for (const [nodeId, node] of nodeMap.entries()) {
      const distance = Math.sqrt(
        Math.pow(point[0] - node.coordinates[0], 2) +
        Math.pow(point[1] - node.coordinates[1], 2)
      );
      
      if (distance <= radius) {
        return nodeId;
      }
    }
    
    // Créer un nouveau nœud
    const nodeId = `node_${counter}`;
    nodeMap.set(nodeId, {
      coordinates: point,
      connections: []
    });
    
    return nodeId;
  }

  static calculateLineLength(coordinates) {
    let length = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      const [x1, y1] = coordinates[i];
      const [x2, y2] = coordinates[i + 1];
      length += Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    return length;
  }

  calculateDistance(point1, point2) {
    const [x1, y1] = point1;
    const [x2, y2] = point2;
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  getNodeCoordinates(nodeId) {
    return this.nodes[nodeId] || null;
  }

  /**
   * Exporter le réseau au format GeoJSON
   */
  toGeoJSON() {
    const features = [];
    
    // Nœuds
    Object.entries(this.nodes).forEach(([nodeId, coordinates]) => {
      features.push({
        type: 'Feature',
        properties: {
          id: nodeId,
          type: 'node',
          connections: Object.keys(this.graph[nodeId] || {}).length
        },
        geometry: {
          type: 'Point',
          coordinates: coordinates
        }
      });
    });
    
    // Arêtes
    const edgeSet = new Set();
    
    Object.entries(this.graph).forEach(([fromNodeId, neighbors]) => {
      Object.entries(neighbors).forEach(([toNodeId, weight]) => {
        const edgeKey = [fromNodeId, toNodeId].sort().join('-');
        
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          
          const fromCoords = this.nodes[fromNodeId];
          const toCoords = this.nodes[toNodeId];
          
          if (fromCoords && toCoords) {
            features.push({
              type: 'Feature',
              properties: {
                id: edgeKey,
                type: 'edge',
                from: fromNodeId,
                to: toNodeId,
                weight: weight,
                length: weight
              },
              geometry: {
                type: 'LineString',
                coordinates: [fromCoords, toCoords]
              }
            });
          }
        }
      });
    });
    
    return {
      type: 'FeatureCollection',
      features: features
    };
  }
}