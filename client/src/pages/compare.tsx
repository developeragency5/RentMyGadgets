import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCompare } from "@/lib/compare-context";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { X, ShoppingCart, ArrowLeft, Scale } from "lucide-react";
import type { Product } from "@shared/schema";

export default function Compare() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    addToCart(product, "day");
    toast({
      title: "Added to Cart",
      description: `${product.name} added for 1 day.`,
    });
  };

  const allSpecs = Array.from(
    new Set(compareItems.flatMap(p => p.specs || []))
  );

  const specCategories = [
    { label: "Price per Month", getValue: (p: Product) => `$${p.pricePerMonth}` },
    { label: "Availability", getValue: (p: Product) => p.available ? "Available" : "Not Available" },
    { label: "Featured", getValue: (p: Product) => p.featured ? "Yes" : "No" },
  ];

  if (compareItems.length === 0) {
    return (
      <Layout>
        <SeoHead title="Compare Products" description="Compare tech gadgets side by side. Find the perfect device by comparing features, prices, and specifications." keywords="compare Dell vs HP rental, laptop comparison, compare Samsung vs Google Pixel, tech specs comparison, side by side rental comparison, compare cameras, brand vs brand rental" />
        <div className="container mx-auto px-4 py-20 text-center">
          <Scale className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-3xl font-heading font-bold mb-4">No Products to Compare</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Select products from our catalog to compare their features and specifications side by side.
          </p>
          <Link href="/categories">
            <Button size="lg" data-testid="button-browse-products">
              Browse Products
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SeoHead title="Compare Products" description="Compare tech gadgets side by side. Find the perfect device by comparing features, prices, and specifications." keywords="compare Dell vs HP rental, laptop comparison, compare Samsung vs Google Pixel, tech specs comparison, side by side rental comparison, compare cameras, brand vs brand rental" />
      <div className="bg-secondary/30 py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/categories">
                <Button variant="ghost" size="sm" className="mb-2">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Categories
                </Button>
              </Link>
              <h1 className="text-3xl md:text-4xl font-heading font-bold">Compare Products</h1>
              <p className="text-muted-foreground mt-2">
                Comparing {compareItems.length} product{compareItems.length > 1 ? 's' : ''}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={clearCompare}
              data-testid="button-clear-compare"
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left p-4 bg-secondary/30 rounded-tl-xl w-48 sticky left-0 z-10">
                  <span className="font-bold text-lg">Feature</span>
                </th>
                {compareItems.map((product) => (
                  <th key={product.id} className="p-4 bg-secondary/30 min-w-[200px]">
                    <Card className="border-0 shadow-none bg-transparent">
                      <CardContent className="p-0">
                        <div className="relative">
                          <button
                            onClick={() => removeFromCompare(product.id)}
                            className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/80 z-10"
                            data-testid={`button-remove-${product.id}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <Link href={`/product/${product.slug || product.id}`}>
                            <div className="aspect-square w-32 mx-auto mb-3 rounded-lg overflow-hidden bg-white cursor-pointer">
                              <img 
                                src={product.imageUrl || ''} 
                                alt={`${product.name} rental comparison view`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                              />
                            </div>
                          </Link>
                          <Link href={`/product/${product.slug || product.id}`}>
                            <h3 className="font-bold text-center hover:text-primary transition-colors cursor-pointer" data-testid={`text-product-name-${product.id}`}>
                              {product.name}
                            </h3>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </th>
                ))}
                {compareItems.length < 4 && (
                  <th className="p-4 bg-secondary/30 rounded-tr-xl min-w-[200px]">
                    <Link href="/categories">
                      <div className="aspect-square w-32 mx-auto mb-3 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                        <span className="text-muted-foreground text-sm text-center px-2">
                          + Add Product
                        </span>
                      </div>
                    </Link>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {specCategories.map((spec, index) => (
                <tr key={spec.label} className={index % 2 === 0 ? 'bg-secondary/10' : ''}>
                  <td className="p-4 font-medium sticky left-0 bg-inherit z-10">
                    {spec.label}
                  </td>
                  {compareItems.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <span className={spec.label === "Price per Day" ? "text-lg font-bold text-primary" : ""}>
                        {spec.getValue(product)}
                      </span>
                    </td>
                  ))}
                  {compareItems.length < 4 && <td className="p-4"></td>}
                </tr>
              ))}
              
              <tr className="bg-secondary/10">
                <td className="p-4 font-medium sticky left-0 bg-inherit z-10">Specifications</td>
                {compareItems.map((product) => (
                  <td key={product.id} className="p-4 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {product.specs?.map((spec) => (
                        <span key={spec} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {spec}
                        </span>
                      )) || <span className="text-muted-foreground">-</span>}
                    </div>
                  </td>
                ))}
                {compareItems.length < 4 && <td className="p-4"></td>}
              </tr>

              <tr>
                <td className="p-4 font-medium sticky left-0 bg-inherit z-10">Description</td>
                {compareItems.map((product) => (
                  <td key={product.id} className="p-4 text-center">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {product.description || '-'}
                    </p>
                  </td>
                ))}
                {compareItems.length < 4 && <td className="p-4"></td>}
              </tr>

              <tr className="bg-secondary/10">
                <td className="p-4 font-medium sticky left-0 bg-inherit z-10">Action</td>
                {compareItems.map((product) => (
                  <td key={product.id} className="p-4 text-center">
                    <Button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full max-w-[150px]"
                      data-testid={`button-add-cart-${product.id}`}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </td>
                ))}
                {compareItems.length < 4 && <td className="p-4"></td>}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
