import { NavLink, useNavigate} from "react-router-dom";
import { useAuth } from "../Components/context/useAuth";
import { useState, useEffect } from "react";
import axios from "../utils/axiosConnect"
import { toast } from "react-toastify";

const Profile = () => {
    const { user } = useAuth(); // Get user from useAuth
    const navigate = useNavigate(); // Get navigate function from useAuth
    const [fileUrl, setFileUrl] = useState(null)
    const [cuser, setcUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {

                const response = await axios.get("/auth/current-user");
                const data = response.data.data;

                // console.log("Current User", data)

                setcUser(data)

            } catch (error) {

                const data = error.response ? error.response.data : { message: "An error occurred." };
                toast.error(data.message);
                console.error('Get category error:', error); // Log the error for debugging
            }
        };
        getUser();
    }, []);
    console.log("cuser", cuser)

    console.log("This is User file Key:", cuser?.profilePic?.key);
    
    useEffect(() => {
        if (cuser && cuser?.user?.profilePic?.key) {
    
          console.log("This is File Key:", cuser?.user?.profilePic?.key);
    
          const getFile = async () => {
            try {
              const response = await axios.get(`/file/signed-url?key=${cuser.user.profilePic.key}`);
              const data = response.data.data

              console.log("File url for data", data)

              setFileUrl(data);
            } catch (error) {
              const data = error.response ? error.response.data : { message: "An error occurred." };
              toast.error(data.message);
              console.error('Get file error:', error); // Log the error for debugging
            }
          }; getFile()
        }
      }, [cuser])
    
      console.log("File Url", fileUrl, "span")
    

    return (
        <div className="pt-20">
            <div className="text-left mt-5">
                <button
                    type="button"
                    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </button>
            </div>
            <div className="flex items-center justify-center">
                <div className="w-full max-w-96 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex flex-col items-center pb-10">
                        <img
                            className="w-24 h-24 mb-3 mt-6 rounded-full shadow-lg"
                            src={fileUrl}
                            alt="Profile"
                        />
                        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user.name}</h5>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
                        <div className="flex mt-4 md:mt-6">
                            <NavLink
                                to="/settings"
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Change Profile
                            </NavLink>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
