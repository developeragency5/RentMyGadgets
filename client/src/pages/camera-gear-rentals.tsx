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
  Image
} from "lucide-react";

const rentalSteps = [
  {
    step: 1,
    title: "Choose your camera or gear",
    description: "Browse our DSLR cameras, camera lenses, and lighting gear categories and pick the equipment that fits your shoot."
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
    question: "What DSLR cameras do you have available for rent?",
    answer: "We carry top-rated DSLR cameras from Canon, Nikon, and Sony — including full-frame and crop-sensor bodies ideal for portraits, events, travel, and studio work."
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
  }
];

export default function CameraGearRentals() {
  return (
    <Layout>
      <SeoHead
        title="Camera & Gear Rentals | DSLRs, Lenses & Lighting Equipment"
        description="Rent professional DSLR cameras, sharp lenses, and studio lighting gear for photo shoots, events, and travel. Flexible monthly plans, no contracts."
        keywords="camera rental, DSLR rental, camera lens rental, lighting rental, rent camera, photography equipment rental, studio lighting rental"
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
              RentMyGadgets offers flexible monthly rentals on professional DSLR cameras, sharp camera lenses, and studio lighting gear from brands photographers trust — Canon, Nikon, Sony, and Aputure. No massive upfront costs. No long-term contracts.
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
                <h2 className="text-2xl font-heading font-bold mb-4">DSLR Camera Rentals</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  DSLR cameras for portraits, events, and travel. Sharp lens, strong build, and clear shots. Our inventory includes full-frame and crop-sensor bodies from Canon, Nikon, and Sony — ready for any photo studio or on-location shoot.
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