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
  Camera,
  Aperture,
  Sun,
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
  Focus,
  Image,
  Heart,
  Film,
  Home,
  Video,
  XCircle,
  Check
} from "lucide-react";

const rentalSteps = [
  {
    step: 1,
    title: "Choose your camera or gear",
    description: "Browse our professional cameras, camera lenses, and lighting gear categories and pick the equipment that fits your shoot."
  },
  {
    step: 2,
    title: "Select your rental term",
    description: "Rental periods start at 1 month and extend to 12 months, with progressive discounts: 10% off 3-month rentals, 20% off 6-month rentals, and 30% off 12-month rentals."
  },
  {
    step: 3,
    title: "Get fast delivery",
    description: "Order and we'll deliver your camera gear quickly — fast delivery available in select metro areas, with standard shipping in 3–5 business days."
  },
  {
    step: 4,
    title: "Shoot with confidence",
    description: "Every rental includes free technical support, optional damage protection, and accessories like memory cards and batteries."
  },
  {
    step: 5,
    title: "Return or upgrade",
    description: "When your term ends, we pick it up with a prepaid shipping label — or upgrade to a newer model or different lens anytime."
  }
];

const includedFeatures = [
  { icon: <Image className="h-5 w-5" />, text: "High-capacity memory card included with every camera" },
  { icon: <Zap className="h-5 w-5" />, text: "Fully charged battery and spare battery pack" },
  { icon: <Package className="h-5 w-5" />, text: "Padded carrying bag for safe transport" },
  { icon: <Sparkles className="h-5 w-5" />, text: "Microfiber lens cloth and cleaning kit" },
  { icon: <Phone className="h-5 w-5" />, text: "7-day tech support by phone, chat, or email" },
  { icon: <RefreshCcw className="h-5 w-5" />, text: "Replacement units ship within 24 hours if device fails" }
];

const faqs = [
  {
    question: "What professional cameras do you have available for rent?",
    answer: "We carry top-rated professional cameras from Canon, Nikon, and Sony — including full-frame and crop-sensor bodies ideal for portraits, events, travel, and studio work."
  },
  {
    question: "Can I rent a camera lens separately from a camera body?",
    answer: "Absolutely. You can rent individual camera lenses — from wide-angle to telephoto — and pair them with your own body or rent a body and lens together for the best value."
  },
  {
    question: "Is lighting gear included with camera rentals?",
    answer: "Lighting gear is rented separately so you can build the exact kit you need. Choose from softboxes, LED panels, ring lights, and light stands."
  },
  {
    question: "What happens if the camera is damaged during my rental?",
    answer: "With optional damage protection ($9/month), we cover all repairs and ship a replacement unit within 24 hours at no charge."
  },
  {
    question: "Can I rent camera gear for just one weekend shoot?",
    answer: "Our minimum rental period is one month, which gives you plenty of time to prep, shoot, and edit. No long-term commitment required."
  },
  {
    question: "Can I rent a camera for a wedding?",
    answer: "Absolutely. Wedding camera rental is one of our most popular use cases. Rent a full-frame body like a Canon EOS R6 or Sony A7 IV paired with a fast portrait lens, and capture every moment in stunning detail without buying thousands of dollars in gear."
  },
  {
    question: "Do you rent cinema lenses?",
    answer: "Yes, we carry cinema lenses designed for film and video production. Choose from cine primes and zoom lenses with smooth manual focus rings, de-clicked apertures, and T-stop markings — ideal for short films, commercials, and documentary work."
  },
  {
    question: "Are drone rentals available?",
    answer: "We offer select DJI drones for aerial photography and videography. From the compact DJI Mini series for travel to the DJI Inspire for professional film production, you can rent the perfect drone for your project with all necessary accessories included."
  },
  {
    question: "Can I rent lighting equipment?",
    answer: "Yes. Our lighting gear rental inventory includes LED panels, softboxes, ring lights, strobes, and light stands from brands like Aputure and Godox. Build a complete studio lighting setup for portraits, product photography, or video production."
  },
  {
    question: "What if the camera gets damaged during a shoot?",
    answer: "We understand that shoots can be unpredictable. With our optional damage protection plan, accidental damage is fully covered — we'll repair or replace the unit and ship it within 24 hours so your project stays on track."
  }
];

const brands = [
  { name: "Canon", tagline: "Trusted by professionals worldwide", slug: "canon" },
  { name: "Sony", tagline: "Mirrorless innovation leader", slug: "sony" },
  { name: "Nikon", tagline: "Legendary optical performance", slug: "nikon" },
  { name: "DJI", tagline: "Aerial photography pioneers", slug: "dji" },
  { name: "Fujifilm", tagline: "Color science perfection", slug: "fujifilm" },
  { name: "Panasonic", tagline: "Hybrid photo & video excellence", slug: "panasonic" }
];

