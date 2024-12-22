import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { verifyToken } from "../services/api";

interface User {
    email: string;
    name: string;
    profile: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    token: string | null;
    setToken: (token: string) => void;
    signOut: () => void; // Added signOut function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("rbuddy_authToken"));

    // Verify token on load
    useEffect(() => {
        const validateToken = async () => {
            if (!token) return;
            try {
                const data = await verifyToken(token);
                setUser(data.user);
            } catch {
                localStorage.removeItem("rbuddy_authToken");
                setToken(null);
                setUser(null);
            }
        };
        validateToken();
    }, [token]);

    const signOut = () => {
        localStorage.removeItem("rbuddy_authToken"); // Remove token from localStorage
        setToken(null); // Reset token state
        setUser(null); // Reset user state
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
