import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Users, Video, User, Lock, Menu, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: "mentor" | "mentee" | null;
  onRoleChange: (role: "mentor" | "mentee" | null) => void;
}

export function Header({ currentPage, onNavigate, userRole, onRoleChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button onClick={() => onNavigate("home")} className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Topvoice.lk</span>
            </button>
            
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => onNavigate("mentors")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentPage === "mentors" 
                    ? "bg-secondary text-secondary-foreground font-semibold" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Find Mentors
              </button>
              <button
                onClick={() => onNavigate("sessions")}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  currentPage === "sessions" 
                    ? "bg-secondary text-secondary-foreground font-semibold" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Tech Sessions
                {!userRole && (
                  <Lock className="w-3 h-3" />
                )}
              </button>
              {userRole === "mentor" && (
                <button
                  onClick={() => onNavigate("dashboard")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentPage === "dashboard" 
                      ? "bg-secondary text-secondary-foreground font-semibold" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  My Dashboard
                </button>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {!userRole ? (
              <>
                <Button variant="outline" onClick={() => onNavigate("auth")} className="hidden sm:flex shadow-sm hover:shadow">
                  Login
                </Button>
                <Button onClick={() => onNavigate("auth")} className="shadow-md hover:shadow-lg transition-all">
                  Sign Up
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium capitalize">{userRole}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => onRoleChange(null)} className="shadow-sm hover:shadow">
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
            <button
              onClick={() => { onNavigate("mentors"); setMobileMenuOpen(false); }}
              className={`px-4 py-3 rounded-lg text-left transition-all ${
                currentPage === "mentors" 
                  ? "bg-secondary text-secondary-foreground font-semibold" 
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Find Mentors
            </button>
            <button
              onClick={() => { onNavigate("sessions"); setMobileMenuOpen(false); }}
              className={`px-4 py-3 rounded-lg text-left transition-all flex items-center gap-2 ${
                currentPage === "sessions" 
                  ? "bg-secondary text-secondary-foreground font-semibold" 
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Tech Sessions
              {!userRole && <Lock className="w-3 h-3" />}
            </button>
            {userRole === "mentor" && (
              <button
                onClick={() => { onNavigate("dashboard"); setMobileMenuOpen(false); }}
                className={`px-4 py-3 rounded-lg text-left transition-all ${
                  currentPage === "dashboard" 
                    ? "bg-secondary text-secondary-foreground font-semibold" 
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                My Dashboard
              </button>
            )}
            {!userRole && (
              <button
                onClick={() => { onNavigate("auth"); setMobileMenuOpen(false); }}
                className="sm:hidden px-4 py-3 rounded-lg text-left bg-primary text-primary-foreground font-semibold mt-2"
              >
                Login / Sign Up
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}