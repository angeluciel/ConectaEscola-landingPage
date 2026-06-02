import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://randomimgs.blob.core.windows.net/random-imgs/**')]
  }
};

export default nextConfig;
