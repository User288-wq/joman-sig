import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AppBar, Toolbar, Button,
  Typography, Box, IconButton, Chip
} from "@mui/material";
import {
  Folder, Edit, Visibility, Layers,
  Build, Language, Help,
  Map, Dashboard, Analytics, Settings
} from "@mui/icons-material";

import LanguageSwitcher from "../../i18n/LanguageSwitcher";
import FileMenu from "../menus/FileMenu";
import LayerMenu from "../menus/LayerMenu";
import PlaceholderMenu from "../menus/PlaceholderMenu";
import ViewMenu from "../menus/ViewMenu";
import EditMenu from "../menus/EditMenu";

const JomaMenuBar = ({ onMenuAction = (action) => console.log('Action:', action), projectStatus = "draft", projectName = "Sans titre" }) => {
  const { t } = useTranslation();
  const [activeMenu, setActiveMenu] = useState(null);

  // Menus disponibles seulement
  const menus = [
    { id: "file", label: t("menu.file"), icon: <Folder />, component: FileMenu },
    { id: "edit", label: t("menu.edit"), icon: <Edit />, component: PlaceholderMenu, props: { title: "Édition" } },
    { id: "view", label: t("menu.view"), icon: <Visibility />, component: ViewMenu },
    { id: "layers", label: t("menu.layers"), icon: <Layers />, component: LayerMenu },
    { id: "analysis", label: t("menu.analysis"), icon: <Analytics />, component: PlaceholderMenu, props: { title: "Analyse" } },
    { id: "processing", label: t("menu.processing"), icon: <Build />, component: PlaceholderMenu, props: { title: "Traitement" } },
    { id: "web", label: t("menu.web"), icon: <Language />, component: PlaceholderMenu, props: { title: "Web" } },
    { id: "help", label: t("menu.help"), icon: <Help />, component: PlaceholderMenu, props: { title: "Aide" } }
  ];

  // Statut du projet avec traductions
  const statusColors = {
    draft: "default",
    active: "success",
    saved: "info",
    error: "error"
  };

  const statusLabels = {
    draft: t("status.draft"),
    active: t("status.active"),
    saved: t("status.saved"),
    error: t("status.error")
  };

  const handleMenuOpen = (event, menuId) => {
    setActiveMenu({ anchor: event.currentTarget, id: menuId });
  };

  const handleMenuClose = () => {
    setActiveMenu(null);
  };

  const handleAction = (action) => {
    if (onMenuAction) {
      onMenuAction(action);
    }
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
        {...(menuConfig.props || {})}
      />
    );
  };

  return (
    <AppBar 
      position="static" 
      color="transparent" 
      elevation={0}
      sx={{ 
        borderBottom: "1px solid #e0e0e0",
        background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
        width: "100%"
      }}
    >
      <Toolbar variant="dense" sx={{ minHeight: 48, px: 1, justifyContent: "space-between" }}>
        {/* Logo JOMA */}
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
        
        {/* Menus principaux */}
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
                },
                "& .MuiButton-startIcon": {
                  mr: 0.5
                }
              }}
            >
              {menu.label}
            </Button>
          ))}
        </Box>

        {/* Indicateurs d'état et contrôles */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Statut du projet */}
          <Chip 
            label={`${projectName} - ${statusLabels[projectStatus] || statusLabels.draft}`}
            size="small"
            color={statusColors[projectStatus] || "default"}
            sx={{ 
              height: 24,
              fontSize: "0.7rem",
              fontWeight: 500,
              backgroundColor: "rgba(255,255,255,0.15)",
              color: "white",
              maxWidth: 200,
              "& .MuiChip-label": {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }
            }}
          />
          
          {/* Informations cartographiques */}
          <Typography 
            variant="caption" 
            sx={{ 
              color: "rgba(255,255,255,0.7)",
              fontFamily: "monospace",
              fontSize: "0.7rem"
            }}
          >
            EPSG:3857 | {t("status.scale")}: 1:10,000
          </Typography>
          
          {/* Sélecteur de langue */}
          <LanguageSwitcher />
          
          {/* Bouton de configuration */}
          <IconButton 
            size="small" 
            sx={{ 
              color: "rgba(255,255,255,0.9)",
              "&:hover": { 
                color: "#fff",
                backgroundColor: "rgba(255, 255, 255, 0.1)"
              }
            }}
            onClick={() => onMenuAction("settings:open")}
          >
            <Settings fontSize="small" />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Rendu des menus déroulants */}
      {menus.map((menu) => renderMenu(menu.id))}
    </AppBar>
  );
};

export default JomaMenuBar;




