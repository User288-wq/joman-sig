// src/components/tools/GeospatialTools.jsx
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Tabs, Tab, Box, TextField, Button, FormControl,
  InputLabel, Select, MenuItem, Grid, Paper,
  Typography, Alert, Divider, Switch, FormControlLabel
} from '@mui/material';
import { useGeospatial } from '../../contexts/GeospatialContext';

const GeospatialTools = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [inputGeoJSON, setInputGeoJSON] = useState('');
  const [inputWKT, setInputWKT] = useState('');
  const [conversionResult, setConversionResult] = useState('');
  const [error, setError] = useState('');
  
  const { convertGeoJSONToWKT, convertWKTToGeoJSON } = useGeospatial();

  const handleGeoJSONToWKT = () => {
    try {
      setError('');
      const geojson = JSON.parse(inputGeoJSON);
      const wkt = convertGeoJSONToWKT(geojson);
      setConversionResult(wkt);
    } catch (err) {
      setError(`Erreur: ${err.message}`);
    }
  };

  const handleWKTToGeoJSON = () => {
    try {
      setError('');
      const geojson = convertWKTToGeoJSON(inputWKT);
      setConversionResult(JSON.stringify(geojson, null, 2));
    } catch (err) {
      setError(`Erreur: ${err.message}`);
    }
  };

  const tabs = [
    { label: 'Conversion', component: <ConversionTool /> },
    { label: 'Calculs', component: <CalculationTool /> },
    { label: 'Opérations', component: <OperationsTool /> },
    { label: 'Traitement', component: <ProcessingTool /> },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Outils Géospatiales JOMA
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Box>
        
        <Box sx={{ mt: 2 }}>
          {tabs[activeTab].component}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};

// Sous-composants pour chaque onglet
const ConversionTool = () => {
  const [inputGeoJSON, setInputGeoJSON] = useState('');
  const [inputWKT, setInputWKT] = useState('');
  const [conversionResult, setConversionResult] = useState('');
  const [error, setError] = useState('');
  
  const { convertGeoJSONToWKT, convertWKTToGeoJSON } = useGeospatial();

  const handleGeoJSONToWKT = () => {
    try {
      setError('');
      const geojson = JSON.parse(inputGeoJSON);
      const wkt = convertGeoJSONToWKT(geojson);
      setConversionResult(wkt);
    } catch (err) {
      setError(`Erreur: ${err.message}`);
    }
  };

  const handleWKTToGeoJSON = () => {
    try {
      setError('');
      const geojson = convertWKTToGeoJSON(inputWKT);
      setConversionResult(JSON.stringify(geojson, null, 2));
    } catch (err) {
      setError(`Erreur: ${err.message}`);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          GeoJSON → WKT
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={6}
          value={inputGeoJSON}
          onChange={(e) => setInputGeoJSON(e.target.value)}
          placeholder='{"type": "Point", "coordinates": [2.3522, 48.8566]}'
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleGeoJSONToWKT}
          fullWidth
        >
          Convertir en WKT
        </Button>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          WKT → GeoJSON
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={6}
          value={inputWKT}
          onChange={(e) => setInputWKT(e.target.value)}
          placeholder="POINT (2.3522 48.8566)"
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleWKTToGeoJSON}
          fullWidth
        >
          Convertir en GeoJSON
        </Button>
      </Grid>
      
      {error && (
        <Grid item xs={12}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}
      
      {conversionResult && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle2" gutterBottom>
              Résultat:
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
              {conversionResult}
            </Typography>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

const CalculationTool = () => {
  const [point1, setPoint1] = useState('');
  const [point2, setPoint2] = useState('');
  const [distance, setDistance] = useState(null);
  const [unit, setUnit] = useState('km');
  
  const { calculateDistance } = useGeospatial();

  const handleCalculateDistance = () => {
    try {
      const p1 = JSON.parse(point1);
      const p2 = JSON.parse(point2);
      const dist = calculateDistance(p1, p2, unit);
      setDistance(dist);
    } catch (err) {
      alert(`Erreur: ${err.message}`);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Calcul de distance
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Point 1 [lon, lat]"
            value={point1}
            onChange={(e) => setPoint1(e.target.value)}
            placeholder="[2.3522, 48.8566]"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Point 2 [lon, lat]"
            value={point2}
            onChange={(e) => setPoint2(e.target.value)}
            placeholder="[4.8357, 45.7640]"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Unité</InputLabel>
            <Select value={unit} onChange={(e) => setUnit(e.target.value)} label="Unité">
              <MenuItem value="km">Kilomètres</MenuItem>
              <MenuItem value="m">Mètres</MenuItem>
              <MenuItem value="miles">Miles</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleCalculateDistance}>
            Calculer la distance
          </Button>
        </Grid>
        
        {distance !== null && (
          <Grid item xs={12}>
            <Alert severity="info">
              Distance: {distance.toFixed(2)} {unit}
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

// Ajoutez les autres sous-composants de manière similaire...

export default GeospatialTools;