// Mock data for the mentorship platform

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "mentor" | "mentee";
  avatar: string;
  createdAt: string;
  // Mentor-specific fields
  expertise?: string[];
  yearsExperience?: string;
  bio?: string;
  currentRole?: string;
  company?: string;
  linkedin?: string;
  github?: string;
  achievements?: Achievement[];
  // Mentee-specific fields
  interests?: string[];
  goals?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: "award" | "certification" | "publication" | "project" | "speaking";
  image?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar: string;
  authorRole: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
}

export interface CareerListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  experience: string;
  salary?: string;
  description: string;
  requirements: string[];
  postedDate: string;
  logo: string;
}

export interface HelpArticle {
  id: string;
  question: string;
  answer: string;
  category: "getting-started" | "mentorship" | "sessions" | "account" | "technical";
}

// Mock Mentors
export const mockMentors: User[] = [
  {
    id: "mentor1",
    email: "mentor@test.com",
    password: "password123",
    name: "Sarah Johnson",
    role: "mentor",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    expertise: ["React", "Node.js", "System Design", "Leadership"],
    yearsExperience: "8",
    bio: "Senior Software Engineer passionate about helping developers grow. I've worked at top tech companies and love sharing my knowledge about full-stack development and career growth.",
    currentRole: "Senior Software Engineer",
    company: "TechCorp",
    linkedin: "https://linkedin.com/in/sarahjohnson",
    github: "https://github.com/sarahjohnson",
    createdAt: new Date().toISOString(),
    achievements: [
      {
        id: "ach1",
        title: "AWS Certified Solutions Architect",
        description: "Professional level certification in cloud architecture",
        date: "2024-03-15",
        category: "certification",
      },
      {
        id: "ach2",
        title: "Best Speaker Award - DevCon 2024",
        description: "Recognized for outstanding presentation on microservices architecture",
        date: "2024-06-20",
        category: "award",
      },
      {
        id: "ach3",
        title: "Published: Modern React Patterns",
        description: "Technical article featured in JavaScript Weekly with 50k+ views",
        date: "2024-01-10",
        category: "publication",
      },
    ],
  },
  {
    id: "mentor2",
    email: "michael.chen@test.com",
    password: "password123",
    name: "Michael Chen",
    role: "mentor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    expertise: ["System Design", "Architecture", "Scalability", "Python"],
    yearsExperience: "12",
    bio: "Tech Lead with over a decade of experience in building scalable systems. Specialized in distributed systems and cloud architecture.",
    currentRole: "Senior Software Architect",
    company: "CloudScale Inc",
    linkedin: "https://linkedin.com/in/michaelchen",
    github: "https://github.com/mchen",
    createdAt: new Date().toISOString(),
    achievements: [
      {
        id: "ach4",
        title: "Led Migration to Microservices",
        description: "Successfully migrated monolithic application serving 10M users to microservices architecture",
        date: "2023-11-05",
        category: "project",
      },
      {
        id: "ach5",
        title: "Google Cloud Professional Architect",
        description: "Expert level certification in GCP architecture",
        date: "2024-02-28",
        category: "certification",
      },
    ],
  },
  {
    id: "mentor3",
    email: "david.kim@test.com",
    password: "password123",
    name: "David Kim",
    role: "mentor",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    expertise: ["Docker", "Kubernetes", "DevOps", "CI/CD", "AWS"],
    yearsExperience: "10",
    bio: "DevOps Lead helping teams streamline their deployment processes. Expert in containerization and cloud infrastructure.",
    currentRole: "DevOps Lead",
    company: "InfraCloud",
    linkedin: "https://linkedin.com/in/davidkim",
    createdAt: new Date().toISOString(),
    achievements: [
      {
        id: "ach6",
        title: "Kubernetes Certified Administrator",
        description: "CKA certification demonstrating Kubernetes expertise",
        date: "2023-09-12",
        category: "certification",
      },
      {
        id: "ach7",
        title: "DevOps Excellence Award",
        description: "Company-wide recognition for reducing deployment time by 75%",
        date: "2024-04-18",
        category: "award",
      },
    ],
  },
  {
    id: "mentor4",
    email: "emily.rodriguez@test.com",
    password: "password123",
    name: "Emily Rodriguez",
    role: "mentor",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    expertise: ["Product Management", "Leadership", "Strategy", "Agile"],
    yearsExperience: "15",
    bio: "VP of Engineering with extensive experience in product development and team leadership. Passionate about building great products and teams.",
    currentRole: "VP of Engineering",
    company: "TechCorp Inc",
    linkedin: "https://linkedin.com/in/emilyrodriguez",
    createdAt: new Date().toISOString(),
    achievements: [
      {
        id: "ach8",
        title: "Product Leader of the Year",
        description: "Industry recognition for innovative product strategy",
        date: "2024-05-22",
        category: "award",
      },
      {
        id: "ach9",
        title: "Speaker at ProdCon 2024",
        description: "Keynote on Building High-Performance Engineering Teams",
        date: "2024-07-15",
        category: "speaking",
      },
    ],
  },
  {
    id: "mentor5",
    email: "alex.thompson@test.com",
    password: "password123",
    name: "Alex Thompson",
    role: "mentor",
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop",
    expertise: ["Machine Learning", "Python", "Data Science", "AI"],
    yearsExperience: "7",
    bio: "ML Engineer passionate about making AI accessible. I help developers transition into machine learning roles.",
    currentRole: "Senior ML Engineer",
    company: "DataMinds AI",
    linkedin: "https://linkedin.com/in/alexthompson",
    github: "https://github.com/athompson",
    createdAt: new Date().toISOString(),
    achievements: [
      {
        id: "ach10",
        title: "TensorFlow Developer Certificate",
        description: "Google's official TensorFlow certification",
        date: "2023-12-01",
        category: "certification",
      },
      {
        id: "ach11",
        title: "Published ML Research Paper",
        description: "Co-authored paper on efficient model training, cited 200+ times",
        date: "2024-03-08",
        category: "publication",
      },
    ],
  },
  {
    id: "mentor6",
    email: "jessica.lee@test.com",
    password: "password123",
    name: "Jessica Lee",
    role: "mentor",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
    expertise: ["Mobile Development", "React Native", "iOS", "Android"],
    yearsExperience: "9",
    bio: "Mobile architect with experience building apps for millions of users. Love helping developers master cross-platform development.",
    currentRole: "Mobile Architect",
    company: "AppVentures",
    linkedin: "https://linkedin.com/in/jessicalee",
    createdAt: new Date().toISOString(),
    achievements: [
      {
        id: "ach12",
        title: "Top Mobile Dev Award",
        description: "Recognition for app with 5M+ downloads and 4.8★ rating",
        date: "2024-02-14",
        category: "award",
      },
    ],
  },
];

