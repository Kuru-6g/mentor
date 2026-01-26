import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Search, Calendar, Clock, Users, Video, MapPin, Monitor, Building2, Inbox, CheckCircle2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { MySessionRequests } from "./MySessionRequests";
import { JoinSessionDialog, JoinSessionFormData } from "./JoinSessionDialog";

import { supabaseService, Session, SessionRequest, UserProfile } from "../services/supabaseService";

interface SessionsPageProps {
  sessions: Session[];
  onRequestToJoin: (sessionId: number | string, formData?: any, mentorId?: string) => void;
  userRole: UserProfile['role'] | null;
  currentUserId?: string;
  sessionRequests: SessionRequest[];
}

export function SessionsPage({
  sessions,
  onRequestToJoin,
  userRole,
  currentUserId,
  sessionRequests
}: SessionsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
    session.speakers.some(speaker => speaker.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (session.companyName && session.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleRequestToJoinSession = (session: Session) => {
    if (session.availableSlots === 0) {
      toast.error("Session is full", {
        description: "All slots for this session have been taken."
      });
      return;
    }

    setSelectedSession(session);
    setIsJoinDialogOpen(true);
  };

  const handleJoinDialogSubmit = (formData: JoinSessionFormData) => {
    if (!selectedSession) return;

    onRequestToJoin(selectedSession.id, {
      phone: formData.phone,
      occupation: formData.occupation,
      experienceLevel: formData.experienceLevel,
      reasonToJoin: formData.reasonToJoin,
      expectations: formData.expectations,
      fullName: formData.fullName,
      email: formData.email,
    }, selectedSession.createdBy);
  };

  const getRequestStatus = (sessionId: number | string) => {
    if (!currentUserId) return null;
    return sessionRequests.find(
      r => String(r.sessionId) === String(sessionId) && String(r.userId) === String(currentUserId)
    );
  };

  const myRequests = currentUserId
    ? sessionRequests.filter(r => r.userId === currentUserId)
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Tech Sessions</h1>
        <p className="text-muted-foreground">
          Join live sessions hosted by our expert mentors
        </p>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="browse">Browse Sessions</TabsTrigger>
          <TabsTrigger value="requests" className="gap-2">
            <Inbox className="w-4 h-4" />
            My Requests ({myRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          <div className="mb-8">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search sessions by topic, title, or mentor..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredSessions.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="mb-2">No sessions found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search or check back later for new sessions."
                  : "No tech sessions are currently scheduled. Check back soon!"}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSessions.map((session) => (
                <Card key={session.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      {session.companyName && (
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{session.companyName}</span>
                        </div>
                      )}
                      <h3>{session.title}</h3>
                    </div>
                    <Badge variant={session.sessionType === "online" ? "default" : "secondary"}>
                      {session.sessionType === "online" ? (
                        <><Monitor className="w-3 h-3 mr-1" /> Online</>
                      ) : (
                        <><MapPin className="w-3 h-3 mr-1" /> Physical</>
                      )}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{session.description}</p>

                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      {session.speakers.length > 1 ? `${session.speakers.length} Speakers` : "Speaker"}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {session.speakers.map((speaker, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={speaker.avatar} />
                            <AvatarFallback>
                              {speaker.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{speaker.name}</p>
                            {speaker.title && (
                              <p className="text-xs text-muted-foreground truncate">{speaker.title}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{session.time}</span>
                    </div>
                  </div>

                  {session.sessionType === "physical" && session.location && (
                    <div className="flex items-center gap-2 text-sm mb-4">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{session.location}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm mb-4">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{session.attendees} registered • {session.availableSlots} slots available</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {session.topics.map((topic, index) => (
                        <Badge key={index} variant="outline">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {(() => {
                    const request = getRequestStatus(session.id);
                    if (request) {
                      if (request.status === "pending") {
                        return (
                          <Button className="w-full" disabled variant="outline">
                            <Clock className="w-4 h-4 mr-2" />
                            Request Pending
                          </Button>
                        );
                      } else if (request.status === "accepted") {
                        const meetingUrl = session.meetingUrl || request.meetingUrl;
                        return (
                          <div className="flex flex-col gap-2 w-full">
                            <Button className="w-full" disabled variant="default">
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Accepted
                            </Button>
                            {session.sessionType === "online" && meetingUrl && (
                              <Button
                                className="w-full gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
                                variant="outline"
                                onClick={() => window.open(meetingUrl, '_blank')}
                              >
                                <Video className="w-4 h-4" />
                                Join Meeting
                                <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                              </Button>
                            )}
                          </div>
                        );
                      }
                      else if (request.status === "rejected") {
                        return (
                          <Button className="w-full" disabled variant="destructive">
                            Request Rejected
                          </Button>
                        );
                      }
                    }
                    return (
                      <Button
                        className="w-full"
                        onClick={() => handleRequestToJoinSession(session)}
                        disabled={session.availableSlots === 0}
                      >
                        {session.availableSlots === 0 ? "Session Full" : "Request to Join"}
                      </Button>
                    );
                  })()}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests">
          <MySessionRequests
            sessionRequests={myRequests}
            sessions={sessions}
          />
        </TabsContent>
      </Tabs>

      {/* Join Session Dialog */}
      <JoinSessionDialog
        open={isJoinDialogOpen}
        onOpenChange={setIsJoinDialogOpen}
        sessionTitle={selectedSession?.title || ""}
        onSubmit={handleJoinDialogSubmit}
      />
    </div>
  );
}
