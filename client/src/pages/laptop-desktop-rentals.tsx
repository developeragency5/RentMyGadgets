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
  Laptop,
  Monitor,
  Cpu,
  CheckCircle,
  ArrowRight,
  HelpCircle,
  Shield,
  Phone,
  Clock,
  DollarSign,
  RefreshCcw,
  Headphones,
  Package,
  TrendingDown,
  Sparkles,
  Mail,
  Battery,
  Wifi,
  Zap
} from "lucide-react";

const rentalSteps = [
  {
    step: 1,
    title: "Pick your machine",
    description: "Browse our laptop, desktop, and workstation categories. Filter by brand, processor, RAM, and use case to find the perfect match for your workflow."
  },
  {
    step: 2,
    title: "Choose your rental term",
    description: "Rental periods start at 1 month and extend to 12 months, with progressive discounts: 10% off 3-month rentals, 20% off 6-month rentals, and 30% off 12-month rentals."
  },
  {
    step: 3,
    title: "Get fast delivery",
    description: "We ship your laptop or desktop pre-configured and ready to use — fast delivery available in select metro areas, with standard shipping in 3–5 business days."
  },
  {
    step: 4,
    title: "Work without limits",
    description: "Every rental includes free technical support, optional damage protection, and a pre-installed operating system so you can start working the moment you power on."
  },
  {
    step: 5,
    title: "Return or upgrade",
    description: "When your term ends, return with a prepaid shipping label — or upgrade to a newer, faster model anytime. No penalties, no hassle."
  }
];

const includedFeatures = [
  { icon: <Shield className="h-5 w-5" />, text: "Pre-configured OS (Windows 11 Pro or macOS) ready out of the box" },
  { icon: <Battery className="h-5 w-5" />, text: "Charger, power cable, and all essential accessories included" },
  { icon: <Headphones className="h-5 w-5" />, text: "7-day tech support by phone, chat, or email" },
  { icon: <RefreshCcw className="h-5 w-5" />, text: "Replacement units ship within 24 hours if device fails" },
  { icon: <Wifi className="h-5 w-5" />, text: "Wi-Fi 6E and Bluetooth connectivity pre-enabled" },
  { icon: <Sparkles className="h-5 w-5" />, text: "Professional data wipe before and after every rental" }
];

const faqs = [
  {
    question: "What's the cheapest laptop I can rent?",
    answer: "Laptop rentals start at $49 per month for entry-level business laptops with 8 GB RAM and SSD storage — ideal for everyday office work, browsing, and video calls."
  },
  {
    question: "Can I rent a gaming laptop or high-performance desktop?",
    answer: "Yes. We carry gaming laptops with dedicated GPUs and high-performance desktops with the latest processors. Filter by use case on our catalog page to find the right fit."
  },
  {
    question: "Do I need to install my own software?",
    answer: "Every laptop and desktop ships with the operating system pre-installed and activated. You're free to install any additional software you need — the machine is yours for the rental period."
  },
  {
    question: "What happens if my laptop screen cracks or the desktop fails?",
    answer: "With optional damage protection ($12/month), we cover all repairs and ship a replacement unit within 24 hours at no extra charge. Without protection, standard repair fees apply."
  },
  {
    question: "Can I rent a laptop for just one month?",
    answer: "Absolutely. All of our laptop and desktop rentals start at a one-month minimum with no long-term commitment. Extend or return whenever you need."
  }
];

