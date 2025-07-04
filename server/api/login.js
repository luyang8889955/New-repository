const connectToDatabase = require('./_mongo');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
    return;
  }
  const { code } = req.body;
  const mockUser = {
    openid: 'offline_mock_openid_' + Date.now(),
    nickname: '本地测试用户',
    avatar: '/images/default-avatar.png',
    points: 100
  };
  try {
    const db = await connectToDatabase();
    const users = db.collection('users');
    await users.updateOne(
      { openid: mockUser.openid },
      { $setOnInsert: mockUser },
      { upsert: true }
    );
    res.status(200).json({ success: true, user: mockUser });
  } catch (err) {
    res.status(500).json({ success: false, message: '登录失败', error: err.message });
  }
}; 