import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  MyLocation,
  Layers,
  Straighten,
  Fullscreen,
  FilterCenterFocus,
  Map as MapIcon,
  GridOn,
  Scale,
  Terrain,
  GpsFixed
} from '@mui/icons-material';
import { Tooltip, IconButton, Paper, Box, Typography, ButtonGroup, Button } from '@mui/material';

const MapControls = ({
  onZoomIn,
  onZoomOut,
  onCenterMap,
  onToggleLayers,
  onMeasure,
  onFullscreen,
  onFitToView,
  onShowGrid,
  onShowScale,
  showGrid = false,
  showScale = false,
  currentZoom,
  currentCenter
}) => {
  const mainControls = [
    { icon: <ZoomIn />, title: 'Zoom avant (Ctrl +)', action: onZoomIn, color: 'primary' },
    { icon: <ZoomOut />, title: 'Zoom arrière (Ctrl -)', action: onZoomOut, color: 'primary' },
    { icon: <MyLocation />, title: 'Centrer sur ma position', action: onCenterMap, color: 'primary' },
    { icon: <FilterCenterFocus />, title: 'Ajuster à la vue', action: onFitToView, color: 'primary' },
  ];

  const toolControls = [
    { icon: <Straighten />, title: 'Outils de mesure', action: onMeasure, color: 'secondary' },
    { icon: <Layers />, title: 'Gérer les couches (Ctrl+L)', action: onToggleLayers, color: 'secondary' },
    { icon: <GridOn />, title: 'Afficher/Masquer la grille', action: onShowGrid, color: showGrid ? 'primary' : 'default' },
    { icon: <Scale />, title: 'Afficher/Masquer l\'échelle', action: onShowScale, color: showScale ? 'primary' : 'default' },
    { icon: <Fullscreen />, title: 'Mode plein écran (F11)', action: onFullscreen, color: 'default' },
  ];

  return (
    <Box sx={{ position: 'absolute', top: 80, right: 20, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Contrôles de navigation principaux */}
      <Paper
        sx={{
          padding: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.1)'
        }}
        elevation={3}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, px: 1, borderBottom: '1px solid #eee', pb: 1 }}>
          <MapIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Navigation
          </Typography>
        </Box>

        {mainControls.map((control, index) => (
          <Tooltip key={index} title={control.title} placement="left" arrow>
            <IconButton
              onClick={control.action}
              color={control.color}
              size="small"
              sx={{
                width: 40,
                height: 40,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                  backgroundColor: 'rgba(25, 118, 210, 0.1)'
                }
              }}
            >
              {control.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Paper>

      {/* Contrôles d'outils */}
      <Paper
        sx={{
          padding: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.1)'
        }}
        elevation={3}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, px: 1, borderBottom: '1px solid #eee', pb: 1 }}>
          <Terrain fontSize="small" sx={{ mr: 1, color: 'secondary.main' }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Outils
          </Typography>
        </Box>

        {toolControls.map((control, index) => (
          <Tooltip key={index} title={control.title} placement="left" arrow>
            <IconButton
              onClick={control.action}
              color={control.color}
              size="small"
              sx={{
                width: 40,
                height: 40,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                  backgroundColor: control.color === 'primary' 
                    ? 'rgba(25, 118, 210, 0.1)' 
                    : 'rgba(0, 0, 0, 0.05)'
                }
              }}
            >
              {control.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Paper>

      {/* Affichage du zoom */}
      {currentZoom !== undefined && (
        <Paper
          sx={{
            p: 1,
            textAlign: 'center',
            backgroundColor: 'primary.main',
            color: 'white',
            minWidth: 60
          }}
          elevation={2}
        >
          <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
            Zoom: {currentZoom.toFixed(1)}
          </Typography>
        </Paper>
      )}

      {/* Boutons de vue rapide */}
      <ButtonGroup 
        orientation="vertical" 
        size="small" 
        variant="contained"
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          '& .MuiButton-root': {
            minWidth: 'auto',
            padding: '4px 8px',
            fontSize: '0.75rem'
          }
        }}
      >
        <Button onClick={() => onZoomIn?.()}>+</Button>
        <Button onClick={() => onZoomOut?.()}>-</Button>
        <Button onClick={() => onCenterMap?.()}>
          <GpsFixed fontSize="small" />
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default MapControls;