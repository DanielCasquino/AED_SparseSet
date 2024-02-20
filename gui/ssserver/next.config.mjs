/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        // Add file-loader for mp3 files
        config.module.rules.push({
            test: /\.mp3$/,
            use: {
                loader: 'file-loader',
                options: {
                    publicPath: '/_next',
                    name: 'static/media/[name].[hash].[ext]',
                },
            },
        });

        return config;
    },
};

export default nextConfig;
