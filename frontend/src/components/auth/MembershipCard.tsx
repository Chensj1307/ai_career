import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Membership } from '@/types';

interface MembershipCardProps {
  membership: Membership;
  onUpgrade: () => void;
}

export function MembershipCard({ membership, onUpgrade }: MembershipCardProps) {
  const getMembershipName = (level: string) => {
    switch (level) {
      case 'free': return '免费会员';
      case 'basic': return '基础会员';
      case 'premium': return '高级会员';
      default: return '免费会员';
    }
  };

  const getMembershipColor = (level: string) => {
    switch (level) {
      case 'free': return 'text-slate-500';
      case 'basic': return 'text-blue-500';
      case 'premium': return 'text-purple-500';
      default: return 'text-slate-500';
    }
  };

  const getMembershipFeatures = (level: string) => {
    const features = {
      free: [
        '基础职业评估',
        '简单技能分析',
        '基础职业建议',
        '每月1次评估机会'
      ],
      basic: [
        '所有免费会员功能',
        '详细评估报告',
        '个性化学习计划',
        '每月3次评估机会',
        '技能提升建议'
      ],
      premium: [
        '所有基础会员功能',
        '专家/管理路线选择',
        '领导力培养',
        '无限评估机会',
        '1对1职业咨询',
        '专属学习资源'
      ]
    };
    return features[level as keyof typeof features] || features.free;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>会员信息</span>
          <span className={`font-bold ${getMembershipColor(membership.level)}`}>
            {getMembershipName(membership.level)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm text-slate-500 mb-2">会员权益</h3>
            <ul className="space-y-2">
              {getMembershipFeatures(membership.level).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">开始日期:</span>
              <span>{formatDate(membership.start_date)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">到期日期:</span>
              <span>{formatDate(membership.end_date)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">状态:</span>
              <span className={membership.status === 'active' ? 'text-green-500' : 'text-red-500'}>
                {membership.status === 'active' ? '活跃' : '已过期'}
              </span>
            </div>
          </div>
          
          {membership.level !== 'premium' && (
            <Button onClick={onUpgrade} className="w-full">
              升级会员
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}