import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import StructuredData from "@/components/StructuredData";
import { Link } from "wouter";
import { ArrowRight, Laptop, Monitor, Printer, Wifi, Headphones, Camera, Loader2, Smartphone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api";

const categoryIcons: Record<string, typeof Laptop> = {
  "Laptops": Laptop,
  "Desktops / PCs": Monitor,
  "Desktops & Laptops": Monitor,
  "Phones": Smartphone,
  "Printers & Scanners": Printer,
  "Routers": Wifi,
  "Headphones & Accessories": Headphones,
  "Headphones": Headphones,
  "Cameras & Gear": Camera,
};

const categoryOrder: Record<string, number> = {
  "Desktops & Laptops": 1,
  "Phones": 2,
  "Printers & Scanners": 3,
  "Headphones": 4,
  "Cameras & Gear": 5,
  "Routers": 6,
};

export default function Categories() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  return (
    <Layout>
      <StructuredData type="collectionPage" name="All Rental Categories" description="Browse technology rental categories including laptops, desktops, cameras, audio equipment, and accessories." url="https://rentmygadgets.com/categories" />
      <SeoHead 
        title="Browse Categories"
        description="Explore our wide range of tech gadgets available for rent - laptops, desktops, cameras, printers, headphones, and routers. Find the perfect device for your needs."
        keywords="gadget categories, laptop rental category, camera rental, desktop hire, printer rental, headphone rental, router rental, tech equipment types, rental categories"
      />
      <div className="bg-secondary/30 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Categories</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Explore our wide range of high-end tech gadgets available for rent.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="text-center py-20">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Loading categories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...categories].sort((a, b) => {
              const orderA = categoryOrder[a.name] ?? 999;
              const orderB = categoryOrder[b.name] ?? 999;
              return orderA - orderB;
            }).map((cat) => {
              const Icon = categoryIcons[cat.name] || Laptop;
              return (
                <Link key={cat.id} href={`/categories/${cat.id}`} className="group relative overflow-hidden rounded-3xl bg-card border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl h-80 flex flex-col cursor-pointer" data-testid={`category-card-${cat.id}`}>
                  <div className="absolute inset-0">
                    <img 
                      src={cat.imageUrl || ''} 
                      alt={`Rent ${cat.name} equipment from RentMyGadgets`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  </div>
                  
                  <div className="relative z-10 mt-auto p-8">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 text-white group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{cat.name}</h2>
                    <p className="text-white/70 mb-4 line-clamp-2">{cat.description}</p>
                    <div className="flex items-center text-white font-medium group-hover:gap-2 transition-all">
                      Browse Products <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
