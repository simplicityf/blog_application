import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConnect";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ProfileValidator from "./Validators/Profile Validator";
import { useAuth } from "../Components/context/useAuth";
import ChangePasswordValidator from "./Validators/ChangePasswordValidator";

const initialFormData = {
  name: '',
  email: '',
};

const initialFormError = {
  name: '',
  email: '',
};

const initialFormData2 = {
  oldPassword: '',
  newPassword: '',
};

const initialFormError2 = {
  oldPassword: '',
  newPassword: '',
};

const Settings = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [oldEmail, setOldEmail] = useState(null);
  const { logout } = useAuth();
  const [formData2, setFormData2] = useState(initialFormData2);
  const [formError2, setFormError2] = useState(initialFormError2);
  const [fileId, setFileId] = useState(null); // Single fileId for profile picture
  const [extensionError, setExtensionError] = useState(null);
  const [isDisable, setIsDisable] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = ProfileValidator(formData);
    if (errors.name || errors.email) {
      setFormError(errors);
    } else {
      try {

        setLoading(true);


        let input = formData;
        console.log("FormData before sending:", formData)
        console.log("Submitting user data:", input);

        if (fileId) {
          input = { ...input, file: fileId };
        }

        const response = await axios.put('/auth/update-profile', input); // Include fileId
        const data = response.data.data;
        console.log("Data message", data, data.message, data.user)
        toast.success(data.message);
        setFormError(initialFormError);
        setLoading(false);
        navigate("/profile");

        if (oldEmail !== formData.email) {
          const updatedEmail = formData.email;
          logout();
          toast.success("Logged out successfully, Please Verify your Email");
          navigate("/verify-user", { state: { email: updatedEmail } });
        }
      } catch (error) {
        setLoading(false);
        const response = error.response;
        const data = response?.data || { message: "Something went wrong, please try again." };
        toast.error(data.message);
      }
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get('/auth/current-user');
        const data = response.data.data;
        setFormData({ name: data.user.name, email: data.user.email });
        setOldEmail(data.user.email);
      } catch (error) {
        const data = error.response ? error.response.data : { message: "An error occurred." };
        toast.error(data.message);
      }
    };
    getUser();
  }, []);

  const handleChange2 = (e) => {
    setFormData2((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    const errors = ChangePasswordValidator({
      oldPassword: formData2.oldPassword,
      newPassword: formData2.newPassword,
    });
    if (errors.oldPassword || errors.newPassword) {
      setFormError2(errors);
    } else {
      try {
        setLoading(true);
        const response = await axios.put('/auth/change-password', formData2);
        const data = response.data;
        toast.success(data.message);
        setFormData2(initialFormData2);
        setFormError2(initialFormError2);
        setLoading(false);
        navigate("/post");
      } catch (error) {
        setLoading(false);
        setFormError2(initialFormError2);
        const response = error.response;
        const data = response?.data || { message: "Something went wrong, please try again." };
        toast.error(data.message);
      }
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return; // Exit if no file is selected

    const formInput = new FormData();
    formInput.append('file', file);

    const type = file.type.toLowerCase();
    if (type === 'image/png' || type === 'image/jpg' || type === 'image/jpeg' || type === 'video/mp4') {
      setExtensionError(null);
      setPreviewImage(URL.createObjectURL(file)); // Set preview image URL
      try {
        setLoading(true);
        setIsDisable(true);

        const response = await axios.post('/file/upload', formInput);
        const data = response.data;
        setFileId(data.data._id); // Store the fileId

        toast.success(data.message);
        setIsDisable(false);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setIsDisable(false);
        const data = error.response;
        toast.error(data.message);
      }
    } else {
      setExtensionError("Invalid file type. Only PNG, JPG, JPEG, and MP4 are allowed.");
    }
  };


  return (
    <div className="pt-20">
      <div className="text-left">
        <button
          type="button"
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>

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

        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file">Upload Profile Picture</label>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file"
          type="file"
          name="file"
          onChange={handleFileChange}
        />
        {extensionError && <p className="text-red-500 text-xs"> {extensionError} </p>}
        {previewImage && (
          <div className="mt-4">
            <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
          </div>
        )}


        <input
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-16 mt-10"
          disabled={isDisable}
          value={`${loading ? 'Uploading....' : 'Update'}`}
        />
      </form>

      <div className="inline-flex items-center justify-center w-full">
        <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
        <span className="absolute px-4 text-sm text-gray-400 dark:text-gray-500">Change Password</span>
      </div>

      <form onSubmit={handleSubmit2}>
        <div className="mb-6 mt-8">
          <label htmlFor="oldPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Old Password*</label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Old Password"
            value={formData2.oldPassword}
            onChange={handleChange2}
          />
          {formError2.oldPassword && <p className="text-red-500 text-xs">{formError2.oldPassword}</p>}
        </div>

        <div className="mb-6 mt-8">
          <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password*</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="New Password"
            value={formData2.newPassword}
            onChange={handleChange2}
          />
          {formError2.newPassword && <p className="text-red-500 text-xs">{formError2.newPassword}</p>}
        </div>

        <input
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          value={`${loading ? 'Updating....' : 'Update Password'}`}
        />
      </form>
    </div>
  );
};

export default Settings;
