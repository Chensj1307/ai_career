'use client';

import React, { useState } from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async (data: { name: string; email: string; password: string; phone?: string }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await register(data);
      if (response) {
        // 注册成功，显示成功消息
        setSuccess('注册成功，请登录');
        // 3秒后跳转到登录页面
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    } catch (err) {
      setError('注册失败，请检查输入信息');
      console.error('注册失败:', err);
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
        {success && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-4">
            {success}
          </div>
        )}
        <RegisterForm onSubmit={handleRegister} loading={loading} />
        <div className="mt-4 text-center">
          <p className="text-slate-600">
            已有账号？{' '}
            <a href="/auth/login" className="text-blue-600 hover:underline">
              立即登录
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}