import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
   images: {
    domains: ["images.unsplash.com", "res.cloudinary.com","ui-avatars.com","lh3.googleusercontent.com"] // whitelist external domains
  },
};

export default nextConfig;
