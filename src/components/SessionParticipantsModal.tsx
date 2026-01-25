import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { Mail, Phone, Briefcase, GraduationCap, Target, Sparkles, Clock, Users, Video, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Session, SessionRequest, Speaker } from "../services/supabaseService";


interface SessionParticipantsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    session: Session | null;
    requests: SessionRequest[];
}

export function SessionParticipantsModal({
    open,
    onOpenChange,
    session,
    requests
}: SessionParticipantsModalProps) {
    if (!session) return null;

    // Use String coercion for robust ID comparison (handles both number and UUID string IDs)
    const participants = requests.filter(r => String(r.sessionId) === String(session.id) && (r.status === "accepted" || r.status === "pending"));
    const acceptedCount = participants.filter(p => p.status === "accepted").length;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <DialogTitle>Registered Participants</DialogTitle>
                    </div>
                    <DialogDescription>
                        Viewing registered users for <strong className="text-foreground">{session.title}</strong>
                    </DialogDescription>
                </DialogHeader>

                {session.meetingUrl && (
                    <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-full">
                                <Video className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Video Call Ready</p>
                                <p className="text-xs text-muted-foreground">Join the session using Jitsi Meet</p>
                            </div>
                        </div>
                        <Button size="sm" onClick={() => window.open(session.meetingUrl, '_blank')} className="gap-2">
                            Start Meeting
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Accepted / Total</p>
                            <p className="text-3xl font-bold text-primary">{acceptedCount} / {participants.length}</p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                            <p>{session.date}</p>
                            <p>{session.time}</p>
                        </div>
                    </div>

                    {participants.length === 0 ? (
                        <div className="text-center py-12 bg-muted/10 rounded-lg border border-dashed">
                            <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground">No users have joined this session yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {participants.map((participant) => (
                                <Card key={participant.id} className="p-4 border-border hover:border-primary/20 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="w-12 h-12 border-2 border-primary/10">
                                            <AvatarImage src={participant.userAvatar} alt={participant.userName} />
                                            <AvatarFallback className="bg-primary/5 text-primary">
                                                {participant.userName.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div>
                                                    <h4 className="text-foreground font-semibold">{participant.userName}</h4>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Mail className="w-4 h-4" />
                                                        <span className="truncate">{participant.userEmail}</span>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={participant.status === "accepted"
                                                        ? "bg-green-500/5 text-green-600 border-green-500/20"
                                                        : "bg-yellow-500/5 text-yellow-600 border-yellow-500/20"}
                                                >
                                                    {participant.status === "accepted" ? "Accepted" : "Pending"}
                                                </Badge>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {participant.phone && (
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                                        <Phone className="w-3 h-3" />
                                                        {participant.phone}
                                                    </div>
                                                )}
                                                {participant.occupation && (
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                                        <Briefcase className="w-3 h-3" />
                                                        {participant.occupation}
                                                    </div>
                                                )}
                                                {participant.experienceLevel && (
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                                        <GraduationCap className="w-3 h-3" />
                                                        {participant.experienceLevel}
                                                    </div>
                                                )}
                                            </div>

                                            {(participant.reasonToJoin || participant.expectations) && (
                                                <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                                                    {participant.reasonToJoin && (
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1.5">
                                                                <Target className="w-2.5 h-2.5" /> Why they joined
                                                            </p>
                                                            <p className="text-sm text-foreground bg-primary/5 p-2 rounded leading-relaxed">
                                                                {participant.reasonToJoin}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog >
    );
}