const useCases = [
  {
    icon: <Heart className="h-7 w-7" />,
    title: "Wedding Photography",
    description: "Capture every moment of the big day with professional camera bodies, fast portrait lenses, and on-camera lighting — all available through flexible wedding camera rental plans.",
    bullets: [
      "Full-frame bodies for beautiful bokeh and low-light performance",
      "Fast prime lenses (50mm f/1.2, 85mm f/1.4) for stunning portraits",
      "On-camera flash and LED panels for reception lighting"
    ]
  },
  {
    icon: <Film className="h-7 w-7" />,
    title: "Film & Video Production",
    description: "From short films to commercials, rent cinema cameras, cinema lenses, and professional lighting kits to bring your creative vision to life without massive capital investment.",
    bullets: [
      "Cinema cameras with 4K/6K recording capabilities",
      "Cine lenses with smooth manual focus and T-stop markings",
      "Professional LED lighting and grip equipment"
    ]
  },
  {
    icon: <Home className="h-7 w-7" />,
    title: "Real Estate Photography",
    description: "Photograph properties with wide-angle lenses, tilt-shift lenses, and drone cameras to create stunning listings that sell faster. Camera equipment hire for real estate has never been easier.",
    bullets: [
      "Ultra-wide angle lenses for interior room shots",
      "Tilt-shift lenses for architectural perspective correction",
      "DJI drones for aerial property photography"
    ]
  },
  {
    icon: <Video className="h-7 w-7" />,
    title: "Content Creation & YouTube",
    description: "Level up your YouTube videos, TikToks, and social media content with professional camera rental gear, studio lighting, and audio equipment that makes your content stand out.",
    bullets: [
      "Mirrorless cameras with flip screens for vlogging",
      "Ring lights and softboxes for perfect studio lighting",
      "Shotgun microphones and lavalier mics for clear audio"
    ]
  }
];

const comparisonRows = [
  { feature: "Upfront Cost", renting: "Low monthly fee starting at $49/mo", buying: "$2,000–$6,000+ per camera body", rentWins: true },
  { feature: "Latest Gear Access", renting: "Upgrade to newest models anytime", buying: "Stuck with what you bought until you resell", rentWins: true },
  { feature: "Maintenance & Repairs", renting: "Covered — we handle all servicing", buying: "Your responsibility and expense", rentWins: true },
  { feature: "Depreciation Risk", renting: "Zero — return when done", buying: "Camera bodies lose 30–50% value in 2 years", rentWins: true },
  { feature: "Flexibility", renting: "Switch lenses, bodies, and brands each month", buying: "Locked into one system and mount", rentWins: true },
  { feature: "Storage & Insurance", renting: "We store and insure the gear", buying: "You need gear bags, cases, and insurance policies", rentWins: true }
];

