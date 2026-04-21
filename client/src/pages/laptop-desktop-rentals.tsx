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
  Zap,
  Briefcase,
  Film,
  Users,
  GraduationCap,
  Building2,
  Check,
  X,
  ExternalLink
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

const brands = [
  { name: "Apple", tagline: "MacBook Air, MacBook Pro, iMac, Mac Studio" },
  { name: "Dell", tagline: "XPS, Latitude, Precision, OptiPlex" },
  { name: "HP", tagline: "Spectre, EliteBook, ZBook, EliteDesk" },
  { name: "Lenovo", tagline: "ThinkPad, IdeaPad, Legion, ThinkCentre" },
  { name: "Asus", tagline: "ZenBook, ROG, VivoBook, ProArt" },
  { name: "Microsoft", tagline: "Surface Pro, Surface Laptop, Surface Studio" }
];

const useCases = [
  {
    icon: <Briefcase className="h-7 w-7" />,
    title: "Remote Work",
    description: "Equip your remote team with reliable business laptops and desktops without the capital expense. Our laptop rental plans let distributed employees work from anywhere with enterprise-grade hardware.",
    bullets: [
      "Pre-configured with VPN, security software, and collaboration tools",
      "Scale up or down as your team size changes — no long-term contracts",
      "IT-ready devices shipped directly to each employee's home office"
    ]
  },
  {
    icon: <Film className="h-7 w-7" />,
    title: "Video Editing & Creative Work",
    description: "Rent high-performance workstations and creative laptops built for Adobe Premiere, DaVinci Resolve, After Effects, and other demanding creative applications — without buying a $5,000 machine.",
    bullets: [
      "Dedicated GPUs and high-refresh displays for color-accurate editing",
      "Up to 64 GB RAM for seamless 4K and 8K video timeline scrubbing",
      "MacBook Pro and Dell Precision models available for rent monthly"
    ]
  },
  {
    icon: <Users className="h-7 w-7" />,
    title: "Business Teams",
    description: "Outfit entire departments with identical business laptop hire packages. Whether you're onboarding 5 new hires or equipping a 200-person call center, bulk desktop rental pricing keeps costs predictable.",
    bullets: [
      "Volume discounts on 10+ unit orders with dedicated account management",
      "Uniform hardware specs across your organization for easy IT support",
      "Asset tracking and lifecycle management included at no extra cost"
    ]
  },
  {
    icon: <GraduationCap className="h-7 w-7" />,
    title: "Students & Education",
    description: "Affordable laptop rentals for students, coding bootcamps, and university programs. Get a powerful machine for the semester without the full purchase price — perfect for students who need a reliable computer.",
    bullets: [
      "Semester-length rental terms with student-friendly pricing",
      "Lightweight laptops ideal for note-taking, coding, and research",
      "Easy returns at the end of the school year — no depreciation worries"
    ]
  }
];

const comparisonRows = [
  { feature: "Upfront Cost", renting: "From $49/month — no large capital outlay", buying: "$800–$3,500+ upfront per device" },
  { feature: "Technology Freshness", renting: "Upgrade to the latest model anytime during your rental", buying: "Stuck with the same hardware for 3–5 years" },
  { feature: "Maintenance & Repairs", renting: "Covered — replacement units ship within 24 hours", buying: "Out-of-pocket repair costs after warranty expires" },
  { feature: "Scalability", renting: "Add or remove devices instantly as your team changes", buying: "Must purchase and resell hardware manually" },
  { feature: "Depreciation", renting: "Zero — you never own a depreciating asset", buying: "30–40% value loss in the first year alone" },
  { feature: "End-of-Life Disposal", renting: "We handle data wipe and responsible recycling", buying: "Your responsibility to securely wipe and recycle" }
];

