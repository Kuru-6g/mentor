import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Plus, Edit, Trash2, Calendar, Award, Video, Users2, MapPin, Monitor, UserPlus, X, Inbox, Users, Zap, Clock } from "lucide-react";
import { SessionRequestsManager } from "./SessionRequestsManager";
import { SessionParticipants } from "./SessionParticipants";
import { SessionParticipantsModal } from "./SessionParticipantsModal";
import { AvailabilitySettings } from "./AvailabilitySettings";
import { useAuth } from "../contexts/AuthContext";
import { supabaseService, Session, SessionRequest, Speaker } from "../services/supabaseService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  type: string;
}


interface MentorDashboardProps {
  onAddSession: (session: Omit<Session, "id" | "attendees" | "availableSlots">) => void;
  onUpdateSession: (sessionId: string | number, updates: Partial<Session>) => Promise<boolean>;
  onDeleteSession: (sessionId: number | string) => void;
  sessions: Session[];
  sessionRequests: SessionRequest[];
  currentUserId?: string;
  onRespondToRequest: (requestId: string, action: "accept" | "reject", message?: string, meetingUrl?: string) => void;
}


export function MentorDashboard({
  onAddSession,
  onUpdateSession,
  onDeleteSession,
  sessions,
  sessionRequests,
  currentUserId,
  onRespondToRequest
}: MentorDashboardProps) {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Profile data state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    avatar: user?.avatar || "",
    title: user?.currentRole || "",
    company: user?.company || "",
    location: "San Francisco, CA", // Default or could be added to schema
    bio: user?.bio || "",
    expertise: user?.expertise?.join(", ") || ""
  });

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        avatar: user.avatar || "",
        title: user.currentRole || "",
        company: user.company || "",
        location: "San Francisco, CA",
        bio: user.bio || "",
        expertise: user.expertise?.join(", ") || ""
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const updates = {
        name: profileData.name,
        avatar: profileData.avatar,
        currentRole: profileData.title,
        company: profileData.company,
        bio: profileData.bio,
        expertise: profileData.expertise.split(",").map(i => i.trim()).filter(Boolean),
      };

      const result = await supabaseService.updateProfile(user.id, updates);
      if (result) {
        toast.success("Profile updated successfully");
        await refreshUser();
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const [achievements, setAchievements] = useState<Achievement[]>(user?.achievements || []);

  // Update achievements when user changes
  useEffect(() => {
    if (user?.achievements) {
      setAchievements(user.achievements);
    }
  }, [user]);

  // Filter sessions to show only those created by this mentor
  const mentorSessions = sessions.filter(s =>
    s.createdBy === user?.id || s.speakers.some(speaker => speaker.name === user?.name)
  );


  const [newAchievement, setNewAchievement] = useState({
    title: "",
    description: "",
    date: "",
    type: "Certification"
  });

  // Session creation/editing state
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [isEditSessionOpen, setIsEditSessionOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | number | null>(null);
  const [newSession, setNewSession] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    maxSlots: 0,
    sessionType: "online" as "online" | "physical",
    location: "",
    companyName: user?.company || "",
    topics: "",
    meetingUrl: ""
  });

  const [sessionSpeakers, setSessionSpeakers] = useState<Speaker[]>([]);
  const [newSpeaker, setNewSpeaker] = useState({
    name: "",
    title: "",
    avatar: ""
  });

  const [isAddAchievementOpen, setIsAddAchievementOpen] = useState(false);
  const [selectedSessionForParticipants, setSelectedSessionForParticipants] = useState<Session | null>(null);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);

  const handleAddAchievement = async () => {
    if (!newAchievement.title) {
      toast.error("Achievement title is required");
      return;
    }

    if (!user) return;

    setIsLoading(true);
    const updatedAchievements = [
      ...achievements,
      {
        ...newAchievement,
        id: Date.now() // Use timestamp as ID for local/temp
      }
    ];

    try {
      const result = await supabaseService.updateProfile(user.id, {
        achievements: updatedAchievements
      });
      if (result) {
        setAchievements(updatedAchievements);
        toast.success("Achievement added successfully");
        await refreshUser();
        setNewAchievement({ title: "", description: "", date: "", type: "Certification" });
        setIsAddAchievementOpen(false);
      }
    } catch (error) {
      console.error("Add achievement error:", error);
      toast.error("Failed to add achievement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSessionClick = () => {
    if (newSession.title && newSession.description && sessionSpeakers.length > 0) {
      onAddSession({
        title: newSession.title,
        description: newSession.description,
        date: newSession.date,
        time: newSession.time,
        duration: newSession.duration,
        topics: newSession.topics.split(",").map(t => t.trim()),
        speakers: sessionSpeakers,
        sessionType: newSession.sessionType,
        location: newSession.sessionType === "physical" ? newSession.location : undefined,
        maxSlots: Number(newSession.maxSlots) || 50,
        companyName: newSession.companyName || undefined,
        meetingUrl: newSession.meetingUrl || undefined,
        status: "scheduled"
      });
      setNewSession({
        title: "",
        description: "",
        date: "",
        time: "",
        duration: "",
        topics: "",
        sessionType: "online",
        location: "",
        maxSlots: 50,
        companyName: "",
        meetingUrl: ""
      });
      setSessionSpeakers([]);
      setIsAddSessionOpen(false);
    }
  };

  const handleEditSession = (session: Session) => {
    setEditingSessionId(session.id);
    setNewSession({
      title: session.title,
      description: session.description,
      date: session.date,
      time: session.time,
      duration: session.duration,
      topics: session.topics.join(", "),
      sessionType: session.sessionType as "online" | "physical",
      location: session.location || "",
      maxSlots: session.maxSlots || 50,
      companyName: session.companyName || "",
      meetingUrl: session.meetingUrl || ""
    });
    setSessionSpeakers(session.speakers);
    setIsEditSessionOpen(true);
  };

  const handleUpdateSessionClick = async () => {
    if (editingSessionId && newSession.title && newSession.description && sessionSpeakers.length > 0) {
      const success = await onUpdateSession(editingSessionId, {
        title: newSession.title,
        description: newSession.description,
        date: newSession.date,
        time: newSession.time,
        duration: newSession.duration,
        topics: newSession.topics.split(",").map(t => t.trim()),
        speakers: sessionSpeakers,
        sessionType: newSession.sessionType,
        location: newSession.sessionType === "physical" ? newSession.location : undefined,
        maxSlots: Number(newSession.maxSlots) || 50,
        companyName: newSession.companyName || undefined,
        meetingUrl: newSession.meetingUrl || undefined,
      });

      if (success) {
        setIsEditSessionOpen(false);
        setEditingSessionId(null);
        setNewSession({
          title: "",
          description: "",
          date: "",
          time: "",
          duration: "",
          topics: "",
          sessionType: "online",
          location: "",
          maxSlots: 50,
          companyName: "",
          meetingUrl: ""
        });
        setSessionSpeakers([]);
      }
    }
  };
  const handleAddSpeaker = () => {
    if (newSpeaker.name) {
      setSessionSpeakers([...sessionSpeakers, {
        name: newSpeaker.name,
        title: newSpeaker.title,
        avatar: newSpeaker.avatar || user?.avatar || ""
      }]);
      setNewSpeaker({ name: "", title: "", avatar: "" });
    }
  };

  const handleRemoveSpeaker = (index: number) => {
    setSessionSpeakers(sessionSpeakers.filter((_, i) => i !== index));
  };

  const handleAddCurrentMentorAsSpeaker = () => {
    if (user && !sessionSpeakers.some(s => s.name === user.name)) {
      setSessionSpeakers([...sessionSpeakers, {
        name: user.name,
        avatar: user.avatar || "",
        title: user.currentRole || "Mentor"
      }]);
    }
  };

  const generateJitsiLink = () => {
    const randomId = Math.random().toString(36).substring(2, 10);
    const roomName = `Topvoice-Session-${randomId}`;
    const link = `https://meet.jit.si/${roomName}`;
    setNewSession({ ...newSession, meetingUrl: link });
    toast.success("Jitsi Meet link generated!");
  };


  const handleDeleteAchievement = async (id: number) => {
    if (!user) return;
    const updatedAchievements = achievements.filter(a => a.id !== id);

    try {
      const result = await supabaseService.updateProfile(user.id, {
        achievements: updatedAchievements
      });
      if (result) {
        setAchievements(updatedAchievements);
        toast.success("Achievement deleted");
        await refreshUser();
      }
    } catch (error) {
      toast.error("Failed to delete achievement");
    }
  };

  const handleDeleteSessionClick = (id: number | string) => {
    onDeleteSession(id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Mentor Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your portfolio and tech sessions
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="flex w-full overflow-x-auto justify-start h-auto p-1 bg-muted/50 scrollbar-hide">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="availability" className="gap-2">
            <Calendar className="w-4 h-4" />
            Availability
          </TabsTrigger>
          <TabsTrigger value="mentorship-requests" className="gap-2">
            <UserPlus className="w-4 h-4" />
            Mentorship Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="p-6 max-w-2xl">
            <h3 className="mb-6">Profile Information</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileData.avatar} />
                  <AvatarFallback>
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" onClick={() => navigate("/profile-setup")}>Update Avatar</Button>
                  <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB</p>
                </div>
              </div>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={profileData.title}
                    onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input
                    value={profileData.company}
                    onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Bio</Label>
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Expertise (comma-separated)</Label>
                  <Input
                    value={profileData.expertise}
                    onChange={(e) => setProfileData({ ...profileData, expertise: e.target.value })}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h3>Your Achievements</h3>
            <Dialog open={isAddAchievementOpen} onOpenChange={setIsAddAchievementOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Achievement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Achievement</DialogTitle>
                  <DialogDescription>
                    Add a new achievement, certification, or milestone to showcase on your profile.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={newAchievement.title}
                      onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                      placeholder="Achievement title"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newAchievement.description}
                      onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                      placeholder="Describe your achievement"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      value={newAchievement.date}
                      onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
                      placeholder="e.g., March 2024"
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Input
                      value={newAchievement.type}
                      onChange={(e) => setNewAchievement({ ...newAchievement, type: e.target.value })}
                      placeholder="e.g., Certification, Project, Speaking"
                    />
                  </div>
                  <Button onClick={handleAddAchievement} className="w-full">
                    Add Achievement
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="mb-1">{achievement.title}</h4>
                    <Badge variant="outline">{achievement.type}</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAchievement(achievement.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <p className="text-muted-foreground mb-3 text-sm">{achievement.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {achievement.date}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h3>Your Tech Sessions</h3>
            <Dialog open={isAddSessionOpen} onOpenChange={setIsAddSessionOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Session
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Session</DialogTitle>
                  <DialogDescription>
                    Create a new tech session to share your knowledge with the community.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Session Title</Label>
                      <Input
                        value={newSession.title}
                        onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                        placeholder="e.g., Senior Web Development Roadmap"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company/Organization (Optional)</Label>
                      <Input
                        value={newSession.companyName}
                        onChange={(e) => setNewSession({ ...newSession, companyName: e.target.value })}
                        placeholder="e.g., Topvoice.lk"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={newSession.description}
                      onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                      placeholder="What will users learn in this session?"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={newSession.date}
                        onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={newSession.time}
                        onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input
                        value={newSession.duration}
                        onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
                        placeholder="e.g., 60 mins"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Session Type</Label>
                      <Select
                        value={newSession.sessionType}
                        onValueChange={(val: "online" | "physical") => setNewSession({ ...newSession, sessionType: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">Online (Jitsi Meet)</SelectItem>
                          <SelectItem value="physical">Physical Location</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Max Slots</Label>
                      <Input
                        type="number"
                        value={newSession.maxSlots}
                        onChange={(e) => setNewSession({ ...newSession, maxSlots: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  {newSession.sessionType === "online" ? (
                    <div className="space-y-2">
                      <Label className="flex justify-between">
                        Meeting URL
                        <button
                          type="button"
                          onClick={generateJitsiLink}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <Zap className="w-3 h-3" /> Generate Free Jitsi Link
                        </button>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          value={newSession.meetingUrl}
                          onChange={(e) => setNewSession({ ...newSession, meetingUrl: e.target.value })}
                          placeholder="https://meet.jit.si/your-room"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={newSession.location}
                        onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
                        placeholder="e.g., Colombo, Sri Lanka"
                      />
                    </div>
                  )}

                  <div className="border rounded-lg p-4 bg-muted/30">
                    <div className="flex items-center justify-between mb-3">
                      <Label>Speakers ({sessionSpeakers.length})</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddCurrentMentorAsSpeaker}
                      >
                        <UserPlus className="w-3 h-3 mr-1" />
                        Add Me
                      </Button>
                    </div>

                    {sessionSpeakers.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {sessionSpeakers.map((speaker, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-background p-2 rounded-md">
                            <span className="text-sm truncate flex-1">{speaker.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveSpeaker(idx)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Input
                        placeholder="Speaker name"
                        value={newSpeaker.name}
                        onChange={(e) => setNewSpeaker({ ...newSpeaker, name: e.target.value })}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={handleAddSpeaker}
                        disabled={!newSpeaker.name}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Speaker
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Topics (comma-separated)</Label>
                    <Input
                      value={newSession.topics}
                      onChange={(e) => setNewSession({ ...newSession, topics: e.target.value })}
                      placeholder="e.g., React, Hooks, State Management"
                    />
                  </div>

                  <Button
                    onClick={handleAddSessionClick}
                    className="w-full"
                    disabled={!newSession.title || !newSession.description || sessionSpeakers.length === 0}
                  >
                    Create Session
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Session Dialog */}
            <Dialog open={isEditSessionOpen} onOpenChange={setIsEditSessionOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Tech Session</DialogTitle>
                  <DialogDescription>
                    Update the details of your technical session.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Session Title</Label>
                      <Input
                        value={newSession.title}
                        onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                        placeholder="e.g., Senior Web Development Roadmap"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company/Organization (Optional)</Label>
                      <Input
                        value={newSession.companyName}
                        onChange={(e) => setNewSession({ ...newSession, companyName: e.target.value })}
                        placeholder="e.g., Topvoice.lk"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={newSession.description}
                      onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                      placeholder="What will users learn in this session?"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={newSession.date}
                        onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={newSession.time}
                        onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input
                        value={newSession.duration}
                        onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
                        placeholder="e.g., 60 mins"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Session Type</Label>
                      <Select
                        value={newSession.sessionType}
                        onValueChange={(val: "online" | "physical") => setNewSession({ ...newSession, sessionType: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">Online (Jitsi Meet)</SelectItem>
                          <SelectItem value="physical">Physical Location</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Max Slots</Label>
                      <Input
                        type="number"
                        value={newSession.maxSlots}
                        onChange={(e) => setNewSession({ ...newSession, maxSlots: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  {newSession.sessionType === "online" ? (
                    <div className="space-y-2">
                      <Label className="flex justify-between">
                        Meeting URL
                        <button
                          type="button"
                          onClick={generateJitsiLink}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <Zap className="w-3 h-3" /> Generate Free Jitsi Link
                        </button>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          value={newSession.meetingUrl}
                          onChange={(e) => setNewSession({ ...newSession, meetingUrl: e.target.value })}
                          placeholder="https://meet.jit.si/your-room"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={newSession.location}
                        onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
                        placeholder="e.g., Colombo, Sri Lanka"
                      />
                    </div>
                  )}

                  <div className="border rounded-lg p-4 bg-muted/30">
                    <div className="flex items-center justify-between mb-3">
                      <Label>Speakers ({sessionSpeakers.length})</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddCurrentMentorAsSpeaker}
                      >
                        <UserPlus className="w-3 h-3 mr-1" />
                        Add Me
                      </Button>
                    </div>

                    {sessionSpeakers.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {sessionSpeakers.map((speaker, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-background p-2 rounded-md">
                            <span className="text-sm truncate flex-1">{speaker.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveSpeaker(idx)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Input
                        placeholder="Speaker name"
                        value={newSpeaker.name}
                        onChange={(e) => setNewSpeaker({ ...newSpeaker, name: e.target.value })}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={handleAddSpeaker}
                        disabled={!newSpeaker.name}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Speaker
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Topics (comma-separated)</Label>
                    <Input
                      value={newSession.topics}
                      onChange={(e) => setNewSession({ ...newSession, topics: e.target.value })}
                      placeholder="e.g., React, Hooks, State Management"
                    />
                  </div>

                  <Button
                    onClick={handleUpdateSessionClick}
                    className="w-full"
                    disabled={!newSession.title || !newSession.description || sessionSpeakers.length === 0}
                  >
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {mentorSessions.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-10 h-10 text-primary" />
              </div>
              <h3 className="mb-2">No sessions yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first tech session to share your knowledge with the community!
              </p>
              <Button onClick={() => setIsAddSessionOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Session
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {mentorSessions.map((session) => (
                <Card
                  key={session.id}
                  className="p-6 hover:shadow-lg transition-all cursor-pointer border-transparent hover:border-primary/20 group"
                  onClick={() => {
                    setSelectedSessionForParticipants(session);
                    setIsParticipantsModalOpen(true);
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="mb-2">{session.title}</h4>
                      <div className="flex gap-2">
                        <Badge variant={session.sessionType === "online" ? "default" : "secondary"}>
                          {session.sessionType === "online" ? (
                            <><Monitor className="w-3 h-3 mr-1" /> Online</>
                          ) : (
                            <><MapPin className="w-3 h-3 mr-1" /> Physical</>
                          )}
                        </Badge>
                        {session.companyName && (
                          <Badge variant="outline">{session.companyName}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleEditSession(session);
                        }}
                      >
                        <Edit className="w-4 h-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleDeleteSessionClick(session.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm line-clamp-2">{session.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block mb-1">Date & Time</span>
                      <span>{session.date} at {session.time}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Duration</span>
                      <span>{session.duration}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        {(() => {
                          const participants = sessionRequests.filter(r => String(r.sessionId) === String(session.id) && (r.status === "accepted" || r.status === "pending"));
                          const pendingCount = participants.filter(p => p.status === "pending").length;
                          const acceptedCount = participants.filter(p => p.status === "accepted").length;
                          return (
                            <span className="flex items-center gap-2">
                              {acceptedCount} Joined
                              {pendingCount > 0 && (
                                <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded-full border border-yellow-200">
                                  <Clock className="w-3 h-3" />
                                  {pendingCount} Pending
                                </span>
                              )}
                            </span>
                          );
                        })()}
                      </span>
                    </div>
                    <Button variant="link" size="sm" className="p-0 h-auto">View Details</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="availability" className="mt-6">
          <AvailabilitySettings />
        </TabsContent>


        <TabsContent value="mentorship-requests" className="mt-6">
          <SessionRequestsManager
            sessionRequests={sessionRequests}
            sessions={sessions}
            currentUserId={currentUserId || ""}
            onRespondToRequest={onRespondToRequest}
            title="Mentorship Requests"
            description="Manage personal one-on-one mentorship requests from students"
            type="mentorship"
          />
        </TabsContent>
      </Tabs>

      <SessionParticipantsModal
        open={isParticipantsModalOpen}
        onOpenChange={setIsParticipantsModalOpen}
        session={selectedSessionForParticipants}
        requests={sessionRequests}
        onRespondToRequest={onRespondToRequest}
      />
    </div>
  );
}
