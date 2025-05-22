const express = require('express');
const cors = require('cors');
const app = express();

// 启用 CORS
app.use(cors());
app.use(express.json());

// 处理视频的 API 接口
app.post('/api/process-video', async (req, res) => {
  try {
    const { videoUrl } = req.body;
    
    // 记录请求信息
    console.log('收到视频处理请求:', videoUrl);
    
    // 模拟处理延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 返回模拟结果
    res.json({
      success: true,
      text: `这是来自视频的文字内容。\n\n视频链接：${videoUrl}\n\n这是一个示例文本，展示了视频转文字的效果。\n\n视频时长：3分钟\n识别文字数：150字\n\n注意：这是模拟数据，用于演示界面效果。实际的视频转文字功能需要集成专业的语音识别服务。`,
      duration: 180,
      wordCount: 150
    });
    
  } catch (error) {
    console.error('处理失败:', error);
    res.status(500).json({
      success: false,
      error: error.message || '处理失败'
    });
  }
});

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 首页
app.get('/', (req, res) => {
  res.send('视频转文字 API 服务正在运行');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});