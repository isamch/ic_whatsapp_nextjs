/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.whatsapp.net' },
      { protocol: 'https', hostname: '**.whatsapp.com' },
    ],
  },
};

export default nextConfig;
