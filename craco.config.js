module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.ignoreWarnings = [
        function ignoreSourcemapsloaderWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource &&
            warning.module.resource.includes('node_modules') &&
            warning.details &&
            warning.details.includes('source-map-loader')
          )
        },
      ]
      return webpackConfig
    },
  },
  eslint: {
    enable: true,
    configure: (eslintConfig) => {
      // Remove CRA's react plugin references
      delete eslintConfig.plugins
      delete eslintConfig.extends

      // Let your own .eslintrc.json fully define the config
      return eslintConfig
    },
    mode: 'file', // force ESLint to use your .eslintrc.json
  },
}
