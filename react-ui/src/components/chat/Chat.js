import React from 'react';
import {ChatClient} from './ChatClient';
import {Form} from "react-bootstrap";
import {AuthContext} from "../../context/AuthContext";

class InputField extends React.Component {
  constructor() {
    super();
    this.state = {value: ""};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    if(this.props.onChange) this.props.onChange(event.target.value);
    this.setState({value: event.target.value});
    event.preventDefault();
  }

  handleSubmit(event) {
    if(this.props.onSubmit) this.props.onSubmit(this.state.value);
    this.setState({value: ""});
    event.preventDefault();
  }

  render() {
    return (
        <Form onSubmit={this.handleSubmit}>
            <Form.Control
                type="text"
                placeholder="Message"
                onChange={this.handleChange}
                value={this.state.value}
            />
        </Form>
    );
  }
}

class Chat extends React.Component {
  /**
   * Contexte d'authentification
   */
  static contextType = AuthContext;

  constructor(props,context) {
    super(props,context);
    this.state = {messages: []};
    this.submitMessage = this.submitMessage.bind(this);
    this.addMessages = this.addMessages.bind(this);

    this.chat = new ChatClient();
    this.chat.onMessages(this.addMessages);
  }

  addMessages(messages) {
    this.setState((state) => ({
      messages: state.messages.concat(messages)
    }));
    this.props.scrollDown();
  }

  submitMessage(text) {
    this.chat.sendMessage(this.context.username, text);
  }

  render() {
    const messages = this.state.messages.map(
        (m, index) => <li className="list-group-item" key={index}>
          <strong>{m.name}</strong> {m.text}
        </li>
    );

    return (
      <>
        <ul className="list-group" id="message-list">
          {messages}
        </ul>
        <InputField label="Message" onSubmit={this.submitMessage}/>
      </>
    );
  }
}

export default Chat;
