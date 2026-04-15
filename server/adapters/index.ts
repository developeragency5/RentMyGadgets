import { BrandAdapter, AdapterResult } from './types';
import { appleAdapter } from './apple';
import { asusAdapter } from './asus';
import { boseAdapter } from './bose';
import { canonAdapter } from './canon';
import { dellAdapter } from './dell';
import { epsonAdapter } from './epson';
import { fujifilmAdapter } from './fujifilm';
import { hpAdapter } from './hp';
import { lenovoAdapter } from './lenovo';
import { microsoftAdapter } from './microsoft';
import { netgearAdapter } from './netgear';
import { nikonAdapter } from './nikon';
import { samsungAdapter } from './samsung';
import { sonyAdapter } from './sony';

const adapters: BrandAdapter[] = [
  appleAdapter,
  asusAdapter,
  boseAdapter,
  canonAdapter,
  dellAdapter,
  epsonAdapter,
  fujifilmAdapter,
  hpAdapter,
  lenovoAdapter,
  microsoftAdapter,
  netgearAdapter,
  nikonAdapter,
  samsungAdapter,
  sonyAdapter,
];

export function getAdapterForProduct(productName: string, brand?: string): BrandAdapter | null {
  for (const adapter of adapters) {
    if (adapter.canHandle(productName, brand)) {
      return adapter;
    }
  }
  return null;
}

export function getAdapterByBrand(brand: string): BrandAdapter | null {
  const brandLower = brand.toLowerCase();
  for (const adapter of adapters) {
    if (adapter.brand.toLowerCase() === brandLower) {
      return adapter;
    }
  }
  return null;
}

export function getSupportedBrands(): string[] {
  return adapters.map(a => a.brand);
}

export async function findProductData(
  productName: string, 
  brand?: string,
  sku?: string
): Promise<AdapterResult | null> {
  const adapter = getAdapterForProduct(productName, brand);
  if (!adapter) {
    return null;
  }
  
  return adapter.findProduct(productName, sku);
}

export type { BrandAdapter, AdapterResult, ProductData } from './types';
export { appleAdapter } from './apple';
export { asusAdapter } from './asus';
export { boseAdapter } from './bose';
export { canonAdapter } from './canon';
export { dellAdapter } from './dell';
export { epsonAdapter } from './epson';
export { fujifilmAdapter } from './fujifilm';
export { hpAdapter } from './hp';
export { lenovoAdapter } from './lenovo';
export { microsoftAdapter } from './microsoft';
export { netgearAdapter } from './netgear';
export { nikonAdapter } from './nikon';
export { samsungAdapter } from './samsung';
export { sonyAdapter } from './sony';
