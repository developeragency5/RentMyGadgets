import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import StructuredData from "@/components/StructuredData";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal, ChevronRight, Loader2, ArrowUpDown, X, Scale, Check, Plus, Minus, ChevronDown, Filter, RotateCcw, Package, Star, DollarSign, Tag } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchCategory, fetchProducts } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { useCompare } from "@/lib/compare-context";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";
import { ProductImage } from "@/components/product-image";
import CategoryContent from "@/components/CategoryContent";

import laptopLifestyle from "@assets/stock_images/professional_busines_559a8906.jpg";
import cameraLifestyle from "@assets/stock_images/photographer_using_p_69976d3e.jpg";
import headphonesLifestyle from "@assets/stock_images/person_wearing_headp_9cf4c210.jpg";
import desktopLifestyle from "@assets/stock_images/creative_professiona_597aad3a.jpg";
import routerLifestyle from "@assets/stock_images/modern_home_office_s_69863381.jpg";

const categoryLifestyleImages: Record<string, string> = {
  "Desktops & Laptops": laptopLifestyle,
  "Cameras & Gear": cameraLifestyle,
  "Headphones": headphonesLifestyle,
  "Printers & Scanners": desktopLifestyle,
  "Routers": routerLifestyle,
};

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const COLLECTION_CATEGORY_MAP: Record<string, string> = {
  "office-printers": "18079e56-3836-4542-b12a-733b4ce84bdd",
  "laser-printers": "18079e56-3836-4542-b12a-733b4ce84bdd",
  "color-laser-printers": "18079e56-3836-4542-b12a-733b4ce84bdd",
  "small-office-printers": "18079e56-3836-4542-b12a-733b4ce84bdd",
  "laptops": "2c7a748e-6128-488e-af34-1ff07d5efca8",
  "desktops": "2c7a748e-6128-488e-af34-1ff07d5efca8",
  "workstations": "2c7a748e-6128-488e-af34-1ff07d5efca8",
  "smartphones": "c9f3d7d1-34c8-4f9f-9dec-57a808b28e35",
  "mobile-phones": "c9f3d7d1-34c8-4f9f-9dec-57a808b28e35",
  "cell-phones": "c9f3d7d1-34c8-4f9f-9dec-57a808b28e35",
  "headphones": "5bf83f8b-6cca-4c80-ae3f-e926ef53f14e",
  "keyboards": "5bf83f8b-6cca-4c80-ae3f-e926ef53f14e",
  "computer-mice": "5bf83f8b-6cca-4c80-ae3f-e926ef53f14e",
  "dslr-cameras": "09bcf6ce-10bb-4e95-95ee-477e78f6edb1",
  "camera-lenses": "09bcf6ce-10bb-4e95-95ee-477e78f6edb1",
  "lighting-gear": "09bcf6ce-10bb-4e95-95ee-477e78f6edb1",
  "routers": "f74a6ed6-d23e-4800-8a2e-df600a5f38b4",
  "wifi-routers": "f74a6ed6-d23e-4800-8a2e-df600a5f38b4",
  "wireless-routers": "f74a6ed6-d23e-4800-8a2e-df600a5f38b4",
};

