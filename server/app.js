const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const winston = require('winston');
const prometheus = require('prom-client');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI || 'mongodb+srv://luyang2022:<db_password>@cluster0.urlceac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const app = express();

// 安全中间件配置
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"],
    }
  }
}));

app.use(rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW || 900000,
  max: process.env.RATE_LIMIT_MAX || 100
}));

// 配置中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 日志模块配置
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, 'logs/combined.log')
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Prometheus 指标
const metrics = {
  testEndpointCounter: new prometheus.Counter({
    name: 'test_endpoint_total',
    help: '测试接口调用次数'
  }),
  signInCounter: new prometheus.Counter({
    name: 'sign_in_total',
    help: '签到次数'
  })
};

// 监控模块
const { updateMetrics } = require('./utils/dbMonitor');

// 用户登录接口
app.post('/api/login', async (req, res) => {
  if (!db) {
    return res.status(500).json({ success: false, message: '数据库未连接' });
  }
  const { code } = req.body;
  // 模拟微信登录流程
  const mockUser = {
    openid: 'offline_mock_openid_' + Date.now(),
    nickname: '本地测试用户',
    avatar: '/images/default-avatar.png',
    points: 100
  };
  try {
    const users = db.collection('users');
    await users.updateOne(
      { openid: mockUser.openid },
      { $setOnInsert: mockUser },
      { upsert: true }
    );
    res.json({ success: true, user: mockUser });
  } catch (err) {
    logger.error('用户登录失败', { error: err.message });
    res.status(500).json({ success: false, message: '登录失败' });
  }
});

// 获取活动列表
app.get('/api/activities', async (req, res) => {
  if (!db) {
    return res.status(500).json({ success: false, message: '数据库未连接' });
  }
  const { type, creator_id, page = 1, pageSize = 10, title, id } = req.query;
  const query = { status: 1 };
  if (type) query.type = Number(type);
  if (creator_id) query.creator_id = Number(creator_id);
  if (title) query.title = { $regex: title, $options: 'i' };
  if (id) query._id = ObjectId.isValid(id) ? new ObjectId(id) : id;
  try {
    const activities = db.collection('activities');
    const result = await activities.find(query)
      .sort({ created_at: -1 })
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .toArray();
    res.json({ success: true, data: result });
  } catch (err) {
    logger.error('获取活动列表失败', { error: err.message });
    res.status(500).json({ success: false, message: '获取活动列表失败', error: err.message });
  }
});

// 创建活动
app.post('/api/activities', async (req, res) => {
  if (!db) {
    return res.status(500).json({ success: false, message: '数据库未连接' });
  }
  const { title, type, creator_id, start_time, end_time, location, description } = req.body;
  if (!title || !type || !creator_id) {
    return res.status(400).json({ success: false, message: '缺少必要参数' });
  }
  try {
    const activities = db.collection('activities');
    const doc = {
      title,
      type: Number(type),
      creator_id: Number(creator_id),
      start_time,
      end_time,
      location,
      description,
      status: 1,
      created_at: new Date()
    };
    const result = await activities.insertOne(doc);
    res.json({ success: true, data: { id: result.insertedId } });
  } catch (err) {
    logger.error('创建活动失败', { error: err.message });
    res.status(500).json({ success: false, message: '创建活动失败' });
  }
});

// 编辑活动
app.put('/api/activities/:id', async (req, res) => {
  if (!db) {
    return res.status(500).json({ success: false, message: '数据库未连接' });
  }
  const id = req.params.id;
  const { title, description, start_time, end_time, location, type } = req.body;
  if (!title || !start_time || !end_time) {
    return res.status(400).json({ success: false, message: '请填写完整' });
  }
  try {
    const activities = db.collection('activities');
    await activities.updateOne(
      { _id: ObjectId.isValid(id) ? new ObjectId(id) : id },
      { $set: { title, description, start_time, end_time, location, type: Number(type) } }
    );
    res.json({ success: true });
  } catch (err) {
    logger.error('编辑活动失败', { error: err.message });
    res.status(500).json({ success: false, message: '编辑活动失败' });
  }
});

// 签到接口
app.post('/api/sign', async (req, res) => {
  if (!db) {
    return res.status(500).json({ success: false, message: '数据库未连接' });
  }
  const { user_id, activity_id, geo_point } = req.body;
  if (!user_id || !activity_id) {
    return res.status(400).json({ success: false, message: '缺少必要参数' });
  }
  try {
    const records = db.collection('records');
    const exist = await records.findOne({ user_id: Number(user_id), activity_id: activity_id, status: 1 });
    if (exist) {
      return res.status(400).json({ success: false, message: '您已经签到过了' });
    }
    await records.insertOne({ user_id: Number(user_id), activity_id: activity_id, geo_point, status: 1, sign_time: new Date() });
    // 更新用户积分
    const users = db.collection('users');
    await users.updateOne({ _id: ObjectId.isValid(user_id) ? new ObjectId(user_id) : user_id }, { $inc: { points: 10 } });
    res.json({ success: true, message: '签到成功', points: 10 });
  } catch (err) {
    logger.error('签到失败', { error: err.message });
    res.status(500).json({ success: false, message: '签到失败' });
  }
});

// 获取签到记录
app.get('/api/records', async (req, res) => {
  if (!db) {
    return res.status(500).json({ success: false, message: '数据库未连接' });
  }
  const { user_id, activity_id } = req.query;
  const query = { status: 1 };
  if (user_id) query.user_id = Number(user_id);
  if (activity_id) query.activity_id = activity_id;
  try {
    const records = db.collection('records');
    const result = await records.find(query).sort({ sign_time: -1 }).toArray();
    res.json({ success: true, data: result });
  } catch (err) {
    logger.error('获取签到记录失败', { error: err.message });
    res.status(500).json({ success: false, message: '获取签到记录失败' });
  }
});

// 测试接口
app.get('/api/test', (req, res) => {
  try {
    logger.info('测试接口被调用', { query: req.query });
    
    if(Object.keys(req.query).length > 3) {
      return res.status(400).json({ 
        error: 'EXCEED_MAX_PARAMS',
        message: '最多允许3个查询参数'
      });
    }

    res.json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      node_version: process.version,
      environment: process.env.NODE_ENV || 'development'
    });

    metrics.testEndpointCounter.inc();
  } catch (error) {
    logger.error('测试接口异常', { error: error.message });
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: '服务端处理异常'
    });
  }
});

// 导出 Prometheus 指标端点
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});

// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error('服务器错误', { error: err.message, stack: err.stack });
  res.status(500).json({ success: false, message: '服务器内部错误' });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ success: false, message: '接口不存在' });
});

// 端口监听
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  logger.info(`服务器启动成功`, { port: PORT });
});

module.exports = app;