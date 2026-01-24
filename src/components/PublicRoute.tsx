import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader2 } from "lucide-react";

export function PublicRoute({ children }: { children: React.ReactNode }) {
    const { user, loading, session } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // If logged in, redirect away from public auth pages
    if (session) {
        // If profile is complete, always go to dashboard
        if (user?.profileCompleted) {
            return <Navigate to={user.role === 'mentor' ? '/dashboard' : '/mentors'} replace />;
        }

        // If profile is INCOMPLETE, check which flow we are in
        if (location.pathname === '/login') {
            // After login, skip setup as per user request
            const target = user?.role === 'mentor' ? '/dashboard' : '/mentors';
            return <Navigate to={target} replace />;
        }

        if (location.pathname === '/signup') {
            // After signup, force setup as per user request
            return <Navigate to="/profile-setup" replace />;
        }

        // Fallback for other public pages if any
        return <Navigate to="/mentors" replace />;
    }

    return <>{children}</>;
}
