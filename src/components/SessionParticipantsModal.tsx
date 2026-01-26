import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
    Mail,
    Phone,
    Briefcase,
    GraduationCap,
    Target,
    Users,
    Video,
    ExternalLink,
    Clock
} from "lucide-react";
import { Button } from "./ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Session, SessionRequest } from "../services/supabaseService";

interface SessionParticipantsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    session: Session | null;
    requests: SessionRequest[];
    onRespondToRequest?: (requestId: string, action: "accept" | "reject") => void;
}

export function SessionParticipantsModal({
    open,
    onOpenChange,
    session,
    requests,
    onRespondToRequest
}: SessionParticipantsModalProps) {
    if (!session) return null;

    // Use String coercion for robust ID comparison
    const participants = requests.filter(r =>
        String(r.sessionId) === String(session.id) &&
        (r.status === "accepted" || r.status === "pending")
    );
    const acceptedCount = participants.filter(p => p.status === "accepted").length;

    const handleAction = (requestId: string, action: "accept" | "reject") => {
        if (onRespondToRequest) {
            onRespondToRequest(requestId, action);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[98vw] sm:max-w-[95vw] lg:max-w-[1300px] h-[95vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
                <div className="p-6 border-b bg-muted/20">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-primary/10 rounded-xl">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl">Registered Participants</DialogTitle>
                                    <DialogDescription className="text-sm">
                                        Managing users for <span className="font-semibold text-foreground">{session.title}</span>
                                    </DialogDescription>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Status</p>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1">
                                            {acceptedCount} / {participants.length} Accepted
                                        </Badge>
                                    </div>
                                </div>
                                <div className="h-10 w-px bg-border mx-2" />
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Session Data</p>
                                    <p className="text-sm font-semibold">{session.date} • {session.time}</p>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    {session.meetingUrl && (
                        <div className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Video className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Live Session Control</p>
                                    <p className="text-xs text-muted-foreground">The meeting link is shared with all accepted participants.</p>
                                </div>
                            </div>
                            <Button size="sm" onClick={() => window.open(session.meetingUrl, '_blank')} className="gap-2 shadow-sm">
                                <ExternalLink className="w-4 h-4" />
                                Launch Jitsi Meet
                            </Button>
                        </div>
                    )}

                    {participants.length === 0 ? (
                        <div className="text-center py-20 bg-muted/5 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center">
                            <div className="p-4 bg-muted/10 rounded-full mb-4">
                                <Users className="w-12 h-12 text-muted-foreground/30" />
                            </div>
                            <h3 className="text-lg font-medium text-muted-foreground">No participants yet</h3>
                            <p className="text-sm text-muted-foreground/70 max-w-xs mx-auto">
                                When students register for this session, they will appear here in the list.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow>
                                        <TableHead className="w-[250px] py-4">Participant</TableHead>
                                        <TableHead>Contact & Info</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="max-w-[300px]">Reason to Join</TableHead>
                                        <TableHead>Joined At</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {participants.map((participant) => (
                                        <TableRow key={participant.id} className="group hover:bg-primary/[0.02] transition-colors">
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-10 h-10 border-2 border-background shadow-sm">
                                                        <AvatarImage src={participant.userAvatar} alt={participant.userName} />
                                                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                            {participant.userName.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-foreground leading-none mb-1">{participant.userName}</span>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Mail className="w-3 h-3" />
                                                            {participant.userEmail}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1.5">
                                                    {participant.occupation && (
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Briefcase className="w-3.5 h-3.5 text-primary/60" />
                                                            <span className="truncate max-w-[150px]">{participant.occupation}</span>
                                                        </div>
                                                    )}
                                                    {participant.experienceLevel && (
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <GraduationCap className="w-3.5 h-3.5 text-primary/60" />
                                                            <span className="capitalize">{participant.experienceLevel.replace(/-/g, ' ')}</span>
                                                        </div>
                                                    )}
                                                    {participant.phone && (
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Phone className="w-3.5 h-3.5 text-primary/60" />
                                                            <span>{participant.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={participant.status === "accepted"
                                                        ? "bg-green-500/10 text-green-600 border-green-500/20 px-2.5 py-0.5"
                                                        : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 px-2.5 py-0.5"}
                                                >
                                                    {participant.status === "accepted" ? "Accepted" : "Pending"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-[300px]">
                                                {participant.reasonToJoin ? (
                                                    <div className="flex gap-2">
                                                        <Target className="w-4 h-4 text-primary/40 shrink-0 mt-0.5" />
                                                        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2 italic" title={participant.reasonToJoin}>
                                                            "{participant.reasonToJoin}"
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground/50 italic">No reason provided</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {participant.requestedAt ? new Date(participant.requestedAt).toLocaleDateString() : "N/A"}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {participant.status === "pending" && (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 text-xs border-green-200 hover:bg-green-50 hover:text-green-600"
                                                            onClick={() => handleAction(participant.id, "accept")}
                                                        >
                                                            Accept
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 text-xs border-red-200 hover:bg-red-50 hover:text-red-600"
                                                            onClick={() => handleAction(participant.id, "reject")}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </div>
                                                )}
                                                {participant.status === "accepted" && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 text-xs text-muted-foreground hover:text-red-600"
                                                        onClick={() => handleAction(participant.id, "reject")}
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-muted/10 flex justify-end w-full">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="px-8">
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog >
    );
}
