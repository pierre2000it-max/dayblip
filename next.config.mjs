/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permanently redirect non-www → www so Google consolidates authority
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "dayblip.com" }],
        destination: "https://www.dayblip.com/:path*",
        permanent: true,   // 301
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
    ];
  },
};

export default nextConfig;
