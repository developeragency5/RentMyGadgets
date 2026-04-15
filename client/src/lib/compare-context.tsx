import { createContext, useContext, useState, ReactNode } from "react";
import type { Product } from "@shared/schema";

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  canAddMore: boolean;
  maxItems: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE_ITEMS = 4;

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareItems, setCompareItems] = useState<Product[]>([]);

  const addToCompare = (product: Product) => {
    if (compareItems.length >= MAX_COMPARE_ITEMS) return;
    if (compareItems.some(p => p.id === product.id)) return;
    setCompareItems(prev => [...prev, product]);
  };

  const removeFromCompare = (productId: string) => {
    setCompareItems(prev => prev.filter(p => p.id !== productId));
  };

  const isInCompare = (productId: string) => {
    return compareItems.some(p => p.id === productId);
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  return (
    <CompareContext.Provider value={{
      compareItems,
      addToCompare,
      removeFromCompare,
      isInCompare,
      clearCompare,
      canAddMore: compareItems.length < MAX_COMPARE_ITEMS,
      maxItems: MAX_COMPARE_ITEMS
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
