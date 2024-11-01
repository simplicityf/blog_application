import { useNavigate } from "react-router-dom";
import { useAuth } from "../Components/context/useAuth";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from 'axios'; // To make requests

const Google = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    // Fetch user data from backend after Google login
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Make a request to verify the token stored in the cookie
                const response = await axios.get("/auth/verify-token", { withCredentials: true });

                const { user } = response.data;
                
                if (user) {
                    login(user); // Log in the user
                    window.localStorage.setItem("blogData", JSON.stringify(user)); // Save user to localStorage
                    toast.success("Login successful!");
                    navigate('/post');
                }
            } catch (error) {
                console.error("error", error)
                toast.error("Failed to authenticate user.");
            }
        };

        fetchUserData();
    }, [login, navigate]);

    const handleClick = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        try {
            // Redirect user to Google Sign-In route
            window.location.href = "http://localhost:4000/auth/google";
        } catch (error) {
            console.log(error)
            toast.error("Login failed, please try again.");
        } finally {
            setLoading(false); // Always stop loading
        }
    };

    return (
        <div className="pt-20 text-center">
            <h4 className="mb-10">Are you sure you want to proceed? </h4>
            <button
                type="button"
                className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={handleClick}
            >
                {`${loading ? 'loading...' : 'Confirm '}`}
            </button>
        </div>
    );
};

export default Google;
