'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RISK_COLORS, INDUSTRIES } from '@/types';
import TrendChart from '@/components/charts/TrendChart';
import TaskTree from '@/components/charts/TaskTree';

// 模拟行业详情数据
const mockIndustryData: Record<string, {
  name: string;
  description: string;
  totalRisk: number;
  tasks: Array<{
    id: string;
    name: string;
    risk: number;
    difficulty: 'low' | 'medium' | 'high';
    year: number;
    skills: string[];
  }>;
  trend: Array<{ year: number; risk: number }>;
}> = {
  '技术/IT': {
    name: '技术/IT',
    description: '信息技术行业包括软件开发、数据分析、系统运维等细分领域。近年来AI技术快速发展，对该行业产生了深远影响。',
    totalRisk: 78,
    tasks: [
      { id: '1', name: '后端开发', risk: 72, difficulty: 'high', year: 2028, skills: ['Java', 'Python', 'Go', '数据库'] },
      { id: '2', name: '前端开发', risk: 68, difficulty: 'medium', year: 2027, skills: ['React', 'Vue', 'TypeScript'] },
      { id: '3', name: '数据分析', risk: 82, difficulty: 'medium', year: 2026, skills: ['SQL', 'Python', '机器学习'] },
      { id: '4', name: '测试工程', risk: 75, difficulty: 'low', year: 2026, skills: ['自动化测试', 'Selenium'] },
      { id: '5', name: 'DevOps', risk: 55, difficulty: 'high', year: 2030, skills: ['K8s', 'Docker', 'CI/CD'] },
      { id: '6', name: '算法工程', risk: 45, difficulty: 'high', year: 2032, skills: ['深度学习', 'TensorFlow'] },
    ],
    trend: [
      { year: 2024, risk: 45 },
      { year: 2025, risk: 52 },
      { year: 2026, risk: 60 },
      { year: 2027, risk: 68 },
      { year: 2028, risk: 74 },
      { year: 2029, risk: 78 },
      { year: 2030, risk: 82 },
      { year: 2031, risk: 85 },
      { year: 2032, risk: 88 },
      { year: 2033, risk: 90 },
    ],
  },
  '金融': {
    name: '金融',
    description: '金融行业涵盖银行、保险、证券、投资等领域。AI在风控、客服、量化交易等方面已有广泛应用。',
    totalRisk: 72,
    tasks: [
      { id: '1', name: '会计核算', risk: 88, difficulty: 'low', year: 2025, skills: ['财务软件', 'Excel'] },
      { id: '2', name: '客户服务', risk: 80, difficulty: 'low', year: 2025, skills: ['沟通技巧', '产品知识'] },
      { id: '3', name: '风险控制', risk: 65, difficulty: 'high', year: 2028, skills: ['风控模型', '数据分析'] },
      { id: '4', name: '投资分析', risk: 58, difficulty: 'high', year: 2029, skills: ['金融模型', '量化分析'] },
      { id: '5', name: '合规审查', risk: 52, difficulty: 'medium', year: 2030, skills: ['法律法规', '合规系统'] },
    ],
    trend: [
      { year: 2024, risk: 40 },
      { year: 2025, risk: 48 },
      { year: 2026, risk: 55 },
      { year: 2027, risk: 62 },
      { year: 2028, risk: 68 },
      { year: 2029, risk: 72 },
      { year: 2030, risk: 75 },
      { year: 2031, risk: 78 },
      { year: 2032, risk: 80 },
      { year: 2033, risk: 82 },
    ],
  },
  '零售': {
    name: '零售',
    description: '零售行业包括实体店、电商平台、连锁超市等。自动化技术正在重塑整个零售业态。',
    totalRisk: 68,
    tasks: [
      { id: '1', name: '收银结算', risk: 95, difficulty: 'low', year: 2024, skills: ['收银系统'] },
      { id: '2', name: '商品导购', risk: 75, difficulty: 'low', year: 2026, skills: ['产品知识', '推销技巧'] },
      { id: '3', name: '库存管理', risk: 70, difficulty: 'low', year: 2026, skills: ['ERP系统', '库存分析'] },
      { id: '4', name: '采购谈判', risk: 45, difficulty: 'high', year: 2032, skills: ['供应链管理', '谈判技巧'] },
      { id: '5', name: '店铺管理', risk: 50, difficulty: 'medium', year: 2030, skills: ['陈列设计', '人员管理'] },
    ],
    trend: [
      { year: 2024, risk: 50 },
      { year: 2025, risk: 55 },
      { year: 2026, risk: 60 },
      { year: 2027, risk: 64 },
      { year: 2028, risk: 67 },
      { year: 2029, risk: 70 },
      { year: 2030, risk: 72 },
      { year: 2031, risk: 74 },
      { year: 2032, risk: 75 },
      { year: 2033, risk: 76 },
    ],
  },
};

