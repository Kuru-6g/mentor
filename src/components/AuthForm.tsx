import { useState } from "react";
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
import { supabase } from "../lib/config";

interface AuthFormProps {
  onSuccess: (userId: string, userEmail: string) => void;
  onClose?: () => void;
}

export function AuthForm({ onSuccess, onClose }: AuthFormProps) {
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Signup form state - Only email and password
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      onSuccess(data.user.id, loginEmail);
      onClose?.();

      // Call onSuccess to trigger profile check
      onSuccess(data.user.id, data.user.email!);
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

      toast.success("Account created successfully!", {
        description: "Please check your email to verify your account"
      });
      
      // Call onSuccess to show profile setup
      onSuccess(data.user.id, data.user.email!);
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
              <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as "login" | "signup")} className="w-full">
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
                  </form>
                </TabsContent>

                {/* Signup Form */}
                <TabsContent value="signup">
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

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      By signing up, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </form>
                </TabsContent>
              </Tabs>

              {onClose && (
                <Button
                  variant="ghost"
                  className="w-full mt-4"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}