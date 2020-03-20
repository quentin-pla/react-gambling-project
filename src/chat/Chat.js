import React from 'react';
import {ChatClient} from './ChatClient';

/* Une simple classe qui gère un champ de texte. Ce dernier est utilisé pour entrer le nom de l'utilisateur et la saisie de messages
  Elle accepte les propriétés suivantes :
  - label : étiquette à gauche du champ
  - onChange : callback appelé chaque fois que le contenu change
  - onSubmit : callback appelé quand on appuie sur entrée
  - autoFocus : si le champ doit avoir le focus ou non

  <InputField label="Nom" onChange={this.props.onChange} onSubmit={this.props.onClick} autoFocus />
*/
class InputField extends React.Component {
  constructor() {
    super()
    this.state = {value: ""}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    if(this.props.onChange) this.props.onChange(event.target.value)
    this.setState({value: event.target.value})
  }

  handleSubmit(event) {
    if(this.props.onSubmit) this.props.onSubmit(this.state.value)
    this.setState({value: ""})
    event.preventDefault()
  }

  render() {
    return (<form onSubmit={this.handleSubmit}>
        <label>{this.props.label} </label>
        <input type="text" onChange={this.handleChange} value={this.state.value} autoFocus={this.props.autoFocus} />
      </form>)
  }
}

/* La fenêtre de login, présentée en premier dans l'application.
  Elle comporte un champ "Nom" et un bouton "Rejoindre".
  Elle possède les propriétés suivantes :
  - onNameChange : callback appelé lorsque la valeur du nom change
  - onLogin : callback appelé lorsque l'on se connecte
*/
class LoginWindow extends React.Component {
  render() {
    return <div>
    <h1>Chat</h1>
    <InputField label="Nom" onChange={this.props.onNameChange} onSubmit={this.props.onLogin} autoFocus />
    <button onClick={this.props.onLogin}>Rejoindre</button>
    </div>
  }
}

/* La fenêtre de chat, présentée une fois que l'utilisateur s'est connecté.
  Elle montre le nom de l'utilisateur, la liste des messages, un champ pour ajouter un message et un bouton pour quitter.
  Elle possède les propriétés suivantes :
  - name : nom de l'utilisateur
  - onQuit : callback appelé lorsque l'on clique sur quitter
  Elle possède l'état suivant :
  - messages : liste des messages affichés
  La méthode "submitMessage" peut être appelée pour envoyer un message
  La méthode "addMessages" peut être appelée pour ajouter une liste de messages. Elle est utilisée par le client de chat pour ajouter des messages provenant du serveur.
*/
class ChatWindow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {messages: []}
    this.submitMessage = this.submitMessage.bind(this)
    this.addMessages = this.addMessages.bind(this)

    this.chat = new ChatClient(this.props.name)
    this.chat.onMessages(this.addMessages)
  }

  addMessages(messages) {
    this.setState((state, props) => ({
      messages: state.messages.concat(messages)
    }))
  }

  submitMessage(text) {
    this.chat.sendMessage(text)
  }

  render() {
    const messages = this.state.messages.map((m) => <li key={m.name + m.text}> {m.name}: {m.text} </li>)
    return (
      <div>
        <h1>Messages</h1>
        Pseudo : {this.props.name}
        <InputField label="Message" onSubmit={this.submitMessage} autoFocus />
        <ul>
          {messages}
        </ul>
        <button onClick={this.props.onQuit}>Quitter</button>
      </div>
    );
  }
}

/* L'application est composé de deux vues :
  - LoginWindow : la fenêtre de login avec un champ "nom" et un bouton "rejoindre"
  - ChatWindow : la fenêtre de discussion avec un champ "message", la liste des messages et un bouton "quitter"
  L'état est composé de :
  - name : le nom de l'utilisateur
  - current : la fenêtre à afficher (login ou chat)
  Les méthodes sont les suivantes :
  - closeChat : terminer une session de chat
  - startChat : commencer un chat avec comme nom celui actuellement dans l'état
  - setName : changer le nom stocké dans l'état
*/
class Chat extends React.Component {
  constructor() {
    super()
    this.state = {name: "", current: "login"}

    this.closeChat = this.closeChat.bind(this)
    this.startChat = this.startChat.bind(this)
    this.setName = this.setName.bind(this)
  }

  closeChat() {
    this.setState({current: "login"})
  }

  startChat() {
    this.setState({current: "chat"})
  }

  setName(name) {
    this.setState({name: name})
  }

  render() {
    if(this.state.current === "login")
      return <LoginWindow onNameChange={this.setName} onLogin={this.startChat} />
    else
      return <ChatWindow name={this.state.name} onQuit={this.closeChat} />
  }
}

export default Chat;
