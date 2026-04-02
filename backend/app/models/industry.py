"""
行业数据模型
"""
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Industry(Base):
    """行业表"""
    __tablename__ = "industries"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, index=True, nullable=False, comment="行业代码")
    name = Column(String(100), nullable=False, comment="行业名称")
    description = Column(Text, comment="行业描述")
    category = Column(String(50), comment="行业分类")
    ai_adoption_level = Column(String(20), comment="AI采用程度: low/medium/high")
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # 关联
    occupations = relationship("Occupation", back_populates="industry")
    replacement_rates = relationship("ReplacementRate", back_populates="industry")
