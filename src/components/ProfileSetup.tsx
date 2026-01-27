import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  User,
  Briefcase,
  GraduationCap,
  Linkedin,
  Github,
  Globe,
  Sparkles,
  Loader2,
  Check
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { supabaseService, UserProfile } from "../services/supabaseService";
import { useNavigate } from "react-router-dom";

interface ProfileSetupProps {
  userId: string;
  userEmail: string;
  onComplete: (profileData: any) => void; // Keep for compatibility if needed, but make optional in future
  initialData?: {
    full_name?: string;
    bio?: string;
    years_experience?: number;
    linkedin_url?: string;
    github_url?: string;
    website_url?: string;
    interests?: string[];
    current_role?: string;
    company?: string;
    location?: string;
    goals?: string;
  };
}

// TODO: Remove onComplete prop in next iteration when App.tsx is fully cleaned up of legacy props
export function ProfileSetup({ userId, userEmail, initialData = {} }: Omit<ProfileSetupProps, 'onComplete'> & { onComplete?: any }) {
  const { refreshUser, session, user, loading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"role" | "details">("role");
  const [userType, setUserType] = useState<"mentor" | "mentee">("mentee");
  const [isLoading, setIsLoading] = useState(false);

  // Debug: Check for unmounts
  useEffect(() => {
    console.log("ProfileSetup MOUNTED");
    return () => console.log("ProfileSetup UNMOUNTED");
  }, []);

  // Redirect if profile is already completed
  useEffect(() => {
    if (!loading && user?.profileCompleted) {
      if (user.role === 'mentor') {
        navigate('/dashboard');
      } else {
        navigate('/mentors');
      }
    }
  }, [user, loading, navigate]);

  if (loading || (user?.profileCompleted)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Preparing your experience...</p>
        </div>
      </div>
    );
  }

  // Form state
  const [formData, setFormData] = useState({
    full_name: initialData.full_name || session?.user?.user_metadata?.full_name || session?.user?.user_metadata?.name || "",
    bio: initialData.bio || "",
    avatar_url: session?.user?.user_metadata?.avatar_url || session?.user?.user_metadata?.picture || "",
    years_experience: initialData.years_experience?.toString() || "",
    linkedin_url: initialData.linkedin_url || "",
    github_url: initialData.github_url || "",
    website_url: initialData.website_url || "",
    expertise: "",
    interests: initialData.interests?.join(", ") || "",
    current_role: initialData.current_role || "",
    company: initialData.company || "",
    location: initialData.location || "",
    goals: initialData.goals || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleSelection = (role: "mentor" | "mentee") => {
    setUserType(role);
    setStep("details");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Session missing. Please log in again.");
      return;
    }

    // Validation
    if (!formData.full_name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (userType === "mentor") {
      if (!formData.years_experience || !formData.bio || !formData.current_role) {
        toast.error("Please fill in all required mentor fields");
        return;
      }
    } else {
      if (!formData.interests || !formData.current_role || !formData.goals) {
        toast.error("Please fill in all required mentee fields");
        return;
      }
    }

    setIsLoading(true);
    try {
      // Prepare profile data
      const profileData = {
        id: userId,
        email: userEmail,
        name: formData.full_name.trim(),
        avatar: formData.avatar_url,
        role: userType,
        bio: formData.bio,
        expertise: formData.expertise.split(",").map(i => i.trim()).filter(Boolean),
        yearsExperience: parseInt(formData.years_experience) || 0,
        linkedin: formData.linkedin_url,
        github: formData.github_url,
        website: formData.website_url,
        interests: formData.interests.split(",").map(i => i.trim()).filter(Boolean),
        currentRole: formData.current_role,
        company: formData.company,
        location: formData.location,
        goals: formData.goals,
        profileCompleted: true,
      };

      // Create profile in Supabase
      const profile = await supabaseService.createProfile(profileData);

      // Note: createProfile now throws if it fails, so we don't need to check for null
      if (profile) {
        console.log("Profile created successfully:", profile.id);

        // Refresh auth context
        await refreshUser();

        // Show success message
        toast.success("Profile setup completed!", {
          description: `Welcome to Topvoice.lk, ${formData.full_name}!`
        });

        // Redirect based on role
        if (userType === "mentor") {
          navigate("/dashboard");
        } else {
          navigate("/mentors");
        }
      }

    } catch (error: any) {
      console.error("Profile setup error:", error);
      toast.error(`Setup Failed: ${error.code || ''}`, {
        description: error.message || "Unknown error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-black/5 dark:from-black dark:via-gray-900 dark:to-yellow-900/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <Card className="overflow-hidden shadow-2xl border-2 border-primary/20">
          <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-black p-8 text-black">
            <Badge className="mb-4 bg-black text-yellow-400 hover:bg-black/90">
              <Sparkles className="w-4 h-4 mr-2" />
              Topvoice.lk
            </Badge>

            <h1 className="mb-2 text-3xl">
              Complete Your Profile
            </h1>

            <p className="text-black/80">
              {step === "role"
                ? "First, tell us about yourself"
                : `Let's set up your ${userType} profile`}
            </p>
          </div>

          <div className="p-8 bg-white dark:bg-card">
            {step === "role" ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="mb-4 text-xl">I am a</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRoleSelection("mentee")}
                      className="p-6 border-2 border-border rounded-lg hover:border-primary transition-colors text-left"
                    >
                      <GraduationCap className="w-12 h-12 mb-4 text-primary" />
                      <h3 className="mb-2">Mentee</h3>
                      <p className="text-sm text-muted-foreground">
                        I'm looking for guidance and mentorship to grow my career
                      </p>
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRoleSelection("mentor")}
                      className="p-6 border-2 border-border rounded-lg hover:border-primary transition-colors text-left"
                    >
                      <Briefcase className="w-12 h-12 mb-4 text-primary" />
                      <h3 className="mb-2">Mentor</h3>
                      <p className="text-sm text-muted-foreground">
                        I want to share my expertise and help others succeed
                      </p>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="flex flex-col"
              >
                <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
                  {/* Common Fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="full_name"
                          name="full_name"
                          type="text"
                          placeholder="John Doe"
                          className="pl-10"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current_role">Job Title / Role *</Label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="current_role"
                            name="current_role"
                            type="text"
                            placeholder="e.g. Senior Software Engineer"
                            className="pl-10"
                            value={formData.current_role}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Company / Organization</Label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="company"
                            name="company"
                            type="text"
                            placeholder="e.g. Google, Student at MIT"
                            className="pl-10"
                            value={formData.company}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="location"
                          name="location"
                          type="text"
                          placeholder="e.g. Colombo, Sri Lanka / Remote"
                          className="pl-10"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="years_experience">Years of Experience *</Label>
                      <Input
                        id="years_experience"
                        name="years_experience"
                        type="number"
                        placeholder="e.g., 5"
                        value={formData.years_experience}
                        onChange={handleInputChange}
                        min="0"
                        required={userType === 'mentor'}
                      />
                    </div>

                    {userType === "mentor" && (
                      <div className="space-y-2">
                        <Label htmlFor="expertise">Expertise Areas *</Label>
                        <Input
                          id="expertise"
                          name="expertise"
                          type="text"
                          placeholder="e.g., React, Node.js, System Design"
                          value={formData.expertise}
                          onChange={handleInputChange}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Separate multiple areas with commas
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="bio">Professional Bio *</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell us about your experience and what you can offer..."
                        rows={4}
                        value={formData.bio}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="linkedin_url"
                          name="linkedin_url"
                          type="url"
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="pl-10"
                          value={formData.linkedin_url}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="github_url">GitHub Profile</Label>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="github_url"
                          name="github_url"
                          type="url"
                          placeholder="https://github.com/yourusername"
                          className="pl-10"
                          value={formData.github_url}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website_url">Personal Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="website_url"
                          name="website_url"
                          type="url"
                          placeholder="https://yourwebsite.com"
                          className="pl-10"
                          value={formData.website_url}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mentee-specific fields */}
                  {userType === "mentee" && (
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="mb-4 text-sm font-medium">Mentee Profile</h3>

                      <div className="space-y-2">
                        <Label htmlFor="interests">Areas of Interest *</Label>
                        <Input
                          id="interests"
                          name="interests"
                          type="text"
                          placeholder="e.g., Web Development, Machine Learning"
                          value={formData.interests}
                          onChange={handleInputChange}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Separate multiple interests with commas
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="goals">Your Goals *</Label>
                        <Textarea
                          id="goals"
                          name="goals"
                          placeholder="What do you hope to achieve with mentorship?"
                          rows={4}
                          value={formData.goals}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation buttons - outside scroll container */}
                <div className="pt-4 border-t mt-4">
                  <div className="flex flex-col-reverse sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("role")}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      Complete Setup
                    </Button>
                  </div>
                </div>
              </motion.form>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
