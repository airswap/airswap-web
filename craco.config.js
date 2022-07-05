// Allows configuration of create-react-app build process.
// ref: https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md

const cracoEnvPlugin = require('craco-plugin-env')

module.exports = {
  style: {
    postcss: {
      plugins: [require("autoprefixer")],
    },
  },
  plugins: [
    {
      plugin: cracoEnvPlugin,
      options: {
        variables: {
          BUILD_VERSION: require('child_process')
              .execSync('git rev-parse HEAD', { cwd: __dirname })
              .toString().trim(),
          BUILD_DATE: require('child_process')
              .execSync('git show -s --format=%ci', { cwd: __dirname })
              .toString().trim(),
        }
      }
    }
  ],
};
