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
  Wifi,
  Radio,
  Globe,
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
  Zap,
  Signal
} from "lucide-react";

const rentalSteps = [
  {
    step: 1,
    title: "Choose your router",
    description: "Browse our router, WiFi router, and wireless router categories and pick the model that matches your coverage needs and internet speed."
  },
  {
    step: 2,
    title: "Select your term",
    description: "Rental periods start at 1 month and extend to 12 months, with progressive discounts: 10% off 3-month rentals, 20% off 6-month rentals, and 30% off 12-month rentals."
  },
  {
    step: 3,
    title: "Get fast delivery",
    description: "Order and we'll deliver your router quickly — fast delivery available in select metro areas, with standard shipping in 3–5 business days."
  },
  {
    step: 4,
    title: "Connect with confidence",
    description: "Every rental includes free technical support, optional damage protection, and a quick-start setup guide to get you online in minutes."
  },
  {
    step: 5,
    title: "Return or upgrade",
    description: "When your term ends, we pick it up with a prepaid shipping label — or upgrade to a faster, newer model anytime."
  }
];

const includedFeatures = [
  { icon: <Zap className="h-5 w-5" />, text: "Ethernet cable for wired connection included" },
  { icon: <Package className="h-5 w-5" />, text: "Power adapter and all necessary cables" },
  { icon: <Sparkles className="h-5 w-5" />, text: "Quick-start setup guide for easy installation" },
  { icon: <Phone className="h-5 w-5" />, text: "7-day tech support by phone, chat, or email" },
  { icon: <RefreshCcw className="h-5 w-5" />, text: "Replacement units ship within 24 hours if device fails" },
  { icon: <Shield className="h-5 w-5" />, text: "Automatic firmware updates for security and performance" }
];

const faqs = [
  {
    question: "What's the cheapest router I can rent?",
    answer: "Router rentals start at $15 per month for reliable dual-band WiFi routers — perfect for apartments, small homes, and everyday browsing."
  },
  {
    question: "Can I rent a mesh WiFi system for whole-home coverage?",
    answer: "Yes. We offer mesh WiFi systems from brands like Google Nest, Eero, and TP-Link Deco that blanket every room in your home with fast, stable WiFi."
  },
  {
    question: "Do I need my own internet service to use a rented router?",
    answer: "Yes. You'll need an active internet connection from your ISP. Our routers connect to your modem or gateway to broadcast WiFi throughout your space."
  },
  {
    question: "Can I rent a router for just one month?",
    answer: "Absolutely. All of our router rentals start at a one-month minimum with no long-term commitment required."
  },
  {
    question: "What happens if my router stops working?",
    answer: "With optional damage protection ($5/month), we cover all repairs and ship a replacement unit within 24 hours at no charge."
  }
];

export default function RouterRentals() {
  return (
    <Layout>
      <SeoHead
        title="Router Rentals | Fast WiFi Routers for Home & Office"
        description="Rent fast, reliable routers and WiFi systems for home and office. Wide coverage, stable signal, flexible monthly plans, no long-term contracts."
        keywords="router rental, WiFi router rental, wireless router rental, rent router, internet router rental, mesh WiFi rental, home router rental, office router rental"
      />

      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-blue-50 to-background">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6" data-testid="badge-router-rentals">
              <Wifi className="h-4 w-4" />
              Router Rentals
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6" data-testid="text-page-title">
              Rent Fast, Reliable Routers for Home & Office
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              RentMyGadgets offers flexible monthly rentals on high-performance routers, WiFi systems, and wireless networking gear from brands you trust — ASUS, TP-Link, Netgear, Google, and Ubiquiti. No expensive purchases. No outdated hardware.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/categories/routers">
                <Button size="lg" className="rounded-full" data-testid="button-browse-routers">
                  Browse Routers <ArrowRight className="ml-2 h-4 w-4" />
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
            <h2 className="text-3xl font-heading font-bold mb-6 text-center" data-testid="text-why-rent">Why Rent a Router Instead of Buying?</h2>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10 leading-relaxed">
              Buying a router outright means paying full price for technology that becomes outdated within a year or two. Renting gives you the latest gear, predictable monthly costs, and the freedom to upgrade whenever faster standards arrive.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-blue-200 transition-colors" data-testid="card-benefit-latest-tech">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Always Latest Tech</h3>
                  <p className="text-sm text-muted-foreground">Stay ahead with WiFi 6E and WiFi 7 routers. Upgrade to the newest standards without buying new hardware every time.</p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-blue-200 transition-colors" data-testid="card-benefit-costs">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Predictable Costs</h3>
                  <p className="text-sm text-muted-foreground">No surprise repair bills, no maintenance headaches, and optional damage protection for complete peace of mind.</p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-blue-200 transition-colors" data-testid="card-benefit-upgrades">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
                    <RefreshCcw className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Easy Upgrades</h3>
                  <p className="text-sm text-muted-foreground">When faster WiFi standards launch or your needs change, swap to a better router instead of being stuck with outdated gear.</p>
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

              <div data-testid="section-routers">
                <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-5">
                  <Wifi className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Router Rentals</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Routers with fast speeds, wide range, and stable signal for home, office, or everyday use. Our router inventory includes high-performance models delivering blazing-fast internet across every corner of your space.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Dual-band and tri-band options available</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Gigabit Ethernet ports for wired devices</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Built-in security features and parental controls</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Popular models: ASUS RT-AX86U, Netgear Nighthawk</li>
                </ul>
              </div>

              <div data-testid="section-wifi-routers">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white flex items-center justify-center mb-5">
                  <Signal className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">WiFi Router Rentals</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  WiFi routers with strong speeds, wide coverage, and stable signal for any home and office. From mesh systems to high-powered access points, get seamless WiFi in every room without dead zones.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> WiFi 6 and WiFi 6E support for latest devices</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Mesh systems covering up to 7,500 sq ft</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Easy app-based setup and management</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Popular models: Google Nest WiFi Pro, Eero Pro 6E</li>
                </ul>
              </div>

              <div data-testid="section-wireless-routers">
                <div className="w-14 h-14 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-5">
                  <Globe className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Wireless Router Rentals</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Wireless routers with strong speeds, wide coverage, and easy setup for home or office use. Perfect for remote workers, gamers, and households that need reliable connectivity for streaming, video calls, and smart home devices.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Supports 40+ simultaneous device connections</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> QoS prioritization for gaming and streaming</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> WPA3 encryption for enhanced security</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Popular models: TP-Link Archer AX75, Ubiquiti Dream Router</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4" data-testid="text-how-it-works">How Our Router Rental Process Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From browsing to blazing-fast internet in five simple steps.
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
              What's Included with Every Router Rental
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
          <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <Wifi className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4" data-testid="text-cta-title">
                Ready to Rent a Router?
              </h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                Browse our full router catalog or chat with a specialist to find the perfect router for your home or office coverage needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/categories/routers">
                  <Button size="lg" variant="secondary" className="rounded-full w-full sm:w-auto" data-testid="button-browse-catalog">
                    Browse Router Catalog
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