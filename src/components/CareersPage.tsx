import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Heart, 
  Zap, 
  Users, 
  TrendingUp,
  ArrowRight,
  DollarSign,
  Search
} from "lucide-react";
import { motion } from "motion/react";
import { getCareerListings } from "../utils/mockData";

interface CareersPageProps {
  onNavigate: (page: string) => void;
}

export function CareersPage({ onNavigate }: CareersPageProps) {
  const [listings, setListings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    const careerListings = getCareerListings();
    setListings(careerListings);
  }, []);

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || listing.type === selectedType;
    return matchesSearch && matchesType;
  });

  const jobTypes = ["all", "full-time", "part-time", "contract", "internship"];

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs"
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Work-life balance with flexible scheduling"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Learning budget and mentorship opportunities"
    },
    {
      icon: Users,
      title: "Great Team",
      description: "Work with passionate, talented people"
    },
    {
      icon: Zap,
      title: "Impact",
      description: "Build products that transform careers"
    },
    {
      icon: Briefcase,
      title: "Remote Options",
      description: "Remote and hybrid work opportunities"
    }
  ];

  const values = [
    "Passion for democratizing mentorship",
    "Commitment to continuous learning",
    "Collaborative and supportive culture",
    "Innovation and creative problem-solving",
    "Integrity and transparency",
    "Diversity and inclusion"
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
              Careers
            </Badge>
            <h1 className="mb-6">Join Our Mission</h1>
            <p className="text-lg text-black/80 leading-relaxed mb-8">
              Help us build the future of professional mentorship. We're looking for passionate individuals 
              who want to make a real impact on people's careers.
            </p>
            <Button 
              size="lg" 
              className="bg-black text-yellow-400 hover:bg-black/90"
              onClick={() => {
                const openingsSection = document.getElementById('openings');
                openingsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View Open Positions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">Why Topvoice.lk</Badge>
            <h2 className="mb-4">Why Work With Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Be part of a team that's transforming careers through mentorship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-yellow-400/50">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="outline">Our Culture</Badge>
              <h2 className="mb-4">What We Value</h2>
            </div>

            <Card className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                    </div>
                    <p className="text-muted-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="outline">Join Us</Badge>
              <h2 className="mb-4">Open Positions</h2>
              <p className="text-muted-foreground">
                {filteredListings.length} open positions across tech companies
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, company, or description..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {jobTypes.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredListings.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-muted rounded-lg overflow-hidden">
                          <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="mb-1">{job.title}</h3>
                            <p className="text-sm">{job.company}</p>
                          </div>
                          <Badge variant="secondary" className="capitalize flex-shrink-0">
                            {job.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            {job.experience}
                          </div>
                          {job.salary && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              {job.salary}
                            </div>
                          )}
                        </div>
                        {job.requirements && job.requirements.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm mb-2">Key Requirements:</p>
                            <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                              {job.requirements.slice(0, 3).map((req: string, i: number) => (
                                <li key={i} className="list-disc">{req}</li>
                              ))}
                              {job.requirements.length > 3 && (
                                <li className="list-none">+{job.requirements.length - 3} more...</li>
                              )}
                            </ul>
                          </div>
                        )}
                        <Button className="mt-2">
                          Apply Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="mt-8 p-8 text-center bg-muted/50">
              <Briefcase className="w-10 h-10 text-yellow-600 dark:text-yellow-400 mx-auto mb-3" />
              <h3 className="mb-2">Don't See a Perfect Fit?</h3>
              <p className="text-muted-foreground mb-4">
                We're always looking for talented people. Send us your resume and we'll keep you in mind 
                for future opportunities.
              </p>
              <Button variant="outline" onClick={() => onNavigate("contact")}>
                Get in Touch
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Hiring Process */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="outline">Process</Badge>
              <h2 className="mb-4">Our Hiring Process</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Apply", description: "Submit your application" },
                { step: "2", title: "Screen", description: "Initial review call" },
                { step: "3", title: "Interview", description: "Technical & cultural fit" },
                { step: "4", title: "Offer", description: "Welcome to the team!" }
              ].map((stage, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-black">{stage.step}</span>
                  </div>
                  <h3 className="mb-2">{stage.title}</h3>
                  <p className="text-sm text-muted-foreground">{stage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-black text-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4">Ready to Make an Impact?</h2>
            <p className="text-lg text-black/80 mb-8 leading-relaxed">
              Join us in transforming careers through mentorship
            </p>
            <Button 
              size="lg" 
              className="bg-black text-yellow-400 hover:bg-black/90"
              onClick={() => {
                const openingsSection = document.getElementById('openings');
                openingsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View All Positions
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
