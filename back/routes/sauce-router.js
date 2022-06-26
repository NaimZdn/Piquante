const express = require ('express');
const router = express.Router(); 

const auth = require('../middlewares/auth'); 
const multer = require('../middlewares/multer-config');

const sauceCtrl = require('../controllers/sauce-controller');
const idCompare = require('../middlewares/idCompare');

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createNewSauce);
router.put('/:id', auth, idCompare, multer, sauceCtrl.updateSauce);
router.delete('/:id', auth, idCompare, multer, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeAndDislikeSauce);


module.exports = router; 