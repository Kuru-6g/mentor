import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Briefcase, DollarSign, Calendar, FileText, Building, Sparkles } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface HireMentorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentorName: string;
}

export function HireMentorDialog({
  open,
  onOpenChange,
  mentorName,
}: HireMentorDialogProps) {
  const [projectType, setProjectType] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [engagementType, setEngagementType] = useState<string>("contract");
  const [companyName, setCompanyName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [requirements, setRequirements] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!projectType || !duration || !budget || !companyName.trim() || !projectDescription.trim() || !requirements.trim()) {
      toast.error("Please fill in all required fields", {
        description: "All fields marked with * are required"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate submission
    setTimeout(() => {
      // Store hire request in localStorage
      const hireRequests = JSON.parse(localStorage.getItem("hireRequests") || "[]");
      const newRequest = {
        id: Date.now().toString(),
        mentorName,
        projectType,
        duration,
        budget,
        engagementType,
        companyName,
        projectDescription,
        requirements,
        status: "pending",
        createdAt: new Date().toISOString()
      };
      hireRequests.push(newRequest);
      localStorage.setItem("hireRequests", JSON.stringify(hireRequests));

      toast.success("Hire request sent successfully!", {
        description: `Your proposal to hire ${mentorName} has been submitted. They will review and contact you soon.`
      });
      
      // Reset form
      setProjectType("");
      setDuration("");
      setBudget("");
      setEngagementType("contract");
      setCompanyName("");
      setProjectDescription("");
      setRequirements("");
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto border-primary/20">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-foreground">
              Hire {mentorName}
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Submit a proposal to hire this mentor for consulting, contract work, or a full-time position. They will review your proposal and reach out if interested.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Engagement Type */}
          <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
            <Label className="text-foreground">Engagement Type *</Label>
            <RadioGroup value={engagementType} onValueChange={setEngagementType} className="space-y-3">
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-primary/10 transition-colors">
                <RadioGroupItem value="contract" id="contract" className="border-primary" />
                <Label htmlFor="contract" className="cursor-pointer text-foreground">
                  Contract / Freelance
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-primary/10 transition-colors">
                <RadioGroupItem value="consulting" id="consulting" className="border-primary" />
                <Label htmlFor="consulting" className="cursor-pointer text-foreground">
                  Consulting / Advisory
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-primary/10 transition-colors">
                <RadioGroupItem value="fulltime" id="fulltime" className="border-primary" />
                <Label htmlFor="fulltime" className="cursor-pointer text-foreground">
                  Full-time Position
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-primary/10 transition-colors">
                <RadioGroupItem value="parttime" id="parttime" className="border-primary" />
                <Label htmlFor="parttime" className="cursor-pointer text-foreground">
                  Part-time Position
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-foreground flex items-center gap-2">
              <Building className="w-4 h-4 text-primary" />
              Company / Organization Name *
            </Label>
            <Input
              id="companyName"
              placeholder="e.g., Acme Corp"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="border-border hover:border-primary/50 focus:border-primary transition-colors"
            />
          </div>

          {/* Project Type */}
          <div className="space-y-2">
            <Label htmlFor="projectType" className="text-foreground">Project Type *</Label>
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger id="projectType" className="border-border hover:border-primary/50 focus:border-primary transition-colors">
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent className="border-primary/20">
                <SelectItem value="web-development">Web Development</SelectItem>
                <SelectItem value="mobile-development">Mobile Development</SelectItem>
                <SelectItem value="system-architecture">System Architecture</SelectItem>
                <SelectItem value="devops">DevOps / Infrastructure</SelectItem>
                <SelectItem value="consulting">Technical Consulting</SelectItem>
                <SelectItem value="code-review">Code Review / Audit</SelectItem>
                <SelectItem value="training">Team Training</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Duration *
              </Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration" className="border-border hover:border-primary/50 focus:border-primary transition-colors">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="border-primary/20">
                  <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                  <SelectItem value="1-month">1 month</SelectItem>
                  <SelectItem value="2-3-months">2-3 months</SelectItem>
                  <SelectItem value="3-6-months">3-6 months</SelectItem>
                  <SelectItem value="6-12-months">6-12 months</SelectItem>
                  <SelectItem value="12-months-plus">12+ months</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Budget Range *
              </Label>
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger id="budget" className="border-border hover:border-primary/50 focus:border-primary transition-colors">
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent className="border-primary/20">
                  <SelectItem value="under-5k">Under $5,000</SelectItem>
                  <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                  <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                  <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                  <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                  <SelectItem value="100k-plus">$100,000+</SelectItem>
                  <SelectItem value="negotiable">Negotiable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Project Description */}
          <div className="space-y-2">
            <Label htmlFor="projectDescription" className="text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Project Description *
            </Label>
            <Textarea
              id="projectDescription"
              placeholder="Provide a detailed description of the project, your company, and what you're looking to achieve..."
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              rows={4}
              className="resize-none border-border hover:border-primary/50 focus:border-primary transition-colors"
            />
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements" className="text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Key Requirements & Skills Needed *
            </Label>
            <Textarea
              id="requirements"
              placeholder="List the specific skills, technologies, and requirements for this role or project..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={4}
              className="resize-none border-border hover:border-primary/50 focus:border-primary transition-colors"
            />
          </div>

          {/* Info Box */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -mr-10 -mt-10" />
            <p className="text-sm text-muted-foreground relative">
              <strong className="text-foreground">Note:</strong> This is an initial proposal. The mentor will review your request and may reach out to discuss details, rates, and availability. No commitment is made until both parties agree to terms.
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
                  <Briefcase className="w-4 h-4" />
                  Submit Proposal
                </span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
