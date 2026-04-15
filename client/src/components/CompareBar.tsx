import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/lib/compare-context";
import { X, Scale, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CompareBar() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <span className="font-medium text-sm">
                Compare ({compareItems.length}/4)
              </span>
            </div>

            <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-1">
              {compareItems.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-2 bg-secondary/50 rounded-full pl-1 pr-2 py-1 shrink-0"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white">
                    <img
                      src={product.imageUrl || ''}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate">
                    {product.name}
                  </span>
                  <button
                    onClick={() => removeFromCompare(product.id)}
                    className="p-0.5 hover:bg-destructive/20 rounded-full transition-colors"
                    data-testid={`compare-bar-remove-${product.id}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCompare}
                data-testid="compare-bar-clear"
              >
                Clear
              </Button>
              <Link href="/compare">
                <Button size="sm" className="gap-1" data-testid="compare-bar-view">
                  Compare <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
