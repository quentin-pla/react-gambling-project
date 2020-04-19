/**
 * Utilisation d'express
 */
const express = require('express');

/**
 * Chemins
 */
const path = require('path');

/**
 * Port utilisé pour déployer l'application
 */
const port = process.env.PORT || 3001;

/**
 * Application express
 */
const app = express()
    .use(express.static(path.join(__dirname, '../react-ui/build')))
    .listen(port, () => console.log(`Listening on ${port}`));

/**
 * Socket IO
 */
const io = require('socket.io')(app);

/************************************************/
/************** BASE DE DONNÉES *****************/
/************************************************/

/**
 * Modèle utilisateur de la base de données
 */
const Users = require(path.join(__dirname, "../react-ui/src/database/models/User"));

/**
 * Connexion à la base de données
 */
const connect = require(path.join(__dirname, "../react-ui/src/database/dbconnection"));

/*************************************/
/************** CHAT *****************/
/*************************************/

/**
 * Liste des messages contenus dans le chat de l'application
 */
const messages = [{name: 'bot', text: 'Bienvenue sur le Casino !'}];

/*****************************************/
/************** ROULETTE *****************/
/*****************************************/

/**
 * Données de la roulette
 */
const rouletteData = {
    //Liste des paris effectués sur la couleur violet de la roulette
    purpleBets: [],
    //Liste des paris effectués sur la couleur noire de la roulette
    blackBets: [],
    //Liste des paris effectués sur la couleur rose de la roulette
    pinkBets: [],
    //Temps par défaut à attendre avant le lancement de la roulette
    defaultTimer: 12.0,
    //Durée par défaut du temps de roulement de la roulette
    defaultRollTime: 6.0,
    //Liste des numéros disponibles de la roulette, les 4 premiers sont rajoutés à la fin
    // pour générer la prochaine rollList (faire une boucle)
    numbersRound: [0,11,5,10,6,9,7,8,1,14,2,13,3,12,4,0,11,5,10,6],
    //Couleur des numéros
    numbersColor: {
        //Numéros violets
        purple: [11,10,9,8,14,13,12],
        //Numéros noirs
        black: [0],
        //Numéros roses
        pink: [1,2,3,4,5,6,7],
    },
    //Multiplication des gains pour chaque couleur
    colorsProfit: {
        //Multiplicateur violet
        purple: 2,
        //Multiplicateur noir
        black: 10,
        //Multiplicateur rose
        pink: 2
    },
    //Temps d'attente avant le lancement de la roulette
    timer: 12.0,
    //Durée pendant laqulle la roulette tourne
    rollTime: 6.0,
    //Booléen permettant de savoir si la roulette tourne ou pas
    rolling: false,
    //Nombre gagnant aléatoire
    winningNumber: getRandomInt(),
    //Liste des numéros qui sera animée
    rollList: [],
    //Historique des tirages
    history: []
};

//Génération de la liste pour l'animation
rouletteData.rollList = generateRollList();

//Appel de la fonction decrementTime toutes les 100ms
setInterval(decrementTime, 1000);

/**
 * Envoyer pour chaque utilisateur gagnant, les profits réalisés
 */
function rewardWinners() {
    //Opération basée sur la couleur du numéro gagant
    switch (getNumberColor(rouletteData.winningNumber)) {
        //Numéro gagnant est de la couleur violet
        case "purple":
            //Pour chaque mise pariée
            rouletteData.purpleBets.forEach((item) => {
                //Mise à jour de l'argent de l'utilisateur
                updateUserMoney(
                    item.clientID, item.username, item.bet * rouletteData.colorsProfit.purple
                );
            });
            break;
        //Numéro gagnant est de la couleur noire
        case "black":
            //Pour chaque mise pariée
            rouletteData.blackBets.forEach((item) => {
                //Mise à jour de l'argent de l'utilisateur
                updateUserMoney(
                    item.clientID, item.username, item.bet * rouletteData.colorsProfit.black
                );
            });
            break;
        //Numéro gagnant est de la couleur rose
        case "pink":
            //Pour chaque mise pariée
            rouletteData.pinkBets.forEach((item) => {
                //Mise à jour de l'argent de l'utilisateur
                updateUserMoney(
                    item.clientID, item.username, item.bet * rouletteData.colorsProfit.pink
                );
            });
            break;
        default:
            break;
    }
}

