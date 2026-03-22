"""
评估相关Pydantic Schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class AssessmentRequest(BaseModel):
    """评估请求"""
    education_level: str = Field(..., description="学历: high_school/associate/bachelor/master/doctoral")
    work_experience: int = Field(..., ge=0, description="工作年限")
    industry_id: int = Field(..., gt=0, description="行业ID")
    occupation_id: int = Field(..., gt=0, description="职业ID")
    
    # 可选：用户技能评估
    skills: Optional[List[str]] = Field(default_factory=list, description="用户技能列表")
    
    class Config:
        json_schema_extra = {
            "example": {
                "education_level": "bachelor",
                "work_experience": 5,
                "industry_id": 1,
                "occupation_id": 1,
                "skills": ["Python", "数据分析", "项目管理"]
            }
        }


class AssessmentResult(BaseModel):
    """评估结果详情"""
    risk_score: float = Field(..., description="风险分数 0-100")
    risk_level: str = Field(..., description="风险等级: low/medium/high/critical")
    
    # 详细分析
    occupation_analysis: Dict[str, Any] = Field(..., description="职业分析")
    industry_trend: Dict[str, Any] = Field(..., description="行业趋势")
    education_impact: Dict[str, Any] = Field(..., description="学历影响分析")
    skill_gap: Dict[str, Any] = Field(..., description="技能差距")
    
    # 建议
    recommendations: List[str] = Field(default_factory=list, description="建议列表")
    
    # 替代率趋势
    replacement_trend: Optional[Dict[str, Any]] = None


class AssessmentResponse(BaseModel):
    """评估响应"""
    session_id: str
    industry_id: int
    occupation_id: int
    education_level: str
    work_experience: int
    
    risk_score: float
    risk_level: str
    
    result: AssessmentResult
    created_at: datetime
    
    class Config:
        from_attributes = True


class TaskSchema(BaseModel):
    """任务Schema"""
    id: int
    name: str
    description: Optional[str] = None
    routine_level: Optional[float] = 0.0
    creativity_level: Optional[float] = 0.0
    human_interaction: Optional[float] = 0.0
    
    class Config:
        from_attributes = True


class OccupationTasksResponse(BaseModel):
    """职业任务响应"""
    occupation_id: int
    occupation_name: str
    tasks: List[TaskSchema]
    total_routine_tasks: int
    total_routine_rate: float
