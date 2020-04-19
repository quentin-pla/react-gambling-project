import React, {createContext, Component} from 'react';
import socket from "./SocketIOInstance";

/**
 * Contexte d'authentification
 */
export const AuthContext = createContext();

/**
 * Informations d'authentification
 */
class AuthContextProvider extends Component {

    constructor(props) {
        super(props);

        /**
         * Récupération du pseudo sauvegardé
         */
        const prevUsername = window.localStorage.getItem('username') || "";
        /**
         * Récupération du mot de passe sauvegardé
         */
        const prevPassword = window.localStorage.getItem('password') || "";

        /**
         * Initialisation de l'état
         */
        this.state = {
            //État de connexion
            authenticated: false,
            //Pseudo
            username: prevUsername,
            //Mot de passe
            password: prevPassword,
            //Argent
            money: 0,
            //Modifier l'état de connexion
            setAuthenticated: this.setAuthenticated.bind(this),
            //Modifier le pseudo
            setUsername: this.setUsername.bind(this),
            //Modifier le mot de passe
            setPassword: this.setPassword.bind(this),
            //Modifier l'argent
            setMoney: this.setMoney.bind(this),
            //Déconnecter l'utilisateur
            disconnect: this.disconnect.bind(this)
        };
    }

    /**
     * Initialisation du composant
     */
    componentDidMount() {
        //Envoi des infos au serveur pour valider l'authentification
        socket.emit("login", this.state.username, this.state.password);
        //Récupération des informations de connexion
        socket.on("auth_info", (success, user) => {
            //Si c'est un succès
            if (success) {
                //Initialisation de l'argent de l'utilisateur
                this.setMoney(user.money);
                //Authentification validée
                this.setAuthenticated(true);
            }
        });
    }

    /**
     * Mettre à jour l'état d'authentification
     * @param value état
     */
    setAuthenticated(value) {
        this.setState({authenticated: value});
        //Sauvegarde de l'état dans l'espace local
        window.localStorage.setItem('authenticated', value);
    }

    /**
     * Mettre à jour le pseudo
     * @param username pseudo
     */
    setUsername(username) {
        this.setState({username: username});
        //Sauvegarde du pseudo dans l'espace local
        window.localStorage.setItem('username', username);
    }

    /**
     * Mettre à jour le mot de passe
     * @param password mot de passe
     */
    setPassword(password) {
        this.setState({password: password});
        //Sauvegarde du mot de passe dans l'espace local
        window.localStorage.setItem('password', password);
    }

    /**
     * Mettre à jour l'argent disponible
     * @param value somme disponible
     */
    setMoney(value) {
        this.setState({money: value});
    }

    /**
     * Déconnexion de l'utilisateur
     */
    disconnect() {
        this.setState({
            //État de connexion à faux
            authenticated: false,
            //Pseudo vide
            username: "",
            //Mot de passe vide
            password: "",
            //Argent par défaut
            money: 0,
        });
        //Suppression du pseudo sauvegardé
        window.localStorage.removeItem('username');
        //Suppression du mot de passe sauvegardé
        window.localStorage.removeItem('password');
    }

    render() {
        //État du composant
        const contextData = this.state;

        return (
            <AuthContext.Provider value={contextData}>
                {this.props.children}
            </AuthContext.Provider>
        );
    }
}

export default AuthContextProvider;
