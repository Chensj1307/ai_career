"""
分析服务
"""
from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional
from app.models.industry import Industry
from app.models.occupation import Occupation, Task
from app.services.replacement import ReplacementService


class AnalysisService:
    """分析服务"""
    
    @staticmethod
    def analyze_occupation(db: Session, occupation_id: int) -> Dict[str, Any]:
        """分析职业特性"""
        occupation = db.query(Occupation).filter(Occupation.id == occupation_id).first()
        if not occupation:
            return {"error": "Occupation not found"}
        
        # 获取任务列表
        tasks = db.query(Task).filter(Task.occupation_id == occupation_id).all()
        
        # 计算常规任务占比
        total_routine = sum(t.routine_level for t in tasks) / len(tasks) if tasks else 0
        total_creativity = sum(t.creativity_level for t in tasks) / len(tasks) if tasks else 0
        total_interaction = sum(t.human_interaction for t in tasks) / len(tasks) if tasks else 0
        
        return {
            "occupation_id": occupation.id,
            "occupation_name": occupation.name,
            "category": occupation.category,
            "required_skills": occupation.required_skills,
            "task_analysis": {
                "total_tasks": len(tasks),
                "routine_level": round(total_routine, 3),
                "creativity_level": round(total_creativity, 3),
                "human_interaction_level": round(total_interaction, 3)
            },
            "cognitive_demand": occupation.cognitive_demand,
            "physical_demand": occupation.physical_demand,
            "social_demand": occupation.social_demand
        }
    
    @staticmethod
    def analyze_industry(db: Session, industry_id: int) -> Dict[str, Any]:
        """分析行业趋势"""
        industry = db.query(Industry).filter(Industry.id == industry_id).first()
        if not industry:
            return {"error": "Industry not found"}
        
        # 获取替代率趋势
        trends = ReplacementService.get_industry_trend(db, industry_id)
        
        # 获取相关职业数量
        occupation_count = db.query(Occupation).filter(
            Occupation.industry_id == industry_id
        ).count()
        
        return {
            "industry_id": industry.id,
            "industry_name": industry.name,
            "category": industry.category,
            "ai_adoption_level": industry.ai_adoption_level,
            "occupation_count": occupation_count,
            "replacement_trend": [
                {
                    "year": t.year,
                    "month": t.month,
                    "rate": t.replacement_rate
                }
                for t in trends
            ]
        }
    
    @staticmethod
    def generate_recommendations(
        risk_score: float,
        risk_level: str,
        occupation_analysis: Dict[str, Any],
        education_level: str
    ) -> List[str]:
        """生成建议"""
        recommendations = []
        
        # 基础建议
        if risk_level == "critical":
            recommendations.append("⚠️ 您的职业面临较高的AI替代风险，建议尽快规划转型。")
            recommendations.append("建议提升管理、战略决策等难以被AI替代的软技能。")
        elif risk_level == "high":
            recommendations.append("您的职业有一定风险，建议关注行业AI发展趋势。")
            recommendations.append("建议培养跨领域技能，提升职业竞争力。")
        elif risk_level == "medium":
            recommendations.append("您的职业相对稳定，但建议持续学习新技术。")
            recommendations.append("建议深化专业领域，成为行业专家。")
        else:
            recommendations.append("您的职业目前较为安全，但仍需关注技术发展。")
        
        # 技能相关建议
        if occupation_analysis:
            task_analysis = occupation_analysis.get("task_analysis", {})
            if task_analysis.get("creativity_level", 0) < 0.5:
                recommendations.append("建议培养创造性思维和解决复杂问题的能力。")
            if task_analysis.get("human_interaction_level", 0) < 0.5:
                recommendations.append("建议加强人际沟通和协作能力。")
        
        # 学历相关建议
        if education_level in ["high_school", "associate"]:
            recommendations.append("建议考虑提升学历，增强职业竞争力。")
        
        return recommendations
    
    @staticmethod
    def calculate_skill_gap(
        user_skills: List[str],
        required_skills_str: Optional[str]
    ) -> Dict[str, Any]:
        """计算技能差距"""
        import json
        
        if not required_skills_str:
            return {"gap_score": 0, "missing_skills": [], "matched_skills": []}
        
        try:
            required_skills = json.loads(required_skills_str)
        except:
            required_skills = []
        
        user_skills_lower = [s.lower() for s in user_skills]
        required_skills_lower = [s.lower() for s in required_skills]
        
        matched = []
        missing = []
        
        for skill in required_skills_lower:
            if skill in user_skills_lower:
                matched.append(skill)
            else:
                missing.append(skill)
        
        gap_score = len(missing) / len(required_skills) if required_skills else 0
        
        return {
            "gap_score": round(gap_score, 2),
            "matched_skills": matched,
            "missing_skills": missing,
            "total_required": len(required_skills),
            "total_matched": len(matched)
        }
