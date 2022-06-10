const sauce = require('../models/sauces-model');
const fs = require('fs')

exports.getAllSauces = (req, res, next) => {
    sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
        .then(newSauce => res.status(200).json(newSauce))
        .catch(error => res.status(404).json({ error }));
};

exports.createNewSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const newSauce = new sauce({ 
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
        likes: 0, 
        dislikes: 0, 
        usersLiked: [], 
        usersDisliked: []
      });
      console.log(req.body)
    newSauce.save()
    .then(() => res.status(201).json({ message: 'La nouvelle sauce a bien été enregistrée'}))
    .catch(error => res.status(400).json ({ error }));
};

exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ? 
    { ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
    } : { ...req.body }; 
    sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
}; 

exports.deleteSauce = (req, res, next ) => {
    sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json ({ message: 'La sauce a bien été supprimée '}))
                    .catch(error => res.status(400).json({error}));
            });
        })
        .catch(error => res.status(500).json({ error }));
};




