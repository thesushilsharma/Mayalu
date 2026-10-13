import type { NextConfig } from "next";

const nextConfig: NextConfig = {
     reactCompiler: true,
     images: {
          dangerouslyAllowSVG: true,
          contentDispositionType: 'attachment',
          contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
          remotePatterns: [
               {
                    protocol: 'https',
                    hostname: 'images.pexels.com',
               },
               {
                    protocol: 'https',
                    hostname: 'api.dicebear.com',
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
