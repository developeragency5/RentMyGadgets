import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Search, 
  ShoppingCart, 
  Calendar, 
  CreditCard, 
  Truck, 
  Package, 
  RotateCcw,
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  Headphones
} from "lucide-react";

const steps = [
  {
    number: 1,
    icon: <Search className="h-8 w-8" />,
    title: "Browse & Select",
    description: "Explore our wide range of tech gadgets including laptops, cameras, desktops, and more. Use filters to find exactly what you need.",
    details: ["Browse by category or search", "Compare products side-by-side", "Check availability and specs"]
  },
  {
    number: 2,
    icon: <Calendar className="h-8 w-8" />,
    title: "Choose Rental Period",
    description: "Select a flexible rental period that suits your needs - daily, weekly, monthly, or yearly. Longer periods offer better rates!",
    details: ["Daily rentals for quick projects", "Weekly for short-term needs", "Monthly for extended use"]
  },
  {
    number: 3,
    icon: <ShoppingCart className="h-8 w-8" />,
    title: "Add to Cart",
    description: "Add your selected items to the cart. You can rent multiple items at once and adjust quantities as needed.",
    details: ["Rent up to 5 units per product", "Mix different rental periods", "Review before checkout"]
  },
  {
    number: 4,
    icon: <CreditCard className="h-8 w-8" />,
    title: "Secure Checkout",
    description: "Complete your order with our secure checkout. We accept credit cards, PayPal, Apple Pay, and Cash on Delivery.",
    details: ["Multiple payment options", "SSL encrypted transactions", "Refundable security deposit"]
  },
  {
    number: 5,
    icon: <Truck className="h-8 w-8" />,
    title: "Fast Delivery",
    description: "Your equipment is delivered right to your doorstep within 24 hours. Free delivery on all orders!",
    details: ["24-hour standard delivery", "Free shipping nationwide", "Trackable shipments"]
  },
  {
    number: 6,
    icon: <Package className="h-8 w-8" />,
    title: "Use Your Gear",
    description: "Enjoy using your rented equipment for your project, event, or business needs. Full support available if you need help.",
    details: ["Quality-checked equipment", "Full technical support", "User guides included"]
  },
  {
    number: 7,
    icon: <RotateCcw className="h-8 w-8" />,
    title: "Return or Renew",
    description: "When your rental period ends, simply return the equipment or extend your rental with just a few clicks.",
    details: ["Easy online renewal", "Free return pickup", "Flexible extensions available"]
  }
];

const benefits = [
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Flexible Terms",
    description: "No long-term commitments. Rent for as short as a day or as long as you need."
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Protection Available",
    description: "Add GadgetCare+ for coverage against accidental damage and spills."
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    title: "Quality Checked",
    description: "Every item is tested, cleaned, and inspected before delivery."
  },
  {
    icon: <Headphones className="h-6 w-6" />,
    title: "Customer Support",
    description: "Our team is available to help with any questions or issues."
  }
];

export default function HowItWorks() {
  return (
    <Layout>
      <SeoHead 
        title="How It Works"
        description="Learn how to rent tech gadgets from RentMyGadgets in 7 simple steps. Browse, select, checkout, and get fast delivery. Easy returns and renewals."
        keywords="how to rent gadgets, rental process, tech rental steps, equipment rental guide, rent electronics, gadget hire process"
      />
      
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            How It Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Renting tech has never been easier. Get the equipment you need in just a few simple steps.
          </p>
          <Link href="/categories">
            <Button size="lg" className="rounded-full" data-testid="button-start-browsing">
              Start Browsing <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="relative" data-testid={`step-${step.number}`}>
                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-20 w-0.5 h-full bg-gradient-to-b from-primary to-primary/20 hidden md:block" />
                )}
                <div className="flex gap-6 mb-12">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        Step {step.number}
                      </span>
                    </div>
                    <h3 className="text-2xl font-heading font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Why Rent With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center" data-testid={`benefit-${index}`}>
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
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

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Browse our catalog of premium tech equipment and find the perfect gear for your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/categories">
                  <Button size="lg" variant="secondary" className="rounded-full w-full sm:w-auto" data-testid="button-browse-categories">
                    Browse Categories
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" data-testid="button-contact-us">
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
