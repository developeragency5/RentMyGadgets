import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import StructuredData from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Clock, 
  Search, 
  Laptop, 
  Monitor, 
  Printer, 
  Wifi, 
  Headphones, 
  Camera,
  Smartphone,
  Zap,
  RefreshCw,
  BadgeCheck,
  Sparkles,
  TrendingUp,
  Users,
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
  DollarSign,
  Building2,
  GraduationCap,
  Briefcase,
  Wrench,
  ChevronDown,
  Quote,
  BarChart3,
  Package,
  Globe,
  Heart,
  CalendarDays
} from "lucide-react";
import heroImage from "@assets/stock_images/professional_busines_f4477421.jpg";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchProducts } from "@/lib/api";
import { ProductImage } from "@/components/product-image";
import WhyRent from "@/components/WhyRent";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function AnimatedSection({ children, className = "", delay = 0 }: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.4, 
        delay, 
        ease: [0.25, 0.1, 0.25, 1] 
      }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  index: number;
}

function AnimatedCard({ children, className = "" }: AnimatedCardProps) {
  return <div className={className}>{children}</div>;
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden" data-testid={`faq-${index}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-foreground pr-4">{question}</span>
        <ChevronDown className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-muted-foreground leading-relaxed border-t border-slate-100 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
}

const categoryIcons: Record<string, typeof Laptop> = {
  "Laptops": Laptop,
  "Desktops / PCs": Monitor,
  "Desktops & Laptops": Monitor,
  "Phones": Smartphone,
  "Printers & Scanners": Printer,
  "Routers": Wifi,
  "Headphones & Accessories": Headphones,
  "Headphones": Headphones,
  "Cameras & Gear": Camera,
};

const categoryOrder: Record<string, number> = {
  "Desktops & Laptops": 1,
  "Phones": 2,
  "Printers & Scanners": 3,
  "Headphones": 4,
  "Cameras & Gear": 5,
  "Routers": 6,
};

