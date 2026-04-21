import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchProducts, safeFetch } from "@/lib/api";
import type { Product, Category, BlogPost } from "@shared/schema";
import { Loader2, MapPin, ShoppingBag, Laptop, FileText, BookOpen, Shield } from "lucide-react";

const RENTAL_LANDING_PAGES = [
  { href: "/office-printer-rentals", label: "Office Printer Rentals" },
  { href: "/laptop-desktop-rentals", label: "Laptop & Desktop Rentals" },
  { href: "/smartphone-rentals", label: "Smartphone Rentals" },
  { href: "/headphones-audio-rentals", label: "Headphones & Audio Rentals" },
  { href: "/camera-gear-rentals", label: "Camera & Gear Rentals" },
  { href: "/router-rentals", label: "Router Rentals" },
];

const COLLECTION_PAGES = [
  { href: "/collections/office-printers", label: "Office Printers" },
  { href: "/collections/laser-printers", label: "Laser Printers" },
  { href: "/collections/color-laser-printers", label: "Color Laser Printers" },
  { href: "/collections/small-office-printers", label: "Small Office Printers" },
  { href: "/collections/laptops", label: "Laptops" },
  { href: "/collections/desktops", label: "Desktops" },
  { href: "/collections/workstations", label: "Workstations" },
  { href: "/collections/smartphones", label: "Smartphones" },
  { href: "/collections/mobile-phones", label: "Mobile Phones" },
  { href: "/collections/cell-phones", label: "Cell Phones" },
  { href: "/collections/headphones", label: "Headphones" },
  { href: "/collections/keyboards", label: "Keyboards" },
  { href: "/collections/computer-mice", label: "Computer Mice" },
  { href: "/collections/dslr-cameras", label: "DSLR Cameras" },
  { href: "/collections/camera-lenses", label: "Camera Lenses" },
  { href: "/collections/lighting-gear", label: "Lighting Gear" },
  { href: "/collections/routers", label: "Routers" },
  { href: "/collections/wifi-routers", label: "WiFi Routers" },
  { href: "/collections/wireless-routers", label: "Wireless Routers" },
];

const MAIN_PAGES = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Browse Categories" },
  { href: "/products", label: "All Products" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/gadgetcare", label: "GadgetCare+ Protection" },
  { href: "/rent-to-own", label: "Rent-to-Own Program" },
  { href: "/search", label: "Search Products" },
  { href: "/compare", label: "Compare Products" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/blog", label: "Blog" },
];

const POLICY_PAGES = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/rental-policy", label: "Rental Agreement Policy" },
  { href: "/return-policy", label: "Return & Refund Policy" },
  { href: "/shipping-policy", label: "Shipping & Delivery Policy" },
  { href: "/damage-policy", label: "Damage & Loss Policy" },
  { href: "/security-deposit", label: "Security Deposit Policy" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/do-not-sell", label: "Do Not Sell My Info" },
  { href: "/accessibility", label: "Accessibility Statement" },
  { href: "/advertising-disclosure", label: "Advertising Disclosure" },
];

function SitemapSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground border-b pb-2">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function LinkList({ links }: { links: { href: string; label: string }[] }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1.5">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="text-sm text-primary hover:underline" data-testid={`sitemap-link-${link.href.replace(/\//g, "-")}`}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function HtmlSitemap() {
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["products", "all"],
    queryFn: () => fetchProducts({}),
  });

  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["blog"],
    queryFn: async () => {
      const res = await safeFetch("/api/blog");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const categoryLinks = categories.map((c) => ({
    href: `/categories/${c.id}`,
    label: c.name,
  }));

  const productsByCategory: Record<string, { href: string; label: string }[]> = {};
  for (const p of products) {
    const catName = categories.find((c) => c.id === p.categoryId)?.name || "Other";
    if (!productsByCategory[catName]) productsByCategory[catName] = [];
    productsByCategory[catName].push({
      href: `/product/${(p as any).slug || p.id}`,
      label: `${p.brand ? p.brand + " " : ""}${p.name}`,
    });
  }

  const blogLinks = blogPosts.map((p: any) => ({
    href: `/blog/${p.slug}`,
    label: p.title,
  }));

  return (
    <Layout>
      <SeoHead
        title="Site Map"
        description="Browse all pages on RentMyGadgets. Find every product, rental category, blog post, and policy page in one place."
      />
      <div className="container mx-auto px-4 py-12 max-w-5xl" data-testid="html-sitemap-page">
        <h1 className="text-3xl font-bold mb-2">Site Map</h1>
        <p className="text-muted-foreground mb-8">Browse every page on RentMyGadgets — all products, rental categories, blog posts, and policies in one place.</p>

        <SitemapSection title="Main Pages" icon={<MapPin className="h-5 w-5" />}>
          <LinkList links={MAIN_PAGES} />
        </SitemapSection>

        <SitemapSection title="Rental Categories" icon={<ShoppingBag className="h-5 w-5" />}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Landing Pages</h3>
          <LinkList links={RENTAL_LANDING_PAGES} />
          <h3 className="text-sm font-semibold text-muted-foreground mt-5 mb-2 uppercase tracking-wide">Browse by Category</h3>
          <LinkList links={categoryLinks} />
          <h3 className="text-sm font-semibold text-muted-foreground mt-5 mb-2 uppercase tracking-wide">Collections</h3>
          <LinkList links={COLLECTION_PAGES} />
        </SitemapSection>

        <SitemapSection title="All Products" icon={<Laptop className="h-5 w-5" />}>
          {productsLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading products...
            </div>
          ) : (
            Object.entries(productsByCategory)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([catName, prods]) => (
                <div key={catName} className="mb-6">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{catName}</h3>
                  <LinkList links={prods} />
                </div>
              ))
          )}
        </SitemapSection>

        {blogLinks.length > 0 && (
          <SitemapSection title="Blog Posts" icon={<BookOpen className="h-5 w-5" />}>
            <LinkList links={blogLinks} />
          </SitemapSection>
        )}

        <SitemapSection title="Policies & Legal" icon={<Shield className="h-5 w-5" />}>
          <LinkList links={POLICY_PAGES} />
        </SitemapSection>
      </div>
    </Layout>
  );
}
