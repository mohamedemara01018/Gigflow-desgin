import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "https://gigflow-api.vercel.app/api/auth/:path*",
      },
    ];
  },
};

export default nextConfig;