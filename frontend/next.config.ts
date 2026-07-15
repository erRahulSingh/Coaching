import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
    unoptimized: true, // Allow offline testing and static exports easily
  },
};

export default nextConfig;
