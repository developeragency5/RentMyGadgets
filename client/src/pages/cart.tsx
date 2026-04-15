import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Calendar as CalendarIcon, ArrowRight, Plus, Minus, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import { Link } from "wouter";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, addWeeks, addMonths } from "date-fns";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useCart, getPrice, type CartItem, GADGET_CARE_RATE } from "@/lib/cart-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductImage } from "@/components/product-image";
import { toast } from "sonner";
import { getDurationLabel, getPricingForDuration, RENTAL_DURATIONS } from "@/lib/pricing";
import { motion } from "framer-motion";

function getItemTotalPrice(item: CartItem): number {
  const basePrice = parseFloat(String(item.product.pricePerMonth)) + (item.variantPriceAdjustment || 0);
  
  if (item.rentalDuration) {
    const pricing = getPricingForDuration(basePrice, item.rentalDuration);
    return pricing ? pricing.totalPrice * item.quantity : basePrice * item.quantity;
  }
  
  return getPrice(item.product.pricePerMonth, item.rentalPeriod, item.variantPriceAdjustment || 0) * item.quantity;
}

function getItemRentalLabel(item: CartItem): string {
  if (item.rentalDuration) {
    return getDurationLabel(item.rentalDuration);
  }
  return item.rentalPeriod === 'day' ? 'Daily' : item.rentalPeriod === 'week' ? 'Weekly' : item.rentalPeriod === 'year' ? 'Yearly' : 'Monthly';
}

function getItemRentalMonths(item: CartItem): number {
  if (item.rentalMonths) {
    return item.rentalMonths;
  }
  if (item.rentalDuration) {
    const tier = RENTAL_DURATIONS.find(t => t.duration === item.rentalDuration);
    return tier?.months || 1;
  }
  return item.rentalPeriod === 'year' ? 12 : item.rentalPeriod === 'month' ? 1 : 1;
}

