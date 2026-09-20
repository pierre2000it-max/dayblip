/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compress all responses
  compress: true,

  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Permanently redirect non-www → www so Google consolidates authority
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "dayblip.com" }],
        destination: "https://www.dayblip.com/:path*",
        permanent: true, // 301
      },
      {
        // Google/AdSense crawler looks for the policy at /privacy-policy.
        // Our page lives at /privacy — 301 so the expected URL resolves.
        source: "/privacy-policy",
        destination: "/privacy",
        permanent: true, // 301
      },
      {
        source: "/terms-of-service",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/terms-of-use",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/contact-us/",
        destination: "/contact",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        // IndexNow key file: correct Content-Type so crawlers accept it
        source: "/272eea5409654b49b404dee73c5f0bfb.txt",
        headers: [
          { key: "Content-Type",  value: "text/plain; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
      {
        // Security and performance headers for all routes
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "X-Frame-Options",          value: "SAMEORIGIN" },
          { key: "X-XSS-Protection",         value: "1; mode=block" },
          { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
          // CSP in report-only mode — violations logged to browser console, nothing blocked.
          // Promote to Content-Security-Policy once reports confirm no legitimate domains are missing.
          {
            key: "Content-Security-Policy-Report-Only",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' pagead2.googlesyndication.com",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "font-src 'self' fonts.gstatic.com",
              "frame-src pagead2.googlesyndication.com googleads.g.doubleclick.net",
              "connect-src 'self' fonts.googleapis.com pagead2.googlesyndication.com adservice.google.com googleads.g.doubleclick.net open.er-api.com www.wikidata.org query.wikidata.org earthquake.usgs.gov api.jsonbin.io ziplicit.com",
              "img-src 'self' data: pagead2.googlesyndication.com googleads.g.doubleclick.net",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
            ].join("; "),
          },
          // Permissions-Policy — enforcing directly (low blast-radius, no domain allowlist needed)
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
          },
        ],
      },
      {
        // Cache static image assets for 1 year
        source: "/(.*)\.(ico|png|jpg|jpeg|svg|gif|webp)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Cache font files for 1 year
        source: "/(.*)\.(woff|woff2|ttf|otf)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // Optimize heavy packages to reduce bundle size
  experimental: {
    optimizePackageImports: ["react-icons"],
  },
};

export default nextConfig;
