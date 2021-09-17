/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ["www.aclproduct.com", "localhost:3000"]
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  }
};
