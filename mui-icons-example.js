// Exemple d'imports Material-UI pour votre App.js
import React from "react";

// ===== ICÔNES ESSENTIELLES POUR SIG =====
// Navigation et fichiers
import MenuIcon from '@mui/icons-material/Menu';
import FileOpen from '@mui/icons-material/FileOpen';
import Save from '@mui/icons-material/Save';
import SaveAs from '@mui/icons-material/SaveAs';
import Download from '@mui/icons-material/Download';
import Upload from '@mui/icons-material/Upload';

// Vue et carte
import ZoomIn from '@mui/icons-material/ZoomIn';
import ZoomOut from '@mui/icons-material/ZoomOut';
import Map from '@mui/icons-material/Map';
import Public from '@mui/icons-material/Public';
import Terrain from '@mui/icons-material/Terrain';
import ThreeDRotation from '@mui/icons-material/ThreeDRotation';
import MyLocation from '@mui/icons-material/MyLocation';
import NearMe from '@mui/icons-material/NearMe';

// Couches et données
import Layers from '@mui/icons-material/Layers';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FilterList from '@mui/icons-material/FilterList';
import DataArray from '@mui/icons-material/DataArray';
import TableChart from '@mui/icons-material/TableChart';

// Outils et traitement
import Edit from '@mui/icons-material/Edit';
import CropSquare from '@mui/icons-material/CropSquare';
import Delete from '@mui/icons-material/Delete';
import Analytics from '@mui/icons-material/Analytics';
import Database from '@mui/icons-material/Database';
import ImportExport from '@mui/icons-material/ImportExport';

// Affichage
import GridOn from '@mui/icons-material/GridOn';
import GridOff from '@mui/icons-material/GridOff';
import Scale from '@mui/icons-material/Scale';

// ===== EXEMPLE D'UTILISATION =====
function ExampleComponent() {
  return (
    <div>
      {/* Barre d'outils */}
      <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
        <button>
          <ZoomIn /> Zoom +
        </button>
        <button>
          <ZoomOut /> Zoom -
        </button>
        <button>
          <CropSquare /> Découper
        </button>
        <button>
          <Delete /> Supprimer
        </button>
        <button>
          <Layers /> Couches
        </button>
        <button>
          <Map /> Carte
        </button>
      </div>
      
      {/* Indicateurs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Save color="success" /> Projet sauvegardé
        <MyLocation color="primary" /> Position actuelle
        <Visibility color="action" /> 5 couches visibles
      </div>
    </div>
  );
}

export default ExampleComponent;
