import type { NextConfig } from "next";

const apiBaseUrl =
  process.env.API_INTERNAL_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/api/:path*`,
      },
      {
        source: "/health",
        destination: `${apiBaseUrl}/health`,
      },
    ];
  },
};

export default nextConfig;