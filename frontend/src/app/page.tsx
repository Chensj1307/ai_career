'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RISK_COLORS, type EducationLevel, EDUCATION_LABELS } from '@/types';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import HeatMap from '@/components/charts/HeatMap';
import { getHeatMapData } from '@/lib/api';

// 模拟热力图数据 - 更细分的行业分类 (作为备用数据)
const mockHeatMapData = [
  {
    name: '技术/IT', 
    value: 78, 
    children: [
      { name: '软件开发', value: 85 },
      { name: '数据分析', value: 82 },
      { name: '测试工程', value: 75 },
      { name: '运维工程', value: 70 },
      { name: '网络安全', value: 65 },
      { name: '产品管理', value: 55 },
      { name: 'UI/UX设计', value: 68 },
      { name: '系统架构', value: 60 },
      { name: '数据库管理', value: 72 },
      { name: '前端开发', value: 80 },
      { name: '后端开发', value: 78 },
      { name: '移动开发', value: 75 },
      { name: '云服务', value: 68 },
      { name: 'DevOps', value: 62 },
      { name: 'AI工程师', value: 58 },
    ]
  },
  {
    name: '金融', 
    value: 72, 
    children: [
      { name: '会计核算', value: 88 },
      { name: '风险控制', value: 65 },
      { name: '客户服务', value: 80 },
      { name: '投资分析', value: 62 },
      { name: '银行柜员', value: 90 },
      { name: '保险销售', value: 75 },
      { name: '证券交易', value: 78 },
      { name: '财务分析', value: 68 },
      { name: '审计', value: 65 },
      { name: '税务筹划', value: 58 },
      { name: '金融科技', value: 60 },
      { name: '资产管理', value: 55 },
      { name: '合规审查', value: 62 },
    ]
  },
  {
    name: '零售', 
    value: 68, 
    children: [
      { name: '收银结算', value: 95 },
      { name: '商品导购', value: 75 },
      { name: '库存管理', value: 70 },
      { name: '理货员', value: 60 },
      { name: '店长', value: 55 },
      { name: '采购经理', value: 48 },
      { name: '市场推广', value: 65 },
      { name: '电商运营', value: 72 },
      { name: '客服专员', value: 82 },
      { name: '仓储物流', value: 68 },
      { name: '视觉陈列', value: 52 },
    ]
  },
  {
    name: '制造业', 
    value: 65, 
    children: [
      { name: '流水线操作', value: 90 },
      { name: '质量检测', value: 78 },
      { name: '设备维护', value: 55 },
      { name: '生产计划', value: 62 },
      { name: '工艺设计', value: 48 },
      { name: '物料管理', value: 68 },
      { name: '仓库管理', value: 70 },
      { name: '生产管理', value: 52 },
      { name: '模具设计', value: 50 },
      { name: '自动化控制', value: 65 },
      { name: '工业工程师', value: 45 },
    ]
  },
  {
    name: '医疗健康', 
    value: 45, 
    children: [
      { name: '影像诊断', value: 70 },
      { name: '护士', value: 35 },
      { name: '药剂师', value: 55 },
      { name: '医生', value: 30 },
      { name: '医疗管理', value: 42 },
      { name: '物理治疗', value: 38 },
      { name: '营养师', value: 45 },
      { name: '医疗器械', value: 58 },
      { name: '医学研究', value: 35 },
      { name: '医院行政', value: 60 },
      { name: '护理员', value: 40 },
    ]
  },
  {
    name: '教育', 
    value: 52, 
    children: [
      { name: '授课教师', value: 40 },
      { name: '助教', value: 65 },
      { name: '教务管理', value: 58 },
      { name: '课程设计', value: 45 },
      { name: '考试评估', value: 72 },
      { name: '教育行政', value: 60 },
      { name: '培训师', value: 55 },
      { name: '心理咨询', value: 35 },
      { name: '教育技术', value: 68 },
      { name: '图书馆员', value: 62 },
    ]
  },
  {
    name: '媒体/娱乐', 
    value: 58, 
    children: [
      { name: '内容创作', value: 45 },
      { name: '编辑', value: 70 },
      { name: '运营', value: 55 },
      { name: '视频制作', value: 52 },
      { name: '记者', value: 48 },
      { name: '播音员', value: 58 },
      { name: '广告设计', value: 62 },
      { name: '市场推广', value: 65 },
      { name: '公关', value: 55 },
      { name: '剧本创作', value: 42 },
      { name: '音效设计', value: 50 },
    ]
  },
  {
    name: '法律', 
    value: 48, 
    children: [
      { name: '法务', value: 42 },
      { name: '律师助理', value: 65 },
      { name: '律师', value: 35 },
      { name: '法律顾问', value: 40 },
      { name: ' paralegal', value: 68 },
      { name: '法律文书', value: 70 },
      { name: '知识产权', value: 45 },
      { name: '诉讼代理', value: 38 },
    ]
  },
  {
    name: '交通运输', 
    value: 62, 
    children: [
      { name: '驾驶', value: 75 },
      { name: '调度', value: 50 },
      { name: '物流管理', value: 48 },
      { name: '仓储操作', value: 68 },
      { name: '快递员', value: 85 },
      { name: '报关员', value: 65 },
      { name: '运输规划', value: 55 },
      { name: '码头操作', value: 70 },
      { name: '航空服务', value: 62 },
      { name: '铁路运营', value: 58 },
    ]
  },
  {
    name: '餐饮服务', 
    value: 70, 
    children: [
      { name: '厨师', value: 55 },
      { name: '服务员', value: 85 },
      { name: '外卖配送', value: 90 },
      { name: '店长', value: 45 },
      { name: '收银员', value: 88 },
      { name: '调酒师', value: 52 },
      { name: '烘焙师', value: 58 },
      { name: '餐厅管理', value: 48 },
      { name: '食材采购', value: 60 },
      { name: '洗碗工', value: 92 },
    ]
  },
  {
    name: '建筑/房地产', 
    value: 55, 
    children: [
      { name: '建筑设计', value: 45 },
      { name: '施工管理', value: 52 },
      { name: '房地产销售', value: 75 },
      { name: '物业管理人员', value: 68 },
      { name: '工程造价', value: 60 },
      { name: '室内设计', value: 55 },
      { name: '房地产中介', value: 80 },
      { name: '建筑工人', value: 65 },
    ]
  },
  {
    name: '农业', 
    value: 42, 
    children: [
      { name: '种植', value: 58 },
      { name: '养殖', value: 52 },
      { name: '农产品加工', value: 70 },
      { name: '农业技术', value: 45 },
      { name: '农资销售', value: 65 },
    ]
  },
  {
    name: '能源', 
    value: 58, 
    children: [
      { name: '石油开采', value: 62 },
      { name: '电力运营', value: 68 },
      { name: '可再生能源', value: 55 },
      { name: '能源管理', value: 50 },
      { name: '能源销售', value: 65 },
    ]
  },
  {
    name: '咨询', 
    value: 50, 
    children: [
      { name: '管理咨询', value: 48 },
      { name: 'IT咨询', value: 55 },
      { name: '财务咨询', value: 52 },
      { name: '人力资源咨询', value: 60 },
      { name: '战略咨询', value: 45 },
    ]
  },
  {
    name: '公共服务', 
    value: 38, 
    children: [
      { name: '公务员', value: 35 },
      { name: '警察', value: 30 },
      { name: '消防员', value: 28 },
      { name: '社会服务', value: 42 },
      { name: '教育行政', value: 58 },
    ]
  },
  {
    name: '艺术/设计', 
    value: 55, 
    children: [
      { name: '平面设计', value: 72 },
      { name: '插画师', value: 65 },
      { name: '工业设计', value: 58 },
      { name: '室内设计', value: 55 },
      { name: '服装设计', value: 60 },
      { name: '游戏设计', value: 68 },
      { name: '动画制作', value: 62 },
      { name: '雕塑', value: 45 },
      { name: '绘画', value: 42 },
    ]
  },
  {
    name: '体育/健身', 
    value: 40, 
    children: [
      { name: '运动员', value: 35 },
      { name: '教练', value: 45 },
      { name: '健身教练', value: 50 },
      { name: '体育管理', value: 55 },
      { name: '裁判', value: 48 },
      { name: '体育媒体', value: 62 },
    ]
  },
  {
    name: '科研', 
    value: 35, 
    children: [
      { name: '自然科学研究', value: 30 },
      { name: '社会科学研究', value: 32 },
      { name: '工程研究', value: 45 },
      { name: '医学研究', value: 35 },
      { name: '农业研究', value: 40 },
      { name: '环境研究', value: 38 },
    ]
  },
  {
    name: '美容/时尚', 
    value: 60, 
    children: [
      { name: '美容师', value: 55 },
      { name: '美发师', value: 52 },
      { name: '美甲师', value: 65 },
      { name: '化妆造型', value: 58 },
      { name: '时尚设计', value: 50 },
      { name: '形象顾问', value: 48 },
      { name: '奢侈品销售', value: 68 },
    ]
  },
  {
    name: '创意产业', 
    value: 52, 
    children: [
      { name: '广告创意', value: 65 },
      { name: '品牌设计', value: 58 },
      { name: '内容营销', value: 62 },
      { name: '社交媒体运营', value: 70 },
      { name: '创意写作', value: 45 },
      { name: '游戏开发', value: 75 },
      { name: '数字营销', value: 68 },
    ]
  },
  {
    name: '环境/可持续发展', 
    value: 48, 
    children: [
      { name: '环保工程师', value: 55 },
      { name: '可持续发展顾问', value: 50 },
      { name: '环境监测', value: 62 },
      { name: '资源管理', value: 58 },
      { name: '生态保护', value: 45 },
      { name: '清洁能源', value: 52 },
    ]
  },
  {
    name: '人力资源', 
    value: 65, 
    children: [
      { name: '招聘专员', value: 72 },
      { name: '培训专员', value: 68 },
      { name: '薪酬福利', value: 65 },
      { name: '员工关系', value: 55 },
      { name: 'HRBP', value: 50 },
      { name: 'HR总监', value: 45 },
    ]
  },
  {
    name: '市场/销售', 
    value: 68, 
    children: [
      { name: '销售代表', value: 75 },
      { name: '市场专员', value: 65 },
      { name: '品牌经理', value: 58 },
      { name: '营销策划', value: 62 },
      { name: '渠道管理', value: 60 },
      { name: '客户关系', value: 70 },
      { name: '商务拓展', value: 55 },
    ]
  },
  {
    name: '物流/供应链', 
    value: 62, 
    children: [
      { name: '供应链管理', value: 55 },
      { name: '物流规划', value: 60 },
      { name: '仓储管理', value: 68 },
      { name: '运输管理', value: 72 },
      { name: '配送员', value: 85 },
      { name: '供应链分析师', value: 58 },
    ]
  },
  {
    name: '信息技术服务', 
    value: 75, 
    children: [
      { name: 'IT支持', value: 80 },
      { name: '技术文档', value: 72 },
      { name: 'IT咨询', value: 65 },
      { name: '系统集成', value: 68 },
      { name: 'IT项目管理', value: 60 },
      { name: '技术培训', value: 55 },
    ]
  },
  {
    name: '酒店/旅游', 
    value: 72, 
    children: [
      { name: '酒店前台', value: 85 },
      { name: '客房服务', value: 82 },
      { name: '导游', value: 65 },
      { name: '旅游策划', value: 58 },
      { name: '酒店经理', value: 50 },
      { name: '旅行社运营', value: 62 },
      { name: '预订专员', value: 78 },
    ]
  },
  {
    name: '电信/通信', 
    value: 68, 
    children: [
      { name: '网络工程师', value: 65 },
      { name: '通信技术', value: 62 },
      { name: '客服代表', value: 80 },
      { name: '网络维护', value: 70 },
      { name: '通信规划', value: 55 },
      { name: '电信销售', value: 75 },
    ]
  },
  {
    name: '零售科技', 
    value: 75, 
    children: [
      { name: '电商运营', value: 72 },
      { name: '数据分析师', value: 68 },
      { name: '用户体验', value: 65 },
      { name: '数字营销', value: 70 },
      { name: '供应链管理', value: 62 },
      { name: '客户服务', value: 78 },
    ]
  },
  {
    name: '健康/养生', 
    value: 45, 
    children: [
      { name: '健身教练', value: 50 },
      { name: '营养师', value: 45 },
      { name: '心理咨询师', value: 38 },
      { name: '瑜伽教练', value: 42 },
      { name: '健康管理', value: 52 },
      { name: '养生顾问', value: 48 },
    ]
  },
];

