"""
行业相关API路由
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.industry import Industry
from app.models.occupation import ReplacementRate
from app.schemas.industry import (
    IndustryResponse,
    IndustryListResponse,
    IndustryReplacementResponse,
    ReplacementRateSchema
)

router = APIRouter(prefix="/industries", tags=["行业"])


@router.get("", response_model=IndustryListResponse)
def get_industries(
    skip: int = Query(0, ge=0, description="跳过记录数"),
    limit: int = Query(20, ge=1, le=100, description="返回记录数"),
    category: str = Query(None, description="行业分类筛选"),
    db: Session = Depends(get_db)
):
    """获取行业列表"""
    query = db.query(Industry)
    
    if category:
        query = query.filter(Industry.category == category)
    
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    
    return {"total": total, "items": items}


@router.get("/{industry_id}", response_model=IndustryResponse)
def get_industry(industry_id: int, db: Session = Depends(get_db)):
    """获取行业详情"""
    industry = db.query(Industry).filter(Industry.id == industry_id).first()
    if not industry:
        raise HTTPException(status_code=404, detail="行业不存在")
    
    return industry


@router.get("/{industry_id}/replacement", response_model=IndustryReplacementResponse)
def get_industry_replacement(
    industry_id: int,
    years: int = Query(5, ge=1, le=10, description="追溯年份"),
    db: Session = Depends(get_db)
):
    """获取行业替代率趋势"""
    industry = db.query(Industry).filter(Industry.id == industry_id).first()
    if not industry:
        raise HTTPException(status_code=404, detail="行业不存在")
    
    # 获取替代率数据
    from datetime import datetime
    current_year = datetime.now().year
    
    rates = db.query(ReplacementRate).filter(
        ReplacementRate.industry_id == industry_id,
        ReplacementRate.occupation_id.is_(None),
        ReplacementRate.year >= current_year - years
    ).order_by(ReplacementRate.year, ReplacementRate.month).all()
    
    return {
        "industry_id": industry.id,
        "industry_name": industry.name,
        "rates": rates
    }
