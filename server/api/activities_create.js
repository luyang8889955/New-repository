const connectToDatabase = require('./_mongo');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
    return;
  }
  const { title, type, creator_id, start_time, end_time, location, description } = req.body;
  if (!title || !type || !creator_id) {
    return res.status(400).json({ success: false, message: '缺少必要参数' });
  }
  try {
    const db = await connectToDatabase();
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
    res.status(200).json({ success: true, data: { id: result.insertedId } });
  } catch (err) {
    res.status(500).json({ success: false, message: '创建活动失败', error: err.message });
  }
}; 