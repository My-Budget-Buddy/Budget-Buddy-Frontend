import { ReactNode, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { useAuthentication } from "../contexts/AuthenticationContext";

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    // const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const { jwt } = useAuthentication();
    if (jwt) {
        return <>{children}</>;
    } else {
        return <Navigate to="/" replace />;
    }
};
