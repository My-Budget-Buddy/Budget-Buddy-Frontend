import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuthentication } from "../contexts/AuthenticationContext";

interface PrivateRouteProps {
    element: React.ReactElement;
    path: string;
}

const PrivateRoute = ({ element, path }: PrivateRouteProps) => {
    const { isAuthenticated } = useAuthentication();

    return isAuthenticated ? <Route path={path} element={element} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
