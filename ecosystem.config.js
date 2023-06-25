module.exports = {
  name: 'web',
  script: 'serve',
  watch: true,
  env: {
    NODE_ENV: 'production',
    PM2_SERVE_PATH: 'build',
    PM2_SERVE_PORT: 8082,
    PM2_SERVE_SPA: 'true',
    PM2_SERVE_HOMEPAGE: '/index.html',
  },
}
