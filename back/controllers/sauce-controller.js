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
    newSauce.save()
        .then(() => res.status(201).json({ message: 'La nouvelle sauce a bien été enregistrée' }))
        .catch(error => res.status(400).json({ error }));
};

exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        } : { ...req.body };
    sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'La sauce a bien été supprimée ! ' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.likeAndDislikeSauce = (req, res, next) => {
    const { like, userId } = req.body
    let sauceId = req.params.id
    
    sauce.findOne({ _id: sauceId })
    .then(sauceArg => {
        // Si l'utilisateur n'a pas encore aimé ou non une sauce
        if(sauceArg.usersDisliked.indexOf(userId) == -1 && sauceArg.usersLiked.indexOf(userId) == -1) {
            if(like == 1) { // L'utilisateur aime la sauce
                sauceArg.usersLiked.push(userId);
                sauceArg.likes += like;
            } else if(like == -1) { // L'utilisateur n'aime pas la sauce
                sauceArg.usersDisliked.push(userId);
                sauceArg.dislikes -= like;
            };
            
        };
        // Si l'utilisateur veut annuler son "like"
        if(sauceArg.usersLiked.indexOf(userId) != -1 && like == 0) {
            const likesIndex = sauceArg.usersLiked.findIndex(user => user === userId);
            sauceArg.usersLiked.splice(likesIndex, 1);
            sauceArg.likes -= 1;
        };
        // Si l'utilisateur veut annuler son "dislike"
        if(sauceArg.usersDisliked.indexOf(userId) != -1 && like == 0) {
            const dislikesIndex = sauceArg.usersDisliked.findIndex(user => user === userId);
            sauceArg.usersDisliked.splice(dislikesIndex, 1);
            sauceArg.dislikes -= 1;
        }
        sauceArg.save();
        res.status(201).json({ message: 'Like / Dislike mis à jour' });
    })
    .catch(error => res.status(500).json({ error }));
};

