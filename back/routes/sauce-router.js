const express = require ('express');
const router = express.Router(); 

const auth = require('../middlewares/auth'); 
const multer = require('../middlewares/multer-config');

const sauceCtrl = require('../controllers/sauce-controller');

router.get('/', sauceCtrl.getAllSauces);
router.get('/:id', sauceCtrl.getOneSauce);
router.post('/', multer, sauceCtrl.createNewSauce);
router.put('/:id', multer, sauceCtrl.updateSauce);

/*

router.delete('/api/sauces/:id', (req, res, next ) => {
    sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
});*/


module.exports = router; 