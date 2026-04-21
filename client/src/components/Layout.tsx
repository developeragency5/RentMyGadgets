import { Link, useLocation } from "wouter";
import { ShoppingCart, User, Menu, X, Search, LogOut, Loader2 } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/Logo";
import CompareBar from "@/components/CompareBar";
import CookieConsent from "@/components/CookieConsent";
import ConsentGatedScripts from "@/components/ConsentGatedScripts";
import PromoMarquee from "@/components/PromoMarquee";
import { fetchSearchSuggestions, type SearchSuggestion } from "@/lib/api";
import { motion } from "framer-motion";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { getItemCount, cartAnimationTrigger } = useCart();
  const { user, logout, isLoading } = useAuth();
  const [isCartShaking, setIsCartShaking] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const moreDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (cartAnimationTrigger > 0) {
      setIsCartShaking(true);
      const timer = setTimeout(() => setIsCartShaking(false), 350);
      return () => clearTimeout(timer);
    }
  }, [cartAnimationTrigger]);

  // Debounced search for suggestions
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await fetchSearchSuggestions(searchQuery);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    } else {
      setLocation("/search");
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setShowSuggestions(false);
    setSearchQuery("");
    setLocation(`/product/${suggestion.slug || suggestion.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const primaryNavLinks = [
    { href: "/", label: "Home" },
    { href: "/categories", label: "Categories" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/gadgetcare", label: "GadgetCare+" },
    { href: "/rent-to-own", label: "Rent-to-Own" },
  ];

  const secondaryNavLinks = [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/blog", label: "Blog" },
  ];

  const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-6 h-20 flex items-center">
          {/* Left: Logo - fixed width for balance */}
          <div className="flex-1 flex items-center">
            <Logo size="md" className="[&>span:last-child]:hidden sm:[&>span:last-child]:inline" />
          </div>

          {/* Center: Desktop Nav - truly centered */}
          <nav className="hidden lg:flex items-center gap-1 justify-center mx-8">
            {primaryNavLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary hover:bg-secondary/50 rounded-lg cursor-pointer whitespace-nowrap ${
                  location === link.href ? "text-primary bg-primary/5" : "text-muted-foreground"
                }`}>
                  {link.label}
                </div>
              </Link>
            ))}
            
            {/* More dropdown for secondary links - opens on hover */}
            <DropdownMenu open={moreDropdownOpen} onOpenChange={setMoreDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button 
                  className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-secondary/50 rounded-lg cursor-pointer whitespace-nowrap flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  onMouseEnter={() => {
                    if (moreDropdownTimeoutRef.current) clearTimeout(moreDropdownTimeoutRef.current);
                    setMoreDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    moreDropdownTimeoutRef.current = setTimeout(() => setMoreDropdownOpen(false), 150);
                  }}
                >
                  More
                  <svg className={`w-3 h-3 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-40"
                onMouseEnter={() => {
                  if (moreDropdownTimeoutRef.current) clearTimeout(moreDropdownTimeoutRef.current);
                }}
                onMouseLeave={() => {
                  moreDropdownTimeoutRef.current = setTimeout(() => setMoreDropdownOpen(false), 150);
                }}
              >
                {secondaryNavLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href}>
                      <div className="cursor-pointer w-full">{link.label}</div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right: Actions - fixed width for balance */}
          <div className="flex-1 flex items-center justify-end gap-3">
            {/* Search Button */}
            <Link href="/search">
              <button 
                className="p-2.5 hover:bg-secondary rounded-full transition-colors hidden lg:flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                data-testid="button-header-search"
                aria-label="Search gadgets"
              >
                <Search className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </button>
            </Link>
            
            <Link href="/cart">
              <div className={`relative p-2 hover:bg-secondary rounded-full transition-colors cursor-pointer ${isCartShaking ? 'animate-cart-shake' : ''}`} data-testid="link-cart">
                <ShoppingCart className="h-5 w-5" />
                {getItemCount() > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-[10px] font-bold text-white flex items-center justify-center rounded-full" data-testid="badge-cart-count">
                    {getItemCount()}
                  </span>
                )}
              </div>
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="p-2 hover:bg-secondary rounded-full transition-colors hidden lg:flex items-center gap-2 cursor-pointer" data-testid="button-user-menu">
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium">{user.username.startsWith('guest_') ? 'Guest' : user.username}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <div className="flex items-center gap-2 cursor-pointer w-full" data-testid="link-dashboard">
                        <User className="h-4 w-4" /> My Dashboard
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="hidden lg:flex" data-testid="button-signin">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="relative mb-4">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search gadgets..." 
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="input-mobile-search"
                    />
                  </form>
                  {allNavLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <div 
                        className="text-lg font-medium py-2 border-b border-border/50 hover:text-primary transition-colors cursor-pointer"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </div>
                    </Link>
                  ))}
                  <div className="mt-4 space-y-2">
                    {user ? (
                      <>
                        <Link href="/dashboard">
                          <Button className="w-full justify-start" variant="outline" onClick={() => setIsMobileMenuOpen(false)}>
                            <User className="mr-2 h-4 w-4" /> My Dashboard
                          </Button>
                        </Link>
                        <Button className="w-full justify-start" variant="ghost" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                          <LogOut className="mr-2 h-4 w-4" /> Sign Out
                        </Button>
                      </>
                    ) : (
                      <Link href="/login">
                        <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                          Sign In
                        </Button>
                      </Link>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <PromoMarquee />

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-secondary/30 border-t mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <Logo size="md" />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Premium tech rentals for professionals and businesses. 
                Get the latest gear without the upfront cost.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/"><span className="hover:text-primary cursor-pointer">Home</span></Link></li>
                <li><Link href="/categories"><span className="hover:text-primary cursor-pointer">Categories</span></Link></li>
                <li><Link href="/how-it-works"><span className="hover:text-primary cursor-pointer">How It Works</span></Link></li>
                <li><Link href="/gadgetcare"><span className="hover:text-primary cursor-pointer text-blue-600 dark:text-blue-500 font-medium">GadgetCare+</span></Link></li>
                <li><Link href="/rent-to-own"><span className="hover:text-primary cursor-pointer text-amber-600 dark:text-amber-500 font-medium">Rent-to-Own</span></Link></li>
                <li><Link href="/blog"><span className="hover:text-primary cursor-pointer">Blog</span></Link></li>
                <li><Link href="/about"><span className="hover:text-primary cursor-pointer">About Us</span></Link></li>
                <li><Link href="/contact"><span className="hover:text-primary cursor-pointer">Contact</span></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Policies</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/terms"><span className="hover:text-primary cursor-pointer">Terms & Conditions</span></Link></li>
                <li><Link href="/rental-policy"><span className="hover:text-primary cursor-pointer">Rental Agreement</span></Link></li>
                <li><Link href="/return-policy"><span className="hover:text-primary cursor-pointer">Return & Refund</span></Link></li>
                <li><Link href="/shipping-policy"><span className="hover:text-primary cursor-pointer">Shipping & Delivery</span></Link></li>
                <li><Link href="/security-deposit"><span className="hover:text-primary cursor-pointer">Security Deposit</span></Link></li>
                <li><Link href="/damage-policy"><span className="hover:text-primary cursor-pointer">Damage & Loss</span></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Privacy & Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy"><span className="hover:text-primary cursor-pointer">Privacy Policy</span></Link></li>
                <li><Link href="/cookies"><span className="hover:text-primary cursor-pointer">Cookie Policy</span></Link></li>
                <li><Link href="/do-not-sell"><span className="hover:text-primary cursor-pointer">Do Not Sell My Info</span></Link></li>
                <li><Link href="/accessibility"><span className="hover:text-primary cursor-pointer">Accessibility</span></Link></li>
                <li><Link href="/advertising-disclosure"><span className="hover:text-primary cursor-pointer">Advertising Disclosure</span></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{`support${"\u0040"}rentmygadgets.com`}</li>
                <li>PC Rental, LLC</li>
                <li>2393 Seabreeze Dr SE</li>
                <li>Darien, GA 31305-5425</li>
                <li>United States</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 RentMyGadgets. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/terms"><span className="hover:text-primary cursor-pointer">Terms</span></Link>
              <Link href="/privacy"><span className="hover:text-primary cursor-pointer">Privacy</span></Link>
              <Link href="/cookies"><span className="hover:text-primary cursor-pointer">Cookies</span></Link>
              <Link href="/accessibility"><span className="hover:text-primary cursor-pointer">Accessibility</span></Link>
              <button 
                onClick={() => {
                  localStorage.removeItem("cookieConsent");
                  document.querySelectorAll("script[data-consent-category]").forEach(el => el.remove());
                  const trackingCookies = ["_ga", "_gid", "_gat", "_fbp", "_fbc"];
                  trackingCookies.forEach(name => {
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                  });
                  window.location.reload();
                }}
                className="hover:text-primary cursor-pointer"
              >
                Cookie Settings
              </button>
            </div>
          </div>

          <div className="border-t mt-8 pt-6 text-xs text-muted-foreground/70 space-y-3" data-testid="footer-disclaimers">
            <p>
              <strong>Disclaimer:</strong> RentMyGadgets is a rental service platform. All product names, logos, and brands are property of their respective owners. 
              All company, product, and service names used on this website are for identification purposes only. Use of these names, logos, and brands does not imply endorsement.
            </p>
            <p>
              <strong>Pricing & Availability:</strong> Prices shown are subject to change without notice. Product availability varies by location and is not guaranteed. 
              Rental rates are exclusive of applicable taxes, deposits, and insurance fees unless otherwise stated.
            </p>
            <p>
              <strong>Images:</strong> Product images are for illustrative purposes only and may differ from actual products. 
              Some images may show accessories or features not included in standard rentals.
            </p>
            <p>
              <strong>Liability:</strong> RentMyGadgets is not responsible for any data loss, damage, or injury resulting from the use of rented equipment. 
              Renters are responsible for the proper care and timely return of all rented items as outlined in our rental agreement.
            </p>
          </div>
        </div>
      </footer>
      
      <CompareBar />
      <CookieConsent />
      <ConsentGatedScripts />
    </div>
  );
}
