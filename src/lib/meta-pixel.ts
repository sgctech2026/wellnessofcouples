// Meta Pixel client helper
export const META_PIXEL_ID = "26192331687073676";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

export function trackPageView() {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
}

export function trackEvent(name: string, params?: Record<string, any>, options?: { eventID?: string }) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    if (options?.eventID) {
      window.fbq("track", name, params || {}, { eventID: options.eventID });
    } else {
      window.fbq("track", name, params || {});
    }
  }
}
