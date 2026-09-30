import type { NextConfig } from "next";

const nextConfig: NextConfig = {
     reactCompiler: true,
     images: {
          remotePatterns: [
               {
                    protocol: 'https',
                    hostname: 'images.pexels.com',
               },
          ],
     },
     logging: {
          browserToTerminal: true,
     },
     cacheComponents: true,
     partialPrefetching: true,
};

export default nextConfig;
