import React from "react";
import {Redirect, Route} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext';

function PrivateRoute({children}) {
    const isAuthenticated = useAuth().authenticated;

    return (
        <Route>
            {isAuthenticated ? children : <Redirect to={{pathname: "/login"}}/>}
        </Route>
    );
}

export default PrivateRoute;
