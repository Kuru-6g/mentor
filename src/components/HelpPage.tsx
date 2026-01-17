import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  MessageCircle, 
  Video, 
  Users,
  ChevronRight,
  Mail,
  FileText,
  Settings
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { getHelpArticles } from "../utils/mockData";

interface HelpPageProps {
  onNavigate: (page: string) => void;
}

export function HelpPage({ onNavigate }: HelpPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [helpArticles, setHelpArticles] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const articles = getHelpArticles();
    setHelpArticles(articles);
  }, []);

  const categoryIcons: Record<string, any> = {
    "getting-started": Users,
    "sessions": Video,
    "mentorship": MessageCircle,
    "account": Settings,
    "technical": FileText,
  };

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = 
      article.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", label: "All Topics", icon: BookOpen },
    { id: "getting-started", label: "Getting Started", icon: Users },
    { id: "sessions", label: "Tech Sessions", icon: Video },
    { id: "mentorship", label: "Mentorship", icon: MessageCircle },
    { id: "account", label: "Account", icon: Settings },
    { id: "technical", label: "Technical", icon: FileText },
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
              Help Center
            </Badge>
            <h1 className="mb-6">How Can We Help You?</h1>
            <p className="text-lg text-black/80 mb-8 leading-relaxed">
              Find answers to common questions and learn how to make the most of Topvoice.lk
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for help articles..."
                className="pl-12 h-14 bg-white dark:bg-card text-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="mb-4" variant="outline">Browse by Topic</Badge>
            <h2 className="mb-4">Help Categories</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>

          <div className="max-w-4xl mx-auto">
            {filteredArticles.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredArticles.map((article, index) => (
                  <AccordionItem
                    key={article.id}
                    value={article.id}
                    className="border rounded-lg px-6 bg-card"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <HelpCircle className="w-4 h-4 text-black" />
                        </div>
                        <span>{article.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-11">
                      {article.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <Card className="p-12 text-center">
                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="mb-2">No articles found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or browse different categories
                </p>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="outline">Still Need Help?</Badge>
              <h2 className="mb-4">Contact Support</h2>
              <p className="text-muted-foreground">
                Can't find what you're looking for? Our support team is here to help
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-black" />
                </div>
                <h3 className="mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get help from our support team via email
                </p>
                <Button onClick={() => onNavigate("contact")}>
                  Contact Us
                </Button>
              </Card>

              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-black" />
                </div>
                <h3 className="mb-2">Community Forum</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with other users and share knowledge
                </p>
                <Button onClick={() => onNavigate("community")}>
                  Visit Community
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="outline">Pro Tips</Badge>
              <h2 className="mb-4">Quick Tips</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Demo Accounts",
                  text: "Use mentor@test.com or student@test.com (password: password123) to test features"
                },
                {
                  title: "Session Requests",
                  text: "Mentees can request to join sessions, and mentors can approve/reject from their dashboard"
                },
                {
                  title: "Profile Building",
                  text: "Mentors: Add achievements and host sessions to build your portfolio"
                }
              ].map((tip, index) => (
                <Card key={index} className="p-6 bg-yellow-400/10 border-yellow-400/20">
                  <h3 className="mb-3">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {tip.text}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="outline">Quick Links</Badge>
              <h2 className="mb-4">Popular Resources</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <BookOpen className="w-10 h-10 text-yellow-600 dark:text-yellow-400 mx-auto mb-3" />
                <h3 className="mb-2">Documentation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete platform documentation
                </p>
                <Button variant="outline" size="sm">
                  Read Docs
                </Button>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <Video className="w-10 h-10 text-yellow-600 dark:text-yellow-400 mx-auto mb-3" />
                <h3 className="mb-2">Video Tutorials</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Step-by-step video guides
                </p>
                <Button variant="outline" size="sm">
                  Watch Videos
                </Button>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <Users className="w-10 h-10 text-yellow-600 dark:text-yellow-400 mx-auto mb-3" />
                <h3 className="mb-2">Community Forum</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with other users
                </p>
                <Button variant="outline" size="sm" onClick={() => onNavigate("community")}>
                  Join Forum
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-black text-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Mail className="w-12 h-12 mx-auto mb-4" />
            <h2 className="mb-4">Still Need Help?</h2>
            <p className="text-lg text-black/80 mb-6 leading-relaxed">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Button 
              size="lg" 
              className="bg-black text-yellow-400 hover:bg-black/90"
              onClick={() => onNavigate("contact")}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
