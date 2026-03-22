'use client';

import { useRef, useEffect, useState } from 'react';
import { RISK_COLORS } from '@/types';

interface TrendData {
  year: number;
  risk: number;
}

interface TrendChartProps {
  data: TrendData[];
  height?: number;
}

export default function TrendChart({ data, height = 300 }: TrendChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0 });
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; data: TrendData } | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const padding = { top: 30, right: 30, bottom: 40, left: 50 };
  const chartWidth = dimensions.width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const minYear = Math.min(...data.map(d => d.year));
  const maxYear = Math.max(...data.map(d => d.year));
  const maxRisk = 100;

  const getX = (year: number) => {
    return padding.left + ((year - minYear) / (maxYear - minYear)) * chartWidth;
  };

  const getY = (risk: number) => {
    return padding.top + chartHeight - (risk / maxRisk) * chartHeight;
  };

  const getColor = (risk: number) => {
    if (risk < 40) return RISK_COLORS.low;
    if (risk < 60) return RISK_COLORS.medium;
    if (risk < 80) return RISK_COLORS.high;
    return RISK_COLORS.critical;
  };

  // 生成路径
  const linePath = data.map((d, i) => {
    const x = getX(d.year);
    const y = getY(d.risk);
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(' ');

  // 生成区域填充路径
  const areaPath = `${linePath} L ${getX(maxYear)} ${getY(0)} L ${getX(minYear)} ${getY(0)} Z`;

  // 生成刻度
  const yTicks = [0, 20, 40, 60, 80, 100];
  const xTicks = data.map(d => d.year);

  return (
    <div>
      <div ref={containerRef} className="relative" style={{ height }}>
        {dimensions.width > 0 && (
          <svg width={dimensions.width} height={height}>
            {/* 网格线 */}
            <g>
              {yTicks.map(tick => (
                <line
                  key={tick}
                  x1={padding.left}
                  y1={getY(tick)}
                  x2={dimensions.width - padding.right}
                  y2={getY(tick)}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
              ))}
            </g>

            {/* Y轴标签 */}
            <g>
              {yTicks.map(tick => (
                <text
                  key={tick}
                  x={padding.left - 10}
                  y={getY(tick)}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  className="text-xs fill-slate-500"
                >
                  {tick}
                </text>
              ))}
              <text
                x={padding.left - 10}
                y={padding.top - 10}
                textAnchor="end"
                className="text-xs fill-slate-600 font-medium"
              >
                风险指数
              </text>
            </g>

            {/* X轴标签 */}
            <g>
              {xTicks.map(year => (
                <text
                  key={year}
                  x={getX(year)}
                  y={height - padding.bottom + 20}
                  textAnchor="middle"
                  className="text-xs fill-slate-500"
                >
                  {year}
                </text>
              ))}
              <text
                x={(padding.left + dimensions.width - padding.right) / 2}
                y={height - 10}
                textAnchor="middle"
                className="text-xs fill-slate-600 font-medium"
              >
                年份
              </text>
            </g>

            {/* 区域填充 */}
            <path
              d={areaPath}
              fill={`url(#gradient)`}
              opacity={0.3}
            />

            {/* 渐变定义 */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            {/* 线条 */}
            <path
              d={linePath}
              fill="none"
              stroke="#f97316"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* 数据点 */}
            {data.map((d, i) => (
              <g key={d.year}>
                <circle
                  cx={getX(d.year)}
                  cy={getY(d.risk)}
                  r={6}
                  fill="white"
                  stroke={getColor(d.risk)}
                  strokeWidth={3}
                  className="cursor-pointer hover:r-8 transition-all"
                  onMouseEnter={(e) => {
                    const rect = containerRef.current?.getBoundingClientRect();
                    if (rect) {
                      setHoveredPoint({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top - 40,
                        data: d,
                      });
                    }
                  }}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {/* 危险区域背景 */}
                {d.risk >= 60 && (
                  <circle
                    cx={getX(d.year)}
                    cy={getY(d.risk)}
                    r={10}
                    fill={getColor(d.risk)}
                    opacity={0.2}
                  />
                )}
              </g>
            ))}
          </svg>
        )}

        {/* Tooltip */}
        {hoveredPoint && (
          <div 
            className="absolute bg-slate-800 text-white px-3 py-2 rounded-lg text-sm shadow-lg pointer-events-none z-10"
            style={{
              left: hoveredPoint.x,
              top: hoveredPoint.y,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-medium">{hoveredPoint.data.year}年</div>
            <div className="text-slate-300">
              风险指数: <span style={{ color: getColor(hoveredPoint.data.risk) }}>{hoveredPoint.data.risk}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: RISK_COLORS.low }} />
          <span className="text-slate-500">安全 (&lt;40)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: RISK_COLORS.medium }} />
          <span className="text-slate-500">中等 (40-60)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: RISK_COLORS.high }} />
          <span className="text-slate-500">高风险 (60-80)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: RISK_COLORS.critical }} />
          <span className="text-slate-500">极高 (&gt;80)</span>
        </div>
      </div>
    </div>
  );
}
