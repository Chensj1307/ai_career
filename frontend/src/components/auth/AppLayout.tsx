'use client';

import React from 'react';
import { AuthWrapper } from './AuthWrapper';
import { Header } from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <AuthWrapper>
      <Header />
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
  );
}