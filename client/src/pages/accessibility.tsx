import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Card, CardContent } from "@/components/ui/card";
import { Accessibility, Eye, Keyboard, Volume2, Monitor, MessageSquare } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function AccessibilityStatement() {
  return (
    <Layout>
      <SeoHead 
        title="Accessibility Statement"
        description="RentMyGadgets is committed to ensuring digital accessibility for people with disabilities. Learn about our accessibility standards, features, and how to request accommodations."
        keywords="accessibility, ADA compliance, WCAG, screen reader, assistive technology, accessible website"
      />
      <section className="py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-6">
            <BackButton />
          </div>
          <h1 className="text-4xl font-heading font-bold text-center mb-4">Accessibility Statement</h1>
          <p className="text-center text-muted-foreground">Last Updated: November 28, 2025</p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4 max-w-4xl">
        <Card>
          <CardContent className="p-8 space-y-8">
            <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg">
              <div className="flex items-start gap-4">
                <Accessibility className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-heading font-bold mb-2">Our Commitment</h2>
                  <p className="text-muted-foreground">
                    RentMyGadgets is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to guarantee we provide equal access to all users.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">1. Accessibility Standards</h2>
              <p className="text-muted-foreground mb-4">
                We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines help make web content more accessible to people with a wide range of disabilities, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Visual impairments (blindness, low vision, color blindness)</li>
                <li>Hearing impairments (deafness, hearing loss)</li>
                <li>Motor impairments (limited fine motor control, muscle slowness)</li>
                <li>Cognitive impairments (learning disabilities, distractibility, memory issues)</li>
                <li>Seizure disorders (photosensitive epilepsy)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">2. Accessibility Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <Eye className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Visual Accessibility</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>- High contrast color schemes</li>
                      <li>- Scalable text and zoom support</li>
                      <li>- Alt text for all images</li>
                      <li>- Clear visual hierarchy</li>
                      <li>- Focus indicators for navigation</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Keyboard className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Keyboard Accessibility</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>- Full keyboard navigation</li>
                      <li>- Logical tab order</li>
                      <li>- Skip navigation links</li>
                      <li>- No keyboard traps</li>
                      <li>- Accessible dropdown menus</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Volume2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Screen Reader Support</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>- ARIA labels and landmarks</li>
                      <li>- Descriptive link text</li>
                      <li>- Form field labels</li>
                      <li>- Error message announcements</li>
                      <li>- Heading structure</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Monitor className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Content Accessibility</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>- Clear, simple language</li>
                      <li>- Consistent navigation</li>
                      <li>- Predictable page layouts</li>
                      <li>- No auto-playing media</li>
                      <li>- Sufficient time for tasks</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">3. Compatibility with Assistive Technologies</h2>
              <p className="text-muted-foreground mb-4">
                Our website is designed to be compatible with the following assistive technologies:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Screen Readers:</strong> JAWS, NVDA, VoiceOver (macOS/iOS), TalkBack (Android)</li>
                <li><strong>Voice Control:</strong> Dragon NaturallySpeaking, Voice Control (macOS/iOS)</li>
                <li><strong>Magnification Software:</strong> ZoomText, Windows Magnifier, macOS Zoom</li>
                <li><strong>Keyboard-Only Navigation:</strong> Full support for keyboard-only users</li>
                <li><strong>Switch Devices:</strong> Compatible with switch control systems</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">4. Browser Compatibility</h2>
              <p className="text-muted-foreground mb-4">
                Our accessibility features are tested and supported on the following browsers:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Google Chrome (latest 2 versions)</li>
                <li>Mozilla Firefox (latest 2 versions)</li>
                <li>Apple Safari (latest 2 versions)</li>
                <li>Microsoft Edge (latest 2 versions)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">5. Known Limitations</h2>
              <p className="text-muted-foreground mb-4">
                While we strive for full accessibility, some areas may have limitations:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Some older PDF documents may not be fully accessible; we are working to remediate these</li>
                <li>Third-party content or embedded widgets may have varying levels of accessibility</li>
                <li>Some complex interactive features are being enhanced for better screen reader support</li>
                <li>User-generated content (reviews, comments) may not always meet accessibility standards</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                We are actively working to address these limitations and improve accessibility across all areas of our website.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">6. Ongoing Improvements</h2>
              <p className="text-muted-foreground mb-4">
                We are committed to continuous improvement of our accessibility practices:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Regular accessibility audits by internal and external experts</li>
                <li>Automated testing tools integrated into our development process</li>
                <li>User testing with people with disabilities</li>
                <li>Staff training on accessibility best practices</li>
                <li>Monitoring of new accessibility guidelines and technologies</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">7. Alternative Formats</h2>
              <p className="text-muted-foreground mb-4">
                If you need information in an alternative format, we can provide:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Large print documents</li>
                <li>Screen reader-friendly text versions</li>
                <li>Audio descriptions of key content</li>
                <li>Phone assistance for website navigation and ordering</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Please contact us to request any alternative format.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-lg">
              <div className="flex items-start gap-4">
                <MessageSquare className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">8. Feedback & Assistance</h2>
                  <p className="text-muted-foreground mb-4">
                    We welcome your feedback on the accessibility of our website. If you encounter accessibility barriers or need assistance, please contact us:
                  </p>
                  <div className="text-muted-foreground space-y-2">
                    <p><strong>Email:</strong> accessibility@rentmygadgets.com</p>
                    <p><strong>Dashboard:</strong> Contact us through your account dashboard</p>
                    <p><strong>Mail:</strong> Accessibility Coordinator, 123 Tech Plaza, Suite 500, San Francisco, CA 94105</p>
                  </div>
                  <p className="text-muted-foreground mt-4">
                    When contacting us, please include:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>The web page URL where you encountered the issue</li>
                    <li>A description of the accessibility problem</li>
                    <li>The assistive technology you were using (if applicable)</li>
                    <li>Your contact information for follow-up</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    We aim to respond to accessibility feedback within 2 business days.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">9. Formal Complaints</h2>
              <p className="text-muted-foreground">
                If you are not satisfied with our response to your accessibility concern, you may file a complaint with:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>U.S. Department of Justice, Civil Rights Division</li>
                <li>Your state's Attorney General office</li>
                <li>The Federal Communications Commission (FCC) for telecommunications-related issues</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">10. Policy Updates</h2>
              <p className="text-muted-foreground">
                This accessibility statement was last updated on November 28, 2025. We review and update this statement annually or when significant changes are made to our website's accessibility features.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}
