// @ts-nocheck
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Printer,
  Zap,
  Palette,
  Minimize2,
  CheckCircle,
  ArrowRight,
  HelpCircle,
  Wifi,
  Shield,
  Phone,
  Clock,
  DollarSign,
  RefreshCcw,
  Headphones,
  Package,
  TrendingDown,
  Sparkles,
  Mail
} from "lucide-react";

const rentalSteps = [
  {
    step: 1,
    title: "Choose your printer",
    description: "Browse our laser printer, color laser printer, and small office printer categories and pick the model that matches your volume."
  },
  {
    step: 2,
    title: "Select your term",
    description: "Rental periods start at 1 month and extend to 12 months, with progressive discounts: 10% off 3-month rentals, 20% off 6-month rentals, and 30% off 12-month rentals."
  },
  {
    step: 3,
    title: "Get fast delivery",
    description: "Order and we'll deliver your office printer quickly — fast delivery available in select metro areas, with standard shipping in 3–5 business days."
  },
  {
    step: 4,
    title: "Print with confidence",
    description: "Every rental includes free technical support, optional damage protection, and toner replacement at cost."
  },
  {
    step: 5,
    title: "Return or swap",
    description: "When your term ends, we pick it up with a prepaid shipping label — or upgrade to a newer model anytime."
  }
];

const includedFeatures = [
  { icon: <Wifi className="h-5 w-5" />, text: "Wi-Fi, Ethernet, and USB connectivity" },
  { icon: <Phone className="h-5 w-5" />, text: "Mobile printing support (AirPrint, Mopria, Google Cloud Print)" },
  { icon: <Package className="h-5 w-5" />, text: "Starter toner cartridge included" },
  { icon: <Sparkles className="h-5 w-5" />, text: "One-page setup guide for quick start" },
  { icon: <Headphones className="h-5 w-5" />, text: "7-day tech support by phone, chat, or email" },
  { icon: <RefreshCcw className="h-5 w-5" />, text: "Replacement units ship within 24 hours if device fails" }
];

const faqs = [
  {
    question: "What's the cheapest office printer I can rent?",
    answer: "Small office printer rentals start at $29 per month for entry-level monochrome laser printers — ideal for solo professionals and home offices."
  },
  {
    question: "Is a color laser printer worth renting over an inkjet?",
    answer: "Yes. A color laser printer has a lower cost per page, sharper output on plain paper, and no dried-ink issues — all of which matter when printing is mission-critical."
  },
  {
    question: "Can I rent a laser printer for just one month?",
    answer: "Absolutely. All of our laser printer rentals start at a one-month minimum with no long-term commitment."
  },
  {
    question: "Do rentals include toner?",
    answer: "Every office printer rental includes a starter toner cartridge. Replacements are available at wholesale cost and shipped free to active renters."
  },
  {
    question: "What happens if my printer breaks?",
    answer: "With optional damage protection ($9/month), we cover all repairs and ship a replacement unit within 24 hours at no charge."
  }
];

