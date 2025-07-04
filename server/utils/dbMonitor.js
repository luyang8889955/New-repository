const prometheus = require('prom-client');

const poolSize = new prometheus.Gauge({
  name: 'db_pool_size',
  help: '当前数据库连接池容量',
  labelNames: ['status']
});

module.exports = {
  updateMetrics: (pool) => {
    poolSize.labels('total').set(pool.size);
    poolSize.labels('available').set(pool.available);
    poolSize.labels('borrowed').set(pool.borrowed);
  }
};