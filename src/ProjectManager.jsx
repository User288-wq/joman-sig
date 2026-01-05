// ProjectManager.jsx
import React, { useState } from 'react';

const ProjectManager = ({ mapLayers, map, onProjectAction }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);

  // Sauvegarder le projet
  const saveProject = (name = 'Nouveau projet') => {
    const projectData = {
      id: Date.now(),
      name: name,
      timestamp: new Date().toISOString(),
      layers: mapLayers.map(layer => ({
        name: layer.name,
        type: layer.type,
        visible: layer.visible,
        style: layer.layer ? layer.layer.getStyle() : null,
        source: layer.layer ? layer.layer.getSource().getParams() : null
      })),
      view: map ? {
        center: map.getView().getCenter(),
        zoom: map.getView().getZoom(),
        projection: map.getView().getProjection().getCode()
      } : null,
      metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        layerCount: mapLayers.length,
        format: 'jomasig-project'
      }
    };

    setProjects(prev => [...prev, projectData]);
    setCurrentProject(projectData);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('jomasig-projects', JSON.stringify([
      ...projects.filter(p => p.id !== projectData.id),
      projectData
    ]));

    return projectData;
  };

  // Charger un projet
  const loadProject = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    // Réinitialiser la carte
    onProjectAction('clear');
    
    // Recréer les couches
    project.layers.forEach(layer => {
      // Logique de recréation des couches
      console.log('Chargement couche:', layer.name);
    });

    // Restaurer la vue
    if (project.view && map) {
      map.getView().setCenter(project.view.center);
      map.getView().setZoom(project.view.zoom);
    }

    setCurrentProject(project);
  };

  // Exporter le projet
  const exportProject = (format = 'json') => {
    if (!currentProject) return;

    let data, mimeType, extension;
    
    switch (format) {
      case 'json':
        data = JSON.stringify(currentProject, null, 2);
        mimeType = 'application/json';
        extension = 'json';
        break;
      case 'qgis':
        // Format compatible QGIS (simplifié)
        data = convertToQGISProject(currentProject);
        mimeType = 'application/xml';
        extension = 'qgs';
        break;
      default:
        return;
    }

    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.name}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Interface du gestionnaire
  return (
    <div className="project-manager">
      <div className="project-header">
        <h3>🗂️ Gestionnaire de projets</h3>
        <div className="project-actions">
          <button 
            className="btn-primary"
            onClick={() => {
              const name = prompt('Nom du projet:', `Projet ${new Date().toLocaleDateString()}`);
              if (name) saveProject(name);
            }}
          >
            💾 Nouveau projet
          </button>
          
          <button 
            className="btn-secondary"
            onClick={() => document.getElementById('project-import').click()}
          >
            📥 Importer projet
          </button>
          
          <input 
            id="project-import"
            type="file"
            accept=".json,.qgs,.jomasig"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const project = JSON.parse(event.target.result);
                    setProjects(prev => [...prev, project]);
                    loadProject(project.id);
                  } catch (error) {
                    alert('❌ Erreur de lecture du projet');
                  }
                };
                reader.readAsText(file);
              }
            }}
          />
        </div>
      </div>

      {/* Projet courant */}
      {currentProject && (
        <div className="current-project">
          <h4>🔄 Projet courant</h4>
          <div className="project-card active">
            <div className="project-info">
              <div className="project-name">{currentProject.name}</div>
              <div className="project-meta">
                <span>🗺️ {currentProject.layers.length} couches</span>
                <span>🕐 {new Date(currentProject.timestamp).toLocaleString()}</span>
              </div>
            </div>
            <div className="project-actions">
              <button 
                onClick={() => exportProject('json')}
                title="Exporter en JSON"
              >
                📥 JSON
              </button>
              <button 
                onClick={() => exportProject('qgis')}
                title="Exporter pour QGIS"
              >
                🗺️ QGIS
              </button>
              <button 
                onClick={() => {
                  if (confirm('Sauvegarder les modifications?')) {
                    saveProject(currentProject.name);
                  }
                }}
                title="Sauvegarder"
              >
                💾
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des projets */}
      <div className="projects-list">
        <h4>📚 Projets récents</h4>
        <div className="projects-grid">
          {projects.slice(-6).reverse().map(project => (
            <div 
              key={project.id}
              className={`project-card ${currentProject?.id === project.id ? 'active' : ''}`}
              onClick={() => loadProject(project.id)}
            >
              <div className="project-icon">🗺️</div>
              <div className="project-details">
                <div className="project-title">{project.name}</div>
                <div className="project-stats">
                  <span>{project.layers.length} couches</span>
                  <span>{new Date(project.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
              <button 
                className="project-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Supprimer ce projet?')) {
                    setProjects(prev => prev.filter(p => p.id !== project.id));
                  }
                }}
                title="Supprimer"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modèles de projet */}
      <div className="project-templates">
        <h4>🎯 Modèles</h4>
        <div className="templates-grid">
          {[
            { name: 'Carte thématique', icon: '🎨', desc: 'Styles avancés' },
            { name: 'Analyse spatiale', icon: '📊', desc: 'Outils SIG' },
            { name: 'Web mapping', icon: '🌐', desc: 'Publication web' },
            { name: 'Terrain 3D', icon: '🏔️', desc: 'Modèles d\'élévation' }
          ].map(template => (
            <div key={template.name} className="template-card">
              <div className="template-icon">{template.icon}</div>
              <div className="template-name">{template.name}</div>
              <div className="template-desc">{template.desc}</div>
              <button 
                className="btn-small"
                onClick={() => alert(`Création du modèle: ${template.name}`)}
              >
                Utiliser
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};