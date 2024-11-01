import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../Components/context/useAuth";
import { useState, useEffect } from "react";
import justblog from "../../assets/images/just_blog.jpg"
import axios from "../../utils/axiosConnect"
const PrivateNavBar = () => {
  const { logout, user, } = useAuth();
  console.log("User email in navbar", user.email)
  const navigate = useNavigate();// Get logout function from useAuth
  const [fileUrl, setFileUrl] = useState(null)
  const [cuser, setcUser] = useState(null);

  const handleLogout = () => {

    logout();

    toast.success("Logged out successfully!");
    navigate("/signin"); // Navigate to the sign-in page immediately
  };

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
  // console.log("cuser", cuser)

  // console.log("This is User file Key:", cuser?.profilePic?.key);

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

  // console.log("File Url", fileUrl, "span")

  return (
    <div>

      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={justblog} className="h-8" alt="Flowbite Logo" />
            <span className="self-center text-2xl text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">JustBlog </span>
          </a>
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button type="button" className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
              <span className="sr-only">Open user menu</span>

              <img className="w-8 h-8 rounded-full" src={fileUrl} alt="user photo" />
            </button>
            {/* <!-- Dropdown menu --> */}
            <div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
              {user && <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">{user.name}</span>
                <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">{user.email}</span>
              </div>
              }
              <ul className="py-2" aria-labelledby="user-menu-button">
                <li>
                  <NavLink to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Profile</NavLink>
                </li>
                <li>
                  <NavLink to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Settings</NavLink>
                </li>
                {(user.role === 'vip' || user.role === 'admin') && (
                  <>
                    <li>
                      <NavLink
                        to="/post/add-post"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Add Post
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/admin-category"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Categories
                      </NavLink>
                    </li>
                  </>
                )}
                <li>
                  <NavLink to="/signin" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 me-2 mb-2 ml-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={handleLogout}>Sign out</NavLink>

                </li>
              </ul>
            </div>
            <button data-collapse-toggle="navbar-user" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-user" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
          </div>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <NavLink to="/post" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 hover:scale-125 nav-link">Posts</NavLink>
              </li>
              <li>
                <NavLink to="/categories" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 hover:scale-125 nav-link">Categories</NavLink>
              </li>

              <li>
                <NavLink to="/about" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 hover:scale-125 nav-link">About</NavLink>
              </li>

            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default PrivateNavBar