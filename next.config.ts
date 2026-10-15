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
                    hostname: 'api.dicebear.com',
               },
               {
                    protocol: 'https',
                    hostname: 'robohash.org',
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
