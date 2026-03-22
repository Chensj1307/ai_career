'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { INDUSTRIES, RISK_COLORS, type EducationLevel, EDUCATION_LABELS } from '@/types';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import HeatMap from '@/components/charts/HeatMap';

// 模拟热力图数据
const mockHeatMapData = [
  { name: '技术/IT', value: 78, children: [
    { name: '软件开发', value: 85 },
    { name: '数据分析', value: 82 },
    { name: '测试工程', value: 75 },
    { name: '运维工程', value: 70 },
  ]},
  { name: '金融', value: 72, children: [
    { name: '会计', value: 88 },
    { name: '风控', value: 65 },
    { name: '客服', value: 80 },
  ]},
  { name: '零售', value: 68, children: [
    { name: '收银', value: 95 },
    { name: '理货', value: 60 },
    { name: '导购', value: 75 },
  ]},
  { name: '制造业', value: 65, children: [
    { name: '流水线', value: 90 },
    { name: '质检', value: 78 },
    { name: '设备维护', value: 55 },
  ]},
  { name: '医疗健康', value: 45, children: [
    { name: '影像诊断', value: 70 },
    { name: '护士', value: 35 },
    { name: '药剂', value: 55 },
  ]},
  { name: '教育', value: 52, children: [
    { name: '授课', value: 40 },
    { name: '助教', value: 65 },
    { name: '教务', value: 58 },
  ]},
  { name: '媒体/娱乐', value: 58, children: [
    { name: '内容创作', value: 45 },
    { name: '编辑', value: 70 },
    { name: '运营', value: 55 },
  ]},
  { name: '法律', value: 48, children: [
    { name: '法务', value: 42 },
    { name: '律师助理', value: 65 },
  ]},
  { name: '交通运输', value: 62, children: [
    { name: '驾驶', value: 75 },
    { name: '调度', value: 50 },
  ]},
  { name: '餐饮服务', value: 70, children: [
    { name: '厨师', value: 55 },
    { name: '服务员', value: 85 },
    { name: '外卖', value: 90 },
  ]},
];

export default function HomePage() {
  const [year, setYear] = useState(2024);
  const [education, setEducation] = useState<EducationLevel>('bachelor');
  const [hoveredIndustry, setHoveredIndustry] = useState<string | null>(null);

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fadeIn">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          🔮 AI时代职业风险指南
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          基于AI技术发展趋势，分析各行业被自动化替代的风险程度，
          帮助您做出更明智的职业规划决策
        </p>
      </div>

      {/* Filter Controls */}
      <Card className="mb-8 p-6">
        <div className="flex flex-wrap gap-8 items-center">
          <div className="flex-1 min-w-[200px]">
            <Label className="mb-2 block">预测年份</Label>
            <Slider
              value={[year]}
              onValueChange={(vals) => setYear(vals[0])}
              min={2024}
              max={2035}
              step={1}
              className="max-w-xs"
            />
            <div className="text-center mt-2 font-medium text-slate-700">
              {year} 年
            </div>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <Label className="mb-2 block">学历层次</Label>
            <Select
              value={education}
              onChange={(e) => setEducation(e.target.value as EducationLevel)}
              className="w-full max-w-xs"
            >
              {Object.entries(EDUCATION_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {/* Heat Map Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          📊 行业AI替代风险热力图
        </h2>
        <Card className="p-6">
          <HeatMap 
            data={mockHeatMapData} 
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
          {mockHeatMapData.map((industry) => (
            <Link 
              key={industry.name} 
              href={`/industries?code=${encodeURIComponent(industry.name)}`}
            >
              <Card 
                className={`p-5 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
                  hoveredIndustry === industry.name ? 'ring-2 ring-blue-500' : ''
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
                    {industry.children.slice(0, 3).map((sub) => (
                      <span key={sub.name} className="text-xs bg-slate-100 px-2 py-1 rounded">
                        {sub.name}
                      </span>
                    ))}
                    {industry.children.length > 3 && (
                      <span className="text-xs text-slate-400">+{industry.children.length - 3}</span>
                    )}
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl text-white">
        <h2 className="text-2xl font-bold mb-4">了解您的个人职业风险</h2>
        <p className="text-blue-100 mb-6 max-w-lg mx-auto">
          输入您的行业、职位和学历信息，获取个性化的AI替代风险评估和转型建议
        </p>
        <Link 
          href="/assessment"
          className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
        >
          立即开始评估 →
        </Link>
      </section>
    </div>
  );
}
