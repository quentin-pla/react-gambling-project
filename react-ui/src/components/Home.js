import {Container, Row, Col} from "react-bootstrap";
import React, {Component} from "react";
import {AuthContext} from "../context/AuthContext";

class Home extends Component {
    /**
     * Contexte d'authentification
     */
    static contextType = AuthContext;

    render() {
        const auth = this.context;

        return (
            <Container className="flex-center position-ref full-height" fluid>
                <Row className="justify-content-md-center">
                    <Col className="col-12 text-center">
                        <h1 className="display-3">{auth.authenticated ? "Bienvenue " + auth.username : "Bienvenue"}</h1>
                    </Col>
                    <Col className="col-12 text-center">
                        <h3 className="text-muted">{auth.authenticated ? "Jouez dès maintenant." : "Connectez-vous pour commencer à jouer."}</h3>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Home;
