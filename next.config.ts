import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Explicitly include TypeScript paths
    tsconfigPath: './tsconfig.json'
  }
};

export default nextConfig;
