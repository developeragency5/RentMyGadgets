// @ts-nocheck
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct } from "@/lib/api";
import { ProductImage } from "@/components/product-image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Gift, 
  Calendar, 
  CreditCard, 
  Home, 
  CheckCircle2, 
  Shield, 
  Clock, 
  Wallet, 
  ArrowRight,
  BadgePercent,
  Wrench,
  RefreshCcw,
  FileText,
  AlertCircle,
  HelpCircle,
  Phone,
  Mail,
  Sparkles,
  TrendingUp,
  Heart,
  Zap,
  ShoppingCart
} from "lucide-react";

export default function RentToOwn() {
  const searchParams = new URLSearchParams(window.location.search);
  const productId = searchParams.get('product');

  const { data: product } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId!),
    enabled: !!productId
  });

  const monthlyPrice = product ? parseFloat(product.pricePerMonth) : 0;
  const retailPrice = product ? parseFloat(product.retailPrice) : 0;
  const sixMonthTotal = monthlyPrice * 6;
  const buyoutPrice = Math.round(retailPrice * 0.7);
  const totalCostToOwn = sixMonthTotal + buyoutPrice;
  const savings = retailPrice - buyoutPrice;
  return (
    <Layout>
      <SeoHead 
        title="Rent-to-Own Program | Buyout Your Rental at a Reduced Price"
        description="Turn your rental into ownership. After 6 months of renting, buy any product at a reduced buyout price. Simple approval, flexible payments. Start your path to ownership today."
        keywords="rent to own electronics, rent to own laptops, rent to own cameras, tech rental purchase, lease to own gadgets, rental buyout program, flexible tech ownership"
      />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          {product ? (
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <Gift className="h-4 w-4" />
                    Own This Product for 30% Off
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 leading-tight">
                    Own Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">{product.name}</span>
                  </h2>
                  
                  <p className="text-lg text-muted-foreground mb-6">
                    After 6 months of renting, buy this {product.name} for just <span className="font-bold text-amber-600">${buyoutPrice.toLocaleString()}</span> — that's <span className="font-bold text-green-600">30% off</span> the ${retailPrice.toLocaleString()} retail price!
                  </p>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 mb-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Monthly Rental</div>
                        <div className="text-2xl font-bold">${monthlyPrice.toFixed(0)}/mo</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">After 6 Months Paid</div>
                        <div className="text-2xl font-bold">${sixMonthTotal.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="border-t border-amber-200 dark:border-amber-800 pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Buyout Price</div>
                          <div className="text-3xl font-bold text-amber-600">${buyoutPrice.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Retail: <span className="line-through">${retailPrice.toLocaleString()}</span></div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground mb-1">You Save</div>
                          <div className="text-2xl font-bold text-green-600">${savings.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href={`/product/${productId}`}>
                      <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 h-12 rounded-full w-full sm:w-auto">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Start Renting Now
                      </Button>
                    </Link>
                    <Button size="lg" variant="outline" className="h-12 rounded-full px-6" asChild>
                      <a href="#how-it-works">See How It Works</a>
                    </Button>
                  </div>
                </div>

                <div className="order-1 lg:order-2">
                  <div className="aspect-square max-w-md mx-auto rounded-3xl overflow-hidden bg-white border shadow-xl">
                    <ProductImage 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mt-12">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Simple Approval Process
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Optional GadgetCare+ Protection
                </div>
                <div className="flex items-center gap-2">
                  <BadgePercent className="h-5 w-5 text-amber-500" />
                  Buyout Price: ${buyoutPrice.toLocaleString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Gift className="h-4 w-4" />
                Rent-to-Own Program
              </div>
              
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight">
                Rent Today.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Own Tomorrow.</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Love the tech you're renting? After just 6 months, you can make it yours at 
                <span className="font-bold text-amber-600 dark:text-amber-500"> 30% off the retail price</span>. 
                Simple approval, flexible payments — a straightforward path to ownership.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/categories">
                  <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 h-14 text-lg rounded-full">
                    Browse Products <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-14 text-lg rounded-full px-8" asChild>
                  <a href="#how-it-works">Learn How It Works</a>
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Simple Approval Process
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Optional GadgetCare+ Protection
                </div>
                <div className="flex items-center gap-2">
                  <BadgePercent className="h-5 w-5 text-amber-500" />
                  Flexible Buyout Pricing
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">How Rent-to-Own Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our simple 4-step process makes ownership easy and affordable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-background rounded-2xl p-6 border shadow-sm h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Choose Your Gear</h3>
                <p className="text-muted-foreground">
                  Browse our catalog of premium tech products. Select the perfect laptop, camera, or gadget for your needs.
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="h-6 w-6 text-amber-500" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-background rounded-2xl p-6 border shadow-sm h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Rent Monthly</h3>
                <p className="text-muted-foreground">
                  Pay an affordable monthly rate. No long-term commitment required — just flexible, transparent pricing.
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="h-6 w-6 text-amber-500" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-background rounded-2xl p-6 border shadow-sm h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Rent for 6 Months</h3>
                <p className="text-muted-foreground">
                  Use and enjoy your equipment. After 6 consecutive months of rental, you unlock the buyout option.
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="h-6 w-6 text-amber-500" />
              </div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-sm h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4">
                  <Gift className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Own It Forever</h3>
                <p className="text-muted-foreground">
                  Purchase at <span className="font-bold text-amber-600">70% of retail price</span> — that's 30% off! The product is yours to keep.
                </p>
              </div>
            </div>
          </div>

          {/* Example Calculation */}
          <div className="mt-16 max-w-3xl mx-auto">
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2">
              <CardContent className="p-8">
                {product ? (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border shrink-0">
                        <ProductImage src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-amber-500" />
                          Your {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">Here's your personalized path to ownership</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-background rounded-xl">
                        <div className="text-sm text-muted-foreground mb-1">Monthly Rental</div>
                        <div className="text-2xl font-bold">${monthlyPrice.toFixed(0)}/mo</div>
                      </div>
                      <div className="text-center p-4 bg-background rounded-xl">
                        <div className="text-sm text-muted-foreground mb-1">After 6 Months</div>
                        <div className="text-2xl font-bold">${sixMonthTotal.toLocaleString()} paid</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-xl border border-amber-300 dark:border-amber-700">
                        <div className="text-sm text-muted-foreground mb-1">Buyout Price</div>
                        <div className="text-2xl font-bold text-amber-600">${buyoutPrice.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground mt-1">Retail: <span className="line-through">${retailPrice.toLocaleString()}</span></div>
                      </div>
                    </div>
                    <p className="text-center text-muted-foreground mt-6 text-sm">
                      Total cost to own: ${totalCostToOwn.toLocaleString()} (rental + buyout) — <span className="font-semibold">buyout at 30% below retail price</span>
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border shrink-0">
                        <img 
                          src="https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp14-spaceblack-select-202410?wid=904&hei=840&fmt=jpeg&qlt=90" 
                          alt="MacBook Pro 14 M3"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-amber-500" />
                          Example: MacBook Pro 14" M3
                        </h3>
                        <p className="text-sm text-muted-foreground">See how the Rent-to-Own buyout works</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-background rounded-xl">
                        <div className="text-sm text-muted-foreground mb-1">Monthly Rental</div>
                        <div className="text-2xl font-bold">$179/mo</div>
                      </div>
                      <div className="text-center p-4 bg-background rounded-xl">
                        <div className="text-sm text-muted-foreground mb-1">After 6 Months</div>
                        <div className="text-2xl font-bold">$1,074 paid</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-xl border border-amber-300 dark:border-amber-700">
                        <div className="text-sm text-muted-foreground mb-1">Buyout Price</div>
                        <div className="text-2xl font-bold text-amber-600">$1,119</div>
                        <div className="text-xs text-muted-foreground mt-1">Retail: <span className="line-through">$1,599</span></div>
                      </div>
                    </div>
                    <p className="text-center text-muted-foreground mt-6 text-sm">
                      Total cost to own: $2,193 (rental + buyout) — <span className="font-semibold">buyout at 30% below retail price</span>
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Who Can Participate?</h2>
              <p className="text-lg text-muted-foreground">
                Our Rent-to-Own program is designed to be accessible to everyone
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Eligibility Requirements
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                      <span className="text-muted-foreground">Must be 18 years or older with valid government-issued ID</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                      <span className="text-muted-foreground">Active RentMyGadgets account in good standing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                      <span className="text-muted-foreground">6 consecutive months of on-time rental payments</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                      <span className="text-muted-foreground">Same product rented continuously (no gaps exceeding 7 days)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                      <span className="text-muted-foreground">No outstanding damage claims or disputes</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    Security & Verification
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span className="text-muted-foreground"><strong>Eligibility based on rental history</strong> — maintain your account in good standing to qualify</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span className="text-muted-foreground">Standard security deposit applies during rental period</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span className="text-muted-foreground">Deposit is fully refunded or applied to buyout price</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span className="text-muted-foreground">Valid payment method (credit/debit card) required</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span className="text-muted-foreground">US shipping address required for delivery</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Structure */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Transparent Pricing</h2>
              <p className="text-lg text-muted-foreground">
                No hidden fees, no surprises — just honest, straightforward pricing
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      How Pricing Works
                    </h3>
                    <div className="bg-secondary/50 p-6 rounded-xl space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b">
                        <span className="font-medium">Monthly Rental Rate</span>
                        <span className="text-muted-foreground">Varies by product ($29-$599/month)</span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b">
                        <span className="font-medium">Minimum Rental Period</span>
                        <span className="text-muted-foreground">6 months for buyout eligibility</span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b">
                        <span className="font-medium">Buyout Price</span>
                        <span className="font-bold text-amber-600">70% of Retail Price</span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b">
                        <span className="font-medium">Security Deposit</span>
                        <span className="text-muted-foreground">Equal to 1 month's rental (refundable)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Rental Payments Applied to Buyout?</span>
                        <span className="text-red-500">No — buyout is a separate discounted purchase</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-6 rounded-xl">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      Important Note on Rental Payments
                    </h4>
                    <p className="text-muted-foreground">
                      Your monthly rental payments provide you with the right to use the equipment and build eligibility for the buyout option. 
                      They are not applied toward the purchase price. The buyout price of 70% of retail is already a significant discount 
                      that reflects the value of your loyalty and continued rental.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ownership Transfer */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Ownership Transfer Process</h2>
              <p className="text-lg text-muted-foreground">
                When you're ready to own your equipment, here's what happens
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Transfer Steps
                  </h3>
                  <ol className="space-y-4">
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center shrink-0">1</span>
                      <span className="text-muted-foreground">After 6 months, you'll receive an email with your buyout offer</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center shrink-0">2</span>
                      <span className="text-muted-foreground">Log into your dashboard and click "Exercise Buyout Option"</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center shrink-0">3</span>
                      <span className="text-muted-foreground">Pay the discounted buyout price (70% of retail)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center shrink-0">4</span>
                      <span className="text-muted-foreground">Receive your ownership certificate and warranty transfer</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center shrink-0">5</span>
                      <span className="text-muted-foreground">Security deposit is refunded within 5-7 business days</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Timeline & Deadlines
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-muted-foreground"><strong>Buyout Window:</strong> You have 30 days after reaching 6 months to exercise your buyout option</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-muted-foreground"><strong>Continued Rental:</strong> If you don't buy out, you can continue renting month-to-month</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-muted-foreground"><strong>Extended Eligibility:</strong> Buyout option remains available as long as you continue renting</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-muted-foreground"><strong>Processing Time:</strong> Ownership transfer completes within 2-3 business days</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Policies Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Policies & Terms</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about our policies
              </p>
            </div>

            <div className="space-y-6">
              {/* Late Payments */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-red-500" />
                    Late Payment & Failure-to-Pay Policy
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      We understand that life happens. Here's how we handle payment issues while keeping your buyout eligibility intact:
                    </p>
                    <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
                      <p><strong>Grace Period:</strong> 5-day grace period after your payment due date with no penalties</p>
                      <p><strong>Late Fee:</strong> $15 late fee applies after the grace period</p>
                      <p><strong>14 Days Late:</strong> Service may be temporarily suspended; late fees continue to accrue</p>
                      <p><strong>30 Days Late:</strong> Account may be sent to collections; buyout eligibility paused</p>
                      <p><strong>Restoration:</strong> Pay all outstanding balances to restore your account and buyout progress</p>
                    </div>
                    <p className="text-sm">
                      <strong>Note:</strong> If you're experiencing financial hardship, please contact us. We offer payment plans and may be able to adjust your rental terms.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Warranty & Repairs */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-blue-500" />
                    Warranty, Repairs & Product Condition
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-secondary/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">During Rental Period</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Optional GadgetCare+ protection available</li>
                          <li>• Repairs for normal wear and tear included</li>
                          <li>• Replacement available for defective units</li>
                          <li>• Technical support included</li>
                        </ul>
                      </div>
                      <div className="bg-secondary/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">After Buyout</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Remaining manufacturer warranty transfers to you</li>
                          <li>• Additional warranty coverage may be available</li>
                          <li>• Extended warranty available for purchase</li>
                          <li>• Access to our repair network at member rates</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Product Condition at Buyout</h4>
                      <p className="text-sm">
                        Products are sold "as-is" in their current condition at the time of buyout. We thoroughly inspect and certify that all 
                        products are fully functional. Normal cosmetic wear (minor scratches, scuffs) does not affect the buyout price.
                        Products with significant damage beyond normal wear may have adjusted buyout pricing.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Returns, Cancellations, Upgrades */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <RefreshCcw className="h-5 w-5 text-green-500" />
                    Returns, Cancellations & Upgrades
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-secondary/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Returns</h4>
                        <p className="text-sm">
                          You can return your rental at any time. No early termination fees. Your buyout progress is saved for 60 days 
                          if you return and re-rent the same product.
                        </p>
                      </div>
                      <div className="bg-secondary/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Cancellations</h4>
                        <p className="text-sm">
                          Cancel your buyout within 14 days of purchase for a full refund. After 14 days, standard return policies apply. 
                          Deposit is always refunded.
                        </p>
                      </div>
                      <div className="bg-secondary/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Upgrades</h4>
                        <p className="text-sm">
                          Want a newer model? You can upgrade anytime. Your rental history carries over, so you only need to complete 
                          the remaining months on the new product.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Why Choose Rent-to-Own?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The smart way to get the tech you need without the upfront cost
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BadgePercent className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold mb-2">Reduced Buyout Pricing</h3>
                <p className="text-sm text-muted-foreground">
                  Our buyout price is set at 70% of the retail price at the time of your rental start date.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold mb-2">Simple Approval</h3>
                <p className="text-sm text-muted-foreground">
                  Eligibility is based on your rental history with us. Maintain good standing to qualify.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-bold mb-2">Try Before You Buy</h3>
                <p className="text-sm text-muted-foreground">
                  Use the product for 6 months before committing. Make sure it's right for you.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-bold mb-2">No Obligation</h3>
                <p className="text-sm text-muted-foreground">
                  Don't love it? Simply return it. No pressure, no penalties, no hard feelings.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/50 dark:to-pink-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Wrench className="h-7 w-7 text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="font-bold mb-2">Warranty Transfer</h3>
                <p className="text-sm text-muted-foreground">
                  Remaining manufacturer warranty transfers to you at buyout. Extended coverage available.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/50 dark:to-cyan-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="font-bold mb-2">Build Equity</h3>
                <p className="text-sm text-muted-foreground">
                  Your rental payments give you access to ownership. Stop throwing money away.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <RefreshCcw className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-bold mb-2">Upgrade Anytime</h3>
                <p className="text-sm text-muted-foreground">
                  Switch to a newer model anytime. Your rental history transfers to the new product.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/50 dark:to-teal-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Wallet className="h-7 w-7 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="font-bold mb-2">Budget-Friendly</h3>
                <p className="text-sm text-muted-foreground">
                  Spread the cost over time. No large upfront payment required.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Got questions? We've got answers.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-background rounded-xl border px-6">
                <AccordionTrigger className="text-left font-semibold">
                  What happens to my rental payments? Are they applied to the purchase?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  No, your monthly rental payments are for the use of the equipment during your rental period. They are not applied toward 
                  the buyout price. However, the buyout price (70% of retail) is already a significant discount that rewards your loyalty 
                  as a long-term renter.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-background rounded-xl border px-6">
                <AccordionTrigger className="text-left font-semibold">
                  Can I buy out my rental before 6 months?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  The 6-month rental period is required to qualify for the discounted buyout price. If you want to purchase before 
                  6 months, you would pay the full retail price. We recommend waiting to take advantage of the 30% savings!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-background rounded-xl border px-6">
                <AccordionTrigger className="text-left font-semibold">
                  What if I miss a payment? Do I lose my buyout eligibility?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  You have a 5-day grace period for late payments. If you catch up within 30 days, your buyout progress remains intact. 
                  After 30 days of non-payment, your eligibility is paused but can be restored by paying all outstanding balances. 
                  We're flexible — just communicate with us if you're having issues.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-background rounded-xl border px-6">
                <AccordionTrigger className="text-left font-semibold">
                  What condition will the product be in when I buy it?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  You'll be purchasing the exact product you've been using. We certify that all products are fully functional before 
                  buyout. Normal cosmetic wear (minor scratches, light scuffs) is expected and doesn't affect the price. Any significant 
                  damage would be addressed during your rental period under our damage protection policy.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-background rounded-xl border px-6">
                <AccordionTrigger className="text-left font-semibold">
                  Is there a warranty after I buy the product?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Any remaining manufacturer warranty transfers to you at the time of buyout. 
                  You may also be able to purchase extended warranty coverage at the time of buyout — ask our team for details.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-background rounded-xl border px-6">
                <AccordionTrigger className="text-left font-semibold">
                  Can I upgrade to a newer model and keep my rental progress?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Yes! If you want to upgrade to a newer or different model, your rental history carries over. For example, if you've 
                  rented for 4 months and upgrade, you only need 2 more months on the new product to qualify for its buyout option.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="bg-background rounded-xl border px-6">
                <AccordionTrigger className="text-left font-semibold">
                  What happens to my security deposit?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  When you exercise your buyout option, your security deposit is fully refunded to your original payment method within 
                  5-7 business days. Alternatively, you can apply it toward your buyout payment to reduce the amount due.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="bg-background rounded-xl border px-6">
                <AccordionTrigger className="text-left font-semibold">
                  Do you check my credit score?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Eligibility for the Rent-to-Own program is based on your rental history with us rather than a traditional credit check. 
                  As long as you maintain your account in good standing with on-time payments, you'll qualify.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9" className="bg-background rounded-xl border px-6">
                <AccordionTrigger className="text-left font-semibold">
                  What if I decide I don't want to buy the product after 6 months?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  No problem! The buyout option is exactly that — an option. You can continue renting month-to-month, return the 
                  product at any time, or switch to a different product. There's no obligation to purchase.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10" className="bg-background rounded-xl border px-6">
                <AccordionTrigger className="text-left font-semibold">
                  How long do I have to exercise my buyout option?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Once you reach 6 months of rental, you have an initial 30-day window to exercise your buyout at the locked-in price. 
                  If you continue renting past that window, the buyout option remains available as long as you're an active renter, 
                  though prices may adjust based on market conditions.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-50 dark:bg-slate-900/50">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Legal Disclaimers & Terms
                </h3>
                <div className="text-sm text-muted-foreground space-y-3">
                  <p>
                    <strong>Program Terms:</strong> The Rent-to-Own program is subject to our standard rental agreement terms and conditions. 
                    Buyout pricing is calculated at 70% of the manufacturer's suggested retail price (MSRP) at the time of your rental start date.
                  </p>
                  <p>
                    <strong>Eligibility:</strong> Buyout eligibility requires 6 consecutive months of on-time rental payments with no gaps 
                    exceeding 7 days. RentMyGadgets reserves the right to modify or terminate the Rent-to-Own program at any time, though 
                    existing qualified renters will have their buyout rights honored.
                  </p>
                  <p>
                    <strong>Product Availability:</strong> Buyout options are subject to product availability. In rare cases where a product 
                    is discontinued, we will offer a comparable replacement or a prorated refund of rental payments.
                  </p>
                  <p>
                    <strong>Tax Implications:</strong> Customers are responsible for any applicable sales tax on the buyout purchase. 
                    Tax rates vary by state and locality.
                  </p>
                  <p>
                    <strong>Warranty Limitations:</strong> Transferred warranties are subject to the original manufacturer's terms and conditions. 
                    Any additional coverage provided by RentMyGadgets covers functional defects only, not cosmetic wear or damage from misuse. Contact our team for specific warranty details.
                  </p>
                  <p>
                    For complete terms and conditions, please review our <Link href="/terms" className="text-primary underline">Terms of Service</Link> and 
                    <Link href="/rental-policy" className="text-primary underline ml-1">Rental Agreement Policy</Link>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to Start Your Journey to Ownership?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Browse our collection of premium tech products and start renting today. 
            Your path to ownership begins with a single click.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/categories">
              <Button size="lg" className="bg-white text-amber-600 hover:bg-gray-100 px-8 h-14 text-lg rounded-full">
                Browse All Products <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 h-14 text-lg rounded-full">
                <Phone className="mr-2 h-5 w-5" /> Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-4">Have More Questions?</h3>
            <p className="text-muted-foreground mb-6">
              Our team is here to help you understand the Rent-to-Own program and find the perfect tech for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Phone className="h-5 w-5 text-primary" />
                <span>Contact Support</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Mail className="h-5 w-5 text-primary" />
                <span>support@rentmygadgets.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
