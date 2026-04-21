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
  Smartphone,
  Phone,
  PhoneCall,
  CheckCircle,
  ArrowRight,
  HelpCircle,
  Shield,
  Clock,
  DollarSign,
  RefreshCcw,
  Package,
  TrendingDown,
  Sparkles,
  Mail,
  Battery,
  Wifi,
  Zap,
  Camera
} from "lucide-react";

const rentalSteps = [
  {
    step: 1,
    title: "Pick your smartphone",
    description: "Browse our smartphone, mobile phone, and cell phone categories to find the perfect device for your lifestyle, work, or travel needs."
  },
  {
    step: 2,
    title: "Choose your rental term",
    description: "Rental periods start at 1 month and extend to 12 months, with progressive discounts: 10% off 3-month rentals, 20% off 6-month rentals, and 30% off 12-month rentals."
  },
  {
    step: 3,
    title: "Get fast delivery",
    description: "Place your order and we'll ship your smartphone quickly — fast delivery available in select metro areas, with standard shipping in 3–5 business days."
  },
  {
    step: 4,
    title: "Use it like it's yours",
    description: "Every rental arrives SIM-ready with a charger, screen protector, and protective case. Free technical support is included throughout your rental."
  },
  {
    step: 5,
    title: "Return, swap, or extend",
    description: "When your term ends, send it back with a prepaid shipping label, upgrade to the newest model, or extend your rental — the choice is yours."
  }
];

const includedFeatures = [
  { icon: <Wifi className="h-5 w-5" />, text: "SIM-ready and unlocked for any carrier" },
  { icon: <Zap className="h-5 w-5" />, text: "Fast charger and cable included" },
  { icon: <Shield className="h-5 w-5" />, text: "Tempered glass screen protector pre-applied" },
  { icon: <Package className="h-5 w-5" />, text: "Protective phone case included" },
  { icon: <Phone className="h-5 w-5" />, text: "7-day tech support by phone, chat, or email" },
  { icon: <RefreshCcw className="h-5 w-5" />, text: "Replacement device ships within 24 hours if yours fails" }
];

const faqs = [
  {
    question: "Are rental smartphones unlocked for any carrier?",
    answer: "Yes. Every smartphone we rent is factory unlocked and compatible with all major U.S. carriers including AT&T, T-Mobile, and Verizon. Simply insert your SIM card and you're ready to go."
  },
  {
    question: "Can I rent a smartphone for just one month?",
    answer: "Absolutely. All of our smartphone rentals start at a one-month minimum with no long-term commitment required. Rent for as long or as short as you need."
  },
  {
    question: "What condition are the rental phones in?",
    answer: "Every device is professionally inspected, sanitized, and graded. Most units are in like-new or excellent condition with minimal cosmetic wear. Each phone is fully tested for battery health, screen quality, and performance before shipping."
  },
  {
    question: "What happens if I damage the phone?",
    answer: "With optional damage protection ($9/month), we cover accidental drops, cracked screens, and liquid damage. We'll ship a replacement within 24 hours at no extra charge."
  },
  {
    question: "Can I buy the phone at the end of my rental?",
    answer: "Yes. At the end of your rental term, you have the option to purchase the device at a discounted price based on its current market value. A portion of your rental payments may be applied toward the purchase."
  }
];

