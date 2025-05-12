import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './auth-context';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-gray-500 text-sm">Checking auth...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
