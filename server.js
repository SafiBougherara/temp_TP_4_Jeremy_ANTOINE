import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import postRouter from './routers/postRouter.js';
import logger from './middlewares/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Appliquer le middleware de journalisation
    logger(req, res, () => {
        // CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        // Servir les fichiers statiques du dossier public
        if (req.url === '/' || req.url.startsWith('/index.html')) {
            const filePath = path.join(__dirname, 'public', 'index.html');
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end('Page non trouvée');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                }
            });
            return;
        }

        // Servir le fichier CSS
        if (req.url === '/styles.css') {
            const filePath = path.join(__dirname, 'public', 'styles.css');
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end('Fichier non trouvé');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/css' });
                    res.end(data);
                }
            });
            return;
        }

        // Router API
        if (req.url.startsWith('/api/posts')) {
            postRouter(req, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Route inconnue" }));
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server Exercise 5 running at http://localhost:${PORT}/`);
});
