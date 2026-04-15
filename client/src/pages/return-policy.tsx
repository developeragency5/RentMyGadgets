import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Card, CardContent } from "@/components/ui/card";
import BackButton from "@/components/BackButton";

export default function ReturnPolicy() {
  return (
    <Layout>
      <SeoHead 
        title="Return & Refund Policy"
        description="Learn about our return and refund policy for equipment rentals. Clear guidelines on return windows, conditions, refund timelines, and how to initiate returns."
        keywords="return policy, refund policy, equipment return, rental refund, return conditions, refund timeline"
      />
      <section className="py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-6">
            <BackButton />
          </div>
          <h1 className="text-4xl font-heading font-bold text-center mb-4">Return & Refund Policy</h1>
          <p className="text-center text-muted-foreground">Last Updated: November 28, 2025</p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4 max-w-4xl">
        <Card>
          <CardContent className="p-8 space-y-8">
            <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg">
              <h2 className="text-xl font-heading font-bold mb-2">Our Commitment</h2>
              <p className="text-muted-foreground">
                At RentMyGadgets, we want you to be completely satisfied with your rental experience. If something isn't right, we're here to make it right. This policy outlines how returns and refunds work for our rental services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">1. Standard Return Process</h2>
              <p className="text-muted-foreground mb-4">
                All rented equipment must be returned by the end of your rental period. Here's how the return process works:
              </p>
              <ol className="list-decimal list-inside text-muted-foreground space-y-2">
                <li>Schedule your return through your account dashboard at least 24 hours in advance</li>
                <li>Pack the equipment securely in the original packaging (if provided) or equivalent protective packaging</li>
                <li>Include all accessories, cables, chargers, and components that came with the equipment</li>
                <li>Attach the prepaid shipping label (for mail returns) or have the equipment ready for pickup</li>
                <li>Drop off at designated shipping location or hand over to our courier</li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">2. Return Options</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Courier Pickup</h3>
                  <p className="text-muted-foreground text-sm">Schedule a pickup at your location. Our courier will collect the equipment at your convenience. Free for orders over $200.</p>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Drop-off Location</h3>
                  <p className="text-muted-foreground text-sm">Return equipment to any of our partner drop-off locations. Find the nearest location on your order confirmation.</p>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Mail Return</h3>
                  <p className="text-muted-foreground text-sm">Use our prepaid shipping label to mail the equipment back. Available for all portable equipment.</p>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">In-Store Return</h3>
                  <p className="text-muted-foreground text-sm">Visit our service center to return equipment in person and get immediate confirmation.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">3. Equipment Condition Requirements</h2>
              <p className="text-muted-foreground mb-4">
                To receive a full security deposit refund, equipment must be returned in acceptable condition:
              </p>
              <h3 className="text-xl font-semibold mb-2 text-green-600">Acceptable Condition</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Equipment functions properly as intended</li>
                <li>Normal wear and tear (minor surface scratches, light dust)</li>
                <li>All original components and accessories included</li>
                <li>No unauthorized modifications or alterations</li>
                <li>Battery fully charged (for applicable devices)</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-2 text-red-600">Unacceptable Condition (Subject to Fees)</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Physical damage (cracks, dents, broken parts)</li>
                <li>Water or liquid damage</li>
                <li>Missing accessories or components</li>
                <li>Equipment malfunction due to misuse</li>
                <li>Unauthorized software or system modifications</li>
                <li>Evidence of tampering or attempted repair</li>
                <li>Excessive dirt, stains, or contamination</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">4. Refund Eligibility</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold">Full Refund Scenarios</h3>
                  <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                    <li>Equipment delivered defective or damaged</li>
                    <li>Wrong equipment delivered</li>
                    <li>Cancellation more than 48 hours before rental start</li>
                    <li>Equipment unavailable after order confirmation</li>
                  </ul>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-semibold">Partial Refund Scenarios</h3>
                  <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                    <li>Cancellation 24-48 hours before rental start (75% refund)</li>
                    <li>Cancellation less than 24 hours before rental start (50% refund)</li>
                    <li>Early return with prior approval (prorated refund may apply for monthly rentals)</li>
                  </ul>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold">No Refund Scenarios</h3>
                  <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                    <li>Equipment returned damaged or with missing parts</li>
                    <li>Late returns without prior arrangement</li>
                    <li>Rental period already started (standard daily/weekly rentals)</li>
                    <li>Violation of rental agreement terms</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">5. Refund Timeline</h2>
              <div className="bg-secondary/30 p-6 rounded-lg">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-2 font-semibold">Refund Type</th>
                      <th className="pb-2 font-semibold">Processing Time</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b">
                      <td className="py-2">Rental Cancellation Refund</td>
                      <td className="py-2">3-5 business days</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Security Deposit Refund</td>
                      <td className="py-2">7-14 business days after return inspection</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Defective Equipment Refund</td>
                      <td className="py-2">5-7 business days</td>
                    </tr>
                    <tr>
                      <td className="py-2">Overcharge Correction</td>
                      <td className="py-2">1-3 business days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground mt-4 text-sm">
                Note: Refund processing times start after approval. Actual posting to your account depends on your payment provider (credit cards typically take 5-10 business days after processing).
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">6. Non-Refundable Fees</h2>
              <p className="text-muted-foreground mb-4">
                The following fees are non-refundable under any circumstances:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Express/rush delivery fees</li>
                <li>Damage waiver/protection plan fees (once rental period begins)</li>
                <li>Late return fees</li>
                <li>Cleaning or sanitization fees</li>
                <li>Administrative fees for order modifications</li>
                <li>Fees for missing accessories or components</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">7. How to Initiate a Return or Refund</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                  <div>
                    <h3 className="font-semibold">Log into Your Account</h3>
                    <p className="text-muted-foreground text-sm">Go to your dashboard and find your order</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                  <div>
                    <h3 className="font-semibold">Select "Request Return" or "Request Refund"</h3>
                    <p className="text-muted-foreground text-sm">Choose the appropriate option and select your reason</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                  <div>
                    <h3 className="font-semibold">Receive Confirmation</h3>
                    <p className="text-muted-foreground text-sm">You'll receive an email with return instructions or refund approval</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">4</div>
                  <div>
                    <h3 className="font-semibold">Complete the Process</h3>
                    <p className="text-muted-foreground text-sm">Ship or drop off equipment; refund will be processed after inspection</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">8. Disputes and Appeals</h2>
              <p className="text-muted-foreground mb-4">
                If you disagree with a refund decision or damage assessment:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Contact our customer support within 7 days of receiving the decision</li>
                <li>Provide any supporting documentation (photos, videos from delivery)</li>
                <li>Our team will review your case within 5 business days</li>
                <li>If unresolved, you may request escalation to our disputes team</li>
                <li>Final decisions are made within 14 business days of escalation</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">9. Contact Us</h2>
              <p className="text-muted-foreground">
                For return or refund assistance:
              </p>
              <div className="mt-4 text-muted-foreground">
                <p>Email: returns@rentmygadgets.com</p>
                <p>Live Chat: Available during business hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}