export default function LaptopDesktopRentals() {
  return (
    <Layout>
      <SeoHead
        title="Laptop & Desktop Rentals | Laptops, Desktops & Workstations"
        description="Rent powerful laptops, desktop computers, and workstations for work, gaming, and creative projects. Flexible monthly plans, fast delivery, no long-term contracts."
        keywords="laptop rental, desktop rental, workstation rental, rent laptop, rent desktop, computer rental, gaming laptop rental, business laptop rental"
      />

      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-blue-50 to-background">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6" data-testid="badge-laptop-rentals">
              <Laptop className="h-4 w-4" />
              Laptop & Desktop Rentals
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6" data-testid="text-page-title">
              Rent Powerful Laptops & Desktops for Any Task
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              RentMyGadgets offers flexible monthly rentals on business-grade laptops, desktop computers, and professional workstations from brands like Apple, Dell, HP, Lenovo, and ASUS. Skip the massive upfront cost. Cancel anytime. Always stay current.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/categories/laptops">
                <Button size="lg" className="rounded-full" data-testid="button-browse-laptops">
                  Browse Laptops & Desktops <ArrowRight className="ml-2 h-4 w-4" />
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
              Buying a laptop or desktop ties up thousands of dollars in hardware that starts losing value the moment you open the box. Renting gives you the same power with none of the risk.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-blue-200 transition-colors" data-testid="card-benefit-flexibility">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                    <RefreshCcw className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Swap Anytime</h3>
                  <p className="text-sm text-muted-foreground">Need more RAM? A bigger screen? A different OS? Swap your machine mid-term instead of being stuck with yesterday's specs.</p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-blue-200 transition-colors" data-testid="card-benefit-savings">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Predictable Costs</h3>
                  <p className="text-sm text-muted-foreground">One flat monthly fee covers your device, support, and optional damage protection. No surprise repair bills or warranty headaches.</p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-blue-200 transition-colors" data-testid="card-benefit-scale">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
                    <TrendingDown className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">No Depreciation</h3>
                  <p className="text-sm text-muted-foreground">Laptops lose 30–40% of their value in year one. Renting means you always use current-gen hardware without eating the depreciation.</p>
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

              <div data-testid="section-laptop-rentals">
                <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-5">
                  <Laptop className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Laptop Rentals</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Laptops for work, study, gaming, and travel — built light with strong batteries and fast speeds. Whether you need a thin ultrabook for the road or a powerhouse for presentations and spreadsheets, our laptop lineup has you covered with the latest processors and all-day battery life.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Ultrabooks, business laptops, and gaming models</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> 8 GB to 64 GB RAM configurations available</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Pre-installed Windows 11 Pro or macOS</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Popular brands: Apple MacBook, Dell XPS, Lenovo ThinkPad</li>
                </ul>
              </div>

              <div data-testid="section-desktop-rentals">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center mb-5">
                  <Monitor className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Desktop Rentals</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Desktop computers for home, work, and gaming — delivering wide displays, strong power, and fast speed at a fraction of the purchase price. Perfect for dedicated workspaces where raw performance and screen real estate matter more than portability.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> All-in-one, tower, and mini desktop form factors</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Multi-monitor support for productivity workflows</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> SSD storage for instant boot and app loading</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Popular models: Apple iMac, Dell OptiPlex, HP EliteDesk</li>
                </ul>
              </div>

              <div data-testid="section-workstation-rentals">
                <div className="w-14 h-14 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-5">
                  <Cpu className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Workstation Rentals</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Workstations built for design, editing, and coding — powered by strong chips, big memory, and quick speed. Ideal for 3D rendering, video production, software development, and data science where consumer-grade hardware simply can't keep up.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Professional GPUs for CAD, 3D, and video editing</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Up to 128 GB RAM and multi-core Xeon processors</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> ECC memory for mission-critical reliability</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Popular models: Apple Mac Studio, Dell Precision, HP ZBook</li>
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
              From browsing to working in five simple steps.
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
              What's Included with Every Laptop & Desktop Rental
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
              <Laptop className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4" data-testid="text-cta-title">
                Ready to Rent a Laptop or Desktop?
              </h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                Browse our full laptop and desktop catalog or chat with a specialist to find the right machine for your workflow, budget, and timeline.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/categories/laptops">
                  <Button size="lg" variant="secondary" className="rounded-full w-full sm:w-auto" data-testid="button-browse-catalog">
                    Browse Laptop & Desktop Catalog
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