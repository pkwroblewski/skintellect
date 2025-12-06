import type { NextConfig } from "next";

/**
 * Next.js Configuration
 * 
 * Includes security headers for production deployment.
 * See docs/SECURITY.md for more details.
 */

const securityHeaders = [
  {
    // Prevent clickjacking attacks
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    // Prevent MIME type sniffing
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Control referrer information
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Prevent XSS attacks
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    // DNS prefetch control
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    // Strict transport security (HTTPS only)
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    // Permissions policy (restrict browser features)
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    // Content Security Policy
    // Conservative policy that allows:
    // - Self-hosted resources
    // - Inline styles (needed for Tailwind)
    // - Google Fonts
    // - Analytics (Plausible, PostHog)
    // - Images from common CDNs and data URIs
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io https://app.posthog.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://plausible.io https://app.posthog.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Enable React Compiler (React 19)
  reactCompiler: true,
  
  // Add security headers to all routes
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Additional CORS headers for API routes
        source: "/api/:path*",
        headers: [
          ...securityHeaders,
          {
            key: "Access-Control-Allow-Origin",
            // In production, set this to your actual domain
            value: process.env.NEXT_PUBLIC_SITE_URL || "https://skintelect.com",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },

  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Reduce bundle size by excluding unused features
  experimental: {
    optimizePackageImports: ["@prisma/client"],
  },
};

export default nextConfig;
