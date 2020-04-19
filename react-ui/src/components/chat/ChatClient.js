/**
 * Instance socket IO
 */
import socket from "../../context/SocketIOInstance";

class ChatClient {

  constructor() {
    socket.emit('start-chat');
  }

  onMessages(cb) {
    socket.on('add-messages', (messages) => cb(messages));
  }

  sendMessage(author, message) {
    socket.emit('post-message', author, message);
  }
}

export { ChatClient }