export default function Cart() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { items, removeFromCart, updateQuantity, updateRentalPeriod, updateGadgetCare, getSubtotal, getGadgetCareTotal } = useCart();

  const subtotal = getSubtotal();
  const gadgetCareTotal = getGadgetCareTotal();
  const subtotalWithCare = subtotal + gadgetCareTotal;
  const tax = subtotalWithCare * 0.1;
  const total = subtotalWithCare + tax;

  const rentalEndDate = useMemo(() => {
    if (!date || items.length === 0) return null;
    
    const longestMonths = items.reduce((longest, item) => {
      const itemMonths = getItemRentalMonths(item);
      return Math.max(longest, itemMonths);
    }, 1);

    return addMonths(date, longestMonths);
  }, [date, items]);

  if (items.length === 0) {
    return (
      <Layout>
        <SeoHead title="Your Cart" description="Review your tech rental cart. Select rental periods and checkout for fast delivery." keywords="rental cart, tech rental order, fast checkout, same day rental delivery, secure rental checkout, instant booking, equipment rental cart, quick checkout" />
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-3xl font-heading font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added any gadgets yet.</p>
          <Link href="/categories">
            <Button size="lg" className="rounded-full" data-testid="button-browse-products">
              Browse Products
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SeoHead title="Your Cart" description="Review your tech rental cart. Select rental periods and checkout for fast delivery." keywords="rental cart, tech rental order, fast checkout, same day rental delivery, secure rental checkout, instant booking, equipment rental cart, quick checkout" />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-heading font-bold mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => {
              const itemTotalPrice = getItemTotalPrice(item);
              const rentalLabel = getItemRentalLabel(item);
              return (
                <div key={item.id} className="flex gap-4 p-4 bg-card border rounded-xl shadow-sm" data-testid={`cart-item-${item.id}`}>
                  <div className="w-24 h-24 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                    <ProductImage src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg" data-testid={`text-item-name-${item.id}`}>{item.product.name}</h3>
                        {(item.selectedColor || (item.variantConfiguration && Object.keys(item.variantConfiguration).length > 0) || item.hasGadgetCare) && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.selectedColor && (
                              <span className="text-xs bg-secondary text-foreground px-2 py-0.5 rounded-full border">
                                {item.selectedColor}
                              </span>
                            )}
                            {item.variantConfiguration && Object.entries(item.variantConfiguration).map(([type, label]) => (
                              <span key={type} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {label}
                              </span>
                            ))}
                            {item.hasGadgetCare && (
                              <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full flex items-center gap-1" data-testid={`badge-gadgetcare-${item.id}`}>
                                <ShieldCheck className="h-3 w-3" />
                                GadgetCare+
                              </span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">Rental:</span>
                          {item.rentalDuration ? (
                            <span className="text-sm font-medium text-primary" data-testid={`text-rental-term-${item.id}`}>
                              {rentalLabel}
                            </span>
                          ) : (
                            <Select 
                              value={item.rentalPeriod} 
                              onValueChange={(value: "day" | "week" | "month") => updateRentalPeriod(item.id, value)}
                            >
                              <SelectTrigger className="h-7 w-24 text-xs" data-testid={`select-period-${item.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="day">Daily</SelectItem>
                                <SelectItem value="week">Weekly</SelectItem>
                                <SelectItem value="month">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeFromCart(item.id)}
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                       <div className="flex items-center gap-2">
                         <Button 
                           variant="outline" 
                           size="icon" 
                           className="h-8 w-8"
                           onClick={() => updateQuantity(item.id, item.quantity - 1)}
                           data-testid={`button-decrease-${item.id}`}
                         >
                           <Minus className="h-3 w-3" />
                         </Button>
                         <span className="w-8 text-center font-medium" data-testid={`text-quantity-${item.id}`}>{item.quantity}</span>
                         <Button 
                           variant="outline" 
                           size="icon" 
                           className="h-8 w-8"
                           disabled={item.quantity >= 5}
                           onClick={() => {
                             const success = updateQuantity(item.id, item.quantity + 1);
                             if (!success) {
                               toast.error("Maximum 5 units allowed per product");
                             }
                           }}
                           data-testid={`button-increase-${item.id}`}
                         >
                           <Plus className="h-3 w-3" />
                         </Button>
                       </div>
                       <div className="font-bold text-lg" data-testid={`text-item-price-${item.id}`}>
                         ${itemTotalPrice.toFixed(2)}
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="bg-secondary/20 p-6 rounded-xl border border-border/50">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Rental Period
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Start Date</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                        data-testid="button-select-date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">End Date (Renewal Due)</p>
                  <div className="h-10 px-4 py-2 border rounded-md bg-muted/50 flex items-center" data-testid="text-end-date">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {rentalEndDate ? format(rentalEndDate, "PPP") : "Select start date"}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Standard delivery time: 24 hours • Renew or return by the end date to avoid late fees
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => {
                    const summaryPrice = getItemTotalPrice(item);
                    const summaryRentalLabel = getItemRentalLabel(item);
                    return (
                      <div key={item.id} className="flex gap-3 pb-3 border-b border-border/50" data-testid={`summary-item-${item.id}`}>
                        <div className="w-12 h-12 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                          <ProductImage src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate" data-testid={`summary-name-${item.id}`}>{item.product.name}</p>
                          <p className="text-xs text-muted-foreground" data-testid={`summary-rental-${item.id}`}>
                            {summaryRentalLabel} × {item.quantity}
                          </p>
                          {(item.selectedColor || (item.variantConfiguration && Object.keys(item.variantConfiguration).length > 0)) && (
                            <p className="text-xs text-primary/80 truncate">
                              {[item.selectedColor, ...(item.variantConfiguration ? Object.values(item.variantConfiguration) : [])].filter(Boolean).join(', ')}
                            </p>
                          )}
                          {item.hasGadgetCare && (
                            <p className="text-xs text-blue-600 flex items-center gap-1 mt-0.5">
                              <ShieldCheck className="h-3 w-3" /> GadgetCare+
                            </p>
                          )}
                        </div>
                        <div className="font-semibold text-sm whitespace-nowrap" data-testid={`summary-cost-${item.id}`}>
                          ${summaryPrice.toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                  <span data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                </div>
                {gadgetCareTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                      GadgetCare+ Protection
                    </span>
                    <span className="text-blue-600 font-medium" data-testid="text-gadgetcare-total">+${gadgetCareTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span data-testid="text-tax">${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span data-testid="text-total">${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Link href="/checkout" className="w-full">
                  <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
                    <Button className="w-full h-12 text-base font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all" data-testid="button-checkout">
                      Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </Link>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground w-full">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-green-600" /> Secure Checkout
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5 text-primary" /> Free Delivery
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
