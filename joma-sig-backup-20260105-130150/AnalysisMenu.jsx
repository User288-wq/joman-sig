// src/components/menus/AnalysisMenu.jsx
import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Analytics } from '@mui/icons-material';

const AnalysisMenu = ({ anchorEl, open, onClose, onAction }) => {
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem onClick={() => onAction('analysis:spatial-query')}>
        <ListItemIcon><Analytics /></ListItemIcon>
        <ListItemText primary="Requête spatiale" />
      </MenuItem>
    </Menu>
  );
};
export default AnalysisMenu;

// src/components/menus/VectorMenu.jsx
import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Timeline } from '@mui/icons-material';

const VectorMenu = ({ anchorEl, open, onClose, onAction }) => {
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem onClick={() => onAction('vector:create')}>
        <ListItemIcon><Timeline /></ListItemIcon>
        <ListItemText primary="Créer" />
      </MenuItem>
    </Menu>
  );
};
export default VectorMenu;

// src/components/menus/RasterMenu.jsx
import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Image } from '@mui/icons-material';

const RasterMenu = ({ anchorEl, open, onClose, onAction }) => {
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem onClick={() => onAction('raster:reclassify')}>
        <ListItemIcon><Image /></ListItemIcon>
        <ListItemText primary="Reclasser" />
      </MenuItem>
    </Menu>
  );
};
export default RasterMenu;

// src/components/menus/WebMenu.jsx
import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Language } from '@mui/icons-material';

const WebMenu = ({ anchorEl, open, onClose, onAction }) => {
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem onClick={() => onAction('web:wms')}>
        <ListItemIcon><Language /></ListItemIcon>
        <ListItemText primary="Service WMS" />
      </MenuItem>
    </Menu>
  );
};
export default WebMenu;