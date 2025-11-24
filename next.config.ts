import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["next/font"],
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
