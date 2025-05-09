import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "travel-journal-api-bootcamp.do.dibimbing.id",
      "via.placeholder.com",
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
