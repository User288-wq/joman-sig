import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box
} from "@mui/material";
import {
  Translate,
  Language
} from "@mui/icons-material";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const languages = [
    { code: "fr", name: "Français", flag: "" },
    { code: "en", name: "English", flag: "" },
    { code: "es", name: "Español", flag: "" },
    { code: "de", name: "Deutsch", flag: "" },
    { code: "it", name: "Italiano", flag: "" }
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleClose();
    localStorage.setItem("joma-language", lng);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          color: "rgba(255,255,255,0.9)",
          "&:hover": {
            color: "#fff",
            backgroundColor: "rgba(255, 255, 255, 0.1)"
          }
        }}
      >
        <Language fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            minWidth: 150,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
          }
        }}
      >
        <MenuItem disabled sx={{ 
          py: 1, 
          backgroundColor: "primary.main",
          color: "white",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8
        }}>
          <Translate sx={{ mr: 1, fontSize: "small" }} />
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {t("language.select")}
          </Typography>
        </MenuItem>

        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            selected={language.code === currentLanguage.code}
            sx={{
              py: 1,
              "&.Mui-selected": {
                backgroundColor: "primary.light",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.main"
                }
              }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <Typography variant="body2" sx={{ mr: 2, fontSize: "1.2rem" }}>
                {language.flag}
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {language.name}
              </Typography>
              {language.code === currentLanguage.code && (
                <Typography variant="caption" color="primary">
                  
                </Typography>
              )}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
