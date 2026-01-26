import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Clock, MessageCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { UserProfile, supabaseService } from "../services/supabaseService";

interface RequestMentorshipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentorName: string;
  mentorId: string;
}

export function RequestMentorshipDialog({
  open,
  onOpenChange,
  mentorName,
  mentorId,
}: RequestMentorshipDialogProps) {
  const { user } = useAuth();
  const [mentorProfile, setMentorProfile] = useState<UserProfile | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [sessionType, setSessionType] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Fetch mentor profile on open
  useEffect(() => {
    if (open && mentorId) {
      const fetchMentorProfile = async () => {
        setIsLoadingProfile(true);
        const profile = await supabaseService.getProfile(mentorId);
        setMentorProfile(profile);
        setIsLoadingProfile(false);
      };
      fetchMentorProfile();
    }
  }, [open, mentorId]);

  // Generate time slots based on availability
  const generateAvailableSlots = useCallback((date: Date) => {
    if (!mentorProfile?.availability) return [];

    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const dayName = days[date.getDay()];
    const dayConfig = mentorProfile.availability[dayName];

    if (!dayConfig || !dayConfig.enabled) return [];

    const startTimeIndex = TIME_SLOTS.indexOf(dayConfig.startTime);
    const endTimeIndex = TIME_SLOTS.indexOf(dayConfig.endTime);

    if (startTimeIndex === -1 || endTimeIndex === -1) return [];

    return TIME_SLOTS.slice(startTimeIndex, endTimeIndex + 1);
  }, [mentorProfile]);

  // Update slots when date changes
  useEffect(() => {
    if (selectedDate) {
      const slots = generateAvailableSlots(selectedDate);
      setAvailableSlots(slots);
      setSelectedTime(""); // Reset time when date changes
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, generateAvailableSlots]);

  const TIME_SLOTS = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
    "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to send a request");
      return;
    }

    // Validate form
    if (!selectedDate || !selectedTime || !sessionType || !message.trim()) {
      toast.error("Please fill in all fields", {
        description: "All fields are required to submit a mentorship request"
      });
      return;
    }

    if (message.trim().length < 50) {
      toast.error("Message too short", {
        description: "Please provide at least 50 characters about your goals."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData = {
        mentor_id: mentorId,
        user_id: user.id,
        user_name: user.name,
        user_email: user.email,
        user_avatar: user.avatar || "",
        status: "pending",
        message: message,
        preferred_date: selectedDate.toLocaleDateString(),
        preferred_time: selectedTime,
        mentorship_type: sessionType,
        session_id: null // Explicitly null for personal mentorship
      };

      const result = await supabaseService.createSessionRequest(requestData);

      if (result) {
        toast.success("Request sent successfully!", {
          description: `Your mentorship request to ${mentorName} has been submitted. You'll hear back soon.`
        });

        // Reset form
        setSelectedDate(undefined);
        setSelectedTime("");
        setSessionType("");
        setMessage("");
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Mentorship request error:", error);
      toast.error("Failed to send request");
    } finally {
      setIsSubmitting(false);
    }
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
                  disabled={(date: Date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Preferred Time */}
          <div className="space-y-2">
            <Label htmlFor="time" className="text-foreground flex justify-between items-center">
              <span>Preferred Time *</span>
              {selectedDate && !isLoadingProfile && availableSlots.length === 0 && (
                <span className="text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Not Available on this day
                </span>
              )}
            </Label>
            <Select
              value={selectedTime}
              onValueChange={setSelectedTime}
              disabled={!selectedDate || availableSlots.length === 0 || isLoadingProfile}
            >
              <SelectTrigger id="time" className="border-border hover:border-primary/50 focus:border-primary transition-colors">
                <SelectValue placeholder={
                  isLoadingProfile ? "Loading availability..." :
                    !selectedDate ? "Pick a date first" :
                      availableSlots.length === 0 ? "Mentor is unavailable" : "Select time"
                } />
              </SelectTrigger>
              <SelectContent className="border-primary/20">
                {availableSlots.map(time => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedDate && availableSlots.length > 0 && (
              <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3 text-primary" />
                Available from {mentorProfile?.availability?.[["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][selectedDate.getDay()]]?.startTime} to {mentorProfile?.availability?.[["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][selectedDate.getDay()]]?.endTime}
              </p>
            )}
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
