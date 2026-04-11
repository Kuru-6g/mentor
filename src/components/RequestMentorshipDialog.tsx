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
  const [selectedStartTime, setSelectedStartTime] = useState<string>("");
  const [selectedEndTime, setSelectedEndTime] = useState<string>("");
  const [sessionType, setSessionType] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

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

    const allDaySlots = TIME_SLOTS.slice(startTimeIndex, endTimeIndex + 1);

    // Filter out already booked slots
    return allDaySlots.filter(slot => !bookedSlots.includes(slot));
  }, [mentorProfile, bookedSlots]);

  // Update slots when date changes
  useEffect(() => {
    const fetchBookings = async () => {
      if (selectedDate && mentorId) {
        setIsLoadingBookings(true);
        // Standardize date to ISO string (YYYY-MM-DD) for consistency
        const dateStr = selectedDate.toISOString().split('T')[0];
        const booked = await supabaseService.getBookedSlots(mentorId, dateStr);
        setBookedSlots(booked);
        setIsLoadingBookings(false);
      } else {
        setBookedSlots([]);
      }
    };

    fetchBookings();

    if (selectedDate) {
      setSelectedStartTime(""); // Reset times when date changes
      setSelectedEndTime("");
    }
  }, [selectedDate, mentorId]);

  // Update available slots when bookedSlots or mentorProfile changes
  useEffect(() => {
    if (selectedDate) {
      const slots = generateAvailableSlots(selectedDate);
      setAvailableSlots(slots);
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
    if (!selectedDate || !selectedStartTime || !selectedEndTime || !sessionType || !message.trim()) {
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
        preferred_date: selectedDate.toISOString().split('T')[0], // Use ISO string for consistency
        preferred_time: selectedStartTime,
        end_time: selectedEndTime,
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
        setSelectedStartTime("");
        setSelectedEndTime("");
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
                <SelectItem value="intro-call">
                  <div className="flex items-center justify-between w-full gap-4">
                    <span>Introductory Call</span>
                    <span className="text-xs text-muted-foreground">30 min</span>
                  </div>
                </SelectItem>
                <SelectItem value="consultation">
                  <div className="flex items-center justify-between w-full gap-4">
                    <span>Consultation Session</span>
                    <span className="text-xs text-muted-foreground">60 min</span>
                  </div>
                </SelectItem>
                <SelectItem value="document-review">
                  <div className="flex items-center justify-between w-full gap-4">
                    <span>Document/Portfolio Review</span>
                    <span className="text-xs text-muted-foreground">45 min</span>
                  </div>
                </SelectItem>
                <SelectItem value="mock-practice">
                  <div className="flex items-center justify-between w-full gap-4">
                    <span>Mock Session / Practice</span>
                    <span className="text-xs text-muted-foreground">60 min</span>
                  </div>
                </SelectItem>
                <SelectItem value="strategy-planning">
                  <div className="flex items-center justify-between w-full gap-4">
                    <span>Strategy & Planning</span>
                    <span className="text-xs text-muted-foreground">60 min</span>
                  </div>
                </SelectItem>
                <SelectItem value="hourly-session">
                  <div className="flex items-center justify-between w-full gap-4">
                    <span>Hourly 1:1 Session</span>
                    <span className="text-xs text-muted-foreground">60 min</span>
                  </div>
                </SelectItem>
                <SelectItem value="general">
                  <div className="flex items-center justify-between w-full gap-4">
                    <span>General Discussion</span>
                    <span className="text-xs text-muted-foreground">30-60 min</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {sessionType && mentorProfile?.sessionPricing && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <span className="font-medium text-primary">
                  Estimated: ${sessionType === 'intro-call' ? Math.round(mentorProfile.sessionPricing * 0.5) :
                    sessionType === 'document-review' ? Math.round(mentorProfile.sessionPricing * 0.75) :
                      mentorProfile.sessionPricing}
                </span>
                <span>(based on mentor's hourly rate)</span>
              </p>
            )}
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

          {/* Session Time */}
          <div className="space-y-3">
            <Label className="text-foreground flex justify-between items-center">
              <span>Session Time *</span>
              {selectedDate && !isLoadingProfile && availableSlots.length === 0 && (
                <span className="text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Not Available on this day
                </span>
              )}
            </Label>

            <div className="grid grid-cols-2 gap-3">
              {/* Start Time */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Start Time</Label>
                <Select
                  value={selectedStartTime}
                  onValueChange={(time: string) => {
                    setSelectedStartTime(time);
                    setSelectedEndTime(""); // Reset end time when start changes
                  }}
                  disabled={!selectedDate || availableSlots.length === 0 || isLoadingProfile}
                >
                  <SelectTrigger className="border-border hover:border-primary/50 focus:border-primary transition-colors">
                    <SelectValue placeholder={
                      isLoadingProfile || isLoadingBookings ? "Loading..." :
                        !selectedDate ? "Pick date first" :
                          availableSlots.length === 0 ? "No slots" : "Start time"
                    } />
                  </SelectTrigger>
                  <SelectContent className="border-primary/20">
                    {availableSlots.slice(0, -1).map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* End Time */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">End Time</Label>
                <Select
                  value={selectedEndTime}
                  onValueChange={setSelectedEndTime}
                  disabled={!selectedStartTime || availableSlots.length === 0}
                >
                  <SelectTrigger className="border-border hover:border-primary/50 focus:border-primary transition-colors">
                    <SelectValue placeholder={!selectedStartTime ? "Select start first" : "End time"} />
                  </SelectTrigger>
                  <SelectContent className="border-primary/20">
                    {availableSlots
                      .filter(time => {
                        const startIndex = availableSlots.indexOf(selectedStartTime);
                        const timeIndex = availableSlots.indexOf(time);
                        return timeIndex > startIndex;
                      })
                      .map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Duration & Pricing Display */}
            {selectedStartTime && selectedEndTime && (
              <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      Session Duration: {(() => {
                        const startIndex = availableSlots.indexOf(selectedStartTime);
                        const endIndex = availableSlots.indexOf(selectedEndTime);
                        const hours = endIndex - startIndex;
                        return `${hours} hour${hours > 1 ? 's' : ''}`;
                      })()}
                    </span>
                  </div>
                </div>

                {mentorProfile?.sessionPricing && (
                  <div className="pt-2 border-t border-primary/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Hourly Rate: ${mentorProfile.sessionPricing}/hr
                      </span>
                      <span className="text-muted-foreground">
                        × {(() => {
                          const startIndex = availableSlots.indexOf(selectedStartTime);
                          const endIndex = availableSlots.indexOf(selectedEndTime);
                          return endIndex - startIndex;
                        })()} hours
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold text-foreground">Total Session Cost:</span>
                      <span className="text-lg font-bold text-primary">
                        ${(() => {
                          const startIndex = availableSlots.indexOf(selectedStartTime);
                          const endIndex = availableSlots.indexOf(selectedEndTime);
                          const hours = endIndex - startIndex;
                          const mentorPayout = mentorProfile.sessionPricing * hours;
                          // Add 20% platform fee
                          return Math.round(mentorPayout * 1.2);
                        })()}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Includes 20% platform fee
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedDate && availableSlots.length > 0 && !selectedStartTime && (
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3 text-primary" />
                Available: {mentorProfile?.availability?.[["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][selectedDate.getDay()]]?.startTime} - {mentorProfile?.availability?.[["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][selectedDate.getDay()]]?.endTime}
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