const COLLECTION_SEO: Record<string, { title: string; description: string; keywords: string }> = {
  "office-printers": {
    title: "Office Printers for Every Desk",
    description: "Office printers that print, scan, copy, and handle all your paperwork in one handy device.",
    keywords: "office printer, office printers, rent office printer, all-in-one office printer, office printer rental",
  },
  "laser-printers": {
    title: "Laser Printers for Your Office",
    description: "Laser printers deliver sharp text, fast speeds, and low cost per page for any busy office.",
    keywords: "laser printer, laser printers, rent laser printer, laser printer rental, office laser printer",
  },
  "color-laser-printers": {
    title: "Color Laser Printers Made Easy",
    description: "Color laser printers produce vibrant prints, detailed output, and accurate color printing.",
    keywords: "color laser printer, color laser printers, rent color laser printer, color laser printer rental",
  },
  "small-office-printers": {
    title: "Small Office Printers in Stock",
    description: "Small office printers fit tight spaces and deliver reliable printing for your daily tasks.",
    keywords: "small office printer, small office printers, rent small office printer, compact office printer rental",
  },
  "laptops": {
    title: "Laptops for Rent",
    description: "Rent high-performance laptops for work, gaming, and creative projects. Flexible monthly plans.",
    keywords: "laptop rental, rent laptop, business laptop, gaming laptop rental, laptop for rent",
  },
  "desktops": {
    title: "Desktops & PCs for Rent",
    description: "Rent powerful desktop computers and workstations for business and creative work.",
    keywords: "desktop rental, rent desktop, PC rental, workstation rental, desktop computer for rent",
  },
  "workstations": {
    title: "Workstations for Rent",
    description: "Rent professional workstations built for demanding tasks like CAD, 3D rendering, and data science.",
    keywords: "workstation rental, rent workstation, professional workstation, high performance computer rental",
  },
  "smartphones": {
    title: "Smartphones for Rent",
    description: "Rent the latest smartphones with sharp displays and powerful cameras. Flexible monthly plans.",
    keywords: "smartphone rental, rent smartphone, phone rental, mobile phone for rent",
  },
  "mobile-phones": {
    title: "Mobile Phones for Rent",
    description: "Rent mobile phones for work, travel, or daily use. Latest models, flexible rental terms.",
    keywords: "mobile phone rental, rent mobile phone, cell phone rental, phone for rent",
  },
  "cell-phones": {
    title: "Cell Phones for Rent",
    description: "Rent cell phones with the latest features. No contracts, flexible monthly plans.",
    keywords: "cell phone rental, rent cell phone, phone rental, smartphone for rent",
  },
  "headphones": {
    title: "Headphones for Rent",
    description: "Rent premium headphones from Bose, Sony, and Sennheiser. Noise-cancelling and studio-grade options.",
    keywords: "headphone rental, rent headphones, noise cancelling headphone rental, studio headphones for rent",
  },
  "keyboards": {
    title: "Keyboards for Rent",
    description: "Rent mechanical and ergonomic keyboards for work and gaming. Top brands available.",
    keywords: "keyboard rental, rent keyboard, mechanical keyboard rental, ergonomic keyboard for rent",
  },
  "computer-mice": {
    title: "Computer Mice for Rent",
    description: "Rent ergonomic and gaming mice for work and play. Wireless and wired options.",
    keywords: "mouse rental, rent mouse, ergonomic mouse rental, gaming mouse for rent",
  },
  "dslr-cameras": {
    title: "Professional Cameras for Rent",
    description: "Rent professional cameras for photo shoots, weddings, and events. Top brands available.",
    keywords: "camera rental, professional camera rental, rent camera, camera for rent, photography equipment rental",
  },
  "camera-lenses": {
    title: "Camera Lenses for Rent",
    description: "Rent sharp camera lenses for portraits, landscapes, and studio work. Wide selection.",
    keywords: "lens rental, rent camera lens, photography lens rental, camera lens for rent",
  },
  "lighting-gear": {
    title: "Lighting Gear for Rent",
    description: "Rent professional studio lighting, LED panels, and portable light kits for photo and video.",
    keywords: "lighting rental, rent studio lights, LED panel rental, photography lighting for rent",
  },
  "routers": {
    title: "Routers for Rent",
    description: "Rent fast, reliable routers for home and office networking. Easy setup, flexible terms.",
    keywords: "router rental, rent router, WiFi router rental, networking equipment for rent",
  },
  "wifi-routers": {
    title: "WiFi Routers for Rent",
    description: "Rent WiFi routers with fast speeds and wide coverage. Mesh and single-unit options.",
    keywords: "WiFi router rental, rent WiFi router, wireless router rental, mesh WiFi for rent",
  },
  "wireless-routers": {
    title: "Wireless Routers for Rent",
    description: "Rent wireless routers for reliable internet at home or the office. Latest standards.",
    keywords: "wireless router rental, rent wireless router, WiFi 6 router rental, router for rent",
  },
};

