import type { Metadata } from 'next';
import './globals.css';

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
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">罗</span>
              </div>
              <h1 className="text-xl font-semibold text-slate-800">AI职业罗盘</h1>
            </div>
            <nav className="flex items-center gap-6">
              <a href="/" className="text-slate-600 hover:text-blue-600 transition-colors">
                行业图谱
              </a>
              <a href="/assessment" className="text-slate-600 hover:text-blue-600 transition-colors">
                个人评估
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-white border-t mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-slate-500 text-sm">
            © 2024 AI职业罗盘 · 帮助您洞察AI对职业的影响
          </div>
        </footer>
      </body>
    </html>
  );
}
