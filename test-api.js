const API_URL = 'http://localhost:3000/api/posts';

const logStep = (step) => console.log(`\n--- ${step} ---`);

async function runClient() {
    try {
        // 1. GET Tous les posts
        logStep('1. GET Tous les posts');
        const res1 = await fetch(API_URL);
        const initialPosts = await res1.json();
        console.log('Posts initiaux:', initialPosts);

        // 2. POST Créer un post
        logStep('2. POST Créer un nouveau post');
        const res2 = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'Post de Test',
                content: 'Ceci est un post créé par le script de test.'
            })
        });
        const createdPost = await res2.json();
        console.log('Créé:', createdPost);

        if (!createdPost.id) throw new Error("Échec de la création");

        // 3. GET Un post par ID
        logStep(`3. GET Post avec ID ${createdPost.id}`);
        const res3 = await fetch(`${API_URL}/${createdPost.id}`);
        console.log(await res3.json());

        // 4. PUT Modifier le post
        logStep(`4. PUT Modifier le post ${createdPost.id}`);
        const res4 = await fetch(`${API_URL}/${createdPost.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'Post Modifié',
                content: 'Contenu mis à jour.'
            })
        });
        console.log('Mis à jour:', await res4.json());

        // 5. DELETE Supprimer le post
        logStep(`5. DELETE Supprimer le post ${createdPost.id}`);
        const res5 = await fetch(`${API_URL}/${createdPost.id}`, {
            method: 'DELETE'
        });
        console.log('Statut:', res5.status);

        // 6. Vérification finale
        logStep('6. GET Tous les posts (Final)');
        const res6 = await fetch(API_URL);
        console.log(await res6.json());

    } catch (error) {
        console.error('Erreur dans le script client:', error);
    }
}

setTimeout(runClient, 1000);
