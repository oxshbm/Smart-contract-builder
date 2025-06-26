import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Only run ESLint on specific directories
    dirs: ['app', 'components', 'lib', 'types'],
    ignoreDuringBuilds: true
  },
  typescript: {
    // Explicitly include TypeScript paths
    tsconfigPath: './tsconfig.json'
  }
};

export default nextConfig;
