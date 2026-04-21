import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Shield, Eye, FileText, UserCheck } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <SeoHead 
        title="Privacy Policy"
        description="Learn how RentMyGadgets collects, uses, and protects your personal information. Understand your privacy rights under CCPA and how to exercise them."
        keywords="privacy policy, data protection, CCPA, personal information, data rights, privacy, consumer rights"
      />
      <section className="py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-6">
            <BackButton />
          </div>
          <h1 className="text-4xl font-heading font-bold text-center mb-4">Privacy Policy</h1>
          <p className="text-center text-muted-foreground">Last Updated: November 28, 2025</p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4 max-w-4xl">
        <Card>
          <CardContent className="p-8 space-y-8">
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="bg-primary/10 p-4 rounded-lg">
                <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold text-sm">Data Protection</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <Eye className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold text-sm">Transparency</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <UserCheck className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold text-sm">Your Rights</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold text-sm">Compliance</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground">
                RentMyGadgets ("Company," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our mobile applications, or engage with our services. Please read this policy carefully to understand our practices regarding your personal data.
              </p>
              <p className="text-muted-foreground mt-4">
                By using our Services, you consent to the practices described in this Privacy Policy. If you do not agree with this policy, please do not use our Services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">2. Categories of Personal Information We Collect</h2>
              <p className="text-muted-foreground mb-4">
                In the past 12 months, we have collected the following categories of personal information:
              </p>
              
              <h3 className="text-xl font-semibold mb-2">A. Identifiers</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
                <li>Name (first and last)</li>
                <li>Email address</li>
                <li>Postal address (billing and shipping)</li>
                <li>Phone number</li>
                <li>Account username and password</li>
                <li>IP address</li>
                <li>Device identifiers</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2">B. Commercial Information</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
                <li>Products rented or purchased</li>
                <li>Rental history and preferences</li>
                <li>Payment information (processed securely; we do not store full card numbers)</li>
                <li>Transaction history</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2">C. Internet or Network Activity</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
                <li>Browsing history on our website</li>
                <li>Search queries on our platform</li>
                <li>Interactions with our advertisements</li>
                <li>Information about the device and browser used</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2">D. Geolocation Data</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
                <li>General location based on IP address</li>
                <li>Precise location (only with your explicit consent for delivery purposes)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2">E. Inferences</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Preferences and interests based on browsing behavior</li>
                <li>Product recommendations</li>
                <li>Customer profiles for personalization</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">3. Sources of Personal Information</h2>
              <p className="text-muted-foreground mb-4">We collect personal information from:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Directly from you:</strong> When you create an account, place an order, contact customer support, or subscribe to our newsletter</li>
                <li><strong>Automatically:</strong> Through cookies, pixels, and similar technologies when you use our website</li>
                <li><strong>Third-party sources:</strong> Payment processors, shipping carriers, marketing partners, and analytics providers</li>
                <li><strong>Publicly available sources:</strong> Public databases, social media platforms (when you choose to link accounts)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">4. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We use your personal information for the following purposes:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Order Fulfillment:</strong> Processing rentals, payments, and deliveries</li>
                <li><strong>Customer Service:</strong> Responding to inquiries, troubleshooting, and providing support</li>
                <li><strong>Account Management:</strong> Creating and managing your account, authentication</li>
                <li><strong>Communications:</strong> Sending order confirmations, rental reminders, and service updates</li>
                <li><strong>Marketing:</strong> Sending promotional offers (with your consent or as permitted by law)</li>
                <li><strong>Personalization:</strong> Customizing your experience and product recommendations</li>
                <li><strong>Analytics:</strong> Understanding usage patterns to improve our services</li>
                <li><strong>Security:</strong> Fraud prevention, protecting our systems and users</li>
                <li><strong>Legal Compliance:</strong> Meeting legal obligations and enforcing our terms</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">5. Disclosure of Personal Information</h2>
              <p className="text-muted-foreground mb-4">We may share your personal information with:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Service Providers:</strong> Payment processors, shipping carriers, cloud hosting providers, customer support platforms, and email services</li>
                <li><strong>Business Partners:</strong> Marketing and advertising partners (for remarketing campaigns)</li>
                <li><strong>Legal Requirements:</strong> Law enforcement, government agencies, or other parties when required by law</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> Other third parties when you explicitly consent to such sharing</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                <strong>We do not sell your personal information for monetary consideration.</strong>
              </p>
            </div>

            <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg">
              <h2 className="text-2xl font-heading font-bold mb-4">6. Your Privacy Rights (CCPA/CPRA)</h2>
              <p className="text-muted-foreground mb-4">
                If you are a California resident, you have the following rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Right to Know</h3>
                  <p className="text-sm text-muted-foreground">You have the right to request information about the categories and specific pieces of personal information we have collected about you.</p>
                </div>
                <div>
                  <h3 className="font-semibold">Right to Delete</h3>
                  <p className="text-sm text-muted-foreground">You have the right to request deletion of your personal information, subject to certain exceptions.</p>
                </div>
                <div>
                  <h3 className="font-semibold">Right to Correct</h3>
                  <p className="text-sm text-muted-foreground">You have the right to request that we correct inaccurate personal information.</p>
                </div>
                <div>
                  <h3 className="font-semibold">Right to Opt-Out</h3>
                  <p className="text-sm text-muted-foreground">You have the right to opt-out of the "sale" or "sharing" of your personal information for cross-context behavioral advertising.</p>
                </div>
                <div>
                  <h3 className="font-semibold">Right to Limit Use of Sensitive Information</h3>
                  <p className="text-sm text-muted-foreground">You have the right to limit how we use sensitive personal information.</p>
                </div>
                <div>
                  <h3 className="font-semibold">Right to Non-Discrimination</h3>
                  <p className="text-sm text-muted-foreground">We will not discriminate against you for exercising any of your privacy rights.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">7. How to Exercise Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                You may submit a request to exercise your rights through the following methods:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Online Form:</strong> Complete the Privacy Request Form in your account dashboard</li>
                <li><strong>Email:</strong> Send a request to privacy@rentmygadgets.com</li>
                <li><strong>Dashboard:</strong> Contact us through your account dashboard and select privacy options</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                We will respond to verifiable consumer requests within 45 days. If we need more time, we will notify you of the reason and extension period (up to 90 days total).
              </p>
              <p className="text-muted-foreground mt-4">
                To verify your identity, we may ask you to confirm information associated with your account or provide additional documentation.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg">
              <h2 className="text-2xl font-heading font-bold mb-4">8. Do Not Sell or Share My Personal Information</h2>
              <p className="text-muted-foreground mb-4">
                We respect your right to opt-out of the sale or sharing of your personal information. While we do not sell personal information for monetary compensation, some of our advertising practices may be considered "sharing" under California law.
              </p>
              <p className="text-muted-foreground mb-4">
                To opt-out, you may:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Click the <Link href="/do-not-sell" className="text-primary underline">"Do Not Sell or Share My Personal Information"</Link> link</li>
                <li>Enable Global Privacy Control (GPC) in your browser - we honor these signals</li>
                <li>Contact us directly via the methods listed above</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">9. Data Retention</h2>
              <p className="text-muted-foreground mb-4">
                We retain your personal information for as long as necessary to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide our services to you</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes</li>
                <li>Enforce our agreements</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Typically, we retain account information for 5 years after account closure and transaction records for 7 years for tax and legal purposes. Browsing data and cookies are retained for up to 24 months.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">10. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational security measures to protect your personal information, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>SSL/TLS encryption for data in transit</li>
                <li>Encryption of sensitive data at rest</li>
                <li>Regular security assessments and penetration testing</li>
                <li>Employee training on data protection</li>
                <li>Access controls and authentication measures</li>
                <li>PCI-DSS compliance for payment processing</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                While we strive to protect your information, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">11. Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar technologies to enhance your experience. For detailed information about our use of cookies and how to manage your preferences, please see our <Link href="/cookies" className="text-primary underline">Cookie Policy</Link>.
              </p>
              <p className="text-muted-foreground mb-4">
                With your consent, we use the following third-party tracking and analytics services:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li><strong>Google Analytics (GA4)</strong> — to analyze website traffic and understand how visitors use our site.</li>
                <li><strong>Microsoft Advertising (Bing Ads) Universal Event Tracking (UET)</strong> — to measure the effectiveness of our advertising campaigns on Microsoft Bing and partner networks.</li>
              </ul>
              <p className="text-muted-foreground">
                These services may collect information about your browsing activity using cookies and similar technologies. Both services operate under their respective privacy policies. We support Google Consent Mode v2 and honor your consent choices before loading any tracking scripts. You can manage your tracking preferences through our cookie consent banner or opt out entirely on our <Link href="/do-not-sell" className="text-primary underline">Do Not Sell or Share</Link> page.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">12. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our Services are not intended for individuals under 16 years of age. We do not knowingly collect personal information from children under 16. If we learn we have collected information from a child under 16, we will delete it promptly. If you believe we have collected information from a child under 16, please contact us immediately.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">13. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page and updating the "Last Updated" date. For significant changes, we may also send you an email notification. We encourage you to review this policy periodically.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">14. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy or wish to exercise your rights:
              </p>
              <div className="mt-4 text-muted-foreground">
                <p><strong>RentMyGadgets Privacy Team</strong></p>
                <p>Email: privacy@rentmygadgets.com</p>
                <p>Contact us through your account dashboard</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}
