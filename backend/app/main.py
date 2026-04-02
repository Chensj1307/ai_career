"""
AI Career Compass - FastAPI 主入口
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
# from app.db.database import init_db  # 暂时禁用数据库初始化
from app.routers import industry, occupation, assessment, payment


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时初始化数据库
    # init_db()  # 暂时禁用数据库初始化
    yield
    # 关闭时清理资源
    pass


# 创建FastAPI应用
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="""
## AI职业罗盘 API

分析各行各业被AI代替的程度和趋势，提供行业×学历双维度分析。

### 功能特性
- 行业查询与AI替代率趋势分析
- 职业查询与任务分解
- 个人AI风险评估

### 技术栈
- FastAPI + SQLAlchemy + PostgreSQL + Redis
    """,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 注册路由
app.include_router(industry.router, prefix=settings.api_prefix)
app.include_router(occupation.router, prefix=settings.api_prefix)
app.include_router(assessment.router, prefix=settings.api_prefix)
app.include_router(payment.router, prefix=settings.api_prefix)


@app.get("/")
def root():
    """根路径"""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )
