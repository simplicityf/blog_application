// PublicLayout.js
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';


const PublicLayout = () => {
    const { isAuthenticated } = useAuth(); // Destructure isAuthenticated from useAuth

    // If the user is authenticated, redirect them to a private route (like /post)
    if (isAuthenticated) {
        return <Navigate to="/post" />;
    }

    // Render the public layout content
    return (
        <div>
            <Outlet /> {/* Render nested public routes (e.g., Home, Signup, Signin) */}
        </div>
    );
};

export default PublicLayout;
