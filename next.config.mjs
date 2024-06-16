/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: config => {
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
      return config;
  },
  async headers() {
      return [
          {
              source: '/(.*)',
              headers: [
                  {
                      key: 'Content-Security-Policy',
                      value: "frame-src 'self' https://www.youtube.com/;",
                  },
              ],
          },
      ];
  },
};

export default nextConfig;
