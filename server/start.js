const app = require('./app');

// 测试数据库连接
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('qiandao.db');

db.get('SELECT sqlite_version() as version', (err, row) => {
  if (err) {
    console.error('数据库连接测试失败:', err.message);
  } else {
    console.log('数据库连接测试成功，SQLite版本:', row.version);
  }
  db.close();
});

console.log('后端服务启动完成！');
console.log('可用接口:');
console.log('- POST /api/login - 用户登录');
console.log('- GET  /api/activities - 获取活动列表');
console.log('- POST /api/activities - 创建活动');
console.log('- POST /api/sign - 签到');
console.log('- GET  /api/records - 获取签到记录');
console.log('- GET  /api/test - 测试接口');
console.log('- GET  /metrics - Prometheus指标'); 