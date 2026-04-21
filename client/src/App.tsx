import { Switch, Route, useLocation, Router as WouterRouter } from "wouter";
import { useEffect, Suspense, lazy } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { CompareProvider } from "@/lib/compare-context";
import { Loader2 } from "lucide-react";

// Eager load critical pages for best UX
import Home from "@/pages/home";
import ProductDetail from "@/pages/product-detail";
import Cart from "@/pages/cart";

// Lazy load less critical pages for better initial bundle size
const Categories = lazy(() => import("@/pages/categories"));
const ProductList = lazy(() => import("@/pages/product-list"));
const Checkout = lazy(() => import("@/pages/checkout"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const About = lazy(() => import("@/pages/about"));
const Contact = lazy(() => import("@/pages/contact"));
const Login = lazy(() => import("@/pages/login"));
const Compare = lazy(() => import("@/pages/compare"));
const Blog = lazy(() => import("@/pages/blog"));
const BlogPost = lazy(() => import("@/pages/blog-post"));
const SearchPage = lazy(() => import("@/pages/search"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Terms = lazy(() => import("@/pages/terms"));
const RentalPolicy = lazy(() => import("@/pages/rental-policy"));
const ReturnPolicy = lazy(() => import("@/pages/return-policy"));
const ShippingPolicy = lazy(() => import("@/pages/shipping-policy"));
const SecurityDeposit = lazy(() => import("@/pages/security-deposit"));
const DamagePolicy = lazy(() => import("@/pages/damage-policy"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const CookiePolicy = lazy(() => import("@/pages/cookies"));
const AdvertisingDisclosure = lazy(() => import("@/pages/advertising-disclosure"));
const AccessibilityStatement = lazy(() => import("@/pages/accessibility"));
const DoNotSell = lazy(() => import("@/pages/do-not-sell"));
const RentToOwn = lazy(() => import("@/pages/rent-to-own"));
const HowItWorks = lazy(() => import("@/pages/how-it-works"));
const GadgetCare = lazy(() => import("@/pages/gadgetcare"));
const AdVariants = lazy(() => import("@/pages/ad-variants"));
const OfficePrinterRentals = lazy(() => import("@/pages/office-printer-rentals"));

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/categories" component={Categories} />
        <Route path="/categories/:id" component={ProductList} />
        <Route path="/products" component={ProductList} />
        <Route path="/collections/:slug" component={ProductList} />
        <Route path="/product/:slug" component={ProductDetail} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/login" component={Login} />
        <Route path="/compare" component={Compare} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/search" component={SearchPage} />
        <Route path="/terms" component={Terms} />
        <Route path="/rental-policy" component={RentalPolicy} />
        <Route path="/return-policy" component={ReturnPolicy} />
        <Route path="/shipping-policy" component={ShippingPolicy} />
        <Route path="/security-deposit" component={SecurityDeposit} />
        <Route path="/damage-policy" component={DamagePolicy} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/cookies" component={CookiePolicy} />
        <Route path="/advertising-disclosure" component={AdvertisingDisclosure} />
        <Route path="/accessibility" component={AccessibilityStatement} />
        <Route path="/do-not-sell" component={DoNotSell} />
        <Route path="/rent-to-own" component={RentToOwn} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/gadgetcare" component={GadgetCare} />
        <Route path="/ad-variants" component={AdVariants} />
        <Route path="/office-printer-rentals" component={OfficePrinterRentals} />
        
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

const basePath = import.meta.env.BASE_URL !== "/" ? import.meta.env.BASE_URL.replace(/\/$/, "") : "";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={basePath}>
        <AuthProvider>
          <CartProvider>
            <CompareProvider>
              <TooltipProvider>
                <ScrollToTop />
                <Toaster />
                <Router />
              </TooltipProvider>
            </CompareProvider>
          </CartProvider>
        </AuthProvider>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
