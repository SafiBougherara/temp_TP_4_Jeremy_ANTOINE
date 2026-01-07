import * as postController from '../controllers/postController.js';

const postRouter = async (req, res) => {
    const url = req.url;
    const method = req.method;

    // GET /api/posts - Récupérer tous les posts
    if (url === '/api/posts' && method === 'GET') {
        return postController.getAllPosts(req, res);
    }

    // POST /api/posts - Créer un post
    if (url === '/api/posts' && method === 'POST') {
        return postController.createPost(req, res);
    }

    // Routes avec ID
    const idMatch = url.match(/\/api\/posts\/([0-9]+)/);
    if (idMatch) {
        const id = idMatch[1];

        // GET /api/posts/:id - Récupérer un post
        if (method === 'GET') {
            return postController.getPostById(req, res, id);
        }

        // PUT /api/posts/:id - Modifier un post
        if (method === 'PUT') {
            return postController.updatePost(req, res, id);
        }

        // DELETE /api/posts/:id - Supprimer un post
        if (method === 'DELETE') {
            return postController.deletePost(req, res, id);
        }
    }

    // Route non trouvée
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Route non trouvée" }));
};

export default postRouter;
