@echo off
chcp 65001 >nul
echo ============================================
echo    AI职业罗盘 - Windows快速安装脚本
echo ============================================
echo.

echo 正在创建项目目录...
mkdir ai-career-compass
cd ai-career-compass
echo ✅ 项目目录创建完成
echo.

echo 正在创建前端项目...
mkdir frontend
cd frontend
echo.

echo 创建 package.json...
(
echo {
echo   "name": "ai-career-compass-frontend",
echo   "version": "0.1.0",
echo   "private": true,
echo   "scripts": {
echo     "dev": "next dev -p 3000",
echo     "build": "next build",
echo     "start": "next start -p 3000"
echo   },
echo   "dependencies": {
echo     "react": "^18.2.0",
echo     "react-dom": "^18.2.0",
echo     "next": "^14.1.0",
echo     "axios": "^1.6.5",
echo     "zustand": "^4.5.0",
echo     "echarts": "^5.5.0",
echo     "echarts-for-react": "^3.0.2",
echo     "class-variance-authority": "^0.7.0",
echo     "clsx": "^2.1.0",
echo     "tailwind-merge": "^2.2.0"
echo   },
echo   "devDependencies": {
echo     "typescript": "^5.3.3",
echo     "@types/node": "^20.11.5",
echo     "@types/react": "^18.2.48",
echo     "@types/react-dom": "^18.2.18",
echo     "autoprefixer": "^10.4.17",
echo     "postcss": "^8.4.33",
echo     "tailwindcss": "^3.4.1",
echo     "eslint": "^8.56.0",
echo     "eslint-config-next": "^14.1.0"
echo   }
echo }
) > package.json
echo ✅ package.json 创建完成
echo.

echo 创建 next.config.js...
(
echo /** @type {import('next').NextConfig} */
echo const nextConfig = {
echo   output: 'standalone',
echo }
echo module.exports = nextConfig
) > next.config.js
echo ✅ next.config.js 创建完成
echo.

echo 创建 tsconfig.json...
(
echo {
echo   "compilerOptions": {
echo     "target": "ES2020",
echo     "lib": ["dom", "dom.iterable", "esnext"],
echo     "allowJs": true,
echo     "skipLibCheck": true,
echo     "strict": true,
echo     "noEmit": true,
echo     "esModuleInterop": true,
echo     "module": "esnext",
echo     "moduleResolution": "bundler",
echo     "resolveJsonModule": true,
echo     "isolatedModules": true,
echo     "jsx": "preserve",
echo     "incremental": true,
echo     "plugins": [
echo       ["@typescript-eslint/eslint-plugin", "tsx"],
echo       ["@typescript-eslint/eslint-plugin", "ts"]
echo     ],
echo     "paths": {
echo       "@/*": ["./src/*"]
echo     }
echo   },
echo   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
echo   "exclude": ["node_modules"]
echo }
) > tsconfig.json
echo ✅ tsconfig.json 创建完成
echo.

echo 创建 tailwind.config.js...
(
echo /** @type {import('tailwindcss').Config} */
echo module.exports = {
echo   darkMode: ["class"],
echo   content: [
echo     './pages/**/*.{ts,tsx}',
echo     './components/**/*.{ts,tsx}',
echo     './app/**/*.{ts,tsx}',
echo     './src/**/*.{ts,tsx}',
echo   ],
echo   theme: {
echo     extend: {},
echo   },
echo   plugins: [],
echo }
) > tailwind.config.js
echo ✅ tailwind.config.js 创建完成
echo.

echo 创建 postcss.config.js...
(
echo module.exports = {
echo   plugins: {
echo     tailwindcss: {},
echo     autoprefixer: {},
echo   },
echo }
) > postcss.config.js
echo ✅ postcss.config.js 创建完成
echo.

echo 创建 src 目录结构...
mkdir src\app
mkdir src\components
mkdir src\lib
mkdir src\types
echo ✅ 目录结构创建完成
echo.