// Mock Mentees
export const mockMentees: User[] = [
  {
    id: "mentee1",
    email: "student@test.com",
    password: "password123",
    name: "John Smith",
    role: "mentee",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    interests: ["Web Development", "Mobile Apps", "Cloud Computing"],
    currentRole: "Junior Developer",
    goals: "Become a full-stack developer and eventually lead a development team",
    createdAt: new Date().toISOString(),
  },
  {
    id: "mentee2",
    email: "maria.garcia@test.com",
    password: "password123",
    name: "Maria Garcia",
    role: "mentee",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
    interests: ["Data Science", "Machine Learning", "Python"],
    currentRole: "Data Analyst",
    goals: "Transition into a Machine Learning Engineer role",
    createdAt: new Date().toISOString(),
  },
  {
    id: "mentee3",
    email: "james.wilson@test.com",
    password: "password123",
    name: "James Wilson",
    role: "mentee",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
    interests: ["DevOps", "Cloud Infrastructure", "Automation"],
    currentRole: "IT Operations",
    goals: "Become a DevOps engineer and work with Kubernetes",
    createdAt: new Date().toISOString(),
  },
  {
    id: "mentee4",
    email: "sophia.chen@test.com",
    password: "password123",
    name: "Sophia Chen",
    role: "mentee",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop",
    interests: ["UI/UX", "Frontend Development", "Design Systems"],
    currentRole: "Frontend Developer Intern",
    goals: "Master React and become a senior frontend engineer",
    createdAt: new Date().toISOString(),
  },
];

