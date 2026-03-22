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
