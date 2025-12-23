// src/components/menus/ViewMenu.jsx
import React, { useState } from 'react';
import {
  Menu, MenuItem, ListItemIcon, ListItemText, Divider,
  Typography, Collapse, List, ListItemButton, Switch
} from '@mui/material';
import {
  ZoomIn, ZoomOut, Fullscreen, Panorama,
  Layers, GridOn, Map, ViewInAr, Expand,
  Visibility, VisibilityOff, Refresh, FitScreen
} from '@mui/icons-material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const ViewMenu = ({ anchorEl, open, onClose, onAction }) => {
  const [expanded, setExpanded] = useState({});
  
  const viewModes = [
    { label: '2D (OpenLayers)', action: 'view:mode-2d' },
    { label: '3D (Cesium)', action: 'view:mode-3d' },
    { label: 'Vue canvas', action: 'view:mode-canvas' },
    { label: 'Vue split', action: 'view:mode-split' }
  ];
  
  const baseLayers = [
    { label: 'OpenStreetMap', action: 'view:basemap-osm' },
    { label: 'Satellite', action: 'view:basemap-satellite' },
    { label: 'Terrain', action: 'view:basemap-terrain' },
    { label: 'Vecteur light', action: 'view:basemap-light' },
    { label: 'Vecteur dark', action: 'view:basemap-dark' }
  ];
  
  const overlays = [
    { label: 'Grille de coordonnées', action: 'view:overlay-grid', checked: false },
    { label: 'Échelle graphique', action: 'view:overlay-scale', checked: true },
    { label: 'Rose des vents', action: 'view:overlay-compass', checked: true },
    { label: 'Coordonnées curseur', action: 'view:overlay-coords', checked: true }
  ];

  const menuItems = [
    {
      icon: <ZoomIn fontSize="small" />,
      label: 'Zoom avant',
      action: 'view:zoom-in',
      shortcut: '+'
    },
    {
      icon: <ZoomOut fontSize="small" />,
      label: 'Zoom arrière',
      action: 'view:zoom-out',
      shortcut: '-'
    },
    {
      icon: <FitScreen fontSize="small" />,
      label: 'Zoom étendu',
      action: 'view:zoom-extent',
      shortcut: 'Ctrl+E'
    },
    {
      icon: <Refresh fontSize="small" />,
      label: 'Recharger la vue',
      action: 'view:refresh',
      shortcut: 'F5'
    },
    { divider: true },
    {
      icon: <Fullscreen fontSize="small" />,
      label: 'Plein écran',
      action: 'view:fullscreen',
      shortcut: 'F11'
    },
    {
      icon: <Panorama fontSize="small" />,
      label: 'Vue panoramique',
      action: 'view:panorama'
    },
    { divider: true },
    {
      icon: <Map fontSize="small" />,
      label: 'Mode de visualisation',
      hasSubmenu: true,
      items: viewModes
    },
    {
      icon: <Layers fontSize="small" />,
      label: 'Fond de carte',
      hasSubmenu: true,
      items: baseLayers
    },
    {
      icon: <GridOn fontSize="small" />,
      label: 'Superpositions',
      hasSubmenu: true,
      items: overlays
    }
  ];

  const handleToggle = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{ dense: true }}
      PaperProps={{ sx: { width: 280 } }}
    >
      <MenuItem disabled sx={{ py: 1, backgroundColor: '#f5f5f5' }}>
        <Typography variant="subtitle2" color="primary">
          👁️ Vue cartographique
        </Typography>
      </MenuItem>
      
      {menuItems.map((item, index) => {
        if (item.divider) return <Divider key={`div-${index}`} />;
        
        if (item.hasSubmenu) {
          const isExpanded = expanded[item.label] || false;
          
          return (
            <div key={item.label}>
              <ListItemButton
                onClick={() => handleToggle(item.label)}
                sx={{ py: 0.8 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              
              <Collapse in={isExpanded} timeout="auto">
                <List component="div" disablePadding>
                  {item.items.map((subItem) => (
                    <ListItemButton
                      key={subItem.action}
                      onClick={() => onAction(subItem.action)}
                      sx={{ pl: 6, py: 0.5 }}
                    >
                      <ListItemText 
                        primary={subItem.label}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                      {subItem.checked !== undefined && (
                        <Switch size="small" checked={subItem.checked} />
                      )}
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </div>
          );
        }
        
        return (
          <MenuItem
            key={item.action}
            onClick={() => onAction(item.action)}
            sx={{ py: 0.8 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
            {item.shortcut && (
              <Typography variant="caption" color="text.secondary">
                {item.shortcut}
              </Typography>
            )}
          </MenuItem>
        );
      })}
    </Menu>
  );
};

export default ViewMenu;