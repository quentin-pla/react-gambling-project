import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
} from "react-router-dom";
import {Navbar, Nav} from "react-bootstrap";
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

export default function App() {
    return (
        <Router>
            <Navbar className="purple-gradient" variant="dark">
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
                <Route exact path="/" component={Home}/>
                <Route path="/login" component={Login}/>
                <Route path="/signup" component={Signup}/>
                <PrivateRoute path="/roulette" component={Roulette}/>
                <PrivateRoute path="/crash" component={Crash}/>
                <PrivateRoute path="/jackpot" component={Jackpot}/>
                <Redirect to="/" />
            </Switch>
        </Router>
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
