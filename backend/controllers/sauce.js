//Importation du fichier Sauce de models :
const Sauce = require('../models/Sauce');

//inportation du fs de node.js :
const fs = require('fs');



//Logique POST :

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;

    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    //enregistrer l'objet dans la base de donné en appelant la méthode save :
    sauce.save()
        .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
        .catch(error => { res.status(400).json( { error })});
}



//Logique PUT :

exports.modifySauce = (req, res, next) => {
  //si on modifie le fichier image, récupérer le nom du fichier image sauce actuelle pour la suppréssion,
  //pour éviter d'avoir un fichier inutile dans le dossier images :

  if(req.file){
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
      const filename = sauce.imageUrl.split("/images")[1];

      //suppression de l'image de la sauce car elle va être remplacer par la nouvelle image de sauce :
      fs.unlink(`images/${filename}`, (err) => {
        if(err) throw err;
      })

    })
    .catch(error => res.status(400).json({error}));  
  }

  
  //l'objet qui va être envoyé dans la base de donnée :
  const sauceObject = req.file ?

  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } :
  { ...req.body};


  //update dans la base de donnée :
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) 
    .then(() => res.status(200).json({ message: "objet mise à jour" }))
    .catch((error) => res.status(404).json({ error }));
}



//Logique DELETE :

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];

      fs.unlink(`images/${filename}`, () => {

      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: `l'objet ${req.params.id} a été supprimé` }))
        .catch((error) => res.status(404).json({ error }));
    });

  })
  .catch(error => res.status(500).json({error}));  
}




//Logique GET avec Find :

exports.getAllSauce = (req, res, next) => {
  //utilisation de la méthode find() pour avoir la liste complète :
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({error}));
}



//Logique GET avec OneFind :

exports.getOneSauce =  (req, res, next) => {
  //pour accéder à l'id, req.params.id :
  
    Sauce.findOne({_id: req.params.id})
      .then(sauce => res.status(200).json(sauce))
      .catch((error) => res.status(400).json({error}));
}


