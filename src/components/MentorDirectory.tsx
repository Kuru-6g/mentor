import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Search, MapPin, Award, Briefcase, Sparkles } from "lucide-react";
import { getMentors } from "../utils/mockData";
import { motion } from "motion/react";

interface Mentor {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  location: string;
  experience: string;
  avatar: string;
  achievementCount: number;
  company?: string;
}

interface MentorDirectoryProps {
  onSelectMentor: (mentorId: number) => void;
}

export function MentorDirectory({ onSelectMentor }: MentorDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mentors, setMentors] = useState<Mentor[]>([]);

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = () => {
    try {
      const loadedMentors = getMentors();
      
      // Transform to frontend format
      const transformedMentors = loadedMentors.map((m: any) => ({
        id: m.id,
        name: m.name,
        title: m.currentRole || "Mentor",
        expertise: m.expertise || [],
        location: "Remote",
        experience: `${m.yearsExperience || 0}+ years`,
        avatar: m.avatar,
        achievementCount: m.achievements?.length || 0,
        company: m.company,
      }));

      setMentors(transformedMentors);
    } catch (error: any) {
      console.error("Failed to load mentors:", error);
    }
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <Badge className="mb-4 shadow-md" variant="secondary">
            <Sparkles className="w-4 h-4 mr-2" />
            Expert Mentors
          </Badge>
          <h1 className="mb-4 text-4xl md:text-5xl font-bold">Find Your Perfect Mentor</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse our community of expert mentors ready to help you grow
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, title, or expertise..."
              className="pl-12 h-14 text-base shadow-lg border-2 focus:border-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery && (
            <p className="text-center mt-4 text-sm text-muted-foreground">
              Found {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''}
            </p>
          )}
        </motion.div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor, index) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="p-6 h-full hover:shadow-2xl transition-all hover:-translate-y-2 border-2 hover:border-primary/30 group">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-16 h-16 ring-2 ring-primary/30 group-hover:ring-primary transition-all">
                    <AvatarImage src={mentor.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      {mentor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="mb-1 group-hover:text-primary transition-colors">{mentor.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{mentor.title}</p>
                  </div>
                </div>

                <div className="space-y-2.5 mb-5">
                  {mentor.company && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="w-4 h-4 text-primary" />
                      <span className="truncate">{mentor.company}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    {mentor.location} • {mentor.experience}
                  </div>
                  {mentor.achievementCount > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-primary" />
                      <span className="font-medium text-primary">{mentor.achievementCount} Achievement{mentor.achievementCount !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                <div className="mb-5">
                  <p className="text-sm font-medium mb-2.5 text-muted-foreground">Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.slice(0, 4).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="shadow-sm">
                        {skill}
                      </Badge>
                    ))}
                    {mentor.expertise.length > 4 && (
                      <Badge variant="outline" className="border-primary/30">
                        +{mentor.expertise.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                <Button 
                  className="w-full shadow-md hover:shadow-lg transition-all" 
                  onClick={() => onSelectMentor(Number(mentor.id.replace('mentor', '')))}
                >
                  View Profile
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="mb-2">No mentors found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search to find what you're looking for
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}