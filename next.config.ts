
      import type {NextConfig} from 'next';
      
      const withPWA = require('next-pwa')({
        dest: 'public',
      });


      const nextConfig: NextConfig = {
        /* config options here */
        typescript: {
          ignoreBuildErrors: true,
        },
        eslint: {
          ignoreDuringBuilds: true,
        },
        async headers() {
          return [
            {
              source: '/(.*)',
              headers: [
                {
                  key: 'Permissions-Policy',
                  value: 'geolocation=*, clipboard-read=*, clipboard-write=(self)',
                },
              ],
            },
          ];
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
