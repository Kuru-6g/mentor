import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Search, Calendar, User, BookOpen, GraduationCap, MapPin, Monitor, Clock, Link as LinkIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabaseService } from "../services/supabaseService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface MenteeDashboardProps {
    sessions: any[];
    sessionRequests: any[];
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

            <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-4 max-w-2xl mb-8">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="sessions">My Sessions</TabsTrigger>
                    <TabsTrigger value="discover">Discover</TabsTrigger>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="p-6 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold">{joinedSessions.length}</h3>
                            <p className="text-muted-foreground">Joined Sessions</p>
                        </Card>
                        <Card className="p-6 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold">{myRequests.filter(r => r.status === 'pending').length}</h3>
                            <p className="text-muted-foreground">Pending Requests</p>
                        </Card>
                        <Card className="p-6 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold">{user?.interests?.length || 0}</h3>
                            <p className="text-muted-foreground">Interests Tracked</p>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="p-6">
                            <h3 className="mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                Upcoming Sessions
                            </h3>
                            {joinedSessions.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground mb-4">No upcoming sessions yet.</p>
                                    <Button variant="outline" onClick={() => navigate("/sessions")}>Browse Sessions</Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {joinedSessions.slice(0, 3).map(session => (
                                        <div key={session.id} className="flex items-center gap-4 p-3 border rounded-lg">
                                            <div className="bg-primary/5 p-2 rounded text-primary text-xs font-bold text-center min-w-[60px]">
                                                {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold truncate">{session.title}</h4>
                                                <p className="text-xs text-muted-foreground">{session.time} • {session.duration}</p>
                                            </div>
                                            <Badge variant="outline" className="capitalize">{session.sessionType}</Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>

                        <Card className="p-6">
                            <h3 className="mb-6 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-primary" />
                                Your Goals
                            </h3>
                            <div className="bg-muted/30 p-4 rounded-lg italic text-muted-foreground min-h-[100px]">
                                {user?.goals ? `"${user.goals}"` : "Set your career goals in the profile tab to get better recommendations."}
                            </div>
                            <div className="mt-6">
                                <h4 className="text-sm font-medium mb-3">Interests</h4>
                                <div className="flex flex-wrap gap-2">
                                    {user?.interests?.map((interest, i) => (
                                        <Badge key={i} variant="secondary">{interest}</Badge>
                                    ))}
                                    {(!user?.interests || user.interests.length === 0) && (
                                        <p className="text-xs text-muted-foreground">No interests added yet.</p>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="sessions" className="mt-6">
                    <Card className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <h3>My Session History</h3>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => navigate("/sessions")}>Find Sessions</Button>
                            </div>
                        </div>

                        {myRequests.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                <h4 className="mb-2">No session requests yet</h4>
                                <p className="text-muted-foreground mb-6">Browse tech sessions and request to join ones that interest you.</p>
                                <Button onClick={() => navigate("/sessions")}>Browse Sessions</Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="pb-3 font-semibold text-sm">Session</th>
                                            <th className="pb-3 font-semibold text-sm">Date</th>
                                            <th className="pb-3 font-semibold text-sm">Status</th>
                                            <th className="pb-3 font-semibold text-sm text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-sm">
                                        {myRequests.map((request) => {
                                            const session = sessions.find(s => s.id === request.sessionId);
                                            if (!session) return null;
                                            return (
                                                <tr key={request.id}>
                                                    <td className="py-4 font-medium">{session.title}</td>
                                                    <td className="py-4 text-muted-foreground">{session.date}</td>
                                                    <td className="py-4">
                                                        <Badge className="capitalize" variant={
                                                            request.status === 'accepted' ? 'success' as any :
                                                                request.status === 'rejected' ? 'destructive' : 'secondary'
                                                        }>
                                                            {request.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        {request.status === 'accepted' && (
                                                            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                                                                <LinkIcon className="w-4 h-4 mr-1" />
                                                                Join Link
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </TabsContent>

                <TabsContent value="discover" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="p-8 text-center flex flex-col items-center justify-center hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate("/mentors")}>
                            <User className="w-12 h-12 text-primary mb-4" />
                            <h4 className="mb-2">Find a Mentor</h4>
                            <p className="text-sm text-muted-foreground">Browse expert mentors in your field and request 1-on-1 guidance.</p>
                        </Card>
                        <Card className="p-8 text-center flex flex-col items-center justify-center hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate("/sessions")}>
                            <Monitor className="w-12 h-12 text-primary mb-4" />
                            <h4 className="mb-2">Tech Sessions</h4>
                            <p className="text-sm text-muted-foreground">Join group learning sessions and workshops led by industry leaders.</p>
                        </Card>
                        <Card className="p-8 text-center flex flex-col items-center justify-center hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate("/community")}>
                            <BookOpen className="w-12 h-12 text-primary mb-4" />
                            <h4 className="mb-2">Learning Resources</h4>
                            <p className="text-sm text-muted-foreground">Access curated guides, articles, and curriculum for your career path.</p>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="profile" className="mt-6">
                    <Card className="p-6 max-w-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <h3>Profile Information</h3>
                            <Button
                                variant={isEditing ? "ghost" : "outline"}
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? "Cancel" : "Edit Profile"}
                            </Button>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="flex items-center gap-6">
                                <Avatar className="w-24 h-24">
                                    <AvatarImage src={profileData.avatar} />
                                    <AvatarFallback>{profileData.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                {isEditing && (
                                    <div className="flex-1 space-y-2">
                                        <Label htmlFor="avatar-url">Avatar URL</Label>
                                        <Input
                                            id="avatar-url"
                                            value={profileData.avatar}
                                            onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                                            placeholder="https://..."
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        readOnly={!isEditing}
                                        className={!isEditing ? "bg-muted/50 border-none pointer-events-none" : ""}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Current Role</Label>
                                    <Input
                                        value={profileData.currentRole}
                                        onChange={(e) => setProfileData({ ...profileData, currentRole: e.target.value })}
                                        readOnly={!isEditing}
                                        placeholder="e.g., Student, Junior Developer"
                                        className={!isEditing ? "bg-muted/50 border-none pointer-events-none" : ""}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Biography</Label>
                                <Textarea
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                    readOnly={!isEditing}
                                    rows={4}
                                    className={!isEditing ? "bg-muted/50 border-none pointer-events-none" : ""}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Interests (comma-separated)</Label>
                                <Input
                                    value={profileData.interests}
                                    onChange={(e) => setProfileData({ ...profileData, interests: e.target.value })}
                                    readOnly={!isEditing}
                                    placeholder="e.g., React, AI, System Design"
                                    className={!isEditing ? "bg-muted/50 border-none pointer-events-none" : ""}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Career Goals</Label>
                                <Textarea
                                    value={profileData.goals}
                                    onChange={(e) => setProfileData({ ...profileData, goals: e.target.value })}
                                    readOnly={!isEditing}
                                    rows={3}
                                    placeholder="What are you trying to achieve?"
                                    className={!isEditing ? "bg-muted/50 border-none pointer-events-none" : ""}
                                />
                            </div>

                            {isEditing && (
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Saving Changes..." : "Save Profile Changes"}
                                </Button>
                            )}
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
