import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Settings, LogOut, ChevronDown, User, Sparkles, Users, Lock, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  onBlur={() => setTimeout(() => setProfileOpen(false), 200)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-muted transition-all active:scale-95 group"
                >
                  <Avatar className="w-9 h-9 border-2 border-transparent group-hover:border-primary/20 transition-all">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.name?.split(' ').map(n => n[0]).join('') || <User className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-64 bg-card border rounded-2xl shadow-xl overflow-hidden z-[100]"
                    >
                      <div className="p-4 bg-muted/30 border-b">
                        <p className="font-semibold text-foreground truncate">{user?.name}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                            {userRole}
                          </span>
                          {userRole === 'mentor' && (
                            <Sparkles className="w-3 h-3 text-yellow-500 animate-pulse" />
                          )}
                        </div>
                      </div>

                      <div className="p-2">
                        <Link
                          to="/profile-setup"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <Settings className="w-4 h-4" />
                          </div>
                          Account Settings
                        </Link>

                        <button
                          onClick={() => signOut()}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <LogOut className="w-4 h-4" />
                          </div>
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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