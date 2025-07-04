# 签到系统 API 文档

## 基础信息
- 基础URL: `http://localhost:3002`
- 数据格式: JSON
- 字符编码: UTF-8

## 接口列表

### 1. 用户登录
**POST** `/api/login`

**请求参数:**
```json
{
  "code": "微信登录code"
}
```

**响应示例:**
```json
{
  "success": true,
  "user": {
    "openid": "offline_mock_openid_1234567890",
    "nickname": "本地测试用户",
    "avatar": "/images/default-avatar.png",
    "points": 100
  }
}
```

### 2. 获取活动列表
**GET** `/api/activities`

**查询参数:**
- `type` (可选): 活动类型
- `creator_id` (可选): 创建者ID

**响应示例:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "每日签到",
      "type": 1,
      "creator_id": 1,
      "start_time": "2024-01-01 00:00:00",
      "end_time": "2024-12-31 23:59:59",
      "location": "公司",
      "description": "每日上班签到",
      "status": 1,
      "created_at": "2024-01-01 10:00:00"
    }
  ]
}
```

### 3. 创建活动
**POST** `/api/activities`

**请求参数:**
```json
{
  "title": "活动标题",
  "type": 1,
  "creator_id": 1,
  "start_time": "2024-01-01 00:00:00",
  "end_time": "2024-12-31 23:59:59",
  "location": "活动地点",
  "description": "活动描述"
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "id": 1
  }
}
```

### 4. 签到
**POST** `/api/sign`

**请求参数:**
```json
{
  "user_id": 1,
  "activity_id": 1,
  "geo_point": "116.397128,39.916527"
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "签到成功",
  "points": 10
}
```

### 5. 获取签到记录
**GET** `/api/records`

**查询参数:**
- `user_id` (可选): 用户ID
- `activity_id` (可选): 活动ID

**响应示例:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "activity_id": 1,
      "sign_time": "2024-01-01 09:00:00",
      "geo_point": "116.397128,39.916527",
      "status": 1,
      "nickname": "用户昵称",
      "title": "活动标题"
    }
  ]
}
```

### 6. 测试接口
**GET** `/api/test`

**响应示例:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T10:00:00.000Z",
  "node_version": "v18.17.0",
  "environment": "development"
}
```

### 7. Prometheus指标
**GET** `/metrics`

返回Prometheus格式的监控指标数据。

## 错误响应格式

```json
{
  "success": false,
  "message": "错误描述"
}
```

## 状态码说明

- `200`: 请求成功
- `400`: 请求参数错误
- `404`: 接口不存在
- `500`: 服务器内部错误

## 数据库表结构

### users 表
- `id`: 用户ID (主键)
- `openid`: 微信openid (唯一)
- `nickname`: 用户昵称
- `avatar`: 头像URL
- `points`: 积分
- `created_at`: 创建时间

### activities 表
- `id`: 活动ID (主键)
- `title`: 活动标题
- `type`: 活动类型
- `creator_id`: 创建者ID (外键)
- `start_time`: 开始时间
- `end_time`: 结束时间
- `location`: 活动地点
- `description`: 活动描述
- `status`: 活动状态 (1:正常, 0:禁用)
- `created_at`: 创建时间

### records 表
- `id`: 记录ID (主键)
- `user_id`: 用户ID (外键)
- `activity_id`: 活动ID (外键)
- `sign_time`: 签到时间
- `geo_point`: 地理位置
- `status`: 记录状态 (1:正常, 0:删除) 