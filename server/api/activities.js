const connectToDatabase = require('./_mongo');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
    return;
  }
  const { type, creator_id, page = 1, pageSize = 10, title, id } = req.query;
  const query = { status: 1 };
  if (type) query.type = Number(type);
  if (creator_id) query.creator_id = Number(creator_id);
  if (title) query.title = { $regex: title, $options: 'i' };
  if (id) query._id = ObjectId.isValid(id) ? new ObjectId(id) : id;
  try {
    const db = await connectToDatabase();
    const activities = db.collection('activities');
    const result = await activities.find(query)
      .sort({ created_at: -1 })
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .toArray();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: '获取活动列表失败', error: err.message });
  }
}; 