export default function HomePage() {
  const [year, setYear] = useState(2026);
  const [education, setEducation] = useState<EducationLevel>('bachelor');
  const [hoveredIndustry, setHoveredIndustry] = useState<string | null>(null);
  const [heatMapData, setHeatMapData] = useState<any[]>(mockHeatMapData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRiskColor = (value: number) => {
    if (value < 40) return RISK_COLORS.low;
    if (value < 60) return RISK_COLORS.medium;
    if (value < 80) return RISK_COLORS.high;
    return RISK_COLORS.critical;
  };

  const getRiskLabel = (value: number) => {
    if (value < 40) return '安全';
    if (value < 60) return '中等';
    if (value < 80) return '高风险';
    return '极高风险';
  };

  // 获取热力图数据
  const fetchHeatMapData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getHeatMapData(year, education);
      setHeatMapData(data);
    } catch (err) {
      console.error('Failed to fetch heatmap data:', err);
      setError('获取数据失败，使用备用数据');
      // 保持使用模拟数据
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载和参数变化时获取数据
  useEffect(() => {
    fetchHeatMapData();
  }, [year, education]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fadeIn">
        <h1 className="text-5xl font-bold text-gradient mb-4 glow-text flex items-center justify-center gap-3">
          <div className="relative">
            <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <filter id="iconGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <circle cx="50" cy="50" r="45" stroke="url(#iconGradient)" strokeWidth="2" fill="white" filter="url(#iconGlow)"/>
              <circle cx="50" cy="50" r="32" stroke="url(#iconGradient)" strokeWidth="1" fill="white" opacity="0.5"/>
              <path d="M35 50 L45 50 L50 40 L55 50 L65 50 L55 58 L58 70 L50 63 L42 70 L45 58 L35 50" fill="url(#iconGradient)" opacity="0.8"/>
              <circle cx="35" cy="30" r="3" fill="url(#iconGradient)">
                <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="70" cy="35" r="2" fill="url(#iconGradient)">
                <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="75" cy="65" r="3" fill="url(#iconGradient)">
                <animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="30" cy="70" r="2" fill="url(#iconGradient)">
                <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>
          AI时代职业风险指南
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          基于AI技术发展趋势，分析各行业被自动化替代的风险程度，
          帮助您做出更明智的职业规划决策
        </p>
      </div>

      {/* Filter Controls */}
      <Card className="mb-8 p-6 card-premium">
        <div className="flex flex-wrap gap-8 items-center">
          <div className="flex-1 min-w-[200px]">
            <Label className="mb-2 block text-slate-700">预测年份</Label>
            <Slider
              value={[year]}
              onValueChange={(vals) => setYear(vals[0])}
              min={2026}
              max={2035}
              step={1}
              className="w-full"
            />
            <div className="text-center mt-2 font-medium text-indigo-600">
              {year} 年
            </div>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <Label className="mb-2 block text-slate-700">学历层次</Label>
            <Select value={education} onValueChange={(value) => setEducation(value as EducationLevel)}>
              <SelectTrigger className="w-full max-w-xs bg-white border-slate-200">
                <SelectValue placeholder="请选择学历层次" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EDUCATION_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Heat Map Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">
            📊 行业AI替代风险热力图
          </h2>
          {isLoading && (
            <div className="flex items-center text-sm text-slate-500">
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              加载中...
            </div>
          )}
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span className="text-amber-700 text-sm">{error}</span>
          </div>
        )}
        
        <Card className="p-6 card-premium">
          <HeatMap 
            data={heatMapData} 
            onIndustryHover={setHoveredIndustry}
            year={year}
            education={education}
          />
        </Card>
      </section>

      {/* Industry List */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          🏭 行业风险详情
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {heatMapData.map((industry) => (
            <Link 
              key={industry.name} 
              href={`/industries?code=${encodeURIComponent(industry.name)}`}
            >
              <Card 
                className={`p-5 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] card-premium hover-lift ${
                  hoveredIndustry === industry.name ? 'ring-2 ring-indigo-500' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-800">{industry.name}</h3>
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: getRiskColor(industry.value) }}
                  >
                    {getRiskLabel(industry.value)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                  <div 
                    className="h-2 rounded-full transition-all"
                    style={{ 
                      width: `${industry.value}%`,
                      backgroundColor: getRiskColor(industry.value)
                    }}
                  />
                </div>
                <div className="text-sm text-slate-500">
                  风险指数: <span className="font-medium">{industry.value}</span>
                </div>
                {industry.children && industry.children.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {industry.children.slice(0, 4).map((sub) => (
                      <span key={sub.name} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                        {sub.name}
                      </span>
                    ))}
                    {industry.children.length > 4 && (
                      <span className="text-xs text-slate-400">+{industry.children.length - 4}</span>
                    )}
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl text-white shadow-premium">
        <h2 className="text-2xl font-bold mb-4">了解您的个人职业风险</h2>
        <p className="text-indigo-100 mb-6 max-w-lg mx-auto">
          输入您的行业、职位和学历信息，获取个性化的AI替代风险评估和转型建议
        </p>
        <Link 
          href="/assessment"
          className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors shadow-lg"
        >
          立即开始评估 →
        </Link>
      </section>
    </div>
  );
}