/**
 * Mettre à jour l'historique
 */
function updateHistory() {
    //Si 5 éléments ou plus sont compris dans l'historique
    if (rouletteData.history.length >= 5)
        //Suppression du dernier élément
        rouletteData.history.pop();
    //Ajout du numéro gagnant dans la liste
    rouletteData.history.unshift(rouletteData.winningNumber);
    //Envoi de l'historique aux clients
    io.sockets.emit('update-history', rouletteData.history);
}

/**
 * Récupérer la couleur d'un numéro
 */
function getNumberColor() {
    //Le numéro est violet
    if(rouletteData.numbersColor.purple.indexOf(rouletteData.winningNumber) !== -1)
        return "purple";
    //Le numéro est noir
    else if (rouletteData.numbersColor.black.indexOf(rouletteData.winningNumber) !== -1)
        return "black";
    //Le numéro est rose
    else if (rouletteData.numbersColor.pink.indexOf(rouletteData.winningNumber) !== -1)
        return "pink";
}

/**
 * Décrémenter le timer de la roulette et mettre à jour son état
 */
function decrementTime() {
    //La roulette est en attente
    if (!rouletteData.rolling) {
        //Le temps du chrono est supérieur à 1s
        if (rouletteData.timer > 1) {
            //Décrémentation du timer
            rouletteData.timer = rouletteData.timer - 1;
            //Envoi du chrono aux clients
            io.sockets.emit('update-timer', rouletteData.timer);
        //Le chrono est arrivé à terme
        } else {
            //Lancement de la roulette
            rouletteData.rolling = true;
            //Réinitialisation du chrono
            rouletteData.timer = rouletteData.defaultTimer;
            //Envoi du chrono aux clients
            io.sockets.emit('update-timer', rouletteData.timer);
            //Envoi de l'état de la roulette aux clients
            io.sockets.emit('update-rolling', rouletteData.rolling);
        }
    }
    //La roulette est lancée
    else {
        //Décrémentation du chrono lié à la durée de l'animation
        if (rouletteData.rollTime > 1) rouletteData.rollTime = rouletteData.rollTime - 1;
        //Lorsque l'aniamtion est terminée
        else {
            //Les gagnants sont récompensés
            rewardWinners();
            //Ajout du néuméro gagant à l'historique
            updateHistory();
            //Roulette en attente
            rouletteData.rolling = false;
            //Réinitialisation du chrono de l'animation
            rouletteData.rollTime = rouletteData.defaultRollTime;
            //Suppression des mises sur le violet
            rouletteData.purpleBets.length = 0;
            //Suppression des mises sur le noir
            rouletteData.blackBets.length = 0;
            //Suppression des mises sur le rose
            rouletteData.pinkBets.length = 0;
            //Génération d'un nouveau numéro aléatoire
            rouletteData.winningNumber = getRandomInt();
            //Génération de la liste pour l'animation
            rouletteData.rollList = generateRollList();
            //Envoi de la liste pour l'animation aux clients
            io.sockets.emit('update-roll-list', rouletteData.rollList);
            //Envoi de l'état de la roulette aux clients
            io.sockets.emit('update-rolling', rouletteData.rolling);
            //Envoi du nouveau numéro gagnant aux clients
            io.sockets.emit('update-winning-number', rouletteData.winningNumber);
            //Envoi d'un signal pour supprimer toutes les mises
            io.sockets.emit('clear-roulette-bets');
        }
    }
}

/**
 * Générer un nombre aléatoire
 */
function getRandomInt() {
    //Probabilité de tomber sur le numéro 0
    let zeroProbability = 0.05;
    //Tirage d'un nombre compris entre 0 et 1
    let random = Math.random();
    //Si le tirage est supérieur à 0.05, le numéro gagnant sera compris entre 1 et 14
    if (random > zeroProbability)
        return Math.floor(Math.random() * Math.floor(14)) + 1;
    //On retourne 0 sinon
    else return 0;
}

/**
 * Générer la liste de numéros pour l'animation
 */
