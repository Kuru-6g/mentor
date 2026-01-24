import { Button } from "./ui/button";
import { Users, Lock, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, session, loading } = useAuth();
  const userRole = user?.role;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Topvoice.lk</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/mentors"
                className={`px-4 py-2 rounded-lg transition-all ${isActive("/mentors")
                  ? "bg-secondary text-secondary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
              >
                Find Mentors
              </Link>
              <Link
                to="/sessions"
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${isActive("/sessions")
                  ? "bg-secondary text-secondary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
              >
                Tech Sessions
                {!userRole && (
                  <Lock className="w-3 h-3" />
                )}
              </Link>
              {(userRole === "mentor" || userRole === "mentee") && (
                <Link
                  to={userRole === "mentor" ? "/dashboard" : "/mentee-dashboard"}
                  className={`px-4 py-2 rounded-lg transition-all ${isActive(userRole === "mentor" ? "/dashboard" : "/mentee-dashboard")
                    ? "bg-secondary text-secondary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  My Dashboard
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : !session ? (
              <>
                <Link to="/login">
                  <Button variant="outline" className="hidden sm:flex shadow-sm hover:shadow">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="shadow-md hover:shadow-lg transition-all">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {user && (
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium capitalize">{userRole}</span>
                  </div>
                )}
                <Button variant="outline" size="sm" onClick={() => signOut()} className="shadow-sm hover:shadow">
                  Logout
                </Button>
              </div>
            )}


            <button
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-2 border-t pt-4">
            <Link
              to="/mentors"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-left transition-all ${isActive("/mentors")
                ? "bg-secondary text-secondary-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted"
                }`}
            >
              Find Mentors
            </Link>
            <Link
              to="/sessions"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-left transition-all flex items-center gap-2 ${isActive("/sessions")
                ? "bg-secondary text-secondary-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted"
                }`}
            >
              Tech Sessions
              {!userRole && <Lock className="w-3 h-3" />}
            </Link>
            {(userRole === "mentor" || userRole === "mentee") && (
              <Link
                to={userRole === "mentor" ? "/dashboard" : "/mentee-dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-left transition-all ${isActive(userRole === "mentor" ? "/dashboard" : "/mentee-dashboard")
                  ? "bg-secondary text-secondary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted"
                  }`}
              >
                My Dashboard
              </Link>
            )}
            {!user && (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="sm:hidden px-4 py-3 rounded-lg text-left bg-primary text-primary-foreground font-semibold mt-2"
              >
                Login / Sign Up
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}