class RequireEnvVarsPlugin {
  constructor(requiredVars) {
    this.requiredVars = requiredVars
  }

  apply(compiler) {
    compiler.hooks.beforeCompile.tap('RequireEnvVarsPlugin', () => {
      const missingVars = this.requiredVars.filter(
        (varName) => process.env[varName] === undefined,
      )

      if (missingVars.length > 0) {
        throw new Error(
          `Build failed: Missing required environment variables:\n${missingVars
            .map((v) => `  - ${v}`)
            .join('\n')}`,
        )
      }
    })
  }
}

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

      webpackConfig.plugins.push(
        new RequireEnvVarsPlugin([
          'REACT_APP_API_URL',
          'REACT_APP_API_KEY',
          'REACT_APP_RECAPTCHA_SITE_KEY',
          'REACT_APP_GOOGLE_MAPS_API_KEY',
        ]),
      )

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
