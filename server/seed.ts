// @ts-nocheck
import { storage } from "./storage";
import type { InsertCategory, InsertProduct } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create categories
  const categoriesData: InsertCategory[] = [
    {
      name: "Laptops",
      description: "High-performance laptops for work and gaming",
      imageUrl: "/stock_images/modern_laptop_worksp_cdfa01dd.jpg"
    },
    {
      name: "Desktops / PCs",
      description: "Powerful workstations and desktop setups",
      imageUrl: "/stock_images/modern_desktop_compu_f60a20f6.jpg"
    },
    {
      name: "Printers & Scanners",
      description: "Reliable printing solutions for office needs",
      imageUrl: "/stock_images/modern_office_printe_e77e0e12.jpg"
    },
    {
      name: "Routers",
      description: "High-speed internet connectivity devices",
      imageUrl: "/stock_images/wifi_router_modern_51c946b4.jpg"
    },
    {
      name: "Headphones & Accessories",
      description: "Audio gear, keyboards, and mice",
      imageUrl: "/stock_images/high_end_headphones_e76bda70.jpg"
    },
    {
      name: "Cameras & Gear",
      description: "Professional cameras, lenses, and lighting",
      imageUrl: "/stock_images/professional_camera__71fd9611.jpg"
    }
  ];

  const createdCategories: { [key: string]: string } = {};
  
  for (const cat of categoriesData) {
    const created = await storage.createCategory(cat);
    createdCategories[cat.name] = created.id;
    console.log(`✓ Created category: ${cat.name}`);
  }

  // Create products
  const productsData: Omit<InsertProduct, 'categoryId'>[] & { category: string }[] = [
    {
      name: "Dell XPS 15",
      category: "Laptops",
      pricePerDay: "35",
      imageUrl: "/stock_images/dell_xps_laptop_e181f887.jpg",
      specs: ["i9 Processor", "32GB RAM", "1TB SSD"],
      featured: true,
      available: true,
      description: "High-performance Windows laptop with a stunning OLED display. Ideal for coding, content creation, and business use."
    },
    {
      name: "Sony WH-1000XM5",
      category: "Headphones & Accessories",
      pricePerDay: "15",
      imageUrl: "/stock_images/sony_headphones_0452e1eb.jpg",
      specs: ["Noise Cancelling", "30h Battery", "Wireless"],
      featured: true,
      available: true,
      description: "Industry-leading noise cancellation. Exceptional sound quality for music and calls."
    },
    {
      name: "HP LaserJet Pro",
      category: "Printers & Scanners",
      pricePerDay: "20",
      imageUrl: "/stock_images/hp_laserjet_printer_22474448.jpg",
      specs: ["Color Print", "Wireless", "High Speed"],
      featured: false,
      available: true,
      description: "Fast, reliable printing for your home office or small business."
    },
    {
      name: "Canon EOS R5",
      category: "Cameras & Gear",
      pricePerDay: "85",
      imageUrl: "/stock_images/canon_eos_r5_camera_4c38dbfa.jpg",
      specs: ["45MP", "8K Video", "IBIS"],
      featured: true,
      available: true,
      description: "Professional mirrorless camera. Capture stunning 45MP photos and cinematic 8K video."
    },
    {
      name: "Starlink Roam",
      category: "Routers",
      pricePerDay: "50",
      imageUrl: "/stock_images/starlink_satellite_d_499960aa.jpg",
      specs: ["Satellite", "High Speed", "Portable"],
      featured: false,
      available: true,
      description: "High-speed, low-latency internet on an as-needed basis at any destination where Starlink provides active coverage."
    }
  ];

  for (const prod of productsData) {
    const { category, ...productData } = prod;
    const productToInsert: InsertProduct = {
      ...productData,
      categoryId: createdCategories[category]
    };
    await storage.createProduct(productToInsert);
    console.log(`✓ Created product: ${prod.name}`);
  }

  console.log("✅ Database seeded successfully!");
}

seed().catch(console.error);