function generateRollList() {
    //Définition d'une liste
    let generatedList;
    //Liste avait déjà été générée
    if (rouletteData.rollList.length > 15) {
        //Récupération des 11 derniers unméros de la liste
        generatedList = rouletteData.rollList.slice(-11);
        //Récupération de l'index dans la liste un tour, du dernier numéro de generatedList
        let lastNumberIndex = rouletteData.numbersRound.indexOf(generatedList[generatedList.length -1]);
        generatedList = generatedList.concat(rouletteData.numbersRound.slice(lastNumberIndex + 1, lastNumberIndex + 5));
    }
    else generatedList = rouletteData.numbersRound.slice(0, 15);
    //Simulation de 4 tours
    for (let i = 0; i < 3; i++)
        generatedList = generatedList.concat(generatedList);
    //Récupération du dernier index du numéro gagnant dans la liste
    let index = generatedList.lastIndexOf(rouletteData.winningNumber);
    //Découpage de la liste du départ jusqu'à l'index du dernier numéro gagnant
    generatedList = generatedList.slice(0, index);
    //Récupération de l'index du numéro gagnant dans la boucle
    index = rouletteData.numbersRound.indexOf(rouletteData.winningNumber);
    //Si le numéro gagnant n'est pas définit
    if (index === -1) return [];
    //On ne garde que 5 numéros après le gagnant
    generatedList = generatedList.concat(rouletteData.numbersRound.slice(index, index + 6));
    //Retour de la liste
    return generatedList;
}

/**
 * Mettre à jour l'argent d'un utilisateur
 * @param clientID utilisateur
 * @param username pseudo
 * @param value argent disponible
 */
function updateUserMoney(clientID, username, value) {
    //Connexion à la base de données
    connect.then(() => {
        //Mise à jour de l'argent du joueur
        Users.findOne({'username': username}, 'username money', function (error, user) {
            //Si l'utilisateur a été trouvé
            if (user != null) {
                //Mise à jour de l'argent
                user.money += value;
                //Sauvegarde de l'utilisateur
                user.save();
                //Renvoi de l'argent disponible au client
                io.to(clientID).emit('update-money', user.money);
            }
        });
    });
}

/*************************************************/
/************** CLIENT SOCKET IO *****************/
/*************************************************/

/**
 * Lorsque qu'un nouveau client se connecte à l'application
 */
