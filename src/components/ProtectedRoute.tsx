import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // While session is being checked, render nothing (or a subtle loader)
    if (loading) {
        return (
            <div className="min-h-screen bg-bg-dark flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-white/10 border-t-accent-purple animate-spin" />
            </div>
        );
    }

    if (!user) {
        // Redirect to /login preserving the original destination
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
