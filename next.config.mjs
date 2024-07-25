/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY
    },
    images: {
        domains: ['images.pexels.com'],
      },
};


export default nextConfig;
