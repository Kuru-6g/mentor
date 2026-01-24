import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading, session } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Not logged in
    if (!session) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // After login, directly allow access to protected routes.
    // Profile setup is handled after signup via explicit navigation.
    // No additional redirects based on profile completion are needed.
    // The profile-setup route remains protected to ensure the user is authenticated.
    // If a user tries to access /profile-setup after completing their profile, they will be redirected via the route logic elsewhere if desired.
    // For now, simply render children.


    return <>{children}</>;
}
