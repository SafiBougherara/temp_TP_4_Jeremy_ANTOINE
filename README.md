# API Posts - Guide Rapide

## 🚀 Démarrer le serveur
```bash
npm start
```
Le serveur démarre sur `http://localhost:3000`

## 🧪 Tester l'API

### Avec le script de test
```bash
node test-api.js
```

### Avec le frontend
Ouvrir dans le navigateur : `http://localhost:3000`

### Avec Postman

**GET** - Tous les posts
```
GET http://localhost:3000/api/posts
```

**GET** - Un post
```
GET http://localhost:3000/api/posts/1
```

**POST** - Créer un post
```
POST http://localhost:3000/api/posts
Content-Type: application/json

{
  "title": "Mon titre",
  "content": "Mon contenu"
}
```

**PUT** - Modifier un post
```
PUT http://localhost:3000/api/posts/1
Content-Type: application/json

{
  "title": "Titre modifié",
  "content": "Contenu modifié"
}
```

**DELETE** - Supprimer un post
```
DELETE http://localhost:3000/api/posts/1
```
