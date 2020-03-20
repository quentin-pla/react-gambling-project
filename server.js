// Import du module socket.io
const io = require('socket.io')();

/* la liste des messages est stockée dans la variable "messages".
  Chaque message contient le nom de l'utilisateur qui l'a envoyé et le texte associé.
  Il y a un premier message de bienvenue dans la liste.
*/
const messages = [{name: 'bot', text: 'Bienvenue.'}];

/* Lorsqu'un client se connecte, on met en place la gestion de la communication.
  Le serveur accepte deux types d'événements :
    "set-name" pour changer le nom de l'utilisateur ;
    "post-message" pour ajouter un message au chat.
  Le client accepte un type d'événement :
    "add-messages" qui permet d'ajouter une liste de messages à la fenêtre de chat.
*/
io.on('connection', (client) => {
    /* L'événement "set-name" est censé être le premier message envoyé par un client.
      On sauvegarde le nom passé en paramètre comme un champ du client (attention à pas utiliser des noms de champs du client genre "emit".
      Puis on envoie la liste des messages préexistants au client.
      On pourrait améliorer le callback en vérifiant que c'est effectivement le premier message envoyé par le client.
    */
    client.on('set-name', (name) => {
        console.log('set-name ', name);
        client.username = name;
        client.emit('add-messages', messages)
    });

    /* L'événement "post-message" est envoyé par un client qui veut écrire dans le chat.
      On ajoute le message à la liste des messages, puis on envoie à tous les clients (y compris sois-même)
      le nouveau message. On aurait aussi pu utiliser "client.broadcast.emit" mais il aurait fallu ajouter
      explicitement le message côté client. Là, il le reçoit par l'intermédiaire de "add-messages".
    */
    client.on('post-message', (text) => {
        const message = {name: client.username, text: text};
        console.log('post-message ', message);
        messages.push(message);
        io.emit('add-messages', [message])
    });
});

/* Le serveur attend sur le port 3001 qui est vu comme port 3000 grâce au "proxy" mis en place dans packages.json.
  À noter que l'on a pas utilisé express ni autre serveur http, mais ce serait tout à fait possible de combiner
  une API REST avec un service temps réel socket.io.
*/
const port = 3001;
io.listen(port);
console.log('socket.io listening on port ', port);

