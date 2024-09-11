import type { User } from "../types/models";

import Cookies from "js-cookie";

import { Dispatch, SetStateAction, useState, createContext, useEffect, useContext } from "react";

interface Authorization {
    loading: boolean;
    jwt: string | null;
    setJwt: Dispatch<SetStateAction<string | null>>;
    logout: () => void;
    isAuthenticated: boolean;
    profile: User | null;
    setProfile: Dispatch<SetStateAction<User | null>>;
}

const AuthenticationContext = createContext<Authorization>({
    loading: true,
    jwt: null,
    setJwt: () => { },
    logout: () => { },
    isAuthenticated: false, // NOTE This is deprecated. A network request is used to validate in LandingLayout.
    profile: null,
    setProfile: () => { },
});

export const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [jwt, setJwt] = useState<string | null>(null);
    const [profile, setProfile] = useState<User | null>(null);

    // check for an existing JWT in the user's cookies and sync it to state
    useEffect(() => {
        if (typeof window === "undefined") return;

        const jwtCookie = Cookies.get("jwt");
        if (jwtCookie) {
            setJwt(jwtCookie);
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }

        // TODO: should be placed after query for user info fails or succeeds in the future
        setLoading(false);
    }, []);

    useEffect(() => {
        if (jwt) {
            // make a network request to get profile information
            fetch("http://localhost:8125/users/user", { headers: { Authorization: `Bearer ${jwt}` } })
                .then(res => {
                    if (res.ok) return res.json().then((user: User) => setProfile(user))
                    else console.log("[AuthContext]: error fetching user information")
                })
                .catch((error) => console.log("[AuthContext]:", error))
        }
    }, [jwt]);

    useEffect(() => {
        console.log("[AuthContext - profile]:", profile)
    }, [profile])

    const logout = () => {
        Cookies.remove("jwt"); // in production we'll have to specify the domain
        setJwt(null);
        window.location.reload(); // Force window refresh
    };

    return (
        <AuthenticationContext.Provider value={{ loading, jwt, setJwt, logout, isAuthenticated, profile, setProfile }}>
            {children}
        </AuthenticationContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthentication = () => {
    return useContext(AuthenticationContext);
};
