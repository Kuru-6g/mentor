import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    User,
    Settings,
    Shield,
    CreditCard,
    Wallet,
    LogOut,
    ChevronLeft,
    Bell,
    Key,
    Globe,
    Camera,
    Check,
    Loader2,
    DollarSign,
    Briefcase,
    Twitter,
    Linkedin,
    Github,
    Link as LinkIcon,
    Zap,
    Star,
    ShieldCheck,
    TrendingUp,
    Mail,
    MapPin,
    Building,
    ExternalLink,
    Award,
    CircleDashed,
    Save,
    Layout,
    Plus,
    Trash2,
    Search,
    Eye,
    EyeOff
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { supabaseService } from "../services/supabaseService";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { toast } from "sonner";
import { Progress } from "./ui/progress";

type SettingsTab = "profile" | "mentorship" | "socials" | "security" | "payments" | "preferences" | "achievements";

export function AccountSettings() {
    const { user, refreshUser, signOut, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
    const [isLoading, setIsLoading] = useState(false);
    const [isPayoutLoading, setIsPayoutLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Sync active tab with URL query
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && ["profile", "mentorship", "socials", "security", "payments", "preferences", "achievements"].includes(tab)) {
            setActiveTab(tab as SettingsTab);
        }
    }, [location]);

    // Form state
    const [formData, setFormData] = useState({
        name: user?.name || "",
        avatar: user?.avatar || "",
        title: user?.currentRole || "",
        company: user?.company || "",
        location: user?.location || "",
        bio: user?.bio || "",
        expertise: user?.expertise?.join(", ") || "",
        yearsExperience: user?.yearsExperience || 0,
        linkedIn: user?.linkedin || "",
        github: user?.github || "",
        twitter: (user as any)?.twitter || "",
        website: (user as any)?.website || "",
        monthlyPricing: (user as any)?.monthlyPricing || 100,
        sessionPricing: (user as any)?.sessionPricing || 50,
        interests: user?.interests?.join(", ") || "",
        goals: user?.goals || "",
        achievements: user?.achievements || [] as any[],
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                avatar: user.avatar || "",
                title: user.currentRole || "",
                company: user.company || "",
                location: user.location || "",
                bio: user.bio || "",
                expertise: user.expertise?.join(", ") || "",
                yearsExperience: user.yearsExperience || 0,
                linkedIn: user.linkedin || "",
                github: user.github || "",
                twitter: (user as any).twitter || "",
                website: (user as any).website || "",
                monthlyPricing: (user as any).monthlyPricing || 100,
                sessionPricing: (user as any).sessionPricing || 50,
                interests: user.interests?.join(", ") || "",
                goals: user.goals || "",
                achievements: user.achievements || [],
            });
        }
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        try {
            const updates = {
                name: formData.name,
                currentRole: formData.title,
                company: formData.company,
                location: formData.location,
                bio: formData.bio,
                expertise: formData.expertise.split(",").map(i => i.trim()).filter(Boolean),
                yearsExperience: Number(formData.yearsExperience),
                linkedin: formData.linkedIn,
                github: formData.github,
                twitter: formData.twitter,
                website: formData.website,
                monthlyPricing: Number(formData.monthlyPricing),
                sessionPricing: Number(formData.sessionPricing),
                interests: formData.interests.split(",").map(i => i.trim()).filter(Boolean),
                goals: formData.goals,
                achievements: formData.achievements,
            };

            await supabaseService.updateProfile(user.id, updates as any);
            toast.success("Settings updated successfully");
            await refreshUser();
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("Failed to update settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetupPayouts = async () => {
        setIsPayoutLoading(true);
        try {
            const result = await supabaseService.createStripeConnectAccount();
            if (result?.url) window.location.href = result.url;
        } catch (error) {
            console.error("Payout setup error:", error);
        } finally {
            setIsPayoutLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!user?.email) return;
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                redirectTo: `${window.location.origin}/account?tab=security`,
            });
            if (error) throw error;
            toast.success("Password reset link sent to your email!");
        } catch (error: any) {
            console.error("Password reset error:", error);
            toast.error(error.message || "Failed to send reset link");
        }
    };

    const handleAddAchievement = async (achievement: any) => {
        if (!user) return;
        const updatedAchievements = [...formData.achievements, { ...achievement, id: Date.now() }];
        try {
            await supabaseService.updateProfile(user.id, { achievements: updatedAchievements } as any);
            setFormData({ ...formData, achievements: updatedAchievements });
            toast.success("Achievement added!");
            await refreshUser();
        } catch (error) {
            toast.error("Failed to add achievement");
        }
    };

    const handleDeleteAchievement = async (id: number) => {
        if (!user) return;
        const updatedAchievements = formData.achievements.filter((a: any) => a.id !== id);
        try {
            await supabaseService.updateProfile(user.id, { achievements: updatedAchievements } as any);
            setFormData({ ...formData, achievements: updatedAchievements });
            toast.success("Achievement removed");
            await refreshUser();
        } catch (error) {
            toast.error("Failed to remove achievement");
        }
    };

    if (loading || (!user && !isLoading)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd] dark:bg-black">
                <div className="relative">
                    <CircleDashed className="w-12 h-12 animate-spin text-blue-600" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    </div>
                </div>
            </div>
        );
    }

    const completionPercent = (function () {
        let score = 0;
        if (user?.name) score += 15;
        if (user?.avatar) score += 15;
        if (user?.bio) score += 20;
        if (user?.expertise?.length) score += 10;
        if (user?.currentRole) score += 10;
        if (user?.linkedin) score += 10;
        if (user?.role === 'mentor' && (user as any)?.monthlyPricing) score += 20;
        else if (user?.role !== 'mentor') score += 20;
        return Math.min(score, 100);
    })();

    const menuCategories = [
        {
            title: "GENERAL",
            items: [
                { id: "profile", label: "Account", icon: User },
                ...(user?.role === 'mentor' ? [{ id: "mentorship", label: "Mentorship & Pricing", icon: Briefcase }] : []),
                { id: "payments", label: user?.role === 'mentor' ? "Financial & payments" : "Billing", icon: Wallet },
                { id: "socials", label: "Socials & Links", icon: LinkIcon },
            ]
        },
        {
            title: "SYSTEM",
            items: [
                { id: "achievements", label: "Achievements", icon: Award },
                { id: "preferences", label: "Preferences", icon: Settings },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-black flex font-inter text-slate-700">
            {/* Sidebar */}
            <aside className="w-[300px] border-r border-slate-100 bg-[#F9FBFA]/50 h-screen sticky top-0 flex flex-col pt-8">
                <div className="px-8 mb-10 flex items-center gap-4">
                    <button
                        onClick={() => navigate(user?.role === 'mentor' ? '/dashboard' : '/mentee-dashboard')}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all text-slate-500"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
                </div>

                <div className="flex-1 px-4 space-y-8 overflow-y-auto pb-8">
                    {menuCategories.map((category) => (
                        <div key={category.title} className="space-y-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 px-4 mb-3">
                                {category.title}
                            </p>
                            <nav className="space-y-1">
                                {category.items.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id as SettingsTab)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all ${activeTab === item.id
                                            ? "bg-[#E9F5F2] text-[#2D8671]"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${activeTab === item.id ? "bg-white shadow-sm" : "bg-white border border-slate-100"
                                            }`}>
                                            <item.icon className="w-4.5 h-4.5" />
                                        </div>
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    ))}
                </div>

                {/* Bottom Logout */}
                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold text-rose-500 hover:bg-rose-50 transition-all"
                    >
                        <div className="w-8 h-8 rounded-lg bg-white border border-rose-100 flex items-center justify-center">
                            <LogOut className="w-4 h-4" />
                        </div>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-h-screen bg-white">
                <div className="max-w-4xl mx-auto px-12 py-8">
                    {/* Top Search Bar */}
                    <div className="mb-10 relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300" />
                        <Input
                            placeholder="Search settings..."
                            className="w-full bg-[#f3f5f8] border-none h-14 pl-14 pr-6 rounded-2xl text-[15px] font-medium placeholder:text-slate-400 focus-visible:ring-0 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-emerald-100 transition-all shadow-sm"
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === "profile" && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-12"
                            >
                                {/* Header Section */}
                                <div>
                                    <h2 className="text-3xl font-semibold text-slate-900">Account</h2>
                                    <p className="text-slate-500 mt-1 font-medium text-[15px]">Real-time information and activities of your profile.</p>
                                </div>

                                {/* Profile Picture Section */}
                                <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-8">
                                        <div className="relative group">
                                            <div className="w-24 h-24 rounded-full overflow-hidden border border-slate-100 shadow-sm">
                                                <Avatar className="w-full h-full rounded-none">
                                                    <AvatarImage src={formData.avatar} className="object-cover" />
                                                    <AvatarFallback className="text-2xl bg-slate-50 text-slate-400 font-semibold">
                                                        {formData.name.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <button className="absolute bottom-0 right-0 p-2 bg-white border border-slate-200 rounded-full shadow-sm text-slate-500 hover:text-emerald-600 transition-colors">
                                                <Camera className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Profile picture</p>
                                            <p className="text-[13px] text-slate-400 font-medium mt-0.5">PNG, JPEG under 15MB</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="outline" className="h-10 px-5 rounded-xl text-[13px] font-semibold border-slate-200 hover:bg-slate-50">Upload new picture</Button>
                                        <Button variant="ghost" className="h-10 px-5 rounded-xl text-[13px] font-semibold text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all">Delete</Button>
                                    </div>
                                </div>

                                {/* Full Name Section */}
                                <div className="pt-8 border-t border-slate-100 space-y-6">
                                    <div>
                                        <p className="font-semibold text-slate-900">Full name</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[13px] font-medium text-slate-500">First name</Label>
                                            <Input
                                                value={formData.name.split(' ')[0] || ''}
                                                onChange={(e) => {
                                                    const rest = formData.name.split(' ').slice(1).join(' ');
                                                    setFormData({ ...formData, name: `${e.target.value} ${rest}`.trim() });
                                                }}
                                                className="h-12 bg-white border-slate-200 rounded-xl px-4 font-medium text-[15px] focus:ring- emerald-100 focus:border-emerald-200 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[13px] font-medium text-slate-500">Last name</Label>
                                            <Input
                                                value={formData.name.split(' ').slice(1).join(' ') || ''}
                                                onChange={(e) => {
                                                    const first = formData.name.split(' ')[0] || '';
                                                    setFormData({ ...formData, name: `${first} ${e.target.value}`.trim() });
                                                }}
                                                className="h-12 bg-white border-slate-200 rounded-xl px-4 font-medium text-[15px] focus:ring-emerald-100 focus:border-emerald-200 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Email Section */}
                                <div className="pt-8 border-t border-slate-100 space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="font-semibold text-slate-900">Contact email</p>
                                            <p className="text-[13px] text-slate-400 font-medium mt-0.5">Manage your accounts email address for the invoices.</p>
                                        </div>
                                        <button className="flex items-center gap-2 text-[#2D8671] font-semibold text-[13px] hover:underline px-4 py-2 bg-[#E9F5F2] rounded-xl border border-emerald-100/50">
                                            <Plus className="w-4 h-4" />
                                            Add another email
                                        </button>
                                    </div>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                        <Input
                                            value={user?.email || ''}
                                            readOnly
                                            className="h-12 bg-white border-slate-200 rounded-xl pl-12 pr-4 font-medium text-[15px] text-slate-500 bg-slate-50/50"
                                        />
                                    </div>
                                </div>

                                {activeTab === "profile" && (
                                    <div className="space-y-6 pt-8 border-t border-slate-100">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-[13px] font-medium text-slate-500">Professional Title</Label>
                                                <Input
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    placeholder="e.g. Senior Software Engineer"
                                                    className="h-12 bg-white border-slate-200 rounded-xl px-4 font-medium text-[15px] focus:ring-emerald-100 focus:border-emerald-200 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[13px] font-medium text-slate-500">Company</Label>
                                                <Input
                                                    value={formData.company}
                                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                    placeholder="e.g. Google"
                                                    className="h-12 bg-white border-slate-200 rounded-xl px-4 font-medium text-[15px] focus:ring-emerald-100 focus:border-emerald-200 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-[13px] font-medium text-slate-500">Location</Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                                    <Input
                                                        value={formData.location}
                                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                        placeholder="e.g. San Francisco, CA"
                                                        className="h-12 bg-white border-slate-200 rounded-xl pl-12 pr-4 font-medium text-[15px]"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-[13px] font-medium text-slate-500">Biography</Label>
                                            <Textarea
                                                value={formData.bio}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                placeholder="Share your professional journey..."
                                                className="min-h-[120px] bg-white border-slate-200 rounded-xl p-4 font-medium text-[15px] resize-none focus:ring-emerald-100 focus:border-emerald-200 transition-all"
                                            />
                                        </div>

                                        {user?.role === 'mentee' && (
                                            <div className="space-y-6 pt-6 border-t border-slate-100/50">
                                                <div className="space-y-2">
                                                    <Label className="text-[13px] font-medium text-slate-500">Learning Goals</Label>
                                                    <Textarea
                                                        value={formData.goals}
                                                        onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                                                        placeholder="What do you hope to achieve through mentorship?"
                                                        className="min-h-[100px] bg-white border-slate-200 rounded-xl p-4 font-medium text-[15px] resize-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[13px] font-medium text-slate-500">Interests (comma separated)</Label>
                                                    <Input
                                                        value={formData.interests}
                                                        onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                                                        placeholder="e.g. Python, Machine Learning, UI/UX"
                                                        className="h-12 bg-white border-slate-200 rounded-xl px-4 font-medium text-[15px]"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-8 border-t border-slate-100 space-y-6">
                                            <div>
                                                <p className="font-semibold text-slate-900">Password</p>
                                                <p className="text-[13px] text-slate-400 font-medium mt-0.5">Modify your current password.</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-[13px] font-medium text-slate-500">Current password</Label>
                                                    <div className="relative">
                                                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                                        <Input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="••••••••••••"
                                                            className="h-12 bg-white border-slate-200 rounded-xl pl-12 pr-12 font-medium text-[15px]"
                                                        />
                                                        <button
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                        >
                                                            {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[13px] font-medium text-slate-500">New password</Label>
                                                    <div className="relative">
                                                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                                        <Input
                                                            type={showNewPassword ? "text" : "password"}
                                                            placeholder="••••••••••••"
                                                            className="h-12 bg-white border-slate-200 rounded-xl pl-12 pr-12 font-medium text-[15px]"
                                                        />
                                                        <button
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                        >
                                                            {showNewPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-slate-100 space-y-6">
                                            <div>
                                                <p className="font-semibold text-slate-900">Integrated account</p>
                                                <p className="text-[13px] text-slate-400 font-medium mt-0.5">Manage your current integrated accounts.</p>
                                            </div>
                                            <div className="border border-slate-100 rounded-2xl p-6 flex justify-between items-center bg-slate-50/20">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center p-2 border border-slate-50">
                                                        <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="Google" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">Google Account</p>
                                                        <p className="text-[13px] text-slate-400 font-medium">Synced with {user?.email}</p>
                                                    </div>
                                                </div>
                                                <div className="px-5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-[#2D8671] text-[13px] font-semibold">
                                                    Connected
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Save Button */}
                                <div className="flex justify-end pt-8">
                                    <Button
                                        onClick={handleUpdateProfile}
                                        disabled={isLoading}
                                        className="h-12 px-10 rounded-xl bg-[#2D8671] hover:bg-[#256e5d] text-white font-semibold uppercase text-[12px] tracking-widest shadow-lg shadow-emerald-500/10 transition-all active:scale-95"
                                    >
                                        {isLoading ? "Saving Changes..." : "Save Settings"}
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "mentorship" && (
                            <motion.div
                                key="mentorship"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-12"
                            >
                                {/* Header Section */}
                                <div>
                                    <h2 className="text-3xl font-semibold text-slate-900">Mentorship & Pricing</h2>
                                    <p className="text-slate-500 mt-1 font-medium text-[15px]">Set your professional rates and define your mentorship focus.</p>
                                </div>

                                {/* Expertise Section */}
                                <div className="pt-8 border-t border-slate-100 space-y-6">
                                    <div>
                                        <p className="font-semibold text-slate-900">Expertise & Focus</p>
                                        <p className="text-[13px] text-slate-400 font-medium mt-0.5">List your core technical skills and areas of mentorship.</p>
                                    </div>
                                    <div className="space-y-4">
                                        <Textarea
                                            value={formData.expertise}
                                            onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                                            placeholder="React Query, Kubernetes, Go Microservices, UI Design Systems..."
                                            className="min-h-[120px] bg-white border-slate-200 rounded-xl px-4 py-3 font-medium text-[15px] focus:ring-emerald-100 focus:border-emerald-200 transition-all resize-none"
                                        />
                                        <div className="flex flex-wrap gap-2">
                                            {formData.expertise.split(',').filter(t => t.trim()).map((tag, i) => (
                                                <div key={i} className="px-3 py-1.5 bg-[#E9F5F2] text-[#2D8671] text-[11px] font-semibold rounded-lg border border-emerald-100/50">
                                                    {tag.trim()}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing Tiers Section */}
                                <div className="pt-8 border-t border-slate-100 space-y-6">
                                    <div>
                                        <p className="font-semibold text-slate-900">Pricing Tiers</p>
                                        <p className="text-[13px] text-slate-400 font-medium mt-0.5">Define your monthly and per-session rates.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[13px] font-medium text-slate-500">Monthly Subscription</Label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                                <Input
                                                    type="number"
                                                    value={formData.monthlyPricing}
                                                    onChange={(e) => setFormData({ ...formData, monthlyPricing: parseInt(e.target.value) || 0 })}
                                                    className="h-12 bg-white border-slate-200 rounded-xl pl-12 pr-4 font-medium text-[15px]"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[13px] font-medium text-slate-500">Per-Session Rate (1hr)</Label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                                <Input
                                                    type="number"
                                                    value={formData.sessionPricing}
                                                    onChange={(e) => setFormData({ ...formData, sessionPricing: parseInt(e.target.value) || 0 })}
                                                    className="h-12 bg-white border-slate-200 rounded-xl pl-12 pr-4 font-medium text-[15px]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Experience Section */}
                                <div className="pt-8 border-t border-slate-100 space-y-6">
                                    <div>
                                        <p className="font-semibold text-slate-900">Experience</p>
                                        <p className="text-[13px] text-slate-400 font-medium mt-0.5">How many years have you been in the industry?</p>
                                    </div>
                                    <div className="max-w-[120px]">
                                        <Input
                                            type="number"
                                            value={formData.yearsExperience}
                                            onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) || 0 })}
                                            className="h-12 bg-white border-slate-200 rounded-xl px-4 font-medium text-[15px]"
                                        />
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end pt-8">
                                    <Button
                                        onClick={handleUpdateProfile}
                                        disabled={isLoading}
                                        className="h-12 px-10 rounded-xl bg-[#2D8671] hover:bg-[#256e5d] text-white font-semibold uppercase text-[12px] tracking-widest shadow-lg shadow-emerald-500/10 transition-all active:scale-95"
                                    >
                                        {isLoading ? "Saving..." : "Apply Mentorship Settings"}
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "socials" && (
                            <motion.div
                                key="socials"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-12"
                            >
                                {/* Header Section */}
                                <div>
                                    <h2 className="text-3xl font-semibold text-slate-900">Socials & Links</h2>
                                    <p className="text-slate-500 mt-1 font-medium text-[15px]">Connect your digital profiles for professional verification.</p>
                                </div>

                                {/* Social Links Section */}
                                <div className="pt-8 border-t border-slate-100 space-y-8">
                                    {[
                                        { name: "linkedIn", icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn Profile", placeholder: "linkedin.com/in/username" },
                                        { name: "github", icon: <Github className="w-5 h-5" />, label: "GitHub Hub", placeholder: "github.com/username" },
                                        { name: "twitter", icon: <Twitter className="w-5 h-5" />, label: "Twitter / X Profile", placeholder: "twitter.com/username" },
                                        { name: "website", icon: <Globe className="w-5 h-5" />, label: "Personal Website", placeholder: "yourwebsite.com" }
                                    ].map((social) => (
                                        <div key={social.name} className="space-y-3">
                                            <Label className="text-[13px] font-medium text-slate-500">{social.label}</Label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                                                    {social.icon}
                                                </div>
                                                <Input
                                                    value={(formData as any)[social.name]}
                                                    onChange={(e) => setFormData({ ...formData, [social.name]: e.target.value })}
                                                    placeholder={social.placeholder}
                                                    className="h-12 bg-white border-slate-200 rounded-xl pl-12 pr-4 font-medium text-[15px] focus:ring-emerald-100 focus:border-emerald-200 transition-all"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end pt-8">
                                    <Button
                                        onClick={handleUpdateProfile}
                                        disabled={isLoading}
                                        className="h-12 px-10 rounded-xl bg-[#2D8671] hover:bg-[#256e5d] text-white font-semibold uppercase text-[12px] tracking-widest shadow-lg shadow-emerald-500/10 transition-all active:scale-95"
                                    >
                                        {isLoading ? "Syncing..." : "Sync Global Links"}
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "payments" && (
                            <motion.div
                                key="payments"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-12"
                            >
                                {/* Header Section */}
                                <div>
                                    <h2 className="text-3xl font-semibold text-slate-900">
                                        {user?.role === 'mentor' ? "Financial & payments" : "Billing"}
                                    </h2>
                                    <p className="text-slate-500 mt-1 font-medium text-[15px]">
                                        {user?.role === 'mentor' ? "Manage your earning gateway and payout schedules." : "Manage your payment methods and subscription billing."}
                                    </p>
                                </div>

                                {user?.role === 'mentor' ? (
                                    <div className="pt-8 border-t border-slate-100 space-y-6">
                                        <div>
                                            <p className="font-semibold text-slate-900">Stripe Gateway</p>
                                            <p className="text-[13px] text-slate-400 font-medium mt-0.5">We use Stripe to process your payouts securely across the globe.</p>
                                        </div>
                                        <div className="border border-slate-100 rounded-2xl p-8 bg-slate-50/20 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                                <Globe className="w-48 h-48" />
                                            </div>
                                            <div className="relative z-10 space-y-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="px-4 py-1.5 bg-emerald-50 text-[#2D8671] rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                                                        Connected & Active
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold text-slate-900 leading-tight">Global Onboarding <br /> & Payouts</h3>
                                                    <p className="text-[13px] text-slate-500 font-medium mt-2 max-w-sm">
                                                        Access your secure Stripe portal to manage banking credentials and tax information.
                                                    </p>
                                                </div>
                                                <Button
                                                    onClick={handleSetupPayouts}
                                                    disabled={isPayoutLoading}
                                                    className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold uppercase text-[12px] tracking-widest transition-all flex items-center gap-3"
                                                >
                                                    {isPayoutLoading ? "Opening..." : "Open Stripe Dashboard"}
                                                    <ExternalLink className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="pt-8 border-t border-slate-100 space-y-6">
                                        <div>
                                            <p className="font-semibold text-slate-900">Payment Methods</p>
                                            <p className="text-[13px] text-slate-400 font-medium mt-0.5">Manage your stored cards for mentorship bookings.</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button className="h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50/30 transition-all group">
                                                <Plus className="w-6 h-6" />
                                                <span className="text-[12px] font-semibold uppercase tracking-widest">Add Card</span>
                                            </button>
                                            <div className="h-32 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center px-8 text-center">
                                                <p className="text-[13px] font-medium text-slate-400">No payment methods found.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === "achievements" && (
                            <motion.div
                                key="achievements"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-12"
                            >
                                {/* Header Section */}
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h2 className="text-3xl font-semibold text-slate-900">Achievements</h2>
                                        <p className="text-slate-500 mt-1 font-medium text-[15px]">Showcase your milestones and professional certifications.</p>
                                    </div>
                                    <Button
                                        onClick={() => handleAddAchievement({ title: "New Milestone", description: "Brief description", type: "Certification", date: new Date().getFullYear().toString() })}
                                        className="h-12 px-6 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold uppercase text-[12px] tracking-widest transition-all flex items-center gap-3"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Record Milestone
                                    </Button>
                                </div>

                                {/* Achievements List Section */}
                                <div className="pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {formData.achievements.map((achievement: any) => (
                                        <div key={achievement.id} className="p-6 border border-slate-100 rounded-2xl bg-white hover:border-emerald-100 transition-all group relative">
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleDeleteAchievement(achievement.id)}
                                                    className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="px-2.5 py-1 bg-[#E9F5F2] text-[#2D8671] text-[10px] font-bold rounded-lg uppercase tracking-widest border border-emerald-100">
                                                        {achievement.type}
                                                    </div>
                                                    <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-widest">{achievement.date}</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-slate-900 tracking-tight">{achievement.title}</h4>
                                                    <p className="text-[13px] text-slate-400 font-medium mt-1 leading-relaxed">{achievement.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {formData.achievements.length === 0 && (
                                        <div className="col-span-2 h-32 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center">
                                            <p className="text-[13px] font-medium text-slate-300">No achievements recorded yet.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "preferences" && (
                            <motion.div
                                key="preferences"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-12"
                            >
                                {/* Header Section */}
                                <div>
                                    <h2 className="text-3xl font-semibold text-slate-900">Preferences</h2>
                                    <p className="text-slate-500 mt-1 font-medium text-[15px]">Customize your platform experience and notifications.</p>
                                </div>

                                {/* General Preferences Section */}
                                <div className="pt-8 border-t border-slate-100 space-y-2">
                                    {[
                                        { id: 'marketing', label: 'Marketing Communications', description: 'Receive updates about new features and mentorship tips.', icon: <Mail className="w-5 h-5" /> },
                                        { id: 'activity', label: 'Account Activity', description: 'Get notified about new bookings and message requests.', icon: <Shield className="w-5 h-5" />, defaultChecked: true },
                                        { id: 'security_pref', label: 'Security Alerts', description: 'Receive alerts for login attempts from new devices.', icon: <Settings className="w-5 h-5" />, defaultChecked: true }
                                    ].map((pref) => (
                                        <div key={pref.id} className="flex items-center justify-between p-6 rounded-2xl hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center p-2 border border-slate-50 text-slate-400">
                                                    {pref.icon}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">{pref.label}</p>
                                                    <p className="text-[13px] text-slate-400 font-medium mt-0.5">{pref.description}</p>
                                                </div>
                                            </div>
                                            <Switch defaultChecked={pref.defaultChecked} className="data-[state=checked]:bg-[#2D8671]" />
                                        </div>
                                    ))}
                                </div>

                                {/* Danger Zone Section */}
                                <div className="pt-8 border-t border-slate-100 space-y-6">
                                    <div>
                                        <p className="font-bold text-rose-500">Danger Zone</p>
                                        <p className="text-[13px] text-slate-400 font-medium mt-0.5">Permanent actions regarding your account existence.</p>
                                    </div>
                                    <div className="p-6 border border-rose-100 rounded-2xl bg-rose-50/20 flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-slate-900">Delete Account</p>
                                            <p className="text-[13px] text-slate-400 font-medium mt-0.5">Purge all data, mentorship history, and payouts.</p>
                                        </div>
                                        <Button variant="ghost" className="h-10 px-5 rounded-xl text-[13px] font-semibold text-rose-500 hover:text-white hover:bg-rose-500 transition-all">
                                            Terminate Account
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
