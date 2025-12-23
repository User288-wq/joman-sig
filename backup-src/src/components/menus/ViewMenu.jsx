import React from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import {
  ZoomIn, ZoomOut, Fullscreen, Map, ViewInAr, GridOn
} from "@mui/icons-material";

const ViewMenu = ({ anchorEl, open, onClose, onAction }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{ dense: true }}
    >
      <MenuItem onClick={() => onAction("view:zoom-in")}>
        <ListItemIcon><ZoomIn fontSize="small" /></ListItemIcon>
        <ListItemText>Zoom avant</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => onAction("view:zoom-out")}>
        <ListItemIcon><ZoomOut fontSize="small" /></ListItemIcon>
        <ListItemText>Zoom arrière</ListItemText>
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction("view:mode-2d")}>
        <ListItemIcon><Map fontSize="small" /></ListItemIcon>
        <ListItemText>Vue 2D</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => onAction("view:mode-3d")}>
        <ListItemIcon><ViewInAr fontSize="small" /></ListItemIcon>
        <ListItemText>Vue 3D</ListItemText>
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => onAction("view:toggle-grid")}>
        <ListItemIcon><GridOn fontSize="small" /></ListItemIcon>
        <ListItemText>Afficher/Masquer la grille</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => onAction("view:fullscreen")}>
        <ListItemIcon><Fullscreen fontSize="small" /></ListItemIcon>
        <ListItemText>Plein écran</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default ViewMenu;
