import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { Product, Cart } from "@shared/schema";
import { type RentalDuration, getPricingForDuration, GADGET_CARE_RATE } from "@/lib/pricing";
import { useAuth } from "@/lib/auth-context";
import { toast } from "@/hooks/use-toast";

export { GADGET_CARE_RATE };

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  rentalPeriod: "day" | "week" | "month" | "year";
  rentalDuration?: RentalDuration;
  rentalMonths?: number;
  variantConfiguration?: Record<string, string>;
  variantPriceAdjustment?: number;
  selectedColor?: string;
  hasGadgetCare?: boolean;
}

interface StoredCartItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    pricePerMonth: string;
    imageUrl: string | null;
    specs: string[] | null;
    brand?: string | null;
  };
  quantity: number;
  rentalPeriod: "day" | "week" | "month" | "year";
  rentalDuration?: RentalDuration;
  rentalMonths?: number;
  variantConfiguration?: Record<string, string>;
  variantPriceAdjustment?: number;
  selectedColor?: string;
  hasGadgetCare?: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, rentalPeriod: "day" | "week" | "month" | "year", quantity?: number, variantConfiguration?: Record<string, string>, variantPriceAdjustment?: number, selectedColor?: string, rentalDuration?: RentalDuration, hasGadgetCare?: boolean) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => boolean;
  updateRentalPeriod: (itemId: string, period: "day" | "week" | "month" | "year") => void;
  updateRentalDuration: (itemId: string, duration: RentalDuration) => void;
  updateGadgetCare: (itemId: string, hasGadgetCare: boolean) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getGadgetCareTotal: () => number;
  cartAnimationTrigger: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "rentmygadgets_cart";

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function parsePrice(pricePerMonth: string | number): number {
  if (typeof pricePerMonth === 'number') return pricePerMonth;
  const parsed = parseFloat(pricePerMonth);
  return isNaN(parsed) ? 0 : parsed;
}

function getPrice(pricePerMonth: string | number, period: "day" | "week" | "month" | "year", variantPriceAdjustment: number = 0): number {
  const monthlyRate = parsePrice(pricePerMonth) + variantPriceAdjustment;
  switch (period) {
    case "day":
      return Math.round(monthlyRate * 0.07 * 100) / 100;
    case "week":
      return Math.round(monthlyRate * 0.35 * 100) / 100;
    case "year":
      return Math.round(monthlyRate * 10 * 100) / 100;
    case "month":
    default:
      return monthlyRate;
  }
}

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(CART_STORAGE_KEY);
  if (!saved) return [];
  
  try {
    const parsed: StoredCartItem[] = JSON.parse(saved);
    return parsed.map(item => ({
      ...item,
      product: {
        ...item.product,
        pricePerMonth: String(item.product.pricePerMonth),
        specs: item.product.specs || [],
        brand: item.product.brand || null,
      } as Product,
      rentalDuration: item.rentalDuration || 'monthly',
      rentalMonths: item.rentalMonths || 1,
      variantConfiguration: item.variantConfiguration || {},
      variantPriceAdjustment: item.variantPriceAdjustment || 0,
      selectedColor: item.selectedColor,
      hasGadgetCare: item.hasGadgetCare || false,
    }));
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]): void {
  const toStore: StoredCartItem[] = items.map(item => ({
    id: item.id,
    productId: item.productId,
    product: {
      id: item.product.id,
      name: item.product.name,
      pricePerMonth: String(item.product.pricePerMonth),
      imageUrl: item.product.imageUrl,
      specs: item.product.specs,
      brand: item.product.brand,
    },
    quantity: item.quantity,
    rentalPeriod: item.rentalPeriod,
    rentalDuration: item.rentalDuration,
    rentalMonths: item.rentalMonths,
    variantConfiguration: item.variantConfiguration,
    variantPriceAdjustment: item.variantPriceAdjustment,
    selectedColor: item.selectedColor,
    hasGadgetCare: item.hasGadgetCare,
  }));
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(toStore));
}

