/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin/index.html',
      },
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    // Exclude the old app directory from compilation
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      include: /app\/(?!.*node_modules)/,
      exclude: [/node_modules/, /app/],
      use: 'ignore-loader'
    });
    return config;
  },
};

export default nextConfig;
