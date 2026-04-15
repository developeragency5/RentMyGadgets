import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Cookie, Settings, ShieldAlert } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { detectGPC } from "@/lib/consent";

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  doNotSell: boolean;
  gpcDetected: boolean;
  timestamp: string;
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [gpcActive, setGpcActive] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: true,
    analytics: true,
    marketing: true,
    doNotSell: false,
    gpcDetected: false,
    timestamp: ""
  });

  useEffect(() => {
    const gpc = detectGPC();
    setGpcActive(gpc);

    const consent = localStorage.getItem("cookieConsent");
    if (consent) {
      try {
        const saved = JSON.parse(consent);
        if (gpc && !saved.gpcDetected) {
          const enforced: CookiePreferences = {
            ...saved,
            analytics: false,
            marketing: false,
            doNotSell: true,
            gpcDetected: true,
            timestamp: new Date().toISOString(),
          };
          localStorage.setItem("cookieConsent", JSON.stringify(enforced));
          setPreferences(enforced);
        } else {
          setPreferences(saved);
        }
      } catch {
        setIsVisible(true);
      }
    } else {
      if (gpc) {
        const autoOptOut: CookiePreferences = {
          essential: true,
          functional: true,
          analytics: false,
          marketing: false,
          doNotSell: true,
          gpcDetected: true,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem("cookieConsent", JSON.stringify(autoOptOut));
        setPreferences(autoOptOut);
      } else {
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    const updated = { ...prefs, gpcDetected: gpcActive, timestamp: new Date().toISOString() };
    if (gpcActive) {
      updated.analytics = false;
      updated.marketing = false;
      updated.doNotSell = true;
    }
    localStorage.setItem("cookieConsent", JSON.stringify(updated));
    setPreferences(updated);
    setIsVisible(false);
    setShowPreferences(false);
    window.dispatchEvent(new Event("storage"));
  };

  const acceptAll = () => {
    savePreferences({
      essential: true,
      functional: true,
      analytics: !gpcActive,
      marketing: !gpcActive,
      doNotSell: gpcActive,
      gpcDetected: gpcActive,
      timestamp: ""
    });
  };

  const rejectNonEssential = () => {
    savePreferences({
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
      doNotSell: true,
      gpcDetected: gpcActive,
      timestamp: ""
    });
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg animate-in slide-in-from-bottom-5 duration-300">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Cookie className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div className="text-sm flex-1">
                <p className="font-semibold mb-1">Your Privacy Matters</p>
                <p className="text-muted-foreground">
                  We use cookies to enhance your experience and analyze traffic. Some information may be shared with advertising partners. 
                  You have the right to opt-out of the sale or sharing of your personal information.{" "}
                  <Link href="/cookies" className="text-primary underline">Cookie Policy</Link> |{" "}
                  <Link href="/privacy" className="text-primary underline">Privacy Policy</Link> |{" "}
                  <Link href="/do-not-sell" className="text-primary underline">Do Not Sell My Info</Link>
                </p>
                {gpcActive && (
                  <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" />
                    Global Privacy Control signal detected — marketing and analytics cookies are automatically disabled.
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowPreferences(true)} data-testid="button-cookies-customize">
                <Settings className="h-4 w-4 mr-1" /> Customize
              </Button>
              <Button variant="outline" size="sm" onClick={rejectNonEssential} data-testid="button-cookies-reject">
                Reject All
              </Button>
              <Button size="sm" onClick={acceptAll} data-testid="button-cookies-accept">
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cookie Preferences</DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. Essential cookies are always enabled as they are necessary for the website to function.
            </DialogDescription>
          </DialogHeader>
          {gpcActive && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-800 flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Your browser's Global Privacy Control (GPC) signal is active. Analytics and marketing cookies are automatically disabled to honor your privacy preference.</span>
            </div>
          )}
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Essential Cookies</p>
                <p className="text-sm text-muted-foreground">Required for basic website functionality (cart, sessions)</p>
              </div>
              <Switch checked={true} disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Functional Cookies</p>
                <p className="text-sm text-muted-foreground">Remember your preferences and settings</p>
              </div>
              <Switch 
                checked={preferences.functional} 
                onCheckedChange={(checked) => setPreferences({...preferences, functional: checked})}
                data-testid="switch-functional"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Analytics Cookies</p>
                <p className="text-sm text-muted-foreground">Help us understand how visitors use the site</p>
              </div>
              <Switch 
                checked={preferences.analytics} 
                onCheckedChange={(checked) => setPreferences({...preferences, analytics: gpcActive ? false : checked})}
                disabled={gpcActive}
                data-testid="switch-analytics"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Cookies</p>
                <p className="text-sm text-muted-foreground">Used for targeted advertising across sites</p>
              </div>
              <Switch 
                checked={preferences.marketing} 
                onCheckedChange={(checked) => setPreferences({...preferences, marketing: gpcActive ? false : checked})}
                disabled={gpcActive}
                data-testid="switch-marketing"
              />
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary">Do Not Sell/Share My Info</p>
                  <p className="text-sm text-muted-foreground">Opt-out of sale or sharing of personal data (CCPA)</p>
                </div>
                <Switch 
                  checked={preferences.doNotSell} 
                  onCheckedChange={(checked) => setPreferences({
                    ...preferences, 
                    doNotSell: gpcActive ? true : checked,
                    marketing: (gpcActive || checked) ? false : preferences.marketing
                  })}
                  disabled={gpcActive}
                  data-testid="switch-do-not-sell"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowPreferences(false)}>Cancel</Button>
            <Button onClick={saveCustomPreferences} data-testid="button-save-preferences">Save Preferences</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