export default function OfficePrinterRentals() {
  return (
    <Layout>
      <SeoHead
        title="Office Printer Rentals | Laser & Color Laser Printers for Small Offices"
        description="Rent a reliable office printer, laser printer, or color laser printer for your small office. Flexible monthly plans, fast delivery in select areas, no long-term contracts."
        keywords="office printer rental, laser printer rental, color laser printer rental, small office printer, rent office printer, business printer rental, monthly printer rental, HP printer rental, Brother printer rental, Canon printer rental"
      />

      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-orange-50 to-background">
        <div className="absolute top-20 right-10 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6" data-testid="badge-printer-rentals">
              <Printer className="h-4 w-4" />
              Office Printer Rentals
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6" data-testid="text-page-title">
              Rent the Right Office Printer for Your Business
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              RentMyGadgets offers flexible monthly rentals on business-grade laser printers, color laser printers, and compact small office printers from brands you already trust — HP, Brother, Canon, Xerox, and Epson. No five-figure purchases. No three-year leases.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/collections/printers-scanners">
                <Button size="lg" className="rounded-full" data-testid="button-browse-printers">
                  Browse Office Printers <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="rounded-full" data-testid="button-learn-how">
                  How It Works
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold mb-6 text-center" data-testid="text-why-rent">Why Rent an Office Printer Instead of Buying?</h2>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10 leading-relaxed">
              Buying an office printer outright locks up cash, ties you to one device for years, and leaves you responsible for toner, maintenance, and eventual disposal. Renting flips that equation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-orange-200 transition-colors" data-testid="card-benefit-flexibility">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
                    <RefreshCcw className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Swap Anytime</h3>
                  <p className="text-sm text-muted-foreground">If your print volume changes or a better model comes out, swap devices instead of selling used equipment at a loss.</p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-orange-200 transition-colors" data-testid="card-benefit-savings">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Predictable Costs</h3>
                  <p className="text-sm text-muted-foreground">No surprise repair bills, no maintenance contracts, and optional damage protection for complete peace of mind.</p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-orange-200 transition-colors" data-testid="card-benefit-scale">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                    <TrendingDown className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">No Depreciation</h3>
                  <p className="text-sm text-muted-foreground">For small offices, startups, and project-based teams, renting keeps your balance sheet lean and your office printing modern.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              <div data-testid="section-laser-printers">
                <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-5">
                  <Zap className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Laser Printer Rentals</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  A laser printer is the workhorse of any productive office. Our laser printer inventory includes monochrome models delivering crisp black-and-white documents at 35–55 pages per minute, with duty cycles built for teams that actually print.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Starter toner cartridge included</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Duplex (two-sided) printing enabled</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Wireless connectivity for the whole team</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Popular models: HP LaserJet Pro, Brother HL-L6210DW</li>
                </ul>
              </div>

              <div data-testid="section-color-laser">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center mb-5">
                  <Palette className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Color Laser Printer Rentals</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  When black-and-white won't cut it, a color laser printer delivers the sharp, professional output your proposals, presentations, and marketing collateral deserve — without smearing, drying out, or burning through expensive ink.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> True-to-brand color accuracy</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Workgroup devices rated for 75,000+ pages/month</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Compact desktop to floor-standing units</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Popular models: HP Color LaserJet Pro, Canon imageCLASS</li>
                </ul>
              </div>

              <div data-testid="section-small-office">
                <div className="w-14 h-14 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-5">
                  <Minimize2 className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Small Office Printer Rentals</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Tight on space? Our small office printer lineup fits on a credenza or shelf while still delivering laser-quality output, wireless printing, and automatic document feeders for scanning and copying.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Ideal for freelancers and 2–5 person teams</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Starting at $29/month for entry-level models</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> ADF scanning and mobile print support</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Compact footprint for home offices and co-working</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4" data-testid="text-how-it-works">How Our Printer Rental Process Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From browsing to printing in five simple steps.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {rentalSteps.map((item, index) => (
              <div key={item.step} className="relative" data-testid={`step-${item.step}`}>
                {index < rentalSteps.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-full bg-gradient-to-b from-orange-500 to-orange-200 hidden md:block" />
                )}
                <div className="flex gap-6 mb-8">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-orange-50/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center mb-10" data-testid="text-whats-included">
              What's Included with Every Office Printer Rental
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {includedFeatures.map((feature, index) => (
                <Card key={index} className="bg-white" data-testid={`included-${index}`}>
                  <CardContent className="p-5 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      {feature.icon}
                    </div>
                    <p className="text-sm font-medium pt-2">{feature.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 justify-center mb-8">
              <HelpCircle className="h-8 w-8 text-orange-600" />
              <h2 className="text-3xl font-heading font-bold" data-testid="text-faq-title">Frequently Asked Questions</h2>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-white rounded-lg border px-6"
                  data-testid={`faq-${index}`}
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-orange-500 to-amber-600 text-white overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <Printer className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4" data-testid="text-cta-title">
                Ready to Rent an Office Printer?
              </h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                Browse our full office printer catalog or chat with a specialist to get a model recommendation for your team's print volume.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/collections/printers-scanners">
                  <Button size="lg" variant="secondary" className="rounded-full w-full sm:w-auto" data-testid="button-browse-catalog">
                    Browse Printer Catalog
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto border-white/30 text-white hover:bg-white/10" data-testid="button-talk-specialist">
                    <Mail className="mr-2 h-4 w-4" /> Talk to a Specialist
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
