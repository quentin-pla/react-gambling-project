import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Link, Redirect,} from "react-router-dom";
import {Navbar, Nav, Row, Col} from "react-bootstrap";
import "./App.css";
import PrivateRoute from "./components/routing/PrivateRoute";
import Home from "./components/Home";
import Roulette from "./components/games/roulette/Roulette";
import Login from "./components/auth/Login";
import Signup from './components/auth/Signup';
import AuthButton from './components/auth/AuthButton';
import Chat from "./components/chat/Chat";
import $ from "jquery";
import "jquery.scrollto";
import {AuthContext} from "./context/AuthContext";

class App extends Component {
    /**
     * Contexte d'authentification
     */
    static contextType = AuthContext;

    constructor(props, context) {
        super(props, context);

        this.handleChatScroll = this.handleChatScroll.bind(this);
    }

    //Évènement appelé pour scroll en bas du chat lors de l'ajout d'un nouveau message
    handleChatScroll() {
        //Récupération de la liste des messages dans le DOM
        let message_list = $('#message-list');
        //Si la hauteur de la liste est supérieure à celle de l'écran (au moment où une scrollbar apparait)
        if (message_list[0].scrollHeight > message_list[0].clientHeight)
            //Scroll au dernier message
            message_list.scrollTo('li:last-child');
    }

    render() {
        //Chat affiché dans les pages seulement si connecté
        const chat = (this.context.authenticated)
            ? <Chat scrollDown={this.handleChatScroll}/>
            : null;

        return (
            <Router>
                <Navbar className="navbar-top" variant="dark">
                    <Navbar.Brand>
                        <Link className="navbar-brand" to="/">
                            <img alt="logo" src={process.env.PUBLIC_URL + '/logo.svg'} width="30" height="20"
                                 className="d-inline-block mb-1 mr-2"/>
                            Casino
                        </Link>
                    </Navbar.Brand>
                    <NavLinks authenticated={this.context.authenticated}/>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            <AuthButton/>
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Navbar>
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route path="/login">
                        <Login/>
                    </Route>
                    <Route path="/signup">
                        <Signup/>
                    </Route>
                    <PrivateRoute path="/roulette">
                        <ChatContainer chat={chat}>
                            <Roulette/>
                        </ChatContainer>
                    </PrivateRoute>
                    <Redirect to="/"/>
                </Switch>
            </Router>
        );
    }
}

/**
 * Page contenant le chat à gauche
 */
function ChatContainer(props) {
    return (
        <Row className="m-0 full-height">
            <Col className="message-list-fader d-none d-sm-block"/>
            <Col className="chat-container d-none d-sm-block">
                {props.chat}
            </Col>
            <Col className="game-container">
                {props.children}
            </Col>
        </Row>
    );
}

/**
 * Liens vers les différentes pages de l'application
 */
function NavLinks(props) {
    return props.authenticated ? (
        <Nav className="mr-auto">
            <Link className="nav-link" to="/roulette">Roulette</Link>
        </Nav>
    ) : (
        <Nav className="mr-auto"/>
    );
}

export default App;
