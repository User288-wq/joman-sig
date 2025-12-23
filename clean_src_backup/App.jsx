import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import './styles/App.css';

// Composants UI
import MenuBar from "./components/ui/MenuBar";
import Sidebar from "./components/ui/Sidebar";
import Toolbar from "./components/ui/Toolbar";
import StatusBar from "./components/ui/StatusBar";

// Composants Carte
import MapContainer from "./components/map/MapContainer";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  }
});

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <MenuBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          {sidebarOpen && (
            <Sidebar width={300}>
              <div style={{ padding: '20px' }}>
                <h3>Couches cartographiques</h3>
                <p>Panel des couches à venir...</p>
              </div>
            </Sidebar>
          )}
          
          <Box sx={{ flexGrow: 1, position: 'relative' }}>
            <Toolbar />
            <MapContainer 
              center={[2.3522, 48.8566]}
              zoom={10}
            />
          </Box>
        </Box>
        
        <StatusBar />
      </Box>
    </ThemeProvider>
  );
}

export default App;
