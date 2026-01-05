// ====================
// SIMULATIONS SPATIALES AVANCÉES
// ====================

const SpatialSimulationModule = () => {
  const [simulationType, setSimulationType] = useState("population_growth");
  const [simulationParams, setSimulationParams] = useState({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState(null);
  const [simulationLayers, setSimulationLayers] = useState([]);

  // Types de simulation disponibles
  const simulationTypes = [
    {
      id: "population_growth",
      name: "Croissance démographique",
      description: "Simule la croissance de population sur 50 ans",
      params: [
        { name: "taux_croissance", label: "Taux annuel (%)", type: "number", default: 1.5, min: 0, max: 10 },
        { name: "annees", label: "Nombre d'années", type: "number", default: 50, min: 1, max: 100 }
      ]
    },
    {
      id: "urban_sprawl",
      name: "Étalement urbain",
      description: "Simule l'expansion urbaine",
      params: [
        { name: "taux_expansion", label: "Taux d'expansion (m/an)", type: "number", default: 100, min: 10, max: 1000 },
        { name: "zones_protegees", label: "Zones protégées", type: "checkbox", default: true }
      ]
    },
    {
      id: "flood_risk",
      name: "Risque d'inondation",
      description: "Simule l'impact de la montée des eaux",
      params: [
        { name: "niveau_eau", label: "Montée des eaux (m)", type: "number", default: 2, min: 0.5, max: 10 },
        { name: "scenario", label: "Scénario", type: "select", 
          options: ["optimiste", "moyen", "pessimiste"], default: "moyen" }
      ]
    }
  ];

  // Exécuter une simulation
  const runSimulation = async () => {
    setIsSimulating(true);
    
    try {
      // Simulation de croissance démographique
      if (simulationType === "population_growth") {
        const results = simulatePopulationGrowth(simulationParams);
        visualizeSimulationResults(results);
        setSimulationResults(results);
      }
      
      // Simulation d'étalement urbain
      else if (simulationType === "urban_sprawl") {
        const results = simulateUrbanSprawl(simulationParams);
        visualizeSimulationResults(results);
        setSimulationResults(results);
      }
      
      // Simulation de risque d'inondation
      else if (simulationType === "flood_risk") {
        const results = simulateFloodRisk(simulationParams);
        visualizeSimulationResults(results);
        setSimulationResults(results);
      }
      
    } catch (error) {
      console.error("Erreur simulation:", error);
    } finally {
      setIsSimulating(false);
    }
  };

  // Interface de simulation
  const renderSimulationPanel = () => (
    <div style={{
      position: "fixed",
      top: "80px",
      left: "350px",
      width: "400px",
      background: "rgba(15, 23, 42, 0.95)",
      border: "2px solid #8b5cf6",
      borderRadius: "12px",
      backdropFilter: "blur(10px)",
      zIndex: 1000
    }}>
      <div style={{
        padding: "15px",
        background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
        color: "white",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px"
      }}>
        <h3 style={{ margin: 0 }}>🧪 Simulation Spatiale</h3>
        <div style={{ fontSize: "12px", opacity: 0.9 }}>
          Modélisation et prédiction
        </div>
      </div>
      
      <div style={{ padding: "20px" }}>
        {/* Sélection du type */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", color: "#94a3b8" }}>
            Type de simulation:
          </label>
          <select
            value={simulationType}
            onChange={(e) => {
              setSimulationType(e.target.value);
              const type = simulationTypes.find(t => t.id === e.target.value);
              const defaultParams = {};
              type.params.forEach(param => {
                defaultParams[param.name] = param.default;
              });
              setSimulationParams(defaultParams);
            }}
            style={{
              width: "100%",
              padding: "10px",
              background: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "6px",
              color: "white"
            }}
          >
            {simulationTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Description */}
        <div style={{
          padding: "12px",
          background: "#1e293b",
          borderRadius: "8px",
          marginBottom: "20px",
          fontSize: "14px",
          color: "#cbd5e1"
        }}>
          {simulationTypes.find(t => t.id === simulationType)?.description}
        </div>
        
        {/* Paramètres */}
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ marginBottom: "15px", color: "#e2e8f0" }}>Paramètres</h4>
          {simulationTypes
            .find(t => t.id === simulationType)
            ?.params.map(param => (
              <div key={param.name} style={{ marginBottom: "12px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "5px", 
                  fontSize: "14px",
                  color: "#94a3b8"
                }}>
                  {param.label}:
                </label>
                
                {param.type === "number" ? (
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step || 1}
                      value={simulationParams[param.name] || param.default}
                      onChange={(e) => setSimulationParams(prev => ({
                        ...prev,
                        [param.name]: parseFloat(e.target.value)
                      }))}
                      style={{ flex: 1 }}
                    />
                    <span style={{ minWidth: "60px", textAlign: "center" }}>
                      {simulationParams[param.name] || param.default} {param.unit || ""}
                    </span>
                  </div>
                ) : param.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={simulationParams[param.name] || param.default}
                    onChange={(e) => setSimulationParams(prev => ({
                      ...prev,
                      [param.name]: e.target.checked
                    }))}
                    style={{ transform: "scale(1.2)" }}
                  />
                ) : param.type === "select" ? (
                  <select
                    value={simulationParams[param.name] || param.default}
                    onChange={(e) => setSimulationParams(prev => ({
                      ...prev,
                      [param.name]: e.target.value
                    }))}
                    style={{
                      width: "100%",
                      padding: "8px",
                      background: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "6px",
                      color: "white"
                    }}
                  >
                    {param.options.map(option => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : null}
              </div>
            ))}
        </div>
        
        {/* Bouton d'exécution */}
        <button
          onClick={runSimulation}
          disabled={isSimulating}
          style={{
            width: "100%",
            padding: "12px",
            background: isSimulating 
              ? "#475569" 
              : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: isSimulating ? "not-allowed" : "pointer"
          }}
        >
          {isSimulating ? "🔄 Simulation en cours..." : "▶ Démarrer la simulation"}
        </button>
        
        {/* Résultats */}
        {simulationResults && (
          <div style={{ 
            marginTop: "20px", 
            padding: "15px",
            background: "#1e293b",
            borderRadius: "8px"
          }}>
            <h4 style={{ color: "#e2e8f0" }}>📊 Résultats</h4>
            <div style={{ fontSize: "14px", color: "#94a3b8" }}>
              {simulationResults.summary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};