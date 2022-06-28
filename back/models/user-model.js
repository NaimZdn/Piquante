// Utilisation de mongoose créer un shéma de connexion et l'exporter sous forme de modèle. 
const mongoose = require ('mongoose');
// Utilisation de l'unique validator pour empêcher la création de plusieurs compte avec la même adresse mail
const uniqueValidator = require ('mongoose-unique-validator'); 

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true}, 
    password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);

// On exporte le shéma de connexion sous forme de modèle sous le nom de 'User' 
module.exports = mongoose.model('User', userSchema);

