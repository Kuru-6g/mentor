import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Mail, 
  Calendar,
  Users,
  Phone,
  Briefcase,
  GraduationCap,
  Target,
  Sparkles
} from "lucide-react";

interface Session {
  id: number;
  title: string;
  date: string;
  time: string;
}

interface SessionRequest {
  id: string;
  sessionId: number;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  status: "pending" | "accepted" | "rejected";
  requestedAt: string;
  updatedAt: string;
  phone?: string;
  occupation?: string;
  experienceLevel?: string;
  reasonToJoin?: string;
  expectations?: string;
}

interface SessionRequestsManagerProps {
  sessionRequests: SessionRequest[];
  sessions: Session[];
  currentUserId: string;
  onRespondToRequest: (requestId: string, action: "accept" | "reject") => void;
}

export function SessionRequestsManager({ 
  sessionRequests,
  sessions,
  currentUserId,
  onRespondToRequest
}: SessionRequestsManagerProps) {
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);

  // Filter requests for sessions created by current user
  const mySessionIds = sessions
    .filter((s: any) => s.createdBy === currentUserId)
    .map(s => s.id);
  
  const requests = sessionRequests.filter(r => mySessionIds.includes(r.sessionId));

  const handleRespond = async (requestId: string, action: "accept" | "reject") => {
    setProcessingRequest(requestId);
    onRespondToRequest(requestId, action);
    setProcessingRequest(null);
  };

  const pendingRequests = requests.filter(r => r.status === "pending");
  const acceptedRequests = requests.filter(r => r.status === "accepted");
  const rejectedRequests = requests.filter(r => r.status === "rejected");

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

  const getSessionInfo = (sessionId: number) => {
    return sessions.find(s => s.id === sessionId);
  };

  const RequestCard = ({ request }: { request: SessionRequest }) => {
    const session = getSessionInfo(request.sessionId);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const hasAdditionalDetails = request.phone || request.occupation || request.experienceLevel || request.reasonToJoin || request.expectations;
    
    return (
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4 flex-1">
            <Avatar className="w-12 h-12 ring-2 ring-primary/20">
              <AvatarImage src={request.userAvatar} alt={request.userName} />
              <AvatarFallback>{request.userName.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="mb-1">{request.userName}</h3>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Mail className="w-4 h-4" />
                <span>{request.userEmail}</span>
              </div>

              {request.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Phone className="w-4 h-4" />
                  <span>{request.phone}</span>
                </div>
              )}

              {session && (
                <div className="mb-2">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Session: </span>
                    <span className="text-foreground">{session.title}</span>
                  </p>
                </div>
              )}

              {session && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{session.date} at {session.time}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Requested {formatDate(request.requestedAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {request.status === "pending" && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleRespond(request.id, "accept")}
                  disabled={processingRequest === request.id}
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRespond(request.id, "reject")}
                  disabled={processingRequest === request.id}
                  className="gap-2 border-border hover:border-primary/50"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </Button>
              </>
            )}
            {request.status === "accepted" && (
              <Badge className="bg-green-500 text-white">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Accepted
              </Badge>
            )}
            {request.status === "rejected" && (
              <Badge variant="destructive">
                <XCircle className="w-3 h-3 mr-1" />
                Rejected
              </Badge>
            )}
          </div>
        </div>

        {hasAdditionalDetails && (
          <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-between text-muted-foreground hover:text-foreground hover:bg-primary/5"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {isDetailsOpen ? "Hide" : "View"} Application Details
                </span>
                <span className="text-xs">{isDetailsOpen ? "▲" : "▼"}</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4 pt-4 border-t border-border/50">
              {(request.occupation || request.experienceLevel) && (
                <div className="grid grid-cols-2 gap-4">
                  {request.occupation && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <span>Occupation</span>
                      </div>
                      <p className="text-sm text-foreground pl-6">{request.occupation}</p>
                    </div>
                  )}
                  {request.experienceLevel && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        <span>Experience Level</span>
                      </div>
                      <p className="text-sm text-foreground pl-6 capitalize">{request.experienceLevel.replace(/-/g, ' ')}</p>
                    </div>
                  )}
                </div>
              )}

              {request.reasonToJoin && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="w-4 h-4 text-primary" />
                    <span>Why they want to join</span>
                  </div>
                  <p className="text-sm text-foreground pl-6 leading-relaxed bg-primary/5 p-3 rounded-md border border-primary/10">
                    {request.reasonToJoin}
                  </p>
                </div>
              )}

              {request.expectations && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Their expectations</span>
                  </div>
                  <p className="text-sm text-foreground pl-6 leading-relaxed bg-primary/5 p-3 rounded-md border border-primary/10">
                    {request.expectations}
                  </p>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}
      </Card>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-2">Session Requests</h2>
        <p className="text-muted-foreground">
          Manage student requests to join your sessions
        </p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="w-4 h-4" />
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="accepted" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Accepted ({acceptedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <XCircle className="w-4 h-4" />
            Rejected ({rejectedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pendingRequests.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2">No Pending Requests</h3>
              <p className="text-muted-foreground">
                When students request to join your sessions, they'll appear here
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="accepted">
          {acceptedRequests.length === 0 ? (
            <Card className="p-12 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2">No Accepted Requests</h3>
              <p className="text-muted-foreground">
                Accepted student requests will appear here
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {acceptedRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected">
          {rejectedRequests.length === 0 ? (
            <Card className="p-12 text-center">
              <XCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2">No Rejected Requests</h3>
              <p className="text-muted-foreground">
                Rejected student requests will appear here
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {rejectedRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
