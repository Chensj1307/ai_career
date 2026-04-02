import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { UserNav } from '@/components/auth/UserNav';

export const metadata: Metadata = {
  title: 'AI职业罗盘 | AI Career Compass',
  description: '分析各行各业被AI代替的程度和趋势，提供行业×学历双维度分析',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <AuthWrapper>
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="navGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                      <filter id="navGlow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <circle cx="50" cy="50" r="45" stroke="url(#navGradient)" strokeWidth="2" fill="white" filter="url(#navGlow)"/>
                    <circle cx="50" cy="50" r="32" stroke="url(#navGradient)" strokeWidth="1" fill="white" opacity="0.5"/>
                    <path d="M35 50 L45 50 L50 40 L55 50 L65 50 L55 58 L58 70 L50 63 L42 70 L45 58 L35 50" fill="url(#navGradient)" opacity="0.8"/>
                    <circle cx="35" cy="30" r="2.5" fill="url(#navGradient)">
                      <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="70" cy="35" r="2" fill="url(#navGradient)">
                      <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="75" cy="65" r="2.5" fill="url(#navGradient)">
                      <animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="30" cy="70" r="2" fill="url(#navGradient)">
                      <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                </div>
                <h1 className="text-xl font-semibold text-slate-800">AI职业罗盘</h1>
              </div>
              <div className="flex items-center gap-4">
                <nav className="flex items-center gap-4">
                  <Link 
                    href="/" 
                    className="px-6 py-3 rounded-xl text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm hover:shadow-md transition-all duration-300 font-medium border border-blue-100 hover:border-blue-300"
                  >
                    首页:行业图谱
                  </Link>
                  <Link 
                    href="/assessment" 
                    className="px-6 py-3 rounded-xl text-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 shadow-sm hover:shadow-md transition-all duration-300 font-medium border border-purple-100 hover:border-purple-300"
                  >
                    个人评估
                  </Link>
                  <Link 
                    href="/career-path" 
                    className="px-6 py-3 rounded-xl text-green-700 bg-gradient-to-r from-green-50 to-teal-50 shadow-sm hover:shadow-md transition-all duration-300 font-medium border border-green-100 hover:border-green-300"
                  >
                    职业路径
                  </Link>
                </nav>
                <UserNav />
              </div>
            </div>
          </header>
          <main>{children}</main>
          <footer className="bg-white border-t mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-6 text-center">
              <p className="text-slate-600 text-sm mb-1">
                "未来不是等待发生的，而是我们正在创造的"
              </p>
              <p className="text-slate-400 text-xs">
                AI职业罗盘 · 引领您走向更智能的职业未来
              </p>
            </div>
          </footer>
        </AuthWrapper>
      </body>
    </html>
  );
}
