import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, CreditCard, CheckCircle, AlertTriangle } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function SecurityDeposit() {
  return (
    <Layout>
      <SeoHead 
        title="Security Deposit Policy"
        description="Understand our security deposit policy including deposit amounts, conditions for refund, damage assessment process, and refund timelines."
        keywords="security deposit, rental deposit, deposit refund, damage assessment, deposit policy, equipment deposit"
      />
      <section className="py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-6">
            <BackButton />
          </div>
          <h1 className="text-4xl font-heading font-bold text-center mb-4">Security Deposit Policy</h1>
          <p className="text-center text-muted-foreground">Last Updated: November 28, 2025</p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4 max-w-4xl">
        <Card>
          <CardContent className="p-8 space-y-8">
            <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-heading font-bold mb-2">Why We Require Security Deposits</h2>
                  <p className="text-muted-foreground">
                    Security deposits protect both you and us. They ensure equipment is well-maintained and available for all customers, while giving you peace of mind that you're renting quality, properly serviced equipment.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">1. Deposit Amount Structure</h2>
              <p className="text-muted-foreground mb-4">
                Deposit amounts vary based on the equipment category and rental value:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th className="p-3 border font-semibold">Equipment Category</th>
                      <th className="p-3 border font-semibold">Deposit Amount</th>
                      <th className="p-3 border font-semibold">Example</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr>
                      <td className="p-3 border">Laptops</td>
                      <td className="p-3 border">20-30% of replacement value</td>
                      <td className="p-3 border">$200-$500</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Desktop PCs</td>
                      <td className="p-3 border">20-25% of replacement value</td>
                      <td className="p-3 border">$150-$400</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Cameras & Lenses</td>
                      <td className="p-3 border">25-35% of replacement value</td>
                      <td className="p-3 border">$300-$1,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Printers & Scanners</td>
                      <td className="p-3 border">15-20% of replacement value</td>
                      <td className="p-3 border">$50-$200</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Routers & Networking</td>
                      <td className="p-3 border">15-20% of replacement value</td>
                      <td className="p-3 border">$25-$100</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Headphones & Accessories</td>
                      <td className="p-3 border">20-25% of replacement value</td>
                      <td className="p-3 border">$25-$150</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                The exact deposit amount will be displayed before checkout for each item in your cart.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">2. How Deposits Are Collected</h2>
              <div className="flex items-start gap-4 mb-4">
                <CreditCard className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold">Pre-Authorization Method</h3>
                  <p className="text-muted-foreground">
                    We use a pre-authorization (hold) on your credit or debit card. This means:
                  </p>
                </div>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-10">
                <li>The deposit amount is held on your card, not charged</li>
                <li>You will see a "pending" transaction on your statement</li>
                <li>The hold reduces your available credit but not your balance</li>
                <li>The hold is automatically released when the deposit is refunded</li>
              </ul>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Some banks may convert holds to charges after 7-10 days. If this happens, the deposit will be refunded rather than released. The net effect to you is the same.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">3. Conditions for Full Deposit Refund</h2>
              <p className="text-muted-foreground mb-4">
                To receive a full refund of your security deposit, the following conditions must be met:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Equipment Condition</span>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>- Equipment functions properly</li>
                    <li>- No physical damage beyond normal wear</li>
                    <li>- Clean and free of excessive dirt</li>
                    <li>- No unauthorized modifications</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Complete Return</span>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>- All accessories included</li>
                    <li>- Original packaging (if provided)</li>
                    <li>- Return within rental period</li>
                    <li>- No outstanding fees</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">4. Damage Assessment Process</h2>
              <ol className="list-decimal list-inside text-muted-foreground space-y-4">
                <li>
                  <span className="font-semibold">Initial Inspection (Within 48 hours of return)</span>
                  <p className="ml-6 mt-1">Our technicians inspect the equipment for physical damage, functionality, and completeness.</p>
                </li>
                <li>
                  <span className="font-semibold">Functional Testing</span>
                  <p className="ml-6 mt-1">Equipment is powered on and tested to ensure all features work correctly.</p>
                </li>
                <li>
                  <span className="font-semibold">Comparison to Pre-Rental Condition</span>
                  <p className="ml-6 mt-1">We compare current condition against our pre-rental inspection photos and notes.</p>
                </li>
                <li>
                  <span className="font-semibold">Documentation</span>
                  <p className="ml-6 mt-1">Any issues found are documented with photos and detailed descriptions.</p>
                </li>
                <li>
                  <span className="font-semibold">Notification</span>
                  <p className="ml-6 mt-1">You will receive an email within 48 hours detailing any issues and proposed deductions.</p>
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">5. Deposit Deductions</h2>
              <p className="text-muted-foreground mb-4">
                Deductions may be made from your deposit for the following reasons:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th className="p-3 border font-semibold">Issue</th>
                      <th className="p-3 border font-semibold">Typical Deduction</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr>
                      <td className="p-3 border">Minor cosmetic damage (scratches, scuffs)</td>
                      <td className="p-3 border">$25-$75</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Missing cables/chargers</td>
                      <td className="p-3 border">$15-$50 per item</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Missing accessories (case, lens cap, etc.)</td>
                      <td className="p-3 border">$10-$100 per item</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Deep cleaning required</td>
                      <td className="p-3 border">$25-$50</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Screen damage</td>
                      <td className="p-3 border">$100-$500</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Water/liquid damage</td>
                      <td className="p-3 border">Up to full replacement cost</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Non-functional equipment</td>
                      <td className="p-3 border">Repair cost or replacement value</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Late return fees</td>
                      <td className="p-3 border">Per our late return policy</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">6. Refund Timeline</h2>
              <div className="bg-secondary/30 p-6 rounded-lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-semibold">Equipment Return</p>
                      <p className="text-sm text-muted-foreground">Day 0 - Equipment received at our facility</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-semibold">Inspection Complete</p>
                      <p className="text-sm text-muted-foreground">Days 1-2 - Equipment inspected and assessed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-semibold">Notification Sent</p>
                      <p className="text-sm text-muted-foreground">Day 2-3 - Email sent with refund details</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">4</div>
                    <div>
                      <p className="font-semibold">Refund Processed</p>
                      <p className="text-sm text-muted-foreground">Days 3-7 - Refund initiated to your payment method</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">5</div>
                    <div>
                      <p className="font-semibold">Funds Available</p>
                      <p className="text-sm text-muted-foreground">Days 7-14 - Depending on your bank/card issuer</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Total time from return to funds in your account: 7-14 business days
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">7. Damage Waiver Option</h2>
              <p className="text-muted-foreground mb-4">
                For added protection, we offer an optional Damage Waiver plan:
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Damage Waiver Protection</h3>
                <p className="text-muted-foreground mb-4">
                  For a small daily fee (typically 10-15% of rental cost), reduce your liability:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Reduces your maximum liability to $50-$100 per incident</li>
                  <li>Covers accidental damage from normal use</li>
                  <li>Includes theft protection (with police report)</li>
                  <li>Does not cover intentional damage, negligence, or loss</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  The Damage Waiver can be added during checkout or by contacting support before your rental begins.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">8. Disputing Deductions</h2>
              <p className="text-muted-foreground mb-4">
                If you believe a deduction is unfair or incorrect:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Contact us within 7 days of receiving the deduction notice</li>
                <li>Provide photos/videos you took at delivery showing equipment condition</li>
                <li>Explain why you believe the deduction is incorrect</li>
                <li>Our team will review and respond within 5 business days</li>
                <li>If we agree, the deduction will be refunded</li>
                <li>If we disagree, we will provide detailed documentation of the damage</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">9. Contact Us</h2>
              <p className="text-muted-foreground">
                For questions about security deposits:
              </p>
              <div className="mt-4 text-muted-foreground">
                <p>Email: deposits@rentmygadgets.com</p>
                <p>Contact us through your account dashboard</p>
                <p>Hours: Monday - Friday, 8:00 AM - 6:00 PM EST</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}
