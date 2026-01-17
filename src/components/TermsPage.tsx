import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { FileText, Users, Shield, AlertCircle, Scale, Ban } from "lucide-react";
import { motion } from "motion/react";

export function TermsPage() {
  const sections = [
    {
      icon: Users,
      title: "Account Terms",
      content: [
        {
          subtitle: "Account Creation",
          text: "You must be at least 18 years old to create an account. You are responsible for maintaining the security of your account and password. Topvoice.lk cannot and will not be liable for any loss or damage from your failure to comply with this security obligation."
        },
        {
          subtitle: "Account Responsibilities",
          text: "You are responsible for all activity that occurs under your account. You must notify us immediately of any unauthorized use of your account. You may not use another user's account without their permission."
        },
        {
          subtitle: "Accurate Information",
          text: "You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete."
        }
      ]
    },
    {
      icon: FileText,
      title: "Acceptable Use",
      content: [
        {
          subtitle: "Platform Usage",
          text: "You agree to use Topvoice.lk only for lawful purposes and in accordance with these Terms. You may not use our platform in any way that violates any applicable local, national, or international law or regulation."
        },
        {
          subtitle: "Professional Conduct",
          text: "As a mentor or mentee, you agree to conduct yourself professionally and respectfully. Harassment, discrimination, or inappropriate behavior will not be tolerated and may result in account termination."
        },
        {
          subtitle: "Content Standards",
          text: "Any content you post, share, or communicate through the platform must not be offensive, defamatory, or infringe upon the rights of others. We reserve the right to remove any content that violates these standards."
        }
      ]
    },
    {
      icon: Ban,
      title: "Prohibited Activities",
      content: [
        {
          subtitle: "Unauthorized Access",
          text: "You may not attempt to gain unauthorized access to any portion of the platform, other users' accounts, or any systems or networks connected to the platform."
        },
        {
          subtitle: "Commercial Use",
          text: "You may not use the platform for unauthorized commercial purposes, including soliciting users for business unrelated to mentorship without our explicit permission."
        },
        {
          subtitle: "Automated Systems",
          text: "You may not use bots, scrapers, or other automated means to access the platform or collect information from it without our prior written permission."
        }
      ]
    },
    {
      icon: Scale,
      title: "Intellectual Property",
      content: [
        {
          subtitle: "Platform Content",
          text: "The platform and its original content, features, and functionality are owned by Topvoice.lk and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws."
        },
        {
          subtitle: "User Content",
          text: "You retain ownership of any content you submit to the platform. However, by posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your content in connection with the platform."
        },
        {
          subtitle: "Trademarks",
          text: "The Topvoice.lk name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of Topvoice.lk. You may not use these marks without our prior written permission."
        }
      ]
    },
    {
      icon: Shield,
      title: "Mentor-Mentee Relationships",
      content: [
        {
          subtitle: "Platform Role",
          text: "Topvoice.lk provides a platform to facilitate connections between mentors and mentees. We are not responsible for the quality, safety, or outcome of these relationships."
        },
        {
          subtitle: "Independent Relationships",
          text: "Relationships between mentors and mentees are independent of Topvoice.lk. We do not employ or engage mentors, nor do we supervise or control their mentorship activities."
        },
        {
          subtitle: "Safety and Reporting",
          text: "While we strive to maintain a safe platform, you are responsible for your own safety. Report any concerning behavior immediately through our reporting system."
        }
      ]
    },
    {
      icon: AlertCircle,
      title: "Limitation of Liability",
      content: [
        {
          subtitle: "Service Availability",
          text: "We strive to maintain continuous platform availability but cannot guarantee uninterrupted access. We are not liable for any losses resulting from service interruptions or technical issues."
        },
        {
          subtitle: "User Interactions",
          text: "We are not liable for any disputes, damages, or losses arising from interactions between users, whether mentors, mentees, or other platform members."
        },
        {
          subtitle: "Third-Party Links",
          text: "Our platform may contain links to third-party websites. We are not responsible for the content, privacy practices, or terms of service of these external sites."
        }
      ]
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
              Terms of Service
            </Badge>
            <h1 className="mb-6">Terms and Conditions</h1>
            <p className="text-lg text-black/80 leading-relaxed">
              Please read these terms carefully before using Topvoice.lk. By accessing or using our 
              platform, you agree to be bound by these terms.
            </p>
            <p className="text-sm text-black/70 mt-4">Last updated: October 4, 2025</p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-8">
            <h2 className="mb-4">Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              These Terms of Service ("Terms") govern your access to and use of Topvoice.lk ("Platform," "we," 
              "us," or "our"), including any content, functionality, and services offered on or through the platform.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              By using the platform, you accept and agree to be bound and abide by these Terms and our Privacy Policy. 
              If you do not want to agree to these Terms or the Privacy Policy, you must not access or use the platform.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes. 
              Your continued use of the platform following such changes constitutes your acceptance of the new Terms.
            </p>
          </Card>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h2 className="mb-2">{section.title}</h2>
                    </div>
                  </div>

                  <div className="space-y-6 ml-16">
                    {section.content.map((item, idx) => (
                      <div key={idx}>
                        <h3 className="mb-2">{item.subtitle}</h3>
                        <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Important Sections */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="p-8">
              <h2 className="mb-4">Termination</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may terminate or suspend your account and access to the platform immediately, without prior 
                notice or liability, for any reason, including if you breach these Terms.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Upon termination, your right to use the platform will immediately cease. If you wish to terminate 
                your account, you may do so by contacting our support team or deleting your account through your 
                account settings.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                All provisions of the Terms which by their nature should survive termination shall survive, including 
                ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </Card>

            <Card className="p-8">
              <h2 className="mb-4">Dispute Resolution</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Any disputes arising out of or relating to these Terms or the platform will be resolved through 
                binding arbitration in accordance with the laws of Sri Lanka, rather than in court.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If arbitration is not feasible, you agree that any legal action will be brought exclusively in the 
                courts located in Colombo, Sri Lanka, and you consent to personal jurisdiction in those courts.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Before filing a claim, you agree to try to resolve the dispute informally by contacting us at 
                legal@topvoice.lk. We will attempt to resolve the dispute informally within 30 days.
              </p>
            </Card>

            <Card className="p-8">
              <h2 className="mb-4">Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance with the laws of Sri Lanka, without 
                regard to its conflict of law provisions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of 
                those rights. If any provision of these Terms is held to be invalid or unenforceable, the remaining 
                provisions will continue in full force and effect.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-black text-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4">Questions About These Terms?</h2>
            <p className="text-lg text-black/80 mb-6 leading-relaxed">
              If you have any questions about our Terms of Service, please contact our legal team.
            </p>
            <div className="space-y-2">
              <p className="text-black/90">
                <strong>Email:</strong> legal@topvoice.lk
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
