'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { INDUSTRIES, RISK_COLORS, type EducationLevel, EDUCATION_LABELS, type AssessmentResult, type AuthResponse } from '@/types';
import AssessmentForm from '@/components/forms/AssessmentForm';

// 导入API服务
import { submitAssessment, getUserInfo } from '@/lib/api';

export default function AssessmentPage() {
  const router = useRouter();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userInfo = await getUserInfo();
        setUser(userInfo);
      } catch (error) {
        // 用户未登录
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 计算AI替代风险指数的函数
  const calculateRiskIndex = (data: any) => {
    let riskScore = 50; // 基础分数
    
    // 1. 行业风险系数 (0-25分)
    const industryRiskMap: Record<string, number> = {
      '技术/IT': 20,
      '金融': 18,
      '零售': 15,
      '制造业': 22,
      '医疗健康': 8,
      '教育': 12,
      '媒体/娱乐': 14,
      '法律': 10,
      '交通运输': 16,
      '餐饮服务': 20,
      '建筑/房地产': 13,
      '农业': 5,
      '能源': 12,
      '咨询': 14,
      '公共服务': 8,
      '艺术/设计': 12,
      '体育/健身': 6,
      '科研': 10,
      '美容/时尚': 11,
      '创意产业': 13,
      '环境/可持续发展': 7,
      '人力资源': 19,
      '市场/销售': 17,
      '物流/供应链': 18,
      '信息技术服务': 21,
      '酒店/旅游': 16,
      '电信/通信': 20,
      '零售科技': 19,
      '健康/养生': 8
    };
    riskScore += industryRiskMap[data.industry] || 15;
    
    // 2. 职业类型风险系数 (0-30分)
    const highRiskPositions = ['助理', '专员', '前台', '行政', '客服', '文员', '录入员', '收银员'];
    const mediumRiskPositions = ['销售', '运营', '市场', '财务', '人事', '采购'];
    const lowRiskPositions = ['工程师', '架构师', '医生', '律师', '教师', '艺术家', '科学家', '研究员'];
    
    if (highRiskPositions.some(pos => data.position.includes(pos))) {
      riskScore += 28;
    } else if (mediumRiskPositions.some(pos => data.position.includes(pos))) {
      riskScore += 18;
    } else if (lowRiskPositions.some(pos => data.position.includes(pos))) {
      riskScore += 8;
    } else {
      riskScore += 20;
    }
    
    // 3. 技能保护系数 (-10到+10分)
    // 技能越多，风险越低
    const skillCount = data.skills?.length || 0;
    if (skillCount >= 8) {
      riskScore -= 10;
    } else if (skillCount >= 5) {
      riskScore -= 5;
    } else if (skillCount >= 3) {
      riskScore -= 2;
    } else {
      riskScore += 5;
    }
    
    // 4. 工作经验保护系数 (-5到+5分)
    const workYears = data.workYears || 0;
    if (workYears >= 10) {
      riskScore -= 5;
    } else if (workYears >= 5) {
      riskScore -= 3;
    } else if (workYears >= 3) {
      riskScore -= 1;
    } else {
      riskScore += 3;
    }
    
    // 5. 学历保护系数 (-5到+5分)
    const educationBonus: Record<string, number> = {
      'doctor': -5,
      'master': -4,
      'bachelor': -2,
      'associate': 0,
      'high_school': 2,
      'other': 3
    };
    riskScore += educationBonus[data.education] || 0;
    
    // 6. 所在城市风险系数 (-3到+3分)
    // 一线城市AI应用更广泛，风险略高
    const tier1Cities = ['北京', '上海', '广州', '深圳', '杭州'];
    if (tier1Cities.some(city => data.city?.includes(city))) {
      riskScore += 3;
    } else {
      riskScore -= 2;
    }
    
    // 7. 薪资水平风险系数 (-3到+3分)
    // 高薪职位通常更难被替代
    const salaryRanges: Record<string, number> = {
      '5k以下': 3,
      '5k-8k': 2,
      '8k-12k': 1,
      '12k-18k': -1,
      '18k-25k': -2,
      '25k以上': -3
    };
    riskScore += salaryRanges[data.salaryRange] || 0;
    
    // 8. 公司规模影响 (-2到+2分)
    // 大公司更倾向于使用AI工具
    const companySizeBonus: Record<string, number> = {
      '100人以下': -2,
      '100-500人': -1,
      '500-1000人': 0,
      '1000-5000人': 1,
      '5000人以上': 2
    };
    riskScore += companySizeBonus[data.companySize] || 0;
    
    // 确保分数在0-100范围内
    riskScore = Math.max(0, Math.min(100, riskScore));
    
    return Math.round(riskScore);
  };

  const handleSubmit = async (data: any) => {
    setFormData(data);
    setIsLoading(true);
    try {
      // 调用后端API进行评估
      const personalizedResult = await submitAssessment(data);
      setResult(personalizedResult);
    } catch (error) {
      console.error('评估失败:', error);
      
      // 计算AI替代风险指数
      const riskIndex = calculateRiskIndex(data);
      
      // 判断风险等级
      let riskLevel: 'low' | 'medium' | 'high' | 'critical';
      if (riskIndex <= 30) {
        riskLevel = 'low';
      } else if (riskIndex <= 60) {
        riskLevel = 'medium';
      } else if (riskIndex <= 80) {
        riskLevel = 'high';
      } else {
        riskLevel = 'critical';
      }
      
      // 判断用户职业类型
      const isTechnicalJob = data.position.includes('工程师') || 
                          data.position.includes('开发') || 
                          data.position.includes('程序员') || 
                          data.position.includes('分析师') || 
                          data.position.includes('数据') || 
                          data.position.includes('算法') || 
                          data.position.includes('架构师') || 
                          data.position.includes('技术');
      
      const isSimpleJob = data.position.includes('助理') || 
                         data.position.includes('专员') || 
                         data.position.includes('前台') || 
                         data.position.includes('行政') || 
                         data.position.includes('客服') || 
                         data.position.includes('销售') || 
                         data.position.includes('运营');
      
      //  fallback到本地模拟数据
      const fallbackResult = {
        riskIndex: riskIndex,
        riskLevel: riskLevel,
        taskBreakdown: isTechnicalJob ? [
          { 
            id: '1', 
            taskName: '代码开发与维护', 
            replacementRate: 40, 
            difficulty: 'high', 
            estimatedYear: 2030, 
            relatedSkills: ['编程', '算法', '架构设计'],
            description: '常规代码开发和维护任务，AI辅助工具正在提升效率，但核心算法和架构设计仍需人类专家',
            impact: '中',
            mitigation: '专注于复杂问题解决和创新设计，提升算法和架构能力'
          },
          { 
            id: '2', 
            taskName: '技术文档编写', 
            replacementRate: 60, 
            difficulty: 'medium', 
            estimatedYear: 2028, 
            relatedSkills: ['技术写作', '文档管理'],
            description: '标准化技术文档编写任务，AI辅助工具已能生成高质量文档',
            impact: '中',
            mitigation: '专注于架构设计文档和复杂系统说明，提升技术沟通能力'
          },
          { 
            id: '3', 
            taskName: '系统调试与优化', 
            replacementRate: 30, 
            difficulty: 'high', 
            estimatedYear: 2032, 
            relatedSkills: ['调试', '性能优化', '问题解决'],
            description: '系统调试和性能优化任务，需要深厚的技术知识和经验，AI辅助但难以完全替代',
            impact: '低',
            mitigation: '提升系统架构和性能优化能力，成为技术专家'
          },
          { 
            id: '4', 
            taskName: '技术方案设计', 
            replacementRate: 20, 
            difficulty: 'high', 
            estimatedYear: 2035, 
            relatedSkills: ['系统设计', '架构规划', '技术选型'],
            description: '复杂技术方案设计任务，需要综合考虑多种因素，AI难以替代人类的创新思维',
            impact: '低',
            mitigation: '深耕技术领域，成为架构设计专家'
          },
        ] : isSimpleJob ? [
          { 
            id: '1', 
            taskName: '数据录入与整理', 
            replacementRate: 80, 
            difficulty: 'low', 
            estimatedYear: 2026, 
            relatedSkills: ['数据录入', 'Excel', '文档整理'],
            description: '重复性数据录入和整理任务，AI和自动化工具正在快速替代',
            impact: '高',
            mitigation: '学习基础数据分析技能，提升办公自动化能力'
          },
          { 
            id: '2', 
            taskName: '基础客户服务', 
            replacementRate: 70, 
            difficulty: 'low', 
            estimatedYear: 2027, 
            relatedSkills: ['客户服务', '沟通技巧'],
            description: '基础客户咨询和问题解答，AI客服正在逐步替代',
            impact: '高',
            mitigation: '提升复杂问题解决能力和情感沟通技巧'
          },
          { 
            id: '3', 
            taskName: '行政事务处理', 
            replacementRate: 60, 
            difficulty: 'low', 
            estimatedYear: 2028, 
            relatedSkills: ['行政工作', '文档管理', '日程安排'],
            description: '常规行政事务处理，AI和自动化工具正在提升效率',
            impact: '中',
            mitigation: '学习办公自动化工具，提升综合协调能力'
          },
          { 
            id: '4', 
            taskName: '简单信息整理', 
            replacementRate: 75, 
            difficulty: 'low', 
            estimatedYear: 2026, 
            relatedSkills: ['信息整理', '文档处理'],
            description: '简单信息收集和整理任务，AI工具已能高效完成',
            impact: '高',
            mitigation: '提升信息分析和决策支持能力'
          },
        ] : [
          { 
            id: '1', 
            taskName: '数据处理与分析', 
            replacementRate: 60, 
            difficulty: 'medium', 
            estimatedYear: 2028, 
            relatedSkills: ['Excel', 'SQL', 'Python'],
            description: '日常数据清洗、统计分析和报表生成等任务，AI工具正在快速替代这些重复性工作',
            impact: '高',
            mitigation: '学习高级数据分析技能，专注于数据解读和业务决策'
          },
          { 
            id: '2', 
            taskName: '报告撰写与文档管理', 
            replacementRate: 50, 
            difficulty: 'low', 
            estimatedYear: 2029, 
            relatedSkills: ['PPT', '文档编辑', '内容创作'],
            description: '标准化报告撰写、文档整理和内容管理等任务，AI辅助工具已能完成大部分工作',
            impact: '中',
            mitigation: '专注于策略性内容创作和专业领域知识输出'
          },
          { 
            id: '3', 
            taskName: '客户沟通与服务', 
            replacementRate: 30, 
            difficulty: 'low', 
            estimatedYear: 2030, 
            relatedSkills: ['沟通技巧', '客户关系管理', '问题解决'],
            description: '基础客户咨询、常见问题解答和服务协调等任务，AI客服正在逐步替代',
            impact: '低',
            mitigation: '提升复杂问题解决能力和情感沟通技巧'
          },
          { 
            id: '4', 
            taskName: '项目管理与协调', 
            replacementRate: 40, 
            difficulty: 'medium', 
            estimatedYear: 2031, 
            relatedSkills: ['项目管理', '团队协作', '时间管理'],
            description: '日常项目跟踪、任务分配和进度管理等任务，AI工具正在辅助这些工作',
            impact: '中',
            mitigation: '专注于战略规划和跨团队协作能力'
          },
        ],
        transitionSuggestions: isTechnicalJob ? [
          {
            id: '1',
            title: 'AI技术专家',
            description: '深入学习AI技术，成为AI应用和开发的专家，掌握前沿技术和工具',
            targetIndustry: data.industry,
            targetPosition: `AI技术专家/${data.position}`,
            urgency: 'high' as const,
            steps: [
              '学习机器学习和深度学习基础',
              '掌握行业相关的AI框架和工具',
              '参与AI项目开发和应用',
              '发表技术文章和分享经验'
            ],
            expectedOutcome: '成为技术团队中的AI专家，职业价值显著提升'
          },
          {
            id: '2',
            title: '技术架构师',
            description: '提升系统架构和设计能力，成为技术决策的核心人物',
            targetIndustry: data.industry,
            targetPosition: `技术架构师`,
            urgency: 'medium' as const,
            steps: [
              '学习系统架构设计原理',
              '参与大型项目的架构设计',
              '研究技术发展趋势',
              '提升技术领导力'
            ],
            expectedOutcome: '成为技术团队的核心决策者，职业发展空间广阔'
          },
          {
            id: '3',
            title: '技术管理者',
            description: '提升技术管理能力，带领团队进行技术创新和项目交付',
            targetIndustry: data.industry,
            targetPosition: `技术经理/${data.position}`,
            urgency: 'medium' as const,
            steps: [
              '学习项目管理和团队管理知识',
              '提升沟通和领导力',
              '参与跨团队协作项目',
              '培养技术团队文化'
            ],
            expectedOutcome: '成为技术团队的领导者，职业发展路径多元化'
          },
          {
            id: '4',
            title: '行业技术专家',
            description: '深耕行业专业知识，成为行业技术应用的权威专家',
            targetIndustry: data.industry,
            targetPosition: `行业技术专家`,
            urgency: 'medium' as const,
            steps: [
              '深入研究行业技术应用',
              '参与行业标准制定',
              '建立行业专业网络',
              '分享行业技术见解'
            ],
            expectedOutcome: '成为行业内认可的技术权威，职业影响力显著提升'
          },
        ] : isSimpleJob ? [
          {
            id: '1',
            title: '办公自动化专家',
            description: '学习办公自动化工具和技能，提升工作效率，成为办公室的技术达人',
            targetIndustry: data.industry,
            targetPosition: `办公自动化专家/${data.position}`,
            urgency: 'high' as const,
            steps: [
              '学习Excel高级功能和公式',
              '掌握办公自动化工具',
              '开发工作流程自动化方案',
              '分享自动化经验'
            ],
            expectedOutcome: '工作效率显著提升，成为团队中的自动化专家'
          },
          {
            id: '2',
            title: '客户关系管理专家',
            description: '提升客户沟通和关系管理能力，成为客户服务的核心人物',
            targetIndustry: data.industry,
            targetPosition: `客户关系管理专员`,
            urgency: 'medium' as const,
            steps: [
              '学习客户关系管理知识',
              '提升沟通和问题解决能力',
              '掌握客户管理工具',
              '建立客户服务标准'
            ],
            expectedOutcome: '成为客户服务的核心人员，职业稳定性增强'
          },
          {
            id: '3',
            title: '数据处理专员',
            description: '学习基础数据分析技能，从简单数据录入升级到数据处理和分析',
            targetIndustry: data.industry,
            targetPosition: `数据处理专员`,
            urgency: 'medium' as const,
            steps: [
              '学习基础数据分析知识',
              '掌握数据处理工具',
              '参与数据项目',
              '提升数据解读能力'
            ],
            expectedOutcome: '职业技能升级，抗风险能力增强'
          },
          {
            id: '4',
            title: '行政协调专家',
            description: '提升综合协调和管理能力，成为行政工作的核心组织者',
            targetIndustry: data.industry,
            targetPosition: `行政协调专家`,
            urgency: 'medium' as const,
            steps: [
              '学习行政管理学知识',
              '提升组织和协调能力',
              '掌握办公管理工具',
              '建立行政工作标准'
            ],
            expectedOutcome: '成为行政工作的核心人员，职业价值提升'
          },
        ] : [
          {
            id: '1',
            title: 'AI增强型专业人才',
            description: '掌握与您职业相关的AI工具，将AI作为辅助工具提升工作效率，成为AI时代的复合型人才',
            targetIndustry: data.industry,
            targetPosition: `${data.position}（AI增强）`,
            urgency: 'high' as const,
            steps: [
              '学习行业相关的AI工具和平台',
              '将AI工具集成到日常工作流程',
              '开发AI辅助工作的最佳实践',
              '分享AI应用经验，成为团队AI应用专家'
            ],
            expectedOutcome: '工作效率提升30-50%，职业竞争力显著增强'
          },
          {
            id: '2',
            title: '跨领域技能拓展',
            description: '学习与您职业相关的跨领域技能，构建更全面的知识体系，提升职业竞争力',
            targetIndustry: data.industry,
            targetPosition: `${data.position}（多技能型）`,
            urgency: 'medium' as const,
            steps: [
              '识别与当前职业相关的交叉领域',
              '学习相关领域的基础知识',
              '寻找跨领域项目机会',
              '构建跨领域知识体系'
            ],
            expectedOutcome: '职业选择范围扩大，抗风险能力增强'
          },
          {
            id: '3',
            title: '软技能强化',
            description: '提升沟通、协作、创新等难以被AI替代的软技能，这些是未来职业发展的核心竞争力',
            urgency: 'medium' as const,
            steps: [
              '参加沟通和领导力培训',
              '主动参与团队协作项目',
              '培养创新思维和问题解决能力',
              '提升演讲和表达能力'
            ],
            expectedOutcome: '成为团队中不可或缺的核心成员，软技能成为职业护城河'
          },
          {
            id: '4',
            title: '行业专家转型',
            description: '深耕行业专业知识，成为行业专家，利用AI工具提升专业深度',
            targetIndustry: data.industry,
            targetPosition: `行业专家/${data.position}`,
            urgency: 'medium' as const,
            steps: [
              '深入研究行业趋势和前沿知识',
              '发表专业见解和文章',
              '参与行业会议和活动',
              '构建专业网络和影响力'
            ],
            expectedOutcome: '成为行业内认可的专家，职业价值显著提升'
          },
        ],
        personalizedLearningPlan: {
          targetPosition: isTechnicalJob ? `${data.position}（AI技术专家）` : isSimpleJob ? `${data.position}（技能升级）` : `${data.position}（AI增强型）`,
          timeline: isTechnicalJob ? '9个月' : isSimpleJob ? '6个月' : '6个月',
          phases: isTechnicalJob ? [
            {
              phase: '基础阶段',
              duration: '2-3个月',
              focus: 'AI技术基础',
              tasks: [
                '学习机器学习和深度学习基础',
                '掌握Python和相关库',
                '完成AI入门项目'
              ],
              resources: [
                '机器学习基础课程',
                'Python编程指南',
                'AI实战项目案例'
              ]
            },
            {
              phase: '应用阶段',
              duration: '3-4个月',
              focus: '行业AI应用',
              tasks: [
                '学习行业相关AI框架',
                '开发AI应用原型',
                '优化AI模型性能'
              ],
              resources: [
                '行业AI应用课程',
                'AI框架文档',
                '性能优化指南'
              ]
            },
            {
              phase: '深化阶段',
              duration: '2-3个月',
              focus: '前沿技术研究',
              tasks: [
                '研究AI前沿技术',
                '开发创新AI应用',
                '发表技术文章'
              ],
              resources: [
                'AI前沿研究论文',
                '技术会议资料',
                '学术期刊'
              ]
            }
          ] : isSimpleJob ? [
            {
              phase: '基础阶段',
              duration: '1-2个月',
              focus: '办公技能提升',
              tasks: [
                '学习Excel高级功能',
                '掌握办公自动化工具',
                '提升基础电脑技能'
              ],
              resources: [
                'Excel高级教程',
                '办公自动化指南',
                '基础电脑技能课程'
              ]
            },
            {
              phase: '应用阶段',
              duration: '2-3个月',
              focus: '专业技能升级',
              tasks: [
                '学习行业基础知识',
                '掌握专业工具',
                '完成小型项目'
              ],
              resources: [
                '行业基础课程',
                '专业工具教程',
                '实践项目案例'
              ]
            },
            {
              phase: '深化阶段',
              duration: '1-2个月',
              focus: '综合能力提升',
              tasks: [
                '提升沟通和协作能力',
                '学习项目管理基础',
                '建立职业发展规划'
              ],
              resources: [
                '沟通技巧培训',
                '项目管理入门',
                '职业规划指南'
              ]
            }
          ] : [
            {
              phase: '基础阶段',
              duration: '1-2个月',
              focus: 'AI基础和工具应用',
              tasks: [
                '学习AI基础概念和原理',
                '掌握行业相关AI工具',
                '完成入门级AI应用项目'
              ],
              resources: [
                'AI基础课程',
                '行业AI工具指南',
                '实践项目案例'
              ]
            },
            {
              phase: '应用阶段',
              duration: '2-3个月',
              focus: 'AI工具与工作流程集成',
              tasks: [
                '将AI工具集成到日常工作',
                '优化AI辅助工作流程',
                '开发个性化AI应用方案'
              ],
              resources: [
                '工作流程优化指南',
                'AI工具高级应用课程',
                '案例研究分析'
              ]
            },
            {
              phase: '深化阶段',
              duration: '1-2个月',
              focus: '专业深度和创新应用',
              tasks: [
                '探索AI在专业领域的前沿应用',
                '开发创新AI应用方案',
                '分享经验并构建专业网络'
              ],
              resources: [
                '行业前沿研究报告',
                '创新思维训练',
                '专业网络建设指南'
              ]
            }
          ],
          progressTracking: [
            {
              milestone: '完成基础学习',
              targetDate: isTechnicalJob ? '3个月' : '1个月',
              status: 'pending',
              tasks: isTechnicalJob ? ['完成AI基础课程', '掌握Python编程'] : ['完成办公技能培训', '掌握基础工具']
            },
            {
              milestone: '技能应用',
              targetDate: isTechnicalJob ? '6个月' : '3个月',
              status: 'pending',
              tasks: isTechnicalJob ? ['开发AI应用原型', '优化模型性能'] : ['应用办公自动化', '完成小型项目']
            },
            {
              milestone: '专业提升',
              targetDate: isTechnicalJob ? '9个月' : '6个月',
              status: 'pending',
              tasks: isTechnicalJob ? ['发表技术文章', '成为团队AI专家'] : ['提升综合能力', '制定职业规划']
            }
          ]
        },
        learningResources: {
          courses: isTechnicalJob ? [
            {
              title: `AI技术在${data.industry}中的深度应用`,
              provider: 'Coursera',
              duration: '8周',
              level: ' advanced',
              link: '#',
              description: `专为${data.industry}行业技术人员设计的高级AI应用课程，涵盖深度学习和机器学习前沿技术`
            },
            {
              title: `${data.position}的算法优化与性能调优`,
              provider: 'Udemy',
              duration: '10周',
              level: ' advanced',
              link: '#',
              description: `学习如何优化算法性能，提升系统效率，适合技术背景的专业人士`
            },
            {
              title: '技术领导力与团队管理',
              provider: 'LinkedIn Learning',
              duration: '6周',
              level: ' intermediate',
              link: '#',
              description: '提升技术领导力和团队管理能力，为技术管理者准备'
            }
          ] : isSimpleJob ? [
            {
              title: `办公自动化基础与应用`,
              provider: 'Coursera',
              duration: '4周',
              level: ' beginner',
              link: '#',
              description: `专为办公人员设计的自动化工具应用课程，提升工作效率`
            },
            {
              title: `Excel高级功能与数据处理`,
              provider: 'Udemy',
              duration: '6周',
              level: ' intermediate',
              link: '#',
              description: `学习Excel高级功能，提升数据处理能力，适合办公人员`
            },
            {
              title: '沟通技巧与客户服务',
              provider: 'LinkedIn Learning',
              duration: '4周',
              level: ' beginner',
              link: '#',
              description: '提升沟通技巧和客户服务能力，增强职业竞争力'
            }
          ] : [
            {
              title: `AI工具在${data.industry}中的应用`,
              provider: 'Coursera',
              duration: '4周',
              level: ' intermediate',
              link: '#',
              description: `专为${data.industry}行业${data.position}设计的AI工具应用课程`
            },
            {
              title: `${data.position}的数据分析与AI辅助决策`,
              provider: 'Udemy',
              duration: '6周',
              level: ' intermediate',
              link: '#',
              description: `学习如何使用AI工具进行${data.industry}行业的数据分析和决策支持`
            },
            {
              title: '软技能提升：沟通与领导力',
              provider: 'LinkedIn Learning',
              duration: '8周',
              level: ' all levels',
              link: '#',
              description: '提升沟通、协作和领导力等难以被AI替代的软技能'
            }
          ],
          books: isTechnicalJob ? [
            {
              title: '深度学习',
              author: 'Ian Goodfellow',
              publicationYear: 2016,
              description: '深度学习领域的权威著作，全面介绍深度学习的理论基础和实践应用，适合技术人员深入学习',
              link: '#',
              relevance: '基础阶段'
            },
            {
              title: '设计模式：可复用面向对象软件的基础',
              author: 'Erich Gamma',
              publicationYear: 1994,
              description: '软件设计领域的经典著作，介绍23种设计模式，帮助技术人员提升架构设计能力',
              link: '#',
              relevance: '应用阶段'
            },
            {
              title: '人工智能：一种现代的方法',
              author: 'Stuart Russell',
              publicationYear: 2021,
              description: '人工智能领域的权威教材，涵盖AI的各个方面，适合希望深入了解AI技术的专业人士',
              link: '#',
              relevance: '深化阶段'
            }
          ] : isSimpleJob ? [
            {
              title: 'Excel 2024应用大全',
              author: 'John Walkenbach',
              publicationYear: 2024,
              description: 'Excel领域的权威指南，从基础操作到高级功能，全面介绍Excel的使用方法，适合办公人员',
              link: '#',
              relevance: '基础阶段'
            },
            {
              title: '高效能人士的七个习惯',
              author: 'Stephen R. Covey',
              publicationYear: 1989,
              description: '时间管理和个人成长领域的经典著作，帮助职场人士提升工作效率和个人能力',
              link: '#',
              relevance: '应用阶段'
            },
            {
              title: '关键对话',
              author: 'Kerry Patterson',
              publicationYear: 2011,
              description: '沟通技巧领域的权威著作，帮助职场人士提升沟通能力和人际关系',
              link: '#',
              relevance: '深化阶段'
            }
          ] : [
            {
              title: '与机器赛跑',
              author: 'Erik Brynjolfsson',
              publicationYear: 2014,
              description: '探讨技术进步如何改变工作和经济，分析AI对就业的影响，适合所有职场人士',
              link: '#',
              relevance: '基础阶段'
            },
            {
              title: '未来工作',
              author: 'Daniel Susskind',
              publicationYear: 2020,
              description: '分析AI和自动化对未来工作的影响，探讨如何适应这一变革，为职场人士提供应对策略',
              link: '#',
              relevance: '应用阶段'
            },
            {
              title: '范围：为什么通才能在专业化时代取得成功',
              author: 'David Epstein',
              publicationYear: 2020,
              description: '阐述跨领域学习的重要性，分析通才如何在专业化时代取得成功，帮助职场人士构建全面知识体系',
              link: '#',
              relevance: '深化阶段'
            }
          ],
          projects: isTechnicalJob ? [
            {
              title: `${data.position}的AI模型开发与优化`,
              difficulty: 'high',
              duration: '4-6 weeks',
              description: `开发和优化适用于${data.industry}行业的AI模型，提升系统性能和准确性`,
              steps: [
                `分析${data.industry}行业的AI应用场景`,
                '设计和实现AI模型',
                '优化模型性能',
                '部署和监控模型'
              ]
            },
            {
              title: `${data.industry}行业的技术架构设计`,
              difficulty: 'high',
              duration: '6-8 weeks',
              description: `设计适合${data.industry}行业的技术架构，考虑可扩展性和性能`,
              steps: [
                `分析${data.industry}行业的业务需求`,
                '设计系统架构',
                '评估技术选型',
                '制定实施计划'
              ]
            }
          ] : isSimpleJob ? [
            {
              title: `办公流程自动化项目`,
              difficulty: 'medium',
              duration: '2-3 weeks',
              description: `识别并自动化日常办公流程，提升工作效率`,
              steps: [
                '分析日常工作流程',
                '选择适合的自动化工具',
                '设计自动化方案',
                '实施和测试'
              ]
            },
            {
              title: `Excel数据处理项目`,
              difficulty: 'medium',
              duration: '2-4 weeks',
              description: `使用Excel高级功能处理和分析数据，生成专业报表`,
              steps: [
                '收集和整理数据',
                '使用Excel函数和公式',
                '创建数据可视化',
                '生成专业报表'
              ]
            }
          ] : [
            {
              title: `${data.position}的AI辅助工作流程优化`,
              difficulty: 'medium',
              duration: '2-4 weeks',
              description: `识别并优化${data.industry}行业中${data.position}的日常工作流程，使用AI工具提升效率`,
              steps: [
                `选择${data.position}工作中重复性高的流程`,
                '研究适用的AI工具',
                '设计并实施优化方案',
                '评估效果并分享经验'
              ]
            },
            {
              title: `${data.industry}行业AI应用案例研究`,
              difficulty: 'high',
              duration: '4-6 weeks',
              description: `研究并分析AI在${data.industry}行业中的应用案例，为${data.position}提出创新应用方案`,
              steps: [
                `收集${data.industry}行业AI应用案例`,
                '分析成功因素和挑战',
                `为${data.position}提出创新应用方案`,
                '制作案例研究报告'
              ]
            }
          ]
        },
        pitfalls: isTechnicalJob ? [
          {
            id: '1',
            title: '技术栈过于单一',
            description: '只专注于一种技术栈，忽视技术多样性和跨领域知识',
            impact: '职业发展受限，难以适应技术变化',
            prevention: '定期学习新技术，拓展技术视野，构建全面技术体系'
          },
          {
            id: '2',
            title: '忽视业务理解',
            description: '过度关注技术实现，忽视业务需求和行业知识',
            impact: '技术方案与业务需求脱节，价值难以体现',
            prevention: '深入了解业务流程，参与业务讨论，将技术与业务结合'
          },
          {
            id: '3',
            title: '缺乏沟通能力',
            description: '技术能力强但沟通能力弱，难以与非技术人员有效合作',
            impact: '职业发展受限，难以晋升到管理岗位',
            prevention: '参加沟通技巧培训，主动与非技术人员合作，提升表达能力'
          },
          {
            id: '4',
            title: '忽视代码质量',
            description: '为了赶进度而忽视代码质量和可维护性',
            impact: '技术债务积累，系统稳定性下降',
            prevention: '重视代码质量，遵循最佳实践，定期代码审查'
          },
          {
            id: '5',
            title: '技术焦虑',
            description: '面对快速变化的技术环境产生焦虑，难以专注学习',
            impact: '学习效率下降，职业信心受挫',
            prevention: '制定合理学习计划，专注核心技能，保持学习节奏'
          }
        ] : isSimpleJob ? [
          {
            id: '1',
            title: '技能停滞',
            description: '满足于现有技能，不主动学习和提升',
            impact: '职业竞争力下降，面临被替代风险',
            prevention: '建立持续学习习惯，定期更新技能，关注行业趋势'
          },
          {
            id: '2',
            title: '缺乏自动化意识',
            description: '仍然使用传统方法完成工作，不利用自动化工具提升效率',
            impact: '工作效率低下，难以适应现代办公环境',
            prevention: '学习办公自动化工具，主动寻找效率提升机会'
          },
          {
            id: '3',
            title: '职业定位模糊',
            description: '对自己的职业发展方向缺乏清晰认识和规划',
            impact: '职业发展迷茫，难以抓住机会',
            prevention: '制定职业发展规划，明确目标，定期评估进展'
          },
          {
            id: '4',
            title: '沟通能力不足',
            description: '沟通能力较弱，难以有效表达和协作',
            impact: '职业发展受限，团队合作效果不佳',
            prevention: '参加沟通技巧培训，主动与同事交流，提升表达能力'
          },
          {
            id: '5',
            title: '抵抗技术变化',
            description: '对新技术和工具持抵触态度，不愿尝试',
            impact: '难以适应现代工作环境，职业竞争力下降',
            prevention: '保持开放心态，主动学习新技术，积极尝试新工具'
          }
        ] : [
          {
            id: '1',
            title: '忽视软技能培养',
            description: '过度关注技术技能，忽视沟通、协作等软技能的培养',
            impact: '职业发展受限，难以晋升到管理岗位',
            prevention: '平衡技术技能和软技能的培养，参加相关培训和实践'
          },
          {
            id: '2',
            title: '盲目追逐热门技术',
            description: '不考虑自身职业需求，盲目学习热门但与职业无关的技术',
            impact: '学习时间浪费，职业发展方向混乱',
            prevention: '基于职业目标制定学习计划，选择与职业相关的技术技能'
          },
          {
            id: '3',
            title: '缺乏实践应用',
            description: '只学习理论知识，不将AI工具应用到实际工作中',
            impact: '技能无法转化为实际价值，职业竞争力提升有限',
            prevention: '制定实践计划，从小项目开始应用，逐步扩大应用范围'
          },
          {
            id: '4',
            title: '忽视行业趋势',
            description: '只关注当前工作，忽视行业发展趋势和AI应用方向',
            impact: '职业发展跟不上行业变化，面临被淘汰风险',
            prevention: '定期研究行业趋势，参加行业会议和培训，保持对新技术的敏感度'
          },
          {
            id: '5',
            title: '缺乏持续学习习惯',
            description: '认为学习是一次性的，没有建立持续学习的习惯',
            impact: '技能逐渐过时，职业竞争力下降',
            prevention: '建立终身学习习惯，定期更新知识和技能，加入专业社群'
          }
        ],
      };
      setResult(fallbackResult);
    } finally {
      setIsLoading(false);
      // 滚动到页面顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

  if (authLoading) {
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
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-slate-800 mb-3">🎯 个人职业风险评估</h1>
          <p className="text-slate-600 mb-8">
            输入您的职业信息，获取AI替代风险分析和转型建议
          </p>
          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">登录后使用</h2>
            <p className="text-slate-600 mb-6">
              个人评估功能仅对会员开放，请登录后使用。
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.location.href = '/auth/login'}>
                登录
              </Button>
              <Button variant="secondary" onClick={() => window.location.href = '/auth/register'}>
                注册
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (user.membership.level === 'free') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-slate-800 mb-3">🎯 个人职业风险评估</h1>
          <p className="text-slate-600 mb-8">
            输入您的职业信息，获取AI替代风险分析和转型建议
          </p>
          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">购买高级会员</h2>
            <p className="text-slate-600 mb-6">
              个人评估功能仅对高级会员开放，一次性支付¥19即可永久解锁所有功能。
            </p>
            <Link href="/membership">
              <Button>
                立即购买
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

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
          {result.skillUpgradePath && Array.isArray(result.skillUpgradePath) && result.skillUpgradePath.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">📚 技能升级路径</h2>
              <div className="space-y-4">
                {result.skillUpgradePath.map((skill, idx) => (
                  <Card key={idx} className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-800">{skill.skill || '未知技能'}</h3>
                      <span className={`text-sm font-medium ${getPriorityColor(skill.priority || 'medium')}`}>
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
                              className={`w-4 h-2 rounded ${i <= (skill.currentLevel || 0) ? 'bg-blue-500' : 'bg-slate-200'}`}
                            />
                          ))}
                        </div>
                        <span className="ml-2">→ 目标等级:</span>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(i => (
                            <div 
                              key={i} 
                              className={`w-4 h-2 rounded ${i <= (skill.targetLevel || 0) ? 'bg-green-500' : 'bg-slate-200'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(skill.learningResources) && skill.learningResources.map((resource, ridx) => (
                        <a 
                          key={ridx}
                          href={resource.url || '#'}
                          className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                        >
                          {resource.title || '未知资源'}
                        </a>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* 个性化学习计划 */}
          {result.personalizedLearningPlan && (
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">🎯 个性化学习计划</h2>
              <Card className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-800">目标职位</h3>
                    <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{result.personalizedLearningPlan.timeline || '未知'}</span>
                  </div>
                  <p className="text-lg font-medium text-blue-600">{result.personalizedLearningPlan.targetPosition || '未知职位'}</p>
                </div>
                
                <div className="space-y-6">
                  {Array.isArray(result.personalizedLearningPlan.phases) && result.personalizedLearningPlan.phases.map((phase, idx) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-blue-200">
                      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                      <h4 className="font-semibold text-slate-800 mb-2">{phase.phase || '未知阶段'} ({phase.duration || '未知'})</h4>
                      <p className="text-sm text-slate-600 mb-3">{phase.focus || '未知'}</p>
                      
                      <div className="mb-3">
                        <p className="text-xs font-medium text-slate-700 mb-2">学习任务:</p>
                        <ul className="space-y-1">
                          {Array.isArray(phase.tasks) && phase.tasks.map((task, tidx) => (
                            <li key={tidx} className="flex items-start gap-2 text-sm text-slate-600">
                              <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {task || '未知任务'}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-slate-700 mb-2">推荐资源:</p>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(phase.resources) && phase.resources.map((resource, ridx) => (
                            <span key={ridx} className="text-xs bg-slate-100 px-2 py-1 rounded">{resource || '未知资源'}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          )}

          {/* 学习资源推荐 */}
          {result.learningResources && (
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">📚 学习资源推荐</h2>
              
              {/* 课程推荐 */}
              {result.learningResources.courses && Array.isArray(result.learningResources.courses) && result.learningResources.courses.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-700 mb-3">推荐课程</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.learningResources.courses.map((course, idx) => (
                      <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-medium text-slate-800 mb-2">{course.title || '未知课程'}</h4>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{course.provider || '未知提供者'}</span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{course.duration || '未知时长'}</span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{course.level || '未知级别'}</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{course.description || '无描述'}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 书籍推荐 */}
              {result.learningResources.books && Array.isArray(result.learningResources.books) && result.learningResources.books.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-700 mb-3">推荐书籍</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.learningResources.books.map((book, idx) => (
                      <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-medium text-slate-800 mb-1">{book.title || '未知书籍'}</h4>
                        <p className="text-sm text-slate-500 mb-2">{book.author || '未知作者'} ({book.publicationYear || '未知年份'})</p>
                        <p className="text-sm text-slate-600 mb-3">{book.description || '无描述'}</p>
                        {book.relevance && (
                          <span className="inline-block text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded mb-3">
                            学习计划阶段: {book.relevance}
                          </span>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 项目推荐 */}
              {result.learningResources.projects && Array.isArray(result.learningResources.projects) && result.learningResources.projects.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-700 mb-3">实践项目</h3>
                  <div className="space-y-4">
                    {result.learningResources.projects.map((project, idx) => (
                      <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-slate-800">{project.title || '未知项目'}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${project.difficulty === 'high' ? 'bg-red-50 text-red-600' : project.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}`}>
                            {project.difficulty === 'high' ? '高难度' : project.difficulty === 'medium' ? '中等难度' : '低难度'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{project.description || '无描述'}</p>
                        <p className="text-xs font-medium text-slate-700 mb-2">项目步骤:</p>
                        <ol className="space-y-1">
                          {Array.isArray(project.steps) && project.steps.length > 0 && project.steps.map((step, sidx) => (
                            <li key={sidx} className="flex items-start gap-2 text-sm text-slate-600">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">{sidx + 1}</span>
                              {step || '未知步骤'}
                            </li>
                          ))}
                        </ol>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* 避坑指南 */}
          {result.pitfalls && Array.isArray(result.pitfalls) && result.pitfalls.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">⚠️ 避坑指南</h2>
              <div className="space-y-4">
                {result.pitfalls.map((pitfall, idx) => (
                  <Card key={idx} className="p-4 border-l-4 border-amber-400">
                    <h3 className="font-medium text-slate-800 mb-2">{pitfall.title || '未知问题'}</h3>
                    <p className="text-sm text-slate-600 mb-3">{pitfall.description || '无描述'}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-medium text-slate-700 mb-1">影响</h4>
                        <p className="text-sm text-amber-700">{pitfall.impact || '未知'}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-slate-700 mb-1">预防措施</h4>
                        <p className="text-sm text-green-700">{pitfall.prevention || '未知'}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4 pt-8">
            <Button variant="outline" onClick={() => setResult(null)}>
              重新评估
            </Button>
            <Button asChild>
              <Link href={`/career-path?position=${encodeURIComponent(formData?.position || '')}&industry=${encodeURIComponent(formData?.industry || '')}&experience=${formData?.workYears || 0}`}>
                生成职业路径 →
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
