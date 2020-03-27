import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from "./App";
import AuthContextProvider from "./context/AuthContext";

ReactDOM.render(
    <AuthContextProvider>
        <App/>
    </AuthContextProvider>,
    document.getElementById('root')
);

// If you want your chat to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
