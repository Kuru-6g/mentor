import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Cookie, Shield, Eye, Settings } from "lucide-react";
import { motion } from "motion/react";

export function CookiePage() {
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
              <Cookie className="w-4 h-4 mr-2" />
              Cookie Policy
            </Badge>
            <h1 className="mb-6">Our Cookie Policy</h1>
            <p className="text-lg text-black/80 leading-relaxed">
              Learn about how we use cookies and similar technologies to provide and improve our services.
            </p>
            <p className="text-sm text-black/70 mt-4">Last updated: October 4, 2025</p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-8">
            <h2 className="mb-4">What Are Cookies?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cookies are small text files that are placed on your device when you visit our website. They help us 
              provide you with a better experience by remembering your preferences, understanding how you use our 
              platform, and improving our services.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We use both session cookies (which expire when you close your browser) and persistent cookies 
              (which remain on your device for a set period or until you delete them).
            </p>
          </Card>
        </div>
      </section>

      {/* Types of Cookies */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="outline">Cookie Categories</Badge>
              <h2 className="mb-4">Types of Cookies We Use</h2>
            </div>

            <div className="space-y-8">
              {/* Essential Cookies */}
              <Card className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="mb-2">Essential Cookies</h3>
                    <Badge variant="outline" className="mb-4">Required</Badge>
                  </div>
                </div>
                
                <div className="ml-16">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    These cookies are necessary for the website to function properly. They enable core functionality 
                    such as security, network management, and accessibility. You cannot opt out of these cookies.
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm">Examples:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Authentication cookies that keep you logged in</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Security cookies that protect against malicious activity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Session cookies that remember your preferences during your visit</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Analytics Cookies */}
              <Card className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="mb-2">Analytics Cookies</h3>
                    <Badge variant="secondary" className="mb-4">Optional</Badge>
                  </div>
                </div>
                
                <div className="ml-16">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    These cookies help us understand how visitors interact with our website by collecting and 
                    reporting information anonymously. This helps us improve the user experience.
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm">Examples:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Google Analytics cookies that track page visits and user behavior</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Performance cookies that measure page load times</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Error tracking cookies that help us identify and fix issues</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Functional Cookies */}
              <Card className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Settings className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="mb-2">Functional Cookies</h3>
                    <Badge variant="secondary" className="mb-4">Optional</Badge>
                  </div>
                </div>
                
                <div className="ml-16">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    These cookies enable enhanced functionality and personalization, such as remembering your 
                    preferences and settings. They may be set by us or by third-party providers.
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm">Examples:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Cookies that remember your language and region preferences</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Cookies that save your notification settings</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Video player cookies that remember playback preferences</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Managing Cookies */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <h2 className="mb-4">Managing Your Cookie Preferences</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie 
                preferences by adjusting your browser settings or using our cookie management tool.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="mb-2">Browser Settings</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Most browsers allow you to control cookies through their settings. You can typically find 
                    these settings in the "Options" or "Preferences" menu of your browser. Please note that 
                    blocking certain cookies may impact your experience on our website.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2">Cookie Management Tool</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    You can manage your cookie preferences directly on our website using the cookie banner 
                    that appears on your first visit or by accessing our cookie settings.
                  </p>
                  <Button>Manage Cookie Preferences</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Third-Party Cookies */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <h2 className="mb-4">Third-Party Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In addition to our own cookies, we may also use various third-party cookies to report usage 
                statistics of the platform and deliver advertisements on and through the platform.
              </p>
              
              <div className="space-y-3">
                <h3 className="mb-2">Third-Party Services We Use:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Google Analytics:</strong> To understand how users interact with our platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Social Media Platforms:</strong> For social sharing features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Video Hosting Services:</strong> To embed video content</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-black text-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Cookie className="w-12 h-12 mx-auto mb-4" />
            <h2 className="mb-4">Questions About Cookies?</h2>
            <p className="text-lg text-black/80 mb-6 leading-relaxed">
              If you have any questions about our use of cookies, please contact us.
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
