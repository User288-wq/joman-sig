// TopologyNavigator.jsx - Relations spatiales et topologie
const TopologyNavigator = ({ features, map }) => {
  const [topologyGraph, setTopologyGraph] = useState(null);
  const [selectedRelation, setSelectedRelation] = useState(null);

  // Construire le graphe de relations spatiales
  const buildTopology = () => {
    const graph = {
      nodes: features.map(f => ({
        id: f.getId(),
        geometry: f.getGeometry().getType(),
        properties: f.getProperties()
      })),
      edges: []
    };

    // Détecter les relations spatiales
    features.forEach((f1, i) => {
      features.slice(i + 1).forEach(f2 => {
        const geom1 = f1.getGeometry();
        const geom2 = f2.getGeometry();
        
        const relations = {
          intersects: geom1.intersects(geom2),
          touches: geom1.touches(geom2),
          overlaps: geom1.overlaps(geom2),
          contains: geom1.contains(geom2),
          within: geom1.within(geom2)
        };

        if (Object.values(relations).some(r => r)) {
          graph.edges.push({
            from: f1.getId(),
            to: f2.getId(),
            relations: Object.entries(relations)
              .filter(([_, value]) => value)
              .map(([key]) => key)
          });
        }
      });
    });

    setTopologyGraph(graph);
  };

  // Visualiser une relation spécifique
  const visualizeRelation = (relation) => {
    // Mettre en évidence les entités concernées
    // Afficher les détails de la relation
  };

  return (
    <div className="topology-navigator">
      <h3>🧭 Navigateur topologique</h3>
      
      <button onClick={buildTopology} className="btn-primary">
        🔍 Analyser la topologie
      </button>
      
      {topologyGraph && (
        <div className="topology-results">
          <div className="stats">
            <div>Entités: {topologyGraph.nodes.length}</div>
            <div>Relations: {topologyGraph.edges.length}</div>
          </div>
          
          <div className="relations-list">
            <h4>Relations détectées</h4>
            {topologyGraph.edges.map((edge, idx) => (
              <div 
                key={idx}
                className="relation-item"
                onClick={() => visualizeRelation(edge)}
              >
                <div className="relation-types">
                  {edge.relations.map(rel => (
                    <span key={rel} className="relation-badge">{rel}</span>
                  ))}
                </div>
                <div className="relation-entities">
                  #{edge.from} ↔ #{edge.to}
                </div>
              </div>
            ))}
          </div>
          
          <div className="topology-graph">
            <h4>Graphe des relations</h4>
            {/* Intégration avec vis.js ou D3.js */}
            <div id="topology-graph-container"></div>
          </div>
        </div>
      )}
      
      <div className="topology-tools">
        <button className="btn-secondary">
          🔗 Vérifier la connectivité
        </button>
        <button className="btn-secondary">
          🕳️ Détecter les trous
        </button>
        <button className="btn-secondary">
          📐 Valider la géométrie
        </button>
      </div>
    </div>
  );
};