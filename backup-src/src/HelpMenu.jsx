// src/components/menus/HelpMenu.jsx
import React from 'react';
import {
  Menu, MenuItem, ListItemIcon, ListItemText, Divider,
  Typography
} from '@mui/material';
import {
  Help, Book, BugReport, Info, ContactSupport
} from '@mui/icons-material';

const HelpMenu = ({ anchorEl, open, onClose, onAction }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{ dense: true }}
      PaperProps={{ sx: { width: 250 } }}
    >
      <MenuItem disabled sx={{ py: 1, backgroundColor: '#f57c00', color: 'white' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          ❓ Aide
        </Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('help:documentation')}>
        <ListItemIcon><Book fontSize="small" /></ListItemIcon>
        <ListItemText primary="Documentation" />
      </MenuItem>
      
      <MenuItem onClick={() => onAction('help:tutorials')}>
        <ListItemIcon><Help fontSize="small" /></ListItemIcon>
        <ListItemText primary="Tutoriels" />
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction('help:check-updates')}>
        <ListItemIcon><Info fontSize="small" /></ListItemIcon>
        <ListItemText primary="Vérifier les mises à jour" />
      </MenuItem>
      
      <MenuItem onClick={() => onAction('help:about')}>
        <ListItemIcon><Info fontSize="small" /></ListItemIcon>
        <ListItemText primary="À propos de JOMA SIG" />
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction('help:report-bug')}>
        <ListItemIcon><BugReport fontSize="small" /></ListItemIcon>
        <ListItemText primary="Signaler un bug" />
      </MenuItem>
      
      <MenuItem onClick={() => onAction('help:feedback')}>
        <ListItemIcon><ContactSupport fontSize="small" /></ListItemIcon>
        <ListItemText primary="Donner votre avis" />
      </MenuItem>
      
      <MenuItem onClick={() => onAction('help:contact')}>
        <ListItemIcon><ContactSupport fontSize="small" /></ListItemIcon>
        <ListItemText primary="Contact support" />
      </MenuItem>
    </Menu>
  );
};

export default HelpMenu;