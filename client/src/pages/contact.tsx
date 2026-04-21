import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import StructuredData from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, CheckCircle, ArrowLeft } from "lucide-react";

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    setSubmittedName(name.split(" ")[0] || "");
    setIsSubmitted(true);
  };

  const handleSendAnother = () => {
    setIsSubmitted(false);
    setSubmittedName("");
  };

  return (
    <Layout>
      <StructuredData type="webPage" pageType="ContactPage" name="Contact RentMyGadgets" description="Reach our customer support team for help with rentals, returns, and account questions." url="https://rentmygadgets.com/contact" />
      <SeoHead 
        title="Contact Us"
        description="Get in touch with RentMyGadgets. Questions about rentals? Need a custom quote? We're here to help. Email us anytime."
        keywords="contact us, customer support, rental inquiries, tech support, get quote, rental help, customer service"
      />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-muted-foreground mb-12">
              Have a question about a rental? Need a custom quote for your business? We're here to help.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Email Us</h3>
                  <p className="text-muted-foreground">{`support${"\u0040"}rentmygadgets.com`}</p>
                  <p className="text-muted-foreground">{`sales${"\u0040"}rentmygadgets.com`}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Visit HQ</h3>
                  <p className="text-muted-foreground">
                    PC Rental, LLC<br />
                    2393 Seabreeze Dr SE<br />
                    Darien, GA 31305-5425<br />
                    United States
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-3xl p-8 shadow-sm">
            {isSubmitted ? (
              <div className="text-center py-8" data-testid="thank-you-message">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Thank You{submittedName ? `, ${submittedName}` : ""}!</h2>
                <p className="text-lg text-muted-foreground mb-2">
                  Your message has been received.
                </p>
                <p className="text-muted-foreground mb-8">
                  We'll get back to you within 24 hours. In the meantime, feel free to browse our rental catalog.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleSendAnother} variant="outline" data-testid="button-send-another">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Send Another Message
                  </Button>
                  <Link href="/categories">
                    <Button data-testid="button-browse-catalog">Browse Catalog</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" placeholder="John Doe" required data-testid="input-contact-name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="john@example.com" required data-testid="input-contact-email" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" name="subject" placeholder="Rental Inquiry" required data-testid="input-contact-subject" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" placeholder="Tell us what you need..." className="min-h-[150px]" required data-testid="input-contact-message" />
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full h-12 text-base" data-testid="button-send-message">
                    Send Message
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
