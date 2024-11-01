import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import SignUpValidator from "./Validators/SignUpValidator";
import axios from "../utils/axiosConnect";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../Components/context/useAuth";

const initialFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
};

const initialFormError = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
};


const Signup = () => {

    const [formData, setFormData] = useState(initialFormData);
    const [formError, setFormError] = useState(initialFormError);
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth(); // Get login method from AuthContext
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const errors = SignUpValidator(formData); // Validate form
        if (errors.name || errors.email || errors.password || errors.confirmPassword) {
            setFormError(errors);
            return; // Exit early if there are validation errors
        }
    
        try {
            setLoading(true);
            const requestBody = {
                name: formData.name,
                email: formData.email,
                password: formData.password
            };
    
            const response = await axios.post("/auth/signup", requestBody);
            const data = response.data.data;
    
            console.log("User data", data);
    
            // Show success message based on the backend response
            toast.success(data.message);
    
            const userForContext = data;
            console.log("UserForContext", userForContext);
            window.localStorage.setItem("blogData", JSON.stringify(userForContext));
    
            signup(userForContext);
    
            setFormData(initialFormData); // Reset form
            setFormError(initialFormError); // Reset errors
            setLoading(false);
            
            // Redirect to the verify page
            navigate("/verify-user");
        } catch (error) {
            setLoading(false);
            // Handle errors based on the error structure
            const response = error.response;
            const data = response?.data || { message: "Something went wrong, please try again." };
    
            // If the error was due to the email sending issue but user was created
            if (data.message.includes("issue sending")) {
                toast.warn(data.message); // Use a warning instead of error for clarity
            } else {
                toast.error(data.message);
            }
        }
    };
    


    return (
        <div className="pt-20">
            <form onSubmit={handleSubmit}>
                <div className="mb-6 mt-8">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name*</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="John"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {formError.name && <p className="text-red-500 text-xs">{formError.name}</p>}
                </div>

                <div className="mb-6 mt-8">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email Address*</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="john.doe@company.com"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {formError.email && <p className="text-red-500 text-xs">{formError.email}</p>}
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password*</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="•••••••••"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {formError.password && <p className="text-red-500 text-xs">{formError.password}</p>}
                </div>

                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password*</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="•••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    {formError.confirmPassword && <p className="text-red-500 text-xs">{formError.confirmPassword}</p>}
                </div>

                <input
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 ring-2 ring-blue-500"
                    value={loading ? "Saving..." : "Signup"}
                />

                <p className="mt-6 text-cyan-950">
                    Already have an account? <span className="text-cyan-500">
                        <NavLink to='/signin'> signin </NavLink>
                    </span>
                </p>

            </form>
        </div>
    );
};

export default Signup;
