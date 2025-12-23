// Dans src/components/tools/MainToolbar.jsx - REMPLACEZ TOUT le fichier par :

import React from 'react';
import { 
  ToggleButton, 
  ToggleButtonGroup,
  Tooltip,
  ButtonGroup,
  Button
} from '@mui/material';
import { 
  Map as MapIcon, 
  Public as GlobeIcon,
  CropSquare as CanvasIcon,
  Straighten as MeasureIcon,
  FileUpload as ImportIcon,
  TableChart as TableIcon
} from '@mui/icons-material';
import './MainToolbar.css';

const MainToolbar = ({ map, onWidgetSelect, mapViewMode, setMapViewMode }) => {
  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setMapViewMode(newViewMode);
    }
  };

  const handleWidgetClick = (widget) => {
    onWidgetSelect(widget === 'none' ? null : widget);
  };

  return (
    <div className="main-toolbar">
      {/* SÃƒÆ’Ã‚Â©lecteur de mode de vue (2D/3D/Canvas) */}
      <div className="view-mode-selector">
        <ToggleButtonGroup
          value={mapViewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="mode de vue"
          size="small"
        >
          <Tooltip title="Vue 2D (OpenLayers)">
            <ToggleButton value="2D" aria-label="2D">
              <MapIcon fontSize="small" style={{ marginRight: 4 }} />
              <span>2D</span>
            </ToggleButton>
          </Tooltip>
          
          <Tooltip title="Vue 3D (Cesium)">
            <ToggleButton value="3D" aria-label="3D">
              <GlobeIcon fontSize="small" style={{ marginRight: 4 }} />
              <span>3D</span>
            </ToggleButton>
          </Tooltip>
          
          <Tooltip title="Vue Canvas (Dessin)">
            <ToggleButton value="canvas" aria-label="canvas">
              <CanvasIcon fontSize="small" style={{ marginRight: 4 }} />
              <span>Canvas</span>
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </div>

      {/* Outils/widgets */}
      <div className="widget-tools">
        <ButtonGroup size="small" variant="outlined">
          <Tooltip title="Outils de mesure">
            <Button 
              onClick={() => handleWidgetClick('measure')}
              startIcon={<MeasureIcon />}
            >
              Mesure
            </Button>
          </Tooltip>
          
          <Tooltip title="Importer des donnÃƒÆ’Ã‚Â©es GeoJSON">
            <Button 
              onClick={() => handleWidgetClick('import')}
              startIcon={<ImportIcon />}
            >
              Importer
            </Button>
          </Tooltip>
          
          <Tooltip title="Table des attributs">
            <Button 
              onClick={() => handleWidgetClick('table')}
              startIcon={<TableIcon />}
            >
              Table
            </Button>
          </Tooltip>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default MainToolbar;
