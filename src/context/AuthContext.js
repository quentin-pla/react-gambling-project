import React, {useState, createContext, useContext} from 'react';

export const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthContextProvider = ({children}) => {
    const prevAuth = window.localStorage.getItem('authenticated') || false;
    const prevUsername = window.localStorage.getItem('username') || null;
    const prevPassword = window.localStorage.getItem('password') || null;
    const [authenticated, setAuthenticated] = useState(prevAuth);
    const [username, setUsername] = useState(prevUsername);
    const [password, setPassword] = useState(prevPassword);

    const defaultContext = {
        authenticated, setAuthenticated,
        username, setUsername,
        password, setPassword
    };

    return (
        <AuthContext.Provider value={defaultContext}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
