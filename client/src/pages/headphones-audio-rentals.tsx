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
  Headphones,
  Keyboard,
  Mouse,
  CheckCircle,
  ArrowRight,
  HelpCircle,
  Shield,
  Phone,
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
  Music
} from "lucide-react";

const rentalSteps = [
  {
    step: 1,
    title: "Pick your gear",
    description: "Browse our headphone, keyboard, and mouse categories and choose the model that fits your workflow, gaming setup, or music needs."
  },
  {
    step: 2,
    title: "Select your term",
    description: "Rental periods start at 1 month and extend to 12 months, with progressive discounts: 10% off 3-month rentals, 20% off 6-month rentals, and 30% off 12-month rentals."
  },
  {
    step: 3,
    title: "Get fast delivery",
    description: "Order and we'll ship your accessories quickly — fast delivery available in select metro areas, with standard shipping in 3–5 business days."
  },
  {
    step: 4,
    title: "Enjoy premium sound & control",
    description: "Every rental includes all necessary cables, batteries, and free technical support so you can start using your gear right out of the box."
  },
  {
    step: 5,
    title: "Return or upgrade",
    description: "When your term ends, send it back with a prepaid shipping label — or upgrade to the latest model and keep your setup fresh."
  }
];

const includedFeatures = [
  { icon: <Zap className="h-5 w-5" />, text: "All necessary cables and adapters included" },
  { icon: <Battery className="h-5 w-5" />, text: "Fully charged batteries and USB receivers" },
  { icon: <Package className="h-5 w-5" />, text: "Carrying case or protective pouch included" },
  { icon: <Phone className="h-5 w-5" />, text: "7-day tech support by phone, chat, or email" },
  { icon: <RefreshCcw className="h-5 w-5" />, text: "Replacement units ship within 24 hours if device fails" },
  { icon: <Sparkles className="h-5 w-5" />, text: "Professional cleaning kit for hygiene and care" }
];

const faqs = [
  {
    question: "Can I rent headphones for just one month?",
    answer: "Yes. All of our headphone rentals start at a one-month minimum with no long-term commitment — perfect for testing a model before buying or using premium audio for a short project."
  },
  {
    question: "Are rented headphones cleaned and sanitized?",
    answer: "Absolutely. Every pair of headphones is professionally cleaned, sanitized, and inspected before shipping. We include a cleaning kit so you can maintain hygiene throughout your rental."
  },
  {
    question: "Do mechanical keyboards come with custom keycaps?",
    answer: "Our mechanical keyboards ship with their factory keycaps. If you'd like to try different switch types or layouts, you can swap to a different keyboard model at any time during your rental."
  },
  {
    question: "What happens if my mouse or keyboard stops working?",
    answer: "With optional damage protection ($5/month for accessories), we cover all repairs and ship a replacement unit within 24 hours at no charge."
  },
  {
    question: "Can I rent a complete desk setup — headphones, keyboard, and mouse?",
    answer: "Yes! Many customers bundle accessories together. Rent all three and enjoy a unified premium workspace experience with a single monthly payment."
  }
];

