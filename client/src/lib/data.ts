import { Laptop, Monitor, Printer, Router, Headphones, Mouse, Keyboard, Speaker, Camera } from "lucide-react";

// Categories
import laptopCat from "@assets/stock_images/modern_laptop_worksp_cdfa01dd.jpg";
import desktopCat from "@assets/stock_images/modern_desktop_compu_f60a20f6.jpg";
import printerCat from "@assets/stock_images/modern_office_printe_e77e0e12.jpg";
import routerCat from "@assets/stock_images/wifi_router_modern_51c946b4.jpg";
import accessoriesCat from "@assets/stock_images/high_end_headphones_e76bda70.jpg";
import cameraCat from "@assets/stock_images/professional_camera__71fd9611.jpg";

// Products
import mbp16 from "@assets/stock_images/macbook_pro_laptop_8c2d9462.jpg";
import dellXps from "@assets/stock_images/dell_xps_laptop_e181f887.jpg";
import mbAir from "@assets/stock_images/macbook_air_15_inch__3947f545.jpg";
import iMac from "@assets/stock_images/apple_imac_24_inch_a0c33201.jpg";
import sonyXm5 from "@assets/stock_images/sony_headphones_0452e1eb.jpg";
import hpPrinter from "@assets/stock_images/hp_laserjet_printer_22474448.jpg";
import canonR5 from "@assets/stock_images/canon_eos_r5_camera_4c38dbfa.jpg";
import starlink from "@assets/stock_images/starlink_satellite_d_499960aa.jpg";



export const categories = [
  {
    id: "laptops",
    name: "Laptops",
    icon: Laptop,
    description: "High-performance laptops for work and gaming",
    image: laptopCat
  },
  {
    id: "desktops",
    name: "Desktops / PCs",
    icon: Monitor,
    description: "Powerful workstations and desktop setups",
    image: desktopCat
  },
  {
    id: "printers",
    name: "Printers & Scanners",
    icon: Printer,
    description: "Reliable printing solutions for office needs",
    image: printerCat
  },
  {
    id: "routers",
    name: "Routers",
    icon: Router,
    description: "High-speed internet connectivity devices",
    image: routerCat
  },
  {
    id: "accessories",
    name: "Headphones & Accessories",
    icon: Headphones,
    description: "Audio gear, keyboards, and mice",
    image: accessoriesCat
  },
  {
    id: "cameras",
    name: "Cameras & Gear",
    icon: Camera,
    description: "DSLRs, lenses, and lighting equipment",
    image: cameraCat
  }
];

export const products = [
  {
    id: "mbp-16",
    name: "MacBook Pro 16\"",
    category: "laptops",
    price: 45,
    period: "day",
    image: mbp16,
    specs: ["M3 Max", "32GB RAM", "1TB SSD"],
    featured: true,
    description: "High-performance MacBook Pro with M3 Max chip, Liquid Retina XDR display, and all-day battery life. Built for creative professionals."
  },
  {
    id: "dell-xps",
    name: "Dell XPS 15",
    category: "laptops",
    price: 35,
    period: "day",
    image: dellXps,
    specs: ["i9 Processor", "32GB RAM", "1TB SSD"],
    featured: true,
    description: "High-performance Windows laptop with a stunning OLED display. Ideal for coding, content creation, and business use."
  },
  {
    id: "mb-air",
    name: "MacBook Air 15\"",
    category: "laptops",
    price: 25,
    period: "day",
    image: mbAir,
    specs: ["M2 Chip", "16GB RAM", "512GB SSD"],
    featured: false,
    description: "Incredibly thin and light with a spacious 15-inch display. Fanless design for silent operation."
  },
  {
    id: "imac-24",
    name: "iMac 24\"",
    category: "desktops",
    price: 40,
    period: "day",
    image: iMac,
    specs: ["M3 Chip", "16GB RAM", "512GB SSD"],
    featured: false,
    description: "An all-in-one desktop for creative work and everyday tasks. Beautifully designed, intuitive to use, and packed with capable tools."
  },
  {
    id: "sony-xm5",
    name: "Sony WH-1000XM5",
    category: "accessories",
    price: 15,
    period: "day",
    image: sonyXm5,
    specs: ["Noise Cancelling", "30h Battery", "Wireless"],
    featured: true,
    description: "Advanced noise cancellation. Exceptional sound quality for music and calls."
  },
  {
    id: "hp-printer",
    name: "HP LaserJet Pro",
    category: "printers",
    price: 20,
    period: "day",
    image: hpPrinter,
    specs: ["Color Print", "Wireless", "High Speed"],
    featured: false,
    description: "Fast, reliable printing for your home office or small business."
  },
  {
    id: "canon-r5",
    name: "Canon EOS R5",
    category: "cameras",
    price: 85,
    period: "day",
    image: canonR5,
    specs: ["45MP", "8K Video", "IBIS"],
    featured: true,
    description: "Professional mirrorless camera. Capture stunning 45MP photos and cinematic 8K video."
  },
  {
    id: "starlink",
    name: "Starlink Roam",
    category: "routers",
    price: 50,
    period: "day",
    image: starlink,
    specs: ["Satellite", "High Speed", "Portable"],
    featured: false,
    description: "High-speed, low-latency internet on an as-needed basis at any destination where Starlink provides active coverage."
  }
];

