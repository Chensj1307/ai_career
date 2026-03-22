'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { INDUSTRIES, RISK_COLORS, type EducationLevel, EDUCATION_LABELS, type AssessmentResult } from '@/types';
import AssessmentForm from '@/components/forms/AssessmentForm';

// 模拟评估结果
const mockResult: AssessmentResult = {
  riskIndex: 68,
  riskLevel: 'high',
  taskBreakdown: [
    { id: '1', taskName: '数据处理', replacementRate: 85, difficulty: 'high', estimatedYear: 2025, relatedSkills: ['Excel', 'SQL'] },
    { id: '2', taskName: '报告撰写', replacementRate: 72, difficulty: 'medium', estimatedYear: 2026, relatedSkills: ['PPT', '文档编辑'] },
    { id: '3', taskName: '客户沟通', replacementRate: 45, difficulty: 'low', estimatedYear: 2029, relatedSkills: ['沟通技巧'] },
  ],
  transitionSuggestions: [
    {
      id: '1',
      title: '转型数据分析师',
      description: '从基础数据处理升级为高级数据分析，利用AI工具增强分析能力',
      targetIndustry: '技术/IT',
      targetPosition: '数据分析师',
      urgency: 'high',
    },
    {
      id: '2',
      title: '学习AI提示工程',
      description: '掌握AI工具的使用方法，成为AI时代的效率提升者',
      urgency: 'high',
    },
    {
      id: '3',
      title: '考取项目管理PMP',
      description: '向需要强沟通和协调能力的管理岗位转型',
      targetPosition: '项目经理',
      urgency: 'medium',
    },
  ],
  skillUpgradePath: [
    {
      skill: 'Python数据分析',
      currentLevel: 2,
      targetLevel: 4,
      priority: 'high',
      learningResources: [
        { title: 'Python for Data Analysis', type: 'book', url: '#' },
        { title: 'pandas官方文档', type: 'article', url: '#' },
      ],
    },
    {
      skill: '机器学习基础',
      currentLevel: 1,
      targetLevel: 3,
      priority: 'medium',
      learningResources: [
        { title: '吴恩达机器学习课程', type: 'course', url: '#' },
      ],
    },
    {
      skill: '数据可视化',
      currentLevel: 2,
      targetLevel: 4,
      priority: 'medium',
      learningResources: [
        { title: 'Tableau入门', type: 'course', url: '#' },
      ],
    },
  ],
};

export default function AssessmentPage() {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500));
    setResult(mockResult);
    setIsLoading(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return RISK_COLORS.low;
      case 'medium': return RISK_COLORS.medium;
      case 'high': return RISK_COLORS.high;
      case 'critical': return RISK_COLORS.critical;
      default: return RISK_COLORS.medium;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10 animate-fadeIn">
        <h1 className="text-3xl font-bold text-slate-800 mb-3">🎯 个人职业风险评估</h1>
        <p className="text-slate-600">
          输入您的职业信息，获取AI替代风险分析和转型建议
        </p>
      </div>

      {!result ? (
        <Card className="p-8">
          <AssessmentForm onSubmit={handleSubmit} isLoading={isLoading} />
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Result Overview */}
          <Card className="p-8 text-center animate-fadeIn">
            <div className="mb-6">
              <div className="text-sm text-slate-500 mb-2">您的AI替代风险指数</div>
              <div 
                className="text-6xl font-bold inline-flex items-center justify-center w-32 h-32 rounded-full text-white"
                style={{ backgroundColor: getRiskColor(result.riskLevel) }}
              >
                {result.riskIndex}
              </div>
            </div>
            <div 
              className="inline-block px-4 py-2 rounded-full font-medium"
              style={{ 
                backgroundColor: getRiskColor(result.riskLevel) + '20',
                color: getRiskColor(result.riskLevel)
              }}
            >
              {result.riskLevel === 'low' && '✅ 低风险 - 相对安全'}
              {result.riskLevel === 'medium' && '⚠️ 中等风险 - 需关注'}
              {result.riskLevel === 'high' && '🔥 高风险 - 建议转型'}
              {result.riskLevel === 'critical' && '🚨 极高风险 - 立即行动'}
            </div>
          </Card>

          {/* Task Breakdown */}
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">📋 任务风险分解</h2>
            <div className="space-y-3">
              {result.taskBreakdown.map(task => (
                <Card key={task.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-800">{task.taskName}</div>
                      <div className="text-sm text-slate-500">
                        预计{task.estimatedYear}年被AI替代 · {task.difficulty === 'low' ? '低' : task.difficulty === 'medium' ? '中' : '高'}替代难度
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: getRiskColor(String(task.replacementRate)) }}>
                        {task.replacementRate}%
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {task.relatedSkills.map(skill => (
                      <span key={skill} className="text-xs bg-slate-100 px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Transition Suggestions */}
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">💡 转型建议</h2>
            <div className="space-y-4">
              {result.transitionSuggestions.map(suggestion => (
                <Card key={suggestion.id} className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-800">{suggestion.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getUrgencyColor(suggestion.urgency)}`}>
                      {suggestion.urgency === 'high' ? '紧急' : suggestion.urgency === 'medium' ? '建议' : '可选'}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-2">{suggestion.description}</p>
                  {suggestion.targetIndustry && (
                    <div className="text-sm text-slate-500">
                      目标: {suggestion.targetIndustry} · {suggestion.targetPosition}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </section>

          {/* Skill Upgrade Path */}
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">📚 技能升级路径</h2>
            <div className="space-y-4">
              {result.skillUpgradePath.map((skill, idx) => (
                <Card key={idx} className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-800">{skill.skill}</h3>
                    <span className={`text-sm font-medium ${getPriorityColor(skill.priority)}`}>
                      {skill.priority === 'high' ? '优先级：高' : skill.priority === 'medium' ? '优先级：中' : '优先级：低'}
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span>当前等级:</span>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => (
                          <div 
                            key={i} 
                            className={`w-4 h-2 rounded ${i <= skill.currentLevel ? 'bg-blue-500' : 'bg-slate-200'}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2">→ 目标等级:</span>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => (
                          <div 
                            key={i} 
                            className={`w-4 h-2 rounded ${i <= skill.targetLevel ? 'bg-green-500' : 'bg-slate-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.learningResources.map((resource, ridx) => (
                      <a 
                        key={ridx}
                        href={resource.url}
                        className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        {resource.title}
                      </a>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-center gap-4 pt-4">
            <Button variant="outline" onClick={() => setResult(null)}>
              重新评估
            </Button>
            <Link href="/">
              <Button>
                查看行业图谱 →
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
