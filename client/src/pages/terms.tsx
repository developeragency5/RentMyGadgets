import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Card, CardContent } from "@/components/ui/card";
import BackButton from "@/components/BackButton";

export default function Terms() {
  return (
    <Layout>
      <SeoHead 
        title="Terms and Conditions"
        description="Read our terms and conditions for renting technology equipment. Understand your rights and responsibilities when using RentMyGadgets services."
        keywords="terms and conditions, rental terms, equipment rental agreement, user agreement, legal terms"
      />
      <section className="py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-6">
            <BackButton />
          </div>
          <h1 className="text-4xl font-heading font-bold text-center mb-4">Terms and Conditions</h1>
          <p className="text-center text-muted-foreground">Last Updated: November 28, 2025</p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4 max-w-4xl">
        <Card>
          <CardContent className="p-8 space-y-8 prose prose-slate max-w-none">
            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">1. Agreement to Terms</h2>
              <p className="text-muted-foreground">
                Welcome to RentMyGadgets. By accessing or using our website, mobile applications, or any of our services (collectively, the "Services"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use our Services.
              </p>
              <p className="text-muted-foreground mt-4">
                These Terms constitute a legally binding agreement between you ("User," "you," or "your") and RentMyGadgets ("Company," "we," "us," or "our"). We reserve the right to modify these Terms at any time, and such modifications will be effective immediately upon posting. Your continued use of our Services following any changes constitutes acceptance of those changes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">2. Eligibility</h2>
              <p className="text-muted-foreground">
                To use our Services, you must:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-2">
                <li>Be at least 18 years of age or the legal age of majority in your jurisdiction</li>
                <li>Have the legal capacity to enter into a binding contract</li>
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Have a valid payment method acceptable to us</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">3. Account Registration</h2>
              <p className="text-muted-foreground">
                To access certain features of our Services, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
                <li>Ensuring your account information remains accurate and up-to-date</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                We reserve the right to suspend or terminate your account at our discretion if we suspect fraudulent activity, violation of these Terms, or for any other reason we deem appropriate.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">4. Rental Services</h2>
              <h3 className="text-xl font-semibold mb-2">4.1 Rental Periods</h3>
              <p className="text-muted-foreground">
                We offer flexible rental periods including daily, weekly, and monthly options. The rental period begins on the delivery date and ends when the equipment is returned to our designated location or picked up by our courier.
              </p>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">4.2 Pricing and Payment</h3>
              <p className="text-muted-foreground">
                All prices are displayed in US Dollars and are subject to change without notice. Prices do not include applicable taxes, shipping fees, or security deposits unless explicitly stated. Payment is due in full at the time of order placement.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">4.3 Order Acceptance</h3>
              <p className="text-muted-foreground">
                Your order constitutes an offer to rent equipment from us. We reserve the right to accept or decline any order at our sole discretion. An order is not confirmed until you receive a confirmation email from us and payment has been processed successfully.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">5. Equipment Use and Care</h2>
              <p className="text-muted-foreground">
                When renting equipment from us, you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-2">
                <li>Use the equipment only for its intended purpose</li>
                <li>Handle all equipment with reasonable care</li>
                <li>Not modify, alter, or attempt to repair the equipment</li>
                <li>Not remove any labels, tags, or identification marks</li>
                <li>Keep the equipment in a safe and secure location</li>
                <li>Not sublease, lend, or transfer the equipment to any third party</li>
                <li>Comply with all applicable laws and regulations when using the equipment</li>
                <li>Return the equipment in the same condition as received, normal wear excepted</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">6. Prohibited Uses</h2>
              <p className="text-muted-foreground">
                You may not use our Services or rented equipment for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-2">
                <li>Any unlawful purpose or in violation of any applicable laws</li>
                <li>Commercial resale or subletting without our written consent</li>
                <li>Activities that could damage, disable, or impair the equipment</li>
                <li>Any purpose that could expose us to liability</li>
                <li>Harassment, abuse, or harm to others</li>
                <li>Transmission of viruses, malware, or other harmful code</li>
                <li>Any activity that infringes on intellectual property rights</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">7. Security Deposits</h2>
              <p className="text-muted-foreground">
                We may require a security deposit for certain rentals. The deposit amount will be clearly displayed before checkout. Deposits are fully refundable within 14 business days of equipment return, provided the equipment is returned in acceptable condition. We reserve the right to deduct from the deposit for any damages, missing items, or late returns.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground uppercase font-semibold">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, RENTMYGADGETS AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-2">
                <li>Your use or inability to use our Services</li>
                <li>Any equipment malfunction or defect</li>
                <li>Unauthorized access to or alteration of your data</li>
                <li>Any third-party conduct on our Services</li>
                <li>Any other matter relating to our Services</li>
              </ul>
              <p className="text-muted-foreground mt-4 uppercase font-semibold">
                OUR TOTAL LIABILITY FOR ALL CLAIMS ARISING FROM OR RELATED TO THESE TERMS OR YOUR USE OF OUR SERVICES SHALL NOT EXCEED THE TOTAL AMOUNT PAID BY YOU TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">9. Indemnification</h2>
              <p className="text-muted-foreground">
                You agree to indemnify, defend, and hold harmless RentMyGadgets, its affiliates, officers, directors, employees, and agents from and against any and all claims, damages, losses, costs, and expenses (including reasonable attorney's fees) arising from or related to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-2">
                <li>Your use of our Services or rented equipment</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your violation of any applicable laws or regulations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">10. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content on our website, including text, graphics, logos, images, audio, video, and software, is the property of RentMyGadgets or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without our prior written consent.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">11. Dispute Resolution</h2>
              <h3 className="text-xl font-semibold mb-2">11.1 Informal Resolution</h3>
              <p className="text-muted-foreground">
                Before initiating any formal dispute resolution proceedings, you agree to first contact us at legal@rentmygadgets.com to attempt to resolve any dispute informally. We will make reasonable efforts to resolve the dispute within 30 days.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">11.2 Binding Arbitration</h3>
              <p className="text-muted-foreground">
                If informal resolution is unsuccessful, any dispute arising from or relating to these Terms or our Services shall be resolved through binding arbitration, rather than in court. The arbitration shall be conducted in accordance with the rules of the American Arbitration Association.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">11.3 Class Action Waiver</h3>
              <p className="text-muted-foreground">
                You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">12. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms shall be brought exclusively in the federal or state courts located in Delaware.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">13. Severability</h2>
              <p className="text-muted-foreground">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">14. Entire Agreement</h2>
              <p className="text-muted-foreground">
                These Terms, together with our Privacy Policy, Cookie Policy, and any other policies referenced herein, constitute the entire agreement between you and RentMyGadgets regarding your use of our Services and supersede all prior agreements and understandings.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">15. Contact Information</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-4 text-muted-foreground">
                <p><strong>PC Rental, LLC</strong> (dba RentMyGadgets)</p>
                <p>Email: legal@rentmygadgets.com</p>
                <p>Contact us through your account dashboard</p>
                <p>Address: 2393 Seabreeze Dr SE, Darien, GA 31305-5425, United States</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}
