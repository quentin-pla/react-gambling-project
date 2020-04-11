const express = require('express');
const socketIO = require('socket.io');

const path = require('path');
const port = process.env.PORT || 3001;
const app = express()
    .use(express.static(path.join(__dirname, '../react-ui/build')))
    .listen(port, () => console.log(`Listening on ${port}`));

const io = socketIO(app);

const Users = require(path.join(__dirname, "../react-ui/src/database/models/User"));
const connect = require(path.join(__dirname, "../react-ui/src/database/dbconnection"));

const messages = [{name: 'bot', text: 'Bienvenue.'}];

io.on('connection', function (client) {
    //Connexion
    client.on('login', function (username, password) {
        //Connexion à la base de données
        connect.then(db => {
            console.log("-> Connection établie au serveur");
            console.log("  -> Connexion en cours...");
            //Vérification si un utilisateur existe avec le pseudo
            Users.findOne({'username': username}, 'username password money', function (err, user) {
                if (user != null) {
                    user.comparePassword(password, function (err, success) {
                        client.emit("auth_info", success, user);
                    });
                } else {
                    client.emit("auth_info", false);
                    console.log("Utilisateur introuvable.");
                }
            });
        });
    });

    //Inscription
    client.on('signup', function (username, password) {
        //Connexion à la base de données
        connect.then(db => {
            console.log("-> Connection établie au serveur");
            //Création d'un nouvel utilisateur
            let user = new Users({username: username, password: password});
            //Sauvegarde de l'utilisateur
            user.save();
            console.log("  -> Utilisateur " + username + " ajouté à la base de données");
            //Envoi d'un message de succès
            client.emit("signup_info", true, user);
        });
    });

    client.on('start-chat', () => {
        client.emit('add-messages', messages);
    });

    client.on('post-message', (author, text) => {
        const message = {name: author, text: text};
        messages.push(message);
        io.emit('add-messages', [message])
    });
});
