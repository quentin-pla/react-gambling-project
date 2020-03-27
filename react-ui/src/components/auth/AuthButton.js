import {useAuth} from "../../context/AuthContext";
import {Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import React from "react";

export default function AuthButton() {
    const history = useHistory();
    const auth = useAuth();

    function handleClick(e) {
        e.preventDefault();
        if(auth.authenticated) {
            auth.setAuthenticated(false);
            auth.setUsername(null);
            auth.setPassword(null);
            history.push("/");
        }
        else {
            history.push("/login");
        }
    }

    return auth.authenticated ? (
        <Button variant="outline-light" onClick={handleClick}>Déconnexion</Button>
    ) : (
        <Button variant="outline-light" onClick={handleClick}>Connexion</Button>
    );
}