// Mock Blog Posts
export const mockBlogPosts: BlogPost[] = [
  {
    id: "blog1",
    title: "10 System Design Principles Every Developer Should Know",
    excerpt: "Learn the fundamental principles that will help you design scalable and maintainable systems.",
    content: "System design is a crucial skill for any software engineer...",
    author: "Michael Chen",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    authorRole: "Senior Software Architect",
    date: "2025-10-01",
    readTime: "8 min read",
    category: "System Design",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    tags: ["System Design", "Architecture", "Best Practices"],
  },
  {
    id: "blog2",
    title: "From Junior to Senior: My 5-Year Journey",
    excerpt: "Lessons learned and mistakes made on the path to becoming a senior engineer.",
    content: "Five years ago, I started my journey as a junior developer...",
    author: "Sarah Johnson",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    authorRole: "Senior Software Engineer",
    date: "2025-09-28",
    readTime: "10 min read",
    category: "Career",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop",
    tags: ["Career Growth", "Personal Development", "Learning"],
  },
  {
    id: "blog3",
    title: "Kubernetes in Production: What They Don't Tell You",
    excerpt: "Real-world challenges and solutions for running Kubernetes at scale.",
    content: "After running Kubernetes in production for three years...",
    author: "David Kim",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    authorRole: "DevOps Lead",
    date: "2025-09-25",
    readTime: "12 min read",
    category: "DevOps",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop",
    tags: ["Kubernetes", "DevOps", "Cloud Native"],
  },
  {
    id: "blog4",
    title: "Building Your First Machine Learning Model: A Practical Guide",
    excerpt: "Step-by-step tutorial for beginners entering the world of ML.",
    content: "Machine learning can seem intimidating at first...",
    author: "Alex Thompson",
    authorAvatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop",
    authorRole: "Senior ML Engineer",
    date: "2025-09-20",
    readTime: "15 min read",
    category: "Machine Learning",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
    tags: ["Machine Learning", "Python", "Tutorial"],
  },
  {
    id: "blog5",
    title: "The Art of Code Review: Best Practices for Teams",
    excerpt: "How to conduct effective code reviews that improve code quality and team collaboration.",
    content: "Code reviews are one of the most valuable practices...",
    author: "Emily Rodriguez",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    authorRole: "VP of Engineering",
    date: "2025-09-15",
    readTime: "7 min read",
    category: "Engineering Culture",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
    tags: ["Code Review", "Best Practices", "Team Collaboration"],
  },
];

// Mock Career Listings
export const mockCareerListings: CareerListing[] = [
  {
    id: "career1",
    title: "Senior Full Stack Engineer",
    company: "TechCorp",
    location: "San Francisco, CA (Hybrid)",
    type: "full-time",
    experience: "5+ years",
    salary: "$150k - $200k",
    description: "We're looking for an experienced full stack engineer to join our growing team. You'll work on cutting-edge projects using React, Node.js, and cloud technologies.",
    requirements: [
      "5+ years of experience with React and Node.js",
      "Strong understanding of system design principles",
      "Experience with AWS or similar cloud platforms",
      "Excellent communication skills",
    ],
    postedDate: "2025-10-03",
    logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop",
  },
  {
    id: "career2",
    title: "DevOps Engineer",
    company: "CloudScale Inc",
    location: "Remote",
    type: "full-time",
    experience: "3-5 years",
    salary: "$120k - $160k",
    description: "Join our DevOps team to build and maintain scalable infrastructure. You'll work with Kubernetes, Terraform, and modern CI/CD tools.",
    requirements: [
      "Experience with Kubernetes and Docker",
      "Proficiency in at least one scripting language (Python, Bash)",
      "Knowledge of Infrastructure as Code (Terraform, CloudFormation)",
      "Strong problem-solving skills",
    ],
    postedDate: "2025-10-02",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
  },
  {
    id: "career3",
    title: "Machine Learning Engineer",
    company: "DataMinds AI",
    location: "New York, NY",
    type: "full-time",
    experience: "4+ years",
    salary: "$140k - $180k",
    description: "Build and deploy ML models at scale. Work with a team of data scientists and engineers on cutting-edge AI applications.",
    requirements: [
      "4+ years of experience in machine learning",
      "Strong Python skills and ML frameworks (TensorFlow, PyTorch)",
      "Experience with MLOps and model deployment",
      "PhD or Master's in CS, Math, or related field preferred",
    ],
    postedDate: "2025-09-30",
    logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop",
  },
  {
    id: "career4",
    title: "Frontend Developer Internship",
    company: "AppVentures",
    location: "Austin, TX (On-site)",
    type: "internship",
    experience: "Entry Level",
    salary: "$25/hour",
    description: "Summer internship opportunity for aspiring frontend developers. Learn from experienced engineers and work on real projects.",
    requirements: [
      "Currently pursuing degree in Computer Science or related field",
      "Basic knowledge of React or similar frameworks",
      "Strong desire to learn and grow",
      "Good communication skills",
    ],
    postedDate: "2025-09-28",
    logo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop",
  },
  {
    id: "career5",
    title: "Product Manager - Platform",
    company: "InfraCloud",
    location: "Seattle, WA (Hybrid)",
    type: "full-time",
    experience: "6+ years",
    salary: "$160k - $210k",
    description: "Lead product strategy for our developer platform. Work closely with engineering, design, and customers to build amazing products.",
    requirements: [
      "6+ years of product management experience",
      "Technical background with understanding of software development",
      "Excellent stakeholder management skills",
      "Experience with B2B/developer products preferred",
    ],
    postedDate: "2025-09-25",
    logo: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=100&h=100&fit=crop",
  },
];

