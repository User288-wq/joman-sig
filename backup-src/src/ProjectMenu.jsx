// src/components/menus/ProjectMenu.jsx
import React from 'react';
import {
  Menu, MenuItem, ListItemIcon, ListItemText, Divider,
  Typography
} from '@mui/material';
import {
  Dashboard, CreateNewFolder, FolderOpen, Save, SaveAs,
  Cloud, Settings, Description, Share
} from '@mui/icons-material';

const ProjectMenu = ({ anchorEl, open, onClose, onAction }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{ dense: true }}
      PaperProps={{ sx: { width: 280 } }}
    >
      <MenuItem disabled sx={{ py: 1, backgroundColor: '#5d4037', color: 'white' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          📊 Projet
        </Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('project:new')}>
        <ListItemIcon><CreateNewFolder fontSize="small" /></ListItemIcon>
        <ListItemText primary="Nouveau projet" />
        <Typography variant="caption" color="text.secondary">Ctrl+Shift+N</Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('project:open')}>
        <ListItemIcon><FolderOpen fontSize="small" /></ListItemIcon>
        <ListItemText primary="Ouvrir projet..." />
        <Typography variant="caption" color="text.secondary">Ctrl+O</Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('project:save')}>
        <ListItemIcon><Save fontSize="small" /></ListItemIcon>
        <ListItemText primary="Enregistrer" />
        <Typography variant="caption" color="text.secondary">Ctrl+S</Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('project:save-as')}>
        <ListItemIcon><SaveAs fontSize="small" /></ListItemIcon>
        <ListItemText primary="Enregistrer sous..." />
        <Typography variant="caption" color="text.secondary">Ctrl+Shift+S</Typography>
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction('project:cloud')}>
        <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
        <ListItemText primary="Projets cloud" />
      </MenuItem>
      
      <MenuItem onClick={() => onAction('project:share')}>
        <ListItemIcon><Share fontSize="small" /></ListItemIcon>
        <ListItemText primary="Partager projet" />
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction('project:properties')}>
        <ListItemIcon><Description fontSize="small" /></ListItemIcon>
        <ListItemText primary="Propriétés projet" />
        <Typography variant="caption" color="text.secondary">Alt+Enter</Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('project:config')}>
        <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
        <ListItemText primary="Configuration projet" />
      </MenuItem>
    </Menu>
  );
};

export default ProjectMenu;