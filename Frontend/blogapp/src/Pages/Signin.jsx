import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "../utils/axiosConnect";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import SigninValidator from "./Validators/SigninValidator";
import { useAuth } from "../Components/context/useAuth";

const initialFormData = {
    email: '',
    password: '',
};

const initialFormError = {
    email: '',
    password: '',
};

const Signin = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [formError, setFormError] = useState(initialFormError);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth(); // Get login method from AuthContext

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        // Validate the form inputs
        const errors = SigninValidator(formData);

        if (errors.email || errors.password) {
            setFormError(errors);
            setLoading(false); // Stop loading if there are errors
            return;
        }

        try {
            const response = await axios.post("/auth/signin", formData);
            const data = response.data.data; // Ensure this structure is correct
            console.log("Log in user data", data);

            if (!data.user.isVerified) {
                toast.error("Please verify your email before logging in.");
                navigate("/verify-user"); // Redirect to email verification
            } else {
                login(data); // Pass the correct data to the login function
                window.localStorage.setItem("blogData", JSON.stringify(data)); // Save the whole data

                toast.success(data.message);
                setFormData(initialFormData); // Reset form data on success
                setFormError(initialFormError); // Reset form errors on success

                navigate('/post'); // Redirect to post page after successful login
            }
        } catch (error) {
            const response = error.response;
            const data = response?.data?.data || { message: "Invalid Credential, please try again." };
            toast.error(data.message);
        } finally {
            setLoading(false); // Always stop loading
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <h5 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h5>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {formError.email && <p className="text-red-500 text-xs">{formError.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {formError.password && <p className="text-red-500 text-xs">{formError.password}</p>}
                    </div>

                    <div className="flex items-start">
                        <NavLink to="/forgot-password" className="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500">Lost Password?</NavLink>
                    </div>

                    <input
                        type="submit"
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        value={loading ? "Loading..." : "Login to your account"}
                    />

                    {/* <div className="inline-flex items-center justify-center w-full">
                        <hr className="w-64 h-px bg-gray-200 border-0 dark:bg-gray-700" />
                        <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">or</span>
                    </div>

                    <button type="button" className="w-full text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2" onClick={() => navigate("/google")}>
                        <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                            <path fillRule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clipRule="evenodd" />
                        </svg>
                        Sign in with Google
                    </button> */}
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                        Not registered? <NavLink to="/signup" className="text-blue-600">signup</NavLink>
                    </div>
                </form>


            </div>
        </div>
    );
};

export default Signin;
