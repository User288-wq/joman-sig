# Script d'installation simple pour JOMA SIG
Write-Host " Installation des dépendances JOMA SIG..." -ForegroundColor Cyan

# Liste des dépendances - une par ligne pour éviter les problèmes
$packages = @(
    "react",
    "react-dom", 
    "react-i18next",
    "i18next",
    "ol",
    "openlayers",
    "proj4",
    "@mui/material",
    "@mui/icons-material",
    "@emotion/react",
    "@emotion/styled",
    "axios",
    "lodash",
    "uuid",
    "react-hotkeys-hook",
    "react-toastify",
    "file-saver",
    "papaparse",
    "turf"
)

Write-Host "
Installing main dependencies..." -ForegroundColor Yellow
foreach ($package in $packages) {
    Write-Host "   Installing $package" -ForegroundColor Gray
    npm install $package
}

# Dépendances de développement
$devPackages = @(
    "@types/react",
    "@types/react-dom",
    "@types/lodash",
    "@types/uuid",
    "@types/proj4",
    "typescript",
    "@craco/craco",
    "webpack",
    "webpack-cli",
    "eslint",
    "prettier"
)

Write-Host "
Installing dev dependencies..." -ForegroundColor Yellow
foreach ($package in $devPackages) {
    Write-Host "   Installing $package" -ForegroundColor Gray
    npm install --save-dev $package
}

Write-Host "
 Dépendances installées avec succès !" -ForegroundColor Green
