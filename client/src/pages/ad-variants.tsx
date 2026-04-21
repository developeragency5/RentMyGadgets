import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface AdPair {
  id: number;
  angle: string;
  headline: string;
  description: string;
  color: string;
}

const AD_PAIRS: AdPair[] = [
  {
    id: 1,
    angle: "Flexibility",
    headline: "Rent Office Printers | Monthly",
    description: "Rent laser & color office printers. Fast delivery in select areas, free setup. No long-term contracts.",
    color: "bg-blue-500",
  },
  {
    id: 2,
    angle: "Brand Trust",
    headline: "Office Printer Rentals | Daily",
    description: "Premium laser printers from HP, Brother & Canon. Flexible monthly rentals. Fast delivery available.",
    color: "bg-emerald-500",
  },
  {
    id: 3,
    angle: "Price",
    headline: "Color Laser Printers | Rentals",
    description: "Color laser printers for your small office. Fast delivery in select areas. Rent from $29/mo.",
    color: "bg-amber-500",
  },
  {
    id: 4,
    angle: "Small Office",
    headline: "Rent Laser Printers - Fast Ship",
    description: "Rent small office printers monthly. Laser & color models. Fast setup, zero commitment.",
    color: "bg-purple-500",
  },
];

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 gap-1 text-xs"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      data-testid={`button-copy-${label}`}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

export default function AdVariantsPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <Badge variant="outline" className="mb-3">Internal — Marketing Reference</Badge>
        <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">
          Google Ads — Printer Rental A/B Test Variants
        </h1>
        <p className="mt-3 text-muted-foreground">
          Four headline + description pairs prepared for A/B testing on Google Ads.
          Each headline is exactly <strong>30 characters</strong>; each description is exactly{" "}
          <strong>90 characters</strong> — meeting Google&rsquo;s expanded text-ad limits.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Suggested landing page:{" "}
          <Link
            href="/categories/18079e56-3836-4542-b12a-733b4ce84bdd"
            className="text-primary underline"
            data-testid="link-landing-printers"
          >
            /categories &mdash; Printers &amp; Scanners
          </Link>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {AD_PAIRS.map((pair) => (
          <Card
            key={pair.id}
            className="overflow-hidden border-2"
            data-testid={`card-ad-pair-${pair.id}`}
          >
            <div className={`h-1.5 ${pair.color}`} aria-hidden="true" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Pair {pair.id} &mdash; {pair.angle}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  Variant {String.fromCharCode(64 + pair.id)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Headline
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground" data-testid={`text-headline-len-${pair.id}`}>
                      {pair.headline.length}/30
                    </span>
                    <CopyButton text={pair.headline} label={`headline-${pair.id}`} />
                  </div>
                </div>
                <p
                  className="rounded-md bg-muted/60 p-3 font-medium"
                  data-testid={`text-headline-${pair.id}`}
                >
                  {pair.headline}
                </p>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Description
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground" data-testid={`text-description-len-${pair.id}`}>
                      {pair.description.length}/90
                    </span>
                    <CopyButton text={pair.description} label={`description-${pair.id}`} />
                  </div>
                </div>
                <p
                  className="rounded-md bg-muted/60 p-3 text-sm leading-relaxed"
                  data-testid={`text-description-${pair.id}`}
                >
                  {pair.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 border-dashed">
        <CardHeader>
          <CardTitle className="text-base">A/B Testing Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Goal:</strong> Identify which messaging angle drives the highest CTR
            and conversion rate for the office printer rental category.
          </p>
          <p>
            <strong>Suggested rotation:</strong> Run all four pairs in a single ad group
            with even rotation enabled. Let them run for at least 1,000 impressions per
            variant before declaring a winner.
          </p>
          <p>
            <strong>Tracking:</strong> The site already loads Google Ads gtag.js (consent-gated).
            Make sure conversion tracking is wired to checkout completion.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
