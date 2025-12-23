const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const BUILD_DIR = path.join(__dirname, 'build');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/octet-stream'
};

const server = http.createServer((req, res) => {
  console.log(\`\${req.method} \${req.url}\`);

  // Parse URL
  const parsedUrl = url.parse(req.url);
  let pathname = \`\${BUILD_DIR}\${parsedUrl.pathname}\`;

  // Si c'est un dossier, cherche index.html
  if (pathname.endsWith('/')) {
    pathname += 'index.html';
  }

  // Si pas d'extension, cherche fichier HTML
  if (!path.extname(pathname)) {
    pathname += '.html';
  }

  // Vérifie si le fichier existe
  fs.exists(pathname, (exists) => {
    if (!exists) {
      // Si non trouvé, sert index.html (pour React Router)
      pathname = path.join(BUILD_DIR, 'index.html');
    }

    // Lit le fichier
    fs.readFile(pathname, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end(\`Erreur: \${err}\`);
      } else {
        // Détermine le type MIME
        const ext = path.extname(pathname);
        const contentType = MIME_TYPES[ext] || 'text/plain';
        
        res.setHeader('Content-Type', contentType);
        res.end(data);
      }
    });
  });
});

server.listen(PORT, 'localhost', () => {
  console.log(\`\n🚀 JOMA SIG est en ligne !\`);
  console.log(\`📂 Dossier: \${BUILD_DIR}\`);
  console.log(\`🌐 URL: http://localhost:\${PORT}\`);
  console.log(\`📱 Réseau: http://${getLocalIP()}:\${PORT}\`);
  console.log(\`\nAppuyez sur Ctrl+C pour arrêter\n\`);
});

function getLocalIP() {
  const interfaces = require('os').networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}
