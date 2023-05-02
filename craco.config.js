// Allows configuration of create-react-app build process.
// ref: https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md

const fs = require('fs')
const cracoEnvPlugin = require('craco-plugin-env')

module.exports = {
  style: {
    postcssOptions: {
      plugins: [require("autoprefixer")],
    },
  },
  plugins: [
    {
      plugin: cracoEnvPlugin,
      options: {
        variables: {
          BUILD_VERSION: fs.existsSync('.git') ? require('child_process')
              .execSync('git rev-parse HEAD', { cwd: __dirname })
              .toString().trim() : 'DEV',
          BUILD_DATE: fs.existsSync('.git') ? require('child_process')
              .execSync('git show -s --format=%ci', { cwd: __dirname })
              .toString().trim() : new Date().toLocaleDateString(),
        }
      }
    }
  ],
  webpack: {
    configure: {
      externals: ['express'],
      ignoreWarnings: [/Failed to parse source map/],
      resolve: {
        fallback: {
          url: require.resolve("browserify-url"),
          https: require.resolve("https-browserify"),
          http: require.resolve("http-browserify"),
          tls: require.resolve("tls-browserify"),
          net: require.resolve("net-browserify"),
          stream: require.resolve("stream-browserify"),
          crypto: require.resolve("crypto-browserify"),
          zlib: require.resolve("zlib-browserify"),
          path: false,
          fs: false,
          util: false,
          async_hooks: false,
          assert: false
        },
      },
    },
  },
};