export default function SmartphoneRentals() {
  return (
    <Layout>
      <SeoHead
        title="Smartphone Rentals | Latest Phones for Work, Travel & Daily Life"
        description="Rent premium smartphones with sharp displays, powerful cameras, and long battery life. Flexible monthly plans, no long-term contracts, always the latest models."
        keywords="smartphone rental, phone rental, rent smartphone, rent phone, mobile phone rental, cell phone rental, iPhone rental, Samsung rental"
      />

      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-blue-50 to-background">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6" data-testid="badge-smartphone-rentals">
              <Smartphone className="h-4 w-4" />
              Smartphone Rentals
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6" data-testid="text-page-title">
              Rent the Latest Smartphones Without the Price Tag
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              RentMyGadgets offers flexible monthly rentals on premium smartphones from Apple, Samsung, Google, and OnePlus. Get flagship features — stunning displays, pro-grade cameras, and all-day battery life — without the $1,000+ commitment. No carrier contracts. No depreciation headaches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/categories/phones">
                <Button size="lg" className="rounded-full" data-testid="button-browse-smartphones">
                  Browse Smartphones <ArrowRight className="ml-2 h-4 w-4" />
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
            <h2 className="text-3xl font-heading font-bold mb-6 text-center" data-testid="text-why-rent">Why Rent Instead of Buying?</h2>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10 leading-relaxed">
              Buying a flagship smartphone outright means spending $1,000 or more on a device that loses value the moment you unbox it. Renting gives you the freedom to stay current without the financial burden.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-blue-200 transition-colors" data-testid="card-benefit-latest">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                    <RefreshCcw className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Always Latest Model</h3>
                  <p className="text-sm text-muted-foreground">Upgrade to the newest iPhone, Galaxy, or Pixel the moment it drops — no trade-in hassles, no waiting for carrier deals.</p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-blue-200 transition-colors" data-testid="card-benefit-no-contract">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">No Contract Lock-in</h3>
                  <p className="text-sm text-muted-foreground">Month-to-month flexibility means you're never stuck in a 24-month installment plan. Rent for a week, a month, or a year — your call.</p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-blue-200 transition-colors" data-testid="card-benefit-try">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
                    <TrendingDown className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Try Before Committing</h3>
                  <p className="text-sm text-muted-foreground">Not sure if you want iOS or Android? Rent both and decide with real-world experience instead of guessing from spec sheets.</p>
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

              <div data-testid="section-smartphones">
                <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-5">
                  <Smartphone className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Smartphone Rentals</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Smartphones with sharp displays, strong cameras, and long battery life for daily home use. Our smartphone inventory features the latest flagship and mid-range models — perfect for staying connected, capturing memories, and powering through your day.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> OLED and AMOLED displays with vivid color accuracy</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Pro-grade camera systems with night mode and 4K video</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> All-day battery life with fast charging support</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Popular models: iPhone 16 Pro, Samsung Galaxy S25 Ultra</li>
                </ul>
              </div>

              <div data-testid="section-mobile-phones">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mb-5">
                  <Phone className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Mobile Phone Rentals</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Mobile phones with clear screens, smooth performance, and long battery life for daily use. Whether you need a reliable device for home or work, our mobile phone rentals deliver dependable performance without the premium price tag.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Clear, responsive touchscreens for everyday tasks</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Smooth multitasking with modern processors</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Extended battery life for all-day reliability</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Popular models: Google Pixel 9, OnePlus 13</li>
                </ul>
              </div>

              <div data-testid="section-cell-phones">
                <div className="w-14 h-14 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-5">
                  <PhoneCall className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Cell Phone Rentals</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Cell phones with sharp cameras, clear calls, and lasting battery life for work and travel. Ideal for business trips, international travel, or as a temporary backup device — our cell phone rentals keep you connected wherever life takes you.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Crystal-clear call quality with noise cancellation</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Sharp cameras for photos, video calls, and scanning</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Long-lasting battery built for travel days</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Unlocked for domestic and international SIM cards</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4" data-testid="text-how-it-works">How Our Rental Process Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From browsing to calling in five simple steps.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {rentalSteps.map((item, index) => (
              <div key={item.step} className="relative" data-testid={`step-${item.step}`}>
                {index < rentalSteps.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-full bg-gradient-to-b from-blue-500 to-blue-200 hidden md:block" />
                )}
                <div className="flex gap-6 mb-8">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
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

      <section className="py-16 bg-blue-50/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center mb-10" data-testid="text-whats-included">
              What's Included with Every Smartphone Rental
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {includedFeatures.map((feature, index) => (
                <Card key={index} className="bg-white" data-testid={`included-${index}`}>
                  <CardContent className="p-5 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
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
              <HelpCircle className="h-8 w-8 text-blue-600" />
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
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <Smartphone className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4" data-testid="text-cta-title">
                Ready to Rent a Smartphone?
              </h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                Browse our full smartphone catalog or chat with a specialist to find the perfect phone for your lifestyle, work, or travel needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/categories/phones">
                  <Button size="lg" variant="secondary" className="rounded-full w-full sm:w-auto" data-testid="button-browse-catalog">
                    Browse Smartphone Catalog
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