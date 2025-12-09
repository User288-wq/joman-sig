@echo off
echo ========================================
echo   DÉMARRAGE DE JOMAN SIG
echo ========================================
echo.
echo Installation des dépendances...
call npm install

echo.
echo Démarrage de l'application...
echo.
echo Si des erreurs apparaissent :
echo 1. Vérifiez que Node.js est installé
echo 2. Essayez : npm install react react-dom ol
echo 3. Puis : npm start
echo.
echo Appuyez sur une touche pour démarrer...
pause > nul

npm start
