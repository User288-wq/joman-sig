import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AppBar, Toolbar, Button, Menu, MenuItem, Divider,
  Typography, Box, IconButton, Chip
} from "@mui/material";
import {
  Folder, Edit, Visibility, Layers, Storage,
  Build, Timeline, Image, Language, Help,
  Map, Dashboard, Analytics, Settings
} from "@mui/icons-material";

// IMPORTEZ SEULEMENT LES MENUS QUI EXISTENT
import FileMenu from "../menus/FileMenu";
import EditMenu from "../menus/EditMenu";
import ViewMenu from "../menus/ViewMenu";
import LayerMenu from "../menus/LayerMenu";
import HelpMenu from "../menus/HelpMenu";
import ProjectMenu from "../menus/ProjectMenu";
import LanguageSwitcher from "../../i18n/LanguageSwitcher";

// COMMENTEZ ou SUPPRIMEZ les menus manquants
// import DatabaseMenu from "../menus/DatabaseMenu";
// import ProcessingMenu from "../menus/ProcessingMenu";
// import VectorMenu from "../menus/VectorMenu";
// import RasterMenu from "../menus/RasterMenu";
// import WebMenu from "../menus/WebMenu";
// import AnalysisMenu from "../menus/AnalysisMenu";

const JomaMenuBar = ({ onMenuAction, projectStatus = "draft" }) => {
  const { t } = useTranslation();
  const [activeMenu, setActiveMenu] = useState(null);

  // GARDEZ SEULEMENT LES MENUS QUI EXISTENT
  const menus = [
  { id: "project", label: t("menu.project"), icon: <Dashboard />, component: PlaceholderMenu },
  { id: "file", label: t("menu.file"), icon: <Folder />, component: FileMenu },
  { id: "edit", label: t("menu.edit"), icon: <Edit />, component: PlaceholderMenu },
  { id: "view", label: t("menu.view"), icon: <Visibility />, component: PlaceholderMenu },
  { id: "layers", label: t("menu.layers"), icon: <Layers />, component: LayerMenu },
  { id: "analysis", label: t("menu.analysis"), icon: <Analytics />, component: PlaceholderMenu },
  { id: "processing", label: t("menu.processing"), icon: <Build />, component: PlaceholderMenu },
  { id: "vector", label: t("menu.vector"), icon: <Timeline />, component: PlaceholderMenu },
  { id: "raster", label: t("menu.raster"), icon: <Image />, component: PlaceholderMenu },
  { id: "database", label: t("menu.database"), icon: <Storage />, component: PlaceholderMenu },
  { id: "web", label: t("menu.web"), icon: <Language />, component: PlaceholderMenu },
  { id: "help", label: t("menu.help"), icon: <Help />, component: PlaceholderMenu }
];

  const handleMenuOpen = (event, menuId) => {
    setActiveMenu({ anchor: event.currentTarget, id: menuId });
  };

  const handleMenuClose = () => {
    setActiveMenu(null);
  };

  const handleAction = (action) => {
    onMenuAction(action);
    handleMenuClose();
  };

  const renderMenu = (menuId) => {
    const menuConfig = menus.find(m => m.id === menuId);
    if (!menuConfig?.component) return null;
    
    const MenuComponent = menuConfig.component;
    return (
      <MenuComponent 
        anchorEl={activeMenu?.anchor} 
        open={activeMenu?.id === menuId}
        onClose={handleMenuClose}
        onAction={handleAction}
      />
    );
  };

  const statusColors = {
    draft: "default",
    active: "success",
    saved: "info",
    error: "error"
  };

  return (
    <AppBar 
      position="static" 
      color="transparent" 
      elevation={0}
      sx={{ 
        borderBottom: "1px solid #e0e0e0",
        background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)"
      }}
    >
      <Toolbar variant="dense" sx={{ minHeight: 48, px: 1 }}>
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          mr: 3,
          background: "white",
          borderRadius: 1,
          px: 1.5,
          py: 0.5
        }}>
          <Map sx={{ color: "#1a237e", mr: 1 }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 800,
              background: "linear-gradient(45deg, #1a237e 30%, #3949ab 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px"
            }}
          >
            JOMA
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              ml: 0.5, 
              color: "#5c6bc0",
              fontWeight: 500,
              fontSize: "0.7rem"
            }}
          >
            SIG
          </Typography>
        </Box>
        
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          {menus.map((menu) => (
            <Button
              key={menu.id}
              startIcon={menu.icon}
              onClick={(e) => handleMenuOpen(e, menu.id)}
              sx={{
                textTransform: "none",
                color: activeMenu?.id === menu.id ? "#fff" : "rgba(255,255,255,0.9)",
                fontWeight: activeMenu?.id === menu.id ? 700 : 500,
                borderRadius: 1,
                px: 1.5,
                mx: 0.5,
                fontSize: "0.85rem",
                minWidth: "auto",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: "#fff"
                }
              }}
            >
              {menu.label}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <LanguageSwitcher />
          
          <Chip 
            label={projectStatus === "draft" ? t("status.draft") : t("status.saved")}
            size="small"
            color={statusColors[projectStatus] || "default"}
            sx={{ 
              height: 24,
              fontSize: "0.7rem",
              fontWeight: 500,
              backgroundColor: "rgba(255,255,255,0.15)",
              color: "white"
            }}
          />
          
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
            EPSG:3857 | {t("map.scale")}: 1:10,000
          </Typography>
        </Box>
      </Toolbar>

      {menus.map((menu) => renderMenu(menu.id))}
    </AppBar>
  );
};

export default JomaMenuBar;


