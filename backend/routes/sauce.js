//Importation de Express :
const express = require('express');

//Appel de Express pour crée le router de chaque midellware :
const router = express.Router();

//importation du middleware/auth :
const auth = require('../middleware/auth');

//Importation du fichier multer de middlware pour la gestion des fichier images:
const multer = require('../middleware/multer');

//Importation de fichier sauce.js de controllers :
const sauceControllers = require('../controllers/sauce');

//Importation de fichier like.js de controllers :
const likeControllers = require("../controllers/like")



//Route POST :
router.post('/', auth, multer, sauceControllers.createSauce);


//Route PUT :
router.put('/:id', auth, multer, sauceControllers.modifySauce);


//Route DELETE :
router.delete('/:id', auth, sauceControllers.deleteSauce);


//Route GET :
router.get('/', auth, sauceControllers.getAllSauce);


//Route GET :
router.get('/:id', auth, sauceControllers.getOneSauce);


//Route POST :
router.post("/:id/like" , auth, likeControllers.likeSauce);



//Exportation du fichier sauce.js de routes :
module.exports = router;