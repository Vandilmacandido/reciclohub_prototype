import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  images: {
    domains: [
      'residuesimage.s3.amazonaws.com',
    ],
  },
};

export default nextConfig;
