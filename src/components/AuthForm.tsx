import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import {
  Mail,
  Lock,
  CheckCircle2,
  Sparkles,
  User,
  Award,
  GraduationCap,
  Target
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function AuthForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();

  // Determine initial mode based on path
  const [authMode, setAuthMode] = useState<"login" | "signup">(
    location.pathname === "/signup" ? "signup" : "login"
  );

  // Sync state if location changes from outside
  useEffect(() => {
    if (location.pathname === "/signup") setAuthMode("signup");
    if (location.pathname === "/login") setAuthMode("login");
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    setAuthMode(value as "login" | "signup");
    navigate(value === "login" ? "/login" : "/signup");
  };

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state - Only email and password
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;
      if (!data?.user) throw new Error("Sign in failed");

      toast.success("Successfully signed in!");
      // Navigation is handled by PublicRoute/ProtectedRoute automatically


    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Login failed", {
        description: error.message || "Please check your credentials"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!signupEmail || !signupPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (signupPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (signupPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: signupEmail.split('@')[0],
            role: 'mentee'
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error("Signup failed");

      // Check if session is present (means auto-confirmed or no confirmation required)
      if (data.session) {
        toast.success("Account created successfully!");
        navigate("/profile-setup");
      } else {
        // Confirmation required
        setSignupSuccess(true);
        toast.success("Account created successfully!", {
          description: "Please check your email to verify your account"
        });
      }

    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error("Signup failed", {
        description: error.message || "Please try again"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl"
      >
        <Card className="overflow-hidden shadow-2xl border-2 border-primary/20">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Branding & Info */}
            <div className="bg-gradient-to-br from-primary via-accent to-foreground p-8 lg:p-12 text-foreground flex flex-col justify-between">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className="mb-6 bg-foreground text-primary hover:bg-foreground/90 shadow-lg">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Topvoice.lk
                  </Badge>

                  <h1 className="mb-4 text-3xl lg:text-4xl text-foreground">
                    {authMode === "login" ? "Welcome Back!" : "Join Our Community"}
                  </h1>

                  <p className="mb-8 text-foreground/80 text-lg">
                    {authMode === "login"
                      ? "Continue your journey to success"
                      : "Start your journey to professional excellence"}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  {[
                    { icon: User, text: "Connect with expert mentors" },
                    { icon: Award, text: "Showcase your achievements" },
                    { icon: GraduationCap, text: "Learn from tech leaders" },
                    { icon: Target, text: "Achieve your career goals" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-foreground/90 font-medium">{item.text}</p>
                    </div>
                  ))}
                </motion.div>
              </div>

              <div className="hidden lg:block">
                <p className="text-foreground/60 text-sm">
                  Trusted by 500+ mentors and 2,000+ mentees worldwide
                </p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-8 lg:p-12 bg-white dark:bg-card">
              <Tabs value={authMode} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="your.email@example.com"
                          className="pl-10"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-card px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full gap-2"
                      disabled={isLoading}
                      onClick={async () => {
                        setIsLoading(true);
                        try {
                          const { error } = await supabase.auth.signInWithOAuth({
                            provider: 'google',
                            options: {
                              redirectTo: `${window.location.origin}/profile-setup`,
                            },
                          });
                          if (error) throw error;
                        } catch (error: any) {
                          console.error("Google sign-in error:", error);
                          toast.error("Failed to sign in with Google", {
                            description: error.message
                          });
                          setIsLoading(false);
                        }
                      }}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Sign in with Google
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      disabled={isLoading}
                      onClick={async () => {
                        if (!loginEmail) {
                          toast.error("Please enter your email address first");
                          return;
                        }
                        setIsLoading(true);
                        try {
                          const { error } = await supabase.auth.signInWithOtp({
                            email: loginEmail,
                            options: {
                              emailRedirectTo: `${window.location.origin}/profile-setup`,
                            },
                          });
                          if (error) throw error;
                          toast.success("Magic link sent!", {
                            description: "Check your email for the login link."
                          });
                        } catch (error: any) {
                          console.error("Magic link error:", error);
                          toast.error("Failed to send magic link", {
                            description: error.message
                          });
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Sign in with Magic Link
                    </Button>
                  </form>
                </TabsContent>

                {/* Signup Form */}
                <TabsContent value="signup">
                  {signupSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8 space-y-6"
                    >
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-10 h-10 text-primary animate-bounce" />
                      </div>
                      <h2 className="text-2xl font-bold">Check your email!</h2>
                      <p className="text-muted-foreground">
                        We've sent a verification link to <span className="font-semibold text-foreground">{signupEmail}</span>.
                        Please click the link to confirm your account.
                      </p>
                      <div className="pt-6">
                        <Button
                          variant="outline"
                          onClick={() => setSignupSuccess(false)}
                          className="w-full"
                        >
                          Back to Sign Up
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="your.email@example.com"
                            className="pl-10"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="Min 6 characters"
                            className="pl-10"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="Repeat password"
                            className="pl-10"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-lg border border-border">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">
                            After signing up, you'll complete your profile to get started
                          </p>
                        </div>
                      </div>

                      <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Sign Up"}
                      </Button>

                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white dark:bg-card px-2 text-muted-foreground">Or continue with</span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2"
                        disabled={isLoading}
                        onClick={async () => {
                          setIsLoading(true);
                          try {
                            const { error } = await supabase.auth.signInWithOAuth({
                              provider: 'google',
                              options: {
                                redirectTo: `${window.location.origin}/profile-setup`,
                              },
                            });
                            if (error) throw error;
                          } catch (error: any) {
                            console.error("Google sign-in error:", error);
                            toast.error("Failed to sign in with Google", {
                              description: error.message
                            });
                            setIsLoading(false);
                          }
                        }}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Sign up with Google
                      </Button>

                      <p className="text-xs text-muted-foreground text-center mt-4">
                        By signing up, you agree to our Terms of Service and Privacy Policy
                      </p>
                    </form>
                  )}
                </TabsContent>
              </Tabs>

              <Button
                variant="ghost"
                className="w-full mt-4"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}