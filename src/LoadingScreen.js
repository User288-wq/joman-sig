// components/LoadingScreen.js
import React, { useState, useEffect } from "react";

function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      textAlign: "center", 
      marginTop: "50px",
      fontFamily: "Arial, sans-serif" 
    }}>
      <h1 style={{ color: "#2c3e50" }}>Application Cartographie SIG</h1>
      <p style={{ color: "#666" }}>Installation des dÃƒÂ©pendances en cours...</p>
      
      {/* Barre de progression */}
      <div style={{
        margin: "30px auto",
        width: "300px",
        height: "20px",
        backgroundColor: "#ecf0f1",
        borderRadius: "10px",
        overflow: "hidden"
      }}>
        <div style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: "#3498db",
          transition: "width 0.3s ease"
        }}></div>
      </div>
      
      <div style={{
        margin: "30px auto",
        padding: "20px",
        backgroundColor: "#f0f8ff",
        borderRadius: "10px",
        maxWidth: "500px",
        border: "2px solid #3498db"
      }}>
        <h3 style={{ color: "#2c3e50" }}>Prochaines ÃƒÂ©tapes :</h3>
        <ol style={{ textAlign: "left", display: "inline-block" }}>
          <li>{progress >= 10 ? "Ã¢Å“â€¦" : "Ã°Å¸â€â€ž"} Installation de React...</li>
          <li>{progress >= 40 ? "Ã¢Å“â€¦" : "Ã°Å¸â€â€ž"} Installation de Leaflet...</li>
          <li>{progress >= 70 ? "Ã¢Å“â€¦" : "Ã°Å¸â€â€ž"} Chargement des tuiles...</li>
          <li>{progress >= 100 ? "Ã¢Å“â€¦" : "Ã°Å¸â€â€ž"} Lancement de la carte...</li>
        </ol>
      </div>
      
      {progress === 100 && (
        <p style={{ color: "#27ae60", fontWeight: "bold" }}>
          PrÃƒÂªt ! Chargement de la carte...
        </p>
      )}
    </div>
  );
}

export default LoadingScreen;