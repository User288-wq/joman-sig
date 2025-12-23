import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Switch,
  Collapse,
  TextField,
  Slider,
  Box,
  Typography,
  Divider,
  Button
} from '@mui/material';
import {
  Layers as LayersIcon,
  Visibility,
  VisibilityOff,
  Edit,
  Delete,
  ExpandMore,
  ExpandLess,
  Add,
  Folder
} from '@mui/icons-material';
import useStore from '../../store';
import './LayersPanel.css';

const LayersPanel = ({ layers }) => {
  const [expandedLayer, setExpandedLayer] = React.useState(null);
  const { updateLayer, removeLayer, addLayer } = useStore();

  const handleToggle = (layerId) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      updateLayer(layerId, { visible: !layer.visible });
    }
  };

  const handleOpacityChange = (layerId, value) => {
    updateLayer(layerId, { opacity: value / 100 });
  };

  const handleLayerClick = (layerId) => {
    setExpandedLayer(expandedLayer === layerId ? null : layerId);
  };

  const handleAddLayer = () => {
    const newLayer = {
      id: `layer-${Date.now()}`,
      name: `Nouvelle couche ${layers.filter(l => l.type === 'vector').length + 1}`,
      type: 'vector',
      visible: true,
      opacity: 0.8,
      source: { type: 'geojson', data: null }
    };
    addLayer(newLayer);
  };

  const getLayerIcon = (type) => {
    switch (type) {
      case 'base': return <LayersIcon color="primary" />;
      case 'vector': return <Folder color="secondary" />;
      default: return <LayersIcon />;
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* En-tête */}
      <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Gestion des couches
        </Typography>
        <Button
          size="small"
          startIcon={<Add />}
          onClick={handleAddLayer}
          variant="outlined"
        >
          Ajouter
        </Button>
      </Box>
      
      <Divider sx={{ mb: 1 }} />

      {/* Liste des couches */}
      <List sx={{ flexGrow: 1, overflow: 'auto' }}>
        {layers.map((layer) => (
          <React.Fragment key={layer.id}>
            <ListItem
              button
              onClick={() => handleLayerClick(layer.id)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ListItemIcon>
                {getLayerIcon(layer.type)}
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {layer.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({layer.type})
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {layer.source.type}
                  </Typography>
                }
              />
              <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => handleToggle(layer.id)}
                  title={layer.visible ? 'Masquer' : 'Afficher'}
                >
                  {layer.visible ? <Visibility /> : <VisibilityOff />}
                </IconButton>
                <Switch
                  size="small"
                  checked={layer.visible}
                  onChange={() => handleToggle(layer.id)}
                />
                {expandedLayer === layer.id ? <ExpandLess /> : <ExpandMore />}
              </ListItemSecondaryAction>
            </ListItem>

            {/* Détails de la couche (expandable) */}
            <Collapse in={expandedLayer === layer.id} timeout="auto" unmountOnExit>
              <Box sx={{ pl: 7, pr: 2, pb: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Opacité
                  </Typography>
                  <Slider
                    size="small"
                    value={layer.opacity * 100}
                    onChange={(e, value) => handleOpacityChange(layer.id, value)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}%`}
                    sx={{ width: '100%' }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size="small" title="Éditer">
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    title="Supprimer"
                    onClick={() => removeLayer(layer.id)}
                    color="error"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                  <TextField
                    size="small"
                    label="Nom"
                    value={layer.name}
                    onChange={(e) => updateLayer(layer.id, { name: e.target.value })}
                    sx={{ flexGrow: 1 }}
                  />
                </Box>
              </Box>
            </Collapse>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      {/* Statistiques */}
      <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          Statistiques
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography variant="body2">
            Couches: {layers.length}
          </Typography>
          <Typography variant="body2">
            Visibles: {layers.filter(l => l.visible).length}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LayersPanel;
