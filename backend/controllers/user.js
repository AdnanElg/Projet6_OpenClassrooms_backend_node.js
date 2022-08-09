//Importation du fichier User de models :
var User = require('../models/User');

//Importation de bcrypt pour hasher le password :
const bcrypt = require('bcrypt');

//Importation de crypto-js pour chiffrer le mail :
const cryptojs = require('crypto-js');

//Importation de dotenv pour les variables d'environement :
const dotenv = require("dotenv").config();

//Importation de jsonwebtoken :
const jsonwebtoken = require('jsonwebtoken');



//Logique POST (signup) :
exports.signup = (req, res, next) => {
    const emailCryptoJS = cryptojs.HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`).toString();
    bcrypt.hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: emailCryptoJS,
                password: hash,
            });

            user.save()
                .then(() => res.status(201).json({message: "Utilisateur à bien était crée !"}))
                .catch(error => res.status(400).json({error}))
        })
        .catch(error => res.status(500).json({error}));
};



//Logique POST (login) :
exports.login = (req, res, next) => {
   const emailCryptoJS = cryptojs.HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`).toString();
   
   User.findOne({email: emailCryptoJS})
        .then((user) => {
            if (!user){
                res.status(401).json({message: "Paire identifiant/mot de passe incorrrect"})
            }

        bcrypt.compare(req.body.password, user.password)  
            .then(valid => {
                if(valid){
                    res.status(200).json({
                        userId: user._id,
                        token: jsonwebtoken.sign(
                            {userId: user._id},
                            `${process.env.JWT_KEY_TOKEN}`,
                            {expiresIn:'24h'}
                        )
                    })
                }
                else{
                    res.status(401).json({message: "Paire identifiant/mot de passe incorrrect"})
                }
            })
            .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
}

