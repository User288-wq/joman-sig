# ============================================
# JOMAN-SIG - GUIDE DE DÉMARRAGE RAPIDE
# ============================================

##  LANCER L'APPLICATION
npm start

##  COMMANDES DISPONIBLES
- npm start      : Lance le serveur de développement
- npm build      : Construit pour la production
- npm test       : Lance les tests
- npm run lint   : Vérifie le code
- npm run format : Formate le code

## 🔧 CORRECTIONS APPLIQUÉES

### 1. package.json
- ✅ Turf.js ajouté (@turf/turf)
-  Dépendances MUI mises à jour
-  Scripts lint/format ajoutés

### 2. processingActions.js créé
- ✅ Fonctions buffer/union/intersection
- ✅ Conversion de coordonnées 38574326
-  Calculs de surface/longueur

### 3. App.jsx corrigé
-  Import correct des actions
-  Gestion des erreurs améliorée
-  Simulation de résultats

##  STRUCTURE
src/
 utils/
    processingActions.js  # Moteur géospatial
 components/
    menus/               # Menus MUI
    map/                 # Cartes OpenLayers
│   └── tools/               # Outils SIG
 App.jsx                  # Application principale

##  PROCHAINES ÉTAPES

1. Connecter les vraies couches OpenLayers dans handleBufferOperation
2. Implémenter la reprojection avec proj4 ou ol/proj
3. Ajouter l'interface Processing Toolbox
4. Implémenter undo/redo des traitements

##  DÉPANNAGE

### Erreur "Module not found"
npm install --save @turf/turf

### Menu ne s'ouvre pas
Vérifier que anchorEl est bien passé dans JomaMenuBar

### Carte ne se charge pas
Vérifier la console navigateur (F12) pour les erreurs CORS

### Turf.js ne fonctionne pas
Vérifier que les coordonnées sont en WGS84 (EPSG:4326)

##  SUPPORT
Consultez les commentaires dans le code ou exécutez à nouveau ce script.
