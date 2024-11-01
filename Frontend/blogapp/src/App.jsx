import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./Pages/Home"
import Signup from "./Pages/Signup"
import PrivateLayout from "./Components/Layout/PrivateLayout"
import PublicLayout from "./Components/Layout/PublicLayout"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify"
import Signin from './Pages/Signin'
import VerifyUser from "./Pages/VerifyUser"
import { AuthProvider } from "./Components/context/AuthContext"
import GetPosts from "./Pages/Post/GetPosts"
import GetCategories from "./Pages/Category/GetCategories"
import PrivateRoute from "./Routes/PrivateRoute"
import AddCategories from "./Pages/Category/AddCategories"
import UpdateCategories from "./Pages/Category/UpdateCategories"
import AdminCategory from "./Pages/Category/AdminCategory"
import AddPost from "./Pages/Post/AddPost"
import DetailPost from "./Pages/Post/DetailPost"
import UpdatePost from "./Pages/Post/UpdatePost"
import Settings from "./Pages/Settings"
import ForgotPassword from "./Pages/ForgotPassword"
import Profile from "./Pages/Profile"
import About from "./Pages/About"
// import Google from "./Pages/Google"





function App() {


  return (

    <BrowserRouter>
      <AuthProvider>

        <Routes>


          <Route element={<PrivateLayout />}>
            <Route path="post" element={
              <PrivateRoute>
                <GetPosts />
              </PrivateRoute>
            } />

            <Route path="post/add-post" element={
              <PrivateRoute>
                <AddPost />
              </PrivateRoute>
            } />

            <Route path="post/detail-post/:id" element={
              <PrivateRoute>
                <DetailPost />
              </PrivateRoute>
            } />

            <Route path="post/update-post/:id" element={
              <PrivateRoute>
                <UpdatePost />
              </PrivateRoute>
            } />

            <Route path="categories" element={
              <PrivateRoute>
                <GetCategories />
              </PrivateRoute>
            } />
            <Route path="categories/new-category" element={
              <PrivateRoute>
                <AddCategories />
              </PrivateRoute>
            } />
            <Route path="categories/update-category/:id" element={
              <PrivateRoute>
                <UpdateCategories />
              </PrivateRoute>
            } />

            <Route path="admin-category" element={
              <PrivateRoute>
                <AdminCategory />
              </PrivateRoute>
            } />

            <Route path="settings" element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } />

            <Route path="profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />

            <Route path="about" element={
              <PrivateRoute>
                <About />
              </PrivateRoute>
            } />

          </Route>





          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="signup" element={<Signup />} />
            <Route path="verify-user" element={<VerifyUser />} />
            <Route path="signin" element={<Signin />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            {/* <Route path="google" element={<Google />} /> */}
          </Route>

          <Route path="*" element={<Navigate to="/" />} />


        </Routes>




        <ToastContainer position="top-left"
        />

      </AuthProvider>
    </BrowserRouter >


  )
}

export default App
