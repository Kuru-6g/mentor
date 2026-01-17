import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Clock, MessageCircle, Sparkles } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface RequestMentorshipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentorName: string;
}

export function RequestMentorshipDialog({
  open,
  onOpenChange,
  mentorName,
}: RequestMentorshipDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [sessionType, setSessionType] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!selectedDate || !selectedTime || !sessionType || !message.trim()) {
      toast.error("Please fill in all fields", {
        description: "All fields are required to submit a mentorship request"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate submission
    setTimeout(() => {
      // Store request in localStorage
      const requests = JSON.parse(localStorage.getItem("mentorshipRequests") || "[]");
      const newRequest = {
        id: Date.now().toString(),
        mentorName,
        date: selectedDate.toISOString(),
        time: selectedTime,
        sessionType,
        message,
        status: "pending",
        createdAt: new Date().toISOString()
      };
      requests.push(newRequest);
      localStorage.setItem("mentorshipRequests", JSON.stringify(requests));

      toast.success("Request sent successfully!", {
        description: `Your mentorship request to ${mentorName} has been submitted. You'll hear back soon.`
      });
      
      // Reset form
      setSelectedDate(undefined);
      setSelectedTime("");
      setSessionType("");
      setMessage("");
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto border-primary/20">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-foreground">Request Mentorship from {mentorName}</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Fill in the details below to request a one-on-one mentorship session. The mentor will review your request and get back to you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Session Type */}
          <div className="space-y-2">
            <Label htmlFor="sessionType" className="text-foreground">Session Type *</Label>
            <Select value={sessionType} onValueChange={setSessionType}>
              <SelectTrigger id="sessionType" className="border-border hover:border-primary/50 focus:border-primary transition-colors">
                <SelectValue placeholder="Select session type" />
              </SelectTrigger>
              <SelectContent className="border-primary/20">
                <SelectItem value="career-guidance">Career Guidance</SelectItem>
                <SelectItem value="technical-mentorship">Technical Mentorship</SelectItem>
                <SelectItem value="interview-prep">Interview Preparation</SelectItem>
                <SelectItem value="code-review">Code Review</SelectItem>
                <SelectItem value="project-feedback">Project Feedback</SelectItem>
                <SelectItem value="resume-review">Resume Review</SelectItem>
                <SelectItem value="general">General Discussion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preferred Date */}
          <div className="space-y-2">
            <Label className="text-foreground">Preferred Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  type="button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {selectedDate ? selectedDate.toLocaleDateString() : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-primary/20" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Preferred Time */}
          <div className="space-y-2">
            <Label htmlFor="time" className="text-foreground">Preferred Time *</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger id="time" className="border-border hover:border-primary/50 focus:border-primary transition-colors">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent className="border-primary/20">
                <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                <SelectItem value="6:00 PM">6:00 PM</SelectItem>
                <SelectItem value="7:00 PM">7:00 PM</SelectItem>
                <SelectItem value="8:00 PM">8:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-foreground">Message *</Label>
            <Textarea
              id="message"
              placeholder="Tell the mentor what you'd like to discuss, your current situation, and what you hope to achieve from the session..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="resize-none border-border hover:border-primary/50 focus:border-primary transition-colors"
            />
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Minimum 50 characters. Be specific about your goals.
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
                  Sending...
                </span>
              ) : (
                "Send Request"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
