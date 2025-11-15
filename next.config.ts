
      import type {NextConfig} from 'next';
      
      const withPWA = require('next-pwa')({
        dest: 'public',
        runtimeCaching: [
          {
            urlPattern: '/api/cameras',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'camera-data-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 3600, // 1 hour
              },
            },
          },
        ],
        fallbacks: {
          document: '/offline.html',
        }
      });


      const nextConfig: NextConfig = {
        /* config options here */
        typescript: {
          ignoreBuildErrors: true,
        },
        eslint: {
          ignoreDuringBuilds: true,
        },
        images: {
          remotePatterns: [
            {
              protocol: 'https',
              hostname: 'placehold.co',
              port: '',
              pathname: '/**',
            },
            {
              protocol: 'https',
              hostname: 'images.unsplash.com',
              port: '',
              pathname: '/**',
            },
            {
              protocol: 'https',
              hostname: 'picsum.photos',
              port: '',
              pathname: '/**',
            },
            {
              protocol: 'https',
              hostname: 'trafficnz.info',
              port: '',
              pathname: '/**',
            },
          ],
        },
      };
      
      export default withPWA(nextConfig);
