import { useState } from "react";
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
import { supabaseService } from "@/services/supabaseService";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileSetupProps {
  userId: string;
  userEmail: string;
  onComplete: (profileData: any) => void;
  initialData?: {
    full_name?: string;
    bio?: string;
    years_experience?: number;
    linkedin_url?: string;
    github_url?: string;
    website_url?: string;
    interests?: string[];
    current_role?: string;
    goals?: string;
  };
}

export function ProfileSetup({ userId, userEmail, onComplete, initialData = {} }: ProfileSetupProps) {
  const { refreshUser } = useAuth();
  const [step, setStep] = useState<"role" | "details">("role");
  const [userType, setUserType] = useState<"mentor" | "mentee">("mentee");
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: initialData.full_name || "",
    bio: initialData.bio || "",
    years_experience: initialData.years_experience?.toString() || "",
    linkedin_url: initialData.linkedin_url || "",
    github_url: initialData.github_url || "",
    website_url: initialData.website_url || "",
    interests: initialData.interests?.join(", ") || "",
    current_role: initialData.current_role || "",
    goals: initialData.goals || "",
  });
  
  const [userType, setUserType] = useState<"mentor" | "mentee">("mentee");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"role" | "details">("role");
  
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
    
    // Validation
    if (!formData.full_name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (userType === "mentor") {
      if (!formData.years_experience || !formData.bio) {
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
      // Prepare profile data for Supabase
      const profileData = {
        id: userId,
        email: userEmail,
        full_name: formData.full_name.trim(),
        role: userType,
        bio: formData.bio,
        years_experience: parseInt(formData.years_experience) || 0,
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url,
        website_url: formData.website_url,
        interests: formData.interests.split(",").map(i => i.trim()).filter(Boolean),
        current_role: formData.current_role,
        goals: formData.goals,
        profile_completed: true,
        updated_at: new Date().toISOString()
      };

      // Check if profile exists
      const { data: existingProfile } = await supabaseService.getProfile(userId);
      
      let result;
      if (existingProfile) {
        // Update existing profile
        result = await supabaseService.updateProfile(userId, profileData);
      } else {
        // Create new profile
        result = await supabaseService.createProfile({
          ...profileData,
          created_at: new Date().toISOString()
        });
      }

      if (!result) {
        throw new Error("Failed to save profile");
      }

      // Refresh auth context
      await refreshUser();

      // Call the onComplete callback with the profile data
      if (typeof onComplete === 'function') {
        await onComplete(result);
      }
      
      // Show success message
      toast.success("Profile setup completed!", {
        description: `Welcome to Topvoice.lk, ${formData.full_name}!`
      });
    } catch (error: any) {
      console.error("Profile setup error:", error);
      toast.error("Failed to complete profile setup", {
        description: error.message || "Please try again"
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
                className="flex flex-col h-[500px]"
              >
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
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
                          className="pl-10 w-full"
                          value={formData.website_url}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mentee-specific fields */}
                  {userType === "mentee" && (
                    <div className="space-y-4 pt-4">
                      <div className="border-t pt-4">
                        <h3 className="mb-4 text-sm font-medium">Mentee Profile</h3>
                      </div>

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
                        <Label htmlFor="current_role">Current Role/Status *</Label>
                        <Input
                          id="current_role"
                          name="current_role"
                          type="text"
                          placeholder="e.g., Junior Developer, Student, Career Switcher"
                          value={formData.current_role}
                          onChange={handleInputChange}
                          required
                        />
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

                {/* Navigation buttons */}
                <div className="sticky bottom-0 bg-white dark:bg-card pt-4 border-t mt-4">
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("role")}
                      className="w-full"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="w-full" 
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
