import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Mail, MapPin, Phone, MessageSquare, Send } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    // Mock submission
    toast.success("Message sent successfully!", {
      description: "We'll get back to you within 24 hours"
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "support@topvoice.lk",
      link: "mailto:support@topvoice.lk"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+94 11 234 5678",
      link: "tel:+94112345678"
    },
    {
      icon: MapPin,
      title: "Office",
      content: "123 Galle Road, Colombo 03, Sri Lanka",
      link: "#"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      content: "Available Mon-Fri, 9AM-6PM",
      link: "#"
    }
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
              Contact Us
            </Badge>
            <h1 className="mb-6">Get in Touch</h1>
            <p className="text-lg text-black/80 leading-relaxed">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-yellow-400/50">
                  <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-7 h-7 text-black" />
                  </div>
                  <h3 className="mb-2">{info.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{info.content}</p>
                  {info.link !== "#" && (
                    <a 
                      href={info.link}
                      className="text-sm text-yellow-600 dark:text-yellow-400 hover:underline"
                    >
                      Contact
                    </a>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <Badge className="mb-4" variant="outline">Send a Message</Badge>
              <h2 className="mb-4">We're Here to Help</h2>
              <p className="text-muted-foreground">
                Fill out the form below and our team will get back to you within 24 hours
              </p>
            </motion.div>

            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="What is this regarding?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full gap-2">
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="outline">Quick Answers</Badge>
              <h2 className="mb-4">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "How quickly will I get a response?",
                  answer: "Our team typically responds within 24 hours during business days (Monday-Friday). For urgent matters, please call our office directly."
                },
                {
                  question: "Do you offer phone support?",
                  answer: "Yes! Our phone support is available Monday through Friday, 9AM-6PM (Sri Lanka time). Call us at +94 11 234 5678."
                },
                {
                  question: "Can I visit your office?",
                  answer: "Absolutely! Our office is located at 123 Galle Road, Colombo 03. We recommend calling ahead to schedule a meeting."
                },
                {
                  question: "How do I report a technical issue?",
                  answer: "For technical issues, please email support@topvoice.lk with a detailed description of the problem and any screenshots if applicable."
                }
              ].map((faq, index) => (
                <Card key={index} className="p-6">
                  <h3 className="mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-4" variant="outline">Find Us</Badge>
              <h2 className="mb-4">Our Location</h2>
            </div>

            <Card className="overflow-hidden">
              <div className="bg-muted/50 h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">123 Galle Road, Colombo 03, Sri Lanka</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
