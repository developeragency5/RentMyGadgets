import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie, Settings, BarChart, Target } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function CookiePolicy() {
  return (
    <Layout>
      <SeoHead 
        title="Cookie Policy"
        description="Learn about how RentMyGadgets uses cookies and similar technologies on our website. Understand what cookies we use and how to manage your preferences."
        keywords="cookie policy, cookies, tracking, web beacons, privacy, browser settings"
      />
      <section className="py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-6">
            <BackButton />
          </div>
          <h1 className="text-4xl font-heading font-bold text-center mb-4">Cookie Policy</h1>
          <p className="text-center text-muted-foreground">Last Updated: November 28, 2025</p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4 max-w-4xl">
        <Card>
          <CardContent className="p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">1. What Are Cookies?</h2>
              <p className="text-muted-foreground">
                Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners information about how their site is being used.
              </p>
              <p className="text-muted-foreground mt-4">
                Cookies may be set by the website you are visiting ("first-party cookies") or by third parties, such as analytics or advertising services ("third-party cookies").
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">2. Types of Cookies We Use</h2>
              <div className="space-y-6">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-primary/10 p-4 flex items-center gap-3">
                    <Settings className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">Essential Cookies</h3>
                      <p className="text-sm text-muted-foreground">Required for basic website functionality</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-muted-foreground mb-4">
                      These cookies are strictly necessary for the website to function. They enable core functionality such as security, network management, and account access. You cannot opt out of these cookies.
                    </p>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Cookie Name</th>
                          <th className="text-left py-2">Purpose</th>
                          <th className="text-left py-2">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr className="border-b">
                          <td className="py-2">session_id</td>
                          <td className="py-2">Maintains your logged-in session</td>
                          <td className="py-2">7 days</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">csrf_token</td>
                          <td className="py-2">Security protection</td>
                          <td className="py-2">Session</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">cart_id</td>
                          <td className="py-2">Remembers your shopping cart</td>
                          <td className="py-2">30 days</td>
                        </tr>
                        <tr>
                          <td className="py-2">cookie_consent</td>
                          <td className="py-2">Records your cookie preferences</td>
                          <td className="py-2">1 year</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-blue-50 p-4 flex items-center gap-3">
                    <Cookie className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">Functional Cookies</h3>
                      <p className="text-sm text-muted-foreground">Enhance your experience</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-muted-foreground mb-4">
                      These cookies allow us to remember choices you make and provide enhanced, personalized features. They may also be used to provide services you have requested.
                    </p>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Cookie Name</th>
                          <th className="text-left py-2">Purpose</th>
                          <th className="text-left py-2">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr className="border-b">
                          <td className="py-2">user_preferences</td>
                          <td className="py-2">Remembers display settings</td>
                          <td className="py-2">1 year</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">recently_viewed</td>
                          <td className="py-2">Shows recently viewed products</td>
                          <td className="py-2">30 days</td>
                        </tr>
                        <tr>
                          <td className="py-2">location</td>
                          <td className="py-2">Remembers your delivery location</td>
                          <td className="py-2">30 days</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-green-50 p-4 flex items-center gap-3">
                    <BarChart className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold">Analytics Cookies</h3>
                      <p className="text-sm text-muted-foreground">Help us understand usage</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-muted-foreground mb-4">
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our site.
                    </p>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Cookie Name</th>
                          <th className="text-left py-2">Purpose</th>
                          <th className="text-left py-2">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr className="border-b">
                          <td className="py-2">_ga</td>
                          <td className="py-2">Distinguishes unique users</td>
                          <td className="py-2">2 years</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">_gid</td>
                          <td className="py-2">Distinguishes unique users</td>
                          <td className="py-2">24 hours</td>
                        </tr>
                        <tr>
                          <td className="py-2">_gat</td>
                          <td className="py-2">Throttles request rate</td>
                          <td className="py-2">1 minute</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-purple-50 p-4 flex items-center gap-3">
                    <Target className="h-6 w-6 text-purple-600" />
                    <div>
                      <h3 className="font-semibold">Marketing Cookies</h3>
                      <p className="text-sm text-muted-foreground">Used for advertising purposes</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-muted-foreground mb-4">
                      These cookies are used to track visitors across websites. They are set by our advertising partners to build a profile of your interests and show you relevant ads on other sites.
                    </p>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Cookie Name</th>
                          <th className="text-left py-2">Purpose</th>
                          <th className="text-left py-2">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr className="border-b">
                          <td className="py-2">_fbp</td>
                          <td className="py-2">Social media advertising</td>
                          <td className="py-2">90 days</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">MUID</td>
                          <td className="py-2">Search engine advertising</td>
                          <td className="py-2">13 months</td>
                        </tr>
                        <tr>
                          <td className="py-2">IDE</td>
                          <td className="py-2">Display advertising</td>
                          <td className="py-2">13 months</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">3. Other Tracking Technologies</h2>
              <p className="text-muted-foreground mb-4">In addition to cookies, we may use:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Web Beacons (Pixels):</strong> Small graphic images embedded in web pages or emails to track user behavior and measure effectiveness of campaigns</li>
                <li><strong>Local Storage:</strong> Similar to cookies but can store larger amounts of data in your browser</li>
                <li><strong>Session Storage:</strong> Temporary storage that is cleared when you close your browser</li>
                <li><strong>Device Fingerprinting:</strong> Collecting information about your device configuration for security and fraud prevention</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">4. How to Manage Cookies</h2>
              <p className="text-muted-foreground mb-4">
                You have several options for managing cookies:
              </p>
              
              <h3 className="text-xl font-semibold mb-2">Cookie Consent Tool</h3>
              <p className="text-muted-foreground mb-4">
                When you first visit our website, you will see a cookie consent banner where you can choose which categories of cookies to accept. You can change your preferences at any time by clicking the "Cookie Settings" link in our website footer.
              </p>

              <h3 className="text-xl font-semibold mb-2">Browser Settings</h3>
              <p className="text-muted-foreground mb-4">
                Most web browsers allow you to control cookies through their settings. Here's how to access cookie settings in popular browsers:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">Opt-Out Links</h3>
              <p className="text-muted-foreground mb-4">
                You can opt out of specific third-party cookies:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-Out</a></li>
                <li>Advertising: <a href="https://www.aboutads.info/choices/" className="text-primary underline" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance</a></li>
                <li>Multiple providers: <a href="https://www.networkadvertising.org/choices/" className="text-primary underline" target="_blank" rel="noopener noreferrer">Network Advertising Initiative</a></li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">Global Privacy Control (GPC)</h3>
              <p className="text-muted-foreground">
                We honor Global Privacy Control (GPC) signals. If your browser sends a GPC signal, we will treat it as a request to opt out of the sale/sharing of your personal information.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">5. Impact of Disabling Cookies</h2>
              <p className="text-muted-foreground">
                If you choose to disable or reject cookies, please note that:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Some parts of our website may not function properly</li>
                <li>You may not be able to log in or use certain features</li>
                <li>Your shopping cart may not work as expected</li>
                <li>Your preferences may not be remembered between visits</li>
                <li>You may see less relevant advertisements</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">6. Updates to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. Any changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy periodically.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">7. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about our use of cookies:
              </p>
              <div className="mt-4 text-muted-foreground">
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
