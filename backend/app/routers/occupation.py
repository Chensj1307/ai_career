"""
职业相关API路由
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.occupation import Occupation, Task
from app.schemas.assessment import OccupationTasksResponse, TaskSchema
import json

router = APIRouter(prefix="/occupations", tags=["职业"])


@router.get("", response_model=List[dict])
def get_occupations(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    industry_id: Optional[int] = Query(None, description="行业ID筛选"),
    category: Optional[str] = Query(None, description="职业分类筛选"),
    db: Session = Depends(get_db)
):
    """获取职业列表"""
    query = db.query(Occupation)
    
    if industry_id:
        query = query.filter(Occupation.industry_id == industry_id)
    if category:
        query = query.filter(Occupation.category == category)
    
    occupations = query.offset(skip).limit(limit).all()
    
    return [
        {
            "id": occ.id,
            "code": occ.code,
            "name": occ.name,
            "description": occ.description,
            "category": occ.category,
            "industry_id": occ.industry_id
        }
        for occ in occupations
    ]


@router.get("/{occupation_id}")
def get_occupation(occupation_id: int, db: Session = Depends(get_db)):
    """获取职业详情"""
    occupation = db.query(Occupation).filter(Occupation.id == occupation_id).first()
    if not occupation:
        raise HTTPException(status_code=404, detail="职业不存在")
    
    # 解析技能
    required_skills = []
    if occupation.required_skills:
        try:
            required_skills = json.loads(occupation.required_skills)
        except:
            required_skills = []
    
    return {
        "id": occupation.id,
        "code": occupation.code,
        "name": occupation.name,
        "description": occupation.description,
        "category": occupation.category,
        "industry_id": occupation.industry_id,
        "required_skills": required_skills,
        "cognitive_demand": occupation.cognitive_demand,
        "physical_demand": occupation.physical_demand,
        "social_demand": occupation.social_demand
    }


@router.get("/{occupation_id}/tasks", response_model=OccupationTasksResponse)
def get_occupation_tasks(
    occupation_id: int,
    db: Session = Depends(get_db)
):
    """获取职业任务分解"""
    occupation = db.query(Occupation).filter(Occupation.id == occupation_id).first()
    if not occupation:
        raise HTTPException(status_code=404, detail="职业不存在")
    
    tasks = db.query(Task).filter(Task.occupation_id == occupation_id).all()
    
    # 计算总体常规任务占比
    total_routine_rate = sum(t.routine_level for t in tasks) / len(tasks) if tasks else 0
    total_routine_tasks = sum(1 for t in tasks if t.routine_level > 0.5)
    
    return {
        "occupation_id": occupation.id,
        "occupation_name": occupation.name,
        "tasks": tasks,
        "total_routine_tasks": total_routine_tasks,
        "total_routine_rate": round(total_routine_rate, 3)
    }
