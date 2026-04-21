import { motion, useReducedMotion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";

const promoMessages = [
  "Free Shipping on Orders 3+ Months",
  "GadgetCare+ Protection Available",
  "14-Day Free Returns",
  "Fast Delivery in Select Areas",
  "Flexible Rental Terms",
];

export default function PromoMarquee() {
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const controls = useAnimation();

  const duplicatedMessages = [...promoMessages, ...promoMessages];

  useEffect(() => {
    if (shouldReduceMotion) return;

    if (isPaused) {
      controls.stop();
    } else {
      controls.start({
        x: "-50%",
        transition: {
          duration: 15,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        },
      });
    }
  }, [isPaused, shouldReduceMotion, controls]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    controls.start({
      x: "-50%",
      transition: {
        duration: 30,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop",
      },
    });
  }, [shouldReduceMotion, controls]);

  return (
    <div
      className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white overflow-hidden"
      aria-label="Promotional offers: Free Shipping on Orders 3+ Months, GadgetCare+ Protection Available, 14-Day Free Returns, Fast Delivery in Select Areas, Flexible Rental Terms"
      role="marquee"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="py-2.5 relative">
        <motion.div
          className="flex whitespace-nowrap"
          initial={{ x: "0%" }}
          animate={shouldReduceMotion ? {} : controls}
        >
          {duplicatedMessages.map((message, index) => (
            <div
              key={index}
              className="flex items-center mx-8 text-sm font-medium tracking-wide"
            >
              <span className="inline-block w-1.5 h-1.5 bg-white/80 rounded-full mr-3" />
              <span>{message}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
