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
        // If profile is complete, go to dashboard based on role
        if (user?.profileCompleted) {
            return <Navigate to={user.role === 'mentor' ? '/dashboard' : '/mentors'} replace />;
        }

        // Profile is incomplete or not yet created — send to profile setup
        return <Navigate to="/profile-setup" replace />;
    }

    return <>{children}</>;
}
