# 🚀 快速开始

## 5分钟快速体验

### 前置要求

- Node.js 18+ 和 npm 9+
- 2GB 可用内存
- 500MB 磁盘空间

### 快速步骤

```bash
# 1. 克隆项目
git clone https://github.com/your-username/ai-career-compass.git
cd ai-career-compass/frontend

# 2. 安装依赖
npm install

# 3. 启动服务
npm run dev

# 4. 访问应用
# 浏览器打开 http://localhost:3000
```

完成！🎉 你现在可以看到AI职业罗盘的完整界面了。

---

## 📱 页面导航

### 首页 - http://localhost:3000

- 🔮 AI时代职业风险指南
- 📊 行业AI替代风险热力图
- 📅 年份预测滑块
- 🎓 学历层次选择
- 🏭 10个行业风险详情

### 个人评估 - http://localhost:3000/assessment

- 📝 个人职业风险评估表单
- 🔍 实时风险指数计算
- 📋 任务分解分析
- 💡 转型建议推荐

---

## 🎯 功能体验

### 1. 查看行业风险

- 拖动年份滑块，查看不同年份的风险变化
- 切换学历，查看对不同学历的影响
- 点击行业卡片，查看详细信息

### 2. 个人风险评估

- 选择你的行业
- 输入你的职位
- 选择你的学历
- 点击"开始评估"，查看结果

---

## 📊 核心数据速查

### 最高风险行业（2030年）

| 排名 | 行业 | 替代率 |
|------|------|--------|
| 1 | 租赁和商务服务业 | 80% |
| 2 | 住宿和餐饮业 | 80% |
| 3 | IT行业 | 78% |

### 最安全行业（2030年）

| 排名 | 行业 | 替代率 |
|------|------|--------|
| 1 | 国际组织 | 15% |
| 2 | 农林牧渔业 | 22% |
| 3 | 采矿业 | 35% |

---

## ❓ 常见问题

### Q: 端口3000被占用怎么办？

```bash
# 修改启动端口
npm run dev -- -p 4000

# 然后访问 http://localhost:4000
```

### Q: npm install 失败？

```bash
# 清除缓存重试
npm cache clean --force
rm -rf node_modules
npm install
```

### Q: 页面显示空白？

```bash
# 检查是否正确启动
npm run dev

# 查看终端输出，确认没有错误
```

---

## 📚 下一步

- 查看 [README.md](../README.md) 了解详细功能
- 查看 [发布指南.md](../发布指南.md) 了解如何发布
- 查看 [后端文档](../backend/README.md) 了解API

---

**需要帮助？** 🆘

- 查看 [GitHub Issues](https://github.com/your-username/ai-career-compass/issues)
- 发送邮件：support@ai-career-compass.com
