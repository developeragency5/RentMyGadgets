import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ShieldCheck, CreditCard, Truck, FileText, HelpCircle } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function AdvertisingDisclosure() {
  return (
    <Layout>
      <SeoHead 
        title="Advertising Disclosure & Merchant Standards"
        description="Learn about our advertising practices, merchant standards, and commitment to transparency. We meet and exceed industry requirements for online marketplace compliance."
        keywords="advertising disclosure, merchant standards, transparency, online shopping, secure checkout, pricing transparency"
      />
      <section className="py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-6">
            <BackButton />
          </div>
          <h1 className="text-4xl font-heading font-bold text-center mb-4">Advertising Disclosure & Merchant Standards</h1>
          <p className="text-center text-muted-foreground">Last Updated: November 28, 2025</p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4 max-w-4xl">
        <Card>
          <CardContent className="p-8 space-y-8">
            <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg">
              <h2 className="text-xl font-heading font-bold mb-2">Our Commitment to Transparency</h2>
              <p className="text-muted-foreground">
                RentMyGadgets is committed to maintaining the highest standards of transparency, honesty, and compliance in all our advertising and business practices. This page explains how we meet industry standards for online merchants and search engine advertising requirements.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">1. Pricing Transparency</h2>
              <div className="flex items-start gap-4">
                <CreditCard className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-muted-foreground mb-4">
                    We are committed to clear, honest pricing:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>All prices are displayed in US Dollars (USD)</li>
                    <li>Daily, weekly, and monthly rental rates are clearly shown for each product</li>
                    <li>Shipping costs are calculated and displayed before checkout</li>
                    <li>Security deposit amounts are disclosed before payment</li>
                    <li>Applicable taxes are calculated based on your location</li>
                    <li>No hidden fees or surprise charges</li>
                    <li>Total order cost is clearly displayed before order confirmation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">2. Accurate Product Information</h2>
              <div className="flex items-start gap-4">
                <FileText className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-muted-foreground mb-4">
                    We ensure all product listings are accurate and up-to-date:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Product descriptions accurately reflect the equipment you'll receive</li>
                    <li>Product images represent the equipment available for rent</li>
                    <li>Specifications are sourced from manufacturer data</li>
                    <li>Availability status is kept up to date</li>
                    <li>Any condition notes or variations are clearly disclosed</li>
                    <li>We do not make misleading claims about our products or services</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">3. Secure Checkout</h2>
              <div className="flex items-start gap-4">
                <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-muted-foreground mb-4">
                    Your payment security is our priority:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>SSL/TLS encryption on all pages (HTTPS)</li>
                    <li>PCI-DSS compliant payment processing</li>
                    <li>We never store complete credit card numbers</li>
                    <li>Multiple secure payment options available</li>
                    <li>Fraud detection and prevention systems</li>
                    <li>Order confirmation sent immediately via email</li>
                  </ul>
                  <div className="mt-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">Secure checkout</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">4. Shipping & Delivery Standards</h2>
              <div className="flex items-start gap-4">
                <Truck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-muted-foreground mb-4">
                    Clear and reliable shipping information:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Multiple shipping options with estimated delivery dates</li>
                    <li>Real-time tracking for all orders</li>
                    <li>Clear delivery timeframe estimates</li>
                    <li>Shipping costs displayed before checkout</li>
                    <li>Return shipping instructions included with every order</li>
                    <li>Contact information for delivery issues</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">5. Clear Policies</h2>
              <p className="text-muted-foreground mb-4">
                All our policies are easily accessible and written in plain language:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mb-2" />
                  <h3 className="font-semibold mb-1">Return & Refund Policy</h3>
                  <p className="text-sm text-muted-foreground">Clear guidelines on returns, refunds, and cancellations</p>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mb-2" />
                  <h3 className="font-semibold mb-1">Privacy Policy</h3>
                  <p className="text-sm text-muted-foreground">How we collect, use, and protect your data</p>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mb-2" />
                  <h3 className="font-semibold mb-1">Terms and Conditions</h3>
                  <p className="text-sm text-muted-foreground">Complete terms governing use of our services</p>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mb-2" />
                  <h3 className="font-semibold mb-1">Shipping Policy</h3>
                  <p className="text-sm text-muted-foreground">Delivery methods, timeframes, and costs</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">6. Customer Support Accessibility</h2>
              <div className="flex items-start gap-4">
                <HelpCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-muted-foreground mb-4">
                    We provide multiple ways to reach our support team:
                  </p>
                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <ul className="text-muted-foreground space-y-2">
                      <li><strong>Email:</strong> support@rentmygadgets.com</li>
                      <li><strong>Dashboard:</strong> Contact us through your account dashboard</li>
                      <li><strong>Live Chat:</strong> Available on our website</li>
                      <li><strong>Hours:</strong> Monday - Friday, 8:00 AM - 8:00 PM EST</li>
                      <li><strong>Response Time:</strong> Within 24 hours for email inquiries</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">7. Business Information</h2>
              <p className="text-muted-foreground mb-4">
                RentMyGadgets is a legitimate, registered business:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Registered business entity in the United States</li>
                <li>Physical business address on file</li>
                <li>Verified domain ownership</li>
                <li>Valid SSL certificate</li>
                <li>Legitimate payment processing partnerships</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">8. Advertising Practices</h2>
              <p className="text-muted-foreground mb-4">
                Our advertising adheres to industry standards:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>All advertisements are truthful and not misleading</li>
                <li>Prices shown in ads match prices on our website</li>
                <li>Product availability is accurately represented</li>
                <li>We do not use bait-and-switch tactics</li>
                <li>Promotional offers have clear terms and conditions</li>
                <li>We comply with all applicable advertising regulations</li>
                <li>Landing pages provide the information promised in ads</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">9. Data Feed Accuracy</h2>
              <p className="text-muted-foreground mb-4">
                For our product listings across shopping platforms:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Product feeds are updated regularly (at least daily)</li>
                <li>Prices are synchronized across all platforms</li>
                <li>Stock availability is accurate and real-time</li>
                <li>Product identifiers (UPC, MPN) are correct</li>
                <li>Product categories are appropriately assigned</li>
                <li>Images meet quality and content standards</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">10. Compliance & Standards</h2>
              <p className="text-muted-foreground mb-4">
                We comply with the following standards and regulations:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>FTC Truth in Advertising guidelines</li>
                  <li>PCI-DSS for payment security</li>
                  <li>CCPA/CPRA privacy requirements</li>
                  <li>ADA website accessibility standards</li>
                </ul>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>CAN-SPAM Act for email marketing</li>
                  <li>Search engine merchant policies</li>
                  <li>Shopping platform requirements</li>
                  <li>E-commerce best practices</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">11. Report Concerns</h2>
              <p className="text-muted-foreground">
                If you believe any of our advertising or business practices do not meet these standards, please contact us:
              </p>
              <div className="mt-4 text-muted-foreground">
                <p>Email: compliance@rentmygadgets.com</p>
                <p>Contact us through your account dashboard</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}
