/**
 * Constantes pour les actions du menu
 */

export const ACTIONS = {
  FILE: {
    NEW: 'file:new',
    OPEN: 'file:open',
    SAVE: 'file:save',
    SAVE_AS: 'file:save-as',
    IMPORT_GEOJSON: 'file:import-geojson',
    IMPORT_SHAPEFILE: 'file:import-shapefile',
    EXPORT_GEOJSON: 'file:export-geojson',
    EXPORT_CSV: 'file:export-csv',
    PRINT: 'file:print',
    QUIT: 'file:quit'
  },
  EDIT: {
    UNDO: 'edit:undo',
    REDO: 'edit:redo',
    CUT: 'edit:cut',
    COPY: 'edit:copy',
    PASTE: 'edit:paste',
    DELETE: 'edit:delete',
    SELECT_ALL: 'edit:select-all',
    DESELECT_ALL: 'edit:deselect-all',
    FIND: 'edit:find'
  },
  VIEW: {
    ZOOM_IN: 'view:zoom-in',
    ZOOM_OUT: 'view:zoom-out',
    ZOOM_TO_EXTENT: 'view:zoom-to-extent',
    MODE_2D: 'view:mode-2d',
    MODE_3D: 'view:mode-3d',
    SHOW_GRID: 'view:show-grid',
    SHOW_SCALE: 'view:show-scale',
    BASEMAP_OSM: 'view:basemap-osm',
    BASEMAP_SATELLITE: 'view:basemap-satellite',
    BASEMAP_TOPO: 'view:basemap-topo'
  },
  LAYERS: {
    ADD_VECTOR: 'layers:add-vector',
    ADD_RASTER: 'layers:add-raster',
    ADD_WMS: 'layers:add-wms',
    REMOVE_LAYER: 'layers:remove-layer',
    TOGGLE_VISIBILITY: 'layers:toggle-visibility',
    STYLE: 'layers:style',
    PROPERTIES: 'layers:properties',
    EXPORT_LAYER: 'layers:export-layer'
  },
  TOOLS: {
    PAN: 'tools:pan',
    ZOOM: 'tools:zoom',
    SELECT: 'tools:select',
    MEASURE_DISTANCE: 'tools:measure-distance',
    MEASURE_AREA: 'tools:measure-area',
    DRAW_POINT: 'tools:draw-point',
    DRAW_LINE: 'tools:draw-line',
    DRAW_POLYGON: 'tools:draw-polygon',
    EDIT: 'tools:edit',
    BUFFER: 'tools:buffer',
    CLIP: 'tools:clip'
  },
  ANALYSIS: {
    BUFFER: 'analysis:buffer',
    INTERSECT: 'analysis:intersect',
    UNION: 'analysis:union',
    CLIP: 'analysis:clip',
    MERGE: 'analysis:merge',
    STATISTICS: 'analysis:statistics',
    NETWORK: 'analysis:network',
    INTERPOLATION: 'analysis:interpolation'
  },
  SETTINGS: {
    PROJECT: 'settings:project',
    MAP: 'settings:map',
    TOOLS: 'settings:tools',
    SHORTCUTS: 'settings:shortcuts',
    ABOUT: 'settings:about'
  }
};

export const SHORTCUTS = {
  [ACTIONS.FILE.NEW]: 'Ctrl+N',
  [ACTIONS.FILE.OPEN]: 'Ctrl+O',
  [ACTIONS.FILE.SAVE]: 'Ctrl+S',
  [ACTIONS.FILE.SAVE_AS]: 'Ctrl+Shift+S',
  [ACTIONS.EDIT.UNDO]: 'Ctrl+Z',
  [ACTIONS.EDIT.REDO]: 'Ctrl+Y',
  [ACTIONS.EDIT.COPY]: 'Ctrl+C',
  [ACTIONS.EDIT.PASTE]: 'Ctrl+V',
  [ACTIONS.EDIT.CUT]: 'Ctrl+X',
  [ACTIONS.VIEW.ZOOM_IN]: 'Ctrl++',
  [ACTIONS.VIEW.ZOOM_OUT]: 'Ctrl+-',
  [ACTIONS.VIEW.ZOOM_TO_EXTENT]: 'Ctrl+E'
};
