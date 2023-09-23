/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com"],
  },
  experimental: {
    esmExternals: false,
    serverActions: true,
  },
};

module.exports = nextConfig;
