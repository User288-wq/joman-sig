// vite-dev.js - Serveur de développement rapide
import { createServer } from 'vite';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function startDevServer() {
  const app = express();
  
  // Créez le serveur Vite
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
    root: __dirname,
  });

  // Utilisez le middleware Vite
  app.use(vite.middlewares);

  // Toutes les requêtes servent index.html
  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;
      let template = await vite.transformIndexHtml(url, '<div id="root"></div>');
      
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  app.listen(3000, () => {
    console.log(' Serveur de développement Vite démarré sur http://localhost:3000');
  });
}

startDevServer().catch(console.error);
