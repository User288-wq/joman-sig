// src/components/tools/ProfessionalToolbar.jsx
import React, { useState } from 'react';
import {
  Box, Button, ButtonGroup, Divider, Tooltip,
  ToggleButton, ToggleButtonGroup, IconButton,
  Typography, Paper, Fade, Zoom
} from '@mui/material';
import {
  // Navigation
  ZoomIn, ZoomOut, PanTool, FitScreen, Home,
  // Selection
  SelectAll, CropFree, Polyline, Lasso,
  // Drawing
  EditLocation, Timeline, CropSquare, Circle,
  AddLocation, NearMe, ScatterPlot,
  // Measure
  Straighten, SquareFoot, Explore, CompassCalibration,
  // Information
  HelpOutline, Info, TouchApp,
  // Edit
  Edit, Delete, ContentCut, ContentCopy, ContentPaste,
  // View
  Layers, FilterList, Style, Label,
  // Misc
  MoreVert, Settings, GridOn, Visibility, VisibilityOff
} from '@mui/icons-material';

const ProfessionalToolbar = ({ 
  mapInstance, 
  onToolSelect,
  activeTool = 'pan',
  onMapViewModeChange,
  mapViewMode = '2D'
}) => {
  const [activeSection, setActiveSection] = useState('navigation');
  const [expanded, setExpanded] = useState(true);

  // Outils disponibles
  const toolSections = [
    {
      id: 'navigation',
      label: 'Navigation',
      tools: [
        { id: 'pan', icon: <PanTool />, label: 'Main (Pan)', shortcut: 'P' },
        { id: 'zoom-in', icon: <ZoomIn />, label: 'Zoom avant', shortcut: '+' },
        { id: 'zoom-out', icon: <ZoomOut />, label: 'Zoom arrière', shortcut: '-' },
        { id: 'zoom-extent', icon: <FitScreen />, label: 'Zoom étendu', shortcut: 'Ctrl+E' },
        { id: 'home', icon: <Home />, label: 'Vue initiale', shortcut: 'Ctrl+H' }
      ]
    },
    {
      id: 'selection',
      label: 'Sélection',
      tools: [
        { id: 'select-rectangle', icon: <CropFree />, label: 'Sélection rectangle', shortcut: 'S' },
        { id: 'select-polygon', icon: <Polyline />, label: 'Sélection polygone', shortcut: 'Shift+S' },
        { id: 'select-lasso', icon: <Lasso />, label: 'Sélection lasso', shortcut: 'L' },
        { id: 'select-all', icon: <SelectAll />, label: 'Tout sélectionner', shortcut: 'Ctrl+A' }
      ]
    },
    {
      id: 'drawing',
      label: 'Dessin',
      tools: [
        { id: 'draw-point', icon: <AddLocation />, label: 'Point', shortcut: '1' },
        { id: 'draw-line', icon: <Timeline />, label: 'Ligne', shortcut: '2' },
        { id: 'draw-polygon', icon: <CropSquare />, label: 'Polygone', shortcut: '3' },
        { id: 'draw-circle', icon: <Circle />, label: 'Cercle', shortcut: '4' },
        { id: 'draw-freehand', icon: <ScatterPlot />, label: 'Main levée', shortcut: '5' }
      ]
    },
    {
      id: 'measure',
      label: 'Mesure',
      tools: [
        { id: 'measure-distance', icon: <Straighten />, label: 'Distance', shortcut: 'M' },
        { id: 'measure-area', icon: <SquareFoot />, label: 'Surface', shortcut: 'Shift+M' },
        { id: 'measure-azimuth', icon: <CompassCalibration />, label: 'Azimut', shortcut: 'A' },
        { id: 'measure-radius', icon: <Explore />, label: 'Rayon', shortcut: 'R' }
      ]
    },
    {
      id: 'information',
      label: 'Information',
      tools: [
        { id: 'info-tool', icon: <Info />, label: 'Info entité', shortcut: 'I' },
        { id: 'identify', icon: <TouchApp />, label: 'Identifier', shortcut: 'Ctrl+I' },
        { id: 'hyperlinks', icon: <HelpOutline />, label: 'Liens hypertexte', shortcut: 'H' }
      ]
    },
    {
      id: 'editing',
      label: 'Édition',
      tools: [
        { id: 'edit-feature', icon: <Edit />, label: 'Modifier', shortcut: 'E' },
        { id: 'move-feature', icon: <NearMe />, label: 'Déplacer', shortcut: 'V' },
        { id: 'delete-feature', icon: <Delete />, label: 'Supprimer', shortcut: 'Del' },
        { id: 'split-feature', icon: <ContentCut />, label: 'Diviser', shortcut: 'X' }
      ]
    }
  ];

  // Gestion des outils
  const handleToolClick = (toolId) => {
    if (onToolSelect) {
      onToolSelect(toolId);
    }
    
    // Actions spécifiques pour certains outils
    switch(toolId) {
      case 'zoom-in':
        if (mapInstance) {
          const view = mapInstance.getView();
          view.setZoom(view.getZoom() + 1);
        }
        break;
      case 'zoom-out':
        if (mapInstance) {
          const view = mapInstance.getView();
          view.setZoom(view.getZoom() - 1);
        }
        break;
      case 'zoom-extent':
        if (mapInstance) {
          // TODO: Implémenter le zoom étendu
          console.log('Zoom étendu');
        }
        break;
      case 'measure-distance':
        // Ouvre le widget de mesure
        if (onToolSelect) onToolSelect('measure');
        break;
      default:
        console.log('Outil sélectionné:', toolId);
    }
  };

  // Mode de vue carte
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null && onMapViewModeChange) {
      onMapViewModeChange(newMode);
    }
  };

  return (
    <Paper 
      elevation={3}
      sx={{
        position: 'absolute',
        top: 80,
        left: 20,
        zIndex: 1000,
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        minWidth: expanded ? 280 : 56,
        transition: 'all 0.3s ease'
      }}
    >
      {/* En-tête de la toolbar */}
      <Box sx={{ 
        p: 1, 
        bgcolor: '#1a237e',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, opacity: expanded ? 1 : 0 }}>
          🛠️ Outils SIG
        </Typography>
        <IconButton 
          size="small" 
          onClick={() => setExpanded(!expanded)}
          sx={{ color: 'white' }}
        >
          <MoreVert />
        </IconButton>
      </Box>

      {/* Contenu principal (visible quand expandé) */}
      <Fade in={expanded} timeout={300}>
        <Box>
          {/* Sélecteur de mode de vue */}
          <Box sx={{ p: 1.5, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Mode de visualisation
            </Typography>
            <ToggleButtonGroup
              value={mapViewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
              fullWidth
            >
              <ToggleButton value="2D" sx={{ py: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Layers fontSize="small" />
                  <Typography variant="caption">2D</Typography>
                </Box>
              </ToggleButton>
              <ToggleButton value="3D" sx={{ py: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Style fontSize="small" />
                  <Typography variant="caption">3D</Typography>
                </Box>
              </ToggleButton>
              <ToggleButton value="canvas" sx={{ py: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FilterList fontSize="small" />
                  <Typography variant="caption">Canvas</Typography>
                </Box>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Sections d'outils */}
          {toolSections.map((section) => (
            <Box 
              key={section.id}
              sx={{ 
                p: 1.5, 
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                bgcolor: activeSection === section.id ? 'rgba(26, 35, 126, 0.05)' : 'transparent'
              }}
              onClick={() => setActiveSection(section.id)}
            >
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  mb: 1, 
                  display: 'block',
                  fontWeight: activeSection === section.id ? 600 : 400
                }}
              >
                {section.label}
              </Typography>
              
              <ButtonGroup 
                orientation="vertical" 
                variant="outlined" 
                size="small"
                fullWidth
              >
                {section.tools.map((tool) => (
                  <Tooltip 
                    key={tool.id} 
                    title={`${tool.label} (${tool.shortcut})`} 
                    placement="right"
                    TransitionComponent={Zoom}
                  >
                    <Button
                      onClick={() => handleToolClick(tool.id)}
                      sx={{
                        justifyContent: 'flex-start',
                        py: 1,
                        borderColor: 'rgba(0,0,0,0.1)',
                        bgcolor: activeTool === tool.id ? 'rgba(26, 35, 126, 0.1)' : 'transparent',
                        color: activeTool === tool.id ? '#1a237e' : 'inherit',
                        '&:hover': {
                          bgcolor: 'rgba(26, 35, 126, 0.15)'
                        }
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        width: '100%',
                        gap: 1 
                      }}>
                        {tool.icon}
                        <Typography variant="body2" sx={{ flexGrow: 1, textAlign: 'left' }}>
                          {tool.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tool.shortcut}
                        </Typography>
                      </Box>
                    </Button>
                  </Tooltip>
                ))}
              </ButtonGroup>
            </Box>
          ))}

          {/* Outils rapides (toujours visibles) */}
          <Box sx={{ p: 1.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Outils rapides
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Grille">
                <IconButton size="small">
                  <GridOn fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Afficher/Masquer couches">
                <IconButton size="small">
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Étiquettes">
                <IconButton size="small">
                  <Label fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Paramètres">
                <IconButton size="small">
                  <Settings fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Fade>

      {/* Version réduite (icône seule) */}
      {!expanded && (
        <Box sx={{ p: 1 }}>
          <ButtonGroup orientation="vertical">
            {toolSections.slice(0, 3).map((section) => (
              <Tooltip key={section.id} title={section.label} placement="right">
                <IconButton 
                  size="small" 
                  onClick={() => {
                    setActiveSection(section.id);
                    setExpanded(true);
                  }}
                  sx={{ 
                    mb: 0.5,
                    bgcolor: activeSection === section.id ? 'rgba(26, 35, 126, 0.1)' : 'transparent'
                  }}
                >
                  {section.tools[0].icon}
                </IconButton>
              </Tooltip>
            ))}
          </ButtonGroup>
        </Box>
      )}
    </Paper>
  );
};

export default ProfessionalToolbar;