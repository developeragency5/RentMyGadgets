import { Link } from "wouter";
import { Check, Truck, Shield, RefreshCw, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PRINTERS_CATEGORY_ID = "18079e56-3836-4542-b12a-733b4ce84bdd";

interface ContentBlock {
  intro: {
    h2: string;
    body: string;
    bullets: { icon: "truck" | "shield" | "refresh"; text: string }[];
  };
  comparison: {
    h2: string;
    intro: string;
    rows: { buy: string; rent: string }[];
  };
  sections: { h2: string; body: string; products?: { name: string; price: string; href: string }[] }[];
  howItWorks: { title: string; body: string }[];
  included: string[];
  faqs: { q: string; a: string }[];
  cta: { primary: string; secondary: string };
}

const CATEGORY_CONTENT: Record<string, ContentBlock> = {
  [PRINTERS_CATEGORY_ID]: {
    intro: {
      h2: "Rent the Right Office Printer — Without Buying It",
      body: "Buying an office printer means a $400–$8,000 capital outlay, a 3-year warranty clock, and a closet full of toner you'll outgrow before you finish. RentMyGadgets puts a business-grade office printer on your desk for a flat monthly fee — laser printers, color laser printers, and small office printers from HP, Brother, Canon, Xerox, and Epson. Whether you're opening a new location, surviving tax season, or just tired of inkjet headaches, you get the right device for as long as you need it, and not a day longer.",
      bullets: [
        { icon: "truck", text: "Same-day delivery in 30+ metros" },
        { icon: "shield", text: "Optional GadgetCare+ damage protection" },
        { icon: "refresh", text: "14-day free returns, no contracts" },
      ],
    },
    comparison: {
      h2: "Why Renting Beats Buying",
      intro:
        "Renting an office printer is a cleaner line item, a faster decision, and a lot less risk. If your print volume doubles next quarter or a better model launches next month, you trade up — you don't sell used hardware on Craigslist.",
      rows: [
        { buy: "$400–$8,000 upfront", rent: "From $17.99/month" },
        { buy: "3-year warranty, then you're on your own", rent: "Repairs covered with GadgetCare+" },
        { buy: "Stuck with the model you bought", rent: "Swap or upgrade anytime" },
        { buy: "Toner sourcing is your problem", rent: "Replacement toner at wholesale, shipped free" },
        { buy: "Resale value drops 40% in year one", rent: "Return it, owe nothing" },
      ],
    },
    sections: [
      {
        h2: "Laser Printer Rentals — Built for Teams That Actually Print",
        body: "Our laser printer lineup is engineered for offices where reliability matters more than novelty. Monochrome models print 35–55 pages per minute with monthly duty cycles up to 80,000 pages, so you're not babysitting jams during a Monday morning rush. Every laser printer rental ships with a starter toner cartridge, duplex two-sided printing enabled by default, Wi-Fi 6, Gigabit Ethernet, USB-C connectivity, and full mobile printing support (AirPrint, Mopria, Google Cloud Print).",
        products: [
          { name: "HP LaserJet Pro 4001n", price: "$42.99/mo", href: "/product/hp-laserjet-pro-4001n-mono-laser-printer" },
          { name: "HP LaserJet Pro MFP 4101", price: "$79/mo", href: "/product/hp-laserjet-pro-mfp-4101" },
          { name: "Brother HL-L8360CDW", price: "$49.99/mo", href: "/product/brother-hl-l8360cdw-business-color-laser-printer" },
        ],
      },
      {
        h2: "Color Laser Printer Rentals — Marketing-Ready Output, on Demand",
        body: "When black-and-white won't sell the deal, a color laser printer delivers proposal-grade color without the dried-ink bills of an inkjet. Our color laser printer rentals span compact desktop units for 2-person creative teams up to floor-standing workgroup machines rated for 75,000 pages a month. You get true-to-brand color, smudge-proof output, and a per-page cost that can run 60–80% lower than inkjet over the rental term.",
        products: [
          { name: "HP Color LaserJet Pro MFP 4301fdw", price: "$64.99/mo", href: "/product/hp-color-laserjet-pro-mfp-4301fdw-wireless-color-all-in-one" },
          { name: "Brother MFC-L8900CDW", price: "$89/mo", href: "/product/brother-mfc-l8900cdw" },
          { name: "HP Color LaserJet Enterprise MFP", price: "$124.99/mo", href: "/product/hp-color-laserjet-enterprise-flow-mfp-6800zf-printer" },
        ],
      },
      {
        h2: "Small Office Printer Rentals — Big Capability, Small Footprint",
        body: "Tight on space? A small office printer doesn't have to mean settling for less. Our small office printer category fits home offices, co-working desks, and 2–5 person teams that need laser-quality output, automatic document feeders, and wireless scanning to email, USB, or cloud — all in a footprint that lives on a credenza, not a dedicated table. Most small office printer rentals run $24.99–$44.99/month and ship with everything you need to print within 15 minutes of unboxing.",
      },
    ],
    howItWorks: [
      { title: "Pick a printer", body: "Browse the office printer catalog above by brand, price, or product type." },
      { title: "Choose your term", body: "1, 3, 6, or 12 months. Longer terms unlock automatic discounts: 10% off 3 months, 20% off 6 months, 30% off 12 months." },
      { title: "Same-day delivery", body: "Order before 12 PM local time and it's at your door tonight in 30+ metros." },
      { title: "Print with confidence", body: "Free 7-day support. Optional GadgetCare+ covers accidental damage, spills, and hardware failure." },
      { title: "Return or swap", body: "Prepaid return label included. Upgrade to a newer model at any time — no penalties." },
    ],
    included: [
      "Starter toner cartridge (full yield)",
      "All cables (USB-C, Ethernet, power)",
      "Pre-flashed firmware and driver pack",
      "Quick-start guide and printed test page",
      "7-day phone, email, and chat support",
      "Replacement device shipped within 24 hours if yours fails",
    ],
    faqs: [
      {
        q: "What's the cheapest office printer I can rent?",
        a: "Small office printer rentals start at $17.99/month for entry-level monochrome models like the HP DeskJet 2827e — ideal for solo professionals and home offices.",
      },
      {
        q: "Is a color laser printer worth renting instead of an inkjet?",
        a: "Yes. A color laser printer has a per-page cost 60–80% lower than inkjet, sharper output on plain paper, and zero dried-ink failures — all of which matter when client deliverables are on the line.",
      },
      {
        q: "Can I rent a laser printer for just one month?",
        a: "Yes. Every laser printer rental starts at a one-month minimum with no long-term commitment and no auto-renewal.",
      },
      {
        q: "Do rentals include toner?",
        a: "Every office printer ships with a starter toner cartridge. Replacement toner is offered at wholesale cost with free shipping for active renters.",
      },
      {
        q: "What happens if my printer breaks?",
        a: "With GadgetCare+ ($9–$15/month depending on model) we cover all repairs, accidental damage, and ship a replacement unit within 24 hours at no extra charge. Without it, repairs are billed at our published rate sheet.",
      },
      {
        q: "Can I rent multiple office printers for different locations?",
        a: "Yes. Multi-unit and multi-site rentals receive volume pricing — request a quote and we'll send a tailored plan within one business day.",
      },
      {
        q: "Do you offer rent-to-own?",
        a: "Yes. Any office printer rental can convert to rent-to-own — your accumulated rental payments apply toward the purchase price.",
      },
    ],
    cta: {
      primary: "Browse the Full Office Printer Catalog",
      secondary: "Talk to a Printer Specialist",
    },
  },
};

const iconMap = {
  truck: Truck,
  shield: Shield,
  refresh: RefreshCw,
};

export default function CategoryContent({ categoryId }: { categoryId: string }) {
  const content = CATEGORY_CONTENT[categoryId];
  if (!content) return null;

  return (
    <section
      className="bg-gradient-to-b from-white to-slate-50 border-t border-slate-200"
      data-testid="section-category-content"
    >
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Intro */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-slate-900" data-testid="text-content-intro-h2">
            {content.intro.h2}
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-6">{content.intro.body}</p>
          <div className="flex flex-wrap gap-4">
            {content.intro.bullets.map((b, i) => {
              const Icon = iconMap[b.icon];
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2"
                  data-testid={`badge-intro-${i}`}
                >
                  <Icon className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-slate-800">{b.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3 text-slate-900">{content.comparison.h2}</h2>
          <p className="text-slate-700 mb-6">{content.comparison.intro}</p>
          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-5 py-3 font-semibold text-slate-700 text-sm uppercase tracking-wide">Buying</th>
                  <th className="px-5 py-3 font-semibold text-orange-700 text-sm uppercase tracking-wide">Renting with RentMyGadgets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {content.comparison.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-5 py-3 text-slate-600 text-sm">{row.buy}</td>
                    <td className="px-5 py-3 text-slate-900 font-medium text-sm">
                      <span className="inline-flex items-start gap-2">
                        <Check className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                        {row.rent}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sections */}
        {content.sections.map((sec, i) => (
          <div key={i} className="mb-12">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3 text-slate-900">{sec.h2}</h2>
            <p className="text-slate-700 leading-relaxed mb-4">{sec.body}</p>
            {sec.products && (
              <div className="grid sm:grid-cols-3 gap-3 mt-4">
                {sec.products.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-orange-300 hover:shadow-md transition-all group"
                    data-testid={`link-recommended-${p.href.split('/').pop()}`}
                  >
                    <div className="font-semibold text-slate-900 group-hover:text-orange-600 text-sm mb-1">{p.name}</div>
                    <div className="text-orange-600 font-bold">{p.price}</div>
                    <div className="text-xs text-slate-500 mt-1 inline-flex items-center gap-1">
                      View details <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6 text-slate-900">How It Works</h2>
          <ol className="space-y-4">
            {content.howItWorks.map((step, i) => (
              <li key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* What's Included */}
        <div className="mb-12 bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-slate-900">What's Included with Every Rental</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {content.included.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-700">
                <Check className="h-5 w-5 text-orange-600 mt-0.5 shrink-0" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6 text-slate-900">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full bg-white rounded-xl border border-slate-200 shadow-sm">
            {content.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="px-5">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline" data-testid={`faq-q-${i}`}>
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-700 leading-relaxed" data-testid={`faq-a-${i}`}>
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Closing CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 p-8 md:p-10 text-white text-center shadow-lg">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3">Ready to Print?</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Pick a printer above or chat with a specialist to get a model recommendation matched to your team's monthly print volume.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-orange-700 hover:bg-orange-50"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              data-testid="button-cta-browse"
            >
              {content.cta.primary}
            </Button>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 hover:text-white w-full sm:w-auto"
                data-testid="button-cta-contact"
              >
                <Phone className="h-4 w-4 mr-2" />
                {content.cta.secondary}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* JSON-LD FAQ schema for SEO rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: content.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </section>
  );
}
