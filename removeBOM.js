const fs = require('fs');
const path = require('path');

// Fonction pour parcourir tous les fichiers d'un dossier
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

// Supprimer le BOM si présent
function removeBOM(filePath) {
  const ext = path.extname(filePath);
  if (ext === '.js' || ext === '.jsx') {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`BOM removed: ${filePath}`);
    }
  }
}

// Lancer le nettoyage sur le dossier src
const projectDir = path.join(__dirname, 'src');
walkDir(projectDir, removeBOM);

console.log('BOM cleanup completed!');
