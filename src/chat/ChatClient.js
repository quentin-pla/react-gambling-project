import openSocket from 'socket.io-client';
/* Le client se connecte à cette URL */
const  socket = openSocket('http://localhost:3000');

/* La classe "ChatClient" permet de communiquer avec le serveur de chat.

  client = new ChatClient("pseudonyme")
  client.onMessages((messages) => {
    // ajouter les messages à l'interface graphique
  })
  client.sendMessage("Bonjour à tous")

*/
class ChatClient {
  // L'événement "set-name", emis depuis le constructeur, permet de changer le nom de l'utilisateur
  constructor(username) {
    socket.emit('set-name', username)
  }

  /* Le callback passé à onMessages sera appelé à chaque fois que le serveur nous envoie un tableau de messages.
    Chaque message est composé d'un champ "name" (nom de l'emetteur) et "text" (texte du message).
  */
  onMessages(cb) {
    socket.on('add-messages', (messages) => cb(messages))
  }

  /* Envoyer un message à l'aide de l'événement "post-message". Le message sera reçu dans le champ "text" d'un message
    par tous les participants au chat, y compris le client qui l'a envoyé.
  */
  sendMessage(message) {
    socket.emit('post-message', message)
  }
}

export { ChatClient }
