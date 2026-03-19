import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avoindata.eduskunta.fi",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
