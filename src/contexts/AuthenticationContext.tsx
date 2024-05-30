import Cookies from "js-cookie";

import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction, useState, createContext, useEffect, useContext } from "react";

interface Authorization {
    loading: boolean;
    jwt: string | null;
    setJwt: Dispatch<SetStateAction<string | null>>;
    logout: () => void;
}

const AuthenticationContext = createContext<Authorization>({
    loading: true,
    jwt: null,
    setJwt: () => {},
    logout: () => {}
});

export const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [jwt, setJwt] = useState<string | null>(null);

    // check for an existing JWT in the user's cookies and sync it to state
    useEffect(() => {
        if (typeof window === "undefined") return;

        const jwtCookie = Cookies.get("jwt");
        if (jwtCookie) setJwt(jwtCookie);

        // TODO: should be placed after query for user info fails or succeeds in the future
        setLoading(false);
    }, []);

    useEffect(() => {
        if (jwt) {
            Cookies.set("jwt", jwt);
        }
    }, [jwt]);

    const logout = () => {
        setJwt(null);
        Cookies.remove("jwt");
    };

    return (
        <AuthenticationContext.Provider value={{ loading, jwt, setJwt, logout }}>
            {children}
        </AuthenticationContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthentication = () => {
    return useContext(AuthenticationContext);
};
