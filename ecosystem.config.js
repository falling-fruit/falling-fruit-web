//Knip marks this file as unused, but is still needed for future development purposes.
module.exports = {
  name: 'web',
  script: 'node_modules/.bin/serve',
  args: '-p 8082 ./build',
  watch: false,
  env: {
    NODE_ENV: 'production',
  },
  exec_mode: 'cluster',
  instances: 4,
  merge_logs: true,
}
