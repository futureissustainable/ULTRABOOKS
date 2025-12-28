import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config to silence the warning
  turbopack: {},

  // Allow external images from Supabase storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },

  // TypeScript configuration
  typescript: {
    // Allow build to succeed even with TS errors during development
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
