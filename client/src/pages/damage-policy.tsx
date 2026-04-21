import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Shield, FileWarning, CheckCircle } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function DamagePolicy() {
  return (
    <Layout>
      <SeoHead 
        title="Damage & Loss Policy"
        description="Understand our damage and loss policy including damage categories, replacement costs, damage waiver options, and procedures for reporting lost or stolen equipment."
        keywords="damage policy, loss policy, equipment damage, replacement cost, damage waiver, lost equipment, stolen equipment"
      />
      <section className="py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-6">
            <BackButton />
          </div>
          <h1 className="text-4xl font-heading font-bold text-center mb-4">Damage & Loss Policy</h1>
          <p className="text-center text-muted-foreground">Last Updated: November 28, 2025</p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4 max-w-4xl">
        <Card>
          <CardContent className="p-8 space-y-8">
            <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-8 w-8 text-orange-600 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-heading font-bold mb-2">Your Responsibility</h2>
                  <p className="text-muted-foreground">
                    As the renter, you are responsible for the care and safekeeping of all equipment during your rental period. This includes protection against damage, loss, and theft. Please read this policy carefully to understand your obligations and options.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">1. Definition of Normal Wear vs. Damage</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">Normal Wear (Acceptable)</h3>
                  </div>
                  <ul className="text-sm text-green-700 space-y-2">
                    <li>- Light surface scratches on non-display areas</li>
                    <li>- Minor scuff marks on cases</li>
                    <li>- Slight wear on keyboard keys</li>
                    <li>- Light dust accumulation</li>
                    <li>- Minor cable wear from normal plugging/unplugging</li>
                    <li>- Battery degradation within normal parameters</li>
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <FileWarning className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold text-red-800">Damage (Chargeable)</h3>
                  </div>
                  <ul className="text-sm text-red-700 space-y-2">
                    <li>- Cracked or broken screens</li>
                    <li>- Dents, gouges, or deep scratches</li>
                    <li>- Water or liquid damage</li>
                    <li>- Broken ports, buttons, or hinges</li>
                    <li>- Burn marks or heat damage</li>
                    <li>- Internal component damage</li>
                    <li>- Unauthorized modifications</li>
                    <li>- Malware or virus infection</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">2. Damage Categories & Charges</h2>
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-yellow-100 p-4 border-b">
                    <h3 className="font-semibold text-lg">Level 1: Minor Damage</h3>
                    <p className="text-sm text-muted-foreground">Cosmetic issues that don't affect functionality</p>
                  </div>
                  <div className="p-4">
                    <p className="text-muted-foreground mb-2">Examples: Surface scratches on casing, minor scuffs, loose but functional buttons</p>
                    <p className="font-semibold">Charge: $25-$75</p>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-orange-100 p-4 border-b">
                    <h3 className="font-semibold text-lg">Level 2: Moderate Damage</h3>
                    <p className="text-sm text-muted-foreground">Damage that affects appearance or minor functionality</p>
                  </div>
                  <div className="p-4">
                    <p className="text-muted-foreground mb-2">Examples: Cracked (but functional) screen, broken keyboard keys, damaged ports</p>
                    <p className="font-semibold">Charge: $75-$300</p>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-red-100 p-4 border-b">
                    <h3 className="font-semibold text-lg">Level 3: Major Damage</h3>
                    <p className="text-sm text-muted-foreground">Significant damage affecting core functionality</p>
                  </div>
                  <div className="p-4">
                    <p className="text-muted-foreground mb-2">Examples: Non-functional screen, water damage, bent chassis, failed hard drive</p>
                    <p className="font-semibold">Charge: $300-$800 or cost of repair</p>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-red-200 p-4 border-b">
                    <h3 className="font-semibold text-lg">Level 4: Total Loss / Beyond Repair</h3>
                    <p className="text-sm text-muted-foreground">Equipment cannot be repaired or is missing</p>
                  </div>
                  <div className="p-4">
                    <p className="text-muted-foreground mb-2">Examples: Severe water damage, fire damage, completely non-functional, lost or stolen</p>
                    <p className="font-semibold">Charge: Full replacement value (retail price at time of rental)</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">3. Replacement Cost Schedule</h2>
              <p className="text-muted-foreground mb-4">
                In case of total loss, the following replacement values apply (based on current retail pricing):
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th className="p-3 border font-semibold">Equipment Type</th>
                      <th className="p-3 border font-semibold">Replacement Value Range</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr>
                      <td className="p-3 border">Standard Laptops</td>
                      <td className="p-3 border">$800 - $2,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Premium Laptops (Dell XPS, HP Spectre, etc.)</td>
                      <td className="p-3 border">$1,500 - $4,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Desktop PCs</td>
                      <td className="p-3 border">$600 - $3,500</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Professional Cameras (Bodies)</td>
                      <td className="p-3 border">$1,000 - $6,500</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Camera Lenses</td>
                      <td className="p-3 border">$300 - $3,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Cinema/Video Cameras</td>
                      <td className="p-3 border">$3,000 - $25,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Printers (Consumer)</td>
                      <td className="p-3 border">$200 - $800</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Printers (Commercial/Wide Format)</td>
                      <td className="p-3 border">$1,000 - $5,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Network Equipment</td>
                      <td className="p-3 border">$100 - $1,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Premium Headphones</td>
                      <td className="p-3 border">$150 - $600</td>
                    </tr>
                    <tr>
                      <td className="p-3 border">Professional Audio Equipment</td>
                      <td className="p-3 border">$200 - $2,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                The exact replacement value for your rented equipment is listed in your rental agreement and order confirmation.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">4. Damage Waiver Insurance</h2>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <Shield className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Optional Damage Waiver Protection</h3>
                    <p className="text-muted-foreground mb-4">
                      Reduce your financial risk with our Damage Waiver program:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="font-semibold">Standard Protection</p>
                        <p className="text-sm text-muted-foreground">10% of rental cost per day</p>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li>- Maximum liability: $150</li>
                          <li>- Covers accidental damage</li>
                          <li>- Covers theft (with police report)</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold">Premium Protection</p>
                        <p className="text-sm text-muted-foreground">15% of rental cost per day</p>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li>- Maximum liability: $50</li>
                          <li>- Covers accidental damage</li>
                          <li>- Covers theft (with police report)</li>
                          <li>- Covers loss (with documentation)</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>What's NOT covered:</strong> Intentional damage, negligence, damage from prohibited use, cosmetic-only damage, and damage caused by third parties you allowed to use the equipment.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">5. Lost Equipment Procedures</h2>
              <p className="text-muted-foreground mb-4">
                If you lose rented equipment, follow these steps immediately:
              </p>
              <ol className="list-decimal list-inside text-muted-foreground space-y-3">
                <li>
                  <span className="font-semibold">Contact Us Immediately</span>
                  <p className="ml-6 text-sm">Contact our support team or email us within 24 hours of discovering the loss.</p>
                </li>
                <li>
                  <span className="font-semibold">Document the Circumstances</span>
                  <p className="ml-6 text-sm">Write down when and where you last had the equipment, and the circumstances of the loss.</p>
                </li>
                <li>
                  <span className="font-semibold">File a Report (if theft suspected)</span>
                  <p className="ml-6 text-sm">File a police report and provide us with the report number.</p>
                </li>
                <li>
                  <span className="font-semibold">Submit Lost Item Form</span>
                  <p className="ml-6 text-sm">Complete the lost item form in your account dashboard or as provided by support.</p>
                </li>
                <li>
                  <span className="font-semibold">Await Assessment</span>
                  <p className="ml-6 text-sm">We will review your case and determine applicable charges within 3-5 business days.</p>
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">6. Theft Reporting</h2>
              <p className="text-muted-foreground mb-4">
                If equipment is stolen:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>File a police report within 24 hours of discovering the theft</li>
                <li>Obtain a copy of the police report or case number</li>
                <li>Contact RentMyGadgets immediately to report the theft</li>
                <li>Provide us with the police report and any other relevant documentation</li>
                <li>Cooperate with any investigation</li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-4">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Failure to file a police report may result in full replacement charges, even if you have Damage Waiver coverage. Theft from an unsecured location or vehicle may not be covered.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">7. Force Majeure Exceptions</h2>
              <p className="text-muted-foreground mb-4">
                You will not be held liable for damage or loss resulting from:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Natural disasters (earthquake, flood, hurricane, tornado)</li>
                <li>Acts of war or terrorism</li>
                <li>Civil unrest or riots</li>
                <li>Government actions beyond your control</li>
                <li>Power surges from utility provider failures</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Documentation of the force majeure event may be required (news reports, insurance claims, etc.).
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">8. How Damage Charges Are Processed</h2>
              <ol className="list-decimal list-inside text-muted-foreground space-y-3">
                <li>Damage is identified during return inspection</li>
                <li>You receive email notification with photos and description</li>
                <li>Repair estimate or replacement cost is provided</li>
                <li>You have 7 days to dispute the findings</li>
                <li>If undisputed, charges are deducted from security deposit</li>
                <li>If charges exceed deposit, your payment method on file is charged</li>
                <li>Payment plans may be available for large amounts (contact support)</li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">9. Prevention Tips</h2>
              <p className="text-muted-foreground mb-4">
                Protect yourself and the equipment:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Use provided carrying cases and protective covers</li>
                <li>Never leave equipment visible in vehicles</li>
                <li>Keep equipment away from water and extreme temperatures</li>
                <li>Take photos of equipment condition upon delivery</li>
                <li>Don't share equipment with others not on the rental agreement</li>
                <li>Consider purchasing Damage Waiver for peace of mind</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">10. Contact Us</h2>
              <p className="text-muted-foreground">
                For damage or loss inquiries:
              </p>
              <div className="mt-4 text-muted-foreground">
                <p>Email: claims@rentmygadgets.com</p>
                <p>Phone: Contact us through your dashboard</p>
                <p>For urgent theft/loss reports, email claims@rentmygadgets.com with "URGENT" in the subject line.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}
