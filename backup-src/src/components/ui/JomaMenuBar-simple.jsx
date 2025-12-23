// src/components/ui/JomaMenuBar-simple.jsx - Version corrigée
import React from "react";
import { AppBar, Toolbar, Button, Typography, Box, Chip } from "@mui/material";
import { Map } from "@mui/icons-material";

const JomaMenuBar = ({ onMenuAction, projectStatus = "draft" }) => {
  const menus = ["Projet", "Fichier", "Edition", "Vue", "Couches", "Analyse", "Traitements", "Vecteur", "Raster", "Donnees", "Web", "Config", "Aide"];

  return (
    <AppBar position="static" style={{ background: "#1a237e" }}>
      <Toolbar variant="dense" style={{ minHeight: 40 }}>
        <Box style={{ display: "flex", alignItems: "center", marginRight: 20 }}>
          <Map style={{ color: "white", marginRight: 8 }} />
          <Typography variant="h6" style={{ color: "white", fontWeight: "bold" }}>
            JOMA SIG
          </Typography>
        </Box>
        
        <Box style={{ display: "flex", flexGrow: 1 }}>
          {menus.map((menu) => (
            <Button
              key={menu}
              style={{
                color: "white",
                textTransform: "none",
                fontSize: "0.8rem",
                margin: "0 2px"
              }}
              onClick={() => onMenuAction && onMenuAction(menu.toLowerCase())}
            >
              {menu}
            </Button>
          ))}
        </Box>
        
        <Chip 
          label={projectStatus === "draft" ? "Brouillon" : "Sauvegarde"}
          size="small"
          style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default JomaMenuBar;  // IMPORTANT: export par défaut
