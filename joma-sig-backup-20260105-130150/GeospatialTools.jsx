// À la fin du fichier, avant export default, ajoutez :

const OperationsTool = () => {
  const [operation, setOperation] = useState('buffer');
  const [inputGeometry, setInputGeometry] = useState('');
  const [bufferDistance, setBufferDistance] = useState(1);
  const [result, setResult] = useState('');
  const { createBuffer } = useGeospatial();

  const handleOperation = () => {
    try {
      const geometry = JSON.parse(inputGeometry);
      
      if (operation === 'buffer') {
        const buffered = createBuffer(geometry, bufferDistance);
        setResult(JSON.stringify(buffered, null, 2));
      }
    } catch (err) {
      alert(`Erreur: ${err.message}`);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Opérations géospatiales
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Opération</InputLabel>
            <Select value={operation} onChange={(e) => setOperation(e.target.value)} label="Opération">
              <MenuItem value="buffer">Buffer</MenuItem>
              <MenuItem value="union">Union</MenuItem>
              <MenuItem value="intersection">Intersection</MenuItem>
              <MenuItem value="difference">Différence</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Géométrie d'entrée (GeoJSON)"
            value={inputGeometry}
            onChange={(e) => setInputGeometry(e.target.value)}
            placeholder='{"type": "Point", "coordinates": [2.3522, 48.8566]}'
          />
        </Grid>
        
        {operation === 'buffer' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Distance du buffer"
              value={bufferDistance}
              onChange={(e) => setBufferDistance(parseFloat(e.target.value))}
              InputProps={{ endAdornment: 'km' }}
            />
          </Grid>
        )}
        
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleOperation}>
            Exécuter l'opération
          </Button>
        </Grid>
        
        {result && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="subtitle2" gutterBottom>
                Résultat:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {result}
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

const ProcessingTool = () => {
  const [processType, setProcessType] = useState('simplify');
  const [tolerance, setTolerance] = useState(0.01);
  const [inputData, setInputData] = useState('');
  const [result, setResult] = useState('');

  const handleProcess = () => {
    try {
      const data = JSON.parse(inputData);
      // Simulation de traitement
      setResult(JSON.stringify({
        message: `Traitement "${processType}" appliqué avec tolérance ${tolerance}`,
        featuresCount: data.features ? data.features.length : 1
      }, null, 2));
    } catch (err) {
      alert(`Erreur: ${err.message}`);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Traitement géospatial
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Type de traitement</InputLabel>
            <Select value={processType} onChange={(e) => setProcessType(e.target.value)} label="Type de traitement">
              <MenuItem value="simplify">Simplification</MenuItem>
              <MenuItem value="smooth">Lissage</MenuItem>
              <MenuItem value="densify">Densification</MenuItem>
              <MenuItem value="clip">Découpage</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        {processType === 'simplify' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Tolérance de simplification"
              value={tolerance}
              onChange={(e) => setTolerance(parseFloat(e.target.value))}
              helperText="Plus la valeur est grande, plus la géométrie sera simplifiée"
            />
          </Grid>
        )}
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Données à traiter (GeoJSON)"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder='{"type": "FeatureCollection", "features": [...]}'
          />
        </Grid>
        
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleProcess}>
            Traiter les données
          </Button>
        </Grid>
        
        {result && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="subtitle2" gutterBottom>
                Résultat du traitement:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {result}
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

// Export final
export default GeospatialTools;