io.sockets.on('connection', function (client) {

    /******************************************/
    /*********** AUTHENTIFICATION *************/
    /******************************************/

    /**
     * Authentification de l'utilisateur
     */
    client.on('login', function (username, password) {
        //Connexion à la base de données
        connect.then(() => {
            //Message de succès
            console.log("-> Connection établie au serveur");
            //Vérification si un utilisateur existe avec le pseudo
            Users.findOne({'username': username}, 'username password money', function (error, user) {
                //Utilisateur trouvé
                if (user != null) {
                    //Comparation du mot de passe avec celui en base de données
                    user.comparePassword(password, function (error, success) {
                        //Message de succès
                        if (success) {
                            //Message de succès
                            console.log("  -> Authentification OK");
                        }
                        //Message d'erreur
                        else console.log("  -> Authentification KO : mot de passe incorrect");
                        //Renvoi des informations de l'utilisateur
                        client.emit("auth_info", success, user);
                    });
                //Utilisateur introuvable
                } else {
                    //Renvoi faux
                    client.emit("auth_info", false, undefined);
                    //Message d'erreur
                    console.log("  -> Authentification KO : utilisateur introuvable");
                }
            });
        });
    });

    /**
     * Inscription de l'utilisateur
     */
    client.on('signup', function (username, password) {
        //Connexion à la base de données
        connect.then(() => {
            //Message succès
            console.log("-> Connection établie au serveur");
            //Vérification si un utilisateur existe avec le pseudo
            Users.findOne({'username': username}, 'username', function (error, user) {
                //S'il n'existe pas
                if (user === null) {
                    //Création d'un nouvel utilisateur
                    let user = new Users({username: username, password: password});
                    //Sauvegarde de l'utilisateur
                    user.save();
                    //Message succès
                    console.log("  -> Utilisateur " + username + " ajouté à la base de données");
                    //Renvoi des informations
                    client.emit("auth_info", true, user);
                }
                else client.emit("auth_info", false, undefined, "Pseudo déjà utilisé");
            });
        });
    });

    /******************************/
    /*********** CHAT *************/
    /******************************/

    /**
     * Démarrage du chat
     */
    client.on('start-chat', () => {
        //Renvoi des messages présents dans le chat
        client.emit('add-messages', messages);
    });

    /**
     * Envoyer un message
     */
    client.on('post-message', (username,text) => {
        //Si c'est un message basique
        if (!cheatMessage()) {
            //Création du message
            const message = {name: username, text: text};
            //Ajout du message à la liste
            messages.push(message);
            //Broadcast du message aux utilisateur
            io.sockets.emit('add-messages', [message]);
        }
        //Actions  à effectuer si c'est un code de triche
        function cheatMessage() {
            //Message commençant par le code pour avoir de l'argent
            if (text.startsWith("/get_money ")) {
                //Récupération du montant
                let value = parseInt(text.slice(text.indexOf(' ') + 1));
                //Si le montant n'est pas un entier, la suite est ignorée
                if (isNaN(value)) return true;
                //Ajout du montant sur le compte de l'utilisateur
                else updateUserMoney(client.id, username, value);
                //Retourne vrai pour signifier que c'est un message de triche
                return true;
            }
            //Retourne faux pour signifier que ce n'est pas un cheatcode
            else return false;
        }
    });

    /**********************************/
    /*********** ROULETTE *************/
    /**********************************/

    /**
     * Démarrage de la roulette
     */
    client.on('start-roulette', () => {
        //Renvoi de la liste des couleurs pour chaque numéro
        client.emit('set-numbers-color', rouletteData.numbersColor);
        //Renvoi le mutiplicateur de profit de chaque couleur
        client.emit('set-colors-profit', rouletteData.colorsProfit);
        //Renvoi de la valeur du chronomètre
        client.emit('update-timer', rouletteData.timer);
        //Renvoi de l'état de la roulette
        client.emit('update-rolling', rouletteData.rolling);
        if (!rouletteData.rolling && rouletteData.timer >= 2) {
            //Envoi de la liste pour l'animation aux clients
            client.emit('update-roll-list', rouletteData.rollList);
            //Envoi du nouveau numéro gagnant aux clients
            client.emit('update-winning-number', rouletteData.winningNumber);
            //Renvoi des mises présentes sur la couleur violet
            client.emit('add-purple-bets', rouletteData.purpleBets);
            //Renvoi des mises présentes sur la couleur noire
            client.emit('add-black-bets', rouletteData.blackBets);
            //Renvoi des mises présentes sur la couleur rose
            client.emit('add-pink-bets', rouletteData.pinkBets);
        }
    });

    /**
     * Ajouter une mise sur une couleur de la roulette
     */
    client.on('post-bet', (color, username, betValue) => {
        //Mise à jour de l'argent de l'utilisateur
        //(valeur négative pour enlever la somme du compte)
        updateUserMoney(client.id, username, betValue*-1);
        //En fonction de la couleur passée en paramètre
        switch (color) {
            //Couleur violet
            case "purple":
                //Mise à jour de la liste
                updateList(rouletteData.purpleBets);
                //Broadcast de la mise pour chaque client
                io.sockets.emit("add-purple-bets", rouletteData.purpleBets);
                break;
            //Couleur noire
            case "black":
                //Mise à jour de la liste
                updateList(rouletteData.blackBets);
                //Broadcast de la mise pour chaque client
                io.sockets.emit("add-black-bets", rouletteData.blackBets);
                break;
            //Couleur rose
            case "pink":
                //Mise à jour de la liste
                updateList(rouletteData.pinkBets);
                //Broadcast de la mise pour chaque client
                io.sockets.emit("add-pink-bets", rouletteData.pinkBets);
                break;
            default:
                break;
        }

        /**
         * Mettre à jour une liste pour y ajouter une mise
         * @param list liste
         */
        function updateList(list) {
            //Récupération de l'index de la mise de l'utilisateur
            let itemIndex = list.findIndex((item) => item.clientID === client.id && item.username === username);
            //Si l'utilisateur n'a pas encore posé de mise
            if (itemIndex === -1)
            //Ajout d'une mise à la liste
                list.push({clientID: client.id, username: username, bet: betValue});
            else
            //Incrémentation de la mise déjà effectuée
                list[itemIndex] = {...list[itemIndex], bet: list[itemIndex].bet + betValue};
        }
    });

    /**
     * Lorsque le client se déconnecte
     */
    client.on('disconnect', () => {
        client.removeAllListeners();
    });
});
