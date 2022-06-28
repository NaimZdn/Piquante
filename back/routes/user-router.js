//Utilisation d'express afin de configurer nos routes API.
const express = require('express'); 
const router = express.Router(); 

// Utilisation de nos controller user afin de leur donner une route pour que les utilisateurs puissent les utiliser et donc s'inscrite et se connecter.
const userCtrl = require ('../controllers/user-controller');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;  