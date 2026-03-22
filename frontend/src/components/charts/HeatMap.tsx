'use client';

import { useRef, useEffect, useState } from 'react';
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
          height: 500,
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const getColor = (value: number) => {
    if (value < 40) return RISK_COLORS.low;
    if (value < 60) return RISK_COLORS.medium;
    if (value < 80) return RISK_COLORS.high;
    return RISK_COLORS.critical;
  };

  const getTextColor = (value: number) => {
    return value >= 60 ? '#fff' : '#1e293b';
  };

  // 模拟动态调整
  const adjustedData = data.map(industry => ({
    ...industry,
    value: Math.min(100, industry.value + Math.floor((year - 2024) * 3)),
  }));

  const cols = 5;
  const rows = Math.ceil(adjustedData.length / cols);
  const cellWidth = dimensions.width / cols;
  const cellHeight = dimensions.height / rows;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          鼠标悬停查看详情 · 点击跳转行业详情页
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: RISK_COLORS.low }} />
            <span className="text-xs text-slate-500">安全 (&lt;40)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: RISK_COLORS.medium }} />
            <span className="text-xs text-slate-500">中等 (40-60)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: RISK_COLORS.high }} />
            <span className="text-xs text-slate-500">高风险 (60-80)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: RISK_COLORS.critical }} />
            <span className="text-xs text-slate-500">极高 (&gt;80)</span>
          </div>
        </div>
      </div>
      
      <div ref={containerRef} className="relative">
        {dimensions.width > 0 && adjustedData.map((industry, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          const x = col * cellWidth;
          const y = row * cellHeight;
          
          return (
            <div
              key={industry.name}
              className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:z-10 rounded-lg p-3 flex flex-col justify-between"
              style={{
                left: x + 4,
                top: y + 4,
                width: cellWidth - 8,
                height: cellHeight - 8,
                backgroundColor: getColor(industry.value),
                color: getTextColor(industry.value),
              }}
              onMouseEnter={() => onIndustryHover?.(industry.name)}
              onMouseLeave={() => onIndustryHover?.(null)}
            >
              <div className="font-semibold text-sm truncate">{industry.name}</div>
              <div className="text-center">
                <div className="text-2xl font-bold">{industry.value}</div>
                <div className="text-xs opacity-75">风险指数</div>
              </div>
              {industry.children && industry.children.length > 0 && (
                <div className="text-xs opacity-75 truncate">
                  {industry.children.map(c => c.name).join(' · ')}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center text-sm text-slate-500">
        预测年份: <span className="font-medium text-slate-700">{year}</span> · 
        学历: <span className="font-medium text-slate-700">
          {education === 'high_school' ? '高中' : 
           education === 'associate' ? '大专' : 
           education === 'bachelor' ? '本科' : 
           education === 'master' ? '硕士' : '博士'}
        </span>
      </div>
    </div>
  );
}
