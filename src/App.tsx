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
import { supabaseService, UserProfile, Session, SessionRequest, Speaker } from "./services/supabaseService";
import { supabase } from "./lib/supabaseClient";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { MenteeDashboard } from "./components/MenteeDashboard";
import { BrowserRouter, useParams } from "react-router-dom";
import ErrorBoundary from './components/ErrorBoundary';

// Mock initial sessions
const initialSessions: Session[] = [];

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
          setSessions([]);
        }

        setSessionRequests(dbRequests);
      } catch (error) {
        console.error("Error loading initial data from database:", error);
        setSessions(initialSessions);
      }
    };

    loadInitialData();
  }, [user?.id]);

  const handleAddSession = async (
    newSession: Omit<
      Session,
      "id" | "attendees" | "availableSlots" | "mentorName"
    >,
  ) => {
    if (!user) return;

    const sessionData = {
      ...newSession,
      mentorName: user.name,
      mentorAvatar: user.avatar,
      attendees: 0,
      availableSlots: newSession.maxSlots,
      createdBy: user.id,
      status: 'scheduled'
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
    sessionId: number | string | null,
    formData?: {
      phone: string;
      occupation: string;
      experienceLevel: string;
      reasonToJoin: string;
      expectations: string;
      fullName?: string;
      email?: string;
    },
    mentorId?: string
  ) => {
    if (!user) {
      toast.error("Please log in", {
        description: "You must be logged in to request to join a session"
      });
      return;
    }

    // Check if already requested
    const existingRequest = sessionRequests.find(
      r => (sessionId ? String(r.sessionId) === String(sessionId) : false) && r.userId === user.id
    );

    if (existingRequest) {
      toast.error("Already requested", {
        description: "You have already sent a request for this session"
      });
      return;
    }

    // Create new request in Supabase
    const requestData = {
      session_id: sessionId,
      mentor_id: mentorId || null,
      user_id: user.id,
      user_name: formData?.fullName || user.name,
      user_email: formData?.email || user.email,
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
      setSessionRequests(sessionRequests.filter(r => String(r.sessionId) !== String(sessionId)));
      toast.success("Session deleted successfully");
    }
  };

  const handleRespondToRequest = async (
    requestId: string,
    action: "accept" | "reject",
    message?: string,
    meetingUrl?: string
  ) => {
    const request = sessionRequests.find(r => r.id === requestId);
    if (!request) return;

    // Only validate session if it's a session-specific request
    if (request.sessionId) {
      const session = sessions.find(s => String(s.id) === String(request.sessionId));
      if (session) {
        if (action === "accept" && (session.availableSlots === undefined || session.availableSlots <= 0)) {
          toast.error("Session is full");
          return;
        }
      }
    }

    const updatedRequest = await supabaseService.updateSessionRequest(
      requestId,
      action === 'accept' ? 'accepted' : 'rejected',
      message,
      meetingUrl
    );

    if (updatedRequest) {
      setSessionRequests(
        sessionRequests.map(r => r.id === requestId ? updatedRequest : r)
      );

      if (action === "accept" && request.sessionId) {
        const session = sessions.find(s => String(s.id) === String(request.sessionId));
        if (session) {
          // Update session attendee count in DB
          const sessionUpdate = {
            attendees: (session.attendees || 0) + 1,
            available_slots: (session.availableSlots || 1) - 1,
          };
          const updatedSession = await supabaseService.updateSession(request.sessionId, sessionUpdate);
          if (updatedSession) {
            setSessions(
              sessions.map(s => String(s.id) === String(request.sessionId) ? updatedSession : s)
            );
          }
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