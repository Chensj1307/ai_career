"""
AI替代率计算服务
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional, Dict, Any
from app.models.occupation import ReplacementRate, Occupation


class ReplacementService:
    """替代率计算服务"""
    
    # 学历权重系数
    EDUCATION_WEIGHTS = {
        "high_school": 1.2,    # 高中及以下受影响最大
        "associate": 1.0,      # 大专
        "bachelor": 0.8,      # 本科
        "master": 0.6,        # 硕士
        "doctoral": 0.4       # 博士受影响最小
    }
    
    # 工作年限系数
    EXPERIENCE_WEIGHTS = {
        "junior": 1.2,        # 0-3年
        "mid": 1.0,           # 3-7年
        "senior": 0.7,        # 7-15年
        "expert": 0.5         # 15年以上
    }
    
    # 风险等级阈值
    RISK_THRESHOLDS = {
        "low": 30,            # 0-30 低风险
        "medium": 60,         # 31-60 中风险
        "high": 80,           # 61-80 高风险
        "critical": 100       # 81-100 极高风险
    }
    
    @staticmethod
    def get_industry_trend(db: Session, industry_id: int, years: int = 5) -> List[ReplacementRate]:
        """获取行业替代率趋势"""
        from datetime import datetime
        current_year = datetime.now().year
        
        return db.query(ReplacementRate).filter(
            ReplacementRate.industry_id == industry_id,
            ReplacementRate.occupation_id.is_(None),
            ReplacementRate.year >= current_year - years
        ).order_by(ReplacementRate.year, ReplacementRate.month).all()
    
    @staticmethod
    def get_occupation_trend(db: Session, occupation_id: int, years: int = 5) -> List[ReplacementRate]:
        """获取职业替代率趋势"""
        from datetime import datetime
        current_year = datetime.now().year
        
        return db.query(ReplacementRate).filter(
            ReplacementRate.occupation_id == occupation_id,
            ReplacementRate.year >= current_year - years
        ).order_by(ReplacementRate.year, ReplacementRate.month).all()
    
    @staticmethod
    def get_latest_replacement_rate(db: Session, industry_id: int, occupation_id: int) -> Optional[float]:
        """获取最新的替代率"""
        rate = db.query(ReplacementRate).filter(
            ReplacementRate.industry_id == industry_id,
            ReplacementRate.occupation_id == occupation_id
        ).order_by(
            ReplacementRate.year.desc(),
            ReplacementRate.month.desc()
        ).first()
        
        return rate.replacement_rate if rate else None
    
    @staticmethod
    def calculate_risk_score(
        base_replacement_rate: float,
        education_level: str,
        work_experience: int
    ) -> float:
        """计算风险分数"""
        # 基础分数 = 替代率 * 100
        base_score = base_replacement_rate * 100
        
        # 学历调整
        edu_weight = ReplacementService.EDUCATION_WEIGHTS.get(education_level, 1.0)
        
        # 工作年限调整
        if work_experience <= 3:
            exp_weight = ReplacementService.EXPERIENCE_WEIGHTS["junior"]
        elif work_experience <= 7:
            exp_weight = ReplacementService.EXPERIENCE_WEIGHTS["mid"]
        elif work_experience <= 15:
            exp_weight = ReplacementService.EXPERIENCE_WEIGHTS["senior"]
        else:
            exp_weight = ReplacementService.EXPERIENCE_WEIGHTS["expert"]
        
        # 最终分数
        final_score = base_score * edu_weight * exp_weight
        
        # 限制在0-100范围
        return min(100.0, max(0.0, final_score))
    
    @staticmethod
    def get_risk_level(risk_score: float) -> str:
        """根据风险分数获取风险等级"""
        if risk_score <= ReplacementService.RISK_THRESHOLDS["low"]:
            return "low"
        elif risk_score <= ReplacementService.RISK_THRESHOLDS["medium"]:
            return "medium"
        elif risk_score <= ReplacementService.RISK_THRESHOLDS["high"]:
            return "high"
        else:
            return "critical"
    
    @staticmethod
    def predict_future_rate(current_rate: float, years_ahead: int = 3) -> Dict[int, float]:
        """预测未来替代率（简单线性外推）"""
        # 假设年增长率约为5-15%，根据AI发展情况
        growth_rate = 0.10  # 10%年增长
        
        predictions = {}
        for i in range(1, years_ahead + 1):
            predicted_rate = min(0.99, current_rate * (1 + growth_rate) ** i)
            predictions[2025 + i] = round(predicted_rate, 3)
        
        return predictions
