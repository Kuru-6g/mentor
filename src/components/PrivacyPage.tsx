import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Shield, Lock, Eye, Database, UserCheck, FileText } from "lucide-react";
import { motion } from "motion/react";

export function PrivacyPage() {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "When you create an account, we collect your name, email address, profile information, and any additional details you choose to provide such as your professional background, expertise areas, and career goals."
        },
        {
          subtitle: "Usage Information",
          text: "We automatically collect information about how you use our platform, including pages visited, sessions attended, mentors you connect with, and features you interact with."
        },
        {
          subtitle: "Device Information",
          text: "We collect information about the device and browser you use to access Topvoice.lk, including IP address, browser type, and operating system."
        }
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Platform Services",
          text: "We use your information to provide and improve our mentorship platform, facilitate connections between mentors and mentees, and deliver personalized experiences."
        },
        {
          subtitle: "Communication",
          text: "We use your contact information to send you important updates, session reminders, mentor recommendations, and marketing communications (which you can opt out of at any time)."
        },
        {
          subtitle: "Analytics and Improvement",
          text: "We analyze usage patterns to understand how our platform is used, identify areas for improvement, and develop new features that serve our community better."
        }
      ]
    },
    {
      icon: Shield,
      title: "How We Share Your Information",
      content: [
        {
          subtitle: "With Other Users",
          text: "Your profile information is visible to other users of the platform to facilitate meaningful connections. You can control your privacy settings to limit what information is shared."
        },
        {
          subtitle: "Service Providers",
          text: "We share information with trusted third-party service providers who help us operate the platform, such as hosting services, email providers, and analytics tools."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose your information if required by law, court order, or government regulation, or to protect the rights and safety of our users and the public."
        }
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        {
          subtitle: "Security Measures",
          text: "We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits."
        },
        {
          subtitle: "Access Controls",
          text: "We restrict access to personal information to authorized personnel only, and all employees are bound by confidentiality agreements."
        },
        {
          subtitle: "Data Breach Response",
          text: "In the unlikely event of a data breach, we will notify affected users promptly and take immediate steps to mitigate any potential harm."
        }
      ]
    },
    {
      icon: UserCheck,
      title: "Your Rights and Choices",
      content: [
        {
          subtitle: "Access and Update",
          text: "You have the right to access, update, or correct your personal information at any time through your account settings."
        },
        {
          subtitle: "Data Deletion",
          text: "You can request deletion of your account and associated data by contacting our support team. Some information may be retained as required by law."
        },
        {
          subtitle: "Marketing Preferences",
          text: "You can opt out of marketing communications at any time by clicking the unsubscribe link in our emails or updating your notification preferences."
        }
      ]
    },
    {
      icon: FileText,
      title: "Cookies and Tracking",
      content: [
        {
          subtitle: "Essential Cookies",
          text: "We use cookies that are necessary for the platform to function, such as maintaining your login session and remembering your preferences."
        },
        {
          subtitle: "Analytics Cookies",
          text: "We use analytics cookies to understand how users interact with our platform, which helps us improve the user experience."
        },
        {
          subtitle: "Cookie Management",
          text: "You can control cookie settings through your browser preferences. Note that disabling certain cookies may limit platform functionality."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-black py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge className="mb-6 bg-black text-yellow-500 hover:bg-black/90 px-4 py-1 text-sm font-semibold uppercase tracking-wider">
              Privacy & Transparency
            </Badge>
            <h1 className="mb-6 text-4xl md:text-6xl font-extrabold tracking-tight">Your Privacy is Our Priority</h1>
            <p className="text-xl text-black/90 leading-relaxed font-medium">
              At Topvoice.lk, we are committed to safeguarding your personal data with the highest standards of security and transparency.
            </p>
            <p className="text-sm text-black/70 mt-8 font-semibold italic">Last updated: January 27, 2026</p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-10 shadow-xl border-none ring-1 ring-black/5">
            <h2 className="mb-6 text-2xl font-bold">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
              This Privacy Policy details how Topvoice.lk ("we," "us," or "our") manages the collection, usage, and
              confidentiality of your information when you interact with our platform and services.
              By engaging with our platform, you acknowledge and agree to the data practices described herein.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              We operate under the principle of data minimization—collecting only what is necessary to empower your professional journey.
              If you have any inquiries regarding your data, please reach our dedicated privacy team at <a href="mailto:privacy@topvoice.lk" className="text-primary font-semibold hover:underline">privacy@topvoice.lk</a>.
            </p>
          </Card>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-16">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-400/20">
                    <section.icon className="w-8 h-8 text-black" />
                  </div>
                  <div className="flex-1 space-y-8">
                    <div>
                      <h2 className="text-3xl font-bold mb-4 tracking-tight">{section.title}</h2>
                      <div className="h-1.5 w-20 bg-yellow-400 rounded-full"></div>
                    </div>

                    <div className="grid gap-10">
                      {section.content.map((item, idx) => (
                        <div key={idx} className="group">
                          <h3 className="text-xl font-bold mb-3 transition-colors group-hover:text-primary">{item.subtitle}</h3>
                          <p className="text-muted-foreground leading-relaxed text-lg">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {index !== sections.length - 1 && <div className="mt-16 border-b border-muted/50 w-full" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Children's Privacy */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-8">
            <h2 className="mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our Services are not intended for users under the age of 18. We do not knowingly collect
              personal information from children under 18. If you are a parent or guardian and believe
              your child has provided us with personal information, please contact us immediately.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If we become aware that we have collected personal information from a child under 18 without
              verification of parental consent, we will take steps to remove that information from our servers.
            </p>
          </Card>
        </div>
      </section>

      {/* Changes to Policy */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-8">
            <h2 className="mb-4">Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by
              posting the new Privacy Policy on this page and updating the "Last updated" date at the top.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We will also notify you via email or through a prominent notice on our platform if there are
              any material changes that affect how we use your personal information.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this
              Privacy Policy are effective when they are posted on this page.
            </p>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-black text-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4">Questions About Privacy?</h2>
            <p className="text-lg text-black/80 mb-6 leading-relaxed">
              If you have any questions or concerns about our Privacy Policy or how we handle your data,
              please don't hesitate to reach out.
            </p>
            <div className="space-y-2">
              <p className="text-black/90">
                <strong>Email:</strong> privacy@topvoice.lk
              </p>
              <p className="text-black/90">
                <strong>Address:</strong> 123 Galle Road, Colombo 03, Sri Lanka
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
