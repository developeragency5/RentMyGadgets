import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import StructuredData from "@/components/StructuredData";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calendar, ShieldCheck, Truck, ShoppingCart, Loader2, Scale, Check, BadgePercent, Gift, ArrowRight, CheckCircle2, TrendingUp, Sparkles, Briefcase, GraduationCap, Home, Camera, Users, Laptop, Gamepad2, Music, Video, Building, AlertTriangle, Info, Wrench, Cpu, RotateCcw, type LucideIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct, fetchCategory, fetchProducts, fetchProductContent, type ProductContent, type TargetAudience, type ProductSpecifications, type SpecCategory } from "@/lib/api";
import { useCart, GADGET_CARE_RATE } from "@/lib/cart-context";
import { useCompare } from "@/lib/compare-context";
import { ProductImage, ProductGallery } from "@/components/product-image";
import VariantSelector from "@/components/VariantSelector";
import { calculateRentalPricing, type RentalDuration, type RentalPricing } from "@/lib/pricing";
import { motion } from "framer-motion";

export default function ProductDetail() {
  const [match, params] = useRoute("/product/:id");
  const productId = params?.id;
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToCompare, removeFromCompare, isInCompare, canAddMore } = useCompare();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId!),
    enabled: !!productId
  });

  const { data: category } = useQuery({
    queryKey: ['category', product?.categoryId],
    queryFn: () => fetchCategory(product!.categoryId),
    enabled: !!product?.categoryId
  });

  const { data: similarProducts } = useQuery({
    queryKey: ['similarProducts', product?.categoryId, productId],
    queryFn: async () => {
      if (!product?.categoryId || !productId) return [];
      const products = await fetchProducts({ categoryId: product.categoryId });
      return products.filter(p => p.id !== productId).slice(0, 6);
    },
    enabled: !!product?.categoryId && !!productId
  });

  const { data: productContent, isLoading: isLoadingContent } = useQuery({
    queryKey: ['productContent', productId],
    queryFn: () => fetchProductContent(productId!),
    enabled: !!productId,
    staleTime: 1000 * 60 * 60,
    retry: 1
  });

  const [rentalDuration, setRentalDuration] = useState<RentalDuration>("monthly");
  const [variantPriceAdjustment, setVariantPriceAdjustment] = useState<number>(0);
  const [variantConfiguration, setVariantConfiguration] = useState<Record<string, string>>({});
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [hasGadgetCare, setHasGadgetCare] = useState<boolean>(false);

  useEffect(() => {
    setVariantPriceAdjustment(0);
    setVariantConfiguration({});
    setSelectedColor(null);
    setHasGadgetCare(false);
  }, [productId]);

  useEffect(() => {
    if (product?.availableColors && product.availableColors.length > 0 && !selectedColor) {
      setSelectedColor(product.availableColors[0]);
    }
  }, [product?.availableColors, selectedColor]);

  if (isLoading) {
    return (
      <Layout>
        <SeoHead title="Loading Product..." description="Loading product details. Please wait." />
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading product...</p>
        </div>
      </Layout>
    );
  }

  if (!product || error) {
    return (
      <Layout>
        <SeoHead title="Product Not Found" description="The requested product could not be found." />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <Link href="/categories">
            <Button>Back to Browsing</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const baseMonthlyPrice = parseFloat(product.pricePerMonth) + variantPriceAdjustment;
  const rentalPricing = calculateRentalPricing(baseMonthlyPrice);
  const selectedPricing = rentalPricing.find(p => p.duration === rentalDuration) || rentalPricing[0];

  const gadgetCarePrice = selectedPricing.totalPrice * GADGET_CARE_RATE;
  const gadgetCareMonthlyPrice = selectedPricing.monthlyRate * GADGET_CARE_RATE;

  const handleAddToCart = () => {
    addToCart(product, 'month', 1, variantConfiguration, variantPriceAdjustment, selectedColor || undefined, rentalDuration, hasGadgetCare);
    toast({
      title: "Added to Cart",
      description: `${product.name}${selectedColor ? ` (${selectedColor})` : ''}${hasGadgetCare ? ' with GadgetCare+' : ''} added for ${selectedPricing.label}.`,
    });
  };

  const handleCompareToggle = () => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      toast({
        title: "Removed from Compare",
        description: `${product.name} removed from comparison.`,
      });
    } else {
      if (!canAddMore) {
        toast({
          title: "Compare Limit Reached",
          description: "You can compare up to 4 products at a time.",
          variant: "destructive"
        });
        return;
      }
      addToCompare(product);
      toast({
        title: "Added to Compare",
        description: `${product.name} added for comparison.`,
      });
    }
  };

  return (
    <Layout>
      <SeoHead 
        title={`Rent ${product.name}`}
        description={`Rent ${product.name} starting at $${product.pricePerMonth}/mo. ${product.description?.slice(0, 120)}...`}
        image={product.imageUrl || undefined}
        keywords={`rent ${product.name}, ${product.name} rental, hire ${product.name}, ${category?.name || 'tech'} rental, affordable equipment rental`}
      />
      <StructuredData type="product" product={product} categoryName={category?.name} />
      <StructuredData type="breadcrumb" items={[
        { name: "Home", url: "https://rentmygadgets.com" },
        { name: "Categories", url: "https://rentmygadgets.com/categories" },
        ...(category ? [{ name: category.name, url: `https://rentmygadgets.com/categories/${category.id}` }] : []),
        { name: product.name },
      ]} />
      <div className="bg-secondary/30 py-4 border-b">
        <div className="container mx-auto px-4">
           <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/">Home</Link> <ChevronRight className="h-4 w-4" />
            <Link href="/categories">Categories</Link> <ChevronRight className="h-4 w-4" />
            {category && (
              <>
                <Link href={`/categories/${category.id}`}>
                  <span className="capitalize">{category.name}</span>
                </Link> 
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <ProductGallery 
              images={product.galleryImageUrls} 
              mainImage={product.imageUrl}
              productName={product.name}
              compact={category?.name === "Phones"}
            />
            
            {/* Full Specifications - Desktop: under gallery, Mobile: will flow naturally */}
            {productContent?.specifications && (
              <div className="hidden lg:block bg-slate-50 dark:bg-slate-950/30 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-xl">
                    <Cpu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <h2 className="text-xl font-heading font-bold" data-testid="specifications-title">Full Specifications</h2>
                </div>

                {/* Key Specs Summary */}
                {(productContent.specifications as ProductSpecifications).keySpecs && (productContent.specifications as ProductSpecifications).keySpecs.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                    {(productContent.specifications as ProductSpecifications).keySpecs.map((spec, index) => (
                      <div key={index} className="text-center" data-testid={`key-spec-${index}`}>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{spec.label}</p>
                        <p className="font-semibold text-sm">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Detailed Specs with Tabs */}
                {(productContent.specifications as ProductSpecifications).categories && (productContent.specifications as ProductSpecifications).categories.length > 0 && (
                  <Tabs defaultValue={(productContent.specifications as ProductSpecifications).categories[0]?.category} className="w-full">
                    <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                      {(productContent.specifications as ProductSpecifications).categories.map((cat, index) => (
                        <TabsTrigger 
                          key={index} 
                          value={cat.category}
                          className="text-xs px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                          data-testid={`spec-tab-${cat.category.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {cat.category}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {(productContent.specifications as ProductSpecifications).categories.map((cat, catIndex) => (
                      <TabsContent key={catIndex} value={cat.category} className="mt-4">
                        <div className="bg-background rounded-lg border overflow-hidden overflow-x-auto">
                          <table className="w-full">
                            <tbody>
                              {cat.specs.map((spec, specIndex) => (
                                <tr 
                                  key={specIndex} 
                                  className={specIndex % 2 === 0 ? 'bg-muted/30' : 'bg-background'}
                                  data-testid={`spec-row-${cat.category.toLowerCase().replace(/\s+/g, '-')}-${specIndex}`}
                                >
                                  <td className="px-4 py-3 text-sm font-medium text-muted-foreground w-1/3 border-r">
                                    {spec.label}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    {spec.value}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                )}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-heading font-bold mb-4" data-testid="text-product-name">{product.name}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-product-description">
                {product.description || "Experience high-performance computing with this premium device. Perfect for creative work, software development, and business presentations."}
              </p>
              {!productContent && !isLoadingContent && (
                <div className="mt-4 text-muted-foreground leading-relaxed space-y-3" data-testid="text-product-fallback-description">
                  <p>
                    The {product.name} is available for flexible monthly rental from RentMyGadgets. 
                    {product.brand ? ` Made by ${product.brand}, this` : ' This'} {category?.name?.toLowerCase() || 'equipment'} is ideal for professionals, 
                    students, and businesses who need reliable technology without the commitment of purchasing. 
                    Renting gives you access to premium equipment at a fraction of the retail cost, with the flexibility 
                    to upgrade or return at any time.
                  </p>
                  <p>
                    Choose from rental terms of 1, 3, 6, or 12 months with progressive discounts for longer commitments. 
                    Every rental includes free return shipping with a prepaid label, a 14-day satisfaction guarantee, 
                    and the option to add GadgetCare+ protection for coverage against accidental damage and hardware malfunctions. 
                    Whether you need equipment for a short-term project, want to try before you buy, or prefer the financial 
                    flexibility of renting, RentMyGadgets makes it easy to get the technology you need delivered to your door.
                  </p>
                </div>
              )}
            </div>

            {product.availableColors && product.availableColors.length > 0 && (
              <div className="space-y-3" data-testid="section-available-colors">
                <h3 className="text-sm font-medium text-muted-foreground">Available Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {product.availableColors.map((color, index) => {
                    const colorMap: Record<string, string> = {
                      'Black': '#1a1a1a',
                      'White': '#ffffff',
                      'Silver': '#c0c0c0',
                      'Space Gray': '#4a4a4a',
                      'Space Black': '#2d2d2d',
                      'Midnight': '#1c1c3c',
                      'Starlight': '#f5f0e8',
                      'Blue': '#0071e3',
                      'Green': '#4cd964',
                      'Pink': '#ff6b9d',
                      'Yellow': '#ffcc00',
                      'Orange': '#ff9500',
                      'Purple': '#af52de',
                      'Sky Blue': '#87ceeb',
                      'Midnight Blue': '#191970',
                      'Lunar Blue': '#4169e1',
                      'Platinum': '#e5e4e2',
                      'Platinum Silver': '#e5e4e2',
                      'Graphite': '#41424c',
                      'Sapphire': '#0f52ba',
                      'Dune': '#c9b896',
                      'Nightfall Black': '#0d0d0d',
                      'Nocturne Blue': '#1a1a4a',
                      'Eclipse Gray': '#3a3a3a',
                      'White Smoke': '#f5f5f5',
                      'Sandstone': '#786d5f',
                      'Deep Brown': '#4a3728',
                      'Navy': '#000080',
                      'Copper': '#b87333',
                      'Snow': '#fffafa',
                      'Fog': '#d3d3e3',
                      'Linen': '#faf0e6',
                      'Lemongrass': '#9b9b57',
                      'Classic White': '#f8f8ff',
                      'Gray': '#808080',
                      'Teal': '#008080',
                      'Ultramarine': '#3f00ff',
                      'Black Titanium': '#1c1c1e',
                      'White Titanium': '#f5f5f0',
                      'Natural Titanium': '#8a8a8a',
                      'Desert Titanium': '#c4a77d',
                      'Titanium Black': '#1c1c1e',
                      'Titanium Gray': '#6e6e73',
                      'Titanium Silverblue': '#a8b5c4',
                      'Titanium Pinkgold': '#e8c4b8',
                      'Titanium Violet': '#8b5cf6',
                      'Titanium Yellow': '#facc15',
                      'Silver Shadow': '#b8b8b8',
                      'Mint': '#98ff98',
                      'Peach': '#ffcba4',
                      'Crafted Black': '#0a0a0a',
                      'Khaki Green': '#8a9a5b',
                      'Obsidian': '#1a1a1a',
                      'Porcelain': '#f0ede5',
                      'Hazel': '#8e7618',
                      'Rose Quartz': '#f7cac9',
                      'Midnight Ocean': '#003366',
                      'Black Eclipse': '#0d0d0d',
                      'Arctic Dawn': '#e8f4f8',
                      'Cosmic Orange': '#ff6b35',
                      'Deep Blue': '#0a3d62',
                      'Titanium Blue': '#4a90a4',
                      'Titanium Green': '#4a6f5a',
                      'Titanium Orange': '#cc6b3a',
                    };
                    const bgColor = colorMap[color] || '#e5e5e5';
                    const isLight = ['White', 'Starlight', 'Platinum', 'Platinum Silver', 'White Smoke', 'Snow', 'Linen', 'Classic White', 'Yellow', 'Lemongrass', 'White Titanium', 'Porcelain', 'Rose Quartz', 'Arctic Dawn', 'Mint', 'Peach', 'Titanium Pinkgold'].includes(color);
                    
                    const isSelected = selectedColor === color;
                    
                    return (
                      <button 
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${
                          isSelected 
                            ? "bg-primary/10 border-primary ring-2 ring-primary/20" 
                            : "bg-background hover:bg-secondary/50 border-border"
                        }`}
                        data-testid={`color-option-${color.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div 
                          className={`w-5 h-5 rounded-full border-2 ${
                            isSelected 
                              ? "border-primary ring-1 ring-primary/50" 
                              : isLight ? 'border-gray-300' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: bgColor }}
                        />
                        <span className={`text-sm font-medium ${isSelected ? 'text-primary' : ''}`}>{color}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Variant Configuration - for laptops, desktops, and products with configuration options */}
            <VariantSelector
              productId={product.id}
              onPriceAdjustmentChange={setVariantPriceAdjustment}
              onConfigurationChange={setVariantConfiguration}
            />

            <div className="border-t border-b py-6 space-y-4">
              <h3 className="font-bold">Technical Specifications</h3>
              <ul className="grid grid-cols-2 gap-2">
                {product.specs?.map((spec) => (
                  <li key={spec} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {spec}
                  </li>
                ))}
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                   Inspected Before Shipping
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setHasGadgetCare(!hasGadgetCare)}
                className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                  hasGadgetCare 
                    ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-blue-500 ring-2 ring-blue-500/20" 
                    : "bg-secondary/20 border-border/50 hover:border-blue-300 hover:bg-blue-50/30 dark:hover:bg-blue-950/20"
                }`}
                data-testid="button-gadget-care-toggle"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl shrink-0 ${hasGadgetCare ? 'bg-blue-500' : 'bg-blue-100 dark:bg-blue-900/50'}`}>
                    <ShieldCheck className={`h-6 w-6 ${hasGadgetCare ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg">GadgetCare+</h4>
                        <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                          Recommended
                        </span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        hasGadgetCare 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {hasGadgetCare && <Check className="h-4 w-4 text-white" />}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Comprehensive protection for peace of mind during your rental
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                        <span>Accidental Damage</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                        <span>Liquid Spills</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                        <span>Hardware Malfunctions</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                        <span>Priority Repairs</span>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1 mt-3 pt-3 border-t border-border/50">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        +${gadgetCareMonthlyPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">/mo</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        (${gadgetCarePrice.toFixed(2)} total for {selectedPricing.months} {selectedPricing.months === 1 ? 'month' : 'months'})
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <div className="bg-secondary/20 p-6 rounded-2xl border border-border/50 space-y-6">
               <div>
                 <label className="text-sm font-medium mb-3 block">Choose Your Rental Term</label>
                 <div className="grid grid-cols-2 gap-3">
                   {rentalPricing.map((pricing) => {
                     const isSelected = rentalDuration === pricing.duration;
                     return (
                       <button 
                         key={pricing.duration}
                         onClick={() => setRentalDuration(pricing.duration)}
                         className={`relative px-4 py-4 rounded-xl text-left border transition-all ${
                           isSelected 
                             ? "bg-primary/5 border-primary ring-2 ring-primary/20" 
                             : "bg-background hover:bg-secondary/50 border-border"
                         }`}
                         data-testid={`button-duration-${pricing.duration}`}
                       >
                         {pricing.savingsPercent > 0 && (
                           <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                             Save {pricing.savingsPercent}%
                           </span>
                         )}
                         <div className={`font-semibold ${isSelected ? 'text-primary' : ''}`}>
                           {pricing.label}
                         </div>
                         <div className="flex items-baseline gap-1 mt-1">
                           <span className={`text-xl font-bold ${isSelected ? 'text-primary' : ''}`}>
                             ${pricing.monthlyRate.toFixed(2)}
                           </span>
                           <span className="text-xs text-muted-foreground">/mo</span>
                         </div>
                         {pricing.savingsPercent > 0 && (
                           <div className="text-xs text-green-600 mt-1">
                             ${pricing.totalPrice.toFixed(2)} total
                           </div>
                         )}
                         {pricing.months === 1 && (
                           <div className="text-xs text-muted-foreground mt-1">
                             ${pricing.totalPrice.toFixed(2)} total
                           </div>
                         )}
                       </button>
                     );
                   })}
                 </div>
               </div>

               <div className="flex items-center justify-between pt-4 border-t border-border/50">
                 <div>
                   <div className="text-sm text-muted-foreground">{selectedPricing.label} Total</div>
                   <div className="text-3xl font-bold" data-testid="text-product-price">${selectedPricing.totalPrice.toFixed(2)}</div>
                   <div className="text-sm text-muted-foreground">${selectedPricing.monthlyRate.toFixed(2)}/mo × {selectedPricing.months} {selectedPricing.months === 1 ? 'month' : 'months'}</div>
                 </div>
                 <div className="flex gap-2">
                   <Button 
                     size="lg" 
                     variant="outline"
                     className="h-14 px-4 rounded-full"
                     onClick={handleCompareToggle}
                     data-testid="button-compare"
                   >
                     {isInCompare(product.id) ? (
                       <><Check className="h-5 w-5 text-primary" /></>
                     ) : (
                       <><Scale className="h-5 w-5" /></>
                     )}
                   </Button>
                   <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
                     <Button size="lg" className="h-14 px-8 rounded-full text-base" onClick={handleAddToCart} data-testid="button-add-to-cart">
                       <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                     </Button>
                   </motion.div>
                 </div>
               </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/20 border border-border/50">
                <Truck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-foreground">Free Shipping</span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Free shipping on orders over $99 within the continental United States. For international shipping, <Link href="/contact" className="text-primary hover:underline">contact us</Link>.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">GadgetCare+ Protection Available</span>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50">
                <RotateCcw className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-green-700 dark:text-green-400">Free Returns Within 14 Days</span>
                  <p className="text-xs text-green-600/80 dark:text-green-500/80 mt-0.5">
                    Not satisfied? Return within 14 days of delivery for a full refund. <Link href="/return-policy" className="underline hover:text-green-700">Learn more</Link>
                  </p>
                </div>
              </div>
            </div>

            {product.retailPrice && (() => {
              const retailPrice = parseFloat(product.retailPrice);
              const monthlyRental = parseFloat(product.pricePerMonth) + variantPriceAdjustment;
              const rentalFor6Months = monthlyRental * 6;
              const buyoutPrice = retailPrice * 0.70;
              const totalCostToOwn = rentalFor6Months + buyoutPrice;
              const savingsVsBuying = retailPrice - totalCostToOwn;
              const savingsPercent = Math.round((savingsVsBuying / retailPrice) * 100);
              
              return (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/50 p-6 rounded-2xl space-y-5" data-testid="buyout-option-card">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-3 rounded-xl shrink-0">
                      <Gift className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-foreground flex items-center gap-2">
                        Rent-to-Own Option
                        <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">Save {savingsPercent > 0 ? savingsPercent : 30}%</span>
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Love it? Keep it! After 6 months of rental, buy this product at a discounted price.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 space-y-3">
                    <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-amber-600" />
                      Your Savings Breakdown
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center py-1.5 border-b border-amber-200/30 dark:border-amber-800/20">
                        <span className="text-muted-foreground">6 months rental</span>
                        <span className="font-medium">${monthlyRental.toFixed(0)} × 6 = <span className="text-foreground">${rentalFor6Months.toFixed(0)}</span></span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-amber-200/30 dark:border-amber-800/20">
                        <span className="text-muted-foreground">Buyout price (30% off)</span>
                        <span className="font-medium text-foreground">${buyoutPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-amber-200/30 dark:border-amber-800/20">
                        <span className="text-muted-foreground font-medium">Total cost to own</span>
                        <span className="font-bold text-foreground">${totalCostToOwn.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 bg-green-100/50 dark:bg-green-900/20 rounded-lg px-3 -mx-1">
                        <span className="text-green-700 dark:text-green-400 font-medium flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4" />
                          vs. Retail (${retailPrice.toLocaleString()})
                        </span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {savingsVsBuying > 0 ? `You save $${savingsVsBuying.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : 'Great option!'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-600" />
                      <span>Simple approval</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-600" />
                      <span>Flexible payments</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-600" />
                      <span>Own it outright</span>
                    </div>
                  </div>

                  <Link href={`/rent-to-own?product=${productId}`} className="block">
                    <div className="flex items-center justify-between p-3 bg-amber-100/50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-xl transition-colors cursor-pointer group">
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Learn more about Rent-to-Own</span>
                      <ArrowRight className="h-4 w-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* AI-Generated Product Content Sections */}
      {productContent && (
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* How It Works */}
          {productContent.howItWorks && (
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-heading font-bold" data-testid="how-it-works-title">How This {category?.name || 'Product'} Works</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed" data-testid="how-it-works-content">{productContent.howItWorks}</p>
            </div>
          )}

          {/* Key Benefits & Considerations */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Key Benefits */}
            {productContent.keyBenefits && productContent.keyBenefits.length > 0 && (
              <div className="bg-green-50 dark:bg-green-950/30 rounded-2xl p-6 border border-green-100 dark:border-green-900/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-xl">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-xl font-heading font-bold" data-testid="key-benefits-title">Key Benefits</h2>
                </div>
                <ul className="space-y-3">
                  {productContent.keyBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3" data-testid={`benefit-${index}`}>
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Considerations */}
            {productContent.considerations && productContent.considerations.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-6 border border-amber-100 dark:border-amber-900/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-xl">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h2 className="text-xl font-heading font-bold" data-testid="considerations-title">Considerations</h2>
                </div>
                <ul className="space-y-3">
                  {productContent.considerations.map((consideration, index) => (
                    <li key={index} className="flex items-start gap-3" data-testid={`consideration-${index}`}>
                      <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{consideration}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Who Should Rent This */}
          {productContent.targetAudience && productContent.targetAudience.length > 0 && (
            <div className="bg-purple-50 dark:bg-purple-950/30 rounded-2xl p-6 border border-purple-100 dark:border-purple-900/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-heading font-bold" data-testid="target-audience-title">Who Should Rent This</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(productContent.targetAudience as TargetAudience[]).map((audience, index) => {
                  const iconMap: Record<string, LucideIcon> = {
                    'briefcase': Briefcase,
                    'graduation-cap': GraduationCap,
                    'home': Home,
                    'camera': Camera,
                    'users': Users,
                    'laptop': Laptop,
                    'gamepad': Gamepad2,
                    'music': Music,
                    'video': Video,
                    'building': Building,
                  };
                  const IconComponent = iconMap[audience.icon] || Users;
                  return (
                    <div key={index} className="bg-background rounded-xl p-4 text-center border" data-testid={`audience-${index}`}>
                      <div className="inline-flex p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl mb-3">
                        <IconComponent className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="font-semibold mb-1">{audience.title}</h3>
                      <p className="text-xs text-muted-foreground">{audience.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Safety & Maintenance Tips */}
          {((productContent.safetyGuidelines && productContent.safetyGuidelines.length > 0) || 
            (productContent.maintenanceTips && productContent.maintenanceTips.length > 0)) && (
            <div className="bg-red-50 dark:bg-red-950/30 rounded-2xl p-6 border border-red-100 dark:border-red-900/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                  <ShieldCheck className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-heading font-bold" data-testid="safety-maintenance-title">Safety & Maintenance Tips</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Safety Guidelines */}
                {productContent.safetyGuidelines && productContent.safetyGuidelines.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-red-500" />
                      Safety Guidelines
                    </h3>
                    <ul className="space-y-2">
                      {productContent.safetyGuidelines.map((guideline, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground" data-testid={`safety-${index}`}>
                          <Check className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span>{guideline}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Maintenance Tips */}
                {productContent.maintenanceTips && productContent.maintenanceTips.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-red-500" />
                      Maintenance Best Practices
                    </h3>
                    <ul className="space-y-2">
                      {productContent.maintenanceTips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground" data-testid={`maintenance-${index}`}>
                          <Check className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Full Specifications - Mobile only (desktop shows in left column) */}
          {productContent.specifications && (
            <div className="lg:hidden bg-slate-50 dark:bg-slate-950/30 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-xl">
                  <Cpu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
                <h2 className="text-xl font-heading font-bold" data-testid="specifications-title-mobile">Full Specifications</h2>
              </div>

              {/* Key Specs Summary */}
              {(productContent.specifications as ProductSpecifications).keySpecs && (productContent.specifications as ProductSpecifications).keySpecs.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                  {(productContent.specifications as ProductSpecifications).keySpecs.map((spec, index) => (
                    <div key={index} className="text-center" data-testid={`key-spec-mobile-${index}`}>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{spec.label}</p>
                      <p className="font-semibold text-sm">{spec.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Detailed Specs with Tabs */}
              {(productContent.specifications as ProductSpecifications).categories && (productContent.specifications as ProductSpecifications).categories.length > 0 && (
                <Tabs defaultValue={(productContent.specifications as ProductSpecifications).categories[0]?.category} className="w-full">
                  <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                    {(productContent.specifications as ProductSpecifications).categories.map((cat, index) => (
                      <TabsTrigger 
                        key={index} 
                        value={cat.category}
                        className="text-xs px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        data-testid={`spec-tab-mobile-${cat.category.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {cat.category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {(productContent.specifications as ProductSpecifications).categories.map((cat, catIndex) => (
                    <TabsContent key={catIndex} value={cat.category} className="mt-4">
                      <div className="bg-background rounded-lg border overflow-hidden overflow-x-auto">
                        <table className="w-full">
                          <tbody>
                            {cat.specs.map((spec, specIndex) => (
                              <tr 
                                key={specIndex} 
                                className={specIndex % 2 === 0 ? 'bg-muted/30' : 'bg-background'}
                                data-testid={`spec-row-mobile-${cat.category.toLowerCase().replace(/\s+/g, '-')}-${specIndex}`}
                              >
                                <td className="px-4 py-3 text-sm font-medium text-muted-foreground w-1/3 border-r">
                                  {spec.label}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  {spec.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </div>
          )}
        </div>
      )}

      {/* Loading state for content */}
      {isLoadingContent && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading product information...</span>
          </div>
        </div>
      )}

      {/* Similar Products Section */}
      {similarProducts && similarProducts.length > 0 && (
        <div className="bg-secondary/30 py-12 border-t">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold mb-6">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {similarProducts.map((similarProduct) => (
                <Link key={similarProduct.id} href={`/product/${similarProduct.id}`}>
                  <div className="bg-background rounded-xl border p-3 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group" data-testid={`similar-product-${similarProduct.id}`}>
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-3">
                      <ProductImage 
                        src={similarProduct.imageUrl} 
                        alt={similarProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">{similarProduct.name}</h3>
                    <p className="text-xs text-muted-foreground mb-1">{similarProduct.brand}</p>
                    <p className="text-sm font-bold text-primary">${similarProduct.pricePerMonth}/mo</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
