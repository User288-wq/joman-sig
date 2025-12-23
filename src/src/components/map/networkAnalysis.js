// src/scripts/geospatial/networkAnalysis.js

/**
 * Analyse de réseau simple basée sur Dijkstra
 */
export class NetworkAnalysis {
  /**
   * Crée un réseau à partir de LineStrings GeoJSON
   */
  static createNetworkFromLineStrings(lineStrings) {
    const nodes = new Map(); // id -> {id, coordinates, edges}
    const edges = [];
    
    lineStrings.forEach((lineString, index) => {
      const coords = lineString.geometry.coordinates;
      
      for (let i = 0; i < coords.length - 1; i++) {
        const from = coords[i];
        const to = coords[i + 1];
        
        const fromId = `${from[0]},${from[1]}`;
        const toId = `${to[0]},${to[1]}`;
        
        // Distance euclidienne
        const distance = Math.sqrt(
          Math.pow(to[0] - from[0], 2) + 
          Math.pow(to[1] - from[1], 2)
        );
        
        // Ajouter les nœuds
        if (!nodes.has(fromId)) {
          nodes.set(fromId, { id: fromId, coordinates: from, edges: [] });
        }
        if (!nodes.has(toId)) {
          nodes.set(toId, { id: toId, coordinates: to, edges: [] });
        }
        
        // Ajouter l'arête
        const edge = { 
          id: `edge_${index}_${i}`, 
          from: fromId, 
          to: toId, 
          distance,
          geometry: {
            type: 'LineString',
            coordinates: [from, to]
          }
        };
        
        edges.push(edge);
        nodes.get(fromId).edges.push(edge);
        nodes.get(toId).edges.push({ ...edge, from: toId, to: fromId }); // Bidirectionnel
      }
    });
    
    return {
      nodes: Array.from(nodes.values()),
      edges,
      findNode: (coords) => {
        const id = `${coords[0]},${coords[1]}`;
        return nodes.get(id);
      }
    };
  }
  
  /**
   * Algorithme de Dijkstra pour le plus court chemin
   */
  static dijkstra(network, startNodeId, endNodeId) {
    const distances = {};
    const previous = {};
    const unvisited = new Set();
    
    // Initialisation
    network.nodes.forEach(node => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
      unvisited.add(node.id);
    });
    distances[startNodeId] = 0;
    
    while (unvisited.size > 0) {
      // Trouver le nœud non visité avec la plus petite distance
      let current = null;
      let minDistance = Infinity;
      
      for (const nodeId of unvisited) {
        if (distances[nodeId] < minDistance) {
          minDistance = distances[nodeId];
          current = nodeId;
        }
      }
      
      if (current === null || current === endNodeId) break;
      
      unvisited.delete(current);
      
      // Mettre à jour les distances des voisins
      const currentNode = network.nodes.find(n => n.id === current);
      if (!currentNode) continue;
      
      currentNode.edges.forEach(edge => {
        if (unvisited.has(edge.to)) {
          const alt = distances[current] + edge.distance;
          if (alt < distances[edge.to]) {
            distances[edge.to] = alt;
            previous[edge.to] = current;
          }
        }
      });
    }
    
    // Reconstruire le chemin
    const path = [];
    let current = endNodeId;
    
    while (current !== null) {
      const node = network.nodes.find(n => n.id === current);
      path.unshift(node.coordinates);
      current = previous[current];
    }
    
    return {
      path,
      distance: distances[endNodeId],
      isValid: distances[endNodeId] < Infinity
    };
  }
  
  /**
   * Calcule une isochrone (points accessibles dans une distance donnée)
   */
  static calculateIsochrone(network, startNodeId, maxDistance) {
    const accessibleNodes = [];
    const distances = {};
    const queue = [{ nodeId: startNodeId, distance: 0 }];
    
    distances[startNodeId] = 0;
    
    while (queue.length > 0) {
      queue.sort((a, b) => a.distance - b.distance);
      const { nodeId, distance } = queue.shift();
      
      const node = network.nodes.find(n => n.id === nodeId);
      if (!node) continue;
      
      accessibleNodes.push({
        node,
        distance
      });
      
      // Explorer les voisins
      node.edges.forEach(edge => {
        const newDist = distance + edge.distance;
        if (newDist <= maxDistance && 
            (!distances[edge.to] || newDist < distances[edge.to])) {
          distances[edge.to] = newDist;
          queue.push({ nodeId: edge.to, distance: newDist });
        }
      });
    }
    
    return accessibleNodes;
  }
}