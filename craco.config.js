// Allows configuration of create-react-app build process.
// ref: https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md
module.exports = {
  style: {
    postcss: {
      plugins: [require("autoprefixer")],
    },
  },
};