echo 创建类型定义...
(
echo export interface HeatMapData {
echo   name: string;
echo   value: number;
echo   children?: HeatMapData[];
echo }
echo
echo export interface Industry {
echo   id: string;
echo   name: string;
echo   riskLevel: string;
echo   riskScore: number;
echo   positions: string[];
echo }
echo
echo export interface AssessmentInput {
echo   industry: string;
echo   position: string;
echo   education: string;
echo   workYears: number;
echo   skills: string[];
echo }
echo
echo export interface AssessmentResult {
echo   riskScore: number;
echo   riskLevel: string;
echo   tasks: Array<{
echo     task: string;
echo     risk: string;
echo     suggestion: string;
echo   }>;
echo   suggestions: string[];
echo }
echo
echo export const RISK_COLORS = {
echo   low: '#22c55e',
echo   medium: '#eab308',
echo   high: '#f97316',
echo   critical: '#ef4444',
echo } as const;
echo
echo export type EducationLevel = 'high_school' | 'associate' | 'bachelor' | 'master' | 'doctor';
echo
echo export const EDUCATION_LABELS: Record<EducationLevel, string> = {
echo   high_school: '高中',
echo   associate: '大专',
echo   bachelor: '本科',
echo   master: '硕士',
echo   doctor: '博士',
echo };
) > src\types\index.ts
echo ✅ 类型定义创建完成
echo.

echo 创建全局CSS...
(
echo @tailwind base;
echo @tailwind components;
echo @tailwind utilities;
echo
echo @layer base {
echo   :root {
echo     --background: 0 0%% 100%% hsl(0 0%% 100%%);
echo     --foreground: 0 0%% 3.9%% hsl(0 0%% 10%%);
echo     --card: 0 0%% 100%% hsl(0 0%% 100%%);
echo     --card-foreground: 0 0%% 3.9%% hsl(0 0%% 10%%);
echo   }
echo   .dark {
echo     --background: 0 0%% 3.9%% hsl(0 0%% 10%%);
echo     --foreground: 0 0%% 98%% hsl(0 0%% 98%%);
echo     --card: 0 0%% 14.9%% hsl(0 0%% 9.8%%);
echo     --card-foreground: 0 0%% 98%% hsl(0 0%% 98%%);
echo   }
echo }
echo
echo body {
echo   @apply bg-background text-foreground;
echo }
) > src\app\globals.css
echo ✅ 全局CSS创建完成
echo.

echo 正在创建核心页面文件...
echo.

