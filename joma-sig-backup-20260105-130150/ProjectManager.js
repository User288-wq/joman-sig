// src/components/menus/ProjectMenu.jsx
import React from 'react';
import {
  Menu, MenuItem, ListItemIcon, ListItemText, Divider,
  Typography
} from '@mui/material';
import {
  Dashboard, CreateNewFolder, FolderOpen, Save, SaveAs,
  Cloud, History, Settings, Description, Share
} from '@mui/icons-material';

const ProjectMenu = ({ anchorEl, open, onClose, onAction }) => {
  const menuItems = [
    {
      icon: <CreateNewFolder />,
      label: 'Nouveau projet JOMA',
      action: 'joma-new-project',
      shortcut: 'Ctrl+Shift+N',
      description: 'Créer un projet SIG vierge'
    },
    {
      icon: <FolderOpen />,
      label: 'Ouvrir projet...',
      action: 'joma-open-project',
      shortcut: 'Ctrl+O',
      description: 'Ouvrir un projet .jomaproject'
    },
    {
      icon: <Save />,
      label: 'Enregistrer projet',
      action: 'joma-save-project',
      shortcut: 'Ctrl+S'
    },
    {
      icon: <SaveAs />,
      label: 'Enregistrer sous...',
      action: 'joma-save-as',
      shortcut: 'Ctrl+Shift+S'
    },
    { divider: true },
    {
      icon: <Cloud />,
      label: 'Projets cloud',
      action: 'joma-cloud',
      submenu: [
        { label: 'Synchroniser', action: 'joma-sync' },
        { label: 'Ouvrir depuis cloud', action: 'joma-cloud-open' },
        { label: 'Partager projet', action: 'joma-share' }
      ]
    },
    {
      icon: <History />,
      label: 'Historique projet',
      action: 'joma-history',
      description: 'Versions précédentes'
    },
    { divider: true },
    {
      icon: <Description />,
      label: 'Propriétés du projet',
      action: 'joma-properties',
      shortcut: 'Alt+Enter'
    },
    {
      icon: <Settings />,
      label: 'Configuration JOMA',
      action: 'joma-settings',
      description: 'Préférences générales'
    },
    { divider: true },
    {
      icon: <Share />,
      label: 'Exporter projet',
      action: 'joma-export',
      submenu: [
        { label: 'En PDF', action: 'export-pdf' },
        { label: 'En image', action: 'export-image' },
        { label: 'En package', action: 'export-package' },
        { label: 'En template', action: 'export-template' }
      ]
    }
  ];

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{ dense: true }}
      PaperProps={{
        sx: { 
          width: 360,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }
      }}
    >
      <MenuItem disabled sx={{ py: 1, backgroundColor: '#f5f5f5' }}>
        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
          📁 Gestion de projet JOMA
        </Typography>
      </MenuItem>
      
      {menuItems.map((item, index) => (
        item.divider ? (
          <Divider key={`divider-${index}`} />
        ) : (
          <MenuItem 
            key={item.action}
            onClick={() => onAction(item.action)}
            sx={{ 
              py: 1.2,
              borderLeft: '3px solid transparent',
              '&:hover': {
                borderLeft: '3px solid #1a237e',
                backgroundColor: '#f0f4ff'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: '#1a237e' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              secondary={item.description}
              primaryTypographyProps={{ 
                variant: 'body2',
                fontWeight: 500 
              }}
              secondaryTypographyProps={{ 
                variant: 'caption',
                color: 'text.secondary'
              }}
            />
            {item.shortcut && (
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  ml: 2,
                  fontFamily: 'monospace',
                  backgroundColor: '#f5f5f5',
                  px: 1,
                  py: 0.2,
                  borderRadius: 1
                }}
              >
                {item.shortcut}
              </Typography>
            )}
          </MenuItem>
        )
      ))}
    </Menu>
  );
};

export default ProjectMenu;