function serverCartToCartItem(serverItem: Cart): CartItem {
  return {
    id: serverItem.id,
    productId: serverItem.productId,
    product: {
      id: serverItem.productId,
      name: serverItem.productName,
      pricePerMonth: String(serverItem.productPricePerMonth),
      imageUrl: serverItem.productImageUrl,
      specs: serverItem.productSpecs || [],
      brand: serverItem.productBrand,
    } as Product,
    quantity: serverItem.quantity || 1,
    rentalPeriod: serverItem.rentalPeriod as "day" | "week" | "month" | "year",
    rentalDuration: (serverItem.rentalDuration || 'monthly') as RentalDuration,
    rentalMonths: serverItem.rentalMonths || 1,
    variantConfiguration: (serverItem.variantConfiguration as Record<string, string>) || {},
    variantPriceAdjustment: parsePrice(serverItem.variantPriceAdjustment || "0"),
    selectedColor: serverItem.selectedColor || undefined,
    hasGadgetCare: serverItem.hasGadgetCare || false,
  };
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());
  const [cartAnimationTrigger, setCartAnimationTrigger] = useState(0);
  const [isServerSynced, setIsServerSynced] = useState(false);

  const loadCartFromServer = useCallback(async () => {
    if (!user) return;
    
    try {
      const res = await fetchWithAuth("/api/cart");
      if (res.ok) {
        const serverItems: Cart[] = await res.json();
        const cartItems = serverItems.map(serverCartToCartItem);
        setItems(cartItems);
        saveCartToStorage(cartItems);
        setIsServerSynced(true);
      }
    } catch (error) {
      console.error("Failed to load cart from server:", error);
    }
  }, [user]);

  const syncLocalCartToServer = useCallback(async (localItems: CartItem[]) => {
    if (!user || localItems.length === 0) return;
    
    try {
      const itemsToSync = localItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        rentalPeriod: item.rentalPeriod,
        rentalDuration: item.rentalDuration || 'monthly',
        rentalMonths: item.rentalMonths || 1,
        variantConfiguration: item.variantConfiguration || {},
        variantPriceAdjustment: item.variantPriceAdjustment || 0,
        selectedColor: item.selectedColor || null,
        hasGadgetCare: item.hasGadgetCare || false,
        productName: item.product.name,
        productPricePerMonth: parsePrice(item.product.pricePerMonth),
        productImageUrl: item.product.imageUrl || null,
        productBrand: item.product.brand || null,
        productSpecs: item.product.specs || null,
      }));

      const res = await fetchWithAuth("/api/cart/sync", {
        method: "POST",
        body: JSON.stringify({ items: itemsToSync }),
      });
      
      if (res.ok) {
        const serverItems: Cart[] = await res.json();
        const cartItems = serverItems.map(serverCartToCartItem);
        setItems(cartItems);
        saveCartToStorage(cartItems);
        setIsServerSynced(true);
      }
    } catch (error) {
      console.error("Failed to sync cart to server:", error);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    
    if (user && !isServerSynced) {
      const localItems = loadCartFromStorage();
      if (localItems.length > 0) {
        syncLocalCartToServer(localItems);
      } else {
        loadCartFromServer();
      }
    } else if (!user) {
      setIsServerSynced(false);
      const localItems = loadCartFromStorage();
      setItems(localItems);
    }
  }, [user, authLoading, isServerSynced, loadCartFromServer, syncLocalCartToServer]);

  useEffect(() => {
    if (!user) {
      saveCartToStorage(items);
    }
  }, [items, user]);

  const addToCart = (product: Product, rentalPeriod: "day" | "week" | "month" | "year", quantity = 1, variantConfiguration?: Record<string, string>, variantPriceAdjustment: number = 0, selectedColor?: string, rentalDuration?: RentalDuration, hasGadgetCare?: boolean): { success: boolean; message?: string } => {
    let result = { success: true, message: undefined as string | undefined };
    
    const configKey = variantConfiguration ? JSON.stringify(variantConfiguration) : '';
    const effectiveDuration = rentalDuration || 'monthly';
    
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && 
                  (item.rentalDuration || 'monthly') === effectiveDuration && 
                  JSON.stringify(item.variantConfiguration || {}) === (configKey || '{}') &&
                  item.selectedColor === selectedColor &&
                  item.hasGadgetCare === hasGadgetCare
      );

      if (existing) {
        const newQuantity = existing.quantity + quantity;
        const oldQuantity = existing.quantity;
        const cappedNewQuantity = Math.min(newQuantity, 5);
        
        if (newQuantity > 5) {
          result = { success: false, message: "Maximum 5 units allowed per product" };
        }
        
        if (user) {
          fetchWithAuth(`/api/cart/${existing.id}`, {
            method: "PUT",
            body: JSON.stringify({ quantity: cappedNewQuantity }),
          }).then(async (res) => {
            if (res.ok) {
              const serverItem: Cart = await res.json();
              const syncedItem = serverCartToCartItem(serverItem);
              setItems(prevItems => 
                prevItems.map(item => 
                  item.id === existing.id ? syncedItem : item
                )
              );
            } else {
              setItems(prevItems => 
                prevItems.map(item => 
                  item.id === existing.id ? { ...item, quantity: oldQuantity } : item
                )
              );
              toast({
                title: "Failed to update cart",
                description: "Could not update quantity. Please try again.",
                variant: "destructive",
              });
            }
          }).catch((error) => {
            console.error("Failed to update cart:", error);
            setItems(prevItems => 
              prevItems.map(item => 
                item.id === existing.id ? { ...item, quantity: oldQuantity } : item
              )
            );
            toast({
              title: "Failed to update cart",
              description: "Could not update quantity. Please try again.",
              variant: "destructive",
            });
          });
        }
        
        return prev.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: cappedNewQuantity }
            : item
        );
      }

      const cappedQuantity = Math.min(quantity, 5);
      if (quantity > 5) {
        result = { success: false, message: "Maximum 5 units allowed per product" };
      }

      const pricing = getPricingForDuration(parsePrice(product.pricePerMonth) + variantPriceAdjustment, effectiveDuration);
      const newId = generateId();

      const newItem: CartItem = {
        id: newId,
        productId: product.id,
        product: {
          ...product,
          pricePerMonth: String(product.pricePerMonth),
        },
        quantity: cappedQuantity,
        rentalPeriod,
        rentalDuration: effectiveDuration,
        rentalMonths: pricing?.months || 1,
        variantConfiguration: variantConfiguration || {},
        variantPriceAdjustment: variantPriceAdjustment,
        selectedColor: selectedColor,
        hasGadgetCare: hasGadgetCare || false,
      };

      if (user) {
        fetchWithAuth("/api/cart", {
          method: "POST",
          body: JSON.stringify({
            productId: product.id,
            quantity: cappedQuantity,
            rentalPeriod,
            rentalDuration: effectiveDuration,
            rentalMonths: pricing?.months || 1,
            variantConfiguration: variantConfiguration || {},
            variantPriceAdjustment: variantPriceAdjustment || 0,
            selectedColor: selectedColor || null,
            hasGadgetCare: hasGadgetCare || false,
            productName: product.name,
            productPricePerMonth: parsePrice(product.pricePerMonth),
            productImageUrl: product.imageUrl || null,
            productBrand: product.brand || null,
            productSpecs: product.specs || null,
          }),
        }).then(async (res) => {
          if (res.ok) {
            const serverItem: Cart = await res.json();
            const syncedItem = serverCartToCartItem(serverItem);
            setItems(prevItems => 
              prevItems.map(item => 
                item.id === newId ? syncedItem : item
              )
            );
          } else {
            setItems(prevItems => prevItems.filter(item => item.id !== newId));
            toast({
              title: "Failed to add item",
              description: "Could not add item to cart. Please try again.",
              variant: "destructive",
            });
          }
        }).catch((error) => {
          console.error("Failed to add to cart:", error);
          setItems(prevItems => prevItems.filter(item => item.id !== newId));
          toast({
            title: "Failed to add item",
            description: "Could not add item to cart. Please try again.",
            variant: "destructive",
          });
        });
      }

      return [...prev, newItem];
    });
    
    setCartAnimationTrigger(prev => prev + 1);
    
    return result;
  };

  const removeFromCart = (itemId: string) => {
    const removedItem = items.find(item => item.id === itemId);
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    
    if (user) {
      fetchWithAuth(`/api/cart/${itemId}`, { method: "DELETE" }).then(res => {
        if (!res.ok) {
          if (removedItem) {
            setItems(prevItems => [...prevItems, removedItem]);
          }
          toast({
            title: "Failed to remove item",
            description: "Could not remove item from cart. Please try again.",
            variant: "destructive",
          });
        }
      }).catch((error) => {
        console.error("Failed to remove from cart:", error);
        if (removedItem) {
          setItems(prevItems => [...prevItems, removedItem]);
        }
        toast({
          title: "Failed to remove item",
          description: "Could not remove item from cart. Please try again.",
          variant: "destructive",
        });
      });
    }
  };

  const updateQuantity = (itemId: string, quantity: number): boolean => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return true;
    }
    if (quantity > 5) {
      return false;
    }
    
    const oldItem = items.find(item => item.id === itemId);
    const oldQuantity = oldItem?.quantity;
    
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
    
    if (user) {
      fetchWithAuth(`/api/cart/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      }).then(async (res) => {
        if (res.ok) {
          const serverItem: Cart = await res.json();
          const syncedItem = serverCartToCartItem(serverItem);
          setItems(prevItems => 
            prevItems.map(item => 
              item.id === itemId ? syncedItem : item
            )
          );
        } else {
          setItems(prevItems => 
            prevItems.map(item => 
              item.id === itemId ? { ...item, quantity: oldQuantity ?? item.quantity } : item
            )
          );
          toast({
            title: "Failed to update cart",
            description: "Could not update quantity. Please try again.",
            variant: "destructive",
          });
        }
      }).catch((error) => {
        console.error("Failed to update quantity:", error);
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === itemId ? { ...item, quantity: oldQuantity ?? item.quantity } : item
          )
        );
        toast({
          title: "Failed to update cart",
          description: "Could not update quantity. Please try again.",
          variant: "destructive",
        });
      });
    }
    
    return true;
  };

  const updateRentalPeriod = (itemId: string, period: "day" | "week" | "month" | "year") => {
    const oldItem = items.find(item => item.id === itemId);
    const oldPeriod = oldItem?.rentalPeriod;
    
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, rentalPeriod: period } : item))
    );
    
    if (user) {
      fetchWithAuth(`/api/cart/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({ rentalPeriod: period }),
      }).then(async (res) => {
        if (res.ok) {
          const serverItem: Cart = await res.json();
          const syncedItem = serverCartToCartItem(serverItem);
          setItems(prevItems => 
            prevItems.map(item => 
              item.id === itemId ? syncedItem : item
            )
          );
        } else {
          setItems(prevItems => 
            prevItems.map(item => 
              item.id === itemId ? { ...item, rentalPeriod: oldPeriod ?? item.rentalPeriod } : item
            )
          );
          toast({
            title: "Failed to update cart",
            description: "Could not update rental period. Please try again.",
            variant: "destructive",
          });
        }
      }).catch((error) => {
        console.error("Failed to update rental period:", error);
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === itemId ? { ...item, rentalPeriod: oldPeriod ?? item.rentalPeriod } : item
          )
        );
        toast({
          title: "Failed to update cart",
          description: "Could not update rental period. Please try again.",
          variant: "destructive",
        });
      });
    }
  };

  const updateRentalDuration = (itemId: string, duration: RentalDuration) => {
    const oldItem = items.find(item => item.id === itemId);
    const oldDuration = oldItem?.rentalDuration;
    const oldRentalMonths = oldItem?.rentalMonths;
    
    const targetItem = items.find(item => item.id === itemId);
    const pricing = targetItem ? getPricingForDuration(
      parsePrice(targetItem.product.pricePerMonth) + (targetItem.variantPriceAdjustment || 0), 
      duration
    ) : null;
    
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        return { 
          ...item, 
          rentalDuration: duration,
          rentalMonths: pricing?.months || 1
        };
      })
    );
    
    if (user) {
      fetchWithAuth(`/api/cart/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({ rentalDuration: duration, rentalMonths: pricing?.months || 1 }),
      }).then(async (res) => {
        if (res.ok) {
          const serverItem: Cart = await res.json();
          const syncedItem = serverCartToCartItem(serverItem);
          setItems(prevItems => 
            prevItems.map(item => 
              item.id === itemId ? syncedItem : item
            )
          );
        } else {
          setItems(prevItems => 
            prevItems.map(item => 
              item.id === itemId ? { ...item, rentalDuration: oldDuration, rentalMonths: oldRentalMonths } : item
            )
          );
          toast({
            title: "Failed to update cart",
            description: "Could not update rental duration. Please try again.",
            variant: "destructive",
          });
        }
      }).catch((error) => {
        console.error("Failed to update rental duration:", error);
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === itemId ? { ...item, rentalDuration: oldDuration, rentalMonths: oldRentalMonths } : item
          )
        );
        toast({
          title: "Failed to update cart",
          description: "Could not update rental duration. Please try again.",
          variant: "destructive",
        });
      });
    }
  };

  const updateGadgetCare = (itemId: string, hasGadgetCare: boolean) => {
    const oldItem = items.find(item => item.id === itemId);
    const oldGadgetCare = oldItem?.hasGadgetCare;
    
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, hasGadgetCare } : item))
    );
    
    if (user) {
      fetchWithAuth(`/api/cart/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({ hasGadgetCare }),
      }).then(async (res) => {
        if (res.ok) {
          const serverItem: Cart = await res.json();
          const syncedItem = serverCartToCartItem(serverItem);
          setItems(prevItems => 
            prevItems.map(item => 
              item.id === itemId ? syncedItem : item
            )
          );
        } else {
          setItems(prevItems => 
            prevItems.map(item => 
              item.id === itemId ? { ...item, hasGadgetCare: oldGadgetCare } : item
            )
          );
          toast({
            title: "Failed to update cart",
            description: "Could not update GadgetCare. Please try again.",
            variant: "destructive",
          });
        }
      }).catch((error) => {
        console.error("Failed to update GadgetCare:", error);
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === itemId ? { ...item, hasGadgetCare: oldGadgetCare } : item
          )
        );
        toast({
          title: "Failed to update cart",
          description: "Could not update GadgetCare. Please try again.",
          variant: "destructive",
        });
      });
    }
  };

  const clearCart = () => {
    if (user) {
      fetchWithAuth("/api/cart", { method: "DELETE" }).catch(console.error);
    }
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getSubtotal = () => {
    return items.reduce((sum, item) => {
      const basePrice = parsePrice(item.product.pricePerMonth) + (item.variantPriceAdjustment || 0);
      
      if (item.rentalDuration) {
        const pricing = getPricingForDuration(basePrice, item.rentalDuration);
        const totalForItem = pricing ? pricing.totalPrice * item.quantity : basePrice * item.quantity;
        return sum + totalForItem;
      }
      
      const legacyPrice = getPrice(item.product.pricePerMonth, item.rentalPeriod, item.variantPriceAdjustment || 0);
      return sum + legacyPrice * item.quantity;
    }, 0);
  };

  const getGadgetCareTotal = () => {
    return items.reduce((sum, item) => {
      if (!item.hasGadgetCare) return sum;
      
      const basePrice = parsePrice(item.product.pricePerMonth) + (item.variantPriceAdjustment || 0);
      
      if (item.rentalDuration) {
        const pricing = getPricingForDuration(basePrice, item.rentalDuration);
        const rentalTotal = pricing ? pricing.totalPrice : basePrice;
        return sum + (rentalTotal * GADGET_CARE_RATE * item.quantity);
      }
      
      const legacyPrice = getPrice(item.product.pricePerMonth, item.rentalPeriod, item.variantPriceAdjustment || 0);
      return sum + (legacyPrice * GADGET_CARE_RATE * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateRentalPeriod,
        updateRentalDuration,
        updateGadgetCare,
        clearCart,
        getItemCount,
        getSubtotal,
        getGadgetCareTotal,
        cartAnimationTrigger,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export { getPrice };
