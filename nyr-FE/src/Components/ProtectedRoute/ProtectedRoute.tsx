import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    setTimeout(() => {
        if (!user) {
            return <Navigate to="/" />;
        }
    }, 50);


    return <>{children}</>;
};

export default ProtectedRoute;
