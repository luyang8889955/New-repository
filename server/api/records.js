const connectToDatabase = require('./_mongo');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
    return;
  }
  const { user_id, activity_id } = req.query;
  const query = { status: 1 };
  if (user_id) query.user_id = Number(user_id);
  if (activity_id) query.activity_id = activity_id;
  try {
    const db = await connectToDatabase();
    const records = db.collection('records');
    const result = await records.find(query).sort({ sign_time: -1 }).toArray();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: '获取签到记录失败', error: err.message });
  }
}; 