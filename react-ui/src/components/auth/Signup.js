import React, {Component} from "react";
import {Link, Redirect} from 'react-router-dom';
import {Card, Form, Button, Row, Container} from "react-bootstrap";
import socket from "../../context/SocketIOInstance";
import {AuthContext} from "../../context/AuthContext";

/**
 * Inscription
 */
class Signup extends Component {
    /**
     * Contexte d'authentification
     */
    static contextType = AuthContext;

    constructor(props,context) {
        super(props,context);

        //Initialisation de l'état
        this.state = {
            //Erreur d'inscription
            isError: false,
            //Message d'erreur
            errorMessage: "",
            //Confirmation du mot de passe
            password_confirm: ""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitLoginEnter = this.submitLoginEnter.bind(this);
    }

    /**
     * Vérifier qu'un texte est alphanumérique
     * @param text
     */
    isAlphanumeric(text) {
        //Si le texte n'est pas définit
        if (text === null) return false;
        //Syntaxe autorisée
        const syntax = /^[0-9a-zA-Z]+$/;
        //Renvoi vrai si le texte respecte la syntaxe
        return text.match(syntax);
    }

    /**
     * Demande d'inscription
     */
    handleSubmit() {
        //Vérification du pseudo
        let usernameCheck = (
            this.context.username.length >= 3 &&
            this.isAlphanumeric(this.context.username)
        );
        //Vérifications du mot de passe
        let passwordCheck = this.context.password.length >= 3;
        //Vérification de la confirmation du mot de passe
        let confirmCheck = this.context.password === this.state.password_confirm;
        //Validation du pseudo
        if (!usernameCheck) {
            this.setState({isError: true, errorMessage: "Pseudo invalide"});
            return false;
        }
        //Validation du mot de passe
        if (!passwordCheck) {
            this.setState({isError: true, errorMessage: "Mot de passe invalide"});
            return false;
        }
        //Validation de la confirmation
        if (!confirmCheck) {
            this.setState({isError: true, errorMessage: "Confirmation invalide"});
            return false;
        }
        //Émission d'une demande d'inscription
        socket.emit("signup", this.context.username, this.context.password);
        //Récupération des informations d'inscription
        socket.on("auth_info", (success, user, errorMessage) => {
            //Si c'est un succès
            if (success) {
                //Initialisation de l'argent de l'utilisateur
                this.context.setMoney(user.money);
                //Authentification validée
                this.context.setAuthenticated(true);
            }
            //Affichage d'une erreur
            else this.setState({isError: true, errorMessage: errorMessage});
        });
        return false;
    }

    /**
     * Connexion en appuyant sur entrée
     * @param event touche du clavier
     */
    submitLoginEnter(event) {
        if (event.which === 13) this.postLogin();
    }

    render() {
        //Si l'utilisateur est authentifié, redirection vers la page d'accueil
        if (this.context.authenticated) return <Redirect to="/"/>;

        return (
            <Container className="flex-center position-ref full-height" fluid>
                <Row className="justify-content-md-center">
                    <Card style={{width: '20rem'}} className="text-center no-boder fade-effect" body>
                        <Card.Title className="display-4 text-left mb-4">
                            Inscription
                        </Card.Title>
                        <Form noValidate validated={this.state.validated}>
                            <Form.Group>
                                <Form.Control
                                    required
                                    type="text"
                                    min="3"
                                    onChange={e => {
                                        this.context.setUsername(e.target.value);
                                    }}
                                    placeholder="Identifiant"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    required
                                    type="password"
                                    min="3"
                                    onChange={e => {
                                        this.context.setPassword(e.target.value);
                                    }}
                                    placeholder="Mot de passe"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    required
                                    type="password"
                                    min="3"
                                    onChange={e => {
                                        this.setState({password_confirm: e.target.value});
                                    }}
                                    onKeyPress={e => this.submitLoginEnter(e)}
                                    placeholder="Confirmation"
                                />
                            </Form.Group>
                            <Button variant="dark" className="mt-4 mb-4" onClick={this.handleSubmit} block>
                                Valider
                            </Button>
                        </Form>
                        <Link to="/login">Vous avez déjà un compte ?</Link>
                        <Card.Text
                            className="text-danger error-message mt-3">{this.state.isError ? this.state.errorMessage : ""}</Card.Text>
                    </Card>
                </Row>
            </Container>
        );
    }
}

export default Signup;
