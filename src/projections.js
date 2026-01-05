// projections.js
import Projection from 'ol/proj/Projection';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';
import { get as getProjection } from 'ol/proj';

// Définitions Proj4 pour les projections non-natives
proj4.defs([
  // 1. WGS84 (EPSG:4326) - Standard mondial
  ['EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs'],
  
  // 2. Web Mercator (EPSG:3857) - Standard web
  ['EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs'],
  
  // 3. Lambert 93 France (EPSG:2154)
  ['EPSG:2154', '+proj=lcc +lat_0=46.5 +lon_0=3 +lat_1=49 +lat_2=44 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'],
  
  // 4. UTM zones France (ex: UTM 31N - EPSG:32631)
  ['EPSG:32631', '+proj=utm +zone=31 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'],
  ['EPSG:32632', '+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'],
  
  // 5. RGF93 CC50 (EPSG:3949) - Corse
  ['EPSG:3949', '+proj=lcc +lat_0=46.5 +lon_0=3 +lat_1=44 +lat_2=49 +x_0=1700000 +y_0=6200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'],
  
  // 6. NTFF (EPSG:27571 à 27575) - Ancien système français
  ['EPSG:27571', '+proj=lcc +lat_1=49.5 +lat_0=49.5 +lon_0=0 +k_0=0.999877341 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs'],
  ['EPSG:27572', '+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs'],
  ['EPSG:27573', '+proj=lcc +lat_1=44.1 +lat_0=44.1 +lon_0=0 +k_0=0.999877499 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs'],
  ['EPSG:27574', '+proj=lcc +lat_1=42.165 +lat_0=42.165 +lon_0=0 +k_0=0.99994471 +x_0=234.358 +y_0=4185861.369 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs'],
  
  // 7. WGS84 Pseudo-Mercator (EPSG:3395)
  ['EPSG:3395', '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'],
  
  // 8. ETRS89-LAEA (EPSG:3035) - Europe
  ['EPSG:3035', '+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'],
  
  // 9. NAD83 (EPSG:4269) - Amérique du Nord
  ['EPSG:4269', '+proj=longlat +ellps=GRS80 +datum=NAD83 +no_defs'],
  
  // 10. OSGB36 (EPSG:27700) - Royaume-Uni
  ['EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs'],
  
  // 11. ED50 (EPSG:23032) - Europe ancienne
  ['EPSG:23032', '+proj=utm +zone=32 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs'],
  
  // 12. CH1903+ (EPSG:2056) - Suisse
  ['EPSG:2056', '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs'],
  
  // 13. SIRGAS 2000 (EPSG:4674) - Amérique latine
  ['EPSG:4674', '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs'],
  
  // 14. Tokyo (EPSG:4301) - Japon
  ['EPSG:4301', '+proj=longlat +ellps=bessel +towgs84=-148,507,685,0,0,0,0 +no_defs'],
  
  // 15. Pulkovo 1942 (EPSG:4284) - Russie
  ['EPSG:4284', '+proj=longlat +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +no_defs']
]);

// Enregistrer les projections dans OpenLayers
register(proj4);

