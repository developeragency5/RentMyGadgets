import { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export function ProductImage({ 
  src, 
  alt, 
  className = "w-full h-full object-cover",
  fallbackClassName = "w-full h-full flex items-center justify-center bg-muted"
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setHasError(false);
    setIsLoading(false);
  };

  if (hasError || !src) {
    return (
      <div className={fallbackClassName} data-testid="img-fallback">
        <div className="text-center text-muted-foreground">
          <ImageOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <span className="text-xs">Image unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className={`absolute inset-0 ${fallbackClassName} animate-pulse`}>
          <div className="w-16 h-16 rounded-lg bg-muted-foreground/20" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        data-testid="img-product"
      />
    </div>
  );
}

function deriveAltText(productName: string, src: string, index: number): string {
  const lower = src.toLowerCase();
  if (index === 0 || lower.includes('product-photo') || lower.includes('hero')) return `${productName} - rent high-end tech equipment`;
  if (lower.includes('front-view')) return `${productName} front view`;
  if (lower.includes('back-view') || lower.includes('rear')) return `${productName} back view showing details`;
  if (lower.includes('side-view')) return `${productName} side profile`;
  if (lower.includes('angle-view')) return `${productName} three-quarter angle view`;
  if (lower.includes('top-view')) return `${productName} top-down view`;
  if (lower.includes('ports-detail')) return `${productName} ports and connectivity`;
  if (lower.includes('open-view')) return `${productName} open position`;
  if (lower.includes('carrying-case') || lower.includes('case')) return `${productName} with carrying case`;
  if (lower.includes('complete-kit') || lower.includes('accessories')) return `${productName} complete kit with accessories`;
  if (lower.includes('color-option')) return `${productName} available color options`;
  if (lower.includes('lifestyle')) return `${productName} in use`;
  if (lower.includes('app-companion') || lower.includes('phone')) return `${productName} with companion app`;
  if (lower.includes('display-view') || lower.includes('screen')) return `${productName} display and screen`;
  if (lower.includes('keyboard')) return `${productName} keyboard layout`;
  return `${productName} gallery image ${index + 1}`;
}

export function ProductGallery({ 
  images, 
  productName,
  mainImage,
  compact = false
}: { 
  images: string[] | null | undefined;
  productName: string;
  mainImage: string | null | undefined;
  compact?: boolean;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const validImages = (images || []).filter(img => img && img.trim() !== '');
  const allImages = mainImage && mainImage.trim() !== ''
    ? [mainImage, ...validImages.filter(img => img !== mainImage)]
    : validImages;
  
  const uniqueImages = Array.from(new Set(allImages));
  
  if (uniqueImages.length === 0) {
    return (
      <div className="aspect-[4/5] rounded-xl overflow-hidden bg-muted flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <ImageOff className="h-16 w-16 mx-auto mb-2 opacity-50" />
          <span className="text-sm">No images available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-white border shadow-sm">
        <ProductImage 
          key={`main-${selectedIndex}-${uniqueImages[selectedIndex]}`}
          src={uniqueImages[selectedIndex]} 
          alt={deriveAltText(productName, uniqueImages[selectedIndex], selectedIndex)}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
        />
      </div>
      {uniqueImages.length > 1 && (
        <div className={`grid ${uniqueImages.length <= 5 ? 'grid-cols-5' : uniqueImages.length <= 7 ? 'grid-cols-7' : 'grid-cols-5'} ${compact ? 'gap-2' : 'gap-3'}`}>
          {uniqueImages.slice(0, 7).map((img, i) => (
            <button
              key={`thumb-${i}-${img}`}
              onClick={() => setSelectedIndex(i)}
              className={`${compact ? 'aspect-[4/5] rounded-lg max-h-16' : 'aspect-square rounded-xl'} overflow-hidden bg-white border cursor-pointer transition-all ${
                selectedIndex === i ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary'
              }`}
              data-testid={`gallery-thumb-${i}`}
            >
              <ProductImage src={img} alt={deriveAltText(productName, img, i)} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
