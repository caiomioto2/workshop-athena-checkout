import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Set Turbopack root to fix workspace detection
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
