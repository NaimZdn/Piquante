require('dotenv').config();
// Utilisation du modèle 'User' afin de pouvoir créer les controller
const User = require('../models/user-model');
// Utilisation de bcrypt afin de protéger au maximum les mots de passes des utilisateurs. 
const bcrypt = require ('bcrypt');
// Utilisation de JsonWebToken afin de limiter au maximum les requêtes malveillantes. Seulement l'utilisateur de la session pourra effectuer certaines requêtes.
const webToken = require ('jsonwebtoken');
const dbToken = process.env.DB_TOKEN

// Création du controller permettant à l'utilisateur de créer un compte. On hash 10 fois le mot de passe.
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email, 
                password: hash
            });
            user.save()
                .then(() => res.status (201).json ({message: "Utilisateur enregistré ! "}))
                .catch(error => res.status (400).json ({ error}));
        }) 
        .catch(error => res.status (500).json ({ error }));

};

// Création du controller permettant à l'utilisateur de se connecter. On va comparer le hash avec le mot de passe entré afin de savoir si l'utilisateur est autorisé ou non 
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then( user => {
            if (!user) {
                return res.status(401).json ({ error: " Utilisateur introuvable "});
            }
            bcrypt.compare(req.body.password, user.password)
                .then( valid => {
                    if (!valid) {
                        return res.status(401).json ({ error: "Mot de passe invalide "});
                    }
                    // Si le mot de passe est correct on renvoie un Token à l'utilisateur afin que toutes les requêtes soit le plus sécurisée possible.
                    res.status(200).json({ 
                        userId : user._id, 
                        token: webToken.sign( 
                            {userId: user._id }, 
                            dbToken, 
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch (error => res.status(500).json ({ error }));
        })
        .catch(error => res.status(500).json ({ error }));
};