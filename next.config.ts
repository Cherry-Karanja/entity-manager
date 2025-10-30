import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Turbopack configuration
    turbo: {
      resolveAlias: {
        // Workaround for font loading issue with Turbopack
        '@vercel/turbopack-next/internal/font/google/font': '@vercel/turbopack-next/internal/font/google/font',
      },
    },
  },
};

export default nextConfig;
