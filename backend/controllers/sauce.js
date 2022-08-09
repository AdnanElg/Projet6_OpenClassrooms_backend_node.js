//Importation du fichier Sauce de models :
const Sauce = require('../models/Sauce');
const fs = require('fs');


//Logique POST :

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;

    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
        .catch(error => { res.status(400).json( { error })})
}



//Logique PUT :

exports.modifySauce = (req, res, next) => {
  if(req.file){
    Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
        const filename = sauce.imageUrl.split("/images")[1];

      fs.unlink(`images/${filename}`, (err) => {
        if(err) throw err;
      })
    })
    .catch(error => res.status(400).json({error}));  
  }else{};

  const sauceObject = req.file ?

  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } :
  { ...req.body};


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
    Sauce.find()
      .then(sauces => res.status(201).json(sauces))
      .catch(error => res.status(400).json({error}));
}



//Logique GET avec OneFind :

exports.getOneSauce =  (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(400).json({error}));
}


