// PrivateLayout.js
import PrivateNavBar from '../../Pages/NavBar/PrivateNavBar';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const PrivateLayout = () => {
    const { isAuthenticated } = useAuth(); // Destructure isAuthenticated from useAuth

    // If the user is not authenticated, redirect to the Signin page
    if (!isAuthenticated) {
        return <Navigate to="/signin" />;
    }

    // Render the private layout content
    return (
        <div>
            <PrivateNavBar />
            <Outlet /> {/* Render nested routes */}
        </div>
    );
};

export default PrivateLayout;
