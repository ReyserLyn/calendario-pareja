import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "db.reyserlyn.com",
      },
    ],
  },
};

export default nextConfig;
