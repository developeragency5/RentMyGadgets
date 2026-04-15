import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  fallbackPath?: string;
  label?: string;
  className?: string;
}

export default function BackButton({ fallbackPath = "/", label = "Back", className = "" }: BackButtonProps) {
  const [, navigate] = useLocation();
  const hasPreviousPage = useRef(false);

  useEffect(() => {
    const navEntries = window.performance?.getEntriesByType?.("navigation") as PerformanceNavigationTiming[] | undefined;
    if (navEntries && navEntries.length > 0) {
      hasPreviousPage.current = navEntries[0].type === "back_forward" || navEntries[0].type === "navigate";
    }
    if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
      hasPreviousPage.current = true;
    }
  }, []);

  const handleBack = useCallback(() => {
    if (hasPreviousPage.current && window.history.length > 1) {
      window.history.back();
    } else {
      navigate(fallbackPath);
    }
  }, [navigate, fallbackPath]);

  return (
    <button
      onClick={handleBack}
      data-testid="button-back"
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
        bg-secondary text-foreground hover:bg-secondary/80
        transition-colors duration-200 cursor-pointer ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}
