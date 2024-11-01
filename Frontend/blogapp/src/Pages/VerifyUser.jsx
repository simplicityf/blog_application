import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../utils/axiosConnect";
import { toast } from "react-toastify";
import { useAuth } from "../Components/context/useAuth";
import CodeValidator from "./Validators/CodeValidator";

const initialFormData = {
  code: '',
};

const initialFormError = {
  code: '',
};

const VerifyUser = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth(); // Access the logged-in user from context
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);

  const emailToVerify = location.state?.email; // Use email from state or user context

  console.log("User email", user?.email)
  // Get user's email from context if available, otherwise use the email from the URL state.
   // Get user's email from context

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    console.log("Handle Verify Triggered", formData);
  
    const errors = CodeValidator({ code: formData.code });
  
    if (errors.code) {
      setFormError(errors);
      console.log("Validation Errors:", errors);
      return; // Exit early if there are validation errors
    }
  
    try {
      const emailToVerify = user?.email || location.state?.email;
      if (!emailToVerify) {
        toast.error("Email not provided for verification.");
        return;
      }
  
      setLoading(true);
      console.log("Sending verification code", formData.code, "with email", emailToVerify);
      const response = await axios.post("/auth/verify-user", {
        email: emailToVerify, // Use the correct email for verification
        code: formData.code,
      });
      console.log("API Response", response.data);
  
      toast.success(response.data.message);
      setLoading(false);
      navigate("/signin");
    } catch (error) {
      console.error("Full Error Object:", error); // Log full error for inspection
      const data = error.response?.data || {}; // Safely access response data
      toast.error(data.message || "Verification failed. Please try again.");
      setLoading(false); // Ensure loading state is reset on error
    }
  };
  
  return (
    <div className="pt-20">
      <h1 className="mb-10 text-center">Verify Your Email</h1>
      <form onSubmit={handleVerify}>
        <p>
          A verification code was sent to <strong>{user?.email || emailToVerify}</strong>. Please enter the code below to proceed.
        </p>

        <div>
          <label htmlFor="code" className="block mb-4 mt-8 text-lg font-medium text-gray-900 dark:text-white">Enter Code</label>
          <input
            type="number"
            name="code"
            id="code"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white mb-10"
            placeholder="Enter verification code"
            value={formData.code}
            onChange={handleChange}
          />
          {formError.code && <p className="text-red-500 text-xs">{formError.code}</p>}
        </div>

        <input
          type="submit"
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          value={loading ? "Verifying..." : "Verify your account"}
        />
      </form>
    </div>
  );
};

export default VerifyUser;