const faqs = [
  {
    question: "What's the cheapest laptop I can rent?",
    answer: "Laptop rentals start at $49 per month for entry-level business laptops with 8 GB RAM and SSD storage — ideal for everyday office work, browsing, and video calls."
  },
  {
    question: "Can I rent a gaming laptop or high-performance desktop?",
    answer: "Yes. We carry gaming laptop rental options with dedicated GPUs and high-performance desktops with the latest processors. Filter by use case on our catalog page to find the right fit for gaming or creative workloads."
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
  },
  {
    question: "Do you offer rent-to-own for laptops?",
    answer: "Yes, we offer a rent-to-own pathway on select laptop and desktop models. After 12 months of continuous rental, you can apply a portion of your paid rental fees toward the purchase price. Contact our team for eligible models and pricing details."
  },
  {
    question: "Can I rent a MacBook Pro?",
    answer: "Absolutely. MacBook rental is one of our most popular categories. We carry MacBook Air 13\" and 15\" with the M3 chip, MacBook Pro 14\" and 16\" with M3 Pro and M3 Max, and Mac Studio workstations. All ship pre-configured with the latest macOS."
  },
  {
    question: "What if I need to extend my rental?",
    answer: "Extending is easy — just log into your account or contact support before your term ends. Extensions are billed at the same monthly rate, and longer extensions may qualify for additional multi-month discounts on your workstation rental or laptop plan."
  },
  {
    question: "Do you provide monitors with desktop rentals?",
    answer: "Yes. When you rent a desktop computer, you can add monitors, keyboards, and mice as accessories. We offer 24\" and 27\" displays from Dell, LG, and Apple, with multi-monitor bundles available at discounted rates."
  },
  {
    question: "Can I install my own software on rented laptops?",
    answer: "Yes, you have full administrator access on every rented laptop and desktop. Install any software you need — from development tools and creative suites to business applications. We perform a professional data wipe after every rental to protect your privacy."
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
              RentMyGadgets offers flexible monthly rentals on business-grade laptops, desktop computers, and professional workstations from brands like Apple, Dell, HP, Lenovo, and Asus. Skip the massive upfront cost. Cancel anytime. Always stay current.
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

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold mb-4" data-testid="text-brand-showcase">Top Laptop & Desktop Brands Available for Rent</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We partner with the world's leading computer manufacturers to bring you the latest laptops, desktops, and workstations. Whether you need a Dell laptop rental for the office or a MacBook rental for creative projects, we have you covered.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {brands.map((brand, index) => (
                <Link key={brand.name} href="/categories/laptops">
                  <Card className="border-2 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group" data-testid={`brand-card-${index}`}>
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-50 transition-colors">
                        <Building2 className="h-7 w-7 text-slate-600 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <h3 className="font-bold text-lg mb-1">{brand.name}</h3>
                      <p className="text-xs text-muted-foreground">{brand.tagline}</p>
                      <div className="mt-3 flex items-center justify-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Browse {brand.name} <ExternalLink className="ml-1 h-3 w-3" />
                      </div>
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
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold mb-4" data-testid="text-use-cases">Who Rents Laptops & Desktops?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From remote workers to film editors, students to enterprise IT departments — our flexible laptop and desktop rental plans serve a wide range of needs and budgets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {useCases.map((useCase, index) => (
                <Card key={index} className="border-2 hover:border-blue-200 transition-colors" data-testid={`usecase-card-${index}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        {useCase.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl mb-2">{useCase.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{useCase.description}</p>
                      </div>
                    </div>
                    <ul className="space-y-2 ml-[4.5rem]">
                      {useCase.bullets.map((bullet, bIndex) => (
                        <li key={bIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold mb-4" data-testid="text-popular-configs">Popular Laptop & Desktop Rental Configurations</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Not sure what to rent? Here are our most popular laptop and desktop configurations, chosen by thousands of renters for work, creativity, and gaming.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-blue-200 transition-colors" data-testid="config-business">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Business Essential</h3>
                  <p className="text-sm text-muted-foreground mb-3">Perfect for office work, email, video conferencing, and everyday business tasks.</p>
                  <ul className="space-y-1.5 text-sm">
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" /> Intel Core i5 / Apple M3</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" /> 16 GB RAM / 512 GB SSD</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" /> 14" FHD Display</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" /> From $69/month</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-blue-300 shadow-md relative" data-testid="config-creative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                    <Film className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Creative Pro</h3>
                  <p className="text-sm text-muted-foreground mb-3">Built for video editing, graphic design, software development, and creative workflows.</p>
                  <ul className="space-y-1.5 text-sm">
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" /> Intel Core i7 / Apple M3 Pro</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" /> 32 GB RAM / 1 TB SSD</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" /> 16" Retina / 4K Display</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" /> From $129/month</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-blue-200 transition-colors" data-testid="config-power">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Power Workstation</h3>
                  <p className="text-sm text-muted-foreground mb-3">Maximum performance for 3D rendering, data science, machine learning, and engineering.</p>
                  <ul className="space-y-1.5 text-sm">
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" /> Intel Xeon / Apple M3 Max</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" /> 64 GB RAM / 2 TB SSD</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" /> Pro GPU / Multi-monitor</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" /> From $199/month</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold mb-4" data-testid="text-rent-vs-buy">Rent vs. Buy: Laptop & Desktop Comparison</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                See how renting a laptop or desktop computer stacks up against purchasing. For most individuals and businesses, renting delivers better value, more flexibility, and zero risk of depreciation.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse" data-testid="table-rent-vs-buy">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="text-left p-4 font-bold text-sm border-b-2 border-slate-200 w-1/4">Feature</th>
                    <th className="text-left p-4 font-bold text-sm border-b-2 border-blue-300 bg-blue-50 w-[37.5%]">
                      <span className="flex items-center gap-2 text-blue-700">
                        <Check className="h-5 w-5" /> Renting
                      </span>
                    </th>
                    <th className="text-left p-4 font-bold text-sm border-b-2 border-slate-200 w-[37.5%]">
                      <span className="flex items-center gap-2 text-slate-500">
                        <X className="h-5 w-5" /> Buying
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"} data-testid={`comparison-row-${index}`}>
                      <td className="p-4 text-sm font-semibold border-b border-slate-100">{row.feature}</td>
                      <td className="p-4 text-sm text-blue-800 bg-blue-50/50 border-b border-blue-100">{row.renting}</td>
                      <td className="p-4 text-sm text-muted-foreground border-b border-slate-100">{row.buying}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-blue-50/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center mb-10" data-testid="text-seo-why-rent">
              Why Laptop Rental Makes Sense in 2025
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-xl mb-3">The Smart Alternative to Buying</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The average business laptop costs between $1,200 and $2,500 — and that's before you factor in software licenses, extended warranties, and inevitable repairs. With a laptop rental from RentMyGadgets, you get the same computing power for a predictable monthly fee that's a fraction of the purchase price. Whether you need to rent a laptop for a single project or equip an entire team for the quarter, our flexible plans adapt to your timeline, not the other way around.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Desktop rental is equally compelling for businesses that need powerful workstations without the five-figure capital expenditure. Rent a desktop computer from brands like Dell, HP, and Lenovo, and get dedicated IT support, damage protection, and hassle-free returns when your project wraps up.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3">Laptop Rental Near Me — Nationwide Delivery</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Searching for "laptop rental near me"? RentMyGadgets ships pre-configured laptops and desktops to all 50 states, with expedited delivery available in major metro areas. Every machine arrives ready to power on and work — no setup required. We handle the logistics so you can focus on what matters: getting work done.
                </p>
                <h3 className="font-bold text-xl mb-3 mt-6">Gaming Laptop Rental</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Need a gaming laptop rental for a LAN event, streaming setup, or short-term use? We carry high-performance laptops with dedicated NVIDIA and AMD GPUs, high-refresh-rate displays, and advanced cooling systems from brands like Asus ROG, Alienware, and MSI. Rent by the month with no long-term commitment.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              <div>
                <h3 className="font-bold text-xl mb-3">Business Laptop Hire for Teams</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Scaling your team? Business laptop hire through RentMyGadgets means you can outfit 10, 50, or 500 employees with identical hardware in days, not weeks. Our bulk laptop rental program includes dedicated account management, centralized billing, and standardized configurations across your fleet. Every Dell laptop rental and HP workstation rental ships with enterprise-grade security pre-configured — TPM chips, BitLocker encryption, and BIOS-level passwords.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3">Workstation Rental for Professionals</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Professional workstation rental bridges the gap between consumer-grade laptops and enterprise computing. Architects, engineers, data scientists, and video editors need machines with ECC memory, professional GPUs, and ISV-certified configurations. Our workstation rental catalog includes the Apple Mac Studio with M2 Ultra, Dell Precision 7780, and HP ZBook Studio — all available on flexible monthly terms. Stop waiting months for procurement approval and start rendering, compiling, and editing today.
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white" data-testid="stat-laptops-rented">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">12,000+</div>
                  <p className="text-sm text-muted-foreground">Laptops & desktops rented nationwide</p>
                </CardContent>
              </Card>
              <Card className="bg-white" data-testid="stat-brands-available">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">30+</div>
                  <p className="text-sm text-muted-foreground">Laptop and desktop models from top brands</p>
                </CardContent>
              </Card>
              <Card className="bg-white" data-testid="stat-satisfaction">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">98%</div>
                  <p className="text-sm text-muted-foreground">Customer satisfaction on laptop rentals</p>
                </CardContent>
              </Card>
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