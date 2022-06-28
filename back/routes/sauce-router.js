//Utilisation d'express afin de configurer nos routes API.
const express = require ('express');
const router = express.Router(); 

// Utilisation de nos middlewares : auth , multer, et idCompare
const auth = require('../middlewares/auth'); 
const multer = require('../middlewares/multer-config');
const idCompare = require('../middlewares/idCompare');

// Utilisation de nos controller de sauces afin de leur donner une route pour que les utilisateurs puissent les utiliser
const sauceCtrl = require('../controllers/sauce-controller');

// Ajout de l'authentifications sur chacune des routes, de multer sur les routes post et put afin d'ajouter/modifier une image et enfin de l'iD compare sur la route Delete
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createNewSauce);
router.put('/:id', auth, idCompare, multer, sauceCtrl.updateSauce);
router.delete('/:id', auth, idCompare, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeAndDislikeSauce);


module.exports = router; 