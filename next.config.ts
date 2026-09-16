import type { NextConfig } from 'next';

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  connect-src 'self' https: wss:;
`.replace(/\s{2,}/g, ' ').trim();

const securityHeaders = [
  { key: 'Content-Security-Policy', value: cspHeader },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Legacy MIME-sniffing protection; largely superseded by CSP but still
  // recommended baseline for browsers/versions that don't honor CSP fully.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Prevents the site from being framed elsewhere (clickjacking).
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dev-ubverse-backend.s3.us-east-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dev-assets.unboundxinc.us',
        pathname: '/**',
      },
    ],
  },
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
      {
        source: '/privacy-policy',
        destination: '/legal/privacy-policy',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/legal/privacy-policy',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/legal/terms-condition',
        permanent: true,
      },
      {
        source: '/terms-condition',
        destination: '/legal/terms-condition',
        permanent: true,
      },
      {
        source: '/terms-of-service',
        destination: '/legal/terms-condition',
        permanent: true,
      },
      {
        source: '/terms-of-use',
        destination: '/legal/terms-condition',
        permanent: true,
      },
      {
        source: '/terms-and-conditions',
        destination: '/legal/terms-condition',
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
