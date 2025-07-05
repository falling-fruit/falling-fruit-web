module.exports = {
  name: 'web',
  script: 'serve',
  watch: false,
  env: {
    NODE_ENV: 'production',
    PM2_SERVE_PATH: 'build',
    PM2_SERVE_PORT: 8082,
    PM2_SERVE_SPA: 'true',
    PM2_SERVE_HOMEPAGE: '/index.html',
  },
  exec_mode: 'cluster',
  instances: 4,
  merge_logs: true,
}
