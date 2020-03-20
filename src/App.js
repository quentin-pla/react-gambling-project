import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useLocation
} from "react-router-dom";
import {Navbar, Nav, Button} from "react-bootstrap";
import "./App.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function App() {
    return (
        <Router>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand>
                    <Link class="navbar-brand" to="/home">Casino</Link>
                </Navbar.Brand>
                <NavLinks />
                <Navbar.Collapse class="justify-content-end">
                    <Navbar.Text>
                        <AuthButton />
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>

            <Switch>
                <Route path="/home">
                    <Home />
                </Route>
                <PrivateRoute path="/roulette">
                    <Roulette />
                </PrivateRoute>
                <PrivateRoute path="/crash">
                    <Crash />
                </PrivateRoute>
                <PrivateRoute path="/jackpot">
                    <Jackpot />
                </PrivateRoute>
            </Switch>
        </Router>
    );
}

const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
        fakeAuth.isAuthenticated = true;
        setTimeout(cb, 100); // fake async
    },
    signout(cb) {
        fakeAuth.isAuthenticated = false;
        setTimeout(cb, 100);
    }
};

function NavLinks() {
    useHistory();

    return fakeAuth.isAuthenticated ? (
        <Nav className="mr-auto">
            <Link class="nav-link" to="/roulette">Roulette</Link>
            <Link class="nav-link" to="/crash">Crash</Link>
            <Link class="nav-link" to="/jackpot">Jackpot</Link>
        </Nav>
    ) : (
        <Nav className="mr-auto"/>
    );
}

function AuthButton() {
    let history = useHistory();

    return fakeAuth.isAuthenticated ? (
        <Button variant="outline-primary" onClick={() => {fakeAuth.signout(() => history.push("/home"));}}>
            Déconnexion
        </Button>
    ) : (
        <LoginButton/>
    );
}

function PrivateRoute({children}) {
    return (
        <Route
            render={({location}) =>
                fakeAuth.isAuthenticated ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/home",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}

function Home() {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <h1>Bienvenue</h1>
                </Col>
            </Row>
        </Container>
    );
}

function Roulette() {
    return <h3>Roulette</h3>;
}

function Crash() {
    return <h3>Crash</h3>;
}

function Jackpot() {
    return <h3>Jackpot</h3>;
}

function LoginButton() {
    let history = useHistory();
    let location = useLocation();

    let { from } = location.state || { from: { pathname: "/home" } };

    let login = () => {
        fakeAuth.authenticate(() => {
            history.replace(from);
        });
    };

    return (
        <Button variant="outline-primary" onClick={login}>Connexion</Button>
    );
}
