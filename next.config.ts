import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Compiler for better performance
  experimental: {
    reactCompiler: true,
  },

  // Enable stricter type checking
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  // Optimize images and fonts
  images: {
    formats: ['image/webp', 'image/avif'],
  },

  // Enable compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
