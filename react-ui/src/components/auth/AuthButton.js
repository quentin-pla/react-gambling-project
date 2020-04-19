import {AuthContext} from "../../context/AuthContext";
import {Button} from "react-bootstrap";
import React, {Component} from "react";
import {withRouter} from 'react-router-dom';

/**
 * Bouton connexion/déconnexion
 */
class AuthButton extends Component {
    /**
     * Contexte d'authentification
     */
    static contextType = AuthContext;

    /**
     * Évènement lorsque l'utilisateur appuie sur le bouton
     * @param e évènement
     */
    handleClick(e) {
        e.preventDefault();
        //Si l'utilisateur est authentifié
        if(this.context.authenticated) {
            //Déconnexion de l'utilisateur
            this.context.disconnect();
            //Redirection vers la page d'accueil
            this.props.history.push("/");
        }
        //Redirection vers la page de connexion
        else this.props.history.push("/login");
    }

    render() {
        return this.context.authenticated ? (
            <Button variant="outline-light" onClick={(e) => this.handleClick(e)}>Déconnexion</Button>
        ) : (
            <Button variant="outline-light" onClick={(e) => this.handleClick(e)}>Connexion</Button>
        );
    }
}

export default withRouter(AuthButton);
