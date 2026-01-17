import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Target, Users, Heart, Zap, Award, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";

export function AboutPage() {
  const team = [
    {
      name: "Rajitha Silva",
      role: "Founder & CEO",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      bio: "Serial entrepreneur passionate about democratizing mentorship"
    },
    {
      name: "Amaya Fernando",
      role: "Head of Community",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      bio: "Building connections and fostering growth in the tech community"
    },
    {
      name: "Dinesh Perera",
      role: "Lead Engineer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      bio: "Creating seamless experiences for mentors and mentees"
    },
    {
      name: "Nisha Jayawardena",
      role: "Product Designer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      bio: "Designing intuitive interfaces that empower users"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Growth",
      description: "We believe in the transformative power of mentorship and continuous learning"
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a supportive ecosystem where everyone can thrive together"
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Leveraging technology to make mentorship accessible to everyone"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to delivering exceptional experiences for our users"
    }
  ];

  const milestones = [
    { year: "2023", title: "Founded", description: "Topvoice.lk was born with a vision" },
    { year: "2024", title: "500+ Mentors", description: "Reached our first major milestone" },
    { year: "2024", title: "2,000+ Connections", description: "Facilitated thousands of mentorship relationships" },
    { year: "2025", title: "Going Global", description: "Expanding beyond Sri Lanka" }
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
              About Us
            </Badge>
            <h1 className="mb-6">Empowering Careers Through Meaningful Connections</h1>
            <p className="text-lg text-black/80 leading-relaxed">
              Topvoice.lk is Sri Lanka's premier mentorship platform, connecting aspiring professionals 
              with experienced mentors who are passionate about sharing their knowledge and helping others succeed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full border-2 border-yellow-400/20 hover:border-yellow-400/50 transition-colors">
                <div className="w-16 h-16 bg-yellow-400 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-black" />
                </div>
                <h2 className="mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To democratize access to professional mentorship by creating a platform where anyone, 
                  regardless of their background, can connect with experienced professionals who can guide 
                  them on their career journey.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full border-2 border-yellow-400/20 hover:border-yellow-400/50 transition-colors">
                <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-yellow-400" />
                </div>
                <h2 className="mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To become the leading mentorship platform in South Asia, fostering a vibrant community 
                  where knowledge sharing, professional growth, and meaningful connections transform careers 
                  and lives.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">Our Values</Badge>
            <h2 className="mb-4">What Drives Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do at Topvoice.lk
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full text-center hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-black" />
                  </div>
                  <h3 className="mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4" variant="outline">Our Story</Badge>
              <h2 className="mb-6">How It All Started</h2>
            </motion.div>

            <Card className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Topvoice.lk was founded in 2023 by a group of tech professionals who recognized a critical 
                  gap in Sri Lanka's professional development landscape. While there was no shortage of talented 
                  individuals eager to grow in their careers, access to experienced mentors remained limited 
                  to those with the right connections.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We set out to change that by creating a platform that would democratize access to mentorship, 
                  making it easy for anyone to connect with experienced professionals who could guide them on 
                  their career journey. What started as a simple idea has grown into a thriving community of 
                  over 500 mentors and 2,000 mentees.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, Topvoice.lk is not just a platform—it's a movement. We're building a future where 
                  everyone has access to the guidance they need to achieve their career goals, regardless of 
                  their background or connections.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">Journey</Badge>
            <h2 className="mb-4">Our Milestones</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-6 items-start"
                >
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-black">{milestone.year}</span>
                  </div>
                  <Card className="flex-1 p-6">
                    <h3 className="mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">Our Team</Badge>
            <h2 className="mb-4">Meet The People Behind Topvoice.lk</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A passionate team dedicated to transforming careers through mentorship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-yellow-400">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <h3 className="mb-1">{member.name}</h3>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-yellow-400 via-yellow-500 to-black text-black">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="mb-2">500+</div>
                <p className="text-sm text-black/80">Expert Mentors</p>
              </div>
              <div>
                <div className="mb-2">2,000+</div>
                <p className="text-sm text-black/80">Active Mentees</p>
              </div>
              <div>
                <div className="mb-2">150+</div>
                <p className="text-sm text-black/80">Tech Sessions</p>
              </div>
              <div>
                <div className="mb-2">95%</div>
                <p className="text-sm text-black/80">Satisfaction Rate</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
