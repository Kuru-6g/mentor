import { useState, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { Header } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
import { MentorDirectory } from "./components/MentorDirectory";
import { MentorProfile } from "./components/MentorProfile";
import { SessionsPage } from "./components/SessionsPage";
import { MentorDashboard } from "./components/MentorDashboard";
import { AuthForm } from "./components/AuthForm";
import { ProfileSetup } from "./components/ProfileSetup";
import { Footer } from "./components/Footer";
import { AboutPage } from "./components/AboutPage";
import { ContactPage } from "./components/ContactPage";
import { CareersPage } from "./components/CareersPage";
import { HelpPage } from "./components/HelpPage";
import { CommunityPage } from "./components/CommunityPage";
import { PrivacyPage } from "./components/PrivacyPage";
import { TermsPage } from "./components/TermsPage";
import { BlogPage } from "./components/BlogPage";
import { CookiePage } from "./components/CookiePage";
import { BackToTop } from "./components/BackToTop";
import { Toaster, toast } from "sonner";
import { initializeMockData } from "./utils/mockData";
import { userAPI, UserProfile } from "./utils/mongoApi";
import { createClient } from "./utils/supabaseClient";

export interface Speaker {
  name: string;
  avatar: string;
  title?: string;
}

export interface Session {
  id: number;
  title: string;
  description: string;
  speakers: Speaker[];
  // Legacy fields for backward compatibility
  mentorName: string;
  mentorAvatar?: string;
  date: string;
  time: string;
  duration: string;
  topics: string[];
  attendees: number;
  sessionType: "online" | "physical";
  location?: string;
  maxSlots?: number;
  availableSlots?: number;
  companyName?: string;
  createdBy?: string; // mentor user ID
}

export interface SessionRequest {
  id: string;
  sessionId: number;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  status: "pending" | "accepted" | "rejected";
  requestedAt: string;
  updatedAt: string;
  // Additional form data
  phone?: string;
  occupation?: string;
  experienceLevel?: string;
  reasonToJoin?: string;
  expectations?: string;
}

// Mock initial sessions
const initialSessions: Session[] = [
  {
    id: 1,
    title: "System Design Fundamentals",
    description:
      "Understand the core concepts of system design and how to approach design interviews. We'll cover scalability patterns, database design, caching strategies, and more.",
    speakers: [
      {
        name: "Michael Chen",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
        title: "Senior Software Architect",
      },
    ],
    mentorName: "Michael Chen",
    mentorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    date: "2025-10-22",
    time: "7:00 PM EST",
    duration: "120 minutes",
    topics: ["System Design", "Architecture", "Scalability"],
    attendees: 67,
    sessionType: "online",
    maxSlots: 100,
    availableSlots: 33,
    createdBy: "mentor2",
  },
  {
    id: 2,
    title: "Docker & Kubernetes Workshop",
    description:
      "Hands-on workshop covering containerization and orchestration. Learn to deploy applications using Docker and manage them with Kubernetes.",
    speakers: [
      {
        name: "David Kim",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
        title: "DevOps Lead",
      },
    ],
    mentorName: "David Kim",
    mentorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    date: "2025-10-18",
    time: "5:00 PM EST",
    duration: "180 minutes",
    topics: ["Docker", "Kubernetes", "DevOps"],
    attendees: 52,
    sessionType: "physical",
    location: "Tech Hub, San Francisco",
    maxSlots: 30,
    availableSlots: 8,
    createdBy: "mentor3",
  },
  {
    id: 3,
    title: "Tech Giants Career Panel",
    description:
      "Learn from industry leaders at top tech companies about career growth, company culture, and what it takes to succeed in competitive tech environments.",
    speakers: [
      {
        name: "Emily Rodriguez",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
        title: "VP of Engineering at TechCorp",
      },
      {
        name: "James Wilson",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
        title: "Director of Product",
      },
      {
        name: "Sarah Lee",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
        title: "Tech Lead",
      },
      {
        name: "Marcus Johnson",
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
        title: "Senior Engineering Manager",
      },
    ],
    companyName: "TechCorp Inc.",
    date: "2025-10-20",
    time: "6:30 PM EST",
    duration: "90 minutes",
    topics: [
      "Career Development",
      "Tech Industry",
      "Leadership",
    ],
    attendees: 38,
    sessionType: "online",
    maxSlots: 50,
    availableSlots: 12,
    createdBy: "mentor4",
  },
  {
    id: 4,
    title: "Introduction to Machine Learning with Python",
    description:
      "Perfect for beginners! Learn the basics of machine learning, understand key algorithms, and build your first ML model using Python and scikit-learn.",
    speakers: [
      {
        name: "Alex Thompson",
        avatar:
          "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop",
        title: "Senior ML Engineer",
      },
    ],
    date: "2025-10-25",
    time: "6:00 PM EST",
    duration: "150 minutes",
    topics: ["Machine Learning", "Python", "Data Science"],
    attendees: 45,
    sessionType: "online",
    maxSlots: 80,
    availableSlots: 35,
    createdBy: "mentor5",
  },
  {
    id: 5,
    title: "React Best Practices & Performance Optimization",
    description:
      "Deep dive into React performance optimization, component design patterns, and best practices for building scalable applications.",
    speakers: [
      {
        name: "Sarah Johnson",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
        title: "Senior Software Engineer",
      },
    ],
    date: "2025-10-15",
    time: "7:30 PM EST",
    duration: "120 minutes",
    topics: ["React", "Performance", "JavaScript", "Web Development"],
    attendees: 82,
    sessionType: "online",
    maxSlots: 120,
    availableSlots: 38,
    createdBy: "mentor1",
  },
  {
    id: 6,
    title: "Mobile App Development: iOS vs Android vs Cross-Platform",
    description:
      "Compare different mobile development approaches and learn when to choose native development versus cross-platform frameworks like React Native.",
    speakers: [
      {
        name: "Jessica Lee",
        avatar:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
        title: "Mobile Architect",
      },
    ],
    date: "2025-10-28",
    time: "6:00 PM EST",
    duration: "90 minutes",
    topics: ["Mobile Development", "React Native", "iOS", "Android"],
    attendees: 34,
    sessionType: "online",
    maxSlots: 60,
    availableSlots: 26,
    createdBy: "mentor6",
  },
  {
    id: 7,
    title: "Cloud Architecture Workshop: AWS Deep Dive",
    description:
      "Hands-on workshop covering AWS services, cloud architecture patterns, and best practices for building scalable cloud applications.",
    speakers: [
      {
        name: "Michael Chen",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
        title: "Senior Software Architect",
      },
      {
        name: "David Kim",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
        title: "DevOps Lead",
      },
    ],
    date: "2025-11-01",
    time: "5:00 PM EST",
    duration: "180 minutes",
    topics: ["AWS", "Cloud Computing", "Architecture", "DevOps"],
    attendees: 56,
    sessionType: "physical",
    location: "CloudScale Office, Seattle",
    maxSlots: 40,
    availableSlots: 14,
    createdBy: "mentor2",
  },
  {
    id: 8,
    title: "Career Transition: From Developer to Tech Lead",
    description:
      "Learn what it takes to transition from an individual contributor to a technical leadership role. Covers people management, technical decision-making, and more.",
    speakers: [
      {
        name: "Emily Rodriguez",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
        title: "VP of Engineering",
      },
    ],
    date: "2025-10-30",
    time: "7:00 PM EST",
    duration: "90 minutes",
    topics: ["Career Growth", "Leadership", "Management"],
    attendees: 91,
    sessionType: "online",
    maxSlots: 100,
    availableSlots: 9,
    createdBy: "mentor4",
  },
];

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [selectedMentorId, setSelectedMentorId] = useState<number | null>(null);
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [sessionRequests, setSessionRequests] = useState<SessionRequest[]>([]);
  
  // Auth state management
  const [authState, setAuthState] = useState<"none" | "auth" | "profile-setup" | "authenticated">("none");
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [pendingUserEmail, setPendingUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<"mentor" | "mentee" | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Initialize mock data on mount (for fallback mode)
  useEffect(() => {
    initializeMockData();
    loadFromLocalStorage();
    checkExistingAuth();
  }, []);

  // Check for existing authentication
  const checkExistingAuth = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Try to get user profile from MongoDB
        try {
          const profile = await userAPI.getProfile(session.user.id);
          
          if (profile && profile.profileCompleted) {
            setCurrentUser(profile);
            setUserRole(profile.role);
            setAuthState("authenticated");
          } else {
            // Profile not complete, show setup
            setPendingUserId(session.user.id);
            setPendingUserEmail(session.user.email!);
            setAuthState("profile-setup");
            setCurrentPage("profile-setup");
          }
        } catch (error) {
          // Profile doesn't exist, show setup
          setPendingUserId(session.user.id);
          setPendingUserEmail(session.user.email!);
          setAuthState("profile-setup");
          setCurrentPage("profile-setup");
        }
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    }
  };

  // Handle successful auth (signup or signin)
  const handleAuthSuccess = async (userId: string, userEmail: string) => {
    try {
      // Try to get user profile from MongoDB
      const profile = await userAPI.getProfile(userId);
      
      if (profile && profile.profileCompleted) {
        // Profile exists and is complete
        setCurrentUser(profile);
        setUserRole(profile.role);
        setAuthState("authenticated");
        
        // Redirect based on role
        if (profile.role === "mentor") {
          setCurrentPage("dashboard");
        } else {
          setCurrentPage("mentors");
        }
      } else {
        // Profile doesn't exist or not complete, show setup
        setPendingUserId(userId);
        setPendingUserEmail(userEmail);
        setAuthState("profile-setup");
        setCurrentPage("profile-setup");
      }
    } catch (error) {
      // Profile doesn't exist, show setup
      console.log("Profile not found, showing setup:", error);
      setPendingUserId(userId);
      setPendingUserEmail(userEmail);
      setAuthState("profile-setup");
      setCurrentPage("profile-setup");
    }
  };

  // Handle profile setup completion
  const handleProfileSetupComplete = async (profileData: any) => {
    try {
      // Create profile in MongoDB
      const profile = await userAPI.createProfile(profileData);
      
      setCurrentUser(profile);
      setUserRole(profile.role);
      setAuthState("authenticated");
      setPendingUserId(null);
      setPendingUserEmail(null);
      
      // Redirect based on role
      if (profile.role === "mentor") {
        setCurrentPage("dashboard");
      } else {
        setCurrentPage("mentors");
      }
      
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      console.error("Error creating profile:", error);
      toast.error("Failed to create profile", {
        description: error.message
      });
    }
  };

  // Save data to localStorage whenever it changes (for fallback mode)
  useEffect(() => {
    saveToLocalStorage();
  }, [sessions, sessionRequests]);

  const loadFromLocalStorage = () => {
    try {
      const savedSessions = localStorage.getItem("sessions");
      const savedRequests = localStorage.getItem("sessionRequests");

      if (savedSessions) {
        setSessions(JSON.parse(savedSessions));
      } else {
        // Use initial sessions if none saved
        localStorage.setItem("sessions", JSON.stringify(initialSessions));
      }

      if (savedRequests) {
        setSessionRequests(JSON.parse(savedRequests));
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  };

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem("sessions", JSON.stringify(sessions));
      localStorage.setItem("sessionRequests", JSON.stringify(sessionRequests));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const handleNavigate = (page: string) => {
    // Redirect to auth if trying to access sessions without login
    if (page === "sessions" && authState !== "authenticated") {
      setAuthState("auth");
      setCurrentPage("auth");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setCurrentPage(page);
    setSelectedMentorId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectMentor = (mentorId: number) => {
    // Redirect to auth if trying to view mentor profile without login
    if (authState !== "authenticated") {
      setSelectedMentorId(mentorId);
      setAuthState("auth");
      setCurrentPage("auth");
      return;
    }
    setSelectedMentorId(mentorId);
    setCurrentPage("mentor-profile");
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      
      setUserRole(null);
      setCurrentUser(null);
      setAuthState("none");
      setCurrentPage("home");
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Logout failed", { description: error.message });
    }
  };

  const handleRoleChange = (
    role: "mentor" | "mentee" | null,
    user?: any
  ) => {
    if (role === null) {
      handleLogout();
    } else {
      setUserRole(role);
      setCurrentUser(user || null);
      
      if (role === "mentor") {
        setCurrentPage("dashboard");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (role === "mentee") {
        setCurrentPage("mentors");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleAddSession = (
    newSession: Omit<
      Session,
      "id" | "attendees" | "availableSlots"
    >,
  ) => {
    const session: Session = {
      id: Date.now(), // Use timestamp as ID
      ...newSession,
      attendees: 0,
      availableSlots: newSession.maxSlots || 0,
      createdBy: currentUser?.id || currentUser?.email,
    };
    
    setSessions([session, ...sessions]);
    toast.success("Session created successfully!", {
      description: "Your session is now visible to all users.",
    });
  };

  const handleRequestToJoinSession = (
    sessionId: number | string,
    formData?: {
      phone: string;
      occupation: string;
      experienceLevel: string;
      reasonToJoin: string;
      expectations: string;
    }
  ) => {
    if (!currentUser) {
      toast.error("Please log in", {
        description: "You must be logged in to request to join a session"
      });
      return;
    }

    // Check if already requested
    const existingRequest = sessionRequests.find(
      r => r.sessionId === Number(sessionId) && r.userId === currentUser.id
    );

    if (existingRequest) {
      toast.error("Already requested", {
        description: "You have already sent a request for this session"
      });
      return;
    }

    // Create new request
    const newRequest: SessionRequest = {
      id: `${sessionId}-${currentUser.id}-${Date.now()}`,
      sessionId: Number(sessionId),
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userAvatar: currentUser.avatar || "",
      status: "pending",
      requestedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(formData && {
        phone: formData.phone,
        occupation: formData.occupation,
        experienceLevel: formData.experienceLevel,
        reasonToJoin: formData.reasonToJoin,
        expectations: formData.expectations,
      }),
    };

    setSessionRequests([...sessionRequests, newRequest]);
    
    toast.success("Request sent successfully!", {
      description: "The mentor will review your request."
    });
  };

  const handleDeleteSession = (sessionId: number | string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    // Also remove related requests
    setSessionRequests(sessionRequests.filter(r => r.sessionId !== Number(sessionId)));
    toast.success("Session deleted successfully");
  };

  const handleRespondToRequest = (
    requestId: string,
    action: "accept" | "reject"
  ) => {
    const request = sessionRequests.find(r => r.id === requestId);
    if (!request) return;

    const session = sessions.find(s => s.id === request.sessionId);
    if (!session) return;

    // Check if session is full when accepting
    if (action === "accept" && (session.availableSlots === undefined || session.availableSlots <= 0)) {
      toast.error("Session is full", {
        description: "This session has no available slots"
      });
      return;
    }

    // Update request status
    setSessionRequests(
      sessionRequests.map(r =>
        r.id === requestId
          ? { ...r, status: action === "accept" ? "accepted" : "rejected", updatedAt: new Date().toISOString() }
          : r
      )
    );

    // Update session if accepted
    if (action === "accept") {
      setSessions(
        sessions.map(s =>
          s.id === request.sessionId
            ? {
                ...s,
                attendees: s.attendees + 1,
                availableSlots: s.availableSlots! - 1,
              }
            : s
        )
      );

      toast.success("Request accepted!", {
        description: "The student has been added to your session"
      });
    } else {
      toast.success("Request rejected", {
        description: "The student has been notified"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {currentPage !== "auth" && (
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          userRole={userRole}
          onRoleChange={handleRoleChange}
        />
      )}

      <main className="flex-1">
        {currentPage === "home" && (
          <LandingPage
            onNavigate={handleNavigate}
            sessions={sessions}
          />
        )}
        {currentPage === "mentors" && (
          <MentorDirectory
            onSelectMentor={handleSelectMentor}
          />
        )}
        {currentPage === "mentor-profile" &&
          selectedMentorId && (
            <MentorProfile
              mentorId={selectedMentorId}
              onBack={() => handleNavigate("mentors")}
            />
          )}
        {currentPage === "sessions" && userRole && (
          <SessionsPage
            sessions={sessions}
            onRequestToJoin={handleRequestToJoinSession}
            userRole={userRole}
            currentUserId={currentUser?.id}
            sessionRequests={sessionRequests}
          />
        )}
        {currentPage === "auth" && (
          <AuthForm
            onSuccess={handleAuthSuccess}
            onClose={() => handleNavigate("home")}
          />
        )}
        {currentPage === "dashboard" &&
          userRole === "mentor" && (
            <MentorDashboard
              onAddSession={handleAddSession}
              onDeleteSession={handleDeleteSession}
              sessions={sessions}
              sessionRequests={sessionRequests}
              currentUserId={currentUser?.id}
              onRespondToRequest={handleRespondToRequest}
            />
          )}
        {currentPage === "profile-setup" && pendingUserId && pendingUserEmail && (
          <ProfileSetup
            userId={pendingUserId}
            userEmail={pendingUserEmail}
            onComplete={handleProfileSetupComplete}
          />
        )}
        {currentPage === "about" && <AboutPage />}
        {currentPage === "contact" && <ContactPage />}
        {currentPage === "careers" && <CareersPage onNavigate={handleNavigate} />}
        {currentPage === "help" && <HelpPage onNavigate={handleNavigate} />}
        {currentPage === "community" && <CommunityPage onNavigate={handleNavigate} />}
        {currentPage === "privacy" && <PrivacyPage />}
        {currentPage === "terms" && <TermsPage />}
        {currentPage === "blog" && <BlogPage />}
        {currentPage === "cookies" && <CookiePage />}
      </main>

      {currentPage !== "auth" && (
        <Footer onNavigate={handleNavigate} />
      )}
      
      <BackToTop />
      <Toaster />
    </div>
  );
}

import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}