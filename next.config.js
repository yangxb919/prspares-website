/** @type {import('next').NextConfig} */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseHostname = 'eiikisplpnbeiscunkap.supabase.co';
try {
  if (url) supabaseHostname = new URL(url).hostname;
} catch (_) {
  // keep default if env is malformed
}

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: supabaseHostname,
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'pplx-res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
