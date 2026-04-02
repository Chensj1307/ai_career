"""
职业数据模型
"""
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Occupation(Base):
    """职业表"""
    __tablename__ = "occupations"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, index=True, nullable=False, comment="职业代码")
    name = Column(String(100), nullable=False, comment="职业名称")
    description = Column(Text, comment="职业描述")
    category = Column(String(50), comment="职业分类")
    
    # 外键 - 行业
    industry_id = Column(Integer, ForeignKey("industries.id"), nullable=False, index=True)
    
    # 核心能力要求
    required_skills = Column(Text, comment="所需技能(JSON数组)")
    cognitive_demand = Column(Float, comment="认知需求程度 0-1")
    physical_demand = Column(Float, comment="体力需求程度 0-1")
    social_demand = Column(Float, comment="社交需求程度 0-1")
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # 关联
    industry = relationship("Industry", back_populates="occupations")
    tasks = relationship("Task", back_populates="occupation")


class Task(Base):
    """任务表 - 职业任务分解"""
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    occupation_id = Column(Integer, ForeignKey("occupations.id"), nullable=False, index=True)
    
    name = Column(String(200), nullable=False, comment="任务名称")
    description = Column(Text, comment="任务描述")
    
    # 任务特性
    routine_level = Column(Float, comment="常规程度 0-1 (越高越容易被AI替代)")
    creativity_level = Column(Float, comment="创造力要求 0-1")
    human_interaction = Column(Float, comment="人际互动程度 0-1")
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # 关联
    occupation = relationship("Occupation", back_populates="tasks")


class ReplacementRate(Base):
    """替代率表 - AI替代率历史趋势"""
    __tablename__ = "replacement_rates"
    
    id = Column(Integer, primary_key=True, index=True)
    industry_id = Column(Integer, ForeignKey("industries.id"), nullable=False, index=True)
    occupation_id = Column(Integer, ForeignKey("occupations.id"), nullable=True, index=True)
    
    year = Column(Integer, nullable=False, comment="年份")
    month = Column(Integer, nullable=True, comment="月份")
    
    # 替代率数据
    replacement_rate = Column(Float, nullable=False, comment="替代率 0-1")
    confidence = Column(Float, default=0.0, comment="置信度")
    data_source = Column(String(100), comment="数据来源")
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 关联
    industry = relationship("Industry", back_populates="replacement_rates")
    occupation = relationship("Occupation")
