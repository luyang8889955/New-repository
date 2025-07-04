const connectToDatabase = require('./_mongo');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
    return;
  }
  const { user_id, activity_id, geo_point } = req.body;
  if (!user_id || !activity_id) {
    return res.status(400).json({ success: false, message: '缺少必要参数' });
  }
  try {
    const db = await connectToDatabase();
    const records = db.collection('records');
    const exist = await records.findOne({ user_id: Number(user_id), activity_id: activity_id, status: 1 });
    if (exist) {
      return res.status(400).json({ success: false, message: '您已经签到过了' });
    }
    await records.insertOne({ user_id: Number(user_id), activity_id: activity_id, geo_point, status: 1, sign_time: new Date() });
    // 更新用户积分
    const users = db.collection('users');
    await users.updateOne({ _id: ObjectId.isValid(user_id) ? new ObjectId(user_id) : user_id }, { $inc: { points: 10 } });
    res.status(200).json({ success: true, message: '签到成功', points: 10 });
  } catch (err) {
    res.status(500).json({ success: false, message: '签到失败', error: err.message });
  }
}; 