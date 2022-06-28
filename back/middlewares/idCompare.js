require('dotenv').config();
const webToken = require ('jsonwebtoken');
const Sauce = require ('../models/sauces-model');

const dbToken = process.env.DB_TOKEN;

module.exports = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id}) 
        .then (sauce => {
        const token = req.headers.authorization.split(' ')[1]; 
        const decodedToken = webToken.verify(token, dbToken);
        const userId = decodedToken.userId;
        if (sauce.userId && sauce.userId !== userId) {
            res.status(403).json({ message: 'Requête non autorisée' });
        } else {
            next();
        }
    }) .catch (error =>  {
        res.status(401).json({ error: error | 'Requête non authentifiée ! '})
    });
};