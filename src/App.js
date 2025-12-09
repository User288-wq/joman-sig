import React, { useState, useRef } from "react";
import "./App.css";
import MapView from "./components/map/MapView";
import MenuBar from "./components/ui/MenuBar";
import LayersPanel from "./components/layers/LayersPanel";
import MainToolbar from "./components/tools/MainToolbar";
import MeasureTools from "./components/tools/MeasureTools";
import GeoJSONImporter from "./components/import/GeoJSONImporter";
import AttributeTable from "./components/import/AttributeTable";
import StatusBar from "./components/ui/StatusBar";
import { MapProvider } from "./contexts/MapContext";
import { LayerProvider } from "./contexts/LayerContext";

function App() {
  const [activeTab, setActiveTab] = useState(null);
      const [mapInstance, setMapInstance] = useState(null);
    const [mapViewMode] = useState("2D");
  const [activeWidget, setActiveWidget] = useState(null); // "measure", "import", "table", null // "2D", "3D", "canvas" // "2D", "3D", "canvas"
  const [activeLayers, setActiveLayers] = useState({
    baseMap: true,
    roads: true,
    buildings: false,
    poi: true
  });
  const mapRef = useRef(null);

  const handleMapLoad = (map) => {
    setMapInstance(map);
    if (mapRef.current) {
      mapRef.current = map;
    }
  };

  const toggleLayer = (layerName) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  const appStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
    backgroundColor: "#f0f2f5",
  };

  const mainContentStyle = {
    display: "flex",
    flex: 1,
    overflow: "hidden",
    position: "relative",
  };

  const mapContainerStyle = {
  flex: 1,
  position: "relative",
  overflow: "hidden",
};

const widgetStyle = {
  position: "absolute",
  top: "60px",
  right: "20px",
  zIndex: 1000,
  width: "300px",
  maxHeight: "80vh",
  overflow: "auto",
};

  return (
    <MapProvider>
      <LayerProvider>
        <div className="App" style={appStyle}>
          <MenuBar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div style={mainContentStyle}>
            <LayersPanel activeLayers={activeLayers} toggleLayer={toggleLayer} />      <div style={mapContainerStyle}>
        <MainToolbar map={mapInstance} onWidgetSelect={setActiveWidget} />
        <MapView 
          activeLayers={activeLayers} 
          onMapLoad={handleMapLoad}
          viewMode={mapViewMode}
        />
        
        {/* Widgets ancrables */}
        {activeWidget === "measure" && (
          <div style={widgetStyle}>
            <MeasureTools />
          </div>
        )}
        
        {activeWidget === "import" && (
          <div style={{...widgetStyle, right: "20px", top: "80px"}}>
            <GeoJSONImporter />
          </div>
        )}
        
        {activeWidget === "table" && (
          <div style={{...widgetStyle, right: "20px", top: "80px", width: "400px", height: "500px"}}>
            <AttributeTable />
          </div>
        )}
      </div>
          </div>
          <StatusBar />
        </div>
      </LayerProvider>
    </MapProvider>
  );
}

export default App;


