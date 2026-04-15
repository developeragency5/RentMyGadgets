import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import StructuredData from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  CheckCircle2, 
  Users, 
  Globe, 
  Shield, 
  Sparkles, 
  Target, 
  Heart, 
  Leaf, 
  ArrowRight,
  Zap,
  TrendingUp,
  Clock,
  Truck,
  BadgePercent,
  Laptop,
  Camera,
  Headphones,
  Wifi,
  Quote,
  Building2,
  GraduationCap,
  Briefcase,
  Video,
  ChevronRight,
  Package,
  Wrench
} from "lucide-react";

export default function About() {
  return (
    <Layout>
      <StructuredData type="webPage" pageType="AboutPage" name="About RentMyGadgets" description="Learn about our mission to make premium technology accessible through flexible rental plans." url="https://rentmygadgets.com/about" />
      <SeoHead 
        title="About RentMyGadgets | Premium Tech Rentals Made Smart"
        description="Learn about RentMyGadgets — a tech rental platform offering laptops, cameras, and gadgets on flexible rental terms. Try before you buy, save smart, stay current."
        keywords="about RentMyGadgets, tech rental platform, rent gadgets, affordable technology access, flexible tech rental, try before you buy, equipment rental service"
      />

      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/80 via-white to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-primary/8 to-transparent rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-6" data-testid="text-hero-badge">
              Redefining Tech Access Since 2024
            </p>
            
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-8 leading-[1.1] tracking-tight">
              Premium Tech.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">Smart Savings.</span>
              <br />
              Zero Compromise.
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              We believe everyone deserves access to the latest, most powerful technology — without 
              the burden of ownership. RentMyGadgets puts <strong className="text-foreground">a wide range of premium gear</strong> at your 
              fingertips for a fraction of what it would cost to buy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-12 px-8 text-base rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all" data-testid="button-hero-browse">
                <Link href="/categories">
                  Explore Our Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base rounded-full" data-testid="button-hero-rent-to-own">
                <Link href="/rent-to-own">
                  Learn About Rent-to-Own
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto">
            <div className="text-center" data-testid="stat-categories">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">6</div>
              <div className="text-sm text-muted-foreground font-medium">Product Categories</div>
            </div>
            <div className="text-center" data-testid="stat-products">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">100+</div>
              <div className="text-sm text-muted-foreground font-medium">Products Available</div>
            </div>
            <div className="text-center" data-testid="stat-rental-terms">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">4</div>
              <div className="text-sm text-muted-foreground font-medium">Flexible Rental Terms</div>
            </div>
            <div className="text-center" data-testid="stat-protection">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">Optional</div>
              <div className="text-sm text-muted-foreground font-medium">GadgetCare+ Protection</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
              <div className="lg:col-span-3">
                <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold tracking-wide uppercase mb-4">
                  <Target className="h-4 w-4" />
                  Our Mission
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 leading-tight">
                  The Story Behind
                  <br />RentMyGadgets
                </h2>
                <div className="space-y-5 text-muted-foreground leading-relaxed">
                  <p className="text-lg">
                    It started with a frustrating reality we all know too well: <strong className="text-foreground">the best technology costs a fortune</strong>, 
                    becomes outdated quickly, and often sits unused after projects end.
                  </p>
                  <p>
                    In 2024, our founding team — a group of tech enthusiasts, photographers, and entrepreneurs — came 
                    together with a simple question: <em>"Why should access to great tools be limited to those who can 
                    afford to buy them outright?"</em>
                  </p>
                  <p>
                    We'd seen talented creators pass on opportunities because they couldn't afford a high-end camera. 
                    We'd watched startups struggle with outdated laptops that slowed their growth. We'd experienced the 
                    buyer's remorse of purchasing expensive gear that depreciated the moment we unboxed it.
                  </p>
                  <p className="text-lg font-medium text-foreground border-l-4 border-primary pl-5">
                    So we built something different. A platform where you can use the latest, most powerful 
                    technology — when you need it, for as long as you need it — without the commitment of buying.
                  </p>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 border border-orange-100">
                  <Quote className="h-10 w-10 text-primary/20 mb-4" />
                  <p className="text-lg italic text-muted-foreground leading-relaxed mb-6">
                    "To democratize access to premium technology by offering flexible, affordable rental solutions 
                    that empower creators, professionals, and businesses to achieve more."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Our Mission Statement</div>
                      <div className="text-xs text-muted-foreground">RentMyGadgets, Est. 2024</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold tracking-wide uppercase mb-4">
                <Zap className="h-4 w-4" />
                The Problem We Solve
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Traditional Ownership Is Broken
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The way people access technology hasn't kept up with how fast it evolves
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
              <div className="bg-white rounded-2xl p-7 border border-border/60 shadow-sm">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">The Price Barrier</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A professional MacBook costs $2,500+. A cinema-grade camera? $5,000+. These prices lock out 
                  talented individuals who can't justify the investment for a project or short-term need.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-7 border border-border/60 shadow-sm">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Rapid Obsolescence</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tech evolves fast. The laptop you buy today will be outdated in 2-3 years. Yet you're stuck 
                  with it, watching newer, better models release while your investment depreciates.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-7 border border-border/60 shadow-sm">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Commitment Anxiety</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "What if I buy the wrong model?" "What if I don't use it enough?" These questions haunt 
                  buyers, leading to decision paralysis or regretful purchases.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-12 border border-primary/15 shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-amber-500 rounded-2xl flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2">Our Solution: Smart Access, Not Ownership</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    With RentMyGadgets, you get all the benefits of premium technology — the performance, the capabilities, 
                    the prestige — without the downsides of ownership. Rent the latest models, upgrade when new tech drops, 
                    and only pay for what you actually use.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6 ml-0 md:ml-24">
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Always Latest Models
                </span>
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> No Depreciation Worry
                </span>
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Try Before You Buy
                </span>
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Flexible Commitments
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold tracking-wide uppercase mb-4">
                <Users className="h-4 w-4" />
                Who We Serve
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Built for Ambitious People</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From solo creators to enterprise teams, we help people access the tools they need to do their best work
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300" data-testid="card-persona-creators">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-5">
                    <Video className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Content Creators</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    YouTubers, podcasters, and influencers who need professional gear for high-quality content 
                    without investing thousands upfront.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300" data-testid="card-persona-business">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Startups & Businesses</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Growing companies that need to equip teams with premium tools while preserving capital 
                    for core business investments.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300" data-testid="card-persona-students">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-5">
                    <GraduationCap className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Students & Learners</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Students in film, photography, design, or tech fields who need professional equipment 
                    for projects and portfolio building.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300" data-testid="card-persona-freelancers">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-5">
                    <Briefcase className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Professionals & Freelancers</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Photographers, developers, designers, and consultants who need specialized equipment 
                    for client projects.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold tracking-wide uppercase mb-4">
                <Sparkles className="h-4 w-4" />
                Why Choose Us
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">What Makes Us Different</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Here's what we focus on to make your rental experience straightforward and reliable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="rounded-2xl p-7 border border-white/10 bg-white/5 hover:bg-white/8 transition-colors duration-300" data-testid="card-diff-models">
                <Sparkles className="h-8 w-8 text-amber-400 mb-5" />
                <h3 className="font-semibold text-lg mb-2">Only the Latest Models</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  We stock current-generation products only. MacBook Pro M3, Canon EOS R5, 
                  Sony A9 III — the gear professionals dream about.
                </p>
              </div>

              <div className="rounded-2xl p-7 border border-white/10 bg-white/5 hover:bg-white/8 transition-colors duration-300" data-testid="card-diff-rent-to-own">
                <BadgePercent className="h-8 w-8 text-amber-400 mb-5" />
                <h3 className="font-semibold text-lg mb-2">Rent-to-Own at 30% Off</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Love what you're renting? After 6 months, buy it at 70% of retail price. 
                  It's like an extended trial with a built-in discount.
                </p>
              </div>

              <div className="rounded-2xl p-7 border border-white/10 bg-white/5 hover:bg-white/8 transition-colors duration-300" data-testid="card-diff-no-credit">
                <Shield className="h-8 w-8 text-amber-400 mb-5" />
                <h3 className="font-semibold text-lg mb-2">Simple Approval Process</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Our rental process is designed to be straightforward. We aim to make 
                  getting started as easy as possible for everyone.
                </p>
              </div>

              <div className="rounded-2xl p-7 border border-white/10 bg-white/5 hover:bg-white/8 transition-colors duration-300" data-testid="card-diff-delivery">
                <Truck className="h-8 w-8 text-amber-400 mb-5" />
                <h3 className="font-semibold text-lg mb-2">Convenient Delivery</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  We offer doorstep delivery and pickup options. Free shipping is available 
                  on qualifying orders of 3+ months.
                </p>
              </div>

              <div className="rounded-2xl p-7 border border-white/10 bg-white/5 hover:bg-white/8 transition-colors duration-300" data-testid="card-diff-protection">
                <Package className="h-8 w-8 text-amber-400 mb-5" />
                <h3 className="font-semibold text-lg mb-2">Optional Damage Protection</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Accidents happen. Our GadgetCare+ protection plan covers accidental damage,
                  spills, and hardware issues for added peace of mind.
                </p>
              </div>

              <div className="rounded-2xl p-7 border border-white/10 bg-white/5 hover:bg-white/8 transition-colors duration-300" data-testid="card-diff-quality">
                <Wrench className="h-8 w-8 text-amber-400 mb-5" />
                <h3 className="font-semibold text-lg mb-2">Inspected Before Every Rental</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Every device is cleaned, inspected, and tested before 
                  shipment to help ensure a good experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold tracking-wide uppercase mb-4">
                <Heart className="h-4 w-4" />
                What We Stand For
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Our Core Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-5 p-7 rounded-2xl border border-border/60 bg-white shadow-sm" data-testid="card-value-accessibility">
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Accessibility First</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We believe premium technology should be within reach for everyone. Your budget shouldn't 
                    limit your potential. That's why we offer flexible daily, weekly, monthly, and yearly 
                    rentals at competitive rates.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-7 rounded-2xl border border-border/60 bg-white shadow-sm" data-testid="card-value-quality">
                <div className="w-11 h-11 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Uncompromising Quality</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Every device is rigorously tested, professionally cleaned, and updated to the latest 
                    software before reaching your hands. We only stock products we'd be proud to use ourselves.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-7 rounded-2xl border border-border/60 bg-white shadow-sm" data-testid="card-value-sustainability">
                <div className="w-11 h-11 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Sustainability Matters</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    By sharing resources through rentals, we reduce electronic waste and promote a circular 
                    economy. One device serving many users means fewer products in landfills and a lighter 
                    footprint on our planet.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-7 rounded-2xl border border-border/60 bg-white shadow-sm" data-testid="card-value-transparency">
                <div className="w-11 h-11 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Radical Transparency</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    No hidden fees, no surprise charges, no fine print gotchas. Our pricing is clear, our 
                    policies are straightforward, and our team is always honest — even when it's not what 
                    you want to hear.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold tracking-wide uppercase mb-4">
              <Laptop className="h-4 w-4" />
              Our Inventory
            </div>
            <h2 className="text-3xl font-heading font-bold mb-4">Premium Gear Across Every Category</h2>
            <p className="text-muted-foreground">
              From powerful laptops to cinema-grade cameras, we've got you covered
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            <Link href="/categories">
              <div className="flex items-center gap-3 bg-white hover:bg-primary/5 px-6 py-4 rounded-xl border border-border/60 shadow-sm transition-colors cursor-pointer" data-testid="link-category-laptops">
                <Laptop className="h-5 w-5 text-primary" />
                <span className="font-medium text-sm">Laptops & Desktops</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
            <Link href="/categories">
              <div className="flex items-center gap-3 bg-white hover:bg-primary/5 px-6 py-4 rounded-xl border border-border/60 shadow-sm transition-colors cursor-pointer" data-testid="link-category-cameras">
                <Camera className="h-5 w-5 text-primary" />
                <span className="font-medium text-sm">Cameras & Lenses</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
            <Link href="/categories">
              <div className="flex items-center gap-3 bg-white hover:bg-primary/5 px-6 py-4 rounded-xl border border-border/60 shadow-sm transition-colors cursor-pointer" data-testid="link-category-audio">
                <Headphones className="h-5 w-5 text-primary" />
                <span className="font-medium text-sm">Audio Equipment</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
            <Link href="/categories">
              <div className="flex items-center gap-3 bg-white hover:bg-primary/5 px-6 py-4 rounded-xl border border-border/60 shadow-sm transition-colors cursor-pointer" data-testid="link-category-networking">
                <Wifi className="h-5 w-5 text-primary" />
                <span className="font-medium text-sm">Networking</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-primary to-amber-500">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-white">
              Ready to Access Premium Tech?
            </h2>
            <p className="text-lg text-white/80 mb-10 leading-relaxed">
              Explore our catalog of laptops, cameras, and gear available on flexible rental terms. 
              Start browsing today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-50 px-8 h-12 text-base rounded-full shadow-lg" data-testid="button-cta-browse">
                <Link href="/categories">
                  Browse All Products <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 px-8 h-12 text-base rounded-full" data-testid="button-cta-contact">
                <Link href="/contact">
                  Contact Our Team
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
