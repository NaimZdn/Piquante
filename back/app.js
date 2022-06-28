// On importe dotenv qui va nous permettre de créer des variables d'environnement afin de masquer certaines informations confidentielles 
require('dotenv').config();
const express = require ('express'); 
const app = express(); 
const mongoose = require('mongoose'); 
const path = require('path');

// On importe les routes des sauces et du user afin de pouvoir les afficher sur le front de notre application 
const userRoutes = require('./routes/user-router');
const sauceRoutes = require('./routes/sauce-router');

// Création de la variable d'environnement permettant de masquer l'URL de connexion à la base de données 
const dbUrl = process.env.DB_URL;

// Schéma de connexion à mongoose qui est la base de données de notre back-end. 
mongoose.connect(dbUrl,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Implantation du schéma CORS pour que les appels HTTP entre des serveurs différents ne soient pas bloqués 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
 
// Permet de gérer les requêtes POST venant du front-end en y récupérant le corps JSON
app.use(express.json());

// On ajoute l'URL, la route sur notre API, l'application front va faire des requêtes à cette URL pour récupérer l'image, les identifiants et les différentes sauces 
app.use ('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes); 
app.use('/api/sauces', sauceRoutes);

// On export l'app afin de l'utiliser dans le server.js afin qu'elle se lance en même temps que le serveur
module.exports = app; 