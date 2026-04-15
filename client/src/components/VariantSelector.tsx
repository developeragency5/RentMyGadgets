import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProductVariants, type VariantOption, type VariantGroups } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface VariantSelectorProps {
  productId: string;
  onPriceAdjustmentChange: (adjustment: number) => void;
  onConfigurationChange?: (config: Record<string, string>) => void;
}

const VARIANT_TYPE_LABELS: Record<string, string> = {
  storage: "Storage",
  memory: "Memory",
  chip: "Chip",
  color: "Color",
  size: "Size",
  display: "Display",
  processor: "Processor",
  gpu: "Graphics",
  keyboard: "Keyboard",
  power: "Power Adapter",
  kit: "Configuration",
  bundle: "Package",
  quantity: "Pack Size",
};

function formatPriceAdjustment(adjustment: number): string {
  if (adjustment === 0) {
    return "Included";
  }
  return `+$${adjustment.toFixed(0)}/mo`;
}

function getVariantLabel(variantType: string): string {
  return VARIANT_TYPE_LABELS[variantType.toLowerCase()] || 
    variantType.charAt(0).toUpperCase() + variantType.slice(1);
}

export default function VariantSelector({
  productId,
  onPriceAdjustmentChange,
  onConfigurationChange,
}: VariantSelectorProps) {
  const { data: variants, isLoading, error } = useQuery({
    queryKey: ["productVariants", productId],
    queryFn: () => fetchProductVariants(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const variantTypes = useMemo(() => {
    if (!variants) return [];
    return Object.keys(variants);
  }, [variants]);

  useEffect(() => {
    if (!variants) return;

    const defaults: Record<string, string> = {};
    for (const [variantType, options] of Object.entries(variants)) {
      const defaultOption = options.find((opt) => opt.isDefault);
      if (defaultOption) {
        defaults[variantType] = defaultOption.id;
      } else if (options.length > 0) {
        defaults[variantType] = options[0].id;
      }
    }
    setSelectedOptions(defaults);
  }, [variants]);

  const totalPriceAdjustment = useMemo(() => {
    if (!variants) return 0;

    let total = 0;
    for (const [variantType, selectedId] of Object.entries(selectedOptions)) {
      const options = variants[variantType];
      if (options) {
        const selectedOption = options.find((opt) => opt.id === selectedId);
        if (selectedOption) {
          total += selectedOption.priceAdjustment;
        }
      }
    }
    return total;
  }, [variants, selectedOptions]);

  useEffect(() => {
    onPriceAdjustmentChange(totalPriceAdjustment);
  }, [totalPriceAdjustment, onPriceAdjustmentChange]);

  useEffect(() => {
    if (!onConfigurationChange || !variants) return;

    const config: Record<string, string> = {};
    for (const [variantType, selectedId] of Object.entries(selectedOptions)) {
      const options = variants[variantType];
      if (options) {
        const selectedOption = options.find((opt) => opt.id === selectedId);
        if (selectedOption) {
          config[variantType] = selectedOption.label;
        }
      }
    }
    onConfigurationChange(config);
  }, [selectedOptions, variants, onConfigurationChange]);

  const handleOptionSelect = (variantType: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [variantType]: optionId,
    }));
  };

  const hasNoVariants = error || !variants || variantTypes.length === 0;

  useEffect(() => {
    if (!isLoading && hasNoVariants) {
      onPriceAdjustmentChange(0);
    }
  }, [isLoading, hasNoVariants, onPriceAdjustmentChange]);

  if (isLoading) {
    return (
      <div 
        className="py-4 flex items-center justify-center"
        data-testid="variant-selector-loading"
      >
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading configuration options...</span>
      </div>
    );
  }

  if (hasNoVariants) {
    return null;
  }

  return (
    <div 
      className="space-y-6"
      data-testid="variant-selector"
    >
      {variantTypes.map((variantType) => {
        const options = variants[variantType];
        if (!options || options.length === 0) return null;

        const selectedId = selectedOptions[variantType];

        return (
          <div key={variantType} className="space-y-3" data-testid={`variant-section-${variantType}`}>
            <label className="text-sm font-medium text-foreground block">
              {getVariantLabel(variantType)}
            </label>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => {
                const isSelected = selectedId === option.id;
                const isDisabled = !option.available;

                return (
                  <button
                    key={option.id}
                    onClick={() => !isDisabled && handleOptionSelect(variantType, option.id)}
                    disabled={isDisabled}
                    className={`
                      px-4 py-3 rounded-xl text-sm font-medium border transition-all
                      flex flex-col items-center gap-0.5 min-w-[100px]
                      ${isSelected
                        ? "bg-primary text-white border-primary ring-2 ring-primary/20"
                        : isDisabled
                          ? "bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-50"
                          : "bg-background hover:bg-secondary border-border hover:border-primary/50"
                      }
                    `}
                    data-testid={`variant-option-${variantType}-${option.value}`}
                  >
                    <span className="font-semibold">{option.label}</span>
                    <span 
                      className={`text-xs ${
                        isSelected 
                          ? "text-white/80" 
                          : "text-muted-foreground"
                      }`}
                    >
                      {formatPriceAdjustment(option.priceAdjustment)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {totalPriceAdjustment > 0 && (
        <div 
          className="pt-4 border-t flex justify-between items-center text-sm"
          data-testid="variant-price-summary"
        >
          <span className="text-muted-foreground">Configuration upgrade:</span>
          <span className="font-semibold text-primary">+${totalPriceAdjustment.toFixed(0)}/mo</span>
        </div>
      )}
    </div>
  );
}
