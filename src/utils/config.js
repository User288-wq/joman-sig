// Configuration des cartes pour Joman SIG
export const mapConfig = {
  // OpenLayers (2D)
  ol: {
    defaultCenter: [0, 0],
    defaultZoom: 2,
    maxZoom: 18,
    minZoom: 1,
    projections: {
      epsg4326: "EPSG:4326",
      epsg3857: "EPSG:3857"
    }
  },

  // Cesium (3D)
  cesium: {
    defaultCenter: [0, 0, 10000000],
    terrain: true,
    atmosphere: true,
    skyBox: false
  },

  // Leaflet
  leaflet: {
    defaultCenter: [0, 0],
    defaultZoom: 2,
    maxZoom: 19,
    tileLayers: {
      osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      topo: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    }
  },

  // Couches de base
  baseLayers: [
    {
      id: "osm",
      name: "OpenStreetMap",
      type: "tile",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "© OpenStreetMap contributors",
      visible: true
    },
    {
      id: "satellite",
      name: "Satellite",
      type: "tile",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "© Esri",
      visible: false
    },
    {
      id: "topo",
      name: "Topographique",
      type: "tile",
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: "© OpenTopoMap",
      visible: false
    }
  ]
};

export default mapConfig;
