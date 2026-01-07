// AnalyticsDashboard.jsx - Panneau de statistiques et graphiques
const AnalyticsDashboard = ({ layers }) => {
  const [metrics, setMetrics] = useState({
    totalFeatures: 0,
    byGeometry: { Point: 0, LineString: 0, Polygon: 0 },
    areaCoverage: 0,
    attributeStats: {},
    temporalTrends: []
  });

  // Générer des graphiques D3.js ou Chart.js
  return (
    <div className="analytics-dashboard">
      <h3>📈 Tableau de bord analytique</h3>
      
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-value">{metrics.totalFeatures}</div>
          <div className="kpi-label">Entités totales</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">
            {Object.values(metrics.byGeometry).reduce((a, b) => a + b, 0)}
          </div>
          <div className="kpi-label">Types géométriques</div>
          <div className="kpi-details">
            {Object.entries(metrics.byGeometry).map(([type, count]) => (
              <span key={type}>{type}: {count}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="charts-container">
        <div className="chart">
          <h4>Répartition par type</h4>
          <PieChart data={metrics.byGeometry} />
        </div>
        <div className="chart">
          <h4>Évolution temporelle</h4>
          <LineChart data={metrics.temporalTrends} />
        </div>
      </div>

      {/* Rapports automatiques */}
      <div className="reports-section">
        <button className="btn-primary">
          📄 Générer rapport PDF
        </button>
        <button className="btn-secondary">
          📊 Exporter vers Excel
        </button>
      </div>
    </div>
  );
};