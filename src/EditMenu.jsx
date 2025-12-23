// src/components/menus/EditMenu.jsx
import React from 'react';
import {
  Menu, MenuItem, ListItemIcon, ListItemText, Divider,
  Typography
} from '@mui/material';
import {
  Undo, Redo, ContentCopy, ContentCut, ContentPaste,
  Delete, FindInPage, SelectAll, ClearAll
} from '@mui/icons-material';

const EditMenu = ({ anchorEl, open, onClose, onAction }) => {
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
          ✏️ Édition
        </Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('edit:undo')} disabled>
        <ListItemIcon><Undo fontSize="small" /></ListItemIcon>
        <ListItemText primary="Annuler" />
        <Typography variant="caption" color="text.secondary">Ctrl+Z</Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('edit:redo')} disabled>
        <ListItemIcon><Redo fontSize="small" /></ListItemIcon>
        <ListItemText primary="Rétablir" />
        <Typography variant="caption" color="text.secondary">Ctrl+Y</Typography>
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction('edit:cut')}>
        <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
        <ListItemText primary="Couper" />
        <Typography variant="caption" color="text.secondary">Ctrl+X</Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('edit:copy')}>
        <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
        <ListItemText primary="Copier" />
        <Typography variant="caption" color="text.secondary">Ctrl+C</Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('edit:paste')}>
        <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
        <ListItemText primary="Coller" />
        <Typography variant="caption" color="text.secondary">Ctrl+V</Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('edit:delete')}>
        <ListItemIcon><Delete fontSize="small" /></ListItemIcon>
        <ListItemText primary="Supprimer" />
        <Typography variant="caption" color="text.secondary">Del</Typography>
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction('edit:select-all')}>
        <ListItemIcon><SelectAll fontSize="small" /></ListItemIcon>
        <ListItemText primary="Tout sélectionner" />
        <Typography variant="caption" color="text.secondary">Ctrl+A</Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('edit:deselect-all')}>
        <ListItemIcon><ClearAll fontSize="small" /></ListItemIcon>
        <ListItemText primary="Tout désélectionner" />
        <Typography variant="caption" color="text.secondary">Ctrl+Shift+A</Typography>
      </MenuItem>
      
      <MenuItem onClick={() => onAction('edit:find')}>
        <ListItemIcon><FindInPage fontSize="small" /></ListItemIcon>
        <ListItemText primary="Rechercher..." />
        <Typography variant="caption" color="text.secondary">Ctrl+F</Typography>
      </MenuItem>
    </Menu>
  );
};

export default EditMenu;