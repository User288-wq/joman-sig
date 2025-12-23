import React from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import {
  Undo, Redo, Copy, Paste, Cut, Delete, SelectAll, Clear
} from "@mui/icons-material";

const EditMenu = ({ anchorEl, open, onClose, onAction }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{ dense: true }}
    >
      <MenuItem onClick={() => onAction("edit:undo")}>
        <ListItemIcon><Undo fontSize="small" /></ListItemIcon>
        <ListItemText>Annuler</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => onAction("edit:redo")}>
        <ListItemIcon><Redo fontSize="small" /></ListItemIcon>
        <ListItemText>Rétablir</ListItemText>
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction("edit:cut")}>
        <ListItemIcon><Cut fontSize="small" /></ListItemIcon>
        <ListItemText>Couper</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => onAction("edit:copy")}>
        <ListItemIcon><Copy fontSize="small" /></ListItemIcon>
        <ListItemText>Copier</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => onAction("edit:paste")}>
        <ListItemIcon><Paste fontSize="small" /></ListItemIcon>
        <ListItemText>Coller</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => onAction("edit:delete")}>
        <ListItemIcon><Delete fontSize="small" /></ListItemIcon>
        <ListItemText>Supprimer</ListItemText>
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction("edit:select-all")}>
        <ListItemIcon><SelectAll fontSize="small" /></ListItemIcon>
        <ListItemText>Tout sélectionner</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => onAction("edit:clear")}>
        <ListItemIcon><Clear fontSize="small" /></ListItemIcon>
        <ListItemText>Tout effacer</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default EditMenu;
