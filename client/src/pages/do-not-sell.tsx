import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, AlertCircle } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function DoNotSell() {
  return (
    <Layout>
      <SeoHead 
        title="Do Not Sell or Share My Personal Information"
        description="Exercise your right to opt-out of the sale or sharing of your personal information under CCPA. RentMyGadgets respects your privacy choices."
        keywords="do not sell, opt out, personal information, CCPA, privacy rights, data sharing"
      />
      <section className="py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-6">
            <BackButton />
          </div>
          <h1 className="text-4xl font-heading font-bold text-center mb-4">Do Not Sell or Share My Personal Information</h1>
          <p className="text-center text-muted-foreground">Your California Privacy Rights</p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4 max-w-3xl">
        <Card>
          <CardContent className="p-8 space-y-8">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-xl font-heading font-bold mb-2">Your Right to Opt-Out</h2>
                <p className="text-muted-foreground">
                  Under the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA), California residents have the right to opt-out of the "sale" or "sharing" of their personal information.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">What This Means</h2>
              <p className="text-muted-foreground mb-4">
                While RentMyGadgets does not sell your personal information for monetary compensation, certain data sharing activities may be considered a "sale" or "sharing" under California law, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Sharing data with advertising partners for targeted advertising</li>
                <li>Using cookies or tracking technologies that share data with third parties</li>
                <li>Participating in cross-context behavioral advertising programs</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                Automatic Opt-Out Methods
              </h3>
              <p className="text-muted-foreground mb-4">
                You can also opt-out automatically by:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Global Privacy Control (GPC):</strong> Enable GPC in your browser settings. We honor GPC signals automatically.</li>
                <li><strong>Cookie Settings:</strong> Use our cookie consent tool to disable marketing and advertising cookies.</li>
                <li><strong>Browser Settings:</strong> Enable "Do Not Track" in your browser (though not all partners honor this).</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">What Happens After You Opt-Out</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>We will stop sharing your personal information with third parties for advertising purposes</li>
                <li>You will no longer receive personalized ads based on your browsing activity on our site</li>
                <li>You will still receive our services and can make purchases normally</li>
                <li>You may still see non-personalized ads</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">Authorized Agent</h2>
              <p className="text-muted-foreground">
                You may use an authorized agent to submit an opt-out request on your behalf. To do so, please provide us with:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Written authorization signed by you</li>
                <li>Proof of the agent's identity</li>
                <li>The email address associated with your account</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Send authorized agent requests to: privacy@rentmygadgets.com
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">Questions?</h2>
              <p className="text-muted-foreground">
                If you have questions about this opt-out process or your privacy rights, please contact us:
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
