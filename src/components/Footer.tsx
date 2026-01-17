import { Github, Linkedin, Twitter, Mail, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: "Find Mentors", page: "mentors" },
      { label: "Tech Sessions", page: "sessions" },
      { label: "Become a Mentor", page: "dashboard" },
    ],
    company: [
      { label: "About Us", page: "about" },
      { label: "Contact", page: "contact" },
      { label: "Careers", page: "careers" },
    ],
    resources: [
      { label: "Blog", page: "blog" },
      { label: "Help Center", page: "help" },
      { label: "Community", page: "community" },
    ],
    legal: [
      { label: "Privacy Policy", page: "privacy" },
      { label: "Terms of Service", page: "terms" },
      { label: "Cookie Policy", page: "cookies" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
  ];

  return (
    <footer className="bg-black text-white border-t border-yellow-400/20">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <h3 className="mb-4 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                Topvoice.lk
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Empowering professionals through meaningful mentorship connections and expert-led tech sessions.
              </p>
              
              {/* Newsletter Signup */}
              <div className="space-y-3">
                <p className="text-sm text-gray-300">Stay updated with our newsletter</p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-yellow-400"
                  />
                  <Button 
                    className="bg-yellow-400 text-black hover:bg-yellow-500 flex-shrink-0"
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="mb-4 text-yellow-400">Platform</h4>
              <ul className="space-y-3">
                {footerLinks.platform.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => onNavigate?.(link.page)}
                      className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="mb-4 text-yellow-400">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => onNavigate?.(link.page)}
                      className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="mb-4 text-yellow-400">Resources</h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => onNavigate?.(link.page)}
                      className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="mb-4 text-yellow-400">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => onNavigate?.(link.page)}
                      className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <p>© {currentYear} Topvoice.lk. All rights reserved.</p>
              <span className="hidden md:inline">•</span>
              <p className="flex items-center gap-1">
                Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for the tech community
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 mr-2">Follow us:</span>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-yellow-400/20 flex items-center justify-center transition-colors group"
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Top Border */}
      <div className="h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"></div>
    </footer>
  );
}
