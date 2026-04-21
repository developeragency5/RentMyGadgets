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
  Camera,
  Code,
  Briefcase,
  Plane,
  Video,
  Check,
  X,
  ExternalLink,
  Building2
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
  },
  {
    question: "Can I rent an iPhone for a month?",
    answer: "Yes. iPhone rental is one of our most popular options. You can rent any iPhone model — including the iPhone 16 Pro Max and iPhone 17 — starting at just one month. No carrier contract required, and every iPhone ships unlocked and ready to use with any U.S. carrier."
  },
  {
    question: "Do rented phones come with a SIM card?",
    answer: "Our smartphone rentals ship SIM-ready but do not include a SIM card. You can use your existing SIM card, purchase a prepaid SIM, or activate an eSIM directly on the device. All phones are factory unlocked for maximum carrier flexibility."
  },
  {
    question: "Can I use my own carrier with a rented phone?",
    answer: "Absolutely. Every cell phone for rent in our catalog is factory unlocked and compatible with all major U.S. carriers including AT&T, T-Mobile, Verizon, and MVNOs like Mint Mobile and Google Fi. Simply insert your SIM or activate eSIM and you're connected."
  },
  {
    question: "Are the phones refurbished or new?",
    answer: "We offer both certified pre-owned and new smartphones. Every device undergoes a rigorous 30-point inspection covering battery health, display quality, camera performance, and overall functionality. Most renters can't tell the difference from a brand-new phone."
  },
  {
    question: "Do you offer 5G smartphones for rent?",
    answer: "Yes. The majority of our smartphone rental inventory supports 5G connectivity. Whether you're renting an iPhone 16 Pro, Samsung Galaxy S25 Ultra, or Google Pixel 9 Pro, you'll have access to the fastest mobile networks available in your area."
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
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center mb-4" data-testid="text-brand-showcase">Top Smartphone Brands Available for Rent</h2>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10 leading-relaxed">
              Whether you're looking for an iPhone rental, Samsung rental, or the latest Google Pixel, we carry flagship and mid-range models from the world's most trusted mobile phone brands.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: "Apple", tagline: "iPhone 16 Pro & Pro Max", color: "bg-gray-900 text-white" },
                { name: "Samsung", tagline: "Galaxy S25 Ultra & Z Fold", color: "bg-blue-600 text-white" },
                { name: "Google", tagline: "Pixel 9 Pro & Pixel 9a", color: "bg-green-600 text-white" },
                { name: "OnePlus", tagline: "OnePlus 13 & Open", color: "bg-red-600 text-white" },
                { name: "Motorola", tagline: "Edge & Razr Series", color: "bg-indigo-600 text-white" },
                { name: "Sony", tagline: "Xperia 1 VI & 5 VI", color: "bg-slate-700 text-white" },
              ].map((brand) => (
                <Link key={brand.name} href="/categories/phones">
                  <Card className="border-2 hover:border-blue-300 transition-all hover:shadow-md cursor-pointer h-full" data-testid={`brand-${brand.name.toLowerCase()}`}>
                    <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
                      <div className={`w-12 h-12 rounded-xl ${brand.color} flex items-center justify-center mb-3`}>
                        <Smartphone className="h-6 w-6" />
                      </div>
                      <h3 className="font-bold text-sm mb-1">{brand.name}</h3>
                      <p className="text-xs text-muted-foreground">{brand.tagline}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center mb-4" data-testid="text-use-cases">Who Rents Smartphones?</h2>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10 leading-relaxed">
              From app developers testing across devices to business professionals needing a temporary phone, smartphone rental monthly plans serve a wide range of use cases.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 hover:border-blue-200 transition-colors" data-testid="usecase-app-testing">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-4">
                    <Code className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">App Testing & Development</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Developers rent phones to test apps across iOS and Android devices without buying every model. Rent an iPhone and a Samsung side by side to ensure your app performs flawlessly on both platforms.
                  </p>
                  <ul className="space-y-1.5 text-sm">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Test on real hardware, not emulators</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Rent multiple OS versions simultaneously</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Return devices after launch testing</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-blue-200 transition-colors" data-testid="usecase-business">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Business & Corporate</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Companies rent smartphones for new hires, contractors, and temporary staff. Phone hire for business eliminates the need to purchase and manage a fleet of corporate devices.
                  </p>
                  <ul className="space-y-1.5 text-sm">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Onboard new employees instantly</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Scale fleet up or down with demand</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Avoid depreciation on company assets</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-blue-200 transition-colors" data-testid="usecase-events-travel">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                    <Plane className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Events & Travel</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Traveling internationally or attending a multi-day conference? Rent a phone instead of risking your personal device. Mobile phone rental for travel keeps you connected without roaming headaches.
                  </p>
                  <ul className="space-y-1.5 text-sm">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Unlocked phones work with any local SIM</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Short-term rentals starting at 1 month</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> No risk to your personal phone abroad</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-blue-200 transition-colors" data-testid="usecase-content-creation">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mb-4">
                    <Video className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Content Creation</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Creators and influencers rent the latest smartphones with the best cameras for shoots, TikTok videos, and Instagram content. Rent an iPhone 17 Pro or Samsung Galaxy S25 Ultra for pro-grade mobile video.
                  </p>
                  <ul className="space-y-1.5 text-sm">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> 4K and 8K video recording capabilities</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Pro camera systems with optical zoom</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Try different phones for different looks</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center mb-4" data-testid="text-rent-vs-buy">Renting vs. Buying a Smartphone</h2>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10 leading-relaxed">
              See how smartphone rental monthly plans compare to buying outright or financing through a carrier. For many people, renting a phone is the smarter financial choice.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" data-testid="table-rent-vs-buy">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="text-left p-4 font-bold border-b-2 border-blue-200">Feature</th>
                    <th className="text-center p-4 font-bold border-b-2 border-blue-200 text-blue-600">Rent a Phone</th>
                    <th className="text-center p-4 font-bold border-b-2 border-blue-200 text-muted-foreground">Buy / Finance</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Upfront Cost", rent: "Low monthly fee", buy: "$999–$1,599 or 24-month plan" },
                    { feature: "Latest Models", rent: "Upgrade anytime", buy: "Stuck until paid off" },
                    { feature: "Carrier Lock-in", rent: "No contracts — unlocked", buy: "Often carrier-locked" },
                    { feature: "Depreciation Risk", rent: "Zero — return when done", buy: "Loses 40%+ value in year one" },
                    { feature: "Damage Protection", rent: "Optional $9/mo coverage", buy: "AppleCare/insurance extra" },
                    { feature: "Flexibility", rent: "Swap, extend, or return", buy: "Sell or trade in at a loss" },
                  ].map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4 font-medium border-b">{row.feature}</td>
                      <td className="p-4 text-center border-b">
                        <span className="inline-flex items-center gap-1.5 text-sm text-green-700">
                          <Check className="h-4 w-4" /> {row.rent}
                        </span>
                      </td>
                      <td className="p-4 text-center border-b">
                        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                          <X className="h-4 w-4 text-red-400" /> {row.buy}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-center mt-8">
              <Link href="/categories/phones">
                <Button size="lg" className="rounded-full" data-testid="button-start-renting">
                  Start Renting a Smartphone <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-blue-50/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center mb-4" data-testid="text-popular-models">Most Popular Smartphone Rentals</h2>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10 leading-relaxed">
              These are the most-rented smartphones on RentMyGadgets. From the latest iPhone rental to flagship Samsung and Google devices, our customers choose these models again and again.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 hover:shadow-lg transition-shadow" data-testid="popular-iphone-16-pro">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center mb-4">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">iPhone 16 Pro Max</h3>
                  <p className="text-xs text-blue-600 font-medium mb-3">Most Popular iPhone Rental</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Apple's flagship with a 6.9" Super Retina XDR display, A18 Pro chip, 48MP camera system with 5x optical zoom, and titanium design. The ultimate iPhone rental for professionals and creators.
                  </p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li className="flex items-start gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" /> ProRes video recording & Action button</li>
                    <li className="flex items-start gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" /> All-day battery with USB-C fast charging</li>
                    <li className="flex items-start gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" /> 5G and WiFi 6E connectivity</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow" data-testid="popular-galaxy-s25">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Samsung Galaxy S25 Ultra</h3>
                  <p className="text-xs text-blue-600 font-medium mb-3">Best Samsung Rental</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Samsung's most powerful smartphone with a 6.8" Dynamic AMOLED 2X display, Snapdragon 8 Elite processor, 200MP camera, and built-in S Pen. The go-to Samsung rental for power users.
                  </p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li className="flex items-start gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" /> 200MP main camera with 100x Space Zoom</li>
                    <li className="flex items-start gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" /> Built-in S Pen for notes and sketches</li>
                    <li className="flex items-start gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" /> Galaxy AI features built-in</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow" data-testid="popular-pixel-9">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-green-600 text-white flex items-center justify-center mb-4">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Google Pixel 9 Pro</h3>
                  <p className="text-xs text-blue-600 font-medium mb-3">Best Camera Phone Rental</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Google's AI-first smartphone with a 6.3" Super Actua display, Tensor G4 chip, and triple camera system with Magic Eraser and Best Take. A top choice for mobile phone rental customers who prioritize photography.
                  </p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li className="flex items-start gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" /> Google AI photo editing tools</li>
                    <li className="flex items-start gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" /> 7 years of software updates</li>
                    <li className="flex items-start gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" /> Pure Android experience with Gemini AI</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center mb-10" data-testid="text-rental-stats">Why Thousands Choose Smartphone Rentals</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center" data-testid="stat-phones-rented">
                <p className="text-4xl font-bold text-blue-600 mb-2">15K+</p>
                <p className="text-sm text-muted-foreground">Phones Rented</p>
              </div>
              <div className="text-center" data-testid="stat-satisfaction">
                <p className="text-4xl font-bold text-blue-600 mb-2">4.8★</p>
                <p className="text-sm text-muted-foreground">Customer Rating</p>
              </div>
              <div className="text-center" data-testid="stat-brands">
                <p className="text-4xl font-bold text-blue-600 mb-2">6+</p>
                <p className="text-sm text-muted-foreground">Brands Available</p>
              </div>
              <div className="text-center" data-testid="stat-delivery">
                <p className="text-4xl font-bold text-blue-600 mb-2">48hr</p>
                <p className="text-sm text-muted-foreground">Avg. Delivery Time</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-heading font-bold mb-4">The Smarter Way to Stay Connected</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Whether you need an iPhone rental for a business trip, a Samsung rental for a photo project, or just want to try the latest Pixel before committing, RentMyGadgets makes it easy. Our cell phone for rent program eliminates upfront costs, carrier contracts, and the stress of device depreciation.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Every phone hire includes free shipping, a pre-applied screen protector, protective case, and fast charger — so you're ready to go the moment your phone arrives. Rent a phone today and experience the freedom of flexible mobile technology.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-1">Fully Insured Rentals</h4>
                      <p className="text-xs text-muted-foreground">Optional damage protection covers drops, cracks, and liquid damage with 24-hour replacement.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <RefreshCcw className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-1">Easy Upgrades & Returns</h4>
                      <p className="text-xs text-muted-foreground">Swap to a newer model or return with a prepaid label anytime — no penalties, no restocking fees.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-1">Business Accounts Available</h4>
                      <p className="text-xs text-muted-foreground">Bulk smartphone rental monthly plans for teams with dedicated account management and priority support.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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