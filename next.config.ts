import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,

  // Configuración para Azure Static Web Apps
  output: 'export',
  trailingSlash: true,

  // Optimizar imágenes para deployment estático
  images: {
    unoptimized: true,
  },

  // Optimizaciones de build
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },

  // Optimizar webpack para Azure
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
