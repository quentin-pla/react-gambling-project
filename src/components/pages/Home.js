import {Container, Row, Col} from "react-bootstrap";
import React from "react";
import {useAuth} from "../../context/AuthContext";

function Home() {
    const isAuthenticated = useAuth().authenticated;
    const username = useAuth().username;

    return (
        <Container className="flex-center position-ref full-height" fluid>
            <Row className="justify-content-md-center">
                <Col className="col-12 text-center">
                    <h1 className="display-3">{isAuthenticated ? "Bienvenue " + username : "Bienvenue"}</h1>
                </Col>
                <Col className="col-12 text-center">
                    <h3 className="text-muted">{isAuthenticated ? "Jouez dès maintenant." : "Connectez-vous pour commencer à jouer."}</h3>
                </Col>
            </Row>
        </Container>
    );
}

export default Home;