export default function CameraGearRentals() {
  return (
    <Layout>
      <SeoHead
        title="Camera & Gear Rentals | Pro Cameras, Lenses & Lighting Equipment"
        description="Rent professional cameras, sharp lenses, and studio lighting gear for photo shoots, events, and travel. Flexible monthly plans, no contracts."
        keywords="camera rental, professional camera rental, camera lens rental, lighting rental, rent camera, photography equipment rental, studio lighting rental"
      />

      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-blue-50 to-background">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6" data-testid="badge-camera-rentals">
              <Camera className="h-4 w-4" />
              Camera & Gear Rentals
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6" data-testid="text-page-title">
              Rent Professional Cameras & Photography Gear
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              RentMyGadgets offers flexible monthly rentals on professional cameras, sharp camera lenses, and studio lighting gear from brands photographers trust — Canon, Nikon, Sony, and Aputure. No massive upfront costs. No long-term contracts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/categories/cameras">
                <Button size="lg" className="rounded-full" data-testid="button-browse-cameras">
                  Browse Cameras & Gear <ArrowRight className="ml-2 h-4 w-4" />
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
              Buying professional camera gear outright means thousands upfront, rapid depreciation, and closets full of equipment you only use a few times a year. Renting changes everything.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-blue-200 transition-colors" data-testid="card-benefit-flexibility">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                    <Focus className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Shoot Any Project</h3>
                  <p className="text-sm text-muted-foreground">From weddings to product shoots, rent the exact camera and lens combo you need for every project without owning it all.</p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-blue-200 transition-colors" data-testid="card-benefit-pro-gear">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Access Pro Gear</h3>
                  <p className="text-sm text-muted-foreground">Use top-tier full-frame cameras and premium lenses that would cost thousands to buy — all for a fraction of the price each month.</p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-blue-200 transition-colors" data-testid="card-benefit-storage">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
                    <TrendingDown className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">No Storage Hassle</h3>
                  <p className="text-sm text-muted-foreground">No more gear closets gathering dust. Rent what you need, return it when you're done, and keep your studio clutter-free.</p>
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

              <div data-testid="section-dslr-cameras">
                <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-5">
                  <Camera className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Professional Camera Rentals</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Professional cameras for portraits, events, and travel. Sharp lens, strong build, and clear shots. Our inventory includes full-frame and crop-sensor bodies from Canon, Nikon, and Sony — ready for any photo studio or on-location shoot.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Full-frame and APS-C sensor options</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> 4K video recording on select models</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Memory card and spare battery included</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Popular models: Canon EOS R6, Sony A7 IV, Nikon Z6</li>
                </ul>
              </div>

              <div data-testid="section-camera-lenses">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center mb-5">
                  <Aperture className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Camera Lens Rentals</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Camera lenses with sharp focus, wide range, and smooth zoom for portrait and travel shots. From fast primes to versatile zooms, rent the glass that transforms your images without the hefty price tag.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Prime, zoom, and macro lenses available</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Canon EF/RF, Nikon Z, and Sony E mounts</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Lens caps, hoods, and UV filters included</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Popular models: Canon RF 50mm f/1.2, Sony 24-70mm GM</li>
                </ul>
              </div>

              <div data-testid="section-lighting-gear">
                <div className="w-14 h-14 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-5">
                  <Sun className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Lighting Gear Rentals</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Lighting gear for photo and video shoots. Softbox, stands, and bright LED lights in stock. Build the perfect lighting setup for portraits, product photography, or video production without buying expensive studio equipment.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Softboxes, LED panels, and ring lights</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Adjustable light stands and boom arms</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Color temperature and brightness control</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Popular models: Aputure 600d Pro, Godox SL-60W</li>
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
              From browsing to shooting in five simple steps.
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
              What's Included with Every Camera & Gear Rental
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
            <h2 className="text-3xl font-heading font-bold text-center mb-4" data-testid="text-brand-showcase">Top Camera & Gear Brands Available for Rent</h2>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10 leading-relaxed">
              We partner with the most trusted names in photography and videography. Whether you need a Canon EOS rental for portraits, a Sony A7 rental for mirrorless versatility, or a DJI drone for aerial shots — we have it all.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {brands.map((brand) => (
                <Link key={brand.slug} href="/categories/cameras">
                  <Card className="border-2 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer h-full" data-testid={`brand-${brand.slug}`}>
                    <CardContent className="p-5 text-center flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                        <Camera className="h-6 w-6" />
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
            <h2 className="text-3xl font-heading font-bold text-center mb-4" data-testid="text-use-cases">Camera Rental Use Cases</h2>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10 leading-relaxed">
              From wedding photography to YouTube content creation, renting professional photography gear rental equipment lets you access the best tools for every project without the commitment of buying.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {useCases.map((useCase, index) => (
                <Card key={index} className="border-2 hover:border-blue-200 transition-colors" data-testid={`usecase-${index}`}>
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                      {useCase.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{useCase.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{useCase.description}</p>
                    <ul className="space-y-2">
                      {useCase.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
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
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center mb-4" data-testid="text-rent-vs-buy">Renting vs. Buying Camera Gear</h2>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10 leading-relaxed">
              Professional cameras and lenses are expensive — and they depreciate fast. Here's why camera equipment hire through RentMyGadgets makes more sense for most photographers and videographers.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" data-testid="table-rent-vs-buy">
                <thead>
                  <tr className="border-b-2 border-blue-200">
                    <th className="text-left py-4 px-4 font-bold text-sm uppercase tracking-wide text-muted-foreground">Feature</th>
                    <th className="text-left py-4 px-4 font-bold text-sm uppercase tracking-wide text-blue-600">Renting</th>
                    <th className="text-left py-4 px-4 font-bold text-sm uppercase tracking-wide text-muted-foreground">Buying</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, index) => (
                    <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-blue-50/30' : ''}`} data-testid={`comparison-row-${index}`}>
                      <td className="py-4 px-4 font-medium text-sm">{row.feature}</td>
                      <td className="py-4 px-4 text-sm">
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          <span>{row.renting}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                          <span>{row.buying}</span>
                        </div>
                      </td>
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
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center mb-4" data-testid="text-who-rents">Who Rents Camera Gear?</h2>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10 leading-relaxed">
              Our camera rental customers include freelance photographers, film students, production companies, real estate agents, and content creators. Whether you're a seasoned pro or picking up a camera for the first time, renting makes high-end photography gear accessible to everyone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border-2" data-testid="who-rents-freelance">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold mb-2">Freelance Photographers</h3>
                  <p className="text-sm text-muted-foreground">Access pro-level bodies and lenses for client shoots without investing thousands upfront in camera equipment.</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-2" data-testid="who-rents-filmmakers">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                    <Film className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold mb-2">Filmmakers & Studios</h3>
                  <p className="text-sm text-muted-foreground">Rent cinema cameras, cine lenses, and lighting rigs for short films, commercials, and documentary productions.</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-2" data-testid="who-rents-realestate">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                    <Home className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold mb-2">Real Estate Agents</h3>
                  <p className="text-sm text-muted-foreground">Photograph listings with wide-angle lenses and drone cameras to create stunning property showcases that sell faster.</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-2" data-testid="who-rents-creators">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
                    <Video className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold mb-2">Content Creators</h3>
                  <p className="text-sm text-muted-foreground">Level up YouTube, TikTok, and Instagram content with professional camera rental gear and studio lighting setups.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center mb-4" data-testid="text-popular-kits">Popular Camera Rental Kits</h2>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10 leading-relaxed">
              Not sure what to rent? Our curated photography gear rental kits take the guesswork out. Each kit includes a camera body, lens, and essential accessories — ready to shoot.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-blue-200 transition-colors" data-testid="kit-portrait">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                    <Heart className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Portrait & Wedding Kit</h3>
                  <p className="text-sm text-muted-foreground mb-4">Full-frame body + fast 85mm f/1.4 prime lens + on-camera flash. Perfect for wedding camera rental needs and portrait sessions.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Sony A7 IV or Canon EOS R6 body</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> 85mm f/1.4 portrait lens</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Speedlite flash + diffuser</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> 128GB SD card + spare battery</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-blue-200 transition-colors" data-testid="kit-video">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                    <Film className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Video Production Kit</h3>
                  <p className="text-sm text-muted-foreground mb-4">Cinema camera + versatile zoom lens + LED panel lighting. Ideal for short films, commercials, and corporate video production.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Sony FX3 or Canon C70 cinema camera</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> 24-70mm f/2.8 zoom lens</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Aputure 600d LED panel</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> External monitor + cage rig</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-blue-200 transition-colors" data-testid="kit-travel">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                    <Sun className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Travel & Landscape Kit</h3>
                  <p className="text-sm text-muted-foreground mb-4">Lightweight mirrorless body + wide-angle zoom + compact tripod. The perfect camera rental setup for travel photography and landscapes.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Nikon Z6 III or Fujifilm X-T5 body</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> 16-35mm f/4 wide-angle zoom</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Compact carbon fiber travel tripod</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> Padded camera backpack</li>
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
            <h2 className="text-3xl font-heading font-bold text-center mb-6" data-testid="text-why-rentmygadgets">Why Choose RentMyGadgets for Camera Rentals?</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-4">
              <p>
                At RentMyGadgets, we believe every photographer and videographer deserves access to professional-grade equipment. Whether you need a camera rental for a one-time wedding shoot, a camera lens rental for a month-long travel adventure, or a full lighting gear rental for a commercial production — we make it affordable and hassle-free.
              </p>
              <p>
                Our camera equipment hire service covers the full spectrum: Canon EOS rental bodies, Sony A7 rental mirrorless systems, Nikon Z-mount cameras, DJI drones for aerial photography, and studio lighting from Aputure and Godox. Every piece of photography gear rental equipment is professionally inspected, cleaned, and tested before shipping.
              </p>
              <p>
                With flexible monthly terms, no long-term contracts, and free technical support included with every rental, RentMyGadgets is the smart choice for photographers who want to shoot with the best gear without the massive upfront investment. Rent a camera today and experience the difference professional equipment makes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <Camera className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4" data-testid="text-cta-title">
                Ready to Rent Professional Camera Gear?
              </h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                Browse our full camera and photography gear catalog or chat with a specialist to find the perfect setup for your next shoot.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/categories/cameras">
                  <Button size="lg" variant="secondary" className="rounded-full w-full sm:w-auto" data-testid="button-browse-catalog">
                    Browse Camera Catalog
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