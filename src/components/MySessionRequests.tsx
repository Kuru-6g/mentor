import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Video,
  MapPin,
  AlertCircle,
  ExternalLink
} from "lucide-react";

interface Session {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  sessionType: "online" | "physical";
  location?: string;
  meetingUrl?: string;
}

interface SessionRequest {
  id: string;
  sessionId: number | string | null;
  userId: string;
  status: "pending" | "accepted" | "rejected";
  requestedAt: string;
  meetingUrl?: string;
  mentorMessage?: string;
}

interface MySessionRequestsProps {
  sessionRequests: SessionRequest[];
  sessions: Session[];
}

export function MySessionRequests({ sessionRequests, sessions }: MySessionRequestsProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge className="bg-green-500 text-white gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Accepted
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  if (sessionRequests.length === 0) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="mb-2">No Session Requests</h3>
        <p className="text-muted-foreground">
          Browse tech sessions and request to join to get started
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="mb-4">My Session Requests</h3>
      {sessionRequests.map((request) => {
        const session = request.sessionId ? sessions.find(s => s.id === Number(request.sessionId)) : null;

        return (
          <Card key={request.id} className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h4 className="mb-2">{session?.title || "Direct Mentorship Request"}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {session?.description || "A request for a one-on-one mentorship session."}
                </p>

                {session && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{formatDate(session.date)} at {session.time}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      {session.sessionType === "online" ? (
                        <Video className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span>
                        {session.sessionType === "online"
                          ? "Online Session"
                          : session.location || "Physical Session"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-3 text-xs text-muted-foreground">
                  Requested on {formatDate(request.requestedAt)}
                </div>
              </div>

              <div>
                {getStatusBadge(request.status)}
              </div>
            </div>

            {request.status === "accepted" && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <div className="text-sm">
                      <p className="font-semibold text-green-800 dark:text-green-300 mb-1">Your request has been accepted!</p>
                      {request.mentorMessage ? (
                        <p className="text-muted-foreground italic mb-2">"{request.mentorMessage}"</p>
                      ) : (
                        <p className="text-muted-foreground">The mentor will contact you with session details.</p>
                      )}
                    </div>
                    {(session?.meetingUrl || request.meetingUrl) && (
                      <Button
                        size="sm"
                        className="mt-3 gap-2"
                        onClick={() => window.open(session?.meetingUrl || request.meetingUrl, '_blank')}
                      >
                        <Video className="w-4 h-4" />
                        Join Jitsi Meeting
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {request.status === "rejected" && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">Request not accepted</p>
                    {request.mentorMessage && (
                      <p className="text-sm text-muted-foreground italic mb-2">"{request.mentorMessage}"</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Unfortunately, your request was not accepted. You can request to join other sessions.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
