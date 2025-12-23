import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import {
  Layers as LayersIcon,
  Edit as EditIcon,
  Tune as TuneIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import './Sidebar.css';

const Sidebar = ({ activePanel, onPanelChange, width, children }) => {
  const tabs = [
    { value: 'layers', label: 'Couches', icon: <LayersIcon /> },
    { value: 'tools', label: 'Outils', icon: <EditIcon /> },
    { value: 'properties', label: 'Propriétés', icon: <TuneIcon /> },
    { value: 'info', label: 'Infos', icon: <InfoIcon /> }
  ];

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        width: width,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        borderRight: '1px solid #e0e0e0'
      }}
    >
      {/* En-tête */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid #e0e0e0',
        bgcolor: 'primary.main',
        color: 'white'
      }}>
        <Tabs 
          value={activePanel}
          onChange={(e, value) => onPanelChange(value)}
          variant="fullWidth"
          textColor="inherit"
          indicatorColor="secondary"
          sx={{ minHeight: '48px' }}
        >
          {tabs.map(tab => (
            <Tab 
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              iconPosition="start"
              label={tab.label}
              sx={{ 
                minHeight: '48px',
                fontSize: '0.75rem',
                '& .MuiTab-iconWrapper': { mr: 0.5 }
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Contenu */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
        p: 2
      }}>
        {children}
      </Box>

      {/* Pied de sidebar */}
      <Box sx={{ 
        p: 1.5, 
        borderTop: '1px solid #e0e0e0',
        bgcolor: 'grey.50',
        fontSize: '0.75rem',
        color: 'text.secondary'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Projet actif</span>
          <span>100%</span>
        </Box>
      </Box>
    </Paper>
  );
};

export default Sidebar;