export default function ProductList() {
  const [matchCategory, categoryParams] = useRoute("/categories/:id");
  const [matchProducts] = useRoute("/products");
  const [matchCollection, collectionParams] = useRoute("/collections/:slug");
  const collectionSlug = collectionParams?.slug || "";
  const collectionCategoryId = COLLECTION_CATEGORY_MAP[collectionSlug];
  const categoryId = categoryParams?.id || collectionCategoryId;
  const isAllProductsView = matchProducts && !matchCollection;
  const { addToCart } = useCart();
  const { addToCompare, removeFromCompare, isInCompare, canAddMore } = useCompare();
  const { toast } = useToast();
  
  const [priceRange, setPriceRange] = useState([0, 250]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => fetchCategory(categoryId!),
    enabled: !!categoryId && !isAllProductsView
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', 'category', categoryId || 'all'],
    queryFn: () => isAllProductsView ? fetchProducts({}) : fetchProducts({ categoryId: categoryId! }),
    enabled: isAllProductsView || !!categoryId
  });

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 250;
    return Math.ceil(Math.max(...products.map(p => parseFloat(p.pricePerMonth))) / 10) * 10 + 10;
  }, [products]);

  // Sync price range max to actual maxPrice when products load
  useEffect(() => {
    if (products.length > 0 && priceRange[1] === 250) {
      setPriceRange([0, maxPrice]);
    }
  }, [maxPrice, products.length]);

  const availableBrands = useMemo(() => {
    const brands = products
      .map(p => p.brand)
      .filter((brand): brand is string => !!brand);
    const uniqueBrands = Array.from(new Set(brands)).sort();
    return uniqueBrands.map(brand => ({
      name: brand,
      count: products.filter(p => p.brand === brand).length
    }));
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => p.brand && selectedBrands.includes(p.brand));
    }

    // Price filter
    result = result.filter(p => {
      const price = parseFloat(p.pricePerMonth);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Availability filter
    if (showAvailableOnly) {
      result = result.filter(p => p.available);
    }

    // Featured filter
    if (showFeaturedOnly) {
      result = result.filter(p => p.featured);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => parseFloat(a.pricePerMonth) - parseFloat(b.pricePerMonth));
        break;
      case 'price-desc':
        result.sort((a, b) => parseFloat(b.pricePerMonth) - parseFloat(a.pricePerMonth));
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [products, priceRange, showAvailableOnly, showFeaturedOnly, selectedBrands, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) count++;
    if (showAvailableOnly) count++;
    if (showFeaturedOnly) count++;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    return count;
  }, [priceRange, maxPrice, showAvailableOnly, showFeaturedOnly, selectedBrands]);

  const clearFilters = () => {
    setPriceRange([0, maxPrice]);
    setShowAvailableOnly(false);
    setShowFeaturedOnly(false);
    setSelectedBrands([]);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, "day");
    toast({
      title: "Added to Cart",
      description: `${product.name} added for 1 day.`,
    });
  };

  const handleCompareToggle = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const FilterContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn("space-y-1", !isMobile && "")}>
      {activeFilterCount > 0 && (
        <div className="pb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            className="w-full bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 hover:text-orange-800 transition-colors"
            data-testid="button-clear-filters"
          >
            <RotateCcw className="h-4 w-4 mr-2" /> 
            Clear All Filters
            <Badge variant="secondary" className="ml-2 bg-orange-200 text-orange-800 text-xs">
              {activeFilterCount}
            </Badge>
          </Button>
        </div>
      )}

      <Accordion type="multiple" defaultValue={["brands", "price", "availability", "type"]} className="w-full">
        {availableBrands.length > 0 && (
          <AccordionItem value="brands" className="border-b border-border/50">
            <AccordionTrigger className="hover:no-underline py-4 group">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Tag className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>Brand</span>
                {selectedBrands.length > 0 && (
                  <Badge variant="default" className="ml-1 h-5 px-1.5 text-xs bg-primary">
                    {selectedBrands.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                {availableBrands.map(({ name, count }) => (
                  <label
                    key={name}
                    htmlFor={`brand-${name}`}
                    className={cn(
                      "flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200",
                      "hover:bg-accent/50",
                      selectedBrands.includes(name) && "bg-primary/5 border border-primary/20"
                    )}
                  >
                    <Checkbox 
                      id={`brand-${name}`}
                      checked={selectedBrands.includes(name)}
                      onCheckedChange={() => toggleBrand(name)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      data-testid={`checkbox-brand-${name.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                    <span className="flex-1 text-sm font-medium">{name}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="price" className="border-b border-border/50">
          <AccordionTrigger className="hover:no-underline py-4 group">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <DollarSign className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span>Price Range</span>
              {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  ${priceRange[0]}-${priceRange[1]}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-5 pt-1">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Min</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                    <Input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(priceRange[1] - 10, parseInt(e.target.value) || 0));
                        setPriceRange([val, priceRange[1]]);
                      }}
                      className="pl-7 h-10 text-sm font-medium"
                      min={0}
                      max={priceRange[1] - 10}
                      data-testid="input-min-price"
                    />
                  </div>
                </div>
                <div className="text-muted-foreground mt-5">—</div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Max</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                    <Input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const val = Math.min(maxPrice, Math.max(priceRange[0] + 10, parseInt(e.target.value) || 0));
                        setPriceRange([priceRange[0], val]);
                      }}
                      className="pl-7 h-10 text-sm font-medium"
                      min={priceRange[0] + 10}
                      max={maxPrice}
                      data-testid="input-max-price"
                    />
                  </div>
                </div>
              </div>
              <div className="px-1">
                <Slider 
                  min={0}
                  max={maxPrice}
                  step={5} 
                  value={priceRange} 
                  onValueChange={setPriceRange}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2" 
                  data-testid="slider-price"
                />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>$0</span>
                  <span className="font-medium text-foreground">/month</span>
                  <span>${maxPrice}</span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability" className="border-b border-border/50">
          <AccordionTrigger className="hover:no-underline py-4 group">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Package className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span>Availability</span>
              {showAvailableOnly && (
                <Badge variant="default" className="ml-1 h-5 px-1.5 text-xs bg-green-600">
                  Active
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <label
              htmlFor="available"
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                "hover:bg-accent/50 border border-transparent",
                showAvailableOnly && "bg-green-50 border-green-200"
              )}
            >
              <Checkbox 
                id="available" 
                checked={showAvailableOnly}
                onCheckedChange={(checked) => setShowAvailableOnly(checked === true)}
                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                data-testid="checkbox-available" 
              />
              <div className="flex-1">
                <span className="text-sm font-medium block">In Stock Only</span>
                <span className="text-xs text-muted-foreground">Show products ready to ship</span>
              </div>
            </label>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="type" className="border-b-0">
          <AccordionTrigger className="hover:no-underline py-4 group">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Star className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span>Product Type</span>
              {showFeaturedOnly && (
                <Badge variant="default" className="ml-1 h-5 px-1.5 text-xs bg-amber-500">
                  Featured
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <label
              htmlFor="featured"
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                "hover:bg-accent/50 border border-transparent",
                showFeaturedOnly && "bg-amber-50 border-amber-200"
              )}
            >
              <Checkbox 
                id="featured" 
                checked={showFeaturedOnly}
                onCheckedChange={(checked) => setShowFeaturedOnly(checked === true)}
                className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                data-testid="checkbox-featured" 
              />
              <div className="flex-1">
                <span className="text-sm font-medium block">Featured Products</span>
                <span className="text-xs text-muted-foreground">Top picks from our collection</span>
              </div>
            </label>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  if ((!isAllProductsView && categoryLoading) || productsLoading) {
    return (
      <Layout>
        <SeoHead title="Loading Products..." description="Loading products. Please wait." />
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading products...</p>
        </div>
      </Layout>
    );
  }

  if (!isAllProductsView && !category) {
    return (
      <Layout>
        <SeoHead title="Category Not Found" description="The requested category could not be found." />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
          <Link href="/categories">
            <Button data-testid="button-back-categories">Back to Categories</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const collectionSeo = matchCollection ? COLLECTION_SEO[collectionSlug] : undefined;
  const pageTitle = collectionSeo?.title || (isAllProductsView ? "All Products" : category?.name || "Products");
  const pageDescription = collectionSeo?.description || (isAllProductsView 
    ? "Browse our complete collection of premium tech rentals at affordable daily, weekly, or monthly rates."
    : `Browse and rent ${category?.name?.toLowerCase()} at affordable daily, weekly, or monthly rates. ${category?.description || 'Wide selection of professional equipment.'}`);
  const pageKeywords = collectionSeo?.keywords || (isAllProductsView 
    ? "tech rental, gadget rental, laptop rental, camera rental, equipment rental"
    : `rent ${category?.name?.toLowerCase()}, ${category?.name?.toLowerCase()} rental, hire ${category?.name?.toLowerCase()}, ${category?.name?.toLowerCase()} for rent, affordable ${category?.name?.toLowerCase()} rental`);
  const pageUrl = matchCollection
    ? `https://www.rentmygadgets.com/collections/${collectionSlug}`
    : isAllProductsView ? "https://www.rentmygadgets.com/products" : `https://www.rentmygadgets.com/categories/${categoryId}`;

  return (
    <Layout>
      <SeoHead 
        title={collectionSeo ? pageTitle : `Rent ${pageTitle}`}
        description={pageDescription}
        image={category?.imageUrl || undefined}
        keywords={pageKeywords}
      />
      <StructuredData type="collectionPage" name={collectionSeo ? pageTitle : `${pageTitle} Rentals`} description={pageDescription} url={pageUrl} />
      {(matchCollection || (!isAllProductsView && category)) && (
        <StructuredData type="breadcrumb" items={[
          { name: "Home", url: "https://www.rentmygadgets.com" },
          { name: "Categories", url: "https://www.rentmygadgets.com/categories" },
          ...(matchCollection ? [{ name: pageTitle }] : [{ name: category!.name }]),
        ]} />
      )}
      {/* Lifestyle Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={!isAllProductsView && category?.name ? categoryLifestyleImages[category.name] || laptopLifestyle : laptopLifestyle}
            alt={`${pageTitle} technology equipment available for flexible monthly rental`}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-300 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link> 
            <ChevronRight className="h-4 w-4" />
            {isAllProductsView ? (
              <span className="text-white font-medium">All Products</span>
            ) : (
              <>
                <Link href="/categories" className="hover:text-white transition-colors">Categories</Link> 
                <ChevronRight className="h-4 w-4" />
                <span className="text-white font-medium">{category?.name}</span>
              </>
            )}
          </div>
          
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4" data-testid="text-category-name">
              {pageTitle}
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              {isAllProductsView 
                ? "Browse our complete collection of premium tech equipment available for rent. From powerful laptops to professional cameras."
                : category?.description}
            </p>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-white">
                <Check className="h-5 w-5 text-primary" />
                <span className="text-sm">Free Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Check className="h-5 w-5 text-primary" />
                <span className="text-sm">Flexible Terms</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Check className="h-5 w-5 text-primary" />
                <span className="text-sm">Protection Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-72 shrink-0">
            <div className="sticky top-24">
              <Card className="shadow-sm border-border/60 overflow-hidden">
                <CardHeader className="pb-3 pt-4 px-5 bg-gradient-to-b from-muted/30 to-transparent border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-primary" />
                      <h2 className="font-semibold text-base">Filters</h2>
                    </div>
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {activeFilterCount} active
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <FilterContent />
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="md:hidden flex gap-2">
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex-1 h-11 border-border/60" data-testid="button-filters">
                  <Filter className="mr-2 h-4 w-4" /> 
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="default" className="ml-2 bg-primary">{activeFilterCount}</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] sm:w-[360px] p-0">
                <SheetHeader className="p-5 pb-4 border-b bg-muted/30">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-primary" />
                      Filters
                    </SheetTitle>
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {activeFilterCount} active
                      </Badge>
                    )}
                  </div>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-5">
                  <FilterContent isMobile={true} />
                </div>
                <div className="p-4 border-t bg-background">
                  <Button 
                    className="w-full" 
                    onClick={() => setIsMobileFilterOpen(false)}
                    data-testid="button-apply-filters"
                  >
                    Show {filteredAndSortedProducts.length} Results
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[140px]" data-testid="select-sort-mobile">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A-Z</SelectItem>
                <SelectItem value="name-desc">Name: Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">
                  Showing {filteredAndSortedProducts.length} of {products.length} products
                </span>
                {activeFilterCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-xs h-7"
                    data-testid="button-clear-inline"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
              
              {/* Desktop Sort */}
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-[180px]" data-testid="select-sort">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="name-asc">Name: A-Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedBrands.map(brand => (
                  <Badge key={brand} variant="default" className="gap-1 bg-primary/90">
                    {brand}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => toggleBrand(brand)}
                    />
                  </Badge>
                ))}
                {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                  <Badge variant="secondary" className="gap-1">
                    ${priceRange[0]} - ${priceRange[1]}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setPriceRange([0, maxPrice])}
                    />
                  </Badge>
                )}
                {showAvailableOnly && (
                  <Badge variant="secondary" className="gap-1">
                    Available Only
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setShowAvailableOnly(false)}
                    />
                  </Badge>
                )}
                {showFeaturedOnly && (
                  <Badge variant="secondary" className="gap-1">
                    Featured Only
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setShowFeaturedOnly(false)}
                    />
                  </Badge>
                )}
              </div>
            )}

            {/* Product Grid */}
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed rounded-2xl">
                <p className="text-muted-foreground mb-4">No products found matching your criteria.</p>
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product) => {
                  const isPhoneCategory = category?.name === "Phones";
                  return (
                  <Link key={product.id} href={`/product/${product.slug || product.id}`} className="group block h-full cursor-pointer" data-testid={`product-card-${product.id}`}>
                    <div className="bg-card rounded-xl border overflow-hidden h-full flex flex-col hover:shadow-lg hover:border-primary/20">
                      <div className={`${isPhoneCategory ? 'aspect-square' : 'aspect-[4/5]'} overflow-hidden bg-white relative`}>
                        <div className="w-full h-full">
                          <ProductImage 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        {product.featured && (
                          <span className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                            Popular
                          </span>
                        )}
                        <button
                          onClick={(e) => handleCompareToggle(product, e)}
                          className={`absolute top-2 left-2 p-2 rounded-full transition-all ${
                            isInCompare(product.id) 
                              ? 'bg-primary text-white shadow-lg' 
                              : 'bg-white/90 text-muted-foreground hover:bg-white hover:text-primary shadow'
                          }`}
                          data-testid={`button-compare-${product.id}`}
                          title={isInCompare(product.id) ? "Remove from compare" : "Add to compare"}
                        >
                          {isInCompare(product.id) ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Scale className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary">{product.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.specs?.slice(0, 2).map((spec) => (
                            <span key={spec} className="text-xs bg-secondary px-2 py-1 rounded-md text-muted-foreground">
                              {spec}
                            </span>
                          ))}
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="text-lg font-bold">
                            ${product.pricePerMonth}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="rounded-full"
                            onClick={(e) => handleQuickAdd(product, e)}
                            data-testid={`button-rent-${product.id}`}
                          >
                            Rent Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      {!isAllProductsView && categoryId && <CategoryContent categoryId={categoryId} />}
    </Layout>
  );
}
