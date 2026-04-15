import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Card, CardContent } from "@/components/ui/card";
import BackButton from "@/components/BackButton";

export default function RentalPolicy() {
  return (
    <Layout>
      <SeoHead 
        title="Rental Agreement Policy"
        description="Understand our rental agreement terms including rental periods, equipment care requirements, extensions, and rental conditions at RentMyGadgets."
        keywords="rental agreement, rental policy, equipment rental terms, rental period, rental extension, equipment care"
      />
      <section className="py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-6">
            <BackButton />
          </div>
          <h1 className="text-4xl font-heading font-bold text-center mb-4">Rental Agreement Policy</h1>
          <p className="text-center text-muted-foreground">Last Updated: November 28, 2025</p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4 max-w-4xl">
        <Card>
          <CardContent className="p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">1. Rental Period Definitions</h2>
              <p className="text-muted-foreground mb-4">
                RentMyGadgets offers three flexible rental period options to meet your needs:
              </p>
              <div className="space-y-4">
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg">Daily Rental</h3>
                  <p className="text-muted-foreground">A daily rental period is calculated as a 24-hour period beginning from the time of equipment delivery or pickup. Each additional 24-hour period constitutes an additional rental day.</p>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg">Weekly Rental</h3>
                  <p className="text-muted-foreground">A weekly rental period consists of 7 consecutive days, beginning from the delivery date. Weekly rates offer significant savings compared to daily rates.</p>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg">Monthly Rental</h3>
                  <p className="text-muted-foreground">A monthly rental period consists of 30 consecutive days, beginning from the delivery date. Monthly rentals are well-suited for extended projects.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">2. Rental Start and End Times</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Your rental period officially begins when the equipment is delivered to your specified address or when you pick up the equipment from our location</li>
                <li>The rental period ends when the equipment is received back at our facility or collected by our courier</li>
                <li>Equipment must be ready for pickup or dropped off by 5:00 PM local time on the final day of the rental period to avoid late fees</li>
                <li>Same-day returns are accepted until 5:00 PM; after this time, an additional day may be charged</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">3. Rental Extensions</h2>
              <p className="text-muted-foreground mb-4">
                Need more time with your equipment? We make extensions easy:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Request an extension at least 24 hours before your rental period ends</li>
                <li>Extensions are subject to equipment availability</li>
                <li>Extended rentals are charged at the applicable daily, weekly, or monthly rate</li>
                <li>You can request extensions through your account dashboard or by contacting customer support</li>
                <li>Payment for the extension must be made before the original rental period expires</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">4. Early Returns</h2>
              <p className="text-muted-foreground mb-4">
                If you need to return equipment before your rental period ends:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>You may return equipment early at any time during your rental period</li>
                <li>Early returns do not qualify for partial refunds unless covered by our cancellation policy</li>
                <li>Contact us to arrange early pickup or drop-off instructions</li>
                <li>Your account will be noted for early return, which may qualify you for loyalty rewards</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">5. Equipment Care Requirements</h2>
              <p className="text-muted-foreground mb-4">
                As a renter, you are responsible for proper care of all equipment during your rental period:
              </p>
              <h3 className="text-xl font-semibold mb-2">General Care Guidelines</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Keep equipment clean and free from dust, dirt, and debris</li>
                <li>Store equipment in a safe, dry location away from extreme temperatures</li>
                <li>Use equipment only in accordance with manufacturer guidelines</li>
                <li>Do not expose electronic equipment to water or excessive humidity</li>
                <li>Handle all equipment with care during transport</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">Prohibited Actions</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Do not attempt to repair, modify, or disassemble any equipment</li>
                <li>Do not remove serial numbers, labels, or identification tags</li>
                <li>Do not use equipment in hazardous environments without prior approval</li>
                <li>Do not install unauthorized software or make system modifications on computing devices</li>
                <li>Do not use equipment for purposes other than its intended function</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">6. Late Returns</h2>
              <p className="text-muted-foreground mb-4">
                We understand schedules can change, but late returns impact other customers:
              </p>
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Late Fee Structure</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Grace Period:</strong> 2-hour grace period after the scheduled return time</li>
                  <li><strong>Same Day Late:</strong> 25% of the daily rental rate</li>
                  <li><strong>1-3 Days Late:</strong> Full daily rate per day plus a $25 late processing fee</li>
                  <li><strong>4-7 Days Late:</strong> 1.5x daily rate per day plus a $50 late processing fee</li>
                  <li><strong>Over 7 Days Late:</strong> Equipment may be considered lost; full replacement value may be charged</li>
                </ul>
              </div>
              <p className="text-muted-foreground mt-4">
                To avoid late fees, please contact us immediately if you anticipate a delay in returning equipment.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">7. Prohibited Uses</h2>
              <p className="text-muted-foreground mb-4">
                Rented equipment may NOT be used for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Any illegal activities or purposes</li>
                <li>Commercial subleasing or re-rental to third parties</li>
                <li>Activities that void manufacturer warranties</li>
                <li>Use outside of the designated geographic area without prior approval</li>
                <li>High-risk activities (underwater, extreme sports, etc.) without specific damage coverage</li>
                <li>Modification of hardware or unauthorized software installation</li>
                <li>Any purpose that could damage the equipment beyond normal wear and tear</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">8. Rental Cancellation</h2>
              <p className="text-muted-foreground mb-4">
                Our cancellation policy is designed to be fair to both customers and our operations:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>More than 48 hours before rental start:</strong> Full refund</li>
                <li><strong>24-48 hours before rental start:</strong> 75% refund</li>
                <li><strong>Less than 24 hours before rental start:</strong> 50% refund</li>
                <li><strong>After rental period has begun:</strong> No refund for remaining rental period</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To cancel a rental, log into your account dashboard or contact our customer support team.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">9. Equipment Inspection</h2>
              <p className="text-muted-foreground mb-4">
                To ensure transparency and protect both parties:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>All equipment is inspected and tested before each rental</li>
                <li>We recommend inspecting equipment upon delivery and reporting any issues within 2 hours</li>
                <li>Take photos/videos of equipment condition at delivery for your records</li>
                <li>Equipment is inspected upon return; you will be notified of any damage findings within 48 hours</li>
                <li>You have the right to be present during return inspection if equipment is dropped off in person</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">10. Contact Us</h2>
              <p className="text-muted-foreground">
                For questions about our rental agreement policy:
              </p>
              <div className="mt-4 text-muted-foreground">
                <p>Email: rentals@rentmygadgets.com</p>
                <p>Contact us through your account dashboard</p>
                <p>Hours: Monday - Friday, 8:00 AM - 8:00 PM EST</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}
