// Gestionnaire de projet SIG
class ProjectManager {
  static STORAGE_KEY = 'joma_sig_projects';
  
  static async loadLastProject() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      
      // Projet par dÃƒÂ©faut
      return {
        id: 'default_' + Date.now(),
        name: 'Nouveau Projet SIG',
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        layers: [],
        mapState: {
          center: [0, 0],
          zoom: 2,
          rotation: 0
        },
        settings: {
          projection: 'EPSG:3857',
          units: 'metric'
        }
      };
    } catch (error) {
      console.error('Erreur chargement projet:', error);
      return this.createDefaultProject();
    }
  }
  
  static saveProject(project) {
    try {
      project.modified = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(project));
      return true;
    } catch (error) {
      console.error('Erreur sauvegarde projet:', error);
      return false;
    }
  }
  
  static exportProject(project, format = 'json') {
    // Logique d'export
  }
}