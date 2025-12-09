import React, { useState, useEffect } from "react";

const StatusBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [zoom] = useState(2);
  const [memoryUsage, setMemoryUsage] = useState(0);

  // Mettre à jour l'heure
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simuler des coordonnées aléatoires
  useEffect(() => {
    const interval = setInterval(() => {
      setCoordinates(prev => ({
        lat: parseFloat((prev.lat + (Math.random() - 0.5) * 0.1).toFixed(6)),
        lng: parseFloat((prev.lng + (Math.random() - 0.5) * 0.1).toFixed(6))
      }));
      
      // Simuler l'usage mémoire
      setMemoryUsage(Math.floor(Math.random() * 1000) + 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { weekday: 'short', day: '2-digit', month: 'short' });
  };

  return (
    <div style={{
      height: "32px",
      background: "linear-gradient(90deg, #1a202c 0%, #2d3748 100%)",
      color: "#e2e8f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      fontSize: "12px",
      borderTop: "1px solid #4a5568",
      fontFamily: "monospace",
      boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.2)"
    }}>
      {/* Section gauche - Statut système */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#48bb78",
            boxShadow: "0 0 5px #48bb78"
          }}></div>
          <span style={{ color: "#a0aec0" }}>Prêt</span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ color: "#718096" }}>Mémoire:</span>
          <span style={{ color: "#4299e1" }}>{memoryUsage} MB</span>
        </div>
      </div>

      {/* Section centrale - Informations cartographiques */}
      <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#718096" }}></span>
          <span>
            {coordinates.lat >= 0 ? `${coordinates.lat.toFixed(4)}°N` : `${Math.abs(coordinates.lat).toFixed(4)}°S`}, 
            {coordinates.lng >= 0 ? ` ${coordinates.lng.toFixed(4)}°E` : ` ${Math.abs(coordinates.lng).toFixed(4)}°W`}
          </span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#718096" }}></span>
          <span>Zoom: <strong style={{ color: "#ed8936" }}>{zoom}x</strong></span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#718096" }}></span>
          <span>Échelle: 1:<strong style={{ color: "#38b2ac" }}>{(50000 / zoom).toLocaleString()}</strong></span>
        </div>
      </div>

      {/* Section droite - Date/Heure et projet */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ color: "#718096" }}></span>
          <span>
            {formatDate(currentTime)} | {formatTime(currentTime)}
          </span>
        </div>
        
        <div style={{
          padding: "2px 8px",
          background: "rgba(66, 153, 225, 0.2)",
          borderRadius: "4px",
          border: "1px solid rgba(66, 153, 225, 0.4)",
          color: "#90cdf4"
        }}>
          Joman SIG v1.0
        </div>
        
        <div style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "#48bb78",
          animation: "pulse 2s infinite"
        }}></div>
      </div>
      
      {/* Style pour l'animation de pulsation */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default StatusBar;