function CategoriesCarousel({ 
  categories, 
  categoriesLoading, 
  categoryIcons, 
  categoryOrder 
}: { 
  categories: any[];
  categoriesLoading: boolean;
  categoryIcons: Record<string, typeof Laptop>;
  categoryOrder: Record<string, number>;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    align: 'start',
    slidesToScroll: 1,
    dragFree: false,
    containScroll: 'trimSnaps'
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const sortedCategories = [...categories].sort((a, b) => {
    const orderA = categoryOrder[a.name] ?? 999;
    const orderB = categoryOrder[b.name] ?? 999;
    return orderA - orderB;
  });

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-50 to-transparent rounded-full blur-3xl opacity-60" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Zap className="h-4 w-4" />
              Browse Categories
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
              Find Your Perfect <span className="text-primary">Device</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              From powerful laptops to professional cameras, find the right gear for your project.
            </p>
          </div>
          <Link href="/categories" className="group inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all" data-testid="link-view-all-categories">
            View All Categories 
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimatedSection>

        {categoriesLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 hidden md:flex"
              data-testid="category-carousel-prev"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
              <div className="flex gap-8">
                {sortedCategories.map((cat) => {
                  const Icon = categoryIcons[cat.name] || Laptop;
                  return (
                    <div 
                      key={cat.id} 
                      className="flex-[0_0_90%] sm:flex-[0_0_48%] md:flex-[0_0_42%] lg:flex-[0_0_38%] min-w-0"
                    >
                      <Link 
                        href={`/categories/${cat.id}`} 
                        className="group block cursor-pointer" 
                        data-testid={`category-${cat.id}`}
                      >
                        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/50 shadow-lg hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-3 transition-all duration-500">
                          <div className="aspect-[16/10] overflow-hidden">
                            <img 
                              src={cat.imageUrl || ''} 
                              alt={`Browse ${cat.name} rentals at RentMyGadgets`}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                          </div>
                          
                          <div className="absolute bottom-0 left-0 right-0 p-8">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-bold text-2xl text-white group-hover:text-primary transition-colors">
                                  {cat.name}
                                </h3>
                              </div>
                              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                                <Icon className="h-8 w-8 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <button
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 hidden md:flex"
              data-testid="category-carousel-next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="flex justify-center gap-2 mt-8">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === selectedIndex 
                      ? 'bg-primary w-8' 
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  data-testid={`category-dot-${index}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const { data: featuredProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => fetchProducts({ featured: true })
  });

  const heroAnimationProps = prefersReducedMotion 
    ? {} 
    : {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
      };

  return (
    <Layout>
      <SeoHead 
        title="Rent High-End Tech Gadgets Online"
        description="Rent laptops, desktops, cameras, printers, headphones and routers. Flexible daily, weekly, or monthly plans with delivery options. Quality-checked devices."
        keywords="rent gadgets, tech rental, laptop rental, camera rental, desktop rental, equipment hire, gadget hire, technology rental service, rent electronics, short term rental"
      />
      <StructuredData type="organization" />
      <StructuredData type="website" />

      {/* Hero Section - Modern Clean Design */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-orange-50/30">
        {/* Minimal Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-orange-100/60 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-amber-100/40 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Main Headline */}
              <div className="space-y-6">
                <motion.h1 
                  className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold leading-[1.1] tracking-tight"
                  initial={prefersReducedMotion ? undefined : { opacity: 0, x: -30 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={prefersReducedMotion ? undefined : { duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <span className="text-foreground">Rent the</span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-amber-500">
                    Tech You Need
                  </span>
                </motion.h1>
                <motion.p 
                  className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed"
                  initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={prefersReducedMotion ? undefined : { duration: 0.4, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  Laptops, cameras, and gear for any project. No long-term contracts, 
                  <span className="text-foreground font-medium"> fast delivery in select areas</span>, and optional damage protection.
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={prefersReducedMotion ? undefined : { duration: 0.4, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Link href="/categories">
                  <motion.div
                    whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button 
                      size="lg" 
                      className="h-14 px-8 text-base font-semibold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-shadow duration-300 bg-primary hover:bg-primary/90"
                      data-testid="button-explore-categories"
                    >
                      Browse All Categories
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/how-it-works">
                  <motion.div
                    whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="h-14 px-8 text-base font-semibold rounded-2xl bg-white border-2 border-slate-200 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300"
                      data-testid="button-how-it-works"
                    >
                      How It Works
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Trust Indicators - Simplified */}
              <div className="flex flex-wrap items-center gap-8 pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Quality Checked</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-5 w-5 text-blue-500" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-5 w-5 text-purple-500" />
                  <span>Protection Available</span>
                </div>
              </div>
            </div>
            
            {/* Right - Hero Image */}
            <div className="relative hidden lg:block">
              {/* Main Image */}
              <div className="relative">
                <img 
                  src={heroImage} 
                  alt="Professional working with laptop in modern workspace" 
                  className="relative w-full rounded-3xl shadow-2xl shadow-slate-200/50 object-cover aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Rent Section */}
      <WhyRent />

      {/* Categories Section - Premium Cards with Carousel */}
      <CategoriesCarousel 
        categories={categories} 
        categoriesLoading={categoriesLoading}
        categoryIcons={categoryIcons}
        categoryOrder={categoryOrder}
      />

      {/* Featured Products - Trending Rentals */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4" />
              Trending Now
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Most Popular <span className="text-primary">Rentals</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Popular gadgets chosen by professionals, creators, and businesses.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productsLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              featuredProducts.map((product, index) => {
                const isPhone = product.categoryId === 'c9f3d7d1-34c8-4f9f-9dec-57a808b28e35';
                return (
                <AnimatedCard key={product.id} index={index}>
                  <Link 
                    href={`/product/${product.slug || product.id}`} 
                    className="group block cursor-pointer h-full" 
                    data-testid={`product-${product.id}`}
                  >
                    <div className="relative bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden h-full flex flex-col hover:shadow-lg hover:border-primary/20">
                    {/* Badge */}
                    {index === 0 && (
                      <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary to-amber-500 text-white text-xs font-semibold shadow-lg">
                        <Sparkles className="h-3 w-3" />
                        Featured
                      </div>
                    )}
                    
                    {/* Image Container */}
                    <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 ${isPhone ? 'p-4' : ''}`}>
                      <div className="w-full h-full">
                        <ProductImage 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className={`w-full h-full ${isPhone ? 'object-contain' : 'object-cover'}`}
                        />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Title */}
                      <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-2 group-hover:text-primary">
                        {product.name}
                      </h3>
                      
                      {/* Specs */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.specs?.slice(0, 2).map((spec) => (
                          <span key={spec} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">
                            {spec}
                          </span>
                        ))}
                      </div>
                      
                      {/* Price & CTA */}
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                        <div>
                          <div className="text-2xl font-bold text-foreground">
                            ${product.pricePerMonth}
                            <span className="text-sm font-normal text-muted-foreground">/mo</span>
                          </div>
                          <p className="text-xs text-green-600 font-medium">Rent instead of buying</p>
                        </div>
                        <Button 
                          size="sm" 
                          className="rounded-xl px-5 shadow-lg shadow-primary/20 hover:shadow-primary/30"
                          data-testid={`button-rent-${product.id}`}
                        >
                          Rent Now
                        </Button>
                      </div>
                    </div>
                  </div>
                  </Link>
                </AnimatedCard>
              );
              })
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/categories">
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-2xl px-8 h-14 text-base font-semibold border-2 hover:bg-primary hover:text-white hover:border-primary transition-all"
                data-testid="button-view-all-products"
              >
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Trust Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <CheckCircle2 className="h-4 w-4" />
              Why Choose Us
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              The Smart Way to <span className="text-primary">Access Tech</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              We've designed our service around what matters most to you.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Protection Available",
                description: "Add GadgetCare+ for coverage against accidental damage and spills.",
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-blue-50"
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                description: "Get your gear when you need it. Same-day available in select areas.",
                color: "from-green-500 to-emerald-500",
                bgColor: "bg-green-50"
              },
              {
                icon: BadgeCheck,
                title: "Quality Checked",
                description: "Every device is tested, cleaned, and inspected before delivery.",
                color: "from-purple-500 to-violet-500",
                bgColor: "bg-purple-50"
              },
              {
                icon: RefreshCw,
                title: "Flexible Returns",
                description: "Extend or return anytime. No hidden fees, no hassle.",
                color: "from-primary to-amber-500",
                bgColor: "bg-orange-50"
              }
            ].map((feature, index) => (
              <AnimatedCard key={index} index={index}>
                <div 
                  className="group relative bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full"
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Timeline Style */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Rent in <span className="text-primary">3 Easy Steps</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Getting the tech you need has never been easier.
            </p>
          </AnimatedSection>

          <div className="relative">
            {/* Connection Line - Desktop */}
            <div className="hidden lg:block absolute top-24 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
              {[
                {
                  step: "01",
                  icon: Search,
                  title: "Browse & Choose",
                  description: "Explore our catalog of premium devices. Filter by category, specs, or price to find your perfect match."
                },
                {
                  step: "02",
                  icon: Clock,
                  title: "Select Duration",
                  description: "Pick your rental period - daily, weekly, monthly, or yearly. Extend anytime if you need more time."
                },
                {
                  step: "03",
                  icon: Truck,
                  title: "Receive & Enjoy",
                  description: "We deliver to your doorstep within 24 hours. Use your device, and we'll pick it up when you're done."
                }
              ].map((item, index) => (
                <AnimatedCard key={index} index={index}>
                  <div className="relative group">
                    {/* Step Number */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 lg:left-1/2 lg:-translate-x-1/2 z-10">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                        {item.step}
                      </div>
                    </div>
                    
                    {/* Card */}
                    <div className="bg-white rounded-3xl p-8 pt-14 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-colors">
                        <item.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-4">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6 backdrop-blur-sm">
              <Users className="h-4 w-4 text-amber-400" />
              How People Use RentMyGadgets
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-400">Every Need</span>
            </h2>
            <p className="text-lg text-white/70">
              Whether you're a freelancer, a startup, or just need gear for a project — we've got you covered.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Laptop,
                title: "Short-Term Projects",
                description: "Need a powerful workstation for a few weeks? Rent exactly what you need without buying equipment that'll sit idle afterward."
              },
              {
                icon: Camera,
                title: "Creative Work",
                description: "Access high-end cameras, lenses, and audio gear for shoots, events, or content creation — all without the upfront investment."
              },
              {
                icon: Monitor,
                title: "Team Equipment",
                description: "Equip your team with quality laptops and desktops on flexible terms. Scale up or down as your needs change."
              }
            ].map((useCase, index) => (
              <AnimatedCard key={index} index={index}>
                <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center shadow-lg mb-6">
                    <useCase.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{useCase.title}</h3>
                  <p className="text-white/70 leading-relaxed">{useCase.description}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / By the Numbers */}
      <section className="py-20 bg-gradient-to-r from-primary via-orange-500 to-amber-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-30" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: "500+", label: "Gadgets Available", icon: Package },
              { value: "14-Day", label: "Free Returns", icon: RefreshCw },
              { value: "24hr", label: "Fast Delivery", icon: Truck },
              { value: "4.9★", label: "Customer Rating", icon: Star },
            ].map((stat, i) => (
              <AnimatedCard key={i} index={i}>
                <div className="text-center" data-testid={`stat-${i}`}>
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-white/80" />
                  <div className="text-4xl md:text-5xl font-heading font-bold mb-2">{stat.value}</div>
                  <div className="text-white/80 font-medium">{stat.label}</div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Brands */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Award className="h-4 w-4" />
              Trusted Brands
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Rent from <span className="text-primary">Industry Leaders</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We partner with the world's most trusted technology brands so you always get premium, reliable equipment.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 md:gap-8 items-center">
            {[
              { name: "Dell", category: "Laptops & Desktops" },
              { name: "HP", category: "Printers & Laptops" },
              { name: "Canon", category: "Cameras & Printers" },
              { name: "Sony", category: "Cameras & Audio" },
              { name: "Samsung", category: "Phones & Displays" },
              { name: "Lenovo", category: "Laptops & Desktops" },
              { name: "Asus", category: "Routers & Laptops" },
              { name: "Brother", category: "Printers" },
              { name: "Epson", category: "Printers" },
              { name: "Nikon", category: "Cameras" },
              { name: "Apple", category: "Laptops & Phones" },
              { name: "Google", category: "Phones & Routers" },
            ].map((brand, i) => (
              <AnimatedCard key={i} index={i}>
                <div className="group text-center p-4 rounded-2xl border border-slate-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300" data-testid={`brand-${brand.name.toLowerCase()}`}>
                  <div className="text-2xl font-bold text-slate-700 group-hover:text-primary transition-colors mb-1">{brand.name}</div>
                  <div className="text-xs text-muted-foreground">{brand.category}</div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Rental Categories */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Globe className="h-4 w-4" />
              Explore Our Catalog
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Rent Tech for <span className="text-primary">Every Industry</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              From business laptops and professional cameras to office printers and WiFi routers — find the perfect rental for your needs.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Laptop,
                title: "Laptop & Desktop Rentals",
                href: "/laptop-desktop-rentals",
                description: "Rent powerful laptops, desktop computers, and professional workstations from Dell, HP, Lenovo, and Apple. Perfect for remote workers, businesses scaling their teams, video editors needing raw processing power, and students on a budget.",
                features: ["MacBook Pro & Air", "Dell XPS Series", "HP EliteBook", "Gaming Laptops"],
                startPrice: "$49"
              },
              {
                icon: Smartphone,
                title: "Smartphone Rentals",
                href: "/smartphone-rentals",
                description: "Get the latest iPhones, Samsung Galaxy, and Google Pixel devices on flexible monthly terms. Ideal for app testing, temporary business phones, travel, and events without long carrier contracts.",
                features: ["iPhone 17 Pro Max", "Samsung Galaxy S25", "Google Pixel 9", "OnePlus 13"],
                startPrice: "$35"
              },
              {
                icon: Camera,
                title: "Camera & Gear Rentals",
                href: "/camera-gear-rentals",
                description: "Access professional cameras, mirrorless bodies, cinema lenses, and studio lighting gear from Canon, Sony, and Nikon. Trusted by photographers, filmmakers, and content creators worldwide.",
                features: ["Canon EOS R5", "Sony A9 III", "DJI Ronin 4D", "Studio Lighting"],
                startPrice: "$45"
              },
              {
                icon: Printer,
                title: "Printer & Scanner Rentals",
                href: "/office-printer-rentals",
                description: "Rent laser printers, color printers, wide-format printers, and high-speed scanners from HP, Brother, Canon, and Epson. Save thousands compared to buying office printing equipment outright.",
                features: ["Color Laser Printers", "All-in-One MFPs", "Wide Format", "Flatbed Scanners"],
                startPrice: "$29"
              },
              {
                icon: Headphones,
                title: "Headphones & Accessories",
                href: "/headphones-audio-rentals",
                description: "Rent premium noise-cancelling headphones, mechanical keyboards, and ergonomic mice from Sony, Bose, Logitech, and Razer. Upgrade your workspace without the commitment.",
                features: ["Sony WH-1000XM5", "AirPods Pro", "Mechanical Keyboards", "Ergonomic Mice"],
                startPrice: "$15"
              },
              {
                icon: Wifi,
                title: "Router & WiFi Rentals",
                href: "/router-rentals",
                description: "Rent high-performance WiFi 6E and WiFi 7 routers, mesh networking systems, and enterprise-grade access points from Asus, TP-Link, and Netgear. Set up reliable internet anywhere in minutes.",
                features: ["WiFi 7 Routers", "Mesh Systems", "4G/5G Hotspots", "Enterprise APs"],
                startPrice: "$19"
              },
            ].map((cat, i) => (
              <AnimatedCard key={i} index={i}>
                <Link href={cat.href}>
                  <div className="group bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 h-full cursor-pointer" data-testid={`category-detail-${i}`}>
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                      <cat.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{cat.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4 text-sm">{cat.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cat.features.map((f, fi) => (
                        <span key={fi} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{f}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-sm text-muted-foreground">Starting from <strong className="text-foreground">{cat.startPrice}/mo</strong></span>
                      <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Rent vs Buy Comparison */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <BarChart3 className="h-4 w-4" />
              Smart Comparison
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Why <span className="text-primary">Renting</span> Beats Buying
            </h2>
            <p className="text-lg text-muted-foreground">
              See how renting technology saves you money, reduces risk, and gives you more flexibility than traditional ownership.
            </p>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200">
                <div className="p-5 text-center font-bold text-foreground">Feature</div>
                <div className="p-5 text-center font-bold text-white bg-gradient-to-r from-primary to-amber-500 rounded-t-none">Renting</div>
                <div className="p-5 text-center font-bold text-foreground">Buying</div>
              </div>
              {[
                { feature: "Upfront Cost", rent: "Low monthly fee", buy: "Full purchase price" },
                { feature: "Latest Models", rent: "Always available", buy: "Stuck with what you buy" },
                { feature: "Maintenance", rent: "Included free", buy: "Your responsibility" },
                { feature: "Flexibility", rent: "Swap or return anytime", buy: "Sell at depreciated value" },
                { feature: "Tax Benefits", rent: "Often deductible as expense", buy: "Depreciation only" },
                { feature: "Damage Protection", rent: "GadgetCare+ available", buy: "Separate warranty needed" },
                { feature: "Storage", rent: "Return when done", buy: "Store unused equipment" },
                { feature: "Scaling", rent: "Add or reduce instantly", buy: "Buy more or sell off" },
              ].map((row, i) => (
                <div key={i} className={`grid grid-cols-3 border-b border-slate-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`} data-testid={`comparison-row-${i}`}>
                  <div className="p-4 font-medium text-foreground text-sm">{row.feature}</div>
                  <div className="p-4 text-center text-sm bg-primary/5">
                    <span className="inline-flex items-center gap-1.5 text-green-700 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {row.rent}
                    </span>
                  </div>
                  <div className="p-4 text-center text-sm text-muted-foreground">{row.buy}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Heart className="h-4 w-4" />
              Customer Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Loved by <span className="text-primary">Thousands</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              See why professionals, freelancers, and businesses trust RentMyGadgets for their technology needs.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Chen",
                role: "Freelance Photographer",
                text: "I rented a Canon EOS R5 and two L-series lenses for a destination wedding. The quality was flawless, delivery was next-day, and I saved over $4,000 compared to buying. RentMyGadgets is now my go-to for every shoot.",
                rating: 5,
                product: "Canon EOS R5"
              },
              {
                name: "Marcus Rivera",
                role: "IT Director, TechStart Inc.",
                text: "When we onboarded 15 new developers, buying laptops would have blown our budget. We rented Dell XPS 15s for the entire team on a 6-month term. The progressive discounts made it incredibly affordable.",
                rating: 5,
                product: "Dell XPS 15"
              },
              {
                name: "Priya Patel",
                role: "Content Creator",
                text: "I test new phones every month for my YouTube channel. RentMyGadgets lets me get the latest iPhone or Galaxy without spending thousands. The 14-day return policy gives me plenty of time for my reviews.",
                rating: 5,
                product: "iPhone 17 Pro"
              },
              {
                name: "David Park",
                role: "Event Manager",
                text: "We needed 20 WiFi routers for a 3-day conference. RentMyGadgets delivered them pre-configured and ready to go. The entire setup took 30 minutes. Couldn't be happier with the service.",
                rating: 5,
                product: "Asus RT-BE96U"
              },
              {
                name: "Lisa Thompson",
                role: "Architecture Student",
                text: "I couldn't afford a MacBook Pro for my 3D rendering coursework. Renting one for the semester saved me $2,000 and I got the M4 Pro model — way better specs than what I could have bought.",
                rating: 5,
                product: "MacBook Pro 16\""
              },
              {
                name: "James O'Brien",
                role: "Small Business Owner",
                text: "Our office printer died and we needed a replacement fast. RentMyGadgets had an HP Color LaserJet delivered same-day. The monthly rental is less than what we paid for toner alone with our old printer.",
                rating: 4,
                product: "HP Color LaserJet"
              },
            ].map((review, i) => (
              <AnimatedCard key={i} index={i}>
                <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col" data-testid={`testimonial-${i}`}>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star key={si} className={`h-4 w-4 ${si < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-primary/20 mb-3" />
                  <p className="text-muted-foreground leading-relaxed mb-6 flex-1 text-sm">{review.text}</p>
                  <div className="border-t border-slate-100 pt-4">
                    <div className="font-bold text-foreground">{review.name}</div>
                    <div className="text-sm text-muted-foreground">{review.role}</div>
                    <div className="text-xs text-primary mt-1">Rented: {review.product}</div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Who Rents From Us */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Building2 className="h-4 w-4" />
              Who We Serve
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Built for <span className="text-primary">Everyone</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              From solo freelancers to Fortune 500 companies — our rental platform scales to fit any need.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Briefcase, title: "Businesses", desc: "Equip teams with the latest tech on flexible terms. Scale up or down without capital expenditure." },
              { icon: GraduationCap, title: "Students", desc: "Get the powerful laptop or camera you need for coursework without the student-budget stress." },
              { icon: Camera, title: "Creatives", desc: "Access cinema-grade cameras, lighting rigs, and editing workstations for your next project." },
              { icon: CalendarDays, title: "Event Planners", desc: "Rent routers, laptops, and screens for conferences, trade shows, and corporate retreats." },
            ].map((persona, i) => (
              <AnimatedCard key={i} index={i}>
                <div className="text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors" data-testid={`persona-${i}`}>
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <persona.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{persona.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{persona.desc}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Wrench className="h-4 w-4" />
              Common Questions
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about renting technology from RentMyGadgets.
            </p>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "How does tech rental work at RentMyGadgets?",
                a: "It's simple: browse our catalog of 500+ gadgets, choose your rental period (1, 3, 6, or 12 months), and we deliver to your doorstep. Use the device for as long as you need, then return it when you're done. You can also extend your rental or swap for a different device at any time."
              },
              {
                q: "Is renting a laptop cheaper than buying one?",
                a: "For short to medium-term needs, absolutely. A high-end laptop that costs $2,000+ to buy can be rented for as little as $49/month. You also avoid depreciation, repair costs, and storage. For businesses, rentals are often fully tax-deductible as an operating expense."
              },
              {
                q: "What happens if I accidentally damage a rented device?",
                a: "We offer GadgetCare+ protection on every rental. For just 15% of your rental total, you're covered against accidental damage, drops, and spills. Without GadgetCare+, you'd be responsible for repair or replacement costs, so we highly recommend it."
              },
              {
                q: "Can I rent equipment for my business or team?",
                a: "Yes! Many of our customers are businesses that need laptops, printers, or other equipment for their teams. We offer volume discounts, dedicated account management, and flexible terms for corporate rentals. Contact us for custom business pricing."
              },
              {
                q: "How fast is delivery?",
                a: "We offer same-day delivery in select metropolitan areas and next-day delivery nationwide. All devices arrive tested, cleaned, and ready to use right out of the box. We include all necessary cables, chargers, and setup guides."
              },
              {
                q: "What brands do you carry?",
                a: "We carry all major technology brands including Apple (MacBook, iPhone, iPad), Dell (XPS, Latitude), HP (EliteBook, LaserJet), Canon (EOS, PIXMA), Sony (Alpha, WH-1000XM), Samsung (Galaxy), Lenovo (ThinkPad), Asus (ROG, RT), Nikon (Z-series), and many more."
              },
              {
                q: "Do you offer rent-to-own options?",
                a: "Yes! After 6 months of renting, you can choose to purchase the device at a significant discount. Your rental payments are applied toward the purchase price. Visit our Rent-to-Own page for full details on eligible products and pricing."
              },
              {
                q: "What is the minimum rental period?",
                a: "Our minimum rental period is 1 month. However, you get better rates with longer commitments — 3-month rentals save you 10%, 6-month rentals save 15%, and 12-month rentals save 20%. You can always extend your rental if you need more time."
              },
              {
                q: "Can I rent a camera for a wedding or event?",
                a: "Absolutely! Camera and lens rentals for events are one of our most popular categories. You can rent a professional mirrorless or interchangeable-lens camera body, multiple lenses, lighting equipment, and even stabilizers. Many wedding photographers rent backup bodies through us."
              },
              {
                q: "How do I return my rented device?",
                a: "Returns are free and easy. Schedule a pickup through your account dashboard, pack the device in the box it arrived in, and our courier will pick it up from your door. You can also drop it off at any of our partner locations. We include a prepaid return label with every rental."
              },
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-amber-500/5" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Ready to Get <span className="text-primary">Started?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of satisfied customers who rent their tech from RentMyGadgets.
              Browse 500+ gadgets — laptops, cameras, printers, phones, and more — all on flexible monthly terms.
              Start renting today and save thousands.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/categories">
                <Button 
                  size="lg" 
                  className="h-14 px-10 text-lg font-semibold rounded-2xl shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-primary to-amber-500"
                  data-testid="button-cta-browse-products"
                >
                  Browse All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-14 px-10 text-lg font-semibold rounded-2xl border-2 hover:bg-slate-100 transition-all"
                  data-testid="button-cta-how-it-works"
                >
                  How It Works
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
