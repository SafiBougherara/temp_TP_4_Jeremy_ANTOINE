import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/postData.json');

// Fonction utilitaire pour parser le corps de la requête
const getBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                reject(e);
            }
        });
    });
};

// Lire tous les posts depuis le fichier
const readPosts = async () => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur lecture fichier:', error);
        return [];
    }
};

// Écrire les posts dans le fichier
const writePosts = async (posts) => {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), 'utf-8');
    } catch (error) {
        console.error('Erreur écriture fichier:', error);
        throw error;
    }
};

// GET /api/posts - Récupérer tous les posts
export const getAllPosts = async (req, res) => {
    try {
        const posts = await readPosts();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(posts));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Erreur serveur" }));
    }
};

// GET /api/posts/:id - Récupérer un post par ID
export const getPostById = async (req, res, id) => {
    try {
        const posts = await readPosts();
        const post = posts.find(p => p.id === parseInt(id));

        if (!post) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Post non trouvé" }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(post));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Erreur serveur" }));
    }
};

// POST /api/posts - Créer un post
export const createPost = async (req, res) => {
    try {
        const body = await getBody(req);

        if (!body.title || !body.content) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Titre et contenu requis" }));
            return;
        }

        const posts = await readPosts();
        const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;

        const newPost = {
            id: newId,
            title: body.title,
            content: body.content
        };

        posts.push(newPost);
        await writePosts(posts);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newPost));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Erreur serveur" }));
    }
};

// PUT /api/posts/:id - Modifier un post
export const updatePost = async (req, res, id) => {
    try {
        const body = await getBody(req);
        const posts = await readPosts();
        const postIndex = posts.findIndex(p => p.id === parseInt(id));

        if (postIndex === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Post non trouvé" }));
            return;
        }

        posts[postIndex] = {
            ...posts[postIndex],
            title: body.title || posts[postIndex].title,
            content: body.content || posts[postIndex].content
        };

        await writePosts(posts);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(posts[postIndex]));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Erreur serveur" }));
    }
};

// DELETE /api/posts/:id - Supprimer un post
export const deletePost = async (req, res, id) => {
    try {
        const posts = await readPosts();
        const postIndex = posts.findIndex(p => p.id === parseInt(id));

        if (postIndex === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Post non trouvé" }));
            return;
        }

        posts.splice(postIndex, 1);
        await writePosts(posts);

        res.writeHead(204);
        res.end();
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Erreur serveur" }));
    }
};
