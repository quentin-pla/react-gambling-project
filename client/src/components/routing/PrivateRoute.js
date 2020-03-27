import React from "react";
import {Redirect, Route} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext';

function PrivateRoute({ component: Component, ...rest }) {
    const isAuthenticated = useAuth().authenticated;

    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{ pathname: "/login", state: { referer: props.location } }}
                    />
                )
            }
        />
    );
}

export default PrivateRoute;

