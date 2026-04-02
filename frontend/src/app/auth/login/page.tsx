'use client';

import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await login(data);
      if (response) {
        // 登录成功，存储用户信息和token
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        // 跳转到主页
        router.push('/');
      }
    } catch (err) {
      setError('登录失败，请检查邮箱和密码');
      console.error('登录失败:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">
          AI职业罗盘
        </h1>
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        <LoginForm onSubmit={handleLogin} loading={loading} />
        <div className="mt-4 text-center">
          <p className="text-slate-600">
            还没有账号？{' '}
            <a href="/auth/register" className="text-blue-600 hover:underline">
              立即注册
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}