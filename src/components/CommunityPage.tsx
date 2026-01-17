import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  Users, 
  MessageSquare, 
  Heart, 
  ThumbsUp,
  MessageCircle,
  Share2,
  TrendingUp,
  Award
} from "lucide-react";
import { motion } from "motion/react";

interface CommunityPageProps {
  onNavigate: (page: string) => void;
}

export function CommunityPage({ onNavigate }: CommunityPageProps) {
  const discussions = [
    {
      id: 1,
      author: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      title: "How to prepare for a system design interview?",
      excerpt: "I have an upcoming interview and would love to hear tips from experienced engineers...",
      category: "Career Advice",
      replies: 24,
      likes: 45,
      time: "2 hours ago"
    },
    {
      id: 2,
      author: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      title: "Best practices for mentoring junior developers",
      excerpt: "I recently became a tech lead and want to be an effective mentor. What strategies work well?",
      category: "Mentorship",
      replies: 18,
      likes: 32,
      time: "5 hours ago"
    },
    {
      id: 3,
      author: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      title: "Transitioning from frontend to full stack development",
      excerpt: "I've been working as a frontend developer for 2 years. What should I learn to become full stack?",
      category: "Learning Path",
      replies: 41,
      likes: 67,
      time: "1 day ago"
    },
    {
      id: 4,
      author: "David Kim",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      title: "Negotiating your first tech job offer",
      excerpt: "Just received my first job offer! Any tips on salary negotiation and benefits to look for?",
      category: "Career Advice",
      replies: 29,
      likes: 52,
      time: "2 days ago"
    }
  ];

  const popularTopics = [
    { name: "Career Growth", count: 234 },
    { name: "System Design", count: 189 },
    { name: "Interview Prep", count: 167 },
    { name: "Mentorship Tips", count: 145 },
    { name: "Learning Resources", count: 132 },
    { name: "Work-Life Balance", count: 98 }
  ];

  const stats = [
    { icon: Users, value: "2,500+", label: "Active Members" },
    { icon: MessageSquare, value: "5,000+", label: "Discussions" },
    { icon: Heart, value: "15,000+", label: "Helpful Replies" },
    { icon: Award, value: "500+", label: "Expert Contributors" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-black text-black py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge className="mb-6 bg-black text-yellow-400 hover:bg-black/90">
              Community
            </Badge>
            <h1 className="mb-6">Join the Conversation</h1>
            <p className="text-lg text-black/80 leading-relaxed mb-8">
              Connect with mentors, mentees, and professionals. Share knowledge, ask questions, 
              and grow together in our vibrant community.
            </p>
            <Button 
              size="lg" 
              className="bg-black text-yellow-400 hover:bg-black/90"
              onClick={() => onNavigate("auth")}
            >
              Join Community
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-black" />
                  </div>
                  <div className="mb-1">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Discussions Feed */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2>Recent Discussions</h2>
                <Button onClick={() => onNavigate("auth")}>
                  Start Discussion
                </Button>
              </div>

              {discussions.map((discussion, index) => (
                <motion.div
                  key={discussion.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex gap-4">
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <AvatarImage src={discussion.avatar} />
                        <AvatarFallback>
                          {discussion.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <p className="text-sm">{discussion.author}</p>
                            <p className="text-xs text-muted-foreground">{discussion.time}</p>
                          </div>
                          <Badge variant="outline" className="flex-shrink-0">
                            {discussion.category}
                          </Badge>
                        </div>

                        <h3 className="mb-2">{discussion.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {discussion.excerpt}
                        </p>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <button className="flex items-center gap-2 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            {discussion.likes}
                          </button>
                          <button className="flex items-center gap-2 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            {discussion.replies}
                          </button>
                          <button className="flex items-center gap-2 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                            <Share2 className="w-4 h-4" />
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Popular Topics */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <h3>Popular Topics</h3>
                </div>
                <div className="space-y-3">
                  {popularTopics.map((topic, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <span className="text-sm">{topic.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {topic.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Community Guidelines */}
              <Card className="p-6 bg-yellow-400/10 border-yellow-400/20">
                <h3 className="mb-3">Community Guidelines</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Be respectful and professional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Share knowledge generously</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Stay on topic and relevant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>No spam or self-promotion</span>
                  </li>
                </ul>
              </Card>

              {/* Call to Action */}
              <Card className="p-6 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black">
                <Users className="w-10 h-10 mb-3" />
                <h3 className="mb-2">Join the Discussion</h3>
                <p className="text-sm text-black/80 mb-4">
                  Sign up to ask questions, share insights, and connect with the community.
                </p>
                <Button 
                  className="w-full bg-black text-yellow-400 hover:bg-black/90"
                  onClick={() => onNavigate("auth")}
                >
                  Get Started
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
