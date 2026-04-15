import { RENTAL_DURATIONS as _RENTAL_DURATIONS } from "@shared/pricing";

export {
  type RentalDuration,
  type RentalPricing,
  RENTAL_DURATIONS,
  GADGET_CARE_RATE,
  TAX_RATE,
  calculateRentalPricing,
  getPricingForDuration,
  calculateItemPrice,
  calculateGadgetCare,
  calculateCartPricing,
  type CartItemPricing,
  type CartPricingResult,
} from "@shared/pricing";

export function formatPrice(price: number): string {
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function getDurationLabel(duration: string): string {
  const tier = _RENTAL_DURATIONS.find((t) => t.duration === duration);
  return tier?.label || duration;
}
