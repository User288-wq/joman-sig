import React from 'react';
import {
  Menu, MenuItem, ListItemIcon, ListItemText, Divider,
  Typography
} from '@mui/material';
import {
  Layers, Add, Remove, Visibility, VisibilityOff,
  FilterList, ColorLens, MergeType, GroupWork,
  CompareArrows, GridOn, Style
} from '@mui/icons-material';

const LayerMenu = ({ anchorEl, open, onClose, onAction }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{ dense: true }}
      PaperProps={{ sx: { width: 320 } }}
    >
      <MenuItem disabled sx={{ py: 1, backgroundColor: '#388e3c', color: 'white' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
           Gestion des couches
        </Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('layers:add-vector')}>
        <ListItemIcon><Add fontSize="small" /></ListItemIcon>
        <ListItemText primary="Ajouter une couche vecteur" />
        <Typography variant="caption" color="text.secondary">GeoJSON, SHP...</Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('layers:add-raster')}>
        <ListItemIcon><GridOn fontSize="small" /></ListItemIcon>
        <ListItemText primary="Ajouter une couche raster" />
        <Typography variant="caption" color="text.secondary">TIFF, PNG...</Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('layers:add-wms')}>
        <ListItemIcon><Layers fontSize="small" /></ListItemIcon>
        <ListItemText primary="Ajouter un service WMS/WMTS" />
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction('layers:remove')}>
        <ListItemIcon><Remove fontSize="small" /></ListItemIcon>
        <ListItemText primary="Supprimer la couche active" />
        <Typography variant="caption" color="text.secondary">Suppr</Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('layers:duplicate')}>
        <ListItemIcon><Layers fontSize="small" /></ListItemIcon>
        <ListItemText primary="Dupliquer la couche" />
      </MenuItem>
      
      <MenuItem onClick={() => onAction('layers:group')}>
        <ListItemIcon><GroupWork fontSize="small" /></ListItemIcon>
        <ListItemText primary="Grouper les couches" />
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction('layers:show-all')}>
        <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
        <ListItemText primary="Afficher toutes les couches" />
      </MenuItem>
      
      <MenuItem onClick={() => onAction('layers:hide-all')}>
        <ListItemIcon><VisibilityOff fontSize="small" /></ListItemIcon>
        <ListItemText primary="Masquer toutes les couches" />
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction('layers:style')}>
        <ListItemIcon><ColorLens fontSize="small" /></ListItemIcon>
        <ListItemText primary="Modifier le style..." />
      </MenuItem>
      
      <MenuItem onClick={() => onAction('layers:filter')}>
        <ListItemIcon><FilterList fontSize="small" /></ListItemIcon>
        <ListItemText primary="Appliquer un filtre..." />
      </MenuItem>
      
      <MenuItem onClick={() => onAction('layers:merge')}>
        <ListItemIcon><MergeType fontSize="small" /></ListItemIcon>
        <ListItemText primary="Fusionner les couches" />
      </MenuItem>
      
      <MenuItem onClick={() => onAction('layers:reproject')}>
        <ListItemIcon><CompareArrows fontSize="small" /></ListItemIcon>
        <ListItemText primary="Reprojecter..." />
      </MenuItem>
    </Menu>
  );
};

export default LayerMenu;
