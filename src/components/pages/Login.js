import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {Redirect} from "react-router-dom";
import io from "socket.io-client";
import {useAuth} from "../../context/AuthContext";
import {Form, Button, Card, Container, Row} from "react-bootstrap";

function Login(props) {
    const referer = (props.location.state != null) ? props.location.state.referer : '/';
    const socket = io();
    const auth = useAuth();
    const history = useHistory();
    const [isError, setIsError] = useState(false);

    function postLogin() {
        socket.emit("login", auth.username, auth.password);
        socket.on("auth_info", function(success) {
            if (success) {
                auth.setAuthenticated(true);
            }
            else {
                auth.setAuthenticated(false);
                setIsError(true);
            }
        });
        return false;
    }

    if (auth.authenticated) {
        return <Redirect to={referer} />;
    }

    function handleClick(e) {
        e.preventDefault();
        history.push("/signup");
    }

    return (
        <Container className="flex-center position-ref full-height" fluid>
            <Row className="justify-content-md-center">
                <Card style={{ width: '20rem' }} className="text-center no-boder fade-effect" body>
                    <Card.Img height="150" variant="top" className="mb-4" src={process.env.PUBLIC_URL + '/logo.svg'} />
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control
                                type="text"
                                onChange={e => {
                                    auth.setUsername(e.target.value);
                                }}
                                placeholder="Identifiant"
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Control
                                type="password"
                                onChange={e => {
                                    auth.setPassword(e.target.value);
                                }}
                                placeholder="Mot de passe"
                            />
                        </Form.Group>
                        <Button variant="dark" className="mt-4 border-0" onClick={postLogin} block>
                            Connexion
                        </Button>
                        <Button className="mb-4 text-white purple-gradient border-0" onClick={handleClick} block>
                            Créer un compte
                        </Button>
                    </Form>
                    <Card.Text className="text-danger error-message">{isError ? "Erreur d'authentification" : ""}</Card.Text>
                </Card>
            </Row>
        </Container>
    );
}

export default Login;
