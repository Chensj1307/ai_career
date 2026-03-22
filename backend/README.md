# AI Career Compass Backend

AI职业罗盘后端服务 - FastAPI + PostgreSQL + Redis

## 项目简介

AI职业罗盘是一个分析各行各业被AI代替程度和趋势的平台，提供行业×学历双维度分析。

## 技术栈

- **后端框架**: FastAPI (Python)
- **数据库**: PostgreSQL + pgvector
- **缓存**: Redis
- **ORM**: SQLAlchemy
- **API文档**: Swagger UI / ReDoc

## 项目结构

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI主入口
│   ├── config.py            # 配置管理
│   ├── models/              # 数据模型
│   │   ├── industry.py
│   │   ├── occupation.py
│   │   └── user.py
│   ├── schemas/             # Pydantic schemas
│   │   ├── industry.py
│   │   └── assessment.py
│   ├── routers/             # API路由
│   │   ├── industry.py
│   │   ├── occupation.py
│   │   └── assessment.py
│   ├── services/            # 业务逻辑
│   │   ├── replacement.py
│   │   └── analysis.py
│   └── db/
│       ├── __init__.py
│       └── database.py
├── requirements.txt
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

### 2. 配置环境变量

创建 `.env` 文件：

```env
# 应用配置
APP_NAME=AI Career Compass
DEBUG=true
HOST=0.0.0.0
PORT=8000

# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/ai_career_compass

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# JWT配置（可选）
SECRET_KEY=your-secret-key-change-in-production
```

### 3. 启动服务

```bash
# 开发模式
uvicorn app.main:app --reload

# 或运行main.py
python -m app.main
```

### 4. 访问API文档

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API 端点

### 行业API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/industries | 获取行业列表 |
| GET | /api/industries/{id} | 获取行业详情 |
| GET | /api/industries/{id}/replacement | 获取行业替代率趋势 |

### 职业API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/occupations | 获取职业列表 |
| GET | /api/occupations/{id} | 获取职业详情 |
| GET | /api/occupations/{id}/tasks | 获取职业任务分解 |

### 评估API

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/assess | 创建个人AI风险评估 |
| GET | /api/assess/{session_id} | 获取评估结果 |

## 数据模型

### Industry (行业)
- `id`: 主键
- `code`: 行业代码
- `name`: 行业名称
- `description`: 行业描述
- `category`: 行业分类
- `ai_adoption_level`: AI采用程度

### Occupation (职业)
- `id`: 主键
- `code`: 职业代码
- `name`: 职业名称
- `industry_id`: 所属行业
- `required_skills`: 所需技能
- `cognitive_demand`: 认知需求
- `physical_demand`: 体力需求
- `social_demand`: 社交需求

### Task (任务)
- `id`: 主键
- `occupation_id`: 所属职业
- `name`: 任务名称
- `routine_level`: 常规程度
- `creativity_level`: 创造力要求
- `human_interaction`: 人际互动程度

### ReplacementRate (替代率)
- `id`: 主键
- `industry_id`: 行业ID
- `occupation_id`: 职业ID(可选)
- `year`: 年份
- `month`: 月份
- `replacement_rate`: 替代率

### UserAssessment (用户评估)
- `id`: 主键
- `session_id`: 会话ID
- `education_level`: 学历
- `work_experience`: 工作年限
- `industry_id`: 行业ID
- `occupation_id`: 职业ID
- `risk_score`: 风险分数
- `risk_level`: 风险等级

## 后续规划

- [ ] 添加用户认证系统
- [ ] 实现向量搜索(pgvector)
- [ ] 添加数据导入脚本
- [ ] 完善测试用例
- [ ] 部署配置

## License

MIT
