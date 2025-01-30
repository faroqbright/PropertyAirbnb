/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/Landing/Home',
          permanent: true,
        },
      ];
    },
  };
  
  export default nextConfig;
  