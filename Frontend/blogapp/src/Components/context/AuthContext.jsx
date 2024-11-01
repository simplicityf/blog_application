import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = window.localStorage.getItem("blogData");
        console.log("Retrieved from localStorage:", storedUser); // Log the retrieved data

        // Check if storedUser is valid before parsing
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                console.log("Parsed user data:", parsedUser); // Log the parsed data
                
                // Decode token to check its validity
                const decodedToken = jwtDecode(parsedUser.token);
                const currentTime = Date.now() / 1000; // Get current time in seconds

                if (decodedToken.exp < currentTime) {
                    console.warn("Token has expired."); // Log if token has expired
                    window.localStorage.removeItem("blogData"); // Clear invalid data
                } else {
                    // Token is valid, set user and authentication status
                    setUser(parsedUser.user);
                    if (parsedUser.user.isVerified) {
                        setIsAuthenticated(true);
                    }
                }
            } catch (error) {
                console.error("Error parsing JSON from localStorage:", error);
                window.localStorage.removeItem("blogData"); // Clear invalid data
            }
        } else {
            console.warn("No user data found in localStorage."); // Log if no data found
        }
    }, []);

    const login = (userData) => {
        console.log("Login attempt with userData:", userData); // Log userData on login

        if (userData.user.isVerified === 'false') {
            console.error("User is not verified");
            return { error: "User is not verified", message: "You are not authorized, please sign out and sign in/signup." }; 
        }

        setUser(userData); 
        setIsAuthenticated(true);
        window.localStorage.setItem("blogData", JSON.stringify(userData));
        console.log("User data saved to localStorage:", userData); // Log when saving data
    };

    const signup = (userData) => {
        setUser(userData); 
        window.localStorage.setItem("blogData", JSON.stringify(userData)); 
        console.log("User signed up and data saved to localStorage:", userData); // Log when saving data
    };

    const logout = () => {
        window.localStorage.removeItem("blogData");
        setUser(null);
        setIsAuthenticated(false);
        console.log("User logged out and data removed from localStorage."); // Log logout
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
 