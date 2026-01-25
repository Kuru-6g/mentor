import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Clock, Calendar, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabaseService } from "../services/supabaseService";
import { useAuth } from "../contexts/AuthContext";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const TIME_SLOTS = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
    "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"
];

interface DayAvailability {
    enabled: boolean;
    startTime: string;
    endTime: string;
}

interface WeeklyAvailability {
    [key: string]: DayAvailability;
}

const DEFAULT_AVAILABILITY: WeeklyAvailability = DAYS.reduce((acc, day) => ({
    ...acc,
    [day.toLowerCase()]: {
        enabled: false,
        startTime: "09:00 AM",
        endTime: "05:00 PM"
    }
}), {});

export function AvailabilitySettings() {
    const { user, refreshUser } = useAuth();
    const [availability, setAvailability] = useState<WeeklyAvailability>(DEFAULT_AVAILABILITY);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user?.availability && typeof user.availability === 'object') {
            // Merge with default to ensure all days exist
            setAvailability({ ...DEFAULT_AVAILABILITY, ...user.availability });
        }
    }, [user]);

    const handleToggleDay = (dayKey: string, enabled: boolean) => {
        setAvailability(prev => ({
            ...prev,
            [dayKey]: { ...prev[dayKey], enabled }
        }));
    };

    const handleTimeChange = (dayKey: string, field: 'startTime' | 'endTime', value: string) => {
        setAvailability(prev => ({
            ...prev,
            [dayKey]: { ...prev[dayKey], [field]: value }
        }));
    };

    const handleSave = async () => {
        if (!user) return;

        setIsSaving(true);
        try {
            const result = await supabaseService.updateProfile(user.id, {
                availability: availability
            });

            if (result) {
                toast.success("Availability updated successfully");
                await refreshUser();
            }
        } catch (error) {
            console.error("Error saving availability:", error);
            toast.error("Failed to update availability");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Weekly Availability
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Set your preferred days and times for mentorship sessions.
                    </p>
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid gap-4">
                {DAYS.map((day) => {
                    const dayKey = day.toLowerCase();
                    const dayData = availability[dayKey];

                    return (
                        <Card key={day} className={`p-4 transition-all ${dayData.enabled ? 'border-primary/20 bg-primary/5' : 'opacity-60'}`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <Switch
                                        id={`day-${dayKey}`}
                                        checked={dayData.enabled}
                                        onCheckedChange={(checked: boolean) => handleToggleDay(dayKey, checked)}
                                    />
                                    <Label htmlFor={`day-${dayKey}`} className="font-semibold text-base w-24">
                                        {day}
                                    </Label>
                                    {dayData.enabled ? (
                                        <Badge variant="success" className="bg-green-500/10 text-green-600 border-green-500/20">Available</Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-muted text-muted-foreground">Unavailable</Badge>
                                    )}
                                </div>

                                {dayData.enabled && (
                                    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                            <Select
                                                value={dayData.startTime}
                                                onValueChange={(val: string) => handleTimeChange(dayKey, 'startTime', val)}
                                            >
                                                <SelectTrigger className="w-[120px] h-9 bg-background">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {TIME_SLOTS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <span className="text-muted-foreground">to</span>
                                        <Select
                                            value={dayData.endTime}
                                            onValueChange={(val: string) => handleTimeChange(dayKey, 'endTime', val)}
                                        >
                                            <SelectTrigger className="w-[120px] h-9 bg-background">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TIME_SLOTS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