// Mock Help Articles
export const mockHelpArticles: HelpArticle[] = [
  {
    id: "help1",
    question: "How do I create an account?",
    answer: "Click the 'Login / Sign Up' button in the header, then select whether you want to join as a mentor or mentee. Fill in your details and you're ready to go!",
    category: "getting-started",
  },
  {
    id: "help2",
    question: "What's the difference between a mentor and a mentee?",
    answer: "Mentors are experienced professionals who offer guidance and share their knowledge. Mentees are those seeking to learn and grow in their careers. You can sign up as either role based on your goals.",
    category: "getting-started",
  },
  {
    id: "help3",
    question: "How do I join a tech session?",
    answer: "Browse the Sessions page, find a session you're interested in, and click 'Request to Join'. The mentor will review your request and approve or decline it. Once approved, you'll receive the joining details.",
    category: "sessions",
  },
  {
    id: "help4",
    question: "Can I create sessions with multiple speakers?",
    answer: "Yes! As a mentor, when creating a session in your dashboard, you can add multiple speakers. This is perfect for panel discussions or company-sponsored tech talks.",
    category: "sessions",
  },
  {
    id: "help5",
    question: "How do I find the right mentor?",
    answer: "Visit the Mentors page and use the search and filter options to find mentors based on their expertise, experience level, and the technologies they specialize in.",
    category: "mentorship",
  },
  {
    id: "help6",
    question: "How do I update my profile?",
    answer: "Mentors can update their profile, add achievements, and manage sessions through the Dashboard. Click on 'My Dashboard' in the header after logging in.",
    category: "account",
  },
  {
    id: "help7",
    question: "What happens after I request to join a session?",
    answer: "The session creator (mentor) will receive your request in their dashboard. They can accept or reject it. You'll be notified of their decision, and if accepted, you'll get the session details.",
    category: "sessions",
  },
  {
    id: "help8",
    question: "Can I cancel my session request?",
    answer: "Currently, you cannot cancel a pending request directly. However, you can contact the mentor or wait for them to respond to your request.",
    category: "sessions",
  },
  {
    id: "help9",
    question: "Is Topvoice.lk free to use?",
    answer: "Yes! Topvoice.lk is completely free for both mentors and mentees. We believe in making mentorship accessible to everyone.",
    category: "getting-started",
  },
  {
    id: "help10",
    question: "How do I reset my password?",
    answer: "This is a demo application using localStorage. In a production environment, you would have a 'Forgot Password' link on the login page. For testing, use the demo accounts: mentor@test.com or student@test.com with password 'password123'.",
    category: "account",
  },
];

// Initialize mock data in localStorage
export const initializeMockData = () => {
  try {
    // Check if already initialized
    const isInitialized = localStorage.getItem("mockDataInitialized");
    
    if (!isInitialized) {
      // Combine all users
      const allUsers = [...mockMentors, ...mockMentees];
      localStorage.setItem("registeredUsers", JSON.stringify(allUsers));
      
      // Store blog posts
      localStorage.setItem("blogPosts", JSON.stringify(mockBlogPosts));
      
      // Store career listings
      localStorage.setItem("careerListings", JSON.stringify(mockCareerListings));
      
      // Store help articles
      localStorage.setItem("helpArticles", JSON.stringify(mockHelpArticles));
      
      // Mark as initialized
      localStorage.setItem("mockDataInitialized", "true");
      
      console.log("Mock data initialized successfully");
    }
  } catch (error) {
    console.error("Error initializing mock data:", error);
  }
};

// Get all mentors from localStorage
export const getMentors = (): User[] => {
  try {
    const users = localStorage.getItem("registeredUsers");
    if (users) {
      const allUsers: User[] = JSON.parse(users);
      return allUsers.filter(user => user.role === "mentor");
    }
    return mockMentors;
  } catch (error) {
    console.error("Error getting mentors:", error);
    return mockMentors;
  }
};

// Get all blog posts from localStorage
export const getBlogPosts = (): BlogPost[] => {
  try {
    const posts = localStorage.getItem("blogPosts");
    return posts ? JSON.parse(posts) : mockBlogPosts;
  } catch (error) {
    console.error("Error getting blog posts:", error);
    return mockBlogPosts;
  }
};

// Get all career listings from localStorage
export const getCareerListings = (): CareerListing[] => {
  try {
    const listings = localStorage.getItem("careerListings");
    return listings ? JSON.parse(listings) : mockCareerListings;
  } catch (error) {
    console.error("Error getting career listings:", error);
    return mockCareerListings;
  }
};

// Get all help articles from localStorage
export const getHelpArticles = (): HelpArticle[] => {
  try {
    const articles = localStorage.getItem("helpArticles");
    return articles ? JSON.parse(articles) : mockHelpArticles;
  } catch (error) {
    console.error("Error getting help articles:", error);
    return mockHelpArticles;
  }
};
