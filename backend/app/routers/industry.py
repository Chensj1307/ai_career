"""
行业相关API路由
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
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


# 热力图数据
heatmap_data = [
    {
        "name": "技术/IT", 
        "value": 78, 
        "children": [
            {"name": "软件开发", "value": 85},
            {"name": "数据分析", "value": 82},
            {"name": "测试工程", "value": 75},
            {"name": "运维工程", "value": 70},
            {"name": "网络安全", "value": 65},
            {"name": "产品管理", "value": 55},
            {"name": "UI/UX设计", "value": 68},
            {"name": "系统架构", "value": 60},
            {"name": "数据库管理", "value": 72},
            {"name": "前端开发", "value": 80},
            {"name": "后端开发", "value": 78},
            {"name": "移动开发", "value": 75},
            {"name": "云服务", "value": 68},
            {"name": "DevOps", "value": 62},
            {"name": "AI工程师", "value": 58},
        ]
    },
    {
        "name": "金融", 
        "value": 72, 
        "children": [
            {"name": "会计核算", "value": 88},
            {"name": "风险控制", "value": 65},
            {"name": "客户服务", "value": 80},
            {"name": "投资分析", "value": 62},
            {"name": "银行柜员", "value": 90},
            {"name": "保险销售", "value": 75},
            {"name": "证券交易", "value": 78},
            {"name": "财务分析", "value": 68},
            {"name": "审计", "value": 65},
            {"name": "税务筹划", "value": 58},
            {"name": "金融科技", "value": 60},
            {"name": "资产管理", "value": 55},
            {"name": "合规审查", "value": 62},
        ]
    },
    {
        "name": "零售", 
        "value": 68, 
        "children": [
            {"name": "收银结算", "value": 95},
            {"name": "商品导购", "value": 75},
            {"name": "库存管理", "value": 70},
            {"name": "理货员", "value": 60},
            {"name": "店长", "value": 55},
            {"name": "采购经理", "value": 48},
            {"name": "市场推广", "value": 65},
            {"name": "电商运营", "value": 72},
            {"name": "客服专员", "value": 82},
            {"name": "仓储物流", "value": 68},
            {"name": "视觉陈列", "value": 52},
        ]
    },
    {
        "name": "制造业", 
        "value": 65, 
        "children": [
            {"name": "流水线操作", "value": 90},
            {"name": "质量检测", "value": 78},
            {"name": "设备维护", "value": 55},
            {"name": "生产计划", "value": 62},
            {"name": "工艺设计", "value": 48},
            {"name": "物料管理", "value": 68},
            {"name": "仓库管理", "value": 70},
            {"name": "生产管理", "value": 52},
            {"name": "模具设计", "value": 50},
            {"name": "自动化控制", "value": 65},
            {"name": "工业工程师", "value": 45},
        ]
    },
    {
        "name": "医疗健康", 
        "value": 45, 
        "children": [
            {"name": "影像诊断", "value": 70},
            {"name": "护士", "value": 35},
            {"name": "药剂师", "value": 55},
            {"name": "医生", "value": 30},
            {"name": "医疗管理", "value": 42},
            {"name": "物理治疗", "value": 38},
            {"name": "营养师", "value": 45},
            {"name": "医疗器械", "value": 58},
            {"name": "医学研究", "value": 35},
            {"name": "医院行政", "value": 60},
            {"name": "护理员", "value": 40},
        ]
    },
    {
        "name": "教育", 
        "value": 52, 
        "children": [
            {"name": "授课教师", "value": 40},
            {"name": "助教", "value": 65},
            {"name": "教务管理", "value": 58},
            {"name": "课程设计", "value": 45},
            {"name": "考试评估", "value": 72},
            {"name": "教育行政", "value": 60},
            {"name": "培训师", "value": 55},
            {"name": "心理咨询", "value": 35},
            {"name": "教育技术", "value": 68},
            {"name": "图书馆员", "value": 62},
        ]
    },
    {
        "name": "媒体/娱乐", 
        "value": 58, 
        "children": [
            {"name": "内容创作", "value": 45},
            {"name": "编辑", "value": 70},
            {"name": "运营", "value": 55},
            {"name": "视频制作", "value": 52},
            {"name": "记者", "value": 48},
            {"name": "播音员", "value": 58},
            {"name": "广告设计", "value": 62},
            {"name": "市场推广", "value": 65},
            {"name": "公关", "value": 55},
            {"name": "剧本创作", "value": 42},
            {"name": "音效设计", "value": 50},
        ]
    },
    {
        "name": "法律", 
        "value": 48, 
        "children": [
            {"name": "法务", "value": 42},
            {"name": "律师助理", "value": 65},
            {"name": "律师", "value": 35},
            {"name": "法律顾问", "value": 40},
            {"name": " paralegal", "value": 68},
            {"name": "法律文书", "value": 70},
            {"name": "知识产权", "value": 45},
            {"name": "诉讼代理", "value": 38},
        ]
    },
    {
        "name": "交通运输", 
        "value": 62, 
        "children": [
            {"name": "驾驶", "value": 75},
            {"name": "调度", "value": 50},
            {"name": "物流管理", "value": 48},
            {"name": "仓储操作", "value": 68},
            {"name": "快递员", "value": 85},
            {"name": "报关员", "value": 65},
            {"name": "运输规划", "value": 55},
            {"name": "码头操作", "value": 70},
            {"name": "航空服务", "value": 62},
            {"name": "铁路运营", "value": 58},
        ]
    },
    {
        "name": "餐饮服务", 
        "value": 70, 
        "children": [
            {"name": "厨师", "value": 55},
            {"name": "服务员", "value": 85},
            {"name": "外卖配送", "value": 90},
            {"name": "店长", "value": 45},
            {"name": "收银员", "value": 88},
            {"name": "调酒师", "value": 52},
            {"name": "烘焙师", "value": 58},
            {"name": "餐厅管理", "value": 48},
            {"name": "食材采购", "value": 60},
            {"name": "洗碗工", "value": 92},
        ]
    },
    {
        "name": "建筑/房地产", 
        "value": 55, 
        "children": [
            {"name": "建筑设计", "value": 45},
            {"name": "施工管理", "value": 52},
            {"name": "房地产销售", "value": 75},
            {"name": "物业管理人员", "value": 68},
            {"name": "工程造价", "value": 60},
            {"name": "室内设计", "value": 55},
            {"name": "房地产中介", "value": 80},
            {"name": "建筑工人", "value": 65},
        ]
    },
    {
        "name": "农业", 
        "value": 42, 
        "children": [
            {"name": "种植", "value": 58},
            {"name": "养殖", "value": 52},
            {"name": "农产品加工", "value": 70},
            {"name": "农业技术", "value": 45},
            {"name": "农资销售", "value": 65},
        ]
    },
    {
        "name": "能源", 
        "value": 58, 
        "children": [
            {"name": "石油开采", "value": 62},
            {"name": "电力运营", "value": 68},
            {"name": "可再生能源", "value": 55},
            {"name": "能源管理", "value": 50},
            {"name": "能源销售", "value": 65},
        ]
    },
    {
        "name": "咨询", 
        "value": 50, 
        "children": [
            {"name": "管理咨询", "value": 48},
            {"name": "IT咨询", "value": 55},
            {"name": "财务咨询", "value": 52},
            {"name": "人力资源咨询", "value": 60},
            {"name": "战略咨询", "value": 45},
        ]
    },
    {
        "name": "公共服务", 
        "value": 38, 
        "children": [
            {"name": "公务员", "value": 35},
            {"name": "警察", "value": 30},
            {"name": "消防员", "value": 28},
            {"name": "社会服务", "value": 42},
            {"name": "教育行政", "value": 58},
        ]
    },
    {
        "name": "艺术/设计", 
        "value": 55, 
        "children": [
            {"name": "平面设计", "value": 72},
            {"name": "插画师", "value": 65},
            {"name": "工业设计", "value": 58},
            {"name": "室内设计", "value": 55},
            {"name": "服装设计", "value": 60},
            {"name": "游戏设计", "value": 68},
            {"name": "动画制作", "value": 62},
            {"name": "雕塑", "value": 45},
            {"name": "绘画", "value": 42},
        ]
    },
    {
        "name": "体育/健身", 
        "value": 40, 
        "children": [
            {"name": "运动员", "value": 35},
            {"name": "教练", "value": 45},
            {"name": "健身教练", "value": 50},
            {"name": "体育管理", "value": 55},
            {"name": "裁判", "value": 48},
            {"name": "体育媒体", "value": 62},
        ]
    },
    {
        "name": "科研", 
        "value": 35, 
        "children": [
            {"name": "自然科学研究", "value": 30},
            {"name": "社会科学研究", "value": 32},
            {"name": "工程研究", "value": 45},
            {"name": "医学研究", "value": 35},
            {"name": "农业研究", "value": 40},
            {"name": "环境研究", "value": 38},
        ]
    },
    {
        "name": "美容/时尚", 
        "value": 60, 
        "children": [
            {"name": "美容师", "value": 55},
            {"name": "美发师", "value": 52},
            {"name": "美甲师", "value": 65},
            {"name": "化妆造型", "value": 58},
            {"name": "时尚设计", "value": 50},
            {"name": "形象顾问", "value": 48},
            {"name": "奢侈品销售", "value": 68},
        ]
    },
    {
        "name": "创意产业", 
        "value": 52, 
        "children": [
            {"name": "广告创意", "value": 65},
            {"name": "品牌设计", "value": 58},
            {"name": "内容营销", "value": 62},
            {"name": "社交媒体运营", "value": 70},
            {"name": "创意写作", "value": 45},
            {"name": "游戏开发", "value": 75},
            {"name": "数字营销", "value": 68},
        ]
    },
    {
        "name": "环境/可持续发展", 
        "value": 48, 
        "children": [
            {"name": "环保工程师", "value": 55},
            {"name": "可持续发展顾问", "value": 50},
            {"name": "环境监测", "value": 62},
            {"name": "资源管理", "value": 58},
            {"name": "生态保护", "value": 45},
            {"name": "清洁能源", "value": 52},
        ]
    },
    {
        "name": "人力资源", 
        "value": 65, 
        "children": [
            {"name": "招聘专员", "value": 72},
            {"name": "培训专员", "value": 68},
            {"name": "薪酬福利", "value": 65},
            {"name": "员工关系", "value": 55},
            {"name": "HRBP", "value": 50},
            {"name": "HR总监", "value": 45},
        ]
    },
    {
        "name": "市场/销售", 
        "value": 68, 
        "children": [
            {"name": "销售代表", "value": 75},
            {"name": "市场专员", "value": 65},
            {"name": "品牌经理", "value": 58},
            {"name": "营销策划", "value": 62},
            {"name": "渠道管理", "value": 60},
            {"name": "客户关系", "value": 70},
            {"name": "商务拓展", "value": 55},
        ]
    },
    {
        "name": "物流/供应链", 
        "value": 62, 
        "children": [
            {"name": "供应链管理", "value": 55},
            {"name": "物流规划", "value": 60},
            {"name": "仓储管理", "value": 68},
            {"name": "运输管理", "value": 72},
            {"name": "配送员", "value": 85},
            {"name": "供应链分析师", "value": 58},
        ]
    },
    {
        "name": "信息技术服务", 
        "value": 75, 
        "children": [
            {"name": "IT支持", "value": 80},
            {"name": "技术文档", "value": 72},
            {"name": "IT咨询", "value": 65},
            {"name": "系统集成", "value": 68},
            {"name": "IT项目管理", "value": 60},
            {"name": "技术培训", "value": 55},
        ]
    },
    {
        "name": "酒店/旅游", 
        "value": 72, 
        "children": [
            {"name": "酒店前台", "value": 85},
            {"name": "客房服务", "value": 82},
            {"name": "导游", "value": 65},
            {"name": "旅游策划", "value": 58},
            {"name": "酒店经理", "value": 50},
            {"name": "旅行社运营", "value": 62},
            {"name": "预订专员", "value": 78},
        ]
    },
    {
        "name": "电信/通信", 
        "value": 68, 
        "children": [
            {"name": "网络工程师", "value": 65},
            {"name": "通信技术", "value": 62},
            {"name": "客服代表", "value": 80},
            {"name": "网络维护", "value": 70},
            {"name": "通信规划", "value": 55},
            {"name": "电信销售", "value": 75},
        ]
    },
    {
        "name": "零售科技", 
        "value": 75, 
        "children": [
            {"name": "电商运营", "value": 72},
            {"name": "数据分析师", "value": 68},
            {"name": "用户体验", "value": 65},
            {"name": "数字营销", "value": 70},
            {"name": "供应链管理", "value": 62},
            {"name": "客户服务", "value": 78},
        ]
    },
    {
        "name": "健康/养生", 
        "value": 45, 
        "children": [
            {"name": "健身教练", "value": 50},
            {"name": "营养师", "value": 45},
            {"name": "心理咨询师", "value": 38},
            {"name": "瑜伽教练", "value": 42},
            {"name": "健康管理", "value": 52},
            {"name": "养生顾问", "value": 48},
        ]
    },
]


@router.get("/heatmap", tags=["热力图"])
def get_heatmap_data(
    year: int = Query(2026, ge=2026, le=2035, description="预测年份"),
    education: Optional[str] = Query(None, description="学历层次")
):
    """获取热力图数据"""
    # 这里可以根据年份和学历动态调整数据
    # 暂时返回静态数据
    return heatmap_data


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
