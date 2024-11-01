import { useContext } from "react";
import { AuthContext } from './AuthContext';

export const useAuth = () => {
    const context = useContext(AuthContext);
    
    // Ensure that useAuth is being used within an AuthProvider
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const { isAuthenticated, user, login, signup, logout } = context;
    return { isAuthenticated, user, login, signup, logout };
};
