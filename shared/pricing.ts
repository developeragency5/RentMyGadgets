export type RentalDuration = 'daily' | 'weekly' | 'monthly' | '3months' | '6months' | '12months';

export interface RentalPricing {
  duration: RentalDuration;
  label: string;
  shortLabel: string;
  months: number;
  discountPercent: number;
  savingsPercent: number;
  pricePerMonth: number;
  monthlyRate: number;
  totalPrice: number;
  savings: number;
}

export const RENTAL_DURATIONS: { duration: RentalDuration; label: string; shortLabel: string; months: number; discountPercent: number }[] = [
  { duration: 'monthly', label: '1 Month', shortLabel: '1 mo', months: 1, discountPercent: 0 },
  { duration: '3months', label: '3 Months', shortLabel: '3 mo', months: 3, discountPercent: 10 },
  { duration: '6months', label: '6 Months', shortLabel: '6 mo', months: 6, discountPercent: 20 },
  { duration: '12months', label: '12 Months', shortLabel: '12 mo', months: 12, discountPercent: 30 },
];

export const GADGET_CARE_RATE = 0.15;
export const TAX_RATE = 0.08;

export function calculateRentalPricing(baseMonthlyPrice: number): RentalPricing[] {
  return RENTAL_DURATIONS.map(tier => {
    const discountMultiplier = 1 - (tier.discountPercent / 100);
    const pricePerMonth = Math.round(baseMonthlyPrice * discountMultiplier * 100) / 100;
    const totalPrice = Math.round(pricePerMonth * tier.months * 100) / 100;
    const originalTotal = baseMonthlyPrice * tier.months;
    const savings = Math.round((originalTotal - totalPrice) * 100) / 100;
    
    return {
      duration: tier.duration,
      label: tier.label,
      shortLabel: tier.shortLabel,
      months: tier.months,
      discountPercent: tier.discountPercent,
      savingsPercent: tier.discountPercent,
      pricePerMonth,
      monthlyRate: pricePerMonth,
      totalPrice,
      savings,
    };
  });
}

export function getPricingForDuration(baseMonthlyPrice: number, duration: RentalDuration): RentalPricing | undefined {
  const allPricing = calculateRentalPricing(baseMonthlyPrice);
  return allPricing.find(p => p.duration === duration);
}

export function calculateItemPrice(
  pricePerMonth: number,
  rentalPeriod: 'day' | 'week' | 'month' | 'year',
  quantity: number,
  variantPriceAdjustment: number = 0
): number {
  const adjustedPrice = pricePerMonth + variantPriceAdjustment;
  let price = adjustedPrice;
  if (rentalPeriod === 'day') price = adjustedPrice * 0.07;
  if (rentalPeriod === 'week') price = adjustedPrice * 0.35;
  if (rentalPeriod === 'year') price = adjustedPrice * 10;
  return Math.round(price * quantity * 100) / 100;
}

export function calculateGadgetCare(rentalCost: number): number {
  return Math.round(rentalCost * GADGET_CARE_RATE * 100) / 100;
}

export interface CartItemPricing {
  itemId: string;
  productId: string;
  productName: string;
  quantity: number;
  rentalPeriod: string;
  basePrice: number;
  variantAdjustment: number;
  itemSubtotal: number;
  gadgetCareCost: number;
  hasGadgetCare: boolean;
  itemTotal: number;
}

export interface CartPricingResult {
  lineItems: CartItemPricing[];
  subtotal: number;
  gadgetCareTotal: number;
  taxableAmount: number;
  taxEstimate: number;
  grandTotal: number;
  taxRate: number;
  gadgetCareRate: number;
}

export function calculateCartPricing(items: Array<{
  id: string;
  productId: string;
  productName: string;
  pricePerMonth: number;
  quantity: number;
  rentalPeriod: 'day' | 'week' | 'month' | 'year';
  variantPriceAdjustment?: number;
  hasGadgetCare?: boolean;
}>): CartPricingResult {
  const lineItems: CartItemPricing[] = items.map(item => {
    const itemSubtotal = calculateItemPrice(
      item.pricePerMonth,
      item.rentalPeriod,
      item.quantity,
      item.variantPriceAdjustment || 0
    );
    const gadgetCareCost = item.hasGadgetCare ? calculateGadgetCare(itemSubtotal) : 0;
    
    return {
      itemId: item.id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      rentalPeriod: item.rentalPeriod,
      basePrice: item.pricePerMonth,
      variantAdjustment: item.variantPriceAdjustment || 0,
      itemSubtotal,
      gadgetCareCost,
      hasGadgetCare: item.hasGadgetCare || false,
      itemTotal: Math.round((itemSubtotal + gadgetCareCost) * 100) / 100,
    };
  });

  const subtotal = Math.round(lineItems.reduce((sum, item) => sum + item.itemSubtotal, 0) * 100) / 100;
  const gadgetCareTotal = Math.round(lineItems.reduce((sum, item) => sum + item.gadgetCareCost, 0) * 100) / 100;
  const taxableAmount = Math.round((subtotal + gadgetCareTotal) * 100) / 100;
  const taxEstimate = Math.round(taxableAmount * TAX_RATE * 100) / 100;
  const grandTotal = Math.round((taxableAmount + taxEstimate) * 100) / 100;

  return {
    lineItems,
    subtotal,
    gadgetCareTotal,
    taxableAmount,
    taxRate: TAX_RATE,
    gadgetCareRate: GADGET_CARE_RATE,
    taxEstimate,
    grandTotal,
  };
}
