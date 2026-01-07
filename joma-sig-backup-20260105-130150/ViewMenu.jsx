// src/components/menus/ViewMenu.jsx
import React from 'react';
import {
  Menu, MenuItem, ListItemIcon, ListItemText, Divider,
  Typography
} from '@mui/material';
import {
  ZoomIn, ZoomOut, Fullscreen, GridOn,
  Visibility, Refresh, FitScreen
} from '@mui/icons-material';

const ViewMenu = ({ anchorEl, open, onClose, onAction }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{ dense: true }}
      PaperProps={{ sx: { width: 250 } }}
    >
      <MenuItem disabled sx={{ py: 1, backgroundColor: '#0288d1', color: 'white' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          👁️ Vue
        </Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('view:zoom-in')}>
        <ListItemIcon><ZoomIn fontSize="small" /></ListItemIcon>
        <ListItemText primary="Zoom avant" />
        <Typography variant="caption" color="text.secondary">+</Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('view:zoom-out')}>
        <ListItemIcon><ZoomOut fontSize="small" /></ListItemIcon>
        <ListItemText primary="Zoom arrière" />
        <Typography variant="caption" color="text.secondary">-</Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('view:zoom-extent')}>
        <ListItemIcon><FitScreen fontSize="small" /></ListItemIcon>
        <ListItemText primary="Zoom étendu" />
        <Typography variant="caption" color="text.secondary">Ctrl+E</Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('view:refresh')}>
        <ListItemIcon><Refresh fontSize="small" /></ListItemIcon>
        <ListItemText primary="Recharger la vue" />
        <Typography variant="caption" color="text.secondary">F5</Typography>
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction('view:fullscreen')}>
        <ListItemIcon><Fullscreen fontSize="small" /></ListItemIcon>
        <ListItemText primary="Plein écran" />
        <Typography variant="caption" color="text.secondary">F11</Typography>
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction('view:basemap-osm')}>
        <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
        <ListItemText primary="OpenStreetMap" />
      </MenuItem>
      
      <MenuItem onClick={() => onAction('view:basemap-satellite')}>
        <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
        <ListItemText primary="Satellite" />
      </MenuItem>
      
      <MenuItem onClick={() => onAction('view:basemap-terrain')}>
        <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
        <ListItemText primary="Terrain" />
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction('view:overlay-grid')}>
        <ListItemIcon><GridOn fontSize="small" /></ListItemIcon>
        <ListItemText primary="Grille de coordonnées" />
      </MenuItem>
      
      <MenuItem onClick={() => onAction('view:overlay-scale')}>
        <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
        <ListItemText primary="Échelle graphique" />
      </MenuItem>
    </Menu>
  );
};

export default ViewMenu;