// Allows configuration of create-react-app build process.
// ref: https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md

const fs = require('fs')
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
};
