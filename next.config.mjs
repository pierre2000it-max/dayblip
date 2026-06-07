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
