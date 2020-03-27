const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const isDev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3001;

const Users = require("../react-ui/src/database/models/User");
const connect = require("../react-ui/src/database/dbconnection");

const messages = [{name: 'bot', text: 'Bienvenue.'}]

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
    console.error(`Node cluster master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
    });

} else {

    io.on('connection', function (client) {
        //Connexion
        client.on('login', function (username, password) {
            //Connexion à la base de données
            connect.then(db => {
                console.log("-> Connection établie au serveur");
                console.log("  -> Connexion en cours...");
                //Vérification si un utilisateur existe avec le pseudo
                Users.findOne({'username': username}, 'username password', function (err, user) {
                    if (user != null) {
                        user.comparePassword(password, function (err, isMatch) {
                            client.emit("auth_info", isMatch);
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
                client.emit("signup_info", true);
            });
        });

        client.on('post-message', (text) => {
            const message = {name: client.username, text: text};
            console.log('post-message ', message);
            messages.push(message);
            io.emit('add-messages', [message])
        });
    });

    http.listen(port, function () {
        console.log('listening on *:' + port);
    });
}
