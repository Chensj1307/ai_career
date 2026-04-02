'use client';

import React, { useState, useEffect } from 'react';
import { getUserInfo } from '@/lib/api';
import { AuthResponse, AssessmentHistory } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MembershipCard } from '@/components/auth/MembershipCard';

export default function DashboardPage() {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        setUser(userInfo);
      } catch (error) {
        // 用户未登录，重定向到登录页面
        window.location.href = '/auth/login';
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">您需要登录才能访问个人中心</p>
          <Button onClick={() => window.location.href = '/auth/login'}>
            去登录
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">个人中心</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 用户信息 */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>个人信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                    {user.user.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{user.user.name}</h2>
                    <p className="text-slate-500">{user.user.email}</p>
                    {user.user.phone && (
                      <p className="text-slate-500">{user.user.phone}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">注册时间:</span>
                    <span>{new Date(user.user.created_at).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
                <Button className="w-full">编辑个人信息</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* 会员信息 */}
          <Card className="lg:col-span-1">
            <MembershipCard 
              membership={user.membership} 
              onUpgrade={() => window.location.href = '/membership'}
            />
          </Card>
          
          {/* 统计信息 */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>统计信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">5</p>
                    <p className="text-sm text-slate-600">评估次数</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">3</p>
                    <p className="text-sm text-slate-600">技能提升</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600">2</p>
                    <p className="text-sm text-slate-600">职业规划</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-orange-600">1</p>
                    <p className="text-sm text-slate-600">学习计划</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* 最近活动 */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>最近活动</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    📊
                  </div>
                  <div>
                    <p className="font-medium">完成职业评估</p>
                    <p className="text-sm text-slate-500">2026-03-31 15:30</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    🎯
                  </div>
                  <div>
                    <p className="font-medium">更新职业规划</p>
                    <p className="text-sm text-slate-500">2026-03-30 10:15</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    📚
                  </div>
                  <div>
                    <p className="font-medium">创建学习计划</p>
                    <p className="text-sm text-slate-500">2026-03-29 14:20</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}