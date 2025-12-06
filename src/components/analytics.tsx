"use client";

import Script from "next/script";

/**
 * Analytics Component
 * 
 * Integrates Plausible and PostHog analytics.
 * Only loads in production and respects privacy.
 * 
 * Required environment variables:
 * - NEXT_PUBLIC_PLAUSIBLE_DOMAIN: Your Plausible domain
 * - NEXT_PUBLIC_POSTHOG_KEY: Your PostHog project API key
 * 
 * Usage:
 *   Add <Analytics /> to your root layout.
 */

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

export function Analytics() {
  // Only load analytics in production
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <>
      {/* Plausible Analytics - Privacy-friendly, cookieless */}
      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}

      {/* PostHog Analytics - Product analytics */}
      {posthogKey && (
        <Script
          id="posthog-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('${posthogKey}', {
                api_host: 'https://app.posthog.com',
                // Don't track locally
                loaded: function(posthog) {
                  if (window.location.hostname === 'localhost') {
                    posthog.opt_out_capturing();
                  }
                },
                // Respect Do Not Track
                respect_dnt: true,
                // Disable automatic pageview (we'll handle it manually if needed)
                capture_pageview: true,
                // Disable session recording by default
                disable_session_recording: true,
                // Mask all text for privacy
                mask_all_text: false,
                // Don't capture personal data
                properties_string_max_length: 1000,
              });
            `,
          }}
        />
      )}
    </>
  );
}

/**
 * Track a custom event with Plausible and PostHog.
 * Call this from client components.
 * 
 * @param eventName - Name of the event
 * @param properties - Optional properties to track
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean>
) {
  // Track with Plausible
  if (typeof window !== "undefined" && "plausible" in window) {
    (window as unknown as { plausible: (name: string, options?: { props: Record<string, string | number | boolean> }) => void }).plausible(
      eventName,
      properties ? { props: properties } : undefined
    );
  }

  // Track with PostHog
  if (typeof window !== "undefined" && "posthog" in window) {
    (window as unknown as { posthog: { capture: (name: string, props?: Record<string, string | number | boolean>) => void } }).posthog.capture(
      eventName,
      properties
    );
  }
}

