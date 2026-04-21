import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, Package, Clock, MapPin } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function ShippingPolicy() {
  return (
    <Layout>
      <SeoHead 
        title="Delivery & Shipping Policy"
        description="Learn about our shipping methods, delivery timeframes, costs, and return shipping instructions for equipment rentals at RentMyGadgets."
        keywords="shipping policy, delivery policy, shipping costs, delivery timeframes, return shipping, equipment delivery"
      />
      <section className="py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-6">
            <BackButton />
          </div>
          <h1 className="text-4xl font-heading font-bold text-center mb-4">Delivery & Shipping Policy</h1>
          <p className="text-center text-muted-foreground">Last Updated: November 28, 2025</p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4 max-w-4xl">
        <Card>
          <CardContent className="p-8 space-y-8">
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="bg-primary/10 p-4 rounded-lg">
                <Truck className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold">Free Shipping</p>
                <p className="text-sm text-muted-foreground">Orders $150+</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold">Express Delivery</p>
                <p className="text-sm text-muted-foreground">Select Areas</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold">Tracked Shipping</p>
                <p className="text-sm text-muted-foreground">All Orders</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold">Nationwide</p>
                <p className="text-sm text-muted-foreground">Coverage</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">1. Shipping Methods & Timeframes</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th className="p-3 border font-semibold">Shipping Method</th>
                      <th className="p-3 border font-semibold">Delivery Time</th>
                      <th className="p-3 border font-semibold">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr>
                      <td className="p-3 border">Standard Shipping</td>
                      <td className="p-3 border">3-5 business days</td>
                      <td className="p-3 border">$12.99 (Free over $150)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Expedited Shipping</td>
                      <td className="p-3 border">2 business days</td>
                      <td className="p-3 border">$24.99</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Express Shipping</td>
                      <td className="p-3 border">Next business day</td>
                      <td className="p-3 border">$39.99</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Express Delivery*</td>
                      <td className="p-3 border">Within 4-6 hours</td>
                      <td className="p-3 border">$49.99</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">White Glove Delivery**</td>
                      <td className="p-3 border">Scheduled appointment</td>
                      <td className="p-3 border">$99.99</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                *Express delivery available in select metropolitan areas for orders placed before 10:00 AM local time.<br />
                **White Glove includes setup, demonstration, and packaging removal.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">2. Delivery Areas</h2>
              <h3 className="text-xl font-semibold mb-2">Domestic Shipping</h3>
              <p className="text-muted-foreground mb-4">
                We ship to all 50 US states, including Alaska, Hawaii, Puerto Rico, and US territories. Shipping times and costs may vary for non-contiguous states.
              </p>
              
              <h3 className="text-xl font-semibold mb-2">Express Delivery Zones</h3>
              <p className="text-muted-foreground mb-2">Express delivery is currently available in:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 columns-2">
                <li>San Francisco Bay Area</li>
                <li>Los Angeles Metro</li>
                <li>New York City</li>
                <li>Chicago Metro</li>
                <li>Seattle Metro</li>
                <li>Miami-Dade</li>
                <li>Boston Metro</li>
                <li>Washington D.C.</li>
                <li>Dallas-Fort Worth</li>
                <li>Denver Metro</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">International Shipping</h3>
              <p className="text-muted-foreground">
                Currently, we do not offer international shipping. We are working on expanding our services to Canada and select international destinations in the future.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">3. Order Processing</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Orders placed before 2:00 PM EST are processed the same business day</li>
                <li>Orders placed after 2:00 PM EST are processed the next business day</li>
                <li>Orders are not processed on weekends or major holidays</li>
                <li>You will receive a confirmation email with tracking information once your order ships</li>
                <li>Processing may take an additional 1-2 days during peak seasons</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">4. Delivery Requirements</h2>
              <h3 className="text-xl font-semibold mb-2">Signature Requirement</h3>
              <p className="text-muted-foreground mb-4">
                For security purposes, signature is required for all deliveries. If no one is available to sign:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>The carrier will attempt delivery up to 3 times</li>
                <li>After 3 failed attempts, the package will be held at the carrier's local facility for 5 business days</li>
                <li>You may authorize a neighbor or building manager to sign on your behalf through your account settings</li>
                <li>Packages not claimed within 5 business days will be returned to us</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">Delivery Address</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>We ship to residential and business addresses</li>
                <li>P.O. Boxes are not accepted for equipment deliveries</li>
                <li>Ensure your address includes apartment/suite numbers if applicable</li>
                <li>Address changes must be requested before order processing</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">5. Package Inspection</h2>
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                <p className="font-semibold mb-2">Important: Inspect Upon Delivery</p>
                <p className="text-muted-foreground">
                  Please inspect your package upon delivery. If the outer packaging appears damaged, note the damage on the carrier's delivery receipt and take photos before opening. Report any visible damage to us within 2 hours of delivery.
                </p>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Open packages carefully to avoid damaging contents</li>
                <li>Check all items against the packing slip</li>
                <li>Test equipment functionality within 24 hours</li>
                <li>Report any missing items or defects immediately</li>
                <li>Keep all original packaging for returns</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">6. Return Shipping</h2>
              <h3 className="text-xl font-semibold mb-2">Prepaid Return Labels</h3>
              <p className="text-muted-foreground mb-4">
                Return shipping is included with all rentals. You will receive a prepaid return label:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Included in your delivery package</li>
                <li>Available for download in your account dashboard</li>
                <li>Can be requested from customer support if lost</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">Return Packaging Requirements</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Use the original packaging whenever possible</li>
                <li>If original packaging is unavailable, use a sturdy box with adequate padding</li>
                <li>Wrap fragile items in bubble wrap or foam</li>
                <li>Include all accessories, cables, and components</li>
                <li>Seal the package securely with packing tape</li>
                <li>Affix the prepaid return label clearly on the outside</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">Return Drop-off Options</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Schedule a courier pickup through your account</li>
                <li>Drop off at any carrier partner location (UPS, FedEx)</li>
                <li>Use our partner drop-off points at select retail locations</li>
                <li>Visit our service center for in-person returns</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">7. Tracking Your Order</h2>
              <p className="text-muted-foreground mb-4">
                Stay informed about your delivery status:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Tracking number provided via email once order ships</li>
                <li>Real-time tracking available in your account dashboard</li>
                <li>SMS notifications available (opt-in during checkout)</li>
                <li>Email updates at key delivery milestones</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">8. Delivery Issues</h2>
              <h3 className="text-xl font-semibold mb-2">Lost or Delayed Packages</h3>
              <p className="text-muted-foreground mb-4">
                If your package is lost or significantly delayed:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Contact us if your package hasn't arrived within 2 days of the expected delivery date</li>
                <li>We will initiate a carrier investigation</li>
                <li>If the package is confirmed lost, we will ship a replacement or issue a refund</li>
                <li>No additional charges for replacement shipments due to carrier errors</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">Damaged in Transit</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Document damage with photos before unpacking</li>
                <li>Report damage within 24 hours of delivery</li>
                <li>Keep all packaging materials for carrier inspection</li>
                <li>We will arrange replacement or refund once damage is verified</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">9. Holiday Shipping</h2>
              <p className="text-muted-foreground mb-4">
                During peak holiday seasons (November-December), please note:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Order early to ensure timely delivery</li>
                <li>Standard shipping may take an additional 1-3 days</li>
                <li>Express shipping is recommended for time-sensitive orders</li>
                <li>We do not ship on major holidays (Thanksgiving, Christmas, New Year's Day)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">10. Contact Us</h2>
              <p className="text-muted-foreground">
                For shipping inquiries or delivery issues:
              </p>
              <div className="mt-4 text-muted-foreground">
                <p>Email: shipping@rentmygadgets.com</p>
                <p>Live Chat: Available during business hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}