export default function IndustriesPage() {
  const searchParams = useSearchParams();
  const industryCode = searchParams.get('code') || '技术/IT';
  const [data, setData] = useState(mockIndustryData['技术/IT']);
  const [selectedYear, setSelectedYear] = useState(2024);

  useEffect(() => {
    if (mockIndustryData[industryCode]) {
      setData(mockIndustryData[industryCode]);
    }
  }, [industryCode]);

  const getRiskColor = (value: number) => {
    if (value < 40) return RISK_COLORS.low;
    if (value < 60) return RISK_COLORS.medium;
    if (value < 80) return RISK_COLORS.high;
    return RISK_COLORS.critical;
  };

  const getRiskLabel = (value: number) => {
    if (value < 40) return '安全';
    if (value < 60) return '中等风险';
    if (value < 80) return '高风险';
    return '极高风险';
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'low': return '低';
      case 'medium': return '中';
      case 'high': return '高';
      default: return difficulty;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-slate-500">
          <li><Link href="/" className="hover:text-blue-600">首页</Link></li>
          <li>/</li>
          <li className="text-slate-800">{data.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8 animate-fadeIn">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{data.name}</h1>
        <p className="text-slate-600">{data.description}</p>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 text-center">
          <div className="text-sm text-slate-500 mb-2">当前风险指数</div>
          <div className="text-4xl font-bold mb-2" style={{ color: getRiskColor(data.totalRisk) }}>
            {data.totalRisk}
          </div>
          <div 
            className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: getRiskColor(data.totalRisk) }}
          >
            {getRiskLabel(data.totalRisk)}
          </div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-sm text-slate-500 mb-2">涉及任务数量</div>
          <div className="text-4xl font-bold text-slate-800 mb-2">{data.tasks.length}</div>
          <div className="text-sm text-slate-500">个细分岗位</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-sm text-slate-500 mb-2">高风险任务</div>
          <div className="text-4xl font-bold text-red-600 mb-2">
            {data.tasks.filter(t => t.risk >= 70).length}
          </div>
          <div className="text-sm text-slate-500">个需要关注</div>
        </Card>
      </div>

      {/* Trend Chart */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">📈 风险趋势预测</h2>
        <Card className="p-6">
          <TrendChart data={data.trend} />
        </Card>
      </section>

      {/* Task Breakdown */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">📋 任务风险分解</h2>
        <Card className="p-6">
          <TaskTree 
            tasks={data.tasks} 
            currentYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </Card>
      </section>

      {/* Skills Warning */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">⚠️ 需要关注的技能</h2>
        <div className="flex flex-wrap gap-3">
          {data.tasks
            .filter(t => t.risk >= 65)
            .flatMap(t => t.skills)
            .filter((v, i, a) => a.indexOf(v) === i)
            .map(skill => (
              <span 
                key={skill} 
                className="px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-200"
              >
                {skill}
              </span>
            ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center">
        <Link href="/assessment">
          <Button size="lg">
            获取个性化评估 →
          </Button>
        </Link>
      </div>
    </div>
  );
}
