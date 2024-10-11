import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../utils/redux/hooks";

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const isAuthenticated = useAppSelector((store) => store.auth.isAuthenticated);
    console.log("isAuthenticated: ", isAuthenticated);
    if (isAuthenticated) {
        return <>{children}</>;
    } else {
        return <Navigate to="/login" replace />;
    }
};
