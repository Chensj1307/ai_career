"""
行业相关Pydantic Schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class IndustryBase(BaseModel):
    """行业基础Schema"""
    code: str = Field(..., description="行业代码")
    name: str = Field(..., description="行业名称")
    description: Optional[str] = Field(None, description="行业描述")
    category: Optional[str] = Field(None, description="行业分类")
    ai_adoption_level: Optional[str] = Field(None, description="AI采用程度")


class IndustryCreate(IndustryBase):
    """创建行业"""
    pass


class IndustryUpdate(BaseModel):
    """更新行业"""
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    ai_adoption_level: Optional[str] = None


class IndustryResponse(IndustryBase):
    """行业响应"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class IndustryListResponse(BaseModel):
    """行业列表响应"""
    total: int
    items: List[IndustryResponse]


class ReplacementRateSchema(BaseModel):
    """替代率Schema"""
    id: int
    year: int
    month: Optional[int] = None
    replacement_rate: float
    confidence: Optional[float] = 0.0
    data_source: Optional[str] = None
    
    class Config:
        from_attributes = True


class IndustryReplacementResponse(BaseModel):
    """行业替代率趋势响应"""
    industry_id: int
    industry_name: str
    rates: List[ReplacementRateSchema]
