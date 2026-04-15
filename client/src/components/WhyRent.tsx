import { motion } from "framer-motion";
import { DollarSign, Sparkles, Shield, RefreshCw } from "lucide-react";
import happyCustomerImg from "@assets/generated_images/professional_businesswoman_with_laptop.png";
import techEnthusiastImg from "@assets/generated_images/professional_businessman_with_phone.png";
import spillingLaptopImg from "@assets/generated_images/coffee_spilling_on_laptop.png";
import deliveryBoyImg from "@assets/generated_images/delivery_man_with_package.png";

const benefits = [
  {
    id: 1,
    icon: DollarSign,
    title: "Save Money, Get More",
    description: "Why spend thousands upfront when you can pay a fraction each month? Renting lets you access premium tech without the massive investment. Put your money where it matters most.",
    highlights: ["Pay only for the time you need", "No large upfront costs", "Rent-to-own option available"],
    image: happyCustomerImg,
    imageAlt: "Happy customer saving money"
  },
  {
    id: 2,
    icon: Sparkles,
    title: "Always Use the Latest Tech",
    description: "Technology moves fast. That expensive laptop you buy today becomes outdated in 1-2 years. With rentals, you can upgrade to the newest models whenever you want—no more being stuck with old, slow devices.",
    highlights: ["Upgrade anytime to newest models", "No obsolete equipment", "Access cutting-edge technology"],
    image: techEnthusiastImg,
    imageAlt: "Tech enthusiast with latest device"
  },
  {
    id: 3,
    icon: Shield,
    title: "Accidents? We've Got You Covered",
    description: "Spilled coffee on your laptop? Screen cracked? With optional GadgetCare+ protection, you can rent with peace of mind. No expensive repair bills—just reach out and we'll help you get back on track.",
    highlights: ["Optional GadgetCare+ protection", "No repair headaches", "Replacement assistance available"],
    image: spillingLaptopImg,
    imageAlt: "Coffee spilling on laptop - accidents happen"
  },
  {
    id: 4,
    icon: RefreshCw,
    title: "Flexibility Without Commitment",
    description: "Need a powerful workstation for a 3-month project? A camera for a vacation? Rent exactly what you need, for as long as you need it. Return it when you're done—no strings attached.",
    highlights: ["Flexible rental periods", "Easy returns & exchanges", "Scale up or down anytime"],
    image: deliveryBoyImg,
    imageAlt: "Friendly delivery person with your rental"
  }
];

export default function WhyRent() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
            Why Rent Instead of Buy?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Smart professionals and businesses are choosing rentals. Here's why it makes perfect sense.
          </p>
        </motion.div>

        <div className="space-y-24 md:space-y-32">
          {benefits.map((benefit, index) => {
            const isEven = index % 2 === 0;
            const Icon = benefit.icon;
            
            return (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-16`}
              >
                <div className="flex-1 w-full lg:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl transform rotate-3" />
                    <img
                      src={benefit.image}
                      alt={benefit.imageAlt}
                      className="relative w-full max-w-2xl lg:max-w-3xl mx-auto rounded-3xl shadow-2xl"
                      data-testid={`img-why-rent-${benefit.id}`}
                    />
                  </motion.div>
                </div>

                <div className="flex-1 w-full lg:w-1/2 space-y-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary">
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {benefit.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span className="text-foreground font-medium">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-20"
        >
          <p className="text-xl text-muted-foreground mb-6">
            Ready to experience the smarter way to get tech?
          </p>
          <a
            href="/categories"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-primary hover:bg-primary/90 rounded-full transition-colors"
            data-testid="button-browse-rentals"
          >
            Browse Our Rentals
          </a>
        </motion.div>
      </div>
    </section>
  );
}
