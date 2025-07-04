module.exports = {
  apps: [{
    name: 'qiandao-server',
    script: './app.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3002
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    watch: ['app.js', '.env'],
    ignore_watch: ['node_modules']
  }]
};