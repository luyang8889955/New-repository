# 视频转文字 API 服务

这是一个简单的视频转文字 API 服务，为小程序提供视频处理功能。

## 功能特点

- 接收视频链接
- 返回处理结果
- 支持跨域请求
- 包含健康检查接口

## API 接口

### 1. 处理视频

**POST** `/api/process-video`

请求体：
```json
{
  "videoUrl": "视频链接"
}
```

响应示例：
```json
{
  "success": true,
  "text": "转换后的文字内容",
  "duration": 180,
  "wordCount": 150
}
```

### 2. 健康检查

**GET** `/health`

响应示例：
```json
{
  "status": "ok",
  "timestamp": "2024-03-19T12:00:00Z"
}
```

## 部署说明

1. 克隆仓库
2. 安装依赖：`npm install`
3. 启动服务：`npm start`

## 环境要求

- Node.js >= 14
- npm >= 6

## 注意事项

当前版本返回模拟数据，用于演示和测试。实际的视频处理功能需要另行开发。