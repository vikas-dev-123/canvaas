/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
          'res.cloudinary.com',
          'subdomain',
          'files.stripe.com',
        ],
      },
      reactStrictMode: false,
};

export default nextConfig;
