export interface ConsentState {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  doNotSell: boolean;
  gpcActive: boolean;
  hasConsented: boolean;
  timestamp: string;
}

export function detectGPC(): boolean {
  if (typeof navigator !== "undefined" && "globalPrivacyControl" in navigator) {
    return !!(navigator as any).globalPrivacyControl;
  }
  return false;
}

export function getConsentState(): ConsentState {
  const gpcActive = detectGPC();
  const defaultState: ConsentState = {
    essential: true,
    functional: false,
    analytics: false,
    marketing: false,
    doNotSell: gpcActive,
    gpcActive,
    hasConsented: false,
    timestamp: "",
  };

  try {
    const stored = localStorage.getItem("cookieConsent");
    if (!stored) return defaultState;
    const parsed = JSON.parse(stored);
    return {
      essential: true,
      functional: gpcActive ? false : !!parsed.functional,
      analytics: gpcActive ? false : !!parsed.analytics,
      marketing: gpcActive ? false : !!parsed.marketing,
      doNotSell: gpcActive ? true : !!parsed.doNotSell,
      gpcActive,
      hasConsented: true,
      timestamp: parsed.timestamp || "",
    };
  } catch {
    return defaultState;
  }
}

export function isAnalyticsAllowed(): boolean {
  const state = getConsentState();
  return state.hasConsented && state.analytics && !state.gpcActive;
}

export function isMarketingAllowed(): boolean {
  const state = getConsentState();
  return state.hasConsented && state.marketing && !state.doNotSell && !state.gpcActive;
}

export function revokeConsent(): void {
  localStorage.removeItem("cookieConsent");
  removeTrackingScripts();
  removeTrackingCookies();
}

function removeTrackingScripts(): void {
  document.querySelectorAll("script[data-consent-category]").forEach((el) => el.remove());
}

function removeTrackingCookies(): void {
  const trackingCookies = ["_ga", "_gid", "_gat", "_fbp", "_fbc", "uetmsclkid"];
  trackingCookies.forEach((name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
  });
}
