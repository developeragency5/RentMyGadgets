import { useEffect } from "react";
import { isAnalyticsAllowed, isMarketingAllowed } from "@/lib/consent";

function loadScript(src: string, id: string, category: string): void {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  script.async = true;
  script.setAttribute("data-consent-category", category);
  document.head.appendChild(script);
}

function initGoogleAnalytics(measurementId: string): void {
  if (!measurementId || measurementId === "YOUR_GA_MEASUREMENT_ID") return;

  loadScript(
    `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
    "gtag-script",
    "analytics"
  );

  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
  (window as any).gtag = gtag;
  gtag("js", new Date());
  gtag("config", measurementId, { anonymize_ip: true });
}

function initMicrosoftAds(tagId: string): void {
  if (!tagId || tagId === "YOUR_UET_TAG_ID") return;

  loadScript("//bat.bing.com/bat.js", "uet-script", "marketing");

  const checkUET = setInterval(() => {
    if (typeof (window as any).UET !== "undefined") {
      clearInterval(checkUET);
      const o = { ti: tagId, enableAutoSpaTracking: true, q: [] };
      (window as any).uetq = new (window as any).UET(o);
      (window as any).uetq.push("pageLoad");
    }
  }, 200);

  setTimeout(() => clearInterval(checkUET), 10000);
}

export default function ConsentGatedScripts() {
  useEffect(() => {
    const handleConsentChange = () => {
      if (isAnalyticsAllowed()) {
        initGoogleAnalytics("AW-18113004379");
      }
      if (isMarketingAllowed()) {
        initMicrosoftAds("YOUR_UET_TAG_ID");
      }
    };

    handleConsentChange();

    window.addEventListener("storage", handleConsentChange);
    return () => window.removeEventListener("storage", handleConsentChange);
  }, []);

  return null;
}
