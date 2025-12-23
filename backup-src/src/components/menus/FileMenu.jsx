import React from 'react';
import {
  Menu, MenuItem, ListItemIcon, ListItemText, Divider,
  Typography
} from '@mui/material';
import {
  CreateNewFolder, FolderOpen, Save, SaveAs,
  CloudUpload, CloudDownload, Print, ExitToApp,
  InsertDriveFile, PictureAsPdf, Archive, History, Settings
} from '@mui/icons-material';

const FileMenu = ({ anchorEl, open, onClose, onAction }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{ dense: true }}
      PaperProps={{ sx: { width: 280 } }}
    >
      <MenuItem disabled sx={{ py: 1, backgroundColor: '#1976d2', color: 'white' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
           Fichier
        </Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('file:new')}>
        <ListItemIcon><CreateNewFolder fontSize="small" /></ListItemIcon>
        <ListItemText primary="Nouveau projet" />
        <Typography variant="caption" color="text.secondary">Ctrl+N</Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('file:open')}>
        <ListItemIcon><FolderOpen fontSize="small" /></ListItemIcon>
        <ListItemText primary="Ouvrir projet..." />
        <Typography variant="caption" color="text.secondary">Ctrl+O</Typography>
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction('file:save')}>
        <ListItemIcon><Save fontSize="small" /></ListItemIcon>
        <ListItemText primary="Enregistrer" />
        <Typography variant="caption" color="text.secondary">Ctrl+S</Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('file:save-as')}>
        <ListItemIcon><SaveAs fontSize="small" /></ListItemIcon>
        <ListItemText primary="Enregistrer sous..." />
        <Typography variant="caption" color="text.secondary">Ctrl+Shift+S</Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('file:cloud-save')}>
        <ListItemIcon><CloudUpload fontSize="small" /></ListItemIcon>
        <ListItemText primary="Sauvegarde cloud" />
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction('file:import')}>
        <ListItemIcon><CloudDownload fontSize="small" /></ListItemIcon>
        <ListItemText primary="Importer des données" />
      </MenuItem>
      
      <MenuItem onClick={() => onAction('file:export-geojson')}>
        <ListItemIcon><InsertDriveFile fontSize="small" /></ListItemIcon>
        <ListItemText primary="Exporter en GeoJSON" />
      </MenuItem>
      
      <MenuItem onClick={() => onAction('file:export-pdf')}>
        <ListItemIcon><PictureAsPdf fontSize="small" /></ListItemIcon>
        <ListItemText primary="Exporter en PDF" />
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction('file:print')}>
        <ListItemIcon><Print fontSize="small" /></ListItemIcon>
        <ListItemText primary="Imprimer la carte..." />
        <Typography variant="caption" color="text.secondary">Ctrl+P</Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('file:preferences')}>
        <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
        <ListItemText primary="Préférences projet..." />
      </MenuItem>
      
      <MenuItem onClick={() => onAction('file:history')}>
        <ListItemIcon><History fontSize="small" /></ListItemIcon>
        <ListItemText primary="Historique des versions" />
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction('file:quit')} sx={{ color: 'error.main' }}>
        <ListItemIcon sx={{ color: 'error.main' }}><ExitToApp fontSize="small" /></ListItemIcon>
        <ListItemText primary="Quitter JOMA SIG" />
        <Typography variant="caption" color="error">Ctrl+Q</Typography>
      </MenuItem>
    </Menu>
  );
};

export default FileMenu;

