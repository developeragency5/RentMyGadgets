import { useState, useMemo, useEffect, useCallback } from "react";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Loader2, 
  ArrowLeft, 
  ArrowRight,
  ShoppingCart,
  User,
  MapPin,
  Wallet,
  ClipboardCheck,
  Check,
  Package,
  Edit2
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCart, GADGET_CARE_RATE } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";
import type { CartPricingResult } from "@shared/pricing";

type CheckoutStep = 1 | 2 | 3 | 4 | 5;

interface StepInfo {
  id: CheckoutStep;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: StepInfo[] = [
  { id: 1, title: "Cart Review", description: "Verify your items", icon: <ShoppingCart className="h-5 w-5" /> },
  { id: 2, title: "Customer Info", description: "Your details", icon: <User className="h-5 w-5" /> },
  { id: 3, title: "Billing Address", description: "Where to bill", icon: <MapPin className="h-5 w-5" /> },
  { id: 4, title: "Payment", description: "Payment method", icon: <Wallet className="h-5 w-5" /> },
  { id: 5, title: "Review Order", description: "Final confirmation", icon: <ClipboardCheck className="h-5 w-5" /> },
];

export default function Checkout() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { items, clearCart, updateQuantity, removeFromCart, getGadgetCareTotal } = useCart();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverPricing, setServerPricing] = useState<CartPricingResult | null>(null);
  const [isPricingLoading, setIsPricingLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZip: "",
    billingCountry: "United States",
    sameAsDelivery: true,
    deliveryAddress: "",
    deliveryCity: "",
    deliveryState: "",
    deliveryZip: "",
    deliveryCountry: "United States",
    paymentMethod: "card",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
    termsAgreed: false,
  });

  const cartItemsWithProducts = useMemo(() => {
    return items.filter(item => item.product);
  }, [items]);

  const calculateItemPrice = (pricePerMonth: number, rentalPeriod: string, quantity: number, variantPriceAdjustment: number = 0) => {
    const adjustedPrice = pricePerMonth + variantPriceAdjustment;
    let price = adjustedPrice;
    if (rentalPeriod === 'day') price = adjustedPrice * 0.07;
    if (rentalPeriod === 'week') price = adjustedPrice * 0.35;
    if (rentalPeriod === 'year') price = adjustedPrice * 10;
    return Math.round(price * quantity * 100) / 100;
  };

  const subtotal = useMemo(() => {
    return cartItemsWithProducts.reduce((total, item) => {
      if (!item.product) return total;
      return total + calculateItemPrice(parseFloat(item.product.pricePerMonth), item.rentalPeriod, item.quantity, item.variantPriceAdjustment || 0);
    }, 0);
  }, [cartItemsWithProducts]);

  const gadgetCareTotal = getGadgetCareTotal();
  const subtotalWithCare = subtotal + gadgetCareTotal;
  const deliveryFee = 0;
  const tax = subtotalWithCare * 0.1;
  const total = subtotalWithCare + tax + deliveryFee;

  const fetchServerPricing = useCallback(async () => {
    if (!user) return;
    
    setIsPricingLoading(true);
    try {
      const response = await fetch("/api/pricing/cart", {
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        }
      });
      const ct = response.headers.get("content-type") || "";
      if (response.ok && ct.includes("application/json")) {
        const pricing: CartPricingResult = await response.json();
        setServerPricing(pricing);
      }
    } catch (error) {
      console.error("Failed to fetch server pricing:", error);
    } finally {
      setIsPricingLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (currentStep === 5 && user) {
      fetchServerPricing();
    }
  }, [currentStep, user, fetchServerPricing]);

  const getRentalPeriodLabel = (period: string) => {
    switch (period) {
      case 'day': return 'Daily';
      case 'week': return 'Weekly';
      case 'month': return 'Monthly';
      case 'year': return 'Yearly (17% off)';
      default: return period;
    }
  };

  const validateStep = (step: CheckoutStep): boolean => {
    switch (step) {
      case 1:
        return items.length > 0;
      case 2:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone);
      case 3:
        const billingValid = !!(formData.billingAddress && formData.billingCity && formData.billingState && formData.billingZip);
        if (!formData.sameAsDelivery) {
          return billingValid && !!(formData.deliveryAddress && formData.deliveryCity && formData.deliveryState && formData.deliveryZip);
        }
        return billingValid;
      case 4:
        if (formData.paymentMethod === 'card') {
          return !!(formData.cardNumber && formData.cardName && formData.expiry && formData.cvc);
        }
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const goToStep = (step: CheckoutStep) => {
    if (step < currentStep || validateStep(currentStep)) {
      setCurrentStep(step);
    } else {
      toast({
        title: "Please complete this step",
        description: "Fill in all required fields before proceeding.",
        variant: "destructive"
      });
    }
  };

  const nextStep = () => {
    if (currentStep < 5 && validateStep(currentStep)) {
      setCurrentStep((currentStep + 1) as CheckoutStep);
    } else if (!validateStep(currentStep)) {
      toast({
        title: "Please complete this step",
        description: "Fill in all required fields before proceeding.",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as CheckoutStep);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to place an order.",
        variant: "destructive"
      });
      setLocation("/login");
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checking out.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const deliveryAddress = formData.sameAsDelivery 
        ? `${formData.firstName} ${formData.lastName}, ${formData.billingAddress}, ${formData.billingCity}, ${formData.billingState} ${formData.billingZip}, Phone: ${formData.phone}`
        : `${formData.firstName} ${formData.lastName}, ${formData.deliveryAddress}, ${formData.deliveryCity}, ${formData.deliveryState} ${formData.deliveryZip}, Phone: ${formData.phone}`;
      
      const response = await fetch("/api/orders", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            rentalPeriod: item.rentalPeriod
          })),
          deliveryAddress,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to place order");
      }

      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: "You will receive a confirmation email shortly.",
      });
      setTimeout(() => setLocation("/dashboard"), 1500);
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && currentStep === 1) {
    return (
      <Layout>
        <SeoHead title="Checkout" description="Complete your tech rental order. Secure payment with free delivery." keywords="rental checkout, payment, same day delivery, complete rental order, quick checkout" />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-3xl font-heading font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Add some gadgets to your cart before checking out.</p>
          <Link href="/categories">
            <Button size="lg" data-testid="button-browse-categories">Browse Categories</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const TrustBadges = () => (
    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mt-6 pt-4 border-t">
      <div className="flex items-center gap-1">
        <ShieldCheck className="h-4 w-4 text-green-600" /> Secure Checkout
      </div>
      <div className="flex items-center gap-1">
        <Truck className="h-4 w-4 text-primary" /> Delivery Available
      </div>
    </div>
  );

  const StepIndicator = () => (
    <div className="mb-8 overflow-x-auto pb-2">
      <div className="flex items-center justify-between max-w-4xl mx-auto min-w-[320px] px-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <button
              onClick={() => step.id <= currentStep && goToStep(step.id)}
              className={`flex flex-col items-center group ${step.id <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              disabled={step.id > currentStep}
              data-testid={`step-indicator-${step.id}`}
            >
              <div className={`
                w-8 h-8 sm:w-10 md:w-12 sm:h-10 md:h-12 rounded-full flex items-center justify-center mb-1 sm:mb-2 transition-all
                ${currentStep === step.id 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                  : step.id < currentStep 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-secondary text-muted-foreground'
                }
                ${step.id <= currentStep ? 'group-hover:scale-110' : ''}
              `}>
                {step.id < currentStep ? <Check className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" /> : 
                  <span className="[&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-4 sm:[&>svg]:w-4 md:[&>svg]:h-5 md:[&>svg]:w-5">{step.icon}</span>
                }
              </div>
              <span className={`text-[10px] sm:text-xs md:text-sm font-medium text-center max-w-[60px] sm:max-w-none ${currentStep === step.id ? 'text-primary' : 'text-muted-foreground'}`}>
                {step.title}
              </span>
              <span className="text-xs text-muted-foreground hidden lg:block">{step.description}</span>
            </button>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 rounded min-w-[8px] ${step.id < currentStep ? 'bg-primary' : 'bg-secondary'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const CartReviewStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> Your Items ({cartItemsWithProducts.length})
          </CardTitle>
          <CardDescription>Review your rental items before proceeding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartItemsWithProducts.map((item) => {
            const adjustedMonthlyPrice = parseFloat(item.product?.pricePerMonth || '0') + (item.variantPriceAdjustment || 0);
            const hasVariants = item.variantConfiguration && Object.keys(item.variantConfiguration).length > 0;
            
            return (
            <div key={`${item.productId}-${item.rentalPeriod}-${JSON.stringify(item.variantConfiguration || {})}`} className="p-3 sm:p-4 bg-secondary/20 rounded-lg" data-testid={`cart-review-item-${item.productId}`}>
              <div className="flex gap-3 sm:gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.product?.imageUrl || ''} className="w-full h-full object-cover" alt={item.product?.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-sm sm:text-base truncate">{item.product?.name}</h4>
                    <div className="font-bold text-sm sm:text-lg whitespace-nowrap" data-testid={`text-item-price-${item.productId}`}>
                      ${calculateItemPrice(parseFloat(item.product?.pricePerMonth || '0'), item.rentalPeriod, item.quantity, item.variantPriceAdjustment || 0).toFixed(2)}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{getRentalPeriodLabel(item.rentalPeriod)}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">${adjustedMonthlyPrice.toFixed(2)}/mo</p>
                  {(hasVariants || item.selectedColor) && (
                    <div className="mt-1 flex flex-wrap gap-1" data-testid={`variant-config-${item.productId}`}>
                      {item.selectedColor && (
                        <span className="text-xs bg-secondary text-foreground px-2 py-0.5 rounded-full border">
                          {item.selectedColor}
                        </span>
                      )}
                      {hasVariants && Object.entries(item.variantConfiguration!).map(([type, label]) => (
                        <span key={type} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-secondary">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    data-testid={`button-decrease-${item.productId}`}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    data-testid={`button-increase-${item.productId}`}
                  >
                    +
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-destructive hover:text-destructive text-xs sm:text-sm"
                  onClick={() => removeFromCart(item.id)}
                  data-testid={`button-remove-${item.productId}`}
                >
                  Remove
                </Button>
              </div>
            </div>
          );
          })}
        </CardContent>
      </Card>

      <Card className="bg-secondary/20">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {gadgetCareTotal > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                  GadgetCare+ Protection
                </span>
                <span className="text-blue-600 font-medium">+${gadgetCareTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span data-testid="text-cart-total">${total.toFixed(2)}</span>
            </div>
          </div>
          {TrustBadges()}
        </CardContent>
      </Card>
    </div>
  );

  const CustomerInfoStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" /> Customer Information
        </CardTitle>
        <CardDescription>Tell us about yourself</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input 
              id="firstName" 
              data-testid="input-firstname"
              placeholder="John" 
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input 
              id="lastName" 
              data-testid="input-lastname"
              placeholder="Doe" 
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              required 
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input 
            id="email" 
            type="email"
            data-testid="input-email"
            placeholder="john@example.com" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input 
            id="phone" 
            data-testid="input-phone"
            placeholder="+1 (555) 000-0000" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required 
          />
        </div>
        {TrustBadges()}
      </CardContent>
    </Card>
  );

  const BillingAddressStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" /> Billing Address
        </CardTitle>
        <CardDescription>Where should we send the invoice?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="billingAddress">Street Address *</Label>
          <Input 
            id="billingAddress" 
            data-testid="input-billing-address"
            placeholder="123 Tech Street" 
            value={formData.billingAddress}
            onChange={(e) => setFormData({...formData, billingAddress: e.target.value})}
            required 
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="billingCity">City *</Label>
            <Input 
              id="billingCity" 
              data-testid="input-billing-city"
              placeholder="San Francisco" 
              value={formData.billingCity}
              onChange={(e) => setFormData({...formData, billingCity: e.target.value})}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="billingState">State *</Label>
            <Input 
              id="billingState" 
              data-testid="input-billing-state"
              placeholder="California" 
              value={formData.billingState}
              onChange={(e) => setFormData({...formData, billingState: e.target.value})}
              required 
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="billingZip">ZIP Code *</Label>
            <Input 
              id="billingZip" 
              data-testid="input-billing-zip"
              placeholder="94105" 
              value={formData.billingZip}
              onChange={(e) => setFormData({...formData, billingZip: e.target.value})}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="billingCountry">Country</Label>
            <Input 
              id="billingCountry" 
              data-testid="input-billing-country"
              value={formData.billingCountry}
              onChange={(e) => setFormData({...formData, billingCountry: e.target.value})}
            />
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="sameAsDelivery"
            checked={formData.sameAsDelivery}
            onChange={(e) => setFormData({...formData, sameAsDelivery: e.target.checked})}
            className="h-4 w-4 rounded border-gray-300"
            data-testid="checkbox-same-delivery"
          />
          <Label htmlFor="sameAsDelivery" className="cursor-pointer">Delivery address is the same as billing address</Label>
        </div>

        {!formData.sameAsDelivery && (
          <div className="space-y-4 pt-4 border-t mt-4">
            <h4 className="font-medium flex items-center gap-2">
              <Truck className="h-4 w-4" /> Delivery Address
            </h4>
            <div className="space-y-2">
              <Label htmlFor="deliveryAddress">Street Address *</Label>
              <Input 
                id="deliveryAddress" 
                data-testid="input-delivery-address"
                placeholder="456 Delivery Lane" 
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryCity">City *</Label>
                <Input 
                  id="deliveryCity" 
                  data-testid="input-delivery-city"
                  placeholder="San Francisco" 
                  value={formData.deliveryCity}
                  onChange={(e) => setFormData({...formData, deliveryCity: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryState">State *</Label>
                <Input 
                  id="deliveryState" 
                  data-testid="input-delivery-state"
                  placeholder="California" 
                  value={formData.deliveryState}
                  onChange={(e) => setFormData({...formData, deliveryState: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryZip">ZIP Code *</Label>
              <Input 
                id="deliveryZip" 
                data-testid="input-delivery-zip"
                placeholder="94105" 
                value={formData.deliveryZip}
                onChange={(e) => setFormData({...formData, deliveryZip: e.target.value})}
                required
              />
            </div>
          </div>
        )}
        {TrustBadges()}
      </CardContent>
    </Card>
  );

  const PaymentStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" /> Payment Method
        </CardTitle>
        <CardDescription>Choose how you'd like to pay</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={formData.paymentMethod} 
          onValueChange={(value) => setFormData({...formData, paymentMethod: value})} 
          className="space-y-4"
        >
          <div className={`flex items-center space-x-3 border p-4 rounded-lg transition-colors ${formData.paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'bg-secondary/10'}`}>
            <RadioGroupItem value="card" id="card" data-testid="radio-card" />
            <Label htmlFor="card" className="flex-1 cursor-pointer font-medium">Credit / Debit Card</Label>
            <div className="flex gap-2">
              <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded text-[8px] text-white flex items-center justify-center font-bold">VISA</div>
              <div className="w-10 h-6 bg-gradient-to-r from-red-500 to-yellow-500 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-red-600 rounded-full -mr-1"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              </div>
              <div className="w-10 h-6 bg-blue-500 rounded text-[6px] text-white flex items-center justify-center font-bold">AMEX</div>
            </div>
          </div>
          <div className={`flex items-center space-x-3 border p-4 rounded-lg transition-colors ${formData.paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : 'bg-secondary/10'}`}>
            <RadioGroupItem value="paypal" id="paypal" data-testid="radio-paypal" />
            <Label htmlFor="paypal" className="flex-1 cursor-pointer font-medium">PayPal</Label>
            <div className="text-blue-600 font-bold text-sm">Pay<span className="text-blue-800">Pal</span></div>
          </div>
          <div className={`flex items-center space-x-3 border p-4 rounded-lg transition-colors ${formData.paymentMethod === 'applepay' ? 'border-primary bg-primary/5' : 'bg-secondary/10'}`}>
            <RadioGroupItem value="applepay" id="applepay" data-testid="radio-applepay" />
            <Label htmlFor="applepay" className="flex-1 cursor-pointer font-medium">Apple Pay</Label>
            <div className="text-black font-medium text-sm"> Pay</div>
          </div>
          <div className={`flex items-center space-x-3 border p-4 rounded-lg transition-colors ${formData.paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'bg-secondary/10'}`}>
            <RadioGroupItem value="cod" id="cod" data-testid="radio-cod" />
            <Label htmlFor="cod" className="flex-1 cursor-pointer font-medium">Cash on Delivery</Label>
            <div className="w-10 h-6 bg-gradient-to-r from-green-500 to-green-700 rounded text-[7px] text-white flex items-center justify-center font-bold">COD</div>
          </div>
        </RadioGroup>
        
        {formData.paymentMethod === 'card' && (
          <div className="mt-6 space-y-4 p-4 bg-secondary/10 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card *</Label>
              <Input 
                id="cardName" 
                data-testid="input-cardname"
                placeholder="John Doe" 
                value={formData.cardName}
                onChange={(e) => setFormData({...formData, cardName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number *</Label>
              <Input 
                id="cardNumber" 
                data-testid="input-cardnumber"
                placeholder="0000 0000 0000 0000" 
                value={formData.cardNumber}
                onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date *</Label>
                <Input 
                  id="expiry" 
                  data-testid="input-expiry"
                  placeholder="MM/YY" 
                  value={formData.expiry}
                  onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC *</Label>
                <Input 
                  id="cvc" 
                  type="password"
                  data-testid="input-cvc"
                  placeholder="***" 
                  value={formData.cvc}
                  onChange={(e) => setFormData({...formData, cvc: e.target.value})}
                  maxLength={4}
                />
              </div>
            </div>
          </div>
        )}

        {formData.paymentMethod === 'paypal' && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">You will be redirected to PayPal to complete your payment after reviewing your order.</p>
          </div>
        )}

        {formData.paymentMethod === 'applepay' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Apple Pay will be available at the final confirmation step.</p>
          </div>
        )}

        {formData.paymentMethod === 'cod' && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800 font-medium mb-1">Pay when your order arrives</p>
            <p className="text-sm text-green-700">Please have the exact amount ready. Our delivery partner will collect the payment at your doorstep. A valid ID may be required for verification.</p>
          </div>
        )}

        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <span>Your payment information is encrypted and secure</span>
        </div>
        {TrustBadges()}
      </CardContent>
    </Card>
  );

  const ReviewOrderStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Review your order details</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => goToStep(1)} data-testid="button-edit-cart">
            <Edit2 className="h-4 w-4 mr-1" /> Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cartItemsWithProducts.map((item) => {
              const hasVariants = item.variantConfiguration && Object.keys(item.variantConfiguration).length > 0;
              return (
              <div key={`${item.productId}-${item.rentalPeriod}-${JSON.stringify(item.variantConfiguration || {})}`} className="flex gap-2 sm:gap-3 items-center py-2" data-testid={`review-item-${item.productId}`}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-md overflow-hidden border flex-shrink-0">
                  <img src={item.product?.imageUrl || ''} className="w-full h-full object-cover" alt={item.product?.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm sm:text-base truncate">{item.product?.name}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {getRentalPeriodLabel(item.rentalPeriod)} × {item.quantity}
                  </div>
                  {(hasVariants || item.selectedColor) && (
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {item.selectedColor && (
                        <span className="text-xs bg-secondary text-foreground px-1.5 py-0.5 rounded-full border">
                          {item.selectedColor}
                        </span>
                      )}
                      {hasVariants && Object.entries(item.variantConfiguration!).map(([type, label]) => (
                        <span key={type} className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="font-bold text-sm sm:text-base whitespace-nowrap">
                  ${calculateItemPrice(parseFloat(item.product?.pricePerMonth || '0'), item.rentalPeriod, item.quantity, item.variantPriceAdjustment || 0).toFixed(2)}
                </div>
              </div>
            );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Customer Information</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => goToStep(2)} data-testid="button-edit-customer">
              <Edit2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="font-medium">{formData.firstName} {formData.lastName}</p>
            <p className="text-muted-foreground">{formData.email}</p>
            <p className="text-muted-foreground">{formData.phone}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Billing Address</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => goToStep(3)} data-testid="button-edit-billing">
              <Edit2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>{formData.billingAddress}</p>
            <p>{formData.billingCity}, {formData.billingState} {formData.billingZip}</p>
            <p>{formData.billingCountry}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Delivery Address</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => goToStep(3)} data-testid="button-edit-delivery">
              <Edit2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            {formData.sameAsDelivery ? (
              <p className="text-muted-foreground">Same as billing address</p>
            ) : (
              <>
                <p>{formData.deliveryAddress}</p>
                <p>{formData.deliveryCity}, {formData.deliveryState} {formData.deliveryZip}</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Payment Method</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => goToStep(4)} data-testid="button-edit-payment">
              <Edit2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="text-sm">
            {formData.paymentMethod === 'card' && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Card ending in {formData.cardNumber.slice(-4) || '****'}</span>
              </div>
            )}
            {formData.paymentMethod === 'paypal' && <span>PayPal</span>}
            {formData.paymentMethod === 'applepay' && <span>Apple Pay</span>}
            {formData.paymentMethod === 'cod' && (
              <div className="flex items-center gap-2">
                <span className="w-6 h-4 bg-gradient-to-r from-green-500 to-green-700 rounded text-[6px] text-white flex items-center justify-center font-bold">COD</span>
                <span>Cash on Delivery</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          {isPricingLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Calculating final pricing...</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${(serverPricing?.subtotal ?? subtotal).toFixed(2)}</span>
              </div>
              {(serverPricing?.gadgetCareTotal ?? gadgetCareTotal) > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                    GadgetCare+ Protection
                  </span>
                  <span className="text-blue-600 font-medium">+${(serverPricing?.gadgetCareTotal ?? gadgetCareTotal).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax ({serverPricing ? '8%' : '10%'})</span>
                <span>${(serverPricing?.taxEstimate ?? tax).toFixed(2)}</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-xl sm:text-2xl font-bold">
                <span>Total</span>
                <span className="text-primary" data-testid="text-final-total">${(serverPricing?.grandTotal ?? total).toFixed(2)}</span>
              </div>
              {serverPricing && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  <ShieldCheck className="h-3 w-3 inline mr-1" />
                  Server-verified pricing
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-primary/30">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg text-sm">
              <p className="font-semibold text-orange-800 mb-1">Security Deposit Notice</p>
              <p className="text-orange-700">A refundable security deposit (typically 20-35% of equipment value) will be pre-authorized on your payment method. The deposit is released within 14 business days after equipment return, subject to condition inspection.</p>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.termsAgreed}
                onChange={(e) => setFormData({ ...formData, termsAgreed: e.target.checked })}
                className="mt-1 h-4 w-4 accent-primary"
                data-testid="checkbox-terms-agreement"
              />
              <span className="text-sm text-muted-foreground">
                I have read and agree to the{" "}
                <Link href="/terms" className="text-primary underline">Terms and Conditions</Link>,{" "}
                <Link href="/rental-policy" className="text-primary underline">Rental Agreement</Link>,{" "}
                <Link href="/privacy" className="text-primary underline">Privacy Policy</Link>, and{" "}
                <Link href="/return-policy" className="text-primary underline">Return Policy</Link>.
                I acknowledge that:
                <ul className="mt-2 ml-4 list-disc space-y-1">
                  <li>A <Link href="/security-deposit" className="text-primary underline">security deposit</Link> will be held on my payment method</li>
                  <li>I am responsible for the equipment during the rental period</li>
                  <li>I understand the <Link href="/damage-policy" className="text-primary underline">Damage & Loss Policy</Link> and my financial obligations</li>
                  <li>Late returns are subject to additional fees per the rental agreement</li>
                </ul>
              </span>
            </label>
            {!formData.termsAgreed && currentStep === 5 && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" /> You must agree to the terms to place your order
              </p>
            )}
            {TrustBadges()}
          </div>
        </CardContent>
      </Card>

      {!user && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Please sign in to complete your order.</p>
              <Link href="/login">
                <Button data-testid="button-signin-checkout">Sign In</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const OrderSummarySidebar = () => (
    <Card className="sticky top-24">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" /> Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {cartItemsWithProducts.map((item) => {
            const hasVariants = item.variantConfiguration && Object.keys(item.variantConfiguration).length > 0;
            return (
            <div key={`${item.productId}-${item.rentalPeriod}-${JSON.stringify(item.variantConfiguration || {})}`} className="flex gap-2 items-center" data-testid={`summary-item-${item.productId}`}>
              <div className="w-10 h-10 bg-white rounded-md overflow-hidden border flex-shrink-0">
                <img src={item.product?.imageUrl || ''} className="w-full h-full object-cover" alt={item.product?.name} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.product?.name}</p>
                <p className="text-xs text-muted-foreground">{getRentalPeriodLabel(item.rentalPeriod)} × {item.quantity}</p>
                {(hasVariants || item.selectedColor) && (
                  <p className="text-xs text-primary/80 truncate">
                    {[item.selectedColor, ...(hasVariants ? Object.values(item.variantConfiguration!) : [])].filter(Boolean).join(', ')}
                  </p>
                )}
                {item.hasGadgetCare && (
                  <p className="text-xs text-blue-600 flex items-center gap-0.5">
                    <ShieldCheck className="h-2.5 w-2.5" /> GadgetCare+
                  </p>
                )}
              </div>
              <div className="font-medium text-sm whitespace-nowrap">
                ${calculateItemPrice(parseFloat(item.product?.pricePerMonth || '0'), item.rentalPeriod, item.quantity, item.variantPriceAdjustment || 0).toFixed(2)}
              </div>
            </div>
          );
          })}
        </div>
        <Separator />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {gadgetCareTotal > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-blue-500" />
                GadgetCare+
              </span>
              <span className="text-blue-600 font-medium">+${gadgetCareTotal.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary" data-testid="text-sidebar-total">${total.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
          <ShieldCheck className="h-3 w-3 text-green-600" />
          <span>Secure checkout</span>
        </div>
      </CardContent>
    </Card>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return CartReviewStep();
      case 2:
        return CustomerInfoStep();
      case 3:
        return BillingAddressStep();
      case 4:
        return PaymentStep();
      case 5:
        return ReviewOrderStep();
      default:
        return null;
    }
  };

  return (
    <Layout>
      <SeoHead title="Checkout" description="Complete your tech rental order. Secure payment with free delivery." keywords="rental checkout, payment, same day delivery, complete rental order, quick checkout" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/cart">
            <Button variant="ghost" size="sm" data-testid="button-back-to-cart">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Cart
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-heading font-bold">Checkout</h1>
        </div>

        <StepIndicator />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={currentStep === 1 || currentStep === 5 ? "lg:col-span-3" : "lg:col-span-2"}>
            {renderStepContent()}

            <div className="flex justify-between mt-8 gap-4">
              {currentStep > 1 && (
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  className="flex-1 sm:flex-none"
                  data-testid="button-prev-step"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                </Button>
              )}
              {currentStep === 1 && <div />}
              
              {currentStep < 5 ? (
                <Button 
                  onClick={nextStep}
                  className="flex-1 sm:flex-none"
                  data-testid="button-next-step"
                >
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !user || !formData.termsAgreed}
                    className="flex-1 sm:flex-none h-12 px-8 text-lg font-bold shadow-lg shadow-primary/20"
                    data-testid="button-place-order"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Processing...</>
                    ) : (
                      <>
                        <ShieldCheck className="h-5 w-5 mr-2" /> Place Order - ${total.toFixed(2)}
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </div>

            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-green-600" /> Secure Checkout
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="h-4 w-4 text-primary" /> Free Delivery
                </div>
              </div>
            </div>
          </div>
          
          {currentStep !== 1 && currentStep !== 5 && (
            <div className="hidden lg:block">
              {OrderSummarySidebar()}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
