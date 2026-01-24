import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { MapPin, Award, Calendar, ExternalLink, ArrowLeft, Star, Video, Users, TrendingUp, MessageCircle, Briefcase } from "lucide-react";
import { RequestMentorshipDialog } from "./RequestMentorshipDialog";
import { HireMentorDialog } from "./HireMentorDialog";
import { supabaseService, UserProfile } from "../services/supabaseService";
import { Loader2 } from "lucide-react";

interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  type: string;
}

interface Session {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  topics: string[];
}

interface MentorProfileProps {
  mentorId: string;
  onBack: () => void;
}

const mockAchievements: Achievement[] = [
  {
    id: 1,
    title: "AWS Solutions Architect - Professional",
    description: "Achieved professional level certification in AWS cloud architecture",
    date: "March 2024",
    type: "Certification"
  },
  {
    id: 2,
    title: "Led Migration to Microservices",
    description: "Successfully led team to migrate monolithic application to microservices architecture, improving scalability by 300%",
    date: "January 2024",
    type: "Project"
  },
  {
    id: 3,
    title: "Conference Speaker - ReactConf 2023",
    description: "Presented on advanced React patterns and performance optimization",
    date: "October 2023",
    type: "Speaking"
  }
];

const mockSessions: Session[] = [
  {
    id: 1,
    title: "Introduction to React Hooks",
    description: "Learn the fundamentals of React Hooks and how to use them effectively in your applications",
    date: "2025-10-15",
    time: "6:00 PM EST",
    duration: "90 minutes",
    topics: ["React", "Hooks", "State Management"]
  },
  {
    id: 2,
    title: "System Design Fundamentals",
    description: "Understand the core concepts of system design and how to approach design interviews",
    date: "2025-10-22",
    time: "7:00 PM EST",
    duration: "120 minutes",
    topics: ["System Design", "Architecture", "Scalability"]
  }
];

export function MentorProfile({ mentorId, onBack }: MentorProfileProps) {
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showHireDialog, setShowHireDialog] = useState(false);
  const [mentor, setMentor] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMentor() {
      setIsLoading(true);
      try {
        const data = await supabaseService.getProfile(mentorId);
        setMentor(data);
      } catch (error) {
        console.error("Failed to load mentor:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadMentor();
  }, [mentorId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="mb-4">Mentor not found</h2>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  const stats = {
    totalSessions: 0,
    totalMentees: 0,
    averageRating: 4.8, // Mock for now
    totalRatings: 0
  };

  const reviews = [
    {
      id: 1,
      menteeName: "Alex Chen",
      menteeAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      rating: 5,
      comment: "Sarah's guidance helped me land my dream job! She's an excellent mentor who really cares about her mentees' growth.",
      date: "2 weeks ago",
      sessionTitle: "System Design Interview Prep"
    },
    {
      id: 2,
      menteeName: "Maria Rodriguez",
      menteeAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      rating: 5,
      comment: "The React workshop was incredibly insightful. Sarah explains complex concepts in a way that's easy to understand.",
      date: "1 month ago",
      sessionTitle: "Advanced React Patterns"
    },
    {
      id: 3,
      menteeName: "David Kim",
      menteeAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      rating: 4,
      comment: "Great session on TypeScript best practices. Very practical and hands-on approach.",
      date: "1 month ago",
      sessionTitle: "TypeScript Fundamentals"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Mentors
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <div className="text-center mb-6">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarImage src={mentor.avatar} />
                <AvatarFallback className="text-2xl">
                  {mentor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h2 className="mb-1">{mentor.name}</h2>
              <p className="text-muted-foreground mb-2">{mentor.currentRole}</p>
              <p className="text-sm text-muted-foreground">{mentor.company}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{mentor.location || 'Remote'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-muted-foreground" />
                <span>{mentor.yearsExperience || 0}+ years experience</span>
              </div>
            </div>

            {/* Stats Card */}
            <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{stats.averageRating}</span>
                    <span className="text-sm text-muted-foreground">/ 5.0</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{stats.totalRatings} ratings</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Video className="w-3 h-3" />
                    <span className="text-xs">Sessions</span>
                  </div>
                  <p className="font-semibold">{stats.totalSessions}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Users className="w-3 h-3" />
                    <span className="text-xs">Mentees</span>
                  </div>
                  <p className="font-semibold">{stats.totalMentees}</p>
                </div>
              </div>
            </Card>

            <div className="mb-6">
              <p className="text-sm mb-3">Expertise</p>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise?.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={() => setShowRequestDialog(true)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Request Mentorship
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setShowHireDialog(true)}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Hire
              </Button>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="p-6 mb-6">
            <h3 className="mb-3">About</h3>
            <p className="text-muted-foreground">{mentor.bio}</p>
          </Card>

          <Tabs defaultValue="achievements">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="sessions">Tech Sessions</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="achievements" className="space-y-4 mt-6">
              {mentor.achievements && mentor.achievements.length > 0 ? (
                mentor.achievements.map((achievement, idx) => (
                  <Card key={idx} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="mb-1">{achievement.title}</h4>
                        <Badge variant="outline">{achievement.type}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {achievement.date}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{achievement.description}</p>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No achievements listed yet.
                </div>
              )}
            </TabsContent>

            <TabsContent value="sessions" className="space-y-4 mt-6">
              {mockSessions.map((session) => (
                <Card key={session.id} className="p-6">
                  <h4 className="mb-2">{session.title}</h4>
                  <p className="text-muted-foreground mb-4">{session.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
                      <p className="text-sm">{session.date} at {session.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Duration</p>
                      <p className="text-sm">{session.duration}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Topics</p>
                    <div className="flex flex-wrap gap-2">
                      {session.topics.map((topic, index) => (
                        <Badge key={index} variant="secondary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">Join Session</Button>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4 mt-6">
              {reviews.map((review) => (
                <Card key={review.id} className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={review.menteeAvatar} />
                      <AvatarFallback>
                        {review.menteeName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{review.menteeName}</p>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <Badge variant="outline" className="mb-3">
                        {review.sessionTitle}
                      </Badge>
                      <p className="text-muted-foreground leading-relaxed">
                        "{review.comment}"
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <RequestMentorshipDialog
        open={showRequestDialog}
        onOpenChange={setShowRequestDialog}
        mentorName={mentor.name}
      />
      <HireMentorDialog
        open={showHireDialog}
        onOpenChange={setShowHireDialog}
        mentorName={mentor.name}
      />
    </div>
  );
}
