const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env }) => {
      const isProduction = env === 'production';

      // ─── Code splitting ───────────────────────────────────────────
      webpackConfig.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 6,
        cacheGroups: {
          // React core — changes rarely, long cache lifetime
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
            name: 'chunk-react',
            priority: 40,
            reuseExistingChunk: true,
          },
          // Everything else from node_modules
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'chunk-vendors',
            priority: 20,
            reuseExistingChunk: true,
          },
        },
      };

      // ─── Gzip compression (production only) ───────────────────────
      if (isProduction) {
        webpackConfig.plugins.push(
          new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240, // only compress files > 10kb
            minRatio: 0.8,
          })
        );
      }

      return webpackConfig;
    },
  },
};