// PrivateRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../Components/context/useAuth";

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