echo 创建主页面...
(
echo 'use client';

echo import { useState } from 'react';
echo import { RISK_COLORS, type EducationLevel, EDUCATION_LABELS, type HeatMapData } from '@/types';

echo const mockHeatMapData: HeatMapData[] = [
echo   { name: '技术/IT', value: 78, children: [
echo     { name: '软件开发', value: 85 },
echo     { name: '数据分析', value: 82 },
echo     { name: '测试工程', value: 75 },
echo   ]},
echo   { name: '金融', value: 72, children: [
echo     { name: '会计', value: 88 },
echo     { name: '风控', value: 65 },
echo     { name: '客服', value: 80 },
echo   ]},
echo   { name: '零售', value: 68, children: [
echo     { name: '收银', value: 95 },
echo     { name: '理货', value: 60 },
echo   ]},
echo   { name: '制造业', value: 65, children: [
echo     { name: '流水线', value: 90 },
echo     { name: '质检', value: 78 },
echo   ]},
echo   { name: '医疗健康', value: 45, children: [
echo     { name: '影像诊断', value: 70 },
echo     { name: '护士', value: 35 },
echo   ]},
echo   { name: '教育', value: 52, children: [
echo     { name: '授课', value: 40 },
echo     { name: '助教', value: 65 },
echo   ]},
echo   { name: '餐饮服务', value: 70, children: [
echo     { name: '服务员', value: 85 },
echo     { name: '外卖', value: 90 },
echo   ]},
echo ];

echo export default function HomePage() {
echo   const [year, setYear] = useState(2024);
echo   const [education, setEducation] = useState('bachelor' as EducationLevel);

echo   const getRiskColor = (value: number) =^> {
echo     if (value ^< 40) return RISK_COLORS.low;
echo     if (value ^< 60) return RISK_COLORS.medium;
echo     if (value ^< 80) return RISK_COLORS.high;
echo     return RISK_COLORS.critical;
echo   };

echo   const getRiskLabel = (value: number) =^> {
echo     if (value ^< 40) return '安全';
echo     if (value ^< 60) return '中等';
echo     if (value ^< 80) return '高风险';
echo     return '极高风险';
echo   };

echo   return (
echo     ^<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100"^>
echo       ^<div className="max-w-7xl mx-auto px-4 py-8"^>
echo         ^<h1 className="text-4xl font-bold text-slate-800 mb-4 text-center"^>
echo           🔮 AI时代职业风险指南
echo         ^</h1^>
echo         ^<p className="text-lg text-slate-600 text-center max-w-2xl mx-auto mb-12"^>
echo           基于AI技术发展趋势，分析各行业被自动化替代的风险程度
echo         ^</p^>

echo         ^<div className="bg-white rounded-lg shadow-sm p-6 mb-8"^>
echo           ^<div className="mb-6"^>
echo             ^<label className="block text-sm font-medium mb-2"^>预测年份^</label^>
echo             ^<input
echo               type="range"
echo               min="2024"
echo               max="2035"
echo               value={year}
echo               onChange={(e) =^> setYear(parseInt(e.target.value))}
echo               className="w-full"
echo             /^>
echo             ^<div className="text-center mt-2"^>{year} 年^</div^>
echo           ^</div^>
echo           ^<div className="mb-6"^>
echo             ^<label className="block text-sm font-medium mb-2"^>学历层次^</label^>
echo             ^<select
echo               value={education}
echo               onChange={(e) =^> setEducation(e.target.value as EducationLevel)}
echo               className="w-full p-2 border rounded"
echo             ^>
echo               ^{Object.entries(EDUCATION_LABELS).map(([key, label]) =^> (
echo                 ^<option key={key} value={key}^>{label}^</option^>
echo               ))}
echo             ^</select^>
echo           ^</div^>
echo         ^</div^>

echo         ^<h2 className="text-2xl font-semibold text-slate-800 mb-6"^>📊 行业AI替代风险热力图^</h2^>
echo         ^<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"^>
echo           {mockHeatMapData.map((industry) =^> (
echo             ^<div
echo               key={industry.name}
echo               className="bg-white rounded-lg shadow-sm p-5 hover:shadow-lg transition-shadow"
echo             ^>
echo               ^<div className="flex items-center justify-between mb-3"^>
echo                 ^<h3 className="font-semibold text-slate-800"^>{industry.name}^</h3^>
echo                 ^<span
echo                   className="px-3 py-1 rounded-full text-xs font-medium text-white"
echo                   style={{ backgroundColor: getRiskColor(industry.value) }}
echo                 ^>
echo                   {getRiskLabel(industry.value)}
echo                 ^</span^>
echo               ^</div^>
echo               ^<div className="w-full bg-slate-200 rounded-full h-2 mb-2"^>
echo                 ^<div
echo                   className="h-2 rounded-full"
echo                   style={{
echo                     width: `${industry.value}%`,
echo                     backgroundColor: getRiskColor(industry.value)
echo                   }}
echo                 /^>
echo                 ^</div^>
echo               ^</div^>
echo               ^<div className="text-sm text-slate-500"^>
echo                 风险指数: {industry.value}
echo               ^</div^>
echo               {industry.children ^&^& (
echo                 ^<div className="mt-3 flex flex-wrap gap-1"^>
echo                   {industry.children.map((child) =^> (
echo                     ^<span key={child.name} className="text-xs bg-slate-100 px-2 py-1 rounded"^>
echo                       {child.name}
echo                     ^</span^>
echo                   ))}
echo                 ^</div^>
echo               )}
echo             ^</div^>
echo           ))}
echo         ^</div^>
echo       ^</div^>
echo     ^</div^>
echo   );
echo }
) > src\app\page.tsx
echo ✅ 主页面创建完成
echo.

echo 创建布局文件...
(
echo export default function RootLayout({
echo   children,
echo }: {
echo   children: React.ReactNode
echo }) {
echo   return (
echo     ^<html lang="zh-CN"^>
echo       ^<head^>
echo         ^<title^>AI职业罗盘^</title^>
echo         ^<meta name="description" content="分析各行各业被AI代替的程度和趋势" /^>
echo         ^<meta name="viewport" content="width=device-width, initial-scale=1" /^>
echo       ^</head^>
echo       ^<body^>
echo         {children}
echo       ^</body^>
echo     ^</html^>
echo   );
echo }
) > src\app\layout.tsx
echo ✅ 布局文件创建完成
echo.