export default function HeadphonesAudioRentals() {
  return (
    <Layout>
      <SeoHead
        title="Headphones & Accessories Rentals | Audio Gear, Keyboards & Mice"
        description="Rent premium headphones, mechanical keyboards, and ergonomic mice for work, gaming, and music. Flexible monthly plans, no long-term contracts."
        keywords="headphone rental, keyboard rental, mouse rental, rent headphones, gaming headset rental, mechanical keyboard rental, ergonomic mouse rental"
      />

      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-purple-50 to-background">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6" data-testid="badge-audio-rentals">
              <Headphones className="h-4 w-4" />
              Headphones & Accessories
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6" data-testid="text-page-title">
              Rent Premium Audio Gear & Accessories
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              RentMyGadgets offers flexible monthly rentals on top-tier headphones, mechanical keyboards, and ergonomic mice from brands like Sony, Bose, Sennheiser, Logitech, and Razer. Experience premium sound and precision control without the upfront investment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/categories/accessories">
                <Button size="lg" className="rounded-full" data-testid="button-browse-accessories">
                  Browse Accessories <ArrowRight className="ml-2 h-4 w-4" />
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
              Premium headphones and accessories lose value fast, and technology moves even faster. Renting lets you stay on the cutting edge without the commitment or waste.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-purple-200 transition-colors" data-testid="card-benefit-try">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
                    <Music className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Try Before You Buy</h3>
                  <p className="text-sm text-muted-foreground">Not sure if noise-canceling is right for you? Rent a pair for a month and decide with real-world experience, not guesswork.</p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-purple-200 transition-colors" data-testid="card-benefit-upgraded">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                    <RefreshCcw className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Always Upgraded</h3>
                  <p className="text-sm text-muted-foreground">Swap to the newest model whenever you want. No selling old gear, no buyer's remorse — just the latest tech delivered to your door.</p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-purple-200 transition-colors" data-testid="card-benefit-waste">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                    <TrendingDown className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Zero Waste</h3>
                  <p className="text-sm text-muted-foreground">Renting extends product lifecycles and reduces e-waste. Enjoy premium gear knowing your choice is better for the planet.</p>
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

              <div data-testid="section-headphone-rentals">
                <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-5">
                  <Headphones className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Headphone Rentals</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Headphones with clear sound, comfy fit, and long battery life for music, calls, or gaming. Our collection spans over-ear noise-canceling headphones, wireless earbuds, and studio monitors from Sony, Bose, Sennheiser, and Beats — so you hear every detail without compromise.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Active noise cancellation for focused listening</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Up to 30+ hours of battery life per charge</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Bluetooth 5.3 and multipoint connectivity</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Popular models: Sony WH-1000XM5, Bose QC Ultra, AirPods Max</li>
                </ul>
              </div>

              <div data-testid="section-keyboard-rentals">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center mb-5">
                  <Keyboard className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Keyboard Rentals</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Keyboards with quiet keys, strong build, and smooth action for busy office and home desks. From tactile mechanical switches to slim wireless designs, our keyboard rentals help you type faster and more comfortably — whether you're coding, writing, or gaming.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Mechanical, membrane, and low-profile options</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Wireless and Bluetooth multi-device pairing</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Ergonomic split designs for all-day comfort</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Popular models: Logitech MX Keys, Keychron Q1, Razer BlackWidow</li>
                </ul>
              </div>

              <div data-testid="section-mouse-rentals">
                <div className="w-14 h-14 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-5">
                  <Mouse className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Mouse Rentals</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Computer mice with smooth glide, quiet clicks, and comfort grip for daily work and gaming. Whether you need pixel-perfect precision for design work or lightning-fast response for competitive gaming, our mouse rentals deliver performance you can feel.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Ergonomic shapes to prevent wrist strain</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> High-precision sensors up to 25,600 DPI</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Wireless with ultra-low latency for gaming</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Popular models: Logitech MX Master 3S, Razer DeathAdder V3</li>
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
              From browsing to listening and typing in five simple steps.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {rentalSteps.map((item, index) => (
              <div key={item.step} className="relative" data-testid={`step-${item.step}`}>
                {index < rentalSteps.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-full bg-gradient-to-b from-purple-500 to-purple-200 hidden md:block" />
                )}
                <div className="flex gap-6 mb-8">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
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

      <section className="py-16 bg-purple-50/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center mb-10" data-testid="text-whats-included">
              What's Included with Every Accessories Rental
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {includedFeatures.map((feature, index) => (
                <Card key={index} className="bg-white" data-testid={`included-${index}`}>
                  <CardContent className="p-5 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
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
              <HelpCircle className="h-8 w-8 text-purple-600" />
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
          <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <Headphones className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4" data-testid="text-cta-title">
                Ready to Rent Premium Audio Gear?
              </h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                Browse our full accessories catalog or chat with a specialist to find the perfect headphones, keyboard, or mouse for your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/categories/accessories">
                  <Button size="lg" variant="secondary" className="rounded-full w-full sm:w-auto" data-testid="button-browse-catalog">
                    Browse Accessories Catalog
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