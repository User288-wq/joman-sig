import React, { useState } from 'react';
import { 
  Box, 
  ToggleButtonGroup, 
  ToggleButton, 
  IconButton,
  Tooltip 
} from '@mui/material';
import {
  Create as DrawIcon,
  Square as RectangleIcon,
  ChangeHistory as PolygonIcon,
  Straighten as LineIcon,
  RadioButtonUnchecked as CircleIcon,
  GpsFixed as PointIcon,
  Delete as ClearIcon,
  Undo as UndoIcon
} from '@mui/icons-material';
import { useDrawing } from '../hooks/useDrawing';

const DrawingTool = ({ onDrawComplete }) => {
  const {
    drawingMode,
    isDrawing,
    startDrawing,
    stopDrawing,
    clearDrawing
  } = useDrawing();

  const [tool, setTool] = useState('pan');

  const handleToolChange = (event, newTool) => {
    if (newTool !== null) {
      setTool(newTool);
      
      if (newTool === 'pan') {
        stopDrawing();
      } else {
        startDrawing(newTool);
      }
    }
  };

  const drawingTools = [
    { value: 'point', icon: <PointIcon />, label: 'Point' },
    { value: 'line', icon: <LineIcon />, label: 'Ligne' },
    { value: 'polygon', icon: <PolygonIcon />, label: 'Polygone' },
    { value: 'rectangle', icon: <RectangleIcon />, label: 'Rectangle' },
    { value: 'circle', icon: <CircleIcon />, label: 'Cercle' }
  ];

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 80,
        left: 20,
        zIndex: 1000,
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: 3,
        p: 1
      }}
    >
      <ToggleButtonGroup
        value={tool}
        exclusive
        onChange={handleToolChange}
        aria-label="drawing tools"
        size="small"
        orientation="vertical"
      >
        <ToggleButton value="pan" aria-label="pan">
          <Tooltip title="Déplacement">
            <DrawIcon />
          </Tooltip>
        </ToggleButton>
        
        {drawingTools.map(({ value, icon, label }) => (
          <ToggleButton key={value} value={value} aria-label={value}>
            <Tooltip title={label}>
              {icon}
            </Tooltip>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      
      <Box sx={{ mt: 1, borderTop: 1, borderColor: 'divider', pt: 1 }}>
        <Tooltip title="Effacer le dessin">
          <IconButton 
            size="small" 
            onClick={clearDrawing}
            disabled={!isDrawing}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Annuler">
          <IconButton size="small" disabled={!isDrawing}>
            <UndoIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      {isDrawing && (
        <Box 
          sx={{ 
            mt: 1, 
            p: 1, 
            backgroundColor: 'info.light', 
            borderRadius: 1,
            fontSize: '0.75rem'
          }}
        >
          Mode dessin: {drawingTools.find(t => t.value === drawingMode)?.label}
        </Box>
      )}
    </Box>
  );
};

export default DrawingTool;
