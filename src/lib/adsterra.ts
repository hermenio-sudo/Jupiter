// Adsterra popunder — opens the ad URL in a new tab, max 3 times per session.
// After 3 triggers the function does nothing, so normal navigation is unaffected.

const AD_URL = "https://auctionr.org/4/86ac23fce04c019523c560b4f237c350";
const MAX_TRIGGERS = 3;
const SESSION_KEY = "jupiter_ad_count";

export function triggerAd(): void {
  const count = parseInt(sessionStorage.getItem(SESSION_KEY) ?? "0", 10);
  if (count >= MAX_TRIGGERS) return;

  sessionStorage.setItem(SESSION_KEY, String(count + 1));

  // Open in new tab — browsers allow this when inside a user-gesture handler
  const win = window.open(AD_URL, "_blank", "noopener");
  if (!win) {
    // Popup was blocked — try direct navigation as fallback (less intrusive)
    // Just skip silently so the main CTA still works
  }
}
