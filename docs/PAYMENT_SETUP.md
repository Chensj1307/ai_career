# 支付功能配置说明

本文档介绍如何配置和使用微信支付、支付宝支付功能。

## 目录

1. [功能概述](#功能概述)
2. [后端配置](#后端配置)
3. [前端配置](#前端配置)
4. [微信支付配置](#微信支付配置)
5. [支付宝配置](#支付宝配置)
6. [测试支付](#测试支付)
7. [生产环境部署](#生产环境部署)

## 功能概述

本系统支持以下支付方式：

- **微信支付**：支持微信内置浏览器JSAPI支付、H5支付
- **支付宝支付**：支持支付宝JSAPI支付、网页支付

### 支付流程

1. 用户在前端选择会员等级和支付方式
2. 后端创建支付订单，返回支付参数
3. 前端调用对应支付SDK发起支付
4. 用户完成支付后，支付平台异步通知后端
5. 后端更新订单状态并开通会员权益
6. 前端轮询或接收通知刷新会员状态

## 后端配置

### 1. 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

### 2. 数据库配置

系统会自动创建以下数据表：

- `payment_orders` - 支付订单表
- `user_memberships` - 用户会员信息表
- `payment_configs` - 支付配置表
- `membership_prices` - 会员价格配置表

### 3. 环境变量配置

在 `backend/.env` 文件中添加以下配置：

```env
# 微信支付配置
WECHAT_APP_ID=your_wechat_app_id
WECHAT_MCH_ID=your_wechat_mch_id
WECHAT_API_KEY=your_wechat_api_key
WECHAT_APP_SECRET=your_wechat_app_secret
WECHAT_NOTIFY_URL=https://your-domain.com/api/payment/notify/wechat

# 支付宝配置
ALIPAY_APP_ID=your_alipay_app_id
ALIPAY_APP_PRIVATE_KEY=your_alipay_private_key
ALIPAY_PUBLIC_KEY=alipay_public_key
ALIPAY_NOTIFY_URL=https://your-domain.com/api/payment/notify/alipay
ALIPAY_RETURN_URL=https://your-domain.com/api/payment/return/alipay

# 支付环境 (sandbox/production)
PAYMENT_ENV=sandbox
```

## 前端配置

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 环境变量配置

在 `frontend/.env.local` 文件中添加：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_PAYMENT_ENV=sandbox
```

## 微信支付配置

### 1. 申请微信支付商户号

1. 登录 [微信支付商户平台](https://pay.weixin.qq.com/)
2. 注册并认证商户号
3. 获取以下信息：
   - AppID（公众号或小程序ID）
   - 商户号（MCH ID）
   - API密钥
   - AppSecret

### 2. 配置支付授权目录

在微信支付商户平台中配置：

- 支付授权目录：`https://your-domain.com/`
- JSAPI支付授权目录：`https://your-domain.com/membership`

### 3. 配置服务器IP白名单

将服务器IP地址添加到微信支付白名单中。

### 4. 下载API证书

在商户平台下载API证书，用于退款等操作。

## 支付宝配置

### 1. 申请支付宝应用

1. 登录 [支付宝开放平台](https://open.alipay.com/)
2. 创建应用并获取 AppID
3. 配置应用功能：
   - 手机网站支付
   - 电脑网站支付
   - APP支付（可选）

### 2. 生成密钥对

使用支付宝密钥工具生成RSA2密钥对：

```bash
# 下载支付宝密钥工具
# https://opendocs.alipay.com/common/02kipl

# 生成密钥对后，将公钥上传到支付宝开放平台
# 私钥保存在服务器
```

### 3. 配置应用公钥

在支付宝开放平台上传应用公钥，获取支付宝公钥。

### 4. 配置回调地址

在应用设置中配置：

- 授权回调地址：`https://your-domain.com/api/payment/return/alipay`
- 异步通知地址：`https://your-domain.com/api/payment/notify/alipay`

## 测试支付

### 沙箱环境测试

#### 微信支付沙箱

1. 在微信支付商户平台开启沙箱环境
2. 使用沙箱AppID和密钥进行测试
3. 测试账号：
   - 沙箱微信号：在商户平台获取
   - 支付密码：在商户平台设置

#### 支付宝沙箱

1. 在支付宝开放平台开启沙箱环境
2. 使用沙箱AppID和密钥
3. 下载 [支付宝沙箱钱包APP](https://open.alipay.com/develop/sandbox/tool)
4. 使用沙箱账号登录测试

### 测试流程

1. 启动后端服务：
   ```bash
   cd backend
   python -m app.main
   ```

2. 启动前端服务：
   ```bash
   cd frontend
   npm run dev
   ```

3. 访问会员页面，选择高级会员
4. 选择支付方式（微信/支付宝）
5. 完成支付流程
6. 验证会员状态是否更新

## 生产环境部署

### 1. 安全配置

- 使用HTTPS协议
- 配置防火墙，只允许必要端口
- 定期更换API密钥
- 启用日志记录和监控

### 2. 性能优化

- 使用Redis缓存支付配置
- 数据库索引优化
- 异步处理支付回调
- 设置合理的超时时间

### 3. 监控告警

配置以下监控项：

- 支付成功率
- 支付响应时间
- 异常订单数量
- 服务器资源使用情况

### 4. 备份策略

- 定期备份支付订单数据
- 备份支付配置
- 保留支付日志

## API接口文档

### 创建支付订单

```http
POST /api/payment/create
Content-Type: application/json

{
  "membership_level": "premium",
  "payment_method": "wechat",
  "return_url": "https://your-domain.com/membership"
}
```

### 查询支付状态

```http
GET /api/payment/query/{order_no}
```

### 取消支付

```http
POST /api/payment/cancel
Content-Type: application/json

{
  "order_no": "PAY202401011200000001",
  "reason": "用户取消"
}
```

## 常见问题

### Q: 支付回调没有收到怎么办？

A: 检查以下几点：
1. 服务器是否可以被外网访问
2. 回调URL配置是否正确
3. 防火墙是否放行了回调端口
4. 查看服务器日志确认是否收到请求

### Q: 微信支付提示"商户号该产品权限未开通"？

A: 需要在微信支付商户平台开通相应的产品权限：
1. 登录商户平台
2. 进入"产品中心"
3. 申请开通JSAPI支付或H5支付

### Q: 支付宝支付提示"Insufficient Permissions"？

A: 检查应用是否签约了相应的产品：
1. 登录支付宝开放平台
2. 进入应用详情
3. 查看"功能列表"是否包含所需功能
4. 如未签约，点击"签约"

### Q: 如何退款？

A: 系统暂未实现退款功能，需要手动处理：
1. 登录微信支付商户平台或支付宝商家中心
2. 找到对应订单进行退款
3. 在后端数据库手动更新订单状态

## 技术支持

- 微信支付文档：https://pay.weixin.qq.com/wiki/doc/apiv3/index.shtml
- 支付宝文档：https://opendocs.alipay.com/
- FastAPI文档：https://fastapi.tiangolo.com/

## 更新日志

### v1.0.0 (2024-01-01)

- 初始版本
- 支持微信支付和支付宝支付
- 支持会员购买功能
- 支持支付回调处理
