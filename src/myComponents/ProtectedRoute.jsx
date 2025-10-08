import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({
    isAllowed,
    isLoading = false,
    redirectPath = "/",
    fallback = <div className="p-6 text-sm bg-gray-800 text-teal-300">Prüfe Berechtigung...</div>,
    children }) => {
    if (isLoading) return fallback;
    if (!isAllowed) return <Navigate to={redirectPath} replace />;
    return children ?? <Outlet />;
}

export default ProtectedRoute