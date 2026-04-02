# 🔮 AI职业罗盘

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.8-yellow)](https://www.python.org/))

> 分析各行各业被AI代替的程度和趋势，提供行业×学历双维度分析

---

## 🌟 项目简介

AI职业罗盘是一个创新的职业风险评估工具，通过数据驱动的方式，帮助用户了解AI技术对不同行业、不同学历层次职业的影响，并提供个性化的发展建议。

### 核心价值

- ✅ **拒绝恐慌营销**：用数据替代情绪，用"任务级分析"替代"岗位级替代"
- ✅ **双维度穿透**：行业垂直分析 × 学历水平交叉分析
- ✅ **动态预测**：基于权威机构模型，给出2025-2030年的趋势预测
- ✅ **个性化评估**：根据个人背景提供定制化的风险评估和转型建议

---

## ✨ 主要功能

### 1. 行业AI替代风险热力图

- 🎨 可视化10个主要行业的AI替代风险
- 📊 颜色编码风险等级（安全/中等/高风险/极高）
- 📅 年份预测滑块（2024-2035）
- 🎓 学历筛选（高中/大专/本科/硕士/博士）
- 📈 动态更新风险指数

### 2. 行业风险详情

- 🔍 每个行业的详细风险分析
- 📋 受影响岗位清单
- 💡 关键驱动因素
- 🛡️ 行业抗性因素

### 3. 个人职业风险评估

- 📝 行业选择和职位输入
- 🎓 学历和工作年限设置
- 📊 实时风险指数计算
- 🔍 任务级拆解分析
- 💡 转型建议推荐
- 📚 技能升级路径图

### 4. 数据亮点

- **覆盖范围**：20个主要行业
- **时间跨度**：2025-2030年
- **学历维度**：5个学历档次
- **任务分解**：100+个职业任务
- **数据源**：综合世界经济论坛、麦肯锡、Anthropic等权威机构

---

## 🚀 快速开始

### 方式1：仅启动前端（推荐快速体验）

```bash
# 1. 克隆项目
git clone https://github.com/Chensj1307/ai_career.git
cd ai_career/frontend

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 访问应用
# 浏览器打开 http://localhost:3000
```

### 方式2：完整启动（前端+后端）

#### 后端设置

```bash
# 1. 安装Python依赖
cd ai-career-compass/backend
pip install -r requirements.txt

# 2. 配置环境变量（可选）
cp .env.example .env
# 编辑 .env 文件，配置数据库连接

# 3. 启动后端服务
python -m app.main
# 或
uvicorn app.main:app --reload

# 4. 访问API文档
# 浏览器打开 http://localhost:8000/docs
```

#### 前端设置

```bash
# 在另一个终端
cd ai-career-compass/frontend

# 安装依赖
npm install

# 启动前端服务
npm run dev

# 访问应用
# 浏览器打开 http://localhost:3000
```

---

## 📁 项目结构

```
ai-career-compass/
├── frontend/                    # Next.js 前端
│   ├── src/
│   │   ├── app/              # 页面
│   │   │   ├── page.tsx      # 首页
│   │   │   ├── assessment/page.tsx  # 评估页
│   │   │   ├── industries/page.tsx   # 行业详情页
│   │   │   └── layout.tsx
│   │   ├── components/       # React组件
│   │   │   ├── charts/       # 可视化组件
│   │   │   │   ├── HeatMap.tsx
│   │   │   │   ├── TrendChart.tsx
│   │   │   │   └── TaskTree.tsx
│   │   │   ├── forms/        # 表单组件
│   │   │   │   └── AssessmentForm.tsx
│   │   │   └── ui/           # UI组件
│   │   ├── lib/             # 工具库
│   │   │   ├── api.ts        # API封装
│   │   │   └── utils.ts      # 工具函数
│   │   └── types/           # TypeScript类型
│   ├── package.json
│   ├── next.config.js
│   └── tsconfig.json
│
├── backend/                     # FastAPI 后端
│   ├── app/
│   │   ├── main.py           # FastAPI入口
│   │   ├── config.py         # 配置管理
│   │   ├── models/           # 数据模型
│   │   │   ├── industry.py
│   │   │   ├── occupation.py
│   │   │   └── user.py
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── routers/          # API路由
│   │   │   ├── industry.py
│   │   │   ├── occupation.py
│   │   │   └── assessment.py
│   │   ├── services/         # 业务逻辑
│   │   │   ├── replacement.py
│   │   │   └── analysis.py
│   │   └── db/               # 数据库
│   ├── requirements.txt
│   └── README.md
│
├── data/                        # 数据文件
│   ├── industry_replacement_rates.json  # 行业替代率数据
│   └── occupation_tasks.json            # 职业任务分解
│
├── docs/                        # 文档
│   ├── data_spec.md         # 数据规格
│   └── sources.md            # 数据源清单
│
├── manifest.json               # 应用配置（用于商店发布）
└── README.md                   # 项目说明
```

---

## 🛠️ 技术栈

### 前端

| 技术 | 版本 | 说明 |
|------|------|------|
| **框架** | Next.js 14 | React服务端渲染框架 |
| **语言** | TypeScript 5.3 | 类型安全 |
| **UI库** | Tailwind CSS | 实用优先的CSS框架 |
| **可视化** | ECharts 5.5 | 强大的图表库 |
| **状态管理** | Zustand 4.5 | 轻量级状态管理 |
| **HTTP客户端** | Axios 1.6 | Promise based HTTP client |

### 后端

| 技术 | 版本 | 说明 |
|------|------|------|
| **框架** | FastAPI 0.104 | 高性能异步Python Web框架 |
| **语言** | Python 3.8+ | 主要编程语言 |
| **ORM** | SQLAlchemy 2.0 | Python SQL工具包 |
| **数据库** | PostgreSQL 14+ | 关系型数据库 |
| **缓存** | Redis 6.0+ | 内存数据结构存储 |
| **API文档** | Swagger UI | 交互式API文档 |

---

## 📊 核心数据

### 行业替代率预测（2030年Top 5）

| 排名 | 行业 | 替代率 | 风险等级 |
|------|------|--------|----------|
| 1 | 租赁和商务服务业 | 80% | 🔴 极高风险 |
| 2 | 住宿和餐饮业 | 80% | 🔴 极高风险 |
| 3 | 信息传输、软件和信息技术服务业 | 78% | 🔴 极高风险 |
| 4 | 房地产业 | 73% | 🔴 高风险 |
| 5 | 批发和零售业 | 72% | 🔴 高风险 |

### 最安全行业（2030年Top 3）

| 排名 | 行业 | 替代率 | 风险等级 |
|------|------|--------|----------|
| 1 | 国际组织 | 15% | 🟢 安全 |
| 2 | 农、林、牧、渔业 | 22% | 🟢 安全 |
| 3 | 采矿业 | 35% | 🟢 安全 |

---

## 📖 API 文档

### 行业API

```bash
# 获取行业列表
GET /api/industries

# 获取行业详情
GET /api/industries/{id}

# 获取行业替代率趋势
GET /api/industries/{id}/replacement
```

### 职业API

```bash
# 获取职业列表
GET /api/occupations

# 获取职业任务分解
GET /api/ociupations/{id}/tasks
```

### 评估API

```bash
# 创建个人AI风险评估
POST /api/assess

# 获取评估结果
GET /api/assess/{session_id}
```

详细的API文档：运行后访问 `http://localhost:8000/docs`

---

## 🔮 数据来源

本项目的数据综合自以下权威机构：

- **世界经济论坛**《未来就业报告2023-2025》
- **麦肯锡全球研究院**《AI与就业影响研究》
- **Anthropic**《Claude能力评估报告》
- **OpenAI**《GPT能力分析》
- **国家统计局**就业监测数据
- **人社部**就业统计报告
- **智联招聘/Boss直聘**岗位需求趋势

**数据更新频率**：每年复核一次
**置信度**：80%

---

## 💡 核心洞察

### 什么最容易被AI替代？

✅ 重复性任务（数据录入、基础编程）  
✅ 标准化流程（客服话术、财务记账）  
✅ 信息处理（数据分析、报告生成）

### 什么最难被AI替代？

✅ 人际互动（心理咨询、销售谈判）  
✅ 创造性工作（设计、策划、创新）  
✅ 复杂决策（战略规划、资源调配）  
✅ 现场操作（医疗手术、建筑施工）

### 未来职业发展方向

1. **AI工具使用者** - 学会使用AI提升效率
2. **人机协作专家** - 擅长人与AI配合
3. **创新设计者** - AI无法模仿的创造力
4. **情感服务者** - 需要人类关怀的工作

---

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 📞 联系方式

- **项目主页**: https://github.com/Chensj1307/ai_career
- **问题反馈**: https://github.com/Chensj1307/ai_career/issues
- **邮箱**: support@ai-career-compass.com

---

## 🌟 致谢

感谢所有为本项目做出贡献的开发者！

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐️ Star**

**[⬆️ 回到顶部](#-ai-职业罗盘)**

</div>
