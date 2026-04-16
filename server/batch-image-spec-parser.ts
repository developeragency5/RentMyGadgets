// @ts-nocheck
import * as fs from 'fs';
import * as path from 'path';

export interface ProductImageSpec {
  category: string;
  brand: string;
  productModel: string;
  preferredImageViews: string[];
  outputDir: string;
  filenameBase: string;
}

export interface CategorySpec {
  category: string;
  products: ProductImageSpec[];
  totalProducts: number;
  totalImages: number;
}

export function parseSpecificationFile(filePath: string): CategorySpec[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const categories: Map<string, ProductImageSpec[]> = new Map();
  let currentProduct: Partial<ProductImageSpec> = {};
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('category:')) {
      if (currentProduct.category && currentProduct.brand && currentProduct.productModel) {
        const cat = currentProduct.category;
        if (!categories.has(cat)) {
          categories.set(cat, []);
        }
        categories.get(cat)!.push(currentProduct as ProductImageSpec);
      }
      currentProduct = { category: trimmedLine.replace('category:', '').trim() };
    } else if (trimmedLine.startsWith('brand:')) {
      currentProduct.brand = trimmedLine.replace('brand:', '').trim();
    } else if (trimmedLine.startsWith('product_model:')) {
      currentProduct.productModel = trimmedLine.replace('product_model:', '').trim();
    } else if (trimmedLine.startsWith('preferred_image_views:')) {
      const viewsStr = trimmedLine.replace('preferred_image_views:', '').trim();
      try {
        currentProduct.preferredImageViews = JSON.parse(viewsStr);
      } catch {
        currentProduct.preferredImageViews = ['hero', 'front', '3-quarter'];
      }
    } else if (trimmedLine.startsWith('output_dir:')) {
      currentProduct.outputDir = trimmedLine.replace('output_dir:', '').trim();
    } else if (trimmedLine.startsWith('filename_base:')) {
      currentProduct.filenameBase = trimmedLine.replace('filename_base:', '').trim();
    }
  }
  
  if (currentProduct.category && currentProduct.brand && currentProduct.productModel) {
    const cat = currentProduct.category;
    if (!categories.has(cat)) {
      categories.set(cat, []);
    }
    categories.get(cat)!.push(currentProduct as ProductImageSpec);
  }
  
  const result: CategorySpec[] = [];
  for (const [category, products] of categories) {
    const totalImages = products.reduce((sum, p) => sum + (p.preferredImageViews?.length || 3), 0);
    result.push({
      category,
      products,
      totalProducts: products.length,
      totalImages
    });
  }
  
  return result;
}

