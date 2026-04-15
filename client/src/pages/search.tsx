import { useState, useMemo, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchProducts, fetchCategories } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { useCompare } from "@/lib/compare-context";
import { useToast } from "@/hooks/use-toast";
import { Search, SlidersHorizontal, X, Loader2, ArrowUpDown, Scale, Check } from "lucide-react";
import type { Product, Category } from "@shared/schema";
import { motion } from "framer-motion";

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

export default function SearchPage() {
  const [location, setLocation] = useLocation();
  const { addToCart } = useCart();
  const { addToCompare, removeFromCompare, isInCompare, canAddMore } = useCompare();
  const { toast } = useToast();

  const getQueryFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('q') || '';
  };

  const [searchQuery, setSearchQuery] = useState(getQueryFromUrl);
  const [debouncedQuery, setDebouncedQuery] = useState(getQueryFromUrl);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const newQuery = getQueryFromUrl();
    if (newQuery !== searchQuery) {
      setSearchQuery(newQuery);
      setDebouncedQuery(newQuery);
    }
  }, [location]);

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: () => fetchProducts()
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 600;
    return Math.ceil(Math.max(...products.map(p => parseFloat(p.pricePerMonth))) / 10) * 10 + 50;
  }, [products]);

  const currentPriceRange = priceRange || [0, maxPrice];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.specs?.some(spec => spec.toLowerCase().includes(query))
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.categoryId));
    }

    if (priceRange) {
      result = result.filter(p => {
        const price = parseFloat(p.pricePerMonth);
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }

    if (showAvailableOnly) {
      result = result.filter(p => p.available);
    }

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
      case 'relevance':
      default:
        if (debouncedQuery.trim()) {
          const query = debouncedQuery.toLowerCase();
          result.sort((a, b) => {
            const aNameMatch = a.name.toLowerCase().includes(query) ? 2 : 0;
            const bNameMatch = b.name.toLowerCase().includes(query) ? 2 : 0;
            const aFeatured = a.featured ? 1 : 0;
            const bFeatured = b.featured ? 1 : 0;
            return (bNameMatch + bFeatured) - (aNameMatch + aFeatured);
          });
        } else {
          result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }
        break;
    }

    return result;
  }, [products, debouncedQuery, selectedCategories, priceRange, showAvailableOnly, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (priceRange !== null) count++;
    if (selectedCategories.length > 0) count++;
    if (showAvailableOnly) count++;
    return count;
  }, [priceRange, selectedCategories, showAvailableOnly]);

  const clearFilters = () => {
    setPriceRange(null);
    setSelectedCategories([]);
    setShowAvailableOnly(false);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
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

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold mb-4">Categories</h3>
        <div className="space-y-3">
          {categories.map(category => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`cat-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
                data-testid={`checkbox-category-${category.id}`}
              />
              <label 
                htmlFor={`cat-${category.id}`} 
                className="text-sm font-medium leading-none cursor-pointer flex-1"
              >
                {category.name}
              </label>
              <span className="text-xs text-muted-foreground">
                ({products.filter(p => p.categoryId === category.id).length})
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-4">Price Range (per month)</h3>
        <Slider 
          min={0}
          max={maxPrice}
          step={5} 
          value={currentPriceRange} 
          onValueChange={(value) => setPriceRange([value[0], value[1]])}
          className="mb-2" 
          data-testid="slider-price-range"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${currentPriceRange[0]}</span>
          <span>${currentPriceRange[1]}</span>
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-4">Availability</h3>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="available-only" 
            checked={showAvailableOnly}
            onCheckedChange={(checked) => setShowAvailableOnly(checked === true)}
            data-testid="checkbox-available-only" 
          />
          <label htmlFor="available-only" className="text-sm font-medium leading-none cursor-pointer">
            Available Now Only
          </label>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearFilters}
          className="w-full"
          data-testid="button-clear-all-filters"
        >
          <X className="h-4 w-4 mr-2" /> Clear All Filters
        </Button>
      )}
    </div>
  );

  if (productsLoading || categoriesLoading) {
    return (
      <Layout>
        <SeoHead title="Search Products" description="Search for tech gadgets to rent." />
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading products...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SeoHead 
        title={debouncedQuery ? `Search: ${debouncedQuery}` : "Search Products"}
        description="Search and filter tech gadgets by category, price, and keywords. Find the perfect rental equipment."
        keywords="find laptop rental, search tech equipment, browse rental products, discover gadgets to rent, search MacBook rental, find camera rental, equipment search"
      />

      <div className="bg-secondary/30 py-8 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-semibold mb-6" data-testid="search-heading">
            {debouncedQuery ? (
              <>Results for "<span className="text-primary">{debouncedQuery}</span>"</>
            ) : (
              "Search Products"
            )}
          </h1>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const newUrl = searchQuery.trim() 
                ? `/search?q=${encodeURIComponent(searchQuery.trim())}`
                : '/search';
              window.history.replaceState({}, '', newUrl);
            }}
            className="relative max-w-2xl"
          >
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, description, or specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-24 h-12 text-lg border-0 focus-visible:ring-2 focus-visible:ring-primary/50"
              data-testid="input-search"
            />
            <div className="absolute right-2 top-1.5 flex items-center gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    window.history.replaceState({}, '', '/search');
                  }}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="button-clear-search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              <button
                type="submit"
                className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                data-testid="button-search-submit"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="hidden md:block w-64 space-y-8 sticky top-24 h-fit">
            <FilterContent />
          </aside>

          <div className="md:hidden flex gap-2 mb-4">
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex-1" data-testid="button-mobile-filters">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> 
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-2">{activeFilterCount}</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="py-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[140px]" data-testid="select-sort-mobile">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A-Z</SelectItem>
                <SelectItem value="name-desc">Name: Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground" data-testid="text-result-count">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                  {debouncedQuery && ` for "${debouncedQuery}"`}
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
              
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-[180px]" data-testid="select-sort">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="name-asc">Name: A-Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map(catId => (
                  <Badge key={catId} variant="secondary" className="gap-1">
                    {getCategoryName(catId)}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => toggleCategory(catId)}
                    />
                  </Badge>
                ))}
                {priceRange !== null && (
                  <Badge variant="secondary" className="gap-1">
                    ${priceRange[0]} - ${priceRange[1]}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setPriceRange(null)}
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
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed rounded-2xl">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  {debouncedQuery 
                    ? `No results for "${debouncedQuery}". Try different keywords or adjust your filters.`
                    : "Adjust your filters to see more results."
                  }
                </p>
                <Button variant="outline" onClick={() => { clearFilters(); setSearchQuery(''); }}>
                  Clear All
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/product/${product.id}`} 
                    className="group block h-full cursor-pointer" 
                    data-testid={`search-product-card-${product.id}`}
                  >
                    <motion.div
                      className="bg-card rounded-xl border overflow-hidden h-full flex flex-col"
                      whileHover={{ 
                        y: -4, 
                        scale: 1.02,
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 0 20px -5px rgba(249, 115, 22, 0.08)"
                      }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-white relative">
                        <div className="w-full h-full transition-transform duration-300 ease-out group-hover:scale-[1.06]">
                          <img 
                            src={product.imageUrl || ''} 
                            alt={`${product.name} available for rent at RentMyGadgets`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="absolute bottom-2 left-2 bg-white/90"
                        >
                          {getCategoryName(product.categoryId)}
                        </Badge>
                        {product.featured && (
                          <span className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                            Popular
                          </span>
                        )}
                        {!product.available && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-white text-black text-sm font-bold px-3 py-1 rounded-full">
                              Unavailable
                            </span>
                          </div>
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
                        <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
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
                            disabled={!product.available}
                            data-testid={`button-rent-${product.id}`}
                          >
                            {product.available ? 'Rent' : 'N/A'}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
