// src/components/tools/NetworkAnalysisTool.jsx
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Tabs, Tab, Box, TextField, Button, Grid,
  Typography, Alert, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { useGeospatial } from '../../contexts/GeospatialContext';

const NetworkAnalysisTool = ({ open, onClose, networkData }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [startNode, setStartNode] = useState('');
  const [endNode, setEndNode] = useState('');
  const [maxDistance, setMaxDistance] = useState(1000);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  
  const { networkAnalysis } = useGeospatial();

  const handleShortestPath = () => {
    try {
      setError('');
      if (!networkData) {
        throw new Error('Aucun réseau chargé');
      }
      
      const network = networkAnalysis.createNetwork(networkData);
      const result = networkAnalysis.shortestPath(network, startNode, endNode);
      
      setResults({
        type: 'shortest_path',
        data: result,
        network: network.toGeoJSON()
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleIsochrone = () => {
    try {
      setError('');
      if (!networkData) {
        throw new Error('Aucun réseau chargé');
      }
      
      const network = networkAnalysis.createNetwork(networkData);
      const result = networkAnalysis.calculateIsochrone(network, startNode, maxDistance);
      
      setResults({
        type: 'isochrone',
        data: result,
        network: network.toGeoJSON()
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const renderResults = () => {
    if (!results) return null;
    
    switch(results.type) {
      case 'shortest_path':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Plus court chemin
            </Typography>
            <Typography>
              Distance: {results.data.distance.toFixed(2)} unités
            </Typography>
            <Typography>
              Nombre d'étapes: {results.data.path.length}
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>
              Chemin:
            </Typography>
            <Paper sx={{ p: 1, bgcolor: '#f5f5f5', maxHeight: 200, overflow: 'auto' }}>
              {results.data.path.join(' → ')}
            </Paper>
          </Box>
        );
        
      case 'isochrone':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Isochrone
            </Typography>
            <Typography>
              Nœuds accessibles: {results.data.accessibleNodes.length}
            </Typography>
            <Typography>
              Distance maximale: {maxDistance} unités
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nœud</TableCell>
                    <TableCell>Distance</TableCell>
                    <TableCell>X</TableCell>
                    <TableCell>Y</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.data.accessibleNodes.slice(0, 10).map((node, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{node.nodeId}</TableCell>
                      <TableCell>{node.distance.toFixed(2)}</TableCell>
                      <TableCell>{node.coordinates[0].toFixed(4)}</TableCell>
                      <TableCell>{node.coordinates[1].toFixed(4)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
        
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Analyse de Réseau
      </DialogTitle>
      
      <DialogContent>
        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} sx={{ mb: 2 }}>
          <Tab label="Plus court chemin" />
          <Tab label="Isochrone" />
          <Tab label="Voyageur de commerce" />
        </Tabs>
        
        {activeTab === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nœud de départ"
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                placeholder="node_1"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nœud d'arrivée"
                value={endNode}
                onChange={(e) => setEndNode(e.target.value)}
                placeholder="node_10"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleShortestPath}>
                Calculer le plus court chemin
              </Button>
            </Grid>
          </Grid>
        )}
        
        {activeTab === 1 && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nœud de départ"
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                placeholder="node_1"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Distance maximale"
                type="number"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleIsochrone}>
                Calculer l'isochrone
              </Button>
            </Grid>
          </Grid>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        
        {results && (
          <Box sx={{ mt: 3 }}>
            {renderResults()}
          </Box>
        )}
        
        {networkData && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Réseau chargé: {networkData.length} segments
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
        {results && (
          <Button 
            variant="contained" 
            onClick={() => {
              // Exporter les résultats
              console.log('Exporting results:', results);
            }}
          >
            Exporter les résultats
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default NetworkAnalysisTool;