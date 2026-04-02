'use client';

import React, { useState } from 'react';
import { useAuth } from './AuthProvider';

export function UserNav() {
  const { user, isLoading, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="flex items-center gap-4">
      {/* 用户认证区域 */}
      {isLoading ? (
        <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse"></div>
      ) : user ? (
        <div className="relative">
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {user.user.name.charAt(0)}
            </div>
            <span className="text-sm font-medium">{user.user.name}</span>
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
              <a 
                href="/dashboard" 
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => setShowUserMenu(false)}
              >
                个人中心
              </a>
              <a 
                href="/assessments" 
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => setShowUserMenu(false)}
              >
                评估历史
              </a>
              <a 
                href="/membership" 
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => setShowUserMenu(false)}
              >
                会员管理
              </a>
              <div className="border-t border-slate-200 my-1"></div>
              <button 
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}
              >
                退出登录
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <a 
            href="/auth/login" 
            className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          >
            登录
          </a>
          <a 
            href="/auth/register" 
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            注册
          </a>
        </div>
      )}
    </div>
  );
}