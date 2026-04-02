'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import type { HeatMapData } from '@/types';
import { RISK_COLORS } from '@/types';

interface HeatMapProps {
  data: HeatMapData[];
  onIndustryHover?: (name: string | null) => void;
  year?: number;
  education?: string;
}

export default function HeatMap({ data, onIndustryHover, year = 2024, education = 'bachelor' }: HeatMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: Math.max(400, Math.ceil(data.length / 5) * 100),
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [data]);

  const getColor = (value: number) => {
    if (value < 40) return RISK_COLORS.low;
    if (value < 60) return RISK_COLORS.medium;
    if (value < 80) return RISK_COLORS.high;
    return RISK_COLORS.critical;
  };

  const getTextColor = (value: number) => {
    return value >= 60 ? '#fff' : '#1e293b';
  };

  // 模拟动态调整 - 根据年份和学历调整风险指数
  const getEducationFactor = (education: string) => {
    switch (education) {
      case 'high_school': return 1.2; // 高中学历风险更高
      case 'associate': return 1.1;
      case 'bachelor': return 1.0;
      case 'master': return 0.8;
      case 'phd': return 0.7;
      default: return 1.0;
    }
  };

  const adjustedData = data.map(industry => ({
    ...industry,
    value: Math.min(100, Math.floor((industry.value + Math.floor((year - 2026) * 3)) * getEducationFactor(education))),
  }));

  const cols = 5;
  const rows = Math.ceil(adjustedData.length / cols);
  const cellWidth = dimensions.width / cols;
  const cellHeight = dimensions.height / rows;

  return (
    <div className="space-y-6">
      {/* 标题和说明 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-800">行业AI替代风险热力图</h3>
          <p className="text-sm text-slate-600">
            鼠标悬停查看详情 · 点击跳转行业详情页
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: RISK_COLORS.low }} />
            <span className="text-xs text-slate-500">安全 (&lt;40)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: RISK_COLORS.medium }} />
            <span className="text-xs text-slate-500">中等 (40-60)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: RISK_COLORS.high }} />
            <span className="text-xs text-slate-500">高风险 (60-80)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: RISK_COLORS.critical }} />
            <span className="text-xs text-slate-500">极高 (&gt;80)</span>
          </div>
        </div>
      </div>
      
      {/* 热力图网格 */}
      <div ref={containerRef} className="w-full">
        {dimensions.width > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {adjustedData.map((industry) => (
              <Link
                key={industry.name}
                href={`/industries?code=${encodeURIComponent(industry.name)}`}
                className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-xl p-4 flex flex-col justify-between min-h-[140px] relative overflow-hidden"
                style={{
                  backgroundColor: getColor(industry.value),
                  color: getTextColor(industry.value),
                }}
                onMouseEnter={() => onIndustryHover?.(industry.name)}
                onMouseLeave={() => onIndustryHover?.(null)}
              >
                {/* 背景渐变效果 */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* 行业名称 */}
                <div className="font-semibold text-sm truncate z-10">{industry.name}</div>
                
                {/* 风险指数 */}
                <div className="text-center z-10">
                  <div className="text-3xl font-bold">{industry.value}</div>
                  <div className="text-xs opacity-75">风险指数</div>
                </div>
                
                {/* 子行业 */}
                {industry.children && industry.children.length > 0 && (
                  <div className="text-xs opacity-75 truncate z-10">
                    {industry.children.slice(0, 3).map(c => c.name).join(' · ')}
                    {industry.children.length > 3 && ` · +${industry.children.length - 3}个`}
                  </div>
                )}
                
                {/* 悬停时的箭头指示器 */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 年份和学历信息 */}
      <div className="mt-4 text-center text-sm text-slate-500 flex flex-col sm:flex-row justify-center items-center gap-4">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>预测年份: <span className="font-medium text-slate-700">{year}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>学历: <span className="font-medium text-slate-700">
            {education === 'high_school' ? '高中' : 
             education === 'associate' ? '大专' : 
             education === 'bachelor' ? '本科' : 
             education === 'master' ? '硕士' : '博士'}
          </span></span>
        </div>
      </div>
    </div>
  );
}
