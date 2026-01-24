import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
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
import { supabaseService, UserProfile } from "./services/supabaseService";
import { supabase } from "./lib/supabaseClient";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { MenteeDashboard } from "./components/MenteeDashboard";
import { BrowserRouter, useParams } from "react-router-dom";
import ErrorBoundary from './components/ErrorBoundary';

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
  mentorName?: string;
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
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [sessionRequests, setSessionRequests] = useState<SessionRequest[]>([]);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize from database on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [dbSessions, dbRequests] = await Promise.all([
          supabaseService.getSessions(),
          supabaseService.getSessionRequests()
        ]);

        if (dbSessions.length > 0) {
          setSessions(dbSessions);
        } else {
          // If no sessions in DB yet, use initial sessions but don't save to localStorage
          setSessions(initialSessions);
        }

        setSessionRequests(dbRequests);
      } catch (error) {
        console.error("Error loading initial data from database:", error);
        setSessions(initialSessions);
      }
    };

    loadInitialData();
  }, []);

  const handleAddSession = async (
    newSession: Omit<
      Session,
      "id" | "attendees" | "availableSlots" | "mentorName"
    >,
  ) => {
    if (!user) return;

    const sessionData = {
      ...newSession,
      mentor_name: user?.name,
      mentor_avatar: user?.avatar,
      attendees: 0,
      available_slots: newSession.maxSlots,
      created_by: user?.id,
      // Map other fields to snake_case if necessary, or assume the service handles it
      // Let's assume the DB expects snake_case based on common Supabase patterns
    };

    const createdSession = await supabaseService.createSession(sessionData);

    if (createdSession) {
      setSessions([createdSession, ...sessions]);
      toast.success("Session created successfully!", {
        description: "Your session is now visible to all users.",
      });
    }
  };

  const handleRequestToJoinSession = async (
    sessionId: number | string,
    formData?: {
      phone: string;
      occupation: string;
      experienceLevel: string;
      reasonToJoin: string;
      expectations: string;
    }
  ) => {
    if (!user) {
      toast.error("Please log in", {
        description: "You must be logged in to request to join a session"
      });
      return;
    }

    // Check if already requested
    const existingRequest = sessionRequests.find(
      r => r.sessionId === Number(sessionId) && r.userId === user.id
    );

    if (existingRequest) {
      toast.error("Already requested", {
        description: "You have already sent a request for this session"
      });
      return;
    }

    // Create new request in Supabase
    const requestData = {
      session_id: Number(sessionId),
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      user_avatar: user.avatar || "",
      status: "pending",
      ...(formData && {
        phone: formData.phone,
        occupation: formData.occupation,
        experience_level: formData.experienceLevel,
        reason_to_join: formData.reasonToJoin,
        expectations: formData.expectations,
      }),
    };

    const createdRequest = await supabaseService.createSessionRequest(requestData);

    if (createdRequest) {
      setSessionRequests([...sessionRequests, createdRequest]);
      toast.success("Request sent successfully!", {
        description: "The mentor will review your request."
      });
    }
  };

  const handleDeleteSession = async (sessionId: number | string) => {
    const success = await supabaseService.deleteSession(sessionId);
    if (success) {
      setSessions(sessions.filter((s) => s.id !== sessionId));
      setSessionRequests(sessionRequests.filter(r => r.sessionId !== Number(sessionId)));
      toast.success("Session deleted successfully");
    }
  };

  const handleRespondToRequest = async (
    requestId: string,
    action: "accept" | "reject"
  ) => {
    const request = sessionRequests.find(r => r.id === requestId);
    if (!request) return;

    const session = sessions.find(s => s.id === request.sessionId);
    if (!session) return;

    if (action === "accept" && (session.availableSlots === undefined || session.availableSlots <= 0)) {
      toast.error("Session is full");
      return;
    }

    const updatedRequest = await supabaseService.updateSessionRequest(requestId, action === 'accept' ? 'accepted' : 'rejected');

    if (updatedRequest) {
      setSessionRequests(
        sessionRequests.map(r => r.id === requestId ? updatedRequest : r)
      );

      if (action === "accept") {
        // Update session attendee count in DB
        const sessionUpdate = {
          attendees: (session.attendees || 0) + 1,
          available_slots: (session.availableSlots || 1) - 1,
        };
        const updatedSession = await supabaseService.updateSession(request.sessionId, sessionUpdate);
        if (updatedSession) {
          setSessions(
            sessions.map(s => s.id === request.sessionId ? updatedSession : s)
          );
        }
      }

      toast.success(action === "accept" ? "Request accepted!" : "Request rejected");
    }
  };

  // Determine if header/footer should be shown
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/profile-setup';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!isAuthPage && <Header />}

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage sessions={sessions} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/careers" element={<CareersPage onNavigate={(p) => navigate(`/${p}`)} />} />
          <Route path="/help" element={<HelpPage onNavigate={(p) => navigate(`/${p}`)} />} />
          <Route path="/community" element={<CommunityPage onNavigate={(p) => navigate(`/${p}`)} />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/cookies" element={<CookiePage />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <AuthForm />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <AuthForm />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/profile-setup"
            element={
              <ProtectedRoute>
                <ProfileSetup
                  userId={user?.id || ''}
                  userEmail={user?.email || ''}
                  onComplete={() => { }} // Now handled internally in ProfileSetup
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mentors"
            element={
              <ProtectedRoute>
                <MentorDirectory
                  onSelectMentor={(id) => navigate(`/mentors/${id}`)}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mentors/:id"
            element={
              <ProtectedRoute>
                <MentorProfileWrapper onBack={() => navigate('/mentors')} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mentee-dashboard"
            element={
              <ProtectedRoute>
                <MenteeDashboard
                  sessions={sessions}
                  sessionRequests={sessionRequests}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sessions"
            element={
              <ProtectedRoute>
                <SessionsPage
                  sessions={sessions}
                  onRequestToJoin={handleRequestToJoinSession}
                  userRole={user?.role || 'mentee'}
                  currentUserId={user?.id}
                  sessionRequests={sessionRequests}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {user ? (
                  user.role === 'mentor' ? (
                    <MentorDashboard
                      onAddSession={handleAddSession}
                      onDeleteSession={handleDeleteSession}
                      sessions={sessions}
                      sessionRequests={sessionRequests}
                      currentUserId={user?.id}
                      onRespondToRequest={handleRespondToRequest}
                    />
                  ) : (
                    <MenteeDashboard
                      sessions={sessions}
                      sessionRequests={sessionRequests}
                    />
                  )
                ) : (
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-muted-foreground">Loading your dashboard...</p>
                    </div>
                  </div>
                )}
              </ProtectedRoute>
            }
          />


          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}

      <BackToTop />
      <Toaster />
    </div>
  );
}

function MentorProfileWrapper({ onBack }: { onBack: () => void }) {
  const { id } = useParams<{ id: string }>();
  if (!id) return <Navigate to="/mentors" />;
  return <MentorProfile mentorId={id} onBack={onBack} />;
}

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