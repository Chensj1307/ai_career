'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUserInfo } from '@/lib/api';
import { AuthResponse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MembershipCard } from '@/components/auth/MembershipCard';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { getMembershipList, MembershipPriceInfo, getUserMembershipInfo, UserMembershipInfo } from '@/lib/api';

export default function MembershipPage() {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPriceInfo[]>([]);
  const [userMembership, setUserMembership] = useState<UserMembershipInfo | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPriceInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取用户信息
        const userInfo = await getUserInfo();
        setUser(userInfo);
        
        // 获取会员列表
        const plans = await getMembershipList();
        setMembershipPlans(plans);
        
        // 获取用户会员信息
        const membership = await getUserMembershipInfo();
        setUserMembership(membership);
      } catch (error) {
        console.error('获取数据失败:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpgrade = (plan: MembershipPriceInfo) => {
    if (plan.level === 'free') {
      // 免费会员直接升级
      handlePaymentSuccess();
      return;
    }
    
    // 打开支付弹窗
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async () => {
    // 刷新用户会员信息
    try {
      const membership = await getUserMembershipInfo();
      setUserMembership(membership);
      
      // 刷新用户信息
      const userInfo = await getUserInfo();
      setUser(userInfo);
      
      // 关闭支付弹窗
      setIsPaymentModalOpen(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error('刷新会员信息失败:', error);
    }
  };

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
          <p className="text-slate-600 mb-4">您需要登录才能访问会员管理</p>
          <Link href="/auth/login">
            <Button>
              去登录
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">会员管理</h1>
        
        {/* 当前会员信息 */}
        <div className="mb-8">
          <MembershipCard 
            membership={user.membership} 
            onUpgrade={() => {}}
          />
        </div>
        
        {/* 会员计划 */}
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">会员计划</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {membershipPlans.map((plan) => (
            <Card 
              key={plan.level} 
              className={`relative ${plan.is_current ? 'border-2 border-blue-500' : ''}`}
            >
              {plan.is_current && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  当前方案
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">¥{plan.price}</span>
                  {plan.original_price && plan.original_price > plan.price && (
                    <span className="text-slate-400 line-through ml-2">¥{plan.original_price}</span>
                  )}
                  <span className="text-slate-500 ml-2">
                    / {plan.duration_days >= 365 ? '永久' : `${plan.duration_days}天`}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.benefits.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.is_current ? (
                  <Button disabled className="w-full">
                    当前方案
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={() => handleUpgrade(plan)}
                    variant={plan.level === 'premium' ? 'default' : 'outline'}
                  >
                    {plan.level === 'free' ? '免费使用' : '立即购买'}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* 常见问题 */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">常见问题</h2>
          <Card>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-lg mb-2">如何购买高级会员？</h3>
                <p className="text-slate-600">点击"立即购买"按钮，选择微信支付或支付宝完成支付即可购买高级会员。</p>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">高级会员是永久的吗？</h3>
                <p className="text-slate-600">是的，高级会员为单次购买，一旦购买，永久有效。</p>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">支持哪些支付方式？</h3>
                <p className="text-slate-600">我们支持微信支付和支付宝两种支付方式，您可以选择最方便的方式进行支付。</p>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">支付安全吗？</h3>
                <p className="text-slate-600">我们使用官方支付接口，所有支付信息都经过加密处理，确保您的支付安全。</p>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">高级会员权益有哪些？</h3>
                <p className="text-slate-600">高级会员享有详细评估报告、个性化学习计划、无限评估机会等多项专属权益，具体可查看上方的会员计划详情。</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 支付弹窗 */}
      {selectedPlan && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedPlan(null);
          }}
          membershipLevel={selectedPlan.level}
          membershipName={selectedPlan.name}
          amount={selectedPlan.price}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
