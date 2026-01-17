import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { UserCheck, Mail, Briefcase, GraduationCap, Sparkles, Target } from "lucide-react";

interface JoinSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionTitle: string;
  onSubmit: (formData: JoinSessionFormData) => void;
}

export interface JoinSessionFormData {
  fullName: string;
  email: string;
  phone: string;
  occupation: string;
  experienceLevel: string;
  reasonToJoin: string;
  expectations: string;
}

export function JoinSessionDialog({
  open,
  onOpenChange,
  sessionTitle,
  onSubmit,
}: JoinSessionDialogProps) {
  const [formData, setFormData] = useState<JoinSessionFormData>({
    fullName: "",
    email: "",
    phone: "",
    occupation: "",
    experienceLevel: "",
    reasonToJoin: "",
    expectations: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName.trim()) {
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      return;
    }
    if (!formData.phone.trim()) {
      return;
    }
    if (!formData.occupation.trim()) {
      return;
    }
    if (!formData.experienceLevel) {
      return;
    }
    if (formData.reasonToJoin.trim().length < 50) {
      return;
    }
    if (formData.expectations.trim().length < 30) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit(formData);
    
    // Reset form
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      occupation: "",
      experienceLevel: "",
      reasonToJoin: "",
      expectations: "",
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const updateFormData = (field: keyof JoinSessionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto border-primary/20">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserCheck className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-foreground">Request to Join Session</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Fill in your details to request to join <strong className="text-foreground">{sessionTitle}</strong>. The mentor will review your request.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Personal Information Section */}
          <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
            <h4 className="text-foreground flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-primary" />
              Personal Information
            </h4>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-foreground">
                Full Name *
              </Label>
              <Input
                id="fullName"
                placeholder="e.g., John Doe"
                value={formData.fullName}
                onChange={(e) => updateFormData("fullName", e.target.value)}
                className="border-border hover:border-primary/50 focus:border-primary transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., john@example.com"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="border-border hover:border-primary/50 focus:border-primary transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g., +1 234 567 8900"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  className="border-border hover:border-primary/50 focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Professional Background Section */}
          <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
            <h4 className="text-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Professional Background
            </h4>

            <div className="space-y-2">
              <Label htmlFor="occupation" className="text-foreground flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                Current Occupation / Role *
              </Label>
              <Input
                id="occupation"
                placeholder="e.g., Software Engineer, Student, Product Manager"
                value={formData.occupation}
                onChange={(e) => updateFormData("occupation", e.target.value)}
                className="border-border hover:border-primary/50 focus:border-primary transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceLevel" className="text-foreground">
                Experience Level *
              </Label>
              <Select 
                value={formData.experienceLevel} 
                onValueChange={(value) => updateFormData("experienceLevel", value)}
              >
                <SelectTrigger id="experienceLevel" className="border-border hover:border-primary/50 focus:border-primary transition-colors">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent className="border-primary/20">
                  <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                  <SelectItem value="advanced">Advanced (3-5 years)</SelectItem>
                  <SelectItem value="expert">Expert (5+ years)</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="career-switcher">Career Switcher</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Session Interest Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reasonToJoin" className="text-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Why do you want to join this session? *
              </Label>
              <Textarea
                id="reasonToJoin"
                placeholder="Tell us what interests you about this session and what you hope to learn..."
                value={formData.reasonToJoin}
                onChange={(e) => updateFormData("reasonToJoin", e.target.value)}
                rows={4}
                className="resize-none border-border hover:border-primary/50 focus:border-primary transition-colors"
                required
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Minimum 50 characters ({formData.reasonToJoin.length}/50)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectations" className="text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                What are your expectations from this session? *
              </Label>
              <Textarea
                id="expectations"
                placeholder="What specific outcomes or knowledge are you hoping to gain?"
                value={formData.expectations}
                onChange={(e) => updateFormData("expectations", e.target.value)}
                rows={3}
                className="resize-none border-border hover:border-primary/50 focus:border-primary transition-colors"
                required
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Minimum 30 characters ({formData.expectations.length}/30)
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -mr-10 -mt-10" />
            <p className="text-sm text-muted-foreground relative">
              <strong className="text-foreground">Note:</strong> Your request will be reviewed by the session organizer. You'll receive a notification once your request is approved or if additional information is needed.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors shadow-lg shadow-primary/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Submit Request
                </span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
