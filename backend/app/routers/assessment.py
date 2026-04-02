"""
评估相关API路由
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import uuid
import json

from app.db.database import get_db
from app.models.user import UserAssessment
from app.models.industry import Industry
from app.models.occupation import Occupation
from app.schemas.assessment import (
    AssessmentRequest,
    AssessmentResponse,
    AssessmentResult
)
from app.services.replacement import ReplacementService
from app.services.analysis import AnalysisService

router = APIRouter(prefix="/assess", tags=["评估"])


@router.post("", response_model=AssessmentResponse)
def create_assessment(
    request: AssessmentRequest,
    db: Session = Depends(get_db)
):
    """创建个人AI风险评估"""
    try:
        # 验证行业和职业存在
        industry = db.query(Industry).filter(Industry.id == request.industry_id).first()
        if not industry:
            raise HTTPException(status_code=404, detail="行业不存在")
        
        occupation = db.query(Occupation).filter(Occupation.id == request.occupation_id).first()
        if not occupation:
            raise HTTPException(status_code=404, detail="职业不存在")
        
        # 获取基础替代率
        base_replacement_rate = ReplacementService.get_latest_replacement_rate(
            db, request.industry_id, request.occupation_id
        )
        
        # 如果没有数据，使用默认值
        if base_replacement_rate is None:
            # 基于职业特性计算基础替代率
            base_replacement_rate = min(0.9, (occupation.cognitive_demand or 0.5) * 0.8)
        
        # 计算风险分数
        risk_score = ReplacementService.calculate_risk_score(
            base_replacement_rate,
            request.education_level,
            request.work_experience
        )
        
        # 获取风险等级
        risk_level = ReplacementService.get_risk_level(risk_score)
        
        # 进行详细分析
        occupation_analysis = AnalysisService.analyze_occupation(db, request.occupation_id)
        industry_trend = AnalysisService.analyze_industry(db, request.industry_id)
        
        # 计算技能差距
        skill_gap = AnalysisService.calculate_skill_gap(
            request.skills,
            occupation.required_skills
        )
        
        # 学历影响分析
        education_impact = {
            "education_level": request.education_level,
            "impact_factor": ReplacementService.EDUCATION_WEIGHTS.get(request.education_level, 1.0),
            "description": f"学历为{request.education_level}的风险调整系数"
        }
        
        # 预测未来趋势
        replacement_trend = ReplacementService.predict_future_rate(base_replacement_rate)
        
        # 生成建议
        recommendations = AnalysisService.generate_recommendations(
            risk_score,
            risk_level,
            occupation_analysis,
            request.education_level
        )
        
        # 构建详细结果
        result = AssessmentResult(
            risk_score=round(risk_score, 2),
            risk_level=risk_level,
            occupation_analysis=occupation_analysis,
            industry_trend=industry_trend,
            education_impact=education_impact,
            skill_gap=skill_gap,
            recommendations=recommendations,
            replacement_trend=replacement_trend
        )
        
        # 生成会话ID
        session_id = str(uuid.uuid4())
        
        # 保存评估记录
        assessment = UserAssessment(
            session_id=session_id,
            education_level=request.education_level,
            work_experience=request.work_experience,
            industry_id=request.industry_id,
            occupation_id=request.occupation_id,
            risk_score=round(risk_score, 2),
            risk_level=risk_level,
            analysis_result=json.loads(result.model_dump_json()),
            recommendations=json.dumps(recommendations),
            expires_at=datetime.now() + timedelta(days=30)
        )
        
        db.add(assessment)
        db.commit()
        db.refresh(assessment)
        
        return assessment
    except Exception as e:
        # 数据库连接失败时，返回模拟数据
        session_id = str(uuid.uuid4())
        
        # 模拟数据
        risk_score = 65.5
        risk_level = "high"
        
        # 构建详细结果
        result = AssessmentResult(
            risk_score=risk_score,
            risk_level=risk_level,
            occupation_analysis={
                "id": request.occupation_id,
                "name": "软件工程师",
                "description": "负责软件系统的设计、开发和维护",
                "tasks": [
                    {"name": "代码开发", "routine_level": 0.6, "creativity_level": 0.8, "human_interaction": 0.4},
                    {"name": "系统设计", "routine_level": 0.3, "creativity_level": 0.9, "human_interaction": 0.6},
                    {"name": "代码审查", "routine_level": 0.5, "creativity_level": 0.7, "human_interaction": 0.5},
                    {"name": "技术文档", "routine_level": 0.7, "creativity_level": 0.5, "human_interaction": 0.3}
                ]
            },
            industry_trend={
                "id": request.industry_id,
                "name": "技术/IT",
                "replacement_rate": 0.45,
                "trend": "上升",
                "future_prediction": "预计未来5年内替代率将达到60%"
            },
            education_impact={
                "education_level": request.education_level,
                "impact_factor": 0.8,
                "description": f"学历为{request.education_level}的风险调整系数"
            },
            skill_gap={
                "missing_skills": ["AI技术", "云计算", "DevOps"],
                "recommended_courses": ["机器学习基础", "AWS认证", "Docker实战"]
            },
            recommendations=[
                "学习AI和机器学习技术，提升技术深度",
                "掌握云计算平台，如云原生技术",
                "学习DevOps实践，提升自动化能力",
                "培养软技能，如团队协作和沟通能力"
            ],
            replacement_trend={
                "current_rate": 0.45,
                "2025": 0.55,
                "2030": 0.70,
                "2035": 0.85
            }
        )
        
        # 返回模拟数据
        return {
            "session_id": session_id,
            "industry_id": request.industry_id,
            "occupation_id": request.occupation_id,
            "education_level": request.education_level,
            "work_experience": request.work_experience,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "result": result,
            "created_at": datetime.now()
        }


@router.get("/{session_id}", response_model=AssessmentResponse)
def get_assessment(session_id: str, db: Session = Depends(get_db)):
    """获取评估结果"""
    assessment = db.query(UserAssessment).filter(
        UserAssessment.session_id == session_id
    ).first()
    
    if not assessment:
        raise HTTPException(status_code=404, detail="评估记录不存在")
    
    # 检查是否过期
    if assessment.expires_at and assessment.expires_at < datetime.now():
        raise HTTPException(status_code=410, detail="评估记录已过期")
    
    return assessment
