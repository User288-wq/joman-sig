// WorkflowAutomation.jsx - Automatisation des tâches SIG
const WorkflowAutomation = ({ layers }) => {
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: 'Nettoyage urbain',
      steps: [
        { type: 'import', params: { format: 'geojson', file: 'batiments.geojson' }},
        { type: 'filter', params: { field: 'hauteur', operator: '>', value: 10 }},
        { type: 'buffer', params: { distance: 50 }},
        { type: 'export', params: { format: 'kml', file: 'resultat.kml' }}
      ],
      schedule: 'daily',
      lastRun: '2024-01-15 10:30'
    }
  ]);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedSteps, setRecordedSteps] = useState([]);

  // Enregistrer un workflow
  const startRecording = () => {
    setIsRecording(true);
    setRecordedSteps([]);
  };

  const stopRecording = () => {
    setIsRecording(false);
    const name = prompt('Nom du workflow:');
    if (name) {
      const newWorkflow = {
        id: Date.now(),
        name: name,
        steps: recordedSteps,
        schedule: 'manual',
        lastRun: null
      };
      setWorkflows([...workflows, newWorkflow]);
    }
  };

  // Exécuter un workflow
  const executeWorkflow = async (workflow) => {
    for (const step of workflow.steps) {
      console.log(`Exécution: ${step.type}`);
      
      switch (step.type) {
        case 'import':
          await importData(step.params);
          break;
        case 'filter':
          filterData(step.params);
          break;
        case 'buffer':
          createBuffer(step.params);
          break;
        case 'union':
          unionLayers(step.params);
          break;
        case 'export':
          exportData(step.params);
          break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Pause
    }
    
    // Mettre à jour le statut
    updateWorkflowStatus(workflow.id, 'success');
  };

  return (
    <div className="workflow-automation">
      <div className="workflow-header">
        <h3>🔄 Automatisation des workflows</h3>
        <div className="header-actions">
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            className={isRecording ? 'btn-danger' : 'btn-primary'}
          >
            {isRecording ? '⏹️ Arrêter' : '🔴 Enregistrer'}
          </button>
          <button className="btn-secondary">
            📁 Importer workflow
          </button>
        </div>
      </div>

      {isRecording && (
        <div className="recording-indicator">
          <div className="recording-dot"></div>
          <span>Enregistrement en cours... Effectuez des actions SIG</span>
        </div>
      )}

      <div className="workflows-grid">
        {workflows.map(workflow => (
          <div key={workflow.id} className="workflow-card">
            <div className="workflow-header">
              <h4>{workflow.name}</h4>
              <div className="workflow-actions">
                <button 
                  onClick={() => executeWorkflow(workflow)}
                  title="Exécuter"
                >
                  ▶️
                </button>
                <button title="Éditer">✏️</button>
                <button title="Supprimer">🗑️</button>
              </div>
            </div>
            
            <div className="workflow-steps">
              {workflow.steps.map((step, idx) => (
                <div key={idx} className="workflow-step">
                  <div className="step-number">{idx + 1}</div>
                  <div className="step-content">
                    <div className="step-type">{step.type}</div>
                    <div className="step-params">
                      {Object.entries(step.params).map(([key, value]) => (
                        <span key={key}>{key}: {value}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="workflow-footer">
              <span>Planifié: {workflow.schedule}</span>
              {workflow.lastRun && (
                <span>Dernière exécution: {workflow.lastRun}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="workflow-templates">
        <h4>🎯 Templates prédéfinis</h4>
        <div className="templates-list">
          {[
            'Traitement de données cadastrales',
            'Analyse de réseau routier',
            'Génération de rapports environnementaux',
            'Automatisation de mises à jour',
            'Validation topologique'
          ].map(template => (
            <div key={template} className="template-item">
              <div className="template-name">{template}</div>
              <button className="btn-small">Utiliser</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};