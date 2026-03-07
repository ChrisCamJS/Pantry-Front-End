import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({adminOnly = false}) => {
    const {user} = useAuth();

    // boot them if no user found
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    // they are logged in but are they admin?
    if (adminOnly && user.is_admin !== 1) {
        return <Navigate to="/" replace />;
    }
    // If they pass the checks, open the velvet rope and render the child routes!
    return <Outlet />;
}

export default ProtectedRoute;