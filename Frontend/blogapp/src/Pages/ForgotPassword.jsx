import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConnect";
import { toast } from "react-toastify";
import SendCodeValidator from "./Validators/SendCodeValidator"
import RecoverCodeValidator from "./Validators/RecoverCodeValidator"

const initialFormData = {
    email: '',
    code: '',
    password: ''
};

const initialFormError = {
    email: '',
    code: '',
    password: '',
};

const ForgotPassword = () => {

    const [formData, setFormData] = useState(initialFormData);
    const [formError, setFormError] = useState(initialFormError);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [hasEmail, setHasEmail] = useState(false)
    const [emailError, setEmailError] = useState("")

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        const errors = SendCodeValidator({ email: formData.email });
        if (errors.email) {
            setEmailError(errors.email)
            return
        } else {
            try {
                setLoading(true);
                const response = await axios.post('/auth/forgot-password-code', { email: formData.email });
                const data = response.data;
                setHasEmail(true)

                toast.success(data.message)
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setFormError(initialFormError);
                // Safely handle response errors
                const response = error.response;
                const data = response?.data.data || { message: "User not found" };
                toast.error(data.message);
            }
        }
    }

    const handleRecoverPassword = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        const errors = RecoverCodeValidator({ code: formData.code, password: formData.password }); // Validate the form
        if (errors.code || errors.password) {
            setFormError(errors);
        } else {
            try {
                setLoading(true);

                const response = await axios.post('/auth/recover-password', formData);

                const data = response.data;
                toast.success(data.message,
                );

                setFormData(initialFormData); // Reset form data on success
                setFormError(initialFormError); // Reset form errors on success

                setLoading(false);
                navigate("/signin");
                // window.localStorage.setItem("blogData", JSON.stringify(data.data));
            } catch (error) {
                setLoading(false);

                // Safely handle response errors
                const response = error.response;
                const data = response?.data || { message: "Something went wrong, please try again." };

                toast.error(data.message);
            }
        }
    };


    return (
        <div><h1>{`${!hasEmail ? "RecoverPassword" : "NewPassword"}`}</h1>
            <form onSubmit={!hasEmail ? handleSendCode : handleRecoverPassword}>

                {!hasEmail ? (
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
                        {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
                    </div>

                ) : (
                    <>
                        <div className="mb-6">
                            <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Code</label>
                            <input
                                type="number"
                                id="code"
                                name="code"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="123456" value={formData.code}
                                onChange={handleChange}

                            />
                            {formError.code && <p className="text-red-500 text-xs">{formError.code}</p>}
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
                    </>
                )}




                <input
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 ring-2 ring-blue-500"
                    value={loading ? "loading..." : "Send"}
                />
            </form>
        </div>
    )
}

export default ForgotPassword