import io from "socket.io-client";
/* Le react-ui se connecte à cette URL */
const socket = io();

class ChatClient {
  constructor() {
    socket.emit('start-chat')
  }

  onMessages(cb) {
    socket.on('add-messages', (messages) => cb(messages))
  }

  sendMessage(author, message) {
    socket.emit('post-message', author, message)
  }
}

export { ChatClient }
