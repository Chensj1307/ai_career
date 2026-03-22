"""
用户相关数据模型
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class UserAssessment(Base):
    """用户评估记录表"""
    __tablename__ = "user_assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), unique=True, index=True, nullable=False, comment="会话ID")
    
    # 用户基本信息
    education_level = Column(String(50), comment="学历: high_school/associate/bachelor/master/doctoral")
    work_experience = Column(Integer, comment="工作年限")
    
    # 评估的职业/行业
    industry_id = Column(Integer, ForeignKey("industries.id"), nullable=False, index=True)
    occupation_id = Column(Integer, ForeignKey("occupations.id"), nullable=False, index=True)
    
    # 评估结果
    risk_score = Column(Float, nullable=False, comment="风险分数 0-100")
    risk_level = Column(String(20), nullable=False, comment="风险等级: low/medium/high/critical")
    
    # 详细分析
    analysis_result = Column(JSON, comment="详细分析结果(JSON)")
    recommendations = Column(Text, comment="建议")
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), comment="过期时间")
    
    # 关联
    industry = relationship("Industry")
    occupation = relationship("Occupation")
