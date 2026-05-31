/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Serve IndexNow key file with correct Content-Type,
        // preventing any www-redirect interference.
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
