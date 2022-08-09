//Importation de Express :
const express = require('express');

//Appel de Express pour crée le router de chaque midellware :
const router = express.Router();

//Importation de fichier stuff.js de controllers :
const userControllers = require('../controllers/user');

//importation du middleware/password :
const password = require('../middleware/password');



//Midellware POST (signup) :
router.post('/signup', password, userControllers.signup);

//Midellware POST (login):
router.post('/login', userControllers.login);



//Exportation du fichier stuff.js de routes :
module.exports = router;