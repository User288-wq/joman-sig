// src/components/menus/DatabaseMenu.jsx
import React from 'react';
import {
  Menu, MenuItem, ListItemIcon, ListItemText, Divider,
  Typography
} from '@mui/material';
import {
  Storage, Dns, TableChart,
  ImportExport, QueryBuilder, Backup
} from '@mui/icons-material';

const DatabaseMenu = ({ anchorEl, open, onClose, onAction }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{ dense: true }}
      PaperProps={{ sx: { width: 260 } }}
    >
      <MenuItem disabled sx={{ py: 1, backgroundColor: '#00796b', color: 'white' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          🗄️ Données
        </Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('database:manager')}>
        <ListItemIcon><Storage fontSize="small" /></ListItemIcon>
        <ListItemText primary="Gestionnaire de bases" />
      </MenuItem>
      
      <MenuItem onClick={() => onAction('database:new-connection')}>
        <ListItemIcon><Dns fontSize="small" /></ListItemIcon>
        <ListItemText primary="Nouvelle connexion" />
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction('database:import')}>
        <ListItemIcon><ImportExport fontSize="small" /></ListItemIcon>
        <ListItemText primary="Importer depuis BDD" />
      </MenuItem>
      
      <MenuItem onClick={() => onAction('database:export')}>
        <ListItemIcon><ImportExport fontSize="small" /></ListItemIcon>
        <ListItemText primary="Exporter vers BDD" />
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction('database:query-editor')}>
        <ListItemIcon><QueryBuilder fontSize="small" /></ListItemIcon>
        <ListItemText primary="Éditeur de requêtes SQL" />
      </MenuItem>
      
      <MenuItem onClick={() => onAction('database:backup')}>
        <ListItemIcon><Backup fontSize="small" /></ListItemIcon>
        <ListItemText primary="Sauvegarde BDD" />
      </MenuItem>
    </Menu>
  );
};

export default DatabaseMenu;