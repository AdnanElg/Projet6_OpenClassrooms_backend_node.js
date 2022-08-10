//multer : pour gérer les requêtes HTTP avec envoie de fichier :

//Importation du package multer :
const multer = require('multer');


//le dictionnaire de MIME_TYPES :
const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
    'image/gif': 'gif'
};


//la destination du fichier (repertoire) et générer un nom de fichier unique :
const storage = multer.diskStorage({
    //destinnation de stockage du fichier :
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    
    filename: (req, file, callback) => {
        //supprimer les espace dans le nom du fichier :
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + Date.now() + '.' + extension);
    }
})

 
//Exportation du middleware multer : 
module.exports = multer({storage}).single('image');