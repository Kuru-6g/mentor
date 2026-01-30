import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Search, Calendar, User, BookOpen, GraduationCap, MapPin, Monitor, Clock, Link as LinkIcon, Sparkles, TrendingUp, Target, Settings } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { supabaseService } from "../services/supabaseService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Session, SessionRequest } from "../services/supabaseService";
import { cn } from "./ui/utils";

interface MenteeDashboardProps {
    sessions: Session[];
    sessionRequests: SessionRequest[];
}

export function MenteeDashboard({ sessions, sessionRequests }: MenteeDashboardProps) {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        bio: user?.bio || "",
        currentRole: user?.currentRole || "",
        interests: user?.interests?.join(", ") || "",
        goals: user?.goals || "",
        avatar: user?.avatar || ""
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || "",
                bio: user.bio || "",
                currentRole: user.currentRole || "",
                interests: user.interests?.join(", ") || "",
                goals: user.goals || "",
                avatar: user.avatar || ""
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
                bio: profileData.bio,
                currentRole: profileData.currentRole,
                interests: profileData.interests.split(",").map(i => i.trim()).filter(Boolean),
                goals: profileData.goals,
                avatar: profileData.avatar,
            };

            const result = await supabaseService.updateProfile(user.id, updates);
            if (result) {
                toast.success("Profile updated successfully");
                await refreshUser();
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Update profile error:", error);
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const myRequests = sessionRequests.filter(r => r.userId === user?.id);
    const joinedSessions = sessions.filter(s =>
        myRequests.some(r => r.sessionId === s.id && r.status === 'accepted')
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="mb-2">Welcome, {user?.name}!</h1>
                    <p className="text-muted-foreground">
                        Track your mentorship journey and find new opportunities to grow.
                    </p>
                </div>
                <Avatar className="w-16 h-16 border-2 border-primary">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <div className="bg-muted/50 p-1 rounded-2xl w-fit mb-8 mx-auto lg:mx-0">
                    <TabsList className="bg-transparent border-none p-0 h-10 w-full lg:w-[600px] grid grid-cols-2 md:grid-cols-4">
                        <TabsTrigger value="overview" className="rounded-xl data-[state=active]:shadow-sm">Overview</TabsTrigger>
                        <TabsTrigger value="sessions" className="rounded-xl data-[state=active]:shadow-sm">My Sessions</TabsTrigger>
                        <TabsTrigger value="discover" className="rounded-xl data-[state=active]:shadow-sm">Discover</TabsTrigger>
                        <TabsTrigger value="profile" className="rounded-xl data-[state=active]:shadow-sm">Settings</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-8 outline-none focus-visible:ring-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <Card className="p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-primary/10">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-4 text-primary shadow-inner">
                                        <Calendar className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">{joinedSessions.length}</h3>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Joined Sessions</p>
                                </div>
                            </Card>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Card className="p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-amber-500/10">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-amber-500/5 rounded-2xl flex items-center justify-center mb-4 text-amber-600 shadow-inner">
                                        <Clock className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-400">{myRequests.filter(r => r.status === 'pending').length}</h3>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pending Requests</p>
                                </div>
                            </Card>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <Card className="p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-indigo-500/10">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 rounded-2xl flex items-center justify-center mb-4 text-indigo-600 shadow-inner">
                                        <TrendingUp className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">{user?.interests?.length || 0}</h3>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Interests Tracked</p>
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                            <Card className="p-6 border-primary/5 hover:border-primary/20 transition-colors">
                                <h3 className="mb-6 flex items-center gap-3 text-xl font-bold">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Calendar className="w-5 h-5 text-primary" />
                                    </div>
                                    Upcoming Sessions
                                </h3>
                                {joinedSessions.length === 0 ? (
                                    <div className="text-center py-10 bg-muted/20 rounded-2xl border border-dashed border-muted">
                                        <Monitor className="w-12 h-12 text-muted/30 mx-auto mb-3" />
                                        <p className="text-muted-foreground font-medium mb-4">No upcoming sessions yet.</p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-full px-6 hover:bg-primary hover:text-white transition-all"
                                            onClick={() => navigate("/sessions")}
                                        >
                                            Browse Sessions
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {joinedSessions.slice(0, 3).map(session => (
                                            <div key={session.id} className="flex items-center gap-4 p-4 bg-card border border-primary/5 hover:border-primary/20 rounded-2xl transition-all group cursor-pointer shadow-sm hover:shadow-md">
                                                <div className="bg-gradient-to-br from-primary to-primary/80 p-3 rounded-xl text-white text-xs font-bold text-center min-w-[70px] shadow-lg shadow-primary/20">
                                                    <div className="text-lg uppercase">{new Date(session.date).toLocaleDateString('en-US', { day: 'numeric' })}</div>
                                                    <div className="opacity-80 uppercase">{new Date(session.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-base font-bold truncate group-hover:text-primary transition-colors">{session.title}</h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {session.time}
                                                        </span>
                                                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {session.sessionType}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Sparkles className="w-5 h-5 text-primary/40" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                            <Card className="p-6 border-primary/5 hover:border-primary/20 transition-colors">
                                <h3 className="mb-6 flex items-center gap-3 text-xl font-bold">
                                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                                        <Target className="w-5 h-5 text-indigo-500" />
                                    </div>
                                    Career Roadmap
                                </h3>
                                <div className="space-y-6">
                                    <div className="relative p-5 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl border border-indigo-500/10">
                                        <div className="absolute top-4 right-4 opacity-10">
                                            <Sparkles className="w-8 h-8 text-indigo-500" />
                                        </div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Core Objective</h4>
                                        <p className="text-sm leading-relaxed text-muted-foreground italic">
                                            {user?.goals ? `"${user.goals}"` : "Define your career trajectory in the profile tab to unlock personalized mentorship tracks."}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-4 px-1 flex items-center justify-between">
                                            Focus Areas
                                            <TrendingUp className="w-4 h-4" />
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {user?.interests?.map((interest, i) => (
                                                <Badge
                                                    key={i}
                                                    variant="secondary"
                                                    className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-none font-medium hover:bg-indigo-500/20 transition-colors"
                                                >
                                                    {interest}
                                                </Badge>
                                            ))}
                                            {(!user?.interests || user.interests.length === 0) && (
                                                <p className="text-xs text-muted-foreground px-1">Curate your technical interests to find target sessions.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </TabsContent>

                <TabsContent value="sessions" className="mt-0 outline-none focus-visible:ring-0">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card className="p-0 overflow-hidden border-primary/5 shadow-sm">
                            <div className="p-6 border-b border-primary/5 bg-muted/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-primary" />
                                        Session History
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Manage and track your previous and upcoming mentorship sessions.</p>
                                </div>
                                <Button
                                    size="sm"
                                    className="rounded-full px-5 bg-primary hover:bg-primary/90 transition-all font-semibold shadow-lg shadow-primary/20"
                                    onClick={() => navigate("/sessions")}
                                >
                                    Find More Sessions
                                </Button>
                            </div>

                            {myRequests.length === 0 ? (
                                <div className="text-center py-20 bg-card">
                                    <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Calendar className="w-10 h-10 text-muted-foreground opacity-30" />
                                    </div>
                                    <h4 className="text-xl font-bold mb-2">No activity found</h4>
                                    <p className="text-muted-foreground max-w-sm mx-auto mb-8">You haven't requested any sessions yet. Explore our community sessions to find the right expertise.</p>
                                    <Button onClick={() => navigate("/sessions")} variant="secondary" className="rounded-full px-8">Browse Catalog</Button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-muted/50">
                                                <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Session details</th>
                                                <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Schedule</th>
                                                <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Current Status</th>
                                                <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-primary/5 bg-card">
                                            {myRequests.map((request) => {
                                                const session = sessions.find(s => String(s.id) === String(request.sessionId));
                                                return (
                                                    <tr key={request.id} className="hover:bg-muted/30 transition-colors group">
                                                        <td className="px-6 py-8">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-base group-hover:text-primary transition-colors leading-tight">
                                                                    {session ? session.title : (
                                                                        <div className="flex items-center gap-1.5">
                                                                            <User className="w-3.5 h-3.5 text-primary" />
                                                                            <span>Personal Mentorship</span>
                                                                        </div>
                                                                    )}
                                                                </span>
                                                                {!session && (
                                                                    <span className="text-xs font-semibold text-muted-foreground capitalize mt-1.5 px-2 py-0.5 bg-primary/5 rounded-md w-fit">
                                                                        {request.mentorshipType?.replace(/-/g, ' ') || "One-on-one"}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-8">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-medium text-foreground">
                                                                    {session ? session.date : request.preferredDate || "Not scheduled"}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground mt-1">
                                                                    {session ? session.time : request.preferredTime || "—"}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-8">
                                                            <div className="flex flex-col gap-3">
                                                                <Badge className="w-fit font-bold rounded-full px-3" variant={
                                                                    request.status === 'accepted' ? 'success' as any :
                                                                        request.status === 'rejected' ? 'destructive' : 'secondary'
                                                                }>
                                                                    {request.status}
                                                                </Badge>
                                                                {request.mentorMessage && (
                                                                    <div className="max-w-[280px] p-3 bg-primary/5 rounded-xl border border-primary/10 text-xs text-muted-foreground italic relative group/tooltip shadow-sm">
                                                                        <p className="line-clamp-2 md:line-clamp-none">"{request.mentorMessage}"</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-8 text-right">
                                                            <div className="flex justify-end items-center gap-2">
                                                                {(request.status === 'accepted') && (session?.meetingUrl || request.meetingUrl) && (
                                                                    <Button
                                                                        size="sm"
                                                                        className="rounded-full bg-gradient-to-r from-primary to-primary/80 text-white shadow-md shadow-primary/20 hover:scale-105 transition-transform px-5"
                                                                        onClick={() => window.open(session?.meetingUrl || request.meetingUrl, '_blank')}
                                                                    >
                                                                        <LinkIcon className="w-3.5 h-3.5 mr-1.5" />
                                                                        Join Call
                                                                    </Button>
                                                                )}
                                                                {request.status === 'accepted' && !(session?.meetingUrl || request.meetingUrl) && (
                                                                    <Badge variant="outline" className="rounded-full bg-primary/5 text-primary border-primary/20 font-bold px-4 py-1">
                                                                        Scheduled
                                                                    </Badge>
                                                                )}
                                                                {request.status === 'pending' && (
                                                                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                                                                        <Clock className="w-3 h-3" />
                                                                        Reviewing
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                </TabsContent>
                <TabsContent value="discover" className="mt-0 outline-none focus-visible:ring-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                            <Card
                                className="group p-8 text-center flex flex-col items-center justify-center hover:bg-gradient-to-br hover:from-primary/5 hover:to-transparent transition-all duration-500 cursor-pointer border-primary/5 hover:border-primary/20 relative overflow-hidden h-full"
                                onClick={() => navigate("/mentors")}
                            >
                                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <User className="w-24 h-24 text-primary" />
                                </div>
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                    <User className="w-8 h-8" />
                                </div>
                                <h4 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Find a Mentor</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Connect with industry experts for personalized 1-on-1 guidance and career growth.</p>
                                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                    Explore Mentors <TrendingUp className="w-3 h-3" />
                                </div>
                            </Card>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                            <Card
                                className="group p-8 text-center flex flex-col items-center justify-center hover:bg-gradient-to-br hover:from-amber-500/5 hover:to-transparent transition-all duration-500 cursor-pointer border-amber-500/5 hover:border-amber-500/20 relative overflow-hidden h-full"
                                onClick={() => navigate("/sessions")}
                            >
                                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Monitor className="w-24 h-24 text-amber-500" />
                                </div>
                                <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 text-amber-600 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                    <Monitor className="w-8 h-8" />
                                </div>
                                <h4 className="text-xl font-bold mb-3 group-hover:text-amber-600 transition-colors">Tech Sessions</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Join high-impact group workshops and learn the latest tech stacks from leaders.</p>
                                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                    View Sessions <TrendingUp className="w-3 h-3" />
                                </div>
                            </Card>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                            <Card
                                className="group p-8 text-center flex flex-col items-center justify-center hover:bg-gradient-to-br hover:from-indigo-500/5 hover:to-transparent transition-all duration-500 cursor-pointer border-indigo-500/5 hover:border-indigo-500/20 relative overflow-hidden h-full"
                                onClick={() => navigate("/community")}
                            >
                                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <BookOpen className="w-24 h-24 text-indigo-500" />
                                </div>
                                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                    <BookOpen className="w-8 h-8" />
                                </div>
                                <h4 className="text-xl font-bold mb-3 group-hover:text-indigo-600 transition-colors">Knowledge Hub</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Access curated blueprints, technical guides, and roadmaps for your journey.</p>
                                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                    Open Resources <TrendingUp className="w-3 h-3" />
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </TabsContent>

                <TabsContent value="profile" className="mt-0 outline-none focus-visible:ring-0">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card className="p-0 overflow-hidden border-primary/5 shadow-sm max-w-4xl mx-auto lg:mx-0">
                            <div className="p-8 border-b border-primary/5 bg-muted/30 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Settings className="w-5 h-5 text-primary" />
                                        Account Settings
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Manage your personal information and account preferences.</p>
                                </div>
                                <Button
                                    variant={isEditing ? "ghost" : "outline"}
                                    className="rounded-full px-6"
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    {isEditing ? "Cancel" : "Edit Details"}
                                </Button>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="p-8 space-y-8">
                                <div className="pb-4 border-b">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Profile Information</h4>
                                    <p className="text-xs text-muted-foreground">Update your details that are shown across the platform.</p>
                                </div>
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="group relative">
                                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Avatar className="w-32 h-32 border-4 border-card shadow-2xl relative z-10 transition-transform group-hover:scale-105 duration-500">
                                            <AvatarImage src={profileData.avatar} />
                                            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                                                {profileData.name?.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    {isEditing && (
                                        <div className="flex-1 space-y-2 w-full">
                                            <Label htmlFor="avatar-url" className="text-xs font-bold uppercase tracking-widest text-primary">Profile Photo URL</Label>
                                            <Input
                                                id="avatar-url"
                                                className="rounded-xl border-primary/10 focus:border-primary/30 transition-all bg-muted/30"
                                                value={profileData.avatar}
                                                onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-primary">Display Name</Label>
                                        <Input
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            readOnly={!isEditing}
                                            className={cn(
                                                "rounded-xl transition-all",
                                                !isEditing ? "bg-muted/50 border-transparent cursor-default" : "bg-muted/20 border-primary/10 focus:border-primary/30"
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-primary">Professional Role</Label>
                                        <Input
                                            value={profileData.currentRole}
                                            onChange={(e) => setProfileData({ ...profileData, currentRole: e.target.value })}
                                            readOnly={!isEditing}
                                            placeholder="e.g., Aspiring Full Stack Developer"
                                            className={cn(
                                                "rounded-xl transition-all",
                                                !isEditing ? "bg-muted/50 border-transparent cursor-default" : "bg-muted/20 border-primary/10 focus:border-primary/30"
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-primary">Professional Summary</Label>
                                    <Textarea
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        readOnly={!isEditing}
                                        rows={4}
                                        placeholder="Briefly describe your background and passion..."
                                        className={cn(
                                            "rounded-xl transition-all resize-none",
                                            !isEditing ? "bg-muted/50 border-transparent cursor-default" : "bg-muted/20 border-primary/10 focus:border-primary/30"
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-primary">Technical Expertise (comma-separated)</Label>
                                    <Input
                                        value={profileData.interests}
                                        onChange={(e) => setProfileData({ ...profileData, interests: e.target.value })}
                                        readOnly={!isEditing}
                                        placeholder="React, TypeScript, Cloud Architecture..."
                                        className={cn(
                                            "rounded-xl transition-all",
                                            !isEditing ? "bg-muted/50 border-transparent cursor-default" : "bg-muted/20 border-primary/10 focus:border-primary/30"
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-primary">Aspirational Goals</Label>
                                    <Textarea
                                        value={profileData.goals}
                                        onChange={(e) => setProfileData({ ...profileData, goals: e.target.value })}
                                        readOnly={!isEditing}
                                        rows={3}
                                        placeholder="What are you working towards?"
                                        className={cn(
                                            "rounded-xl transition-all resize-none",
                                            !isEditing ? "bg-muted/50 border-transparent cursor-default" : "bg-muted/20 border-primary/10 focus:border-primary/30"
                                        )}
                                    />
                                </div>

                                {isEditing && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                        <Button
                                            type="submit"
                                            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 transition-all font-bold text-base shadow-lg shadow-primary/20"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Syncing Profile...
                                                </div>
                                            ) : "Commit Profile Changes"}
                                        </Button>
                                    </motion.div>
                                )}
                            </form>
                        </Card>
                    </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
