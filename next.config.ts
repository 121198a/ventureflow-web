import type { NextConfig } from 'next';

const securityHeaders = [
  // Legacy MIME-sniffing protection; largely superseded by CSP but still
  // recommended baseline for browsers/versions that don't honor CSP fully.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Prevents the site from being framed elsewhere (clickjacking).
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  images: { formats: ['image/avif', 'image/webp'] },
  devIndicators: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        source: '/ubverse/companies',
        destination: '/platform',
        permanent: false,
      },
    ];
  },
};
export default nextConfig;
