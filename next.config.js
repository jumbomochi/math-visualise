/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'tesseract.js', 'canvas'],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

module.exports = nextConfig;
