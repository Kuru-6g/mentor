import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import {
  Users,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Target,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Monitor,
  Video
} from "lucide-react";
import { Session, SessionRequest } from "../services/supabaseService";


interface SessionParticipantsProps {
  sessions: Session[];
  sessionRequests: SessionRequest[];
  currentUserId: string;
}

export function SessionParticipants({
  sessions,
  sessionRequests,
  currentUserId
}: SessionParticipantsProps) {
  const [expandedSessions, setExpandedSessions] = useState<Set<number>>(new Set());

  // Filter sessions created by current user
  // Match by createdBy OR if the user is a speaker (for backward compatibility with mock data)
  const mySessionIds = sessions
    .filter((s: any) => {
      // Check if session was created by current user
      if (s.createdBy === currentUserId) return true;

      // For mock sessions without proper createdBy, check if user is a speaker
      // This assumes currentUserId might be an email/id that matches speaker name
      if (s.speakers && Array.isArray(s.speakers)) {
        return s.speakers.some((speaker: any) =>
          speaker.name === currentUserId ||
          speaker.name === "Sarah Johnson" // Temporary fallback for current mock mentor
        );
      }

      return false;
    })
    .map(s => s.id);

  // Get accepted participants grouped by session
  const sessionParticipants = mySessionIds.map(sessionId => {
    const session = sessions.find(s => s.id === sessionId);
    const participants = sessionRequests.filter(
      r => String(r.sessionId) === String(sessionId) && (r.status === "accepted" || r.status === "pending")
    );
    return { session, participants };
  }).filter(sp => sp.session && sp.participants.length > 0);

  const toggleSessionDetails = (sessionId: number) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateString;
    }
  };

  const ParticipantCard = ({ participant }: { participant: SessionRequest }) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const hasAdditionalDetails = participant.phone || participant.occupation ||
      participant.experienceLevel || participant.reasonToJoin || participant.expectations;

    return (
      <Card className="p-5 border-border hover:border-primary/30 transition-colors">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12 ring-2 ring-primary/30">
            <AvatarImage src={participant.userAvatar} alt={participant.userName} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {participant.userName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <h4 className="text-foreground mb-1">{participant.userName}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{participant.userEmail}</span>
                </div>
              </div>
              <Badge
                className={participant.status === "accepted"
                  ? "bg-green-500/10 text-green-600 border-green-500/20"
                  : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"}
              >
                {participant.status === "accepted" ? "Accepted" : "Pending"}
              </Badge>
            </div>

            {participant.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Phone className="w-4 h-4" />
                <span>{participant.phone}</span>
              </div>
            )}

            {(participant.occupation || participant.experienceLevel) && (
              <div className="flex flex-wrap gap-2 mb-2">
                {participant.occupation && (
                  <Badge variant="outline" className="text-xs">
                    <Briefcase className="w-3 h-3 mr-1" />
                    {participant.occupation}
                  </Badge>
                )}
                {participant.experienceLevel && (
                  <Badge variant="outline" className="text-xs">
                    <GraduationCap className="w-3 h-3 mr-1" />
                    {participant.experienceLevel.replace(/-/g, ' ')}
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Joined {formatDate(participant.updatedAt)}</span>
            </div>

            {hasAdditionalDetails && (
              <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen} className="mt-3">
                <CollapsibleTrigger asChild>
                  <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                    <Sparkles className="w-3 h-3" />
                    {isDetailsOpen ? "Hide" : "View"} application details
                    <span className="text-xs ml-1">{isDetailsOpen ? "▲" : "▼"}</span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 space-y-3 pt-3 border-t border-border/50">
                  {participant.reasonToJoin && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Target className="w-3 h-3 text-primary" />
                        <span>Why they joined</span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed bg-primary/5 p-2 rounded border border-primary/10">
                        {participant.reasonToJoin}
                      </p>
                    </div>
                  )}
                  {participant.expectations && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span>Their expectations</span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed bg-primary/5 p-2 rounded border border-primary/10">
                        {participant.expectations}
                      </p>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </div>
      </Card>
    );
  };

  if (sessionParticipants.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <h3 className="mb-2">No Participants Yet</h3>
        <p className="text-muted-foreground">
          When participants join your sessions, they'll appear here
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="mb-2">Session Participants</h2>
        <p className="text-muted-foreground">
          View all participants who have joined your sessions
        </p>
      </div>

      {sessionParticipants.map(({ session, participants }) => {
        if (!session) return null;

        return (
          <Card key={session.id} className="overflow-hidden border-primary/20">
            {/* Session Header */}
            <div className="bg-primary/5 border-b border-primary/10 p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-foreground mb-2">{session.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{session.time}</span>
                    </div>
                    <Badge variant={session.sessionType === "online" ? "default" : "secondary"}>
                      {session.sessionType === "online" ? (
                        <>
                          <Monitor className="w-3 h-3 mr-1" />
                          Online
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3 h-3 mr-1" />
                          Physical
                        </>
                      )}
                    </Badge>
                  </div>
                  {session.sessionType === "physical" && session.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <MapPin className="w-4 h-4" />
                      <span>{session.location}</span>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-2xl text-primary">{participants.length}</p>
                      <p className="text-xs text-muted-foreground">
                        {participants.length === 1 ? 'Participant' : 'Participants'}
                      </p>
                    </div>
                  </div>
                  {session.maxSlots && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {session.availableSlots} slots remaining
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Participants List */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {participants.map((participant) => (
                  <ParticipantCard key={participant.id} participant={participant} />
                ))}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
