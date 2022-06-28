const sauce = require('../models/sauces-model');
const fs = require('fs')

// Création de regex pour eviter les attaque par injections
const regexForInputs = /^[a-zA-Z0-9 _.,!()&éêèàçùîï]+$/

// On affiche toutes les sauces selon leur modèle
exports.getAllSauces = (req, res, next) => {
    sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

// On récupère les données d'une seule sauce selon son ID 
exports.getOneSauce = (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
        .then(newSauce => res.status(200).json(newSauce))
        .catch(error => res.status(404).json({ error }));
};
// Création du contrôleur permettant de à l'utilisateur de créer une nouvelle sauce 
exports.createNewSauce = (req, res, next) => {
    // On récupère les données du modèle de la sauce en format JSON 
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    // On vérifie la validité des inputs avec la regex que l'on a precedemment renseignée
    if(
        !regexForInputs.test(sauceObject.name)|| 
        !regexForInputs.test(sauceObject.manufacturer)||
        !regexForInputs.test(sauceObject.description)||
        !regexForInputs.test(sauceObject.mainPepper)||
        !regexForInputs.test(sauceObject.hear)){
          return res.status(401).json({message : "Veuillez entrer des caractères valides ! "})
        };

    const newSauce = new sauce({
        // On utilise le modèle précèdement crée en lui ajoutant les paramètre qui n'ont pas été requis lors de la création de la sauce 
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

// Création du contôleur permettant à l'utilisateur de modifier une sauce 
exports.updateSauce = (req, res, next) => {
    // Si une image est déjà présente alors on la supprime 
    if (req.file) {
        sauce.findOne({ _id: req.params.id })
            .then((sauceArg) => {
                const filename = sauceArg.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, (error) => {
                    if (error) throw error;
                });
            })
            .catch(error => res.status(404).json({ error }));
    };
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        } : { ...req.body };

        if(
            !regexForInputs.test(sauceObject.name)|| 
            !regexForInputs.test(sauceObject.manufacturer)||
            !regexForInputs.test(sauceObject.description)||
            !regexForInputs.test(sauceObject.mainPepper)||
            !regexForInputs.test(sauceObject.hear)){
              return res.status(401).json({message : "Veuillez entrer des caractères valides ! "})
            };

    delete sauceObject.userId
    sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'La sauce a bien été modifiée!' }))
        .catch(error => res.status(400).json({ error }));
};

// Création du contrôleur permettant à l'utilisateur de supprimer une sauce 
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

// Création du contrôleur permettant d'analyser le comportement de l'utilisateur en cas de Like ou Dislike 
exports.likeAndDislikeSauce = (req, res, next) => {
    const { like, userId } = req.body
    let sauceId = req.params.id

    sauce.findOne({ _id: sauceId })
        .then(sauceArg => {
            // Si l'utilisateur n'a pas encore aimé ou non une sauce
            if (sauceArg.usersDisliked.indexOf(userId) == -1 && sauceArg.usersLiked.indexOf(userId) == -1) {
                // Si l'utilisateur aime la sauce
                if (like == 1) {
                    sauceArg.usersLiked.push(userId);
                    sauceArg.likes += like;
                    // Si l'utilisateur n'aime pas la sauce 
                } else if (like == -1) {
                    sauceArg.usersDisliked.push(userId);
                    sauceArg.dislikes -= like;
                };
            };
            // Si l'utilisateur veut annuler son "like"
            if (sauceArg.usersLiked.indexOf(userId) != -1 && like == 0) {
                const likesIndex = sauceArg.usersLiked.findIndex(user => user === userId);
                sauceArg.usersLiked.splice(likesIndex, 1);
                sauceArg.likes -= 1;
            };
            // Si l'utilisateur veut annuler son "dislike"
            if (sauceArg.usersDisliked.indexOf(userId) != -1 && like == 0) {
                const dislikesIndex = sauceArg.usersDisliked.findIndex(user => user === userId);
                sauceArg.usersDisliked.splice(dislikesIndex, 1);
                sauceArg.dislikes -= 1;
            }
            sauceArg.save();
            res.status(201).json({ message: 'Like / Dislike mis à jour' });
        })
        .catch(error => res.status(500).json({ error }));
};


