const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

/**
 * Modèle utilisateur
 */
const UserModel = new Schema({
    //Pseudo
    username: {
        type: String,
        required: true,
        unique: true
    },
    //Mot de passe
    password: {
        type: String,
        required: true
    },
    //Argent disponible
    money: {
        type: Number,
        default: 500
    }
});

/**
 * Avant que l'utilisateur soit sauvegardé dans la base de données
 */
UserModel.pre('save', function(next) {
    //Récupération de l'utilisateur
    let user = this;
    //Vérification du mot de passe de l'utilisateur
    if (!user.isModified('password')) return next();
    //Générer cryptage du mot de passe
    bcrypt.genSalt(10, function(err, salt) {
        //Retourner l'erreur si présente
        if (err) return next(err);
        //Cryptage du mot de passe
        bcrypt.hash(user.password, salt, function(err, hash) {
            //Retourner l'erreur si présente
            if (err) return next(err);
            //Modification du mot de passe de l'utilisateur
            user.password = hash;
            //Passage à l'utilisateur suivant
            next();
        });
    });
});

/**
 * Comparer le mot de passe avec celui crypté
 * @param candidatePassword mot de passe à vérifier
 * @param cb retour
 */
UserModel.methods.comparePassword = function(candidatePassword, cb) {
    //Comparaison du mot de passe
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        //Retour de l'erreur si présente
        if (err) return cb(err);
        //Retour du résultat
        cb(null, isMatch);
    });
};

/**
 * Définition du modèle
 * @type {Model} modèle
 */
let User = mongoose.model("User", UserModel);

//Exportation du modèle
module.exports = User;

