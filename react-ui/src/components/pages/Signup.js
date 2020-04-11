import React, {useState} from "react";
import {Redirect, Link } from 'react-router-dom';
import io from "socket.io-client";
import {useAuth} from "../../context/AuthContext";
import {Card, Form, Button, Row, Container} from "react-bootstrap";

function Signup(props) {
    const socket = io();
    const auth = useAuth();

    const [isError, setIsError] = useState(false);
    const [password_confirm, setPasswordConfirm] = useState("");

    //Fonction pour envoyer les infos pour l'inscription
    function postSignup() {
        //Vérification que les deux mots de passe correspondent
        if (auth.password === password_confirm) {
            //Émission d'un message avec les infos
            socket.emit("signup", auth.username, auth.password);
            //Lors de la réception d'un message de succès d'authentification
            socket.on("signup_info", function (success, user) {
                if (success) {
                    props.onUpdateUserData(user.username, user.money);
                    auth.setAuthenticated(true);
                }
                else setIsError(true);
            });
        }
        else
            //Détection d'un problème
            setIsError(true);
        return false;
    }

    if (auth.authenticated) {
        return <Redirect to="/" />;
    }

    return (
        <Container className="flex-center position-ref full-height" fluid>
            <Row className="justify-content-md-center">
                <Card style={{ width: '20rem' }} className="text-center no-boder fade-effect" body>
                    <Card.Title className="display-4 text-left mb-4">
                        Inscription
                    </Card.Title>
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
                        <Form.Group controlId="formBasicPassword">
                            <Form.Control
                                type="password"
                                onChange={e => {
                                    setPasswordConfirm(e.target.value);
                                }}
                                placeholder="Confirmation"
                            />
                        </Form.Group>
                        <Button variant="dark" className="mt-4 mb-4" onClick={postSignup} block>
                            Valider
                        </Button>
                    </Form>
                    <Link to="/login">Vous avez déjà un compte ?</Link>
                    { isError && <h3 color={"danger"}>Erreur lors de l'inscription.</h3> }
                </Card>
            </Row>
        </Container>
    );
}

export default Signup;