export function generateDesktopsLaptopsSpec(): ProductImageSpec[] {
  const specs: ProductImageSpec[] = [
    // Apple (16 products)
    { category: "Desktops & Laptops", brand: "Apple", productModel: "MacBook Air 13\" M3", preferredImageViews: ["hero", "front", "3-quarter"], outputDir: "/static/images/Desktops & Laptops/Apple/", filenameBase: "apple_macbook_air_13_m3" },
    { category: "Desktops & Laptops", brand: "Apple", productModel: "MacBook Air 15\"", preferredImageViews: ["hero", "front", "3-quarter"], outputDir: "/static/images/Desktops & Laptops/Apple/", filenameBase: "apple_macbook_air_15" },
    { category: "Desktops & Laptops", brand: "Apple", productModel: "MacBook Air 15\" M2", preferredImageViews: ["hero", "front", "3-quarter"], outputDir: "/static/images/Desktops & Laptops/Apple/", filenameBase: "apple_macbook_air_15_m2" },
    { category: "Desktops & Laptops", brand: "Apple", productModel: "MacBook Air 15\" M3", preferredImageViews: ["hero", "front", "3-quarter"], outputDir: "/static/images/Desktops & Laptops/Apple/", filenameBase: "apple_macbook_air_15_m3" },
    { category: "Desktops & Laptops", brand: "Apple", productModel: "MacBook Pro 13\" M2", preferredImageViews: ["hero", "front", "3-quarter"], outputDir: "/static/images/Desktops & Laptops/Apple/", filenameBase: "apple_macbook_pro_13_m2" },
    { category: "Desktops & Laptops", brand: "Apple", productModel: "MacBook Pro 14\" M3", preferredImageViews: ["hero", "front", "3-quarter"], outputDir: "/static/images/Desktops & Laptops/Apple/", filenameBase: "apple_macbook_pro_14_m3" },
    { category: "Desktops & Laptops", brand: "Apple", productModel: "MacBook Pro 14\" M3 Max", preferredImageViews: ["hero", "front", "3-quarter"], outputDir: "/static/images/Desktops & Laptops/Apple/", filenameBase: "apple_macbook_pro_14_m3_max" },
    { category: "Desktops & Laptops", brand: "Apple", productModel: "MacBook Pro 16\"", preferredImageViews: ["hero", "front", "3-quarter"], outputDir: "/static/images/Desktops & Laptops/Apple/", filenameBase: "apple_macbook_pro_16" },
    { category: "Desktops & Laptops", brand: "Apple", productModel: "iMac 24\"", preferredImageViews: ["hero", "angle", "side"], outputDir: "/static/images/Desktops & Laptops/Apple/", filenameBase: "apple_imac_24" },
    { category: "Desktops & Laptops", brand: "Apple", productModel: "iMac 24\" M3", preferredImageViews: ["hero", "angle", "side"], outputDir: "/static/images/Desktops & Laptops/Apple/", filenameBase: "apple_imac_24_m3" },
    { category: "Desktops & Laptops", brand: "Apple", productModel: "iMac 24\" M3 (16GB)", preferredImageViews: ["hero", "angle", "side"], outputDir: "/static/images/Desktops & Laptops/Apple/", filenameBase: "apple_imac_24_m3_16gb" },
    { category: "Desktops & Laptops", brand: "Apple", productModel: "Mac Mini M2", preferredImageViews: ["hero", "top", "ports"], outputDir: "/static/images/Desktops & Laptops/Apple/", filenameBase: "apple_mac_mini_m2" },
    { category: "Desktops & Laptops", brand: "Apple", productModel: "Mac Mini M2 Pro", preferredImageViews: ["hero", "top", "ports"], outputDir: "/static/images/Desktops & Laptops/Apple/", filenameBase: "apple_mac_mini_m2_pro" },
    { category: "Desktops & Laptops", brand: "Apple", productModel: "Mac Studio M2 Max", preferredImageViews: ["hero", "top", "ports"], outputDir: "/static/images/Desktops & Laptops/Apple/", filenameBase: "apple_mac_studio_m2_max" },
    { category: "Desktops & Laptops", brand: "Apple", productModel: "Mac Studio M2 Ultra", preferredImageViews: ["hero", "top", "ports"], outputDir: "/static/images/Desktops & Laptops/Apple/", filenameBase: "apple_mac_studio_m2_ultra" },
    { category: "Desktops & Laptops", brand: "Apple", productModel: "Mac Pro M2 Ultra", preferredImageViews: ["hero", "rackview", "ports"], outputDir: "/static/images/Desktops & Laptops/Apple/", filenameBase: "apple_mac_pro_m2_ultra" },
    
    // HP (23 products)
    { category: "Desktops & Laptops", brand: "HP", productModel: "Spectre x360", preferredImageViews: ["hero", "360-view", "keyboard"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_spectre_x360" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "Spectre x360 16", preferredImageViews: ["hero", "360-view", "keyboard"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_spectre_x360_16" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "Envy 16", preferredImageViews: ["hero", "3-quarter", "open"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_envy_16" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "Pavilion Plus 14", preferredImageViews: ["hero", "open", "side"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_pavilion_plus_14" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "Victus 16", preferredImageViews: ["hero", "gaming-angle", "keyboard"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_victus_16" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "Omen 17", preferredImageViews: ["hero", "gaming-angle", "back"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_omen_17" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "Omen Transcend 16", preferredImageViews: ["hero", "3-quarter", "keyboard"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_omen_transcend_16" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "OMEN 25L", preferredImageViews: ["hero", "front", "io"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_omen_25l" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "OMEN 45L", preferredImageViews: ["hero", "front", "io"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_omen_45l" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "Dragonfly Pro", preferredImageViews: ["hero", "open", "side"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_dragonfly_pro" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "EliteBook 1040 G10", preferredImageViews: ["hero", "open", "ports"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_elitebook_1040_g10" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "ProBook 440 G10", preferredImageViews: ["hero", "open", "side"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_probook_440_g10" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "ProBook 450 G10", preferredImageViews: ["hero", "open", "side"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_probook_450_g10" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "ZBook Studio G10", preferredImageViews: ["hero", "open", "rear"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_zbook_studio_g10" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "Elite Tower 800 G9", preferredImageViews: ["hero", "front", "io"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_elite_tower_800_g9" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "EliteDesk 800 G9 Mini", preferredImageViews: ["hero", "top", "ports"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_elitedesk_800_g9_mini" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "ProDesk 400 G9 SFF", preferredImageViews: ["hero", "front", "io"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_prodesk_400_g9_sff" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "Z2 Tower G9", preferredImageViews: ["hero", "front", "io"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_z2_tower_g9" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "Z4 Workstation", preferredImageViews: ["hero", "front", "ports"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_z4_workstation" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "Z4 G5 Workstation", preferredImageViews: ["hero", "front", "ports"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_z4_g5_workstation" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "Z6 G5 Workstation", preferredImageViews: ["hero", "front", "ports"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_z6_g5_workstation" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "Z8 Fury G5", preferredImageViews: ["hero", "front", "ports"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_z8_fury_g5" },
    { category: "Desktops & Laptops", brand: "HP", productModel: "Pavilion Gaming TG01", preferredImageViews: ["hero", "front", "io"], outputDir: "/static/images/Desktops & Laptops/HP/", filenameBase: "hp_pavilion_gaming_tg01" },
    
    // Lenovo (17 products)
    { category: "Desktops & Laptops", brand: "Lenovo", productModel: "ThinkPad X1 Carbon", preferredImageViews: ["hero", "open", "keyboard"], outputDir: "/static/images/Desktops & Laptops/Lenovo/", filenameBase: "lenovo_thinkpad_x1_carbon" },
    { category: "Desktops & Laptops", brand: "Lenovo", productModel: "ThinkPad X1 Nano", preferredImageViews: ["hero", "open", "side"], outputDir: "/static/images/Desktops & Laptops/Lenovo/", filenameBase: "lenovo_thinkpad_x1_nano" },
    { category: "Desktops & Laptops", brand: "Lenovo", productModel: "ThinkPad X1 Yoga", preferredImageViews: ["hero", "360-view", "tablet-mode"], outputDir: "/static/images/Desktops & Laptops/Lenovo/", filenameBase: "lenovo_thinkpad_x1_yoga" },
    { category: "Desktops & Laptops", brand: "Lenovo", productModel: "ThinkPad E16", preferredImageViews: ["hero", "open", "side"], outputDir: "/static/images/Desktops & Laptops/Lenovo/", filenameBase: "lenovo_thinkpad_e16" },
    { category: "Desktops & Laptops", brand: "Lenovo", productModel: "ThinkPad P16s", preferredImageViews: ["hero", "open", "ports"], outputDir: "/static/images/Desktops & Laptops/Lenovo/", filenameBase: "lenovo_thinkpad_p16s" },
    { category: "Desktops & Laptops", brand: "Lenovo", productModel: "ThinkPad T16", preferredImageViews: ["hero", "open", "side"], outputDir: "/static/images/Desktops & Laptops/Lenovo/", filenameBase: "lenovo_thinkpad_t16" },
    { category: "Desktops & Laptops", brand: "Lenovo", productModel: "ThinkBook 16p", preferredImageViews: ["hero", "open", "angle"], outputDir: "/static/images/Desktops & Laptops/Lenovo/", filenameBase: "lenovo_thinkbook_16p" },
    { category: "Desktops & Laptops", brand: "Lenovo", productModel: "Yoga 9i", preferredImageViews: ["hero", "360-view", "tablet-mode"], outputDir: "/static/images/Desktops & Laptops/Lenovo/", filenameBase: "lenovo_yoga_9i" },
    { category: "Desktops & Laptops", brand: "Lenovo", productModel: "IdeaPad Gaming 3", preferredImageViews: ["hero", "gaming-angle", "keyboard"], outputDir: "/static/images/Desktops & Laptops/Lenovo/", filenameBase: "lenovo_ideapad_gaming_3" },
    { category: "Desktops & Laptops", brand: "Lenovo", productModel: "LOQ 15", preferredImageViews: ["hero", "3-quarter", "keyboard"], outputDir: "/static/images/Desktops & Laptops/Lenovo/", filenameBase: "lenovo_loq_15" },
    { category: "Desktops & Laptops", brand: "Lenovo", productModel: "Legion Pro 7i", preferredImageViews: ["hero", "gaming-angle", "back"], outputDir: "/static/images/Desktops & Laptops/Lenovo/", filenameBase: "lenovo_legion_pro_7i" },
    { category: "Desktops & Laptops", brand: "Lenovo", productModel: "ThinkCentre M90q", preferredImageViews: ["hero", "front", "ports"], outputDir: "/static/images/Desktops & Laptops/Lenovo/", filenameBase: "lenovo_thinkcentre_m90q" },
    { category: "Desktops & Laptops", brand: "Lenovo", productModel: "ThinkCentre M90q Gen 3", preferredImageViews: ["hero", "front", "ports"], outputDir: "/static/images/Desktops & Laptops/Lenovo/", filenameBase: "lenovo_thinkcentre_m90q_gen3" },
    { category: "Desktops & Laptops", brand: "Lenovo", productModel: "ThinkCentre Neo 50s", preferredImageViews: ["hero", "front", "io"], outputDir: "/static/images/Desktops & Laptops/Lenovo/", filenameBase: "lenovo_thinkcentre_neo_50s" },
    { category: "Desktops & Laptops", brand: "Lenovo", productModel: "ThinkStation P360 Ultra", preferredImageViews: ["hero", "front", "ports"], outputDir: "/static/images/Desktops & Laptops/Lenovo/", filenameBase: "lenovo_thinkstation_p360_ultra" },
    { category: "Desktops & Laptops", brand: "Lenovo", productModel: "ThinkStation P5", preferredImageViews: ["hero", "front", "ports"], outputDir: "/static/images/Desktops & Laptops/Lenovo/", filenameBase: "lenovo_thinkstation_p5" },
    { category: "Desktops & Laptops", brand: "Lenovo", productModel: "ThinkStation P620", preferredImageViews: ["hero", "front", "ports"], outputDir: "/static/images/Desktops & Laptops/Lenovo/", filenameBase: "lenovo_thinkstation_p620" },
    
    // Dell (14 products)
    { category: "Desktops & Laptops", brand: "Dell", productModel: "XPS 13 Plus", preferredImageViews: ["hero", "open", "keyboard"], outputDir: "/static/images/Desktops & Laptops/Dell/", filenameBase: "dell_xps_13_plus" },
    { category: "Desktops & Laptops", brand: "Dell", productModel: "XPS 15", preferredImageViews: ["hero", "open", "3-quarter"], outputDir: "/static/images/Desktops & Laptops/Dell/", filenameBase: "dell_xps_15" },
    { category: "Desktops & Laptops", brand: "Dell", productModel: "XPS 17", preferredImageViews: ["hero", "open", "3-quarter"], outputDir: "/static/images/Desktops & Laptops/Dell/", filenameBase: "dell_xps_17" },
    { category: "Desktops & Laptops", brand: "Dell", productModel: "XPS Desktop 8960", preferredImageViews: ["hero", "front", "io"], outputDir: "/static/images/Desktops & Laptops/Dell/", filenameBase: "dell_xps_desktop_8960" },
    { category: "Desktops & Laptops", brand: "Dell", productModel: "Inspiron 16 Plus", preferredImageViews: ["hero", "open", "side"], outputDir: "/static/images/Desktops & Laptops/Dell/", filenameBase: "dell_inspiron_16_plus" },
    { category: "Desktops & Laptops", brand: "Dell", productModel: "G16", preferredImageViews: ["hero", "gaming-angle", "keyboard"], outputDir: "/static/images/Desktops & Laptops/Dell/", filenameBase: "dell_g16" },
    { category: "Desktops & Laptops", brand: "Dell", productModel: "Vostro 16", preferredImageViews: ["hero", "open", "side"], outputDir: "/static/images/Desktops & Laptops/Dell/", filenameBase: "dell_vostro_16" },
    { category: "Desktops & Laptops", brand: "Dell", productModel: "Latitude 9440", preferredImageViews: ["hero", "open", "ports"], outputDir: "/static/images/Desktops & Laptops/Dell/", filenameBase: "dell_latitude_9440" },
    { category: "Desktops & Laptops", brand: "Dell", productModel: "Precision 5680", preferredImageViews: ["hero", "open", "rear"], outputDir: "/static/images/Desktops & Laptops/Dell/", filenameBase: "dell_precision_5680" },
    { category: "Desktops & Laptops", brand: "Dell", productModel: "Precision 5860 Tower", preferredImageViews: ["hero", "front", "io"], outputDir: "/static/images/Desktops & Laptops/Dell/", filenameBase: "dell_precision_5860_tower" },
    { category: "Desktops & Laptops", brand: "Dell", productModel: "Precision 7875 Tower", preferredImageViews: ["hero", "front", "io"], outputDir: "/static/images/Desktops & Laptops/Dell/", filenameBase: "dell_precision_7875_tower" },
    { category: "Desktops & Laptops", brand: "Dell", productModel: "Precision Workstation", preferredImageViews: ["hero", "front", "ports"], outputDir: "/static/images/Desktops & Laptops/Dell/", filenameBase: "dell_precision_workstation" },
    { category: "Desktops & Laptops", brand: "Dell", productModel: "Optiplex 7000 Micro", preferredImageViews: ["hero", "front", "ports"], outputDir: "/static/images/Desktops & Laptops/Dell/", filenameBase: "dell_optiplex_7000_micro" },
    { category: "Desktops & Laptops", brand: "Dell", productModel: "Optiplex 7090 Ultra", preferredImageViews: ["hero", "slot", "ports"], outputDir: "/static/images/Desktops & Laptops/Dell/", filenameBase: "dell_optiplex_7090_ultra" },
    
    // ASUS (14 products)
    { category: "Desktops & Laptops", brand: "ASUS", productModel: "ROG Zephyrus", preferredImageViews: ["hero", "gaming-angle", "keyboard"], outputDir: "/static/images/Desktops & Laptops/ASUS/", filenameBase: "asus_rog_zephyrus" },
    { category: "Desktops & Laptops", brand: "ASUS", productModel: "ROG Strix SCAR 18", preferredImageViews: ["hero", "gaming-angle", "back"], outputDir: "/static/images/Desktops & Laptops/ASUS/", filenameBase: "asus_rog_strix_scar_18" },
    { category: "Desktops & Laptops", brand: "ASUS", productModel: "ROG Flow Z13", preferredImageViews: ["hero", "tablet-mode", "keyboard"], outputDir: "/static/images/Desktops & Laptops/ASUS/", filenameBase: "asus_rog_flow_z13" },
    { category: "Desktops & Laptops", brand: "ASUS", productModel: "ROG Strix G15DK", preferredImageViews: ["hero", "front", "io"], outputDir: "/static/images/Desktops & Laptops/ASUS/", filenameBase: "asus_rog_strix_g15dk" },
    { category: "Desktops & Laptops", brand: "ASUS", productModel: "ROG Strix GT35", preferredImageViews: ["hero", "front", "io"], outputDir: "/static/images/Desktops & Laptops/ASUS/", filenameBase: "asus_rog_strix_gt35" },
    { category: "Desktops & Laptops", brand: "ASUS", productModel: "TUF Gaming A17", preferredImageViews: ["hero", "gaming-angle", "keyboard"], outputDir: "/static/images/Desktops & Laptops/ASUS/", filenameBase: "asus_tuf_gaming_a17" },
    { category: "Desktops & Laptops", brand: "ASUS", productModel: "TUF Gaming F15", preferredImageViews: ["hero", "gaming-angle", "keyboard"], outputDir: "/static/images/Desktops & Laptops/ASUS/", filenameBase: "asus_tuf_gaming_f15" },
    { category: "Desktops & Laptops", brand: "ASUS", productModel: "ZenBook Pro 16X", preferredImageViews: ["hero", "open", "creative-angle"], outputDir: "/static/images/Desktops & Laptops/ASUS/", filenameBase: "asus_zenbook_pro_16x" },
    { category: "Desktops & Laptops", brand: "ASUS", productModel: "Vivobook Pro 16X", preferredImageViews: ["hero", "open", "angle"], outputDir: "/static/images/Desktops & Laptops/ASUS/", filenameBase: "asus_vivobook_pro_16x" },
    { category: "Desktops & Laptops", brand: "ASUS", productModel: "ProArt Studiobook 16", preferredImageViews: ["hero", "open", "angle"], outputDir: "/static/images/Desktops & Laptops/ASUS/", filenameBase: "asus_proart_studiobook_16" },
    { category: "Desktops & Laptops", brand: "ASUS", productModel: "ProArt Station PD5", preferredImageViews: ["hero", "front", "io"], outputDir: "/static/images/Desktops & Laptops/ASUS/", filenameBase: "asus_proart_station_pd5" },
    { category: "Desktops & Laptops", brand: "ASUS", productModel: "ExpertBook B9", preferredImageViews: ["hero", "open", "side"], outputDir: "/static/images/Desktops & Laptops/ASUS/", filenameBase: "asus_expertbook_b9" },
    { category: "Desktops & Laptops", brand: "ASUS", productModel: "Chromebook Plus CX34", preferredImageViews: ["hero", "open", "angle"], outputDir: "/static/images/Desktops & Laptops/ASUS/", filenameBase: "asus_chromebook_plus_cx34" },
    { category: "Desktops & Laptops", brand: "ASUS", productModel: "NUC 13 Pro", preferredImageViews: ["hero", "front", "ports"], outputDir: "/static/images/Desktops & Laptops/ASUS/", filenameBase: "asus_nuc_13_pro" },
    
    // Acer (12 products)
    { category: "Desktops & Laptops", brand: "Acer", productModel: "Swift 5", preferredImageViews: ["hero", "open", "side"], outputDir: "/static/images/Desktops & Laptops/Acer/", filenameBase: "acer_swift_5" },
    { category: "Desktops & Laptops", brand: "Acer", productModel: "Swift Edge 16", preferredImageViews: ["hero", "open", "angle"], outputDir: "/static/images/Desktops & Laptops/Acer/", filenameBase: "acer_swift_edge_16" },
    { category: "Desktops & Laptops", brand: "Acer", productModel: "Aspire 5", preferredImageViews: ["hero", "open", "side"], outputDir: "/static/images/Desktops & Laptops/Acer/", filenameBase: "acer_aspire_5" },
    { category: "Desktops & Laptops", brand: "Acer", productModel: "Aspire TC-1780", preferredImageViews: ["hero", "front", "io"], outputDir: "/static/images/Desktops & Laptops/Acer/", filenameBase: "acer_aspire_tc_1780" },
    { category: "Desktops & Laptops", brand: "Acer", productModel: "Nitro 5", preferredImageViews: ["hero", "gaming-angle", "keyboard"], outputDir: "/static/images/Desktops & Laptops/Acer/", filenameBase: "acer_nitro_5" },
    { category: "Desktops & Laptops", brand: "Acer", productModel: "Predator Helios 18", preferredImageViews: ["hero", "gaming-angle", "back"], outputDir: "/static/images/Desktops & Laptops/Acer/", filenameBase: "acer_predator_helios_18" },
    { category: "Desktops & Laptops", brand: "Acer", productModel: "Predator Triton 16", preferredImageViews: ["hero", "gaming-angle", "keyboard"], outputDir: "/static/images/Desktops & Laptops/Acer/", filenameBase: "acer_predator_triton_16" },
    { category: "Desktops & Laptops", brand: "Acer", productModel: "Predator Orion 5000", preferredImageViews: ["hero", "front", "io"], outputDir: "/static/images/Desktops & Laptops/Acer/", filenameBase: "acer_predator_orion_5000" },
    { category: "Desktops & Laptops", brand: "Acer", productModel: "Predator Orion 7000", preferredImageViews: ["hero", "front", "io"], outputDir: "/static/images/Desktops & Laptops/Acer/", filenameBase: "acer_predator_orion_7000" },
    { category: "Desktops & Laptops", brand: "Acer", productModel: "ConceptD 500", preferredImageViews: ["hero", "front", "ports"], outputDir: "/static/images/Desktops & Laptops/Acer/", filenameBase: "acer_conceptd_500" },
    { category: "Desktops & Laptops", brand: "Acer", productModel: "ConceptD 7 Ezel", preferredImageViews: ["hero", "creative-angle", "open"], outputDir: "/static/images/Desktops & Laptops/Acer/", filenameBase: "acer_conceptd_7_ezel" },
    { category: "Desktops & Laptops", brand: "Acer", productModel: "TravelMate P4", preferredImageViews: ["hero", "open", "side"], outputDir: "/static/images/Desktops & Laptops/Acer/", filenameBase: "acer_travelmate_p4" },
    
    // MSI (9 products)
    { category: "Desktops & Laptops", brand: "MSI", productModel: "Titan GT77 HX", preferredImageViews: ["hero", "gaming-angle", "keyboard"], outputDir: "/static/images/Desktops & Laptops/MSI/", filenameBase: "msi_titan_gt77_hx" },
    { category: "Desktops & Laptops", brand: "MSI", productModel: "Stealth 17 Studio", preferredImageViews: ["hero", "open", "side"], outputDir: "/static/images/Desktops & Laptops/MSI/", filenameBase: "msi_stealth_17_studio" },
    { category: "Desktops & Laptops", brand: "MSI", productModel: "Creator Z17 HX", preferredImageViews: ["hero", "open", "creative-angle"], outputDir: "/static/images/Desktops & Laptops/MSI/", filenameBase: "msi_creator_z17_hx" },
    { category: "Desktops & Laptops", brand: "MSI", productModel: "Prestige 16 Studio", preferredImageViews: ["hero", "open", "angle"], outputDir: "/static/images/Desktops & Laptops/MSI/", filenameBase: "msi_prestige_16_studio" },
    { category: "Desktops & Laptops", brand: "MSI", productModel: "Katana 15", preferredImageViews: ["hero", "gaming-angle", "keyboard"], outputDir: "/static/images/Desktops & Laptops/MSI/", filenameBase: "msi_katana_15" },
    { category: "Desktops & Laptops", brand: "MSI", productModel: "Cyborg 15", preferredImageViews: ["hero", "gaming-angle", "keyboard"], outputDir: "/static/images/Desktops & Laptops/MSI/", filenameBase: "msi_cyborg_15" },
    { category: "Desktops & Laptops", brand: "MSI", productModel: "MEG Trident X2", preferredImageViews: ["hero", "front", "io"], outputDir: "/static/images/Desktops & Laptops/MSI/", filenameBase: "msi_meg_trident_x2" },
    { category: "Desktops & Laptops", brand: "MSI", productModel: "MAG Infinite S3", preferredImageViews: ["hero", "front", "io"], outputDir: "/static/images/Desktops & Laptops/MSI/", filenameBase: "msi_mag_infinite_s3" },
    { category: "Desktops & Laptops", brand: "MSI", productModel: "Aegis ZS 5DS", preferredImageViews: ["hero", "front", "io"], outputDir: "/static/images/Desktops & Laptops/MSI/", filenameBase: "msi_aegis_zs_5ds" },
    
    // Microsoft (4 products)
    { category: "Desktops & Laptops", brand: "Microsoft", productModel: "Surface Laptop 5", preferredImageViews: ["hero", "open", "angle"], outputDir: "/static/images/Desktops & Laptops/Microsoft/", filenameBase: "microsoft_surface_laptop_5" },
    { category: "Desktops & Laptops", brand: "Microsoft", productModel: "Surface Laptop Studio 2", preferredImageViews: ["hero", "studio-mode", "angle"], outputDir: "/static/images/Desktops & Laptops/Microsoft/", filenameBase: "microsoft_surface_laptop_studio_2" },
    { category: "Desktops & Laptops", brand: "Microsoft", productModel: "Surface Pro 9", preferredImageViews: ["hero", "tablet-mode", "keyboard"], outputDir: "/static/images/Desktops & Laptops/Microsoft/", filenameBase: "microsoft_surface_pro_9" },
    { category: "Desktops & Laptops", brand: "Microsoft", productModel: "Surface Go 3", preferredImageViews: ["hero", "tablet-mode", "keyboard"], outputDir: "/static/images/Desktops & Laptops/Microsoft/", filenameBase: "microsoft_surface_go_3" },
    
    // Razer (4 products)
    { category: "Desktops & Laptops", brand: "Razer", productModel: "Blade 14", preferredImageViews: ["hero", "gaming-angle", "keyboard"], outputDir: "/static/images/Desktops & Laptops/Razer/", filenameBase: "razer_blade_14" },
    { category: "Desktops & Laptops", brand: "Razer", productModel: "Blade 15", preferredImageViews: ["hero", "gaming-angle", "keyboard"], outputDir: "/static/images/Desktops & Laptops/Razer/", filenameBase: "razer_blade_15" },
    { category: "Desktops & Laptops", brand: "Razer", productModel: "Blade 16", preferredImageViews: ["hero", "gaming-angle", "keyboard"], outputDir: "/static/images/Desktops & Laptops/Razer/", filenameBase: "razer_blade_16" },
    { category: "Desktops & Laptops", brand: "Razer", productModel: "Blade 18", preferredImageViews: ["hero", "gaming-angle", "keyboard"], outputDir: "/static/images/Desktops & Laptops/Razer/", filenameBase: "razer_blade_18" },
    
    // Alienware (4 products)
    { category: "Desktops & Laptops", brand: "Alienware", productModel: "x14 R2", preferredImageViews: ["hero", "gaming-angle", "keyboard"], outputDir: "/static/images/Desktops & Laptops/Alienware/", filenameBase: "alienware_x14_r2" },
    { category: "Desktops & Laptops", brand: "Alienware", productModel: "x16", preferredImageViews: ["hero", "gaming-angle", "keyboard"], outputDir: "/static/images/Desktops & Laptops/Alienware/", filenameBase: "alienware_x16" },
    { category: "Desktops & Laptops", brand: "Alienware", productModel: "m18", preferredImageViews: ["hero", "gaming-angle", "back"], outputDir: "/static/images/Desktops & Laptops/Alienware/", filenameBase: "alienware_m18" },
    { category: "Desktops & Laptops", brand: "Alienware", productModel: "Aurora R16", preferredImageViews: ["hero", "front", "io"], outputDir: "/static/images/Desktops & Laptops/Alienware/", filenameBase: "alienware_aurora_r16" },
    
    // Samsung (2 products)
    { category: "Desktops & Laptops", brand: "Samsung", productModel: "Galaxy Book3 Pro 360", preferredImageViews: ["hero", "360-view", "s-pen"], outputDir: "/static/images/Desktops & Laptops/Samsung/", filenameBase: "samsung_galaxy_book3_pro_360" },
    { category: "Desktops & Laptops", brand: "Samsung", productModel: "Galaxy Book3 Ultra", preferredImageViews: ["hero", "open", "angle"], outputDir: "/static/images/Desktops & Laptops/Samsung/", filenameBase: "samsung_galaxy_book3_ultra" },
    
    // Framework (2 products)
    { category: "Desktops & Laptops", brand: "Framework", productModel: "Laptop 13", preferredImageViews: ["hero", "modular", "ports"], outputDir: "/static/images/Desktops & Laptops/Framework/", filenameBase: "framework_laptop_13" },
    { category: "Desktops & Laptops", brand: "Framework", productModel: "Laptop 16", preferredImageViews: ["hero", "modular", "ports"], outputDir: "/static/images/Desktops & Laptops/Framework/", filenameBase: "framework_laptop_16" },
    
    // LG (3 products)
    { category: "Desktops & Laptops", brand: "LG", productModel: "Gram 16 2-in-1", preferredImageViews: ["hero", "360-view", "tablet-mode"], outputDir: "/static/images/Desktops & Laptops/LG/", filenameBase: "lg_gram_16_2in1" },
    { category: "Desktops & Laptops", brand: "LG", productModel: "Gram 17", preferredImageViews: ["hero", "open", "side"], outputDir: "/static/images/Desktops & Laptops/LG/", filenameBase: "lg_gram_17" },
    { category: "Desktops & Laptops", brand: "LG", productModel: "Gram SuperSlim", preferredImageViews: ["hero", "open", "slim-profile"], outputDir: "/static/images/Desktops & Laptops/LG/", filenameBase: "lg_gram_superslim" },
    
    // NZXT (3 products)
    { category: "Desktops & Laptops", brand: "NZXT", productModel: "Player One", preferredImageViews: ["hero", "front", "inside"], outputDir: "/static/images/Desktops & Laptops/NZXT/", filenameBase: "nzxt_player_one" },
    { category: "Desktops & Laptops", brand: "NZXT", productModel: "Player Two", preferredImageViews: ["hero", "front", "inside"], outputDir: "/static/images/Desktops & Laptops/NZXT/", filenameBase: "nzxt_player_two" },
    { category: "Desktops & Laptops", brand: "NZXT", productModel: "Player Three", preferredImageViews: ["hero", "front", "inside"], outputDir: "/static/images/Desktops & Laptops/NZXT/", filenameBase: "nzxt_player_three" },
    
    // Intel (4 products)
    { category: "Desktops & Laptops", brand: "Intel", productModel: "NUC 12 Enthusiast", preferredImageViews: ["hero", "front", "ports"], outputDir: "/static/images/Desktops & Laptops/Intel/", filenameBase: "intel_nuc_12_enthusiast" },
    { category: "Desktops & Laptops", brand: "Intel", productModel: "NUC 13 Pro", preferredImageViews: ["hero", "front", "ports"], outputDir: "/static/images/Desktops & Laptops/Intel/", filenameBase: "intel_nuc_13_pro" },
    { category: "Desktops & Laptops", brand: "Intel", productModel: "NUC 13 Extreme", preferredImageViews: ["hero", "front", "io"], outputDir: "/static/images/Desktops & Laptops/Intel/", filenameBase: "intel_nuc_13_extreme" },
    
    // Corsair (2 products)
    { category: "Desktops & Laptops", brand: "Corsair", productModel: "One i500", preferredImageViews: ["hero", "front", "inside"], outputDir: "/static/images/Desktops & Laptops/Corsair/", filenameBase: "corsair_one_i500" },
    { category: "Desktops & Laptops", brand: "Corsair", productModel: "Vengeance i7500", preferredImageViews: ["hero", "front", "inside"], outputDir: "/static/images/Desktops & Laptops/Corsair/", filenameBase: "corsair_vengeance_i7500" },
    
    // Origin (2 products)
    { category: "Desktops & Laptops", brand: "Origin", productModel: "Chronos", preferredImageViews: ["hero", "front", "inside"], outputDir: "/static/images/Desktops & Laptops/Origin/", filenameBase: "origin_chronos" },
    { category: "Desktops & Laptops", brand: "Origin", productModel: "Big O", preferredImageViews: ["hero", "front", "inside"], outputDir: "/static/images/Desktops & Laptops/Origin/", filenameBase: "origin_big_o" },
    
    // Huawei (2 products)
    { category: "Desktops & Laptops", brand: "Huawei", productModel: "MateBook X Pro 2023", preferredImageViews: ["hero", "open", "angle"], outputDir: "/static/images/Desktops & Laptops/Huawei/", filenameBase: "huawei_matebook_x_pro_2023" },
    { category: "Desktops & Laptops", brand: "Huawei", productModel: "MateBook 16s", preferredImageViews: ["hero", "open", "angle"], outputDir: "/static/images/Desktops & Laptops/Huawei/", filenameBase: "huawei_matebook_16s" },
    
    // Gigabyte (2 products)
    { category: "Desktops & Laptops", brand: "Gigabyte", productModel: "AERO 16", preferredImageViews: ["hero", "open", "creative-angle"], outputDir: "/static/images/Desktops & Laptops/Gigabyte/", filenameBase: "gigabyte_aero_16" },
    { category: "Desktops & Laptops", brand: "Gigabyte", productModel: "AORUS 17X", preferredImageViews: ["hero", "gaming-angle", "keyboard"], outputDir: "/static/images/Desktops & Laptops/Gigabyte/", filenameBase: "gigabyte_aorus_17x" },
    
    // Custom (5 products)
    { category: "Desktops & Laptops", brand: "Custom", productModel: "Gaming PC - Starter", preferredImageViews: ["hero", "front", "inside"], outputDir: "/static/images/Desktops & Laptops/Custom/", filenameBase: "custom_gaming_pc_starter" },
    { category: "Desktops & Laptops", brand: "Custom", productModel: "Gaming PC", preferredImageViews: ["hero", "front", "inside"], outputDir: "/static/images/Desktops & Laptops/Custom/", filenameBase: "custom_gaming_pc" },
    { category: "Desktops & Laptops", brand: "Custom", productModel: "Gaming PC - Pro", preferredImageViews: ["hero", "front", "inside"], outputDir: "/static/images/Desktops & Laptops/Custom/", filenameBase: "custom_gaming_pc_pro" },
    { category: "Desktops & Laptops", brand: "Custom", productModel: "Gaming PC - Elite", preferredImageViews: ["hero", "front", "inside"], outputDir: "/static/images/Desktops & Laptops/Custom/", filenameBase: "custom_gaming_pc_elite" },
    { category: "Desktops & Laptops", brand: "Custom", productModel: "Gaming PC - Ultimate", preferredImageViews: ["hero", "front", "inside"], outputDir: "/static/images/Desktops & Laptops/Custom/", filenameBase: "custom_gaming_pc_ultimate" },
    
    // Remaining single-product brands
    { category: "Desktops & Laptops", brand: "ASRock", productModel: "DeskMeet X600", preferredImageViews: ["hero", "front", "ports"], outputDir: "/static/images/Desktops & Laptops/ASRock/", filenameBase: "asrock_deskmeet_x600" },
    { category: "Desktops & Laptops", brand: "Beelink", productModel: "GTR7", preferredImageViews: ["hero", "front", "ports"], outputDir: "/static/images/Desktops & Laptops/Beelink/", filenameBase: "beelink_gtr7" },
    { category: "Desktops & Laptops", brand: "BOSGAME", productModel: "B100 Plus", preferredImageViews: ["hero", "front", "ports"], outputDir: "/static/images/Desktops & Laptops/BOSGAME/", filenameBase: "bosgame_b100_plus" },
    { category: "Desktops & Laptops", brand: "CyberPowerPC", productModel: "Gamer Xtreme", preferredImageViews: ["hero", "front", "inside"], outputDir: "/static/images/Desktops & Laptops/CyberPowerPC/", filenameBase: "cyberpowerpc_gamer_xtreme" },
    { category: "Desktops & Laptops", brand: "Fujitsu", productModel: "Lifebook U9", preferredImageViews: ["hero", "open", "side"], outputDir: "/static/images/Desktops & Laptops/Fujitsu/", filenameBase: "fujitsu_lifebook_u9" },
    { category: "Desktops & Laptops", brand: "GMKtec", productModel: "NucBox K4", preferredImageViews: ["hero", "front", "ports"], outputDir: "/static/images/Desktops & Laptops/GMKtec/", filenameBase: "gmktec_nucbox_k4" },
    { category: "Desktops & Laptops", brand: "Geekom", productModel: "A7", preferredImageViews: ["hero", "front", "ports"], outputDir: "/static/images/Desktops & Laptops/Geekom/", filenameBase: "geekom_a7" },
    { category: "Desktops & Laptops", brand: "Google", productModel: "Pixelbook Go", preferredImageViews: ["hero", "open", "angle"], outputDir: "/static/images/Desktops & Laptops/Google/", filenameBase: "google_pixelbook_go" },
    { category: "Desktops & Laptops", brand: "iBuyPower", productModel: "Y60", preferredImageViews: ["hero", "front", "inside"], outputDir: "/static/images/Desktops & Laptops/iBuyPower/", filenameBase: "ibuypower_y60" },
    { category: "Desktops & Laptops", brand: "Maingear", productModel: "Rush", preferredImageViews: ["hero", "front", "inside"], outputDir: "/static/images/Desktops & Laptops/Maingear/", filenameBase: "maingear_rush" },
    { category: "Desktops & Laptops", brand: "Minisforum", productModel: "UM790 Pro", preferredImageViews: ["hero", "front", "ports"], outputDir: "/static/images/Desktops & Laptops/Minisforum/", filenameBase: "minisforum_um790_pro" },
    { category: "Desktops & Laptops", brand: "Panasonic", productModel: "Toughbook 55", preferredImageViews: ["hero", "rugged", "ports"], outputDir: "/static/images/Desktops & Laptops/Panasonic/", filenameBase: "panasonic_toughbook_55" },
    { category: "Desktops & Laptops", brand: "Toshiba", productModel: "Dynabook Portege X40", preferredImageViews: ["hero", "open", "side"], outputDir: "/static/images/Desktops & Laptops/Toshiba/", filenameBase: "toshiba_dynabook_portege_x40" },
    { category: "Desktops & Laptops", brand: "VAIO", productModel: "SX14", preferredImageViews: ["hero", "open", "side"], outputDir: "/static/images/Desktops & Laptops/VAIO/", filenameBase: "vaio_sx14" },
  ];
  
  return specs;
}

export function saveSpecToJson(specs: ProductImageSpec[], outputPath: string): void {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2));
  console.log(`[batch-spec] Saved ${specs.length} product specs to ${outputPath}`);
}
