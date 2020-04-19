import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {Form, Button, Card, Container, Row} from "react-bootstrap";
import {withRouter} from 'react-router-dom';
import socket from "../../context/SocketIOInstance";
import {AuthContext} from "../../context/AuthContext";

/**
 * Connexion
 */
class Login extends Component {
    /**
     * Contexte d'authentification
     */
    static contextType = AuthContext;

    constructor(props,context) {
        super(props,context);

        /**
         * Initialisation de l'état
         * @type {{isError: boolean}}
         */
        this.state = {
            //Erreur d'authentification
            isError: false
        };

        this.postLogin = this.postLogin.bind(this);
        this.submitLoginEnter = this.submitLoginEnter.bind(this);
    }

    /**
     * Demande d'authentification
     */
    postLogin() {
        //Envoi des infos au serveur pour valider l'authentification
        socket.emit("login", this.context.username, this.context.password);
        //Récupération des informations de connexion
        socket.on("auth_info", (success, user) => {
            //Si c'est un succès
            if (success) {
                //Initialisation de l'argent de l'utilisateur
                this.context.setMoney(user.money);
                //Authentification validée
                this.context.setAuthenticated(true);
            }
            else {
                //Authentification invalide
                this.context.setAuthenticated(false);
                //Erreur
                this.setState({isError: true});
            }
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
                        <Card.Img height="150" variant="top" className="mb-4"
                                  src={process.env.PUBLIC_URL + '/logo.svg'}/>
                        <Form id="loginform">
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control
                                    type="text"
                                    onChange={e => this.context.setUsername(e.target.value)}
                                    placeholder="Identifiant"
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Control
                                    type="password"
                                    onChange={e => this.context.setPassword(e.target.value)}
                                    onKeyPress={e => this.submitLoginEnter(e)}
                                    placeholder="Mot de passe"
                                />
                            </Form.Group>
                            <Button variant="dark" className="mt-4 border-0" onClick={this.postLogin} block>
                                Connexion
                            </Button>
                            <Button className="mb-4 text-white navbar-top border-0" onClick={() => this.props.history.push("/signup")} block>
                                Créer un compte
                            </Button>
                        </Form>
                        <Card.Text
                            className="text-danger error-message">{this.state.isError ? "Erreur d'authentification" : ""}</Card.Text>
                    </Card>
                </Row>
            </Container>
        );
    }
}

//withRouter pour récupérer l'historique
export default withRouter(Login);
