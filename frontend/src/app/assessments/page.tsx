'use client';

import React, { useState, useEffect } from 'react';
import { getUserInfo, getAssessmentHistory } from '@/lib/api';
import { AuthResponse, AssessmentHistory } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AssessmentsPage() {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [assessments, setAssessments] = useState<AssessmentHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await getUserInfo();
        setUser(userInfo);
        
        const history = await getAssessmentHistory();
        setAssessments(history);
      } catch (error) {
        // 用户未登录，重定向到登录页面
        window.location.href = '/auth/login';
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
          <p className="text-slate-600 mb-4">您需要登录才能访问评估历史</p>
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
        <h1 className="text-3xl font-bold text-slate-800 mb-8">评估历史</h1>
        
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-600">共 {assessments.length} 条评估记录</p>
          <Button onClick={() => window.location.href = '/assessment'}>
            开始新评估
          </Button>
        </div>
        
        <div className="space-y-4">
          {assessments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-slate-500 mb-4">暂无评估记录</p>
                <Button onClick={() => window.location.href = '/assessment'}>
                  开始首次评估
                </Button>
              </CardContent>
            </Card>
          ) : (
            assessments.map((assessment) => (
              <Card key={assessment.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{assessment.position}</CardTitle>
                    <span className="text-sm text-slate-500">
                      {new Date(assessment.created_at).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-2xl font-bold text-orange-600">
                        {assessment.risk_score}%
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">风险系数:</span>
                          <span className={`font-bold ${
                            assessment.risk_score < 30 ? 'text-green-600' :
                            assessment.risk_score < 60 ? 'text-yellow-600' :
                            assessment.risk_score < 80 ? 'text-orange-600' :
                            'text-red-600'
                          }`}>
                            {assessment.risk_score}%
                          </span>
                        </div>
                        <p className="text-slate-600">{assessment.summary}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary">查看详情</Button>
                      <Button variant="secondary">重新评估</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}