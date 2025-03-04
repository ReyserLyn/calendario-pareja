import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pb-calendario.reyserlyn.com",
      },
    ],
  },
};

export default nextConfig;
