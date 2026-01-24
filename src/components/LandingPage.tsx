import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Users, Video, Award, TrendingUp, Star, ArrowRight, CheckCircle2, Sparkles, Calendar, Clock, MapPin, Monitor } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { useNavigate } from "react-router-dom";

export interface Speaker {
  name: string;
  avatar: string;
  title?: string;
}

interface Session {
  id: number;
  title: string;
  description: string;
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
  speakers: Speaker[];
}

interface LandingPageProps {
  sessions: Session[];
}

const testimonials = [
  {
    name: "Alex Thompson",
    role: "Software Engineer",
    avatar: "",
    content: "Found an amazing mentor who helped me land my dream job at a top tech company. The guidance was invaluable!",
    rating: 5
  },
  {
    name: "Maria Garcia",
    role: "Product Manager",
    avatar: "",
    content: "The tech sessions are phenomenal. I've learned so much from industry experts for free. Highly recommend!",
    rating: 5
  },
  {
    name: "David Chen",
    role: "UX Designer",
    avatar: "",
    content: "As a mentor, this platform helps me give back to the community. The portfolio feature is a great addition!",
    rating: 5
  }
];

const stats = [
  { number: "500+", label: "Expert Mentors", icon: Users },
  { number: "2,000+", label: "Success Stories", icon: TrendingUp },
  { number: "150+", label: "Live Sessions", icon: Video },
  { number: "95%", label: "Satisfaction Rate", icon: Award }
];

const benefits = [
  "1-on-1 personalized mentorship",
  "Free access to tech sessions",
  "Portfolio building tools",
  "Career guidance & support",
  "Community of professionals",
  "Flexible scheduling"
];

export function LandingPage({ sessions }: LandingPageProps) {
  const navigate = useNavigate();
  // Filter to get ongoing/upcoming sessions (simplified - in real app would compare with current date)
  const ongoingSessions = sessions.slice(0, 5);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-muted">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundSize: '40px 40px',
          backgroundImage: 'linear-gradient(to right, rgb(247 198 0 / 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgb(247 198 0 / 0.08) 1px, transparent 1px)'
        }}></div>

        {/* Animated gradient blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto"
          >
            <Badge className="mb-6 px-4 py-2 shadow-lg" variant="secondary">
              <Sparkles className="w-4 h-4 mr-2" />
              Transform Your Tech Career
            </Badge>

            <h1 className="mb-6 text-4xl md:text-6xl font-bold leading-tight">
              Connect with <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Expert Mentors</span> and Accelerate Your Growth
            </h1>

            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
              Join thousands of professionals building meaningful connections. Get personalized mentorship,
              attend exclusive tech sessions, and unlock your full potential.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" onClick={() => navigate("/mentors")} className="gap-2 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                Find a Mentor
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/sessions")} className="gap-2 shadow-lg hover:shadow-xl">
                <Video className="w-4 h-4" />
                Browse Sessions
              </Button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-primary/20 max-w-5xl mx-auto">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758522276267-b3472583e954?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50b3IlMjB0ZWFjaGluZyUyMHN0dWRlbnR8ZW58MXx8fHwxNzU5MzA0OTU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Mentorship in action"
                className="w-full h-[400px] object-cover"
              />
            </div>
            {/* Floating Stats */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4">
              <Card className="p-6 shadow-2xl border-2 border-primary/10 bg-card/95 backdrop-blur-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                        <stat.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="mb-1 text-2xl font-bold">{stat.number}</div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ongoing Sessions Slider */}
      {ongoingSessions.length > 0 && (
        <section className="container mx-auto px-4 py-24 mt-16">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">Live & Upcoming</Badge>
            <h2 className="mb-4">Ongoing Tech Sessions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join our expert-led sessions happening now and coming soon
            </p>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-4">
              {ongoingSessions.map((session) => (
                <CarouselItem key={session.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="p-6 h-full hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-primary/30">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant={session.sessionType === "online" ? "default" : "secondary"} className="mb-2">
                        {session.sessionType === "online" ? (
                          <><Monitor className="w-3 h-3 mr-1" /> Online</>
                        ) : (
                          <><MapPin className="w-3 h-3 mr-1" /> Physical</>
                        )}
                      </Badge>
                    </div>

                    {session.companyName && (
                      <Badge variant="outline" className="mb-2">
                        {session.companyName}
                      </Badge>
                    )}
                    <h3 className="mb-2 line-clamp-2">{session.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {session.description}
                    </p>

                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        {session.speakers.length > 1 ? `${session.speakers.length} Speakers` : "Speaker"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {session.speakers.slice(0, 3).map((speaker, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={speaker.avatar} />
                              <AvatarFallback className="text-xs">
                                {speaker.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs truncate">{speaker.name}</p>
                            </div>
                          </div>
                        ))}
                        {session.speakers.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{session.speakers.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{session.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{session.time}</span>
                      </div>
                      {session.sessionType === "physical" && session.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{session.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {session.topics.slice(0, 3).map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-muted-foreground">
                        <Users className="w-4 h-4 inline mr-1" />
                        {session.attendees} registered
                      </span>
                      <span className="text-primary">
                        {session.availableSlots} slots left
                      </span>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => navigate("/sessions")}
                      variant={session.availableSlots === 0 ? "outline" : "default"}
                    >
                      {session.availableSlots === 0 ? "View Details" : "Join Session"}
                    </Button>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" onClick={() => navigate("/sessions")}>
              View All Sessions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24 mt-16">
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="outline">Why Choose Topvoice.lk</Badge>
          <h2 className="mb-4">Everything You Need to Succeed</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A comprehensive platform designed to accelerate your career growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Users,
              title: "Expert Mentors",
              description: "Connect with experienced professionals who are passionate about helping others grow",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: Video,
              title: "Live Tech Sessions",
              description: "Attend free public sessions on the latest technologies and best practices",
              color: "from-purple-500 to-pink-500"
            },
            {
              icon: Award,
              title: "Portfolio Showcase",
              description: "Mentors can showcase their achievements and build their professional brand",
              color: "from-orange-500 to-red-500"
            },
            {
              icon: TrendingUp,
              title: "Career Growth",
              description: "Get personalized guidance to advance your career and achieve your goals",
              color: "from-green-500 to-emerald-500"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-primary/20">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4" variant="outline">Complete Platform</Badge>
              <h2 className="mb-4">Built for Mentors and Mentees</h2>
              <p className="text-muted-foreground mb-8">
                Whether you're seeking guidance or sharing your expertise, Topvoice.lk provides
                all the tools you need for meaningful connections and growth.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" onClick={() => navigate("/mentors")}>
                Get Started Today
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758518729685-f88df7890776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWFtJTIwbWVldGluZ3xlbnwxfHx8fDE3NTkxOTc3NDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Professional team collaboration"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-card p-4 rounded-xl shadow-xl border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <div>95%</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="outline">Testimonials</Badge>
          <h2 className="mb-4">Loved by Thousands of Users</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
        <div className="absolute inset-0 bg-grid-white/[0.05]"></div>

        <div className="container mx-auto px-4 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="mb-4 text-white">Ready to Transform Your Career?</h2>
            <p className="text-white/90 mb-8 text-lg">
              Join thousands of professionals who are already growing with Topvoice.lk
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/mentors")}
                className="gap-2 shadow-xl"
              >
                Find Your Mentor
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/sessions")}
                className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <Video className="w-4 h-4" />
                Explore Sessions
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}