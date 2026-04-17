import { Link } from "wouter";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  linkToHome?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: {
    wrapper: "text-base",
    badge: "px-2 py-1 rounded-md text-xs",
    text: "text-base",
    gap: "gap-1.5",
  },
  md: {
    wrapper: "text-xl",
    badge: "px-2.5 py-1.5 rounded-lg text-base",
    text: "text-xl",
    gap: "gap-2",
  },
  lg: {
    wrapper: "text-2xl",
    badge: "px-3 py-2 rounded-lg text-lg",
    text: "text-2xl",
    gap: "gap-2.5",
  },
};

export function Logo({
  size = "md",
  showText = true,
  linkToHome = true,
  className = "",
}: LogoProps) {
  const s = sizeClasses[size];

  const content = (
    <div
      className={`inline-flex items-center font-heading font-bold tracking-tight text-primary ${s.wrapper} ${s.gap} ${className}`}
      data-testid="logo-brand"
    >
      <span
        className={`bg-primary text-primary-foreground font-bold ${s.badge}`}
        aria-hidden="true"
      >
        RMG
      </span>
      {showText && <span>RentMyGadgets</span>}
    </div>
  );

  if (!linkToHome) return content;

  return (
    <Link href="/">
      <span className="hover:opacity-90 transition-opacity cursor-pointer inline-block">
        {content}
      </span>
    </Link>
  );
}
