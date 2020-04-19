import React, {Component} from "react";
import {Redirect, Route} from 'react-router-dom';
import {AuthContext} from "../../context/AuthContext";

class PrivateRoute extends Component {
    /**
     * Contexte d'authentification
     */
    static contextType = AuthContext;

    render() {
        return (
            <Route>
                {this.context.authenticated ? this.props.children : <Redirect to={{pathname: "/login"}}/>}
            </Route>
        );
    }
}

export default PrivateRoute;
