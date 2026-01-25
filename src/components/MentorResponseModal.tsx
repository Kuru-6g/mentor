import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CheckCircle2, XCircle, MessageSquare, Zap, Video } from "lucide-react";
import { toast } from "sonner";

interface MentorResponseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (message: string, meetingUrl?: string) => void;
    action: "accept" | "reject";
    userName: string;
}

export function MentorResponseModal({
    isOpen,
    onClose,
    onConfirm,
    action,
    userName
}: MentorResponseModalProps) {
    const [message, setMessage] = useState("");
    const [meetingUrl, setMeetingUrl] = useState("");

    const handleConfirm = () => {
        onConfirm(message, meetingUrl);
        setMessage(""); // Reset for next time
        setMeetingUrl("");
    };

    const generateJitsiLink = () => {
        const randomId = Math.random().toString(36).substring(2, 10);
        const roomName = `Topvoice-Mentorship-${randomId}`;
        const link = `https://meet.jit.si/${roomName}`;

        setMeetingUrl(link);
        toast.success("Jitsi Meet link generated!");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        {action === "accept" ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                            <XCircle className="w-5 h-5 text-destructive" />
                        )}
                        <DialogTitle>
                            {action === "accept" ? "Accept Request" : "Reject Request"}
                        </DialogTitle>
                    </div>
                    <DialogDescription>
                        {action === "accept"
                            ? `You are about to accept ${userName}'s request. Send them a short message to get started.`
                            : `You are about to reject ${userName}'s request. Providing a reason helps them learn and improve.`
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="message" className="flex items-center justify-between w-full">
                            <span className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-primary" />
                                Your Message
                            </span>
                            {action === "accept" && (
                                <button
                                    type="button"
                                    onClick={generateJitsiLink}
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                    <Zap className="w-3 h-3" /> Generate Free Jitsi Link
                                </button>
                            )}
                        </Label>
                        <Textarea
                            id="message"
                            placeholder={action === "accept"
                                ? "e.g., Looking forward to it! Let's connect via..."
                                : "e.g., I'm currently fully booked, but I recommend checking out..."
                            }
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="resize-none min-h-[100px]"
                        />
                    </div>

                    {action === "accept" && (
                        <div className="space-y-2">
                            <Label htmlFor="meetingUrl" className="flex items-center gap-2">
                                <Video className="w-4 h-4 text-primary" />
                                Meeting Link (Optional)
                            </Label>
                            <Input
                                id="meetingUrl"
                                placeholder="https://meet.jit.si/..."
                                value={meetingUrl}
                                onChange={(e) => setMeetingUrl(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className={action === "accept" ? "bg-primary hover:bg-primary/90" : "bg-destructive hover:bg-destructive/90"}
                    >
                        Confirm {action === "accept" ? "Accept" : "Reject"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