echo 创建评估页面...
mkdir src\app\assessment
(
echo 'use client';

echo import { useState } from 'react';

echo export default function AssessmentPage() {
echo   const [industry, setIndustry] = useState('');
echo   const [position, setPosition] = useState('');
echo   const [education, setEducation] = useState('bachelor');
echo   const [result, setResult] = useState(null as any);

echo   const handleSubmit = (e: React.FormEvent) =^> {
echo     e.preventDefault();
echo     setResult({
echo       riskScore: 65,
echo       riskLevel: '中等风险',
echo       tasks: [
echo         { task: '数据分析', risk: '高', suggestion: '提升AI工具使用能力' },
echo         { task: '报告撰写', risk: '中', suggestion: '增强创新思维能力' },
echo       ],
echo       suggestions: ['考虑向AI工具开发方向转型', '加强数据科学技能'],
echo     });
echo   };

echo   return (
echo     ^<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100"^>
echo       ^<div className="max-w-7xl mx-auto px-4 py-8"^>
echo         ^<h1 className="text-4xl font-bold text-slate-800 mb-8"^>个人职业风险评估^</h1^>
echo
echo         ^{!result ? (
echo           ^<form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 max-w-2xl"^>
echo             ^<div className="mb-4"^>
echo               ^<label className="block text-sm font-medium mb-2"^>行业^</label^>
echo               ^<select
echo                 value={industry}
echo                 onChange={(e) =^> setIndustry(e.target.value)}
echo                 className="w-full p-2 border rounded"
echo                 required
echo               ^>
echo                 ^<option value=""^>请选择行业^</option^>
echo                 ^<option^>技术/IT^</option^>
echo                 ^<option^>金融^</option^>
echo                 ^<option^>医疗健康^</option^>
echo                 ^<option^>教育^</option^>
echo               ^</select^>
echo             ^</div^>
echo             ^<div className="mb-4"^>
echo               ^<label className="block text-sm font-medium mb-2"^>职位^</label^>
echo               ^<input
echo                 type="text"
echo                 value={position}
echo                 onChange={(e) =^> setPosition(e.target.value)}
echo                 className="w-full p-2 border rounded"
echo                 placeholder="请输入职位"
echo                 required
echo               /^>
echo             ^</div^>
echo             ^<div className="mb-4"^>
echo               ^<label className="block text-sm font-medium mb-2"^>学历^</label^>
echo               ^<select
echo                 value={education}
echo                 onChange={(e) =^> setEducation(e.target.value)}
echo                 className="w-full p-2 border rounded"
echo               ^>
echo                 ^<option value="high_school"^>高中^</option^>
echo                 ^<option value="bachelor"^>本科^</option^>
echo                 ^<option value="master"^>硕士^</option^>
echo               ^</select^>
echo             ^</div^>
echo             ^<button
echo               type="submit"
echo               className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
echo             ^>
echo               开始评估
echo             ^</button^>
echo           ^</form^>
echo         ) : (
echo           ^<div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl"^>
echo             ^<h2 className="text-2xl font-bold mb-4"^>评估结果^</h2^>
echo             ^<div className="mb-6"^>
echo               ^<p className="text-lg"^>风险指数: {result.riskScore}^</p^>
echo               ^<p className="text-lg"^>风险等级: {result.riskLevel}^</p^>
echo             ^</div^>
echo             ^<div className="mb-6"^>
echo               ^<h3 className="font-semibold mb-2"^>任务分解^</h3^>
echo               {result.tasks.map((task: any, idx: number) =^> (
echo                 ^<div key={idx} className="mb-2"^>
echo                   ^<span^>{task.task}^</span^>: ^<span^>{task.risk}^</span^>
echo                   ^<p className="text-sm text-slate-500"^>{task.suggestion}^</p^>
echo                 ^</div^>
echo               ))}
echo             ^</div^>
echo             ^<div^>
echo               ^<h3 className="font-semibold mb-2"^>转型建议^</h3^>
echo               ^<ul className="list-disc list-inside"^>
echo                 {result.suggestions.map((s: string, idx: number) =^> (
echo                   ^<li key={idx}^>{s}^</li^>
echo                 ))}
echo               ^</ul^>
echo             ^</div^>
echo             ^<button
echo               onClick={() =^> setResult(null)}
echo               className="mt-4 text-blue-600 hover:underline"
echo             ^>
echo               重新评估
echo             ^</button^>
echo           ^</div^>
echo         )}
echo       ^</div^>
echo     ^</div^>
echo   );
echo }
) > src\app\assessment\page.tsx
echo ✅ 评估页面创建完成
echo.

echo ============================================
echo    项目创建完成！
echo ============================================
echo.
echo 接下来的步骤：
echo.
echo 1. 安装 Node.js（如果还没安装）
echo    访问：https://nodejs.org/
echo    下载并安装最新的 LTS 版本
echo.
echo 2. 打开命令提示符（CMD）或 PowerShell
echo    进入项目目录：
echo    cd ai-career-compass\frontend
echo.
echo 3. 安装依赖
echo    npm install
echo.
echo 4. 启动开发服务器
echo    npm run dev
echo.
echo 5. 在浏览器中访问
echo    http://localhost:3000
echo.
echo ============================================
echo    按任意键关闭此窗口...
echo ============================================
pause >nul