// Catalogue des projections avec métadonnées
export const PROJECTIONS_CATALOG = {
  'EPSG:4326': {
    code: 'EPSG:4326',
    name: 'WGS 84',
    units: 'degrees',
    area: 'Monde',
    extent: [-180, -90, 180, 90],
    accuracy: 'Haute',
    type: 'géographique'
  },
  'EPSG:3857': {
    code: 'EPSG:3857',
    name: 'Web Mercator',
    units: 'meters',
    area: 'Monde',
    extent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
    accuracy: 'Moyenne',
    type: 'projectée'
  },
  'EPSG:2154': {
    code: 'EPSG:2154',
    name: 'RGF93 / Lambert-93',
    units: 'meters',
    area: 'France métropolitaine',
    extent: [-378305.81, 6093283.21, 1212610.74, 7186901.68],
    accuracy: 'Haute',
    type: 'projectée'
  },
  'EPSG:3949': {
    code: 'EPSG:3949',
    name: 'RGF93 / CC50',
    units: 'meters',
    area: 'Corse',
    extent: [185209.42, 5059246.04, 955372.74, 5481028.95],
    accuracy: 'Haute',
    type: 'projectée'
  },
  'EPSG:32631': {
    code: 'EPSG:32631',
    name: 'WGS 84 / UTM zone 31N',
    units: 'meters',
    area: 'Europe de l\'Ouest',
    extent: [166021.44, 0.00, 833978.55, 9329005.18],
    accuracy: 'Haute',
    type: 'projectée'
  },
  'EPSG:27571': {
    code: 'EPSG:27571',
    name: 'NTF (Paris) / Lambert Nord France',
    units: 'meters',
    area: 'Nord France',
    extent: [600000, 200000, 1200000, 2600000],
    accuracy: 'Moyenne',
    type: 'projectée'
  },
  'EPSG:3035': {
    code: 'EPSG:3035',
    name: 'ETRS89 / LAEA Europe',
    units: 'meters',
    area: 'Europe',
    extent: [2550000.0, 1350000.0, 7450000.0, 5450000.0],
    accuracy: 'Haute',
    type: 'projectée'
  },
  'EPSG:4269': {
    code: 'EPSG:4269',
    name: 'NAD83',
    units: 'degrees',
    area: 'Amérique du Nord',
    extent: [-180.0, -90.0, 180.0, 90.0],
    accuracy: 'Haute',
    type: 'géographique'
  },
  'EPSG:27700': {
    code: 'EPSG:27700',
    name: 'OSGB36 / British National Grid',
    units: 'meters',
    area: 'Royaume-Uni',
    extent: [1393.0196, 13494.9764, 671196.3657, 1230275.0454],
    accuracy: 'Haute',
    type: 'projectée'
  }
};

// Fonction de transformation de coordonnées
export const transformCoordinate = (coordinate, fromProj, toProj) => {
  try {
    if (fromProj === toProj) return coordinate;
    
    if (fromProj === 'EPSG:4326' && toProj === 'EPSG:3857') {
      return fromLonLat(coordinate);
    } else if (fromProj === 'EPSG:3857' && toProj === 'EPSG:4326') {
      return toLonLat(coordinate);
    } else {
      return proj4(fromProj, toProj, coordinate);
    }
  } catch (error) {
    console.error(`❌ Erreur transformation ${fromProj}→${toProj}:`, error);
    return coordinate;
  }
};

// Fonction de transformation d'étendue
export const transformExtent = (extent, fromProj, toProj) => {
  try {
    const [minX, minY, maxX, maxY] = extent;
    const bottomLeft = transformCoordinate([minX, minY], fromProj, toProj);
    const topRight = transformCoordinate([maxX, maxY], fromProj, toProj);
    
    return [...bottomLeft, ...topRight];
  } catch (error) {
    console.error(`❌ Erreur transformation étendue:`, error);
    return extent;
  }
};

// Détecter la projection depuis un fichier PRJ
export const detectProjectionFromPRJ = async (prjFile) => {
  try {
    const text = await prjFile.text();
    
    // Détection par mots-clés
    if (text.includes('WGS_1984') && text.includes('GEOGCS')) {
      return 'EPSG:4326';
    } else if (text.includes('RGF_1993') && text.includes('Lambert_Conformal_Conic')) {
      return 'EPSG:2154';
    } else if (text.includes('NTF_Paris') && text.includes('Lambert_Conformal_Conic')) {
      if (text.includes('49.500000000')) return 'EPSG:27571';
      if (text.includes('46.800000000')) return 'EPSG:27572';
      if (text.includes('44.100000000')) return 'EPSG:27573';
    } else if (text.includes('NAD_1983')) {
      return 'EPSG:4269';
    } else if (text.includes('OSGB_1936')) {
      return 'EPSG:27700';
    }
    
    return 'EPSG:4326'; // Par défaut
  } catch (error) {
    console.error('❌ Erreur lecture PRJ:', error);
    return 'EPSG:4326';
  }
};

// Obtenir la liste des projections par région
export const getProjectionsByRegion = (region) => {
  const projections = Object.values(PROJECTIONS_CATALOG);
  
  if (region === 'all') return projections;
  
  return projections.filter(proj => 
    proj.area.toLowerCase().includes(region.toLowerCase())
  );
};

// Valider si une projection est supportée
export const isProjectionSupported = (code) => {
  return code in PROJECTIONS_CATALOG || proj4.defs[code];
};