"""
应用配置管理
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """应用配置"""
    
    # 应用基础配置
    app_name: str = "AI Career Compass"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # 服务器配置
    host: str = "0.0.0.0"
    port: int = 8000
    
    # 数据库配置
    database_url: str = "postgresql://user:password@localhost:5432/ai_career_compass"
    
    # Redis配置
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_db: int = 0
    redis_password: Optional[str] = None
    
    # pgvector配置
    use_pgvector: bool = True
    
    # API配置
    api_prefix: str = "/api"
    
    # CORS配置
    cors_origins: list = ["*"]
    
    # JWT配置（可选）
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()
