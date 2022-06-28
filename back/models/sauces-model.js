// Utilisation de mongoose créer un shéma de sauce et l'exporter sous forme de modèle afin de le réutiliser 
const mongoose = require('mongoose');

// Création du shéma des sauces, on oblige l'utilisateur à renseigner certaines informations.
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: [String] },
  usersDisliked: { type: [String] }
});

// On exporte le shéma des sauces sous forme de modèle sous le nom de 'sauce' 
module.exports = mongoose.model('sauce', sauceSchema);