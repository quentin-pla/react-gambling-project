import React, {useEffect, useState} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
} from "react-router-dom";
import {Navbar, Nav, Row, Col} from "react-bootstrap";
import "./App.css";
import PrivateRoute from "./components/routing/PrivateRoute";
import Home from "./components/pages/Home";
import Roulette from "./components/pages/Roulette";
import Crash from "./components/pages/Crash";
import Jackpot from "./components/pages/Jackpot";
import Login from "./components/pages/Login";
import Signup from './components/pages/Signup';
import {useAuth} from './context/AuthContext';
import AuthButton from './components/auth/AuthButton';
import Chat from "./components/chat/Chat";
import $ from "jquery";
import "jquery.scrollto";

export default function App() {
    const [username, setUsername] = useState(false);
    const [money, setMoney] = useState(false);

    const chat = <Chat name={username} scrollDown={handleChatScroll}/>;

    //Évènement de mise à jour des données de l'utilisateur
    function handleUpdateUserData(username, money) {
        setUsername(username);
        setMoney(money);
    }

    //Évènement de mise à jour de l'argent de l'utilisateur
    function handleUpdateMoney(money) {
        setMoney(money);
    }

    //Évènement appelé pour scroll en bas du chat
    function handleChatScroll() {
        $('#message-list').scrollTo('li:last-child');
    }

    function ChatContainer({children}) {
        return (
            <Row className="m-0 full-height">
                <Col className="col-md-1 col-md-push-9 message-list-fader"/>
                <Col className="chat-container">
                    {chat}
                </Col>
                <Col className="col-9 p-3 pl-5">
                    {children}
                </Col>
            </Row>
        );
    }

    function NavLinks() {
        const isAuthenticated = useAuth().authenticated;
        return isAuthenticated ? (
            <Nav className="mr-auto">
                <Link className="nav-link" to="/roulette">Roulette</Link>
                <Link className="nav-link" to="/crash">Crash</Link>
                <Link className="nav-link" to="/jackpot">Jackpot</Link>
            </Nav>
        ) : (
            <Nav className="mr-auto"/>
        );
    }

    useEffect(() => {
        $('#message-list').scrollTo(100);
    }, []);

    return (
        <Router>
            <Navbar className="navbar-top" variant="dark">
                <Navbar.Brand>
                    <Link className="navbar-brand" to="/">
                        <img alt="logo" src={process.env.PUBLIC_URL + '/logo.svg'} width="30" height="20" className="d-inline-block mb-1 mr-2"/>
                        Casino
                    </Link>
                </Navbar.Brand>
                <NavLinks />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        <AuthButton />
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
            <Switch>
                <Route exact path="/">
                    <Home/>
                </Route>
                <Route path="/login">
                    <Login onUpdateUserData={handleUpdateUserData}/>
                </Route>
                <Route path="/signup">
                    <Signup onUpdateUserData={handleUpdateUserData}/>
                </Route>
                <PrivateRoute path="/roulette">
                    <ChatContainer>
                        <Roulette
                            username={username}
                            money={money}
                            onUpdateMoney={handleUpdateMoney}
                        />
                    </ChatContainer>
                </PrivateRoute>
                <PrivateRoute path="/crash">
                    <ChatContainer>
                        <Crash
                            username={username}
                            money={money}
                            onUpdateMoney={handleUpdateMoney}
                        />
                    </ChatContainer>
                </PrivateRoute>
                <PrivateRoute path="/jackpot">
                    <ChatContainer>
                        <Jackpot
                            username={username}
                            money={money}
                            onUpdateMoney={handleUpdateMoney}
                        />
                    </ChatContainer>
                </PrivateRoute>
                <Redirect to="/"/>
            </Switch>
        </Router>
    );
}
