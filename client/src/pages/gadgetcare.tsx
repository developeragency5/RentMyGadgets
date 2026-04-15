import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ShieldCheck, 
  Droplets, 
  Wrench, 
  Zap, 
  Clock,
  CheckCircle,
  ArrowRight,
  HelpCircle,
  Percent,
  BadgeCheck,
  Sparkles,
  Phone
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const coverageFeatures = [
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Accidental Damage",
    description: "Drops, bumps, and unexpected accidents are covered. We understand that accidents happen during everyday use.",
    examples: ["Cracked screens", "Broken components", "Physical damage from drops"]
  },
  {
    icon: <Droplets className="h-8 w-8" />,
    title: "Liquid Spills",
    description: "Coffee spills, water damage, and other liquid accidents are covered under GadgetCare+.",
    examples: ["Water damage", "Coffee/beverage spills", "Rain exposure"]
  },
  {
    icon: <Wrench className="h-8 w-8" />,
    title: "Hardware Malfunctions",
    description: "If your rented device experiences any hardware issues, we'll repair or replace it at no extra cost.",
    examples: ["Battery issues", "Display problems", "Component failures"]
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Priority Repairs",
    description: "Skip the queue with expedited repair service. Get back to work faster with priority handling.",
    examples: ["Same-day diagnostics", "Express replacements", "Dedicated support line"]
  }
];

const benefits = [
  {
    icon: <Percent className="h-6 w-6" />,
    title: "Simple Pricing",
    description: "Just 15% of your rental cost. No hidden fees, no deductibles, no surprises."
  },
  {
    icon: <BadgeCheck className="h-6 w-6" />,
    title: "Peace of Mind",
    description: "Focus on your work or project without worrying about accidental damage."
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Hassle-Free Claims",
    description: "Simple online claims process with quick resolution. No paperwork headaches."
  },
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Dedicated Support",
    description: "Our GadgetCare+ team is available to help with your protection claims."
  }
];

const howItWorks = [
  {
    step: 1,
    title: "Add GadgetCare+ at Checkout",
    description: "Simply toggle on GadgetCare+ protection when adding any product to your cart. The cost is automatically calculated based on your rental."
  },
  {
    step: 2,
    title: "Use Your Device with Confidence",
    description: "Enjoy your rented equipment knowing you're protected against accidental damage, spills, and hardware issues."
  },
  {
    step: 3,
    title: "Report Any Issues",
    description: "If something goes wrong, contact us through your dashboard. We'll review your claim and guide you through the next steps."
  },
  {
    step: 4,
    title: "Quick Resolution",
    description: "We'll work to repair or replace your device so you can get back to what matters. Our team will keep you updated throughout the process."
  }
];

const faqs = [
  {
    question: "How much does GadgetCare+ cost?",
    answer: "GadgetCare+ costs 15% of your total rental price. For example, if you rent a laptop for $200/month, GadgetCare+ would be $30/month. The exact price is shown when you toggle on protection for any product."
  },
  {
    question: "What's covered under GadgetCare+?",
    answer: "GadgetCare+ covers accidental damage (drops, cracks), liquid spills (water, coffee, beverages), hardware malfunctions, and provides priority repair service. It does not cover intentional damage, theft, or loss."
  },
  {
    question: "Can I add GadgetCare+ to any rental?",
    answer: "Yes! GadgetCare+ is available for all products in our catalog, from laptops and cameras to desktops and accessories. You can add protection on a per-item basis."
  },
  {
    question: "How do I file a claim?",
    answer: "Filing a claim is easy. Log into your dashboard, go to your active rentals, and click 'Report an Issue' on the affected item. You can also call our priority support line for immediate assistance."
  },
  {
    question: "Is there a deductible?",
    answer: "No! GadgetCare+ has no deductibles. If your device is damaged and covered under the plan, repairs or replacement are completely free."
  },
  {
    question: "Can I add GadgetCare+ after I've started my rental?",
    answer: "GadgetCare+ must be added at the time of checkout. We cannot add protection to existing rentals as coverage begins from day one of your rental period."
  },
  {
    question: "What happens if my device can't be repaired?",
    answer: "If your device cannot be repaired, we'll replace it with an equivalent or better model at no additional cost. Your rental continues seamlessly."
  },
  {
    question: "Does GadgetCare+ cover theft or loss?",
    answer: "No, GadgetCare+ does not cover theft or loss. It's designed to protect against accidental damage and hardware issues during normal use. We recommend keeping rental equipment secure at all times."
  }
];

export default function GadgetCare() {
  return (
    <Layout>
      <SeoHead 
        title="GadgetCare+ Protection Plan"
        description="Protect your rental with GadgetCare+. Coverage for accidental damage, liquid spills, and hardware malfunctions. Just 15% of your rental cost with no deductibles."
        keywords="gadget protection, rental insurance, damage protection, gadgetcare, device protection plan, rental coverage, accidental damage coverage"
      />
      
      <section className="bg-gradient-to-b from-blue-50 to-background py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
            <ShieldCheck className="h-5 w-5" />
            <span className="font-medium">Protection Plan</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6" data-testid="text-page-title">
            GadgetCare<span className="text-blue-600">+</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Complete peace of mind for your rental. Protection against accidental damage, spills, and hardware issues for just 15% of your rental cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/categories">
              <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700" data-testid="button-browse-products">
                Browse Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="rounded-full" data-testid="button-learn-more">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">What's Covered</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              GadgetCare+ provides comprehensive protection so you can use your rented equipment with confidence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {coverageFeatures.map((feature, index) => (
              <Card key={index} className="overflow-hidden border-2 hover:border-blue-200 transition-colors" data-testid={`coverage-${index}`}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground mb-4">{feature.description}</p>
                      <ul className="space-y-1">
                        {feature.examples.map((example, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-50/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Why Choose GadgetCare+
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center bg-white" data-testid={`benefit-${index}`}>
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Getting GadgetCare+ protection is simple and takes just seconds.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative" data-testid={`how-it-works-${item.step}`}>
                {index < howItWorks.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-full bg-gradient-to-b from-blue-500 to-blue-200 hidden md:block" />
                )}
                <div className="flex gap-6 mb-8">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
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

      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 justify-center mb-8">
              <HelpCircle className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-heading font-bold">Frequently Asked Questions</h2>
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
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <ShieldCheck className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Ready to Rent with Confidence?
              </h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                Add GadgetCare+ to any rental for complete peace of mind. Just toggle it on when adding products to your cart.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/categories">
                  <Button size="lg" variant="secondary" className="rounded-full w-full sm:w-auto" data-testid="button-start-browsing">
                    Start Browsing
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto border-white/30 text-white hover:bg-white/10" data-testid="button-contact-us">
                    Contact Us
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
