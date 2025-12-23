import React from 'react';
import {
  Menu, MenuItem, ListItemIcon, ListItemText, Divider,
  Typography
} from '@mui/material';
import { Construction, Close } from '@mui/icons-material';

const PlaceholderMenu = ({ anchorEl, open, onClose, onAction }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{ dense: true }}
      PaperProps={{ sx: { width: 250 } }}
    >
      <MenuItem disabled sx={{ py: 1, backgroundColor: '#757575', color: 'white' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          🚧 En construction
        </Typography>
      </MenuItem>
      
      <MenuItem onClick={onClose}>
        <ListItemIcon><Construction fontSize="small" /></ListItemIcon>
        <ListItemText primary="Fonctionnalité à venir" />
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={onClose}>
        <ListItemIcon><Close fontSize="small" /></ListItemIcon>
        <ListItemText primary="Fermer" />
      </MenuItem>
    </Menu>
  );
};

export default PlaceholderMenu;