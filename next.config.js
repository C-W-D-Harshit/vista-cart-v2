/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa");

const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com"],
  },
  experimental: {
    serverActions: true,
  },
  ...withPWA({
    dest: "public",
    register: true,
    skipWating: true,
  }),
};

module.exports = nextConfig;
