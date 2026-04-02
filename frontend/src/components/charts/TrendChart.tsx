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
    <div className="space-y-6">
      {/* 趋势图标题 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold text-slate-800">AI替代风险趋势预测</h3>
        <div className="flex flex-wrap items-center gap-4 text-sm">
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
      
      {/* 趋势图 */}
      <div ref={containerRef} className="relative" style={{ height }}>
        {dimensions.width > 0 && (
          <svg width={dimensions.width} height={height} className="overflow-visible">
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
                  strokeOpacity={0.6}
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
                  className="text-xs fill-slate-500 font-medium"
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
                  className="text-xs fill-slate-500 font-medium"
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

            {/* 危险区域标记 */}
            <g>
              <rect
                x={padding.left}
                y={getY(60)}
                width={chartWidth}
                height={getY(0) - getY(60)}
                fill="rgba(239, 68, 68, 0.1)"
                className="opacity-50"
              />
              <line
                x1={padding.left}
                y1={getY(60)}
                x2={dimensions.width - padding.right}
                y2={getY(60)}
                stroke="rgba(239, 68, 68, 0.3)"
                strokeDasharray="4 4"
              />
              <text
                x={dimensions.width - padding.right + 10}
                y={getY(60) - 5}
                textAnchor="start"
                className="text-xs fill-red-500 font-medium"
              >
                高风险阈值
              </text>
            </g>

            {/* 区域填充 */}
            <path
              d={areaPath}
              fill={`url(#gradient)`}
              opacity={0.4}
              className="transition-opacity duration-300 hover:opacity-60"
            />

            {/* 渐变定义 */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={getColor(data[data.length - 1].risk)} />
                <stop offset="100%" stopColor={getColor(data[0].risk)} stopOpacity={0.1} />
              </linearGradient>
            </defs>

            {/* 线条 */}
            <path
              d={linePath}
              fill="none"
              stroke={getColor(data[data.length - 1].risk)}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300 hover:stroke-width-4"
            />

            {/* 数据点 */}
            {data.map((d, i) => (
              <g key={d.year}>
                {/* 危险区域背景 */}
                {d.risk >= 60 && (
                  <circle
                    cx={getX(d.year)}
                    cy={getY(d.risk)}
                    r={12}
                    fill={getColor(d.risk)}
                    opacity={0.2}
                    className="transition-all duration-300 hover:r-16"
                  />
                )}
                {/* 数据点 */}
                <circle
                  cx={getX(d.year)}
                  cy={getY(d.risk)}
                  r={6}
                  fill="white"
                  stroke={getColor(d.risk)}
                  strokeWidth={3}
                  className="cursor-pointer transition-all duration-300 hover:r-8 hover:stroke-width-4"
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
              </g>
            ))}
          </svg>
        )}

        {/* Tooltip */}
        {hoveredPoint && (
          <div 
            className="absolute bg-slate-800 text-white px-4 py-3 rounded-lg text-sm shadow-lg pointer-events-none z-10 transform transition-all duration-300 scale-95 hover:scale-100"
            style={{
              left: hoveredPoint.x,
              top: hoveredPoint.y,
              transform: 'translateX(-50%) scale(1)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div className="font-medium mb-1">{hoveredPoint.data.year}年</div>
            <div className="flex items-center gap-2 text-slate-300">
              <span>风险指数:</span>
              <span style={{ color: getColor(hoveredPoint.data.risk), fontWeight: 'bold' }}>
                {hoveredPoint.data.risk}
              </span>
            </div>
            <div className="mt-1 text-xs text-slate-400">
              {hoveredPoint.data.risk < 40 && '安全'}
              {hoveredPoint.data.risk >= 40 && hoveredPoint.data.risk < 60 && '中等风险'}
              {hoveredPoint.data.risk >= 60 && hoveredPoint.data.risk < 80 && '高风险'}
              {hoveredPoint.data.risk >= 80 && '极高风险'}
            </div>
          </div>
        )}
      </div>
      
      {/* 趋势说明 */}
      <div className="text-center text-sm text-slate-500">
        <p>基于历史数据和AI技术发展趋势预测，风险指数逐年变化</p>
      </div>
    </div>
  );
}
