'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, Clock, DollarSign, BookOpen, TrendingUp, Target, 
  GraduationCap, BarChart3, Briefcase, Award, MapPin, Calendar,
  CheckCircle, AlertCircle, Lightbulb, Users, LineChart, Star, Check
} from 'lucide-react';

// 导入API服务和类型
import { getUserInfo } from '@/lib/api';
import { type AuthResponse } from '@/types';

// 职位数据
const positions = [
  // 技术岗位
  { id: 'frontend', name: '前端开发工程师', category: 'technical' },
  { id: 'backend', name: '后端开发工程师', category: 'technical' },
  { id: 'data', name: '数据分析师', category: 'technical' },
  { id: 'design', name: 'UI/UX设计师', category: 'creative' },
  
  // 管理岗位
  { id: 'product', name: '产品经理', category: 'management' },
  { id: 'manager', name: '技术经理', category: 'management' },
  
  // 文职岗位
  { id: 'hr', name: '人力资源专员', category: 'support' },
  { id: 'admin', name: '行政助理', category: 'support' },
  { id: 'finance', name: '财务助理', category: 'support' },
  { id: 'customer', name: '客服专员', category: 'support' },
  { id: 'executive', name: '行政主管', category: 'support' },
  { id: 'office', name: '办公室主任', category: 'support' },
  
  // 业务岗位
  { id: 'sales', name: '销售专员', category: 'business' },
  { id: 'marketing', name: '市场专员', category: 'business' },
];


// 根据工作年限获取用户群体类型
const getUserGroupType = (years: number): string => {
  if (years === 0) return 'fresh_graduate';
  if (years >= 1 && years <= 3) return 'junior';
  if (years >= 4 && years <= 5) return 'mid_level';
  return 'senior';
};

// 用户群体配置
const userGroupConfigs = {
  fresh_graduate: {
    name: '应届生',
    color: 'bg-blue-500',
    modules: [
      { id: 'direction', name: '职业方向选择', icon: Target },
      { id: 'resume', name: '简历优化', icon: Briefcase },
      { id: 'interview', name: '面试模拟', icon: Users },
    ]
  },
  junior: {
    name: '职场0-3年',
    color: 'bg-green-500',
    modules: [
      { id: 'skills', name: '技能快速提升', icon: TrendingUp },
      { id: 'pitfalls', name: '职场避坑指南', icon: AlertCircle },
    ]
  },
  mid_level: {
    name: '职场3-5年',
    color: 'bg-purple-500',
    modules: [
      { id: 'breakthrough', name: '瓶颈突破', icon: Lightbulb },
      { id: 'promotion', name: '晋升指导', icon: Award },
      { id: 'transition', name: '转型评估', icon: ArrowRight },
      { id: 'second_curve', name: '第二曲线规划', icon: LineChart },
    ]
  },
  senior: {
    name: '职场5年以上',
    color: 'bg-orange-500',
    modules: [
      { id: 'expert_mgmt', name: '专家/管理路线选择', icon: Target },
      { id: 'leadership', name: '领导力培养', icon: Award },
    ]
  }
};

// 职业路径数据
const careerPaths = {
  frontend: [
    {
      id: 'path1',
      name: '技术专家路线',
      steps: [
        { title: '初级前端开发', duration: '1年', skills: ['HTML/CSS', 'JavaScript', 'React/Vue'], milestones: ['完成3个完整项目', '掌握响应式设计'] },
        { title: '中级前端开发', duration: '2-3年', skills: ['TypeScript', '前端工程化', '性能优化'], milestones: ['主导技术选型', '优化页面性能50%'] },
        { title: '高级前端开发', duration: '3-5年', skills: ['架构设计', '微前端', '技术规划'], milestones: ['设计前端架构', '带领5人团队'] },
        { title: '前端技术专家', duration: '5年+', skills: ['技术战略', '跨团队协作', '创新研究'], milestones: ['制定技术规范', '推动技术创新'] },
      ],
      time: 5,
      cost: '低',
      difficulty: '中等',
      description: '专注于前端技术深度，成为领域专家',
      salaryRange: '15K-80K',
    },
    {
      id: 'path2',
      name: '全栈发展路线',
      steps: [
        { title: '前端开发', duration: '1-2年', skills: ['前端三件套', '框架应用'], milestones: ['独立完成前端项目'] },
        { title: 'Node.js开发', duration: '2-3年', skills: ['Node.js', '数据库', 'API设计'], milestones: ['全栈开发项目'] },
        { title: '全栈工程师', duration: '3-5年', skills: ['系统架构', 'DevOps', '云服务'], milestones: ['独立负责产品技术'] },
        { title: '技术负责人', duration: '5年+', skills: ['技术管理', '产品思维', '团队建设'], milestones: ['管理10人技术团队'] },
      ],
      time: 6,
      cost: '中等',
      difficulty: '高',
      description: '前后端技术全面掌握，具备独立负责能力',
      salaryRange: '18K-90K',
    },
  ],
  backend: [
    {
      id: 'path1',
      name: '架构师路线',
      steps: [
        { title: '初级后端开发', duration: '1年', skills: ['Java/Python', 'SQL', 'Redis'], milestones: ['完成CRUD系统'] },
        { title: '中级后端开发', duration: '2-3年', skills: ['微服务', '消息队列', '分布式'], milestones: ['设计高并发系统'] },
        { title: '高级后端开发', duration: '3-5年', skills: ['系统架构', '性能调优', '容灾设计'], milestones: ['支撑百万级用户'] },
        { title: '后端架构师', duration: '5年+', skills: ['架构规划', '技术选型', '团队指导'], milestones: ['制定公司技术栈'] },
      ],
      time: 6,
      cost: '中等',
      difficulty: '高',
      description: '专注于后端技术深度和系统设计',
      salaryRange: '18K-85K',
    },
  ],
  data: [
    {
      id: 'path1',
      name: '数据科学家路线',
      steps: [
        { title: '数据分析师', duration: '1-2年', skills: ['SQL', 'Excel', '数据可视化'], milestones: ['建立分析报表体系'] },
        { title: '高级数据分析师', duration: '2-3年', skills: ['Python', '统计学', '机器学习'], milestones: ['预测模型准确率85%'] },
        { title: '数据科学家', duration: '3-5年', skills: ['深度学习', '特征工程', '模型优化'], milestones: ['落地AI产品'] },
        { title: '首席数据科学家', duration: '5年+', skills: ['AI战略', '团队管理', '业务创新'], milestones: ['建立数据科学团队'] },
      ],
      time: 6,
      cost: '高',
      difficulty: '高',
      description: '从数据分析到AI算法，成为数据科学专家',
      salaryRange: '16K-90K',
    },
  ],
  product: [
    {
      id: 'path1',
      name: '产品总监路线',
      steps: [
        { title: '产品助理', duration: '1年', skills: ['需求分析', '原型设计', '文档撰写'], milestones: ['独立完成需求文档'] },
        { title: '产品经理', duration: '2-3年', skills: ['用户研究', '数据分析', '项目管理'], milestones: ['负责核心功能模块'] },
        { title: '高级产品经理', duration: '3-5年', skills: ['产品规划', '商业分析', '团队管理'], milestones: ['负责完整产品线'] },
        { title: '产品总监', duration: '5年+', skills: ['战略规划', '业务增长', '组织建设'], milestones: ['管理产品团队'] },
      ],
      time: 6,
      cost: '低',
      difficulty: '中等',
      description: '从执行到战略，成为产品领导者',
      salaryRange: '14K-70K',
    },
  ],
  hr: [
    {
      id: 'path1',
      name: 'HRBP专家路线',
      steps: [
        { title: 'HR专员', duration: '1-2年', skills: ['招聘', '员工关系', '制度执行'], milestones: ['独立完成招聘流程'] },
        { title: 'HR主管', duration: '2-4年', skills: ['绩效管理', '培训体系', '薪酬设计'], milestones: ['建立绩效考核体系'] },
        { title: 'HR经理', duration: '4-6年', skills: ['人才发展', '组织优化', '文化建设'], milestones: ['优化组织架构'] },
        { title: 'HRD/HRBP', duration: '6年+', skills: ['战略HR', '业务伙伴', '变革管理'], milestones: ['支撑业务增长'] },
      ],
      time: 7,
      cost: '低',
      difficulty: '中等',
      description: '从事务性HR到战略性HRBP',
      salaryRange: '8K-50K',
    },
  ],
  admin: [
    {
      id: 'path1',
      name: '行政管理层路线',
      steps: [
        { title: '行政助理', duration: '1-2年', skills: ['日常行政', '会议安排', '文件管理'], milestones: ['独立处理行政事务'] },
        { title: '行政专员', duration: '2-3年', skills: ['资产管理', '供应商管理', '活动策划'], milestones: ['组织大型公司活动'] },
        { title: '行政主管', duration: '3-5年', skills: ['团队管理', '制度建设', '成本控制'], milestones: ['优化行政流程'] },
        { title: '行政经理', duration: '5年+', skills: ['战略规划', '跨部门协作', '资源整合'], milestones: ['建立行政体系'] },
      ],
      time: 6,
      cost: '低',
      difficulty: '中等',
      description: '从基础行政到管理岗位的职业发展',
      salaryRange: '6K-30K',
    },
  ],
  finance: [
    {
      id: 'path1',
      name: '财务专业路线',
      steps: [
        { title: '财务助理', duration: '1-2年', skills: ['账务处理', '报表编制', '税务申报'], milestones: ['独立完成月度报表'] },
        { title: '财务专员', duration: '2-3年', skills: ['成本核算', '预算管理', '财务分析'], milestones: ['参与年度预算编制'] },
        { title: '财务主管', duration: '3-5年', skills: ['财务规划', '内部控制', '团队管理'], milestones: ['建立财务管理制度'] },
        { title: '财务经理', duration: '5年+', skills: ['战略财务', '资金管理', '财务决策'], milestones: ['支撑公司战略发展'] },
      ],
      time: 6,
      cost: '低',
      difficulty: '中等',
      description: '从基础财务到管理岗位的职业发展',
      salaryRange: '8K-40K',
    },
  ],
  customer: [
    {
      id: 'path1',
      name: '客户服务专家路线',
      steps: [
        { title: '客服专员', duration: '1-2年', skills: ['客户沟通', '问题解决', '服务标准'], milestones: ['客户满意度达90%以上'] },
        { title: '客服主管', duration: '2-3年', skills: ['团队管理', '流程优化', '客户关系'], milestones: ['建立客服标准流程'] },
        { title: '客服经理', duration: '3-5年', skills: ['服务战略', '数据分析', '跨部门协作'], milestones: ['提升整体客户体验'] },
        { title: '客户体验总监', duration: '5年+', skills: ['体验设计', '品牌建设', '战略规划'], milestones: ['建立客户体验体系'] },
      ],
      time: 6,
      cost: '低',
      difficulty: '中等',
      description: '从一线客服到管理岗位的职业发展',
      salaryRange: '5K-35K',
    },
  ],
  executive: [
    {
      id: 'path1',
      name: '行政高管路线',
      steps: [
        { title: '行政主管', duration: '1-3年', skills: ['团队管理', '制度建设', '资源协调'], milestones: ['优化行政流程'] },
        { title: '行政经理', duration: '3-5年', skills: ['战略规划', '成本控制', '跨部门协作'], milestones: ['建立行政体系'] },
        { title: '行政总监', duration: '5-8年', skills: ['企业运营', '风险管理', '战略支持'], milestones: ['支撑公司战略发展'] },
        { title: '首席行政官', duration: '8年+', skills: ['全局规划', '资源整合', '决策支持'], milestones: ['成为公司核心管理层'] },
      ],
      time: 8,
      cost: '低',
      difficulty: '中等',
      description: '从行政主管到高管的职业发展',
      salaryRange: '15K-60K',
    },
  ],
  office: [
    {
      id: 'path1',
      name: '办公室管理专家路线',
      steps: [
        { title: '办公室主任', duration: '1-3年', skills: ['综合管理', '制度执行', '团队协调'], milestones: ['建立办公室管理体系'] },
        { title: '高级办公室主任', duration: '3-5年', skills: ['战略规划', '资源整合', '风险管理'], milestones: ['优化办公流程'] },
        { title: '行政总监', duration: '5-8年', skills: ['企业运营', '跨部门协作', '战略支持'], milestones: ['支撑公司战略发展'] },
        { title: '首席运营官', duration: '8年+', skills: ['全局规划', '业务决策', '组织发展'], milestones: ['成为公司核心管理层'] },
      ],
      time: 8,
      cost: '低',
      difficulty: '中等',
      description: '从办公室主任到高管的职业发展',
      salaryRange: '15K-60K',
    },
  ],
  sales: [
    {
      id: 'path1',
      name: '销售管理路线',
      steps: [
        { title: '销售专员', duration: '1-2年', skills: ['客户开发', '产品推广', '销售技巧'], milestones: ['完成销售目标'] },
        { title: '销售主管', duration: '2-3年', skills: ['团队管理', '销售策略', '客户关系'], milestones: ['带领团队完成销售目标'] },
        { title: '销售经理', duration: '3-5年', skills: ['市场分析', '销售预测', '资源分配'], milestones: ['制定销售战略'] },
        { title: '销售总监', duration: '5年+', skills: ['战略规划', '渠道管理', '团队建设'], milestones: ['推动销售增长'] },
      ],
      time: 6,
      cost: '低',
      difficulty: '中等',
      description: '从一线销售到管理岗位的职业发展',
      salaryRange: '8K-50K',
    },
  ],
  marketing: [
    {
      id: 'path1',
      name: '市场专家路线',
      steps: [
        { title: '市场专员', duration: '1-2年', skills: ['市场调研', '活动执行', '内容创作'], milestones: ['独立完成市场活动'] },
        { title: '市场主管', duration: '2-3年', skills: ['营销策略', '品牌建设', '团队管理'], milestones: ['制定市场策略'] },
        { title: '市场经理', duration: '3-5年', skills: ['市场分析', '预算管理', '跨部门协作'], milestones: ['推动品牌增长'] },
        { title: '市场总监', duration: '5年+', skills: ['战略规划', '市场定位', '资源整合'], milestones: ['建立市场体系'] },
      ],
      time: 6,
      cost: '低',
      difficulty: '中等',
      description: '从基础市场到管理岗位的职业发展',
      salaryRange: '8K-45K',
    },
  ],
};

// 薪资数据
const generateSalaryData = (baseSalary: number, years: number) => {
  const data = [];
  for (let i = 1; i <= years + 5; i++) {
    const growthRate = i <= 3 ? 0.25 : i <= 5 ? 0.15 : 0.08;
    const salary = Math.round(baseSalary * Math.pow(1 + growthRate, i - 1));
    data.push({
      year: i,
      salary: salary,
      title: i === 1 ? '入门级' : i <= 3 ? '初级' : i <= 5 ? '中级' : '高级',
    });
  }
  return data;
};

// 学习计划数据
const learningPlans = {
  frontend: {
    stages: [
      { 
        stage: '基础阶段（1-3个月）', 
        items: [
          { name: 'HTML5/CSS3核心语法', hours: 40, type: '基础' },
          { name: 'JavaScript ES6+特性', hours: 60, type: '基础' },
          { name: 'React/Vue框架入门', hours: 50, type: '框架' },
          { name: 'Git版本控制', hours: 20, type: '工具' },
        ]
      },
      { 
        stage: '进阶阶段（3-6个月）', 
        items: [
          { name: 'TypeScript实战', hours: 40, type: '进阶' },
          { name: '前端工程化（Webpack/Vite）', hours: 30, type: '工程' },
          { name: '性能优化策略', hours: 25, type: '优化' },
          { name: '移动端适配方案', hours: 20, type: '实战' },
        ]
      },
      { 
        stage: '高级阶段（6-12个月）', 
        items: [
          { name: '前端架构设计', hours: 40, type: '架构' },
          { name: '微前端实践', hours: 35, type: '架构' },
          { name: 'Node.js全栈开发', hours: 50, type: '扩展' },
          { name: '前端安全与测试', hours: 30, type: '质量' },
        ]
      },
    ],
    totalHours: 440,
  },
  backend: {
    stages: [
      { 
        stage: '基础阶段（1-3个月）', 
        items: [
          { name: 'Java/Python语言基础', hours: 60, type: '基础' },
          { name: 'MySQL/PostgreSQL数据库', hours: 40, type: '基础' },
          { name: 'Redis缓存技术', hours: 25, type: '基础' },
          { name: 'RESTful API设计', hours: 20, type: '设计' },
        ]
      },
      { 
        stage: '进阶阶段（3-6个月）', 
        items: [
          { name: 'Spring Boot/Django框架', hours: 50, type: '框架' },
          { name: '消息队列（Kafka/RabbitMQ）', hours: 30, type: '中间件' },
          { name: '微服务架构设计', hours: 40, type: '架构' },
          { name: 'Docker容器化部署', hours: 25, type: '运维' },
        ]
      },
      { 
        stage: '高级阶段（6-12个月）', 
        items: [
          { name: '分布式系统设计', hours: 50, type: '架构' },
          { name: '高并发处理方案', hours: 40, type: '性能' },
          { name: 'Kubernetes编排', hours: 35, type: '运维' },
          { name: '系统监控与调优', hours: 30, type: '质量' },
        ]
      },
    ],
    totalHours: 445,
  },
  data: {
    stages: [
      { 
        stage: '基础阶段（1-3个月）', 
        items: [
          { name: 'SQL高级查询', hours: 40, type: '基础' },
          { name: 'Excel高级功能', hours: 30, type: '工具' },
          { name: 'Python数据分析', hours: 50, type: '编程' },
          { name: '数据可视化（Tableau/PowerBI）', hours: 30, type: '工具' },
        ]
      },
      { 
        stage: '进阶阶段（3-6个月）', 
        items: [
          { name: 'Pandas/NumPy数据处理', hours: 40, type: '编程' },
          { name: '统计学与假设检验', hours: 35, type: '理论' },
          { name: '机器学习基础', hours: 50, type: 'AI' },
          { name: 'A/B测试实战', hours: 25, type: '实战' },
        ]
      },
      { 
        stage: '高级阶段（6-12个月）', 
        items: [
          { name: '深度学习与神经网络', hours: 60, type: 'AI' },
          { name: '大数据处理（Spark/Hadoop）', hours: 45, type: '大数据' },
          { name: '特征工程与模型优化', hours: 40, type: 'AI' },
          { name: '数据产品化实践', hours: 30, type: '实战' },
        ]
      },
    ],
    totalHours: 475,
  },
  product: {
    stages: [
      { 
        stage: '基础阶段（1-3个月）', 
        items: [
          { name: '产品思维与方法论', hours: 30, type: '思维' },
          { name: '用户调研技巧', hours: 25, type: '方法' },
          { name: '需求分析与文档撰写', hours: 35, type: '技能' },
          { name: 'Axure/Figma原型设计', hours: 30, type: '工具' },
        ]
      },
      { 
        stage: '进阶阶段（3-6个月）', 
        items: [
          { name: '数据分析与产品决策', hours: 35, type: '数据' },
          { name: '用户体验设计原则', hours: 30, type: '设计' },
          { name: '项目管理与敏捷开发', hours: 25, type: '管理' },
          { name: '竞品分析与市场研究', hours: 30, type: '分析' },
        ]
      },
      { 
        stage: '高级阶段（6-12个月）', 
        items: [
          { name: '产品战略规划', hours: 40, type: '战略' },
          { name: '商业模式设计', hours: 35, type: '商业' },
          { name: '增长黑客与用户增长', hours: 30, type: '增长' },
          { name: '团队管理与领导力', hours: 35, type: '管理' },
        ]
      },
    ],
    totalHours: 380,
  },
  hr: {
    stages: [
      { 
        stage: '基础阶段（1-3个月）', 
        items: [
          { name: '招聘流程与技巧', hours: 30, type: '基础' },
          { name: '劳动法与合规管理', hours: 25, type: '法规' },
          { name: '员工关系处理', hours: 20, type: '实务' },
          { name: 'Excel在HR中的应用', hours: 20, type: '工具' },
        ]
      },
      { 
        stage: '进阶阶段（3-6个月）', 
        items: [
          { name: '绩效管理体系设计', hours: 35, type: '体系' },
          { name: '薪酬体系与激励方案', hours: 30, type: '薪酬' },
          { name: '培训体系搭建', hours: 25, type: '发展' },
          { name: 'HR数据分析', hours: 25, type: '数据' },
        ]
      },
      { 
        stage: '高级阶段（6-12个月）', 
        items: [
          { name: '人才发展与继任计划', hours: 35, type: '战略' },
          { name: '组织发展与变革管理', hours: 40, type: 'OD' },
          { name: '企业文化建设', hours: 30, type: '文化' },
          { name: 'HRBP业务伙伴技能', hours: 35, type: 'BP' },
        ]
      },
    ],
    totalHours: 350,
  },
  admin: {
    stages: [
      { 
        stage: '基础阶段（1-3个月）', 
        items: [
          { name: '行政工作基础', hours: 30, type: '基础' },
          { name: '办公软件高级应用', hours: 25, type: '工具' },
          { name: '会议管理与安排', hours: 20, type: '实务' },
          { name: '文件管理与归档', hours: 15, type: '基础' },
        ]
      },
      { 
        stage: '进阶阶段（3-6个月）', 
        items: [
          { name: '资产管理与采购', hours: 30, type: '实务' },
          { name: '活动策划与执行', hours: 25, type: '技能' },
          { name: '供应商管理', hours: 20, type: '管理' },
          { name: '行政成本控制', hours: 20, type: '财务' },
        ]
      },
      { 
        stage: '高级阶段（6-12个月）', 
        items: [
          { name: '团队管理与领导力', hours: 35, type: '管理' },
          { name: '行政制度建设', hours: 30, type: '体系' },
          { name: '跨部门协作', hours: 25, type: '沟通' },
          { name: '战略行政规划', hours: 30, type: '战略' },
        ]
      },
    ],
    totalHours: 300,
  },
  finance: {
    stages: [
      { 
        stage: '基础阶段（1-3个月）', 
        items: [
          { name: '财务会计基础', hours: 40, type: '基础' },
          { name: 'Excel财务函数', hours: 25, type: '工具' },
          { name: '税务基础知识', hours: 30, type: '法规' },
          { name: '财务报表编制', hours: 25, type: '实务' },
        ]
      },
      { 
        stage: '进阶阶段（3-6个月）', 
        items: [
          { name: '成本核算', hours: 30, type: '实务' },
          { name: '预算管理', hours: 25, type: '管理' },
          { name: '财务分析', hours: 30, type: '分析' },
          { name: '内部控制', hours: 20, type: '合规' },
        ]
      },
      { 
        stage: '高级阶段（6-12个月）', 
        items: [
          { name: '财务管理', hours: 35, type: '管理' },
          { name: '资金管理', hours: 30, type: '实务' },
          { name: '战略财务', hours: 35, type: '战略' },
          { name: '财务决策支持', hours: 30, type: '分析' },
        ]
      },
    ],
    totalHours: 350,
  },
  customer: {
    stages: [
      { 
        stage: '基础阶段（1-3个月）', 
        items: [
          { name: '客户服务基础', hours: 30, type: '基础' },
          { name: '沟通技巧', hours: 25, type: '技能' },
          { name: '问题解决方法', hours: 20, type: '实务' },
          { name: '服务标准与流程', hours: 15, type: '基础' },
        ]
      },
      { 
        stage: '进阶阶段（3-6个月）', 
        items: [
          { name: '客户关系管理', hours: 30, type: '管理' },
          { name: '投诉处理技巧', hours: 25, type: '技能' },
          { name: '服务质量监控', hours: 20, type: '管理' },
          { name: '客户满意度提升', hours: 20, type: '策略' },
        ]
      },
      { 
        stage: '高级阶段（6-12个月）', 
        items: [
          { name: '团队管理与领导力', hours: 35, type: '管理' },
          { name: '服务战略规划', hours: 30, type: '战略' },
          { name: '客户体验设计', hours: 30, type: '设计' },
          { name: '跨部门协作', hours: 25, type: '沟通' },
        ]
      },
    ],
    totalHours: 290,
  },
  executive: {
    stages: [
      { 
        stage: '基础阶段（1-3个月）', 
        items: [
          { name: '行政管理层基础', hours: 35, type: '基础' },
          { name: '团队管理技巧', hours: 30, type: '管理' },
          { name: '制度建设', hours: 25, type: '实务' },
          { name: '资源协调', hours: 20, type: '技能' },
        ]
      },
      { 
        stage: '进阶阶段（3-6个月）', 
        items: [
          { name: '战略规划', hours: 35, type: '战略' },
          { name: '成本控制', hours: 30, type: '财务' },
          { name: '跨部门协作', hours: 25, type: '沟通' },
          { name: '风险管理', hours: 25, type: '管理' },
        ]
      },
      { 
        stage: '高级阶段（6-12个月）', 
        items: [
          { name: '企业运营管理', hours: 40, type: '管理' },
          { name: '战略支持', hours: 35, type: '战略' },
          { name: '资源整合', hours: 30, type: '管理' },
          { name: '决策支持', hours: 30, type: '分析' },
        ]
      },
    ],
    totalHours: 360,
  },
  office: {
    stages: [
      { 
        stage: '基础阶段（1-3个月）', 
        items: [
          { name: '办公室管理基础', hours: 35, type: '基础' },
          { name: '综合管理技能', hours: 30, type: '管理' },
          { name: '制度执行', hours: 25, type: '实务' },
          { name: '团队协调', hours: 20, type: '技能' },
        ]
      },
      { 
        stage: '进阶阶段（3-6个月）', 
        items: [
          { name: '战略规划', hours: 35, type: '战略' },
          { name: '资源整合', hours: 30, type: '管理' },
          { name: '风险管理', hours: 25, type: '管理' },
          { name: '办公流程优化', hours: 25, type: '实务' },
        ]
      },
      { 
        stage: '高级阶段（6-12个月）', 
        items: [
          { name: '企业运营管理', hours: 40, type: '管理' },
          { name: '跨部门协作', hours: 35, type: '沟通' },
          { name: '战略支持', hours: 30, type: '战略' },
          { name: '业务决策', hours: 30, type: '分析' },
        ]
      },
    ],
    totalHours: 360,
  },
  sales: {
    stages: [
      { 
        stage: '基础阶段（1-3个月）', 
        items: [
          { name: '销售基础知识', hours: 30, type: '基础' },
          { name: '客户开发技巧', hours: 25, type: '技能' },
          { name: '产品知识', hours: 20, type: '基础' },
          { name: '销售礼仪', hours: 15, type: '技能' },
        ]
      },
      { 
        stage: '进阶阶段（3-6个月）', 
        items: [
          { name: '销售技巧提升', hours: 30, type: '技能' },
          { name: '客户关系管理', hours: 25, type: '管理' },
          { name: '销售策略', hours: 20, type: '策略' },
          { name: '谈判技巧', hours: 20, type: '技能' },
        ]
      },
      { 
        stage: '高级阶段（6-12个月）', 
        items: [
          { name: '团队管理与领导力', hours: 35, type: '管理' },
          { name: '市场分析', hours: 30, type: '分析' },
          { name: '销售预测', hours: 25, type: '分析' },
          { name: '销售战略', hours: 30, type: '战略' },
        ]
      },
    ],
    totalHours: 290,
  },
  marketing: {
    stages: [
      { 
        stage: '基础阶段（1-3个月）', 
        items: [
          { name: '市场营销基础', hours: 30, type: '基础' },
          { name: '市场调研方法', hours: 25, type: '技能' },
          { name: '活动执行', hours: 20, type: '实务' },
          { name: '内容创作', hours: 20, type: '技能' },
        ]
      },
      { 
        stage: '进阶阶段（3-6个月）', 
        items: [
          { name: '营销策略', hours: 30, type: '策略' },
          { name: '品牌建设', hours: 25, type: '管理' },
          { name: '数字营销', hours: 20, type: '技能' },
          { name: '市场分析', hours: 20, type: '分析' },
        ]
      },
      { 
        stage: '高级阶段（6-12个月）', 
        items: [
          { name: '团队管理与领导力', hours: 35, type: '管理' },
          { name: '市场定位', hours: 30, type: '战略' },
          { name: '预算管理', hours: 25, type: '财务' },
          { name: '资源整合', hours: 30, type: '管理' },
        ]
      },
    ],
    totalHours: 305,
  },
};

// 简历分析函数
const analyzeResume = (targetPosition: string, resumeContent: string) => {
  // 提取目标职位的关键词
  const positionKeywords = targetPosition.toLowerCase().split(/\s+/).filter(word => word.length > 1);
  
  // 行业通用关键词
  const industryKeywords = {
    '前端开发': ['react', 'vue', 'javascript', 'html', 'css', 'typescript', 'webpack', 'responsive', 'ui', 'frontend'],
    '后端开发': ['java', 'python', 'node.js', 'spring', 'django', 'api', 'database', 'backend', 'server'],
    '产品经理': ['product', 'prd', 'user story', 'ux', 'ui', 'market', 'strategy', 'requirement'],
    '数据分析师': ['data', 'analysis', 'sql', 'python', 'excel', 'tableau', 'bi', 'analytics'],
    '设计师': ['design', 'ui', 'ux', 'figma', 'sketch', 'photoshop', 'illustrator', 'wireframe'],
    '销售': ['sales', 'marketing', 'customer', 'client', 'revenue', 'target', 'negotiation'],
    '人力资源': ['hr', 'recruitment', 'talent', 'performance', 'training', 'employee', 'culture']
  };
  
  // 确定目标行业
  let targetIndustry = '通用';
  Object.keys(industryKeywords).forEach(industry => {
    if (targetPosition.toLowerCase().includes(industry.toLowerCase())) {
      targetIndustry = industry;
    }
  });
  
  // 获取行业相关关键词
  const relevantKeywords = industryKeywords[targetIndustry as keyof typeof industryKeywords] || [];
  
  // 计算关键词匹配度
  const resumeLower = resumeContent.toLowerCase();
  let matchedKeywords = 0;
  const allKeywords = [...positionKeywords, ...relevantKeywords];
  
  allKeywords.forEach(keyword => {
    if (resumeLower.includes(keyword.toLowerCase())) {
      matchedKeywords++;
    }
  });
  
  const keywordMatch = Math.round((matchedKeywords / allKeywords.length) * 100);
  
  // 分析简历结构
  let structureScore = 0;
  const structureElements = ['教育', '工作', '项目', '技能', '实习', '证书', '经历'];
  structureElements.forEach(element => {
    if (resumeLower.includes(element)) {
      structureScore++;
    }
  });
  structureScore = Math.round((structureScore / structureElements.length) * 100);
  
  // 分析内容质量
  let contentScore = 0;
  
  // 检查是否有量化成就
  if (resumeContent.match(/\d+|增长|提升|节省|优化|完成/)) {
    contentScore += 30;
  }
  
  // 检查是否有专业术语
  if (resumeContent.match(/技术|框架|工具|系统|平台/)) {
    contentScore += 20;
  }
  
  // 检查简历长度
  const resumeLength = resumeContent.length;
  if (resumeLength > 500 && resumeLength < 3000) {
    contentScore += 30;
  } else if (resumeLength >= 3000) {
    contentScore += 15;
  } else {
    contentScore += 10;
  }
  
  // 检查是否有明确的职责描述
  if (resumeContent.match(/负责|参与|主导|管理/)) {
    contentScore += 20;
  }
  
  contentScore = Math.min(100, contentScore);
  
  // 计算整体评分
  const overallScore = Math.round((keywordMatch * 0.4) + (structureScore * 0.3) + (contentScore * 0.3));
  
  // 生成优化建议
  const suggestions = [
    '结构优化：使用清晰的层次结构，包括个人信息、教育背景、工作经历、项目经验、技能等模块。',
    '内容优化：使用STAR法则（情境、任务、行动、结果）描述工作经历，量化成就，使用具体数字和案例。',
    '关键词优化：针对目标职位添加相关关键词，提高简历筛选通过率，特别是技术岗位的技能关键词。',
    '格式优化：保持简历简洁明了，控制在1-2页，使用统一的字体和格式，避免使用复杂的图表和颜色。'
  ];
  
  return {
    overallScore,
    keywordMatch,
    structureScore,
    contentScore,
    suggestions
  };
};

// 成长记录数据
const growthRecords = [
  { date: '2024-01', type: 'skill', title: '掌握React框架', value: 85, description: '完成React官方教程，独立开发3个项目' },
  { date: '2024-03', type: 'project', title: '电商平台前端重构', value: 90, description: '主导完成公司核心产品前端重构，性能提升40%' },
  { date: '2024-06', type: 'salary', title: '薪资调整', value: 25000, description: '因项目表现优秀，薪资从20K调整至25K' },
  { date: '2024-09', type: 'skill', title: 'TypeScript进阶', value: 80, description: '完成TypeScript深度课程，在项目中全面应用' },
  { date: '2024-12', type: 'job', title: '跳槽至大厂', value: 35000, description: '成功跳槽至头部互联网公司，薪资涨幅40%' },
];



export default function CareerPathPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const positionParam = searchParams.get('position');
  const industryParam = searchParams.get('industry');
  const experienceParam = searchParams.get('experience');
  const salaryParam = searchParams.get('salary');
  
  // 解析工作经验年限
  const experienceYears = experienceParam ? parseInt(experienceParam) : 0;
  const userGroupType = getUserGroupType(experienceYears);
  const userGroupConfig = userGroupConfigs[userGroupType as keyof typeof userGroupConfigs];
  
  // 用户认证状态
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
  
  // 根据职位参数映射到对应的职位ID
  const mapPositionToId = (position: string) => {
    const positionMap: Record<string, string> = {
      // 技术岗位
      '前端': 'frontend',
      '后端': 'backend',
      '数据': 'data',
      '设计': 'design',
      
      // 管理岗位
      '产品': 'product',
      '管理': 'manager',
      
      // 文职岗位
      'HR': 'hr',
      '人力': 'hr',
      '招聘': 'hr',
      '行政': 'admin',
      '助理': 'admin',
      '财务': 'finance',
      '客服': 'customer',
      '客户服务': 'customer',
      '办公室': 'office',
      
      // 业务岗位
      '销售': 'sales',
      '市场': 'marketing',
    };
    
    for (const [keyword, id] of Object.entries(positionMap)) {
      if (position.includes(keyword)) {
        return id;
      }
    }
    return 'admin'; // 默认返回行政岗位，更加通用
  };
  
  const initialPosition = positionParam ? mapPositionToId(positionParam) : 'admin';
  
  const [selectedPosition, setSelectedPosition] = useState(initialPosition);
  const [selectedPath, setSelectedPath] = useState('');
  const [paths, setPaths] = useState<any[]>([]);
  const [salaryTrend, setSalaryTrend] = useState<any[]>([]);
  const [learningPlan, setLearningPlan] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('paths');
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 职业方向选择子功能状态
  const [activeSubFeature, setActiveSubFeature] = useState<string | null>(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, number>>({});
  const [assessmentResult, setAssessmentResult] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [testProgress, setTestProgress] = useState(0);
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});
  const [testResult, setTestResult] = useState<string | null>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // 简历分析相关状态
  const [resumeForm, setResumeForm] = useState({
    targetPosition: '',
    resumeContent: ''
  });
  const [resumeAnalysis, setResumeAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // 模块内Hook - 移到顶层
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  
  const [projectExperience, setProjectExperience] = useState('');
  const [projectScore, setProjectScore] = useState<number | null>(null);
  const [projectDetails, setProjectDetails] = useState({
    technology: 85,
    complexity: 75,
    impact: 80,
    innovation: 70
  });
  const [isEvaluatingProject, setIsEvaluatingProject] = useState(false);
  
  const [certificateName, setCertificateName] = useState('');
  const [certificateIssuer, setCertificateIssuer] = useState('');
  const [certificateDate, setCertificateDate] = useState('');
  const [certificateScore, setCertificateScore] = useState<number | null>(null);
  const [certificateDetails, setCertificateDetails] = useState({
    authority: 90,
    timeliness: 85,
    relevance: 90
  });
  const [isEvaluatingCertificate, setIsEvaluatingCertificate] = useState(false);
  
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<string | null>(null);
  const [selfAssessment, setSelfAssessment] = useState<Record<string, number>>({});
  const [leadershipAssessmentResult, setLeadershipAssessmentResult] = useState<string | null>(null);

  useEffect(() => {
    setPaths(careerPaths[selectedPosition as keyof typeof careerPaths] || []);
    
    // 根据用户当前薪资生成预测数据
    const baseSalary = salaryParam ? parseInt(salaryParam) : 15000;
    setSalaryTrend(generateSalaryData(baseSalary, experienceYears));
    
    setLearningPlan(learningPlans[selectedPosition as keyof typeof learningPlans] || null);
    setSelectedPath('');
  }, [selectedPosition, salaryParam, experienceYears]);

  const getPositionName = (id: string) => {
    const position = positions.find(p => p.id === id);
    return position?.name || '前端开发工程师';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '低': return 'bg-green-100 text-green-800';
      case '中等': return 'bg-yellow-100 text-yellow-800';
      case '高': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-blue-500" />;
      default: return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  // 处理模块点击
  const handleModuleClick = (moduleId: string) => {
    setActiveModule(moduleId);
    setIsModalOpen(true);
  };

  // 认证检查
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
          <h1 className="text-3xl font-bold text-slate-800 mb-3">🚀 职业路径规划</h1>
          <p className="text-slate-600 mb-8">
            为您的职业发展提供个性化的规划和建议
          </p>
          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">登录后使用</h2>
            <p className="text-slate-600 mb-6">
              职业路径规划功能仅对会员开放，请登录后使用。
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
          <h1 className="text-3xl font-bold text-slate-800 mb-3">🚀 职业路径规划</h1>
          <p className="text-slate-600 mb-8">
            为您的职业发展提供个性化的规划和建议
          </p>
          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">购买高级会员</h2>
            <p className="text-slate-600 mb-6">
              职业路径规划功能仅对高级会员开放，一次性支付¥19即可永久解锁所有功能。
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

  // 模块内容数据
  const moduleContent = {
    direction: {
      title: '职业方向选择',
      icon: Target,
      content: (
        <div className="space-y-4">
          {!activeSubFeature ? (
            // 主菜单
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                className="bg-blue-50 p-6 rounded-lg hover:bg-blue-100 transition-colors text-left"
                onClick={() => setActiveSubFeature('assessment')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-blue-700">自我评估</h3>
                </div>
                <p className="text-slate-700 text-sm">通过问卷了解自己的兴趣、技能和价值观</p>
              </button>
              
              <button 
                className="bg-purple-50 p-6 rounded-lg hover:bg-purple-100 transition-colors text-left"
                onClick={() => setActiveSubFeature('industry')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-purple-700">行业调研</h3>
                </div>
                <p className="text-slate-700 text-sm">研究不同行业的发展趋势和薪资水平</p>
              </button>
              
              <button 
                className="bg-green-50 p-6 rounded-lg hover:bg-green-100 transition-colors text-left"
                onClick={() => setActiveSubFeature('test')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-green-700">职业测试</h3>
                </div>
                <p className="text-slate-700 text-sm">通过MBTI等工具辅助职业决策</p>
              </button>
              

            </div>
          ) : (
            // 子功能内容
            <div>
              <button 
                className="mb-4 flex items-center gap-2 text-slate-600 hover:text-slate-800"
                onClick={() => {
                  setActiveSubFeature(null);
                  setAssessmentResult(null);
                  setTestResult(null);
                  setIsSubmitted(false);
                }}
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                返回主菜单
              </button>
              
              {/* 自我评估功能 */}
              {activeSubFeature === 'assessment' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800">自我评估问卷</h3>
                  {!assessmentResult ? (
                    <div className="space-y-4">
                      {[
                        { id: 'q1', question: '我喜欢解决复杂的技术问题，享受逻辑思考的过程', category: '技术型' },
                        { id: 'q2', question: '我擅长与人沟通和协调，喜欢团队合作', category: '社交型' },
                        { id: 'q3', question: '我喜欢独立完成任务，能够自我驱动', category: '独立型' },
                        { id: 'q4', question: '我对数据和分析很感兴趣，善于从数据中发现规律', category: '分析型' },
                        { id: 'q5', question: '我喜欢创造性的工作，追求新颖的解决方案', category: '创造型' },
                        { id: 'q6', question: '我注重细节，做事认真严谨', category: '严谨型' },
                        { id: 'q7', question: '我喜欢挑战，愿意承担风险', category: '挑战型' },
                        { id: 'q8', question: '我善于规划和组织，喜欢有序的工作环境', category: '组织型' },
                        { id: 'q9', question: '我关注他人需求，乐于助人', category: '服务型' },
                        { id: 'q10', question: '我喜欢学习新知识，保持好奇心', category: '学习型' },
                      ].map((q) => (
                        <div key={q.id} className="bg-slate-50 p-4 rounded-lg">
                          <p className="font-medium text-slate-800 mb-3">{q.question}</p>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((score) => (
                              <button
                                key={score}
                                className={`w-10 h-10 rounded-full transition-colors ${
                                  assessmentAnswers[q.id] === score 
                                    ? 'bg-indigo-500 text-white' 
                                    : 'bg-white border border-slate-300 hover:bg-indigo-50'
                                }`}
                                onClick={() => setAssessmentAnswers({...assessmentAnswers, [q.id]: score})}
                              >
                                {score}
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between text-xs text-slate-500 mt-2">
                            <span>非常不同意</span>
                            <span>非常同意</span>
                          </div>
                        </div>
                      ))}
                      <Button 
                        className="w-full"
                        disabled={Object.keys(assessmentAnswers).length < 10}
                        onClick={() => {
                          // 计算结果 - 基于不同类型的得分
                          const categoryScores = {
                            '技术型': 0,
                            '社交型': 0,
                            '独立型': 0,
                            '分析型': 0,
                            '创造型': 0,
                            '严谨型': 0,
                            '挑战型': 0,
                            '组织型': 0,
                            '服务型': 0,
                            '学习型': 0
                          };
                          
                          Object.entries(assessmentAnswers).forEach(([qId, score]) => {
                            const question = [
                              { id: 'q1', category: '技术型' },
                              { id: 'q2', category: '社交型' },
                              { id: 'q3', category: '独立型' },
                              { id: 'q4', category: '分析型' },
                              { id: 'q5', category: '创造型' },
                              { id: 'q6', category: '严谨型' },
                              { id: 'q7', category: '挑战型' },
                              { id: 'q8', category: '组织型' },
                              { id: 'q9', category: '服务型' },
                              { id: 'q10', category: '学习型' }
                            ].find(q => q.id === qId);
                            if (question) {
                              categoryScores[question.category as keyof typeof categoryScores] = score as number;
                            }
                          });
                          
                          // 找出得分最高的三个类型
                          const topCategories = Object.entries(categoryScores)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 3)
                            .map(([category]) => category);
                          
                          // 生成评估结果
                          let result = '根据您的评估，您的优势类型是：' + topCategories.join('、') + '\n\n';
                          
                          if (topCategories.includes('技术型') || topCategories.includes('分析型')) {
                            result += '您适合技术型职业，如工程师、数据分析师、系统架构师等。';
                          } else if (topCategories.includes('社交型') || topCategories.includes('服务型')) {
                            result += '您适合社交型职业，如销售、人力资源、客户服务等。';
                          } else if (topCategories.includes('创造型') || topCategories.includes('挑战型')) {
                            result += '您适合创造型职业，如设计师、创意总监、创业者等。';
                          } else if (topCategories.includes('组织型') || topCategories.includes('严谨型')) {
                            result += '您适合管理型职业，如项目经理、运营经理、行政主管等。';
                          } else {
                            result += '您适合综合型职业，如产品经理、市场策划、咨询顾问等。';
                          }
                          
                          setAssessmentResult(result);
                        }}
                      >
                        查看评估结果
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-green-700 mb-3">评估结果</h4>
                      <p className="text-slate-700">{assessmentResult}</p>
                      <Button 
                        className="mt-4"
                        variant="outline"
                        onClick={() => {
                          setAssessmentAnswers({});
                          setAssessmentResult(null);
                        }}
                      >
                        重新评估
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {/* 行业调研功能 */}
              {activeSubFeature === 'industry' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800">行业调研工具</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['互联网/IT', '金融/银行', '教育/培训', '医疗/健康', '制造/工业', '零售/电商', '新能源', '人工智能', '生物医药', '元宇宙/VR/AR', '区块链', '物联网'].map((industry) => (
                      <button
                        key={industry}
                        className={`p-4 rounded-lg text-left transition-colors ${
                          selectedIndustry === industry 
                            ? 'bg-indigo-500 text-white' 
                            : 'bg-slate-50 hover:bg-indigo-50'
                        }`}
                        onClick={() => setSelectedIndustry(industry)}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                  {selectedIndustry && (
                    <div className="bg-slate-50 p-4 rounded-lg mt-4">
                      <h4 className="font-semibold text-slate-800 mb-3">{selectedIndustry}行业分析</h4>
                      <div className="space-y-3">
                        {(() => {
                          // 根据不同行业返回不同的分析数据
                          const industryData = {
                            '互联网/IT': {
                              发展前景: 5,
                              薪资水平: 5,
                              工作强度: 4,
                              描述: '互联网/IT行业持续快速发展，云计算、大数据、人工智能等领域需求旺盛，未来5年预计增长率将达到25%以上。薪资水平在各行业中处于领先地位，但工作强度较大，需要不断学习新技术。'
                            },
                            '金融/银行': {
                              发展前景: 4,
                              薪资水平: 5,
                              工作强度: 4,
                              描述: '金融科技快速发展，数字化转型加速，区块链、智能投顾等新兴领域为行业带来新机遇。薪资水平高，但入行门槛也较高，需要具备专业知识和证书。'
                            },
                            '教育/培训': {
                              发展前景: 4,
                              薪资水平: 3,
                              工作强度: 3,
                              描述: '在线教育持续增长，AI辅助教学成为趋势，个性化教育需求增加。工作环境相对稳定，但薪资水平中等，需要良好的沟通能力和专业知识。'
                            },
                            '医疗/健康': {
                              发展前景: 5,
                              薪资水平: 4,
                              工作强度: 4,
                              描述: '医疗AI、远程医疗、健康管理等领域快速发展，老龄化社会带来巨大需求。入行门槛高，需要专业学历和资格证书，但职业稳定性高，社会地位高。'
                            },
                            '制造/工业': {
                              发展前景: 4,
                              薪资水平: 3,
                              工作强度: 4,
                              描述: '工业4.0、智能制造、自动化生产成为主流，传统制造业向高端制造转型。技术人才需求增加，尤其是自动化、机器人等领域的专业人才。'
                            },
                            '零售/电商': {
                              发展前景: 4,
                              薪资水平: 3,
                              工作强度: 4,
                              描述: '线上线下融合加速，直播电商、社交电商成为新增长点，供应链优化成为核心竞争力。入行门槛较低，但工作强度较大，需要具备较强的市场敏感度。'
                            },
                            '新能源': {
                              发展前景: 5,
                              薪资水平: 4,
                              工作强度: 3,
                              描述: '全球能源转型加速，太阳能、风能、电动车等领域投资持续增长，技术创新驱动行业发展。未来5-10年将保持高速增长，人才需求旺盛。'
                            },
                            '人工智能': {
                              发展前景: 5,
                              薪资水平: 5,
                              工作强度: 4,
                              描述: 'AI技术快速迭代，大模型、生成式AI成为热点，应用场景不断拓展，人才需求旺盛。薪资水平高，但需要持续学习最新技术，竞争激烈。'
                            },
                            '生物医药': {
                              发展前景: 5,
                              薪资水平: 4,
                              工作强度: 4,
                              描述: '基因编辑、细胞治疗、精准医疗等领域突破不断，创新药研发加速，市场规模持续扩大。入行门槛高，需要专业背景，但职业发展稳定，社会价值高。'
                            },
                            '元宇宙/VR/AR': {
                              发展前景: 5,
                              薪资水平: 4,
                              工作强度: 4,
                              描述: '元宇宙概念逐步落地，VR/AR技术成熟，游戏、教育、培训等领域应用场景不断丰富。属于新兴行业，发展潜力大，但也存在一定的不确定性。'
                            },
                            '区块链': {
                              发展前景: 4,
                              薪资水平: 5,
                              工作强度: 4,
                              描述: '区块链技术应用从加密货币扩展到供应链、金融、政务等领域，监管逐步完善。技术人才需求大，薪资水平高，但行业波动性较大。'
                            },
                            '物联网': {
                              发展前景: 5,
                              薪资水平: 4,
                              工作强度: 3,
                              描述: '物联网设备数量爆发式增长，边缘计算、5G等技术推动行业发展，智能城市、工业物联网成为热点。技术人才需求大，尤其是嵌入式开发、网络安全等领域。'
                            }
                          };
                          
                          const data = industryData[selectedIndustry as keyof typeof industryData] || industryData['互联网/IT'];
                          
                          return (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">发展前景</span>
                                <div className="flex gap-1">
                                  {[1,2,3,4,5].map(i => (
                                    <div key={i} className={`w-3 h-3 rounded-full ${i <= data.发展前景 ? 'bg-green-500' : 'bg-slate-200'}`} />
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">薪资水平</span>
                                <div className="flex gap-1">
                                  {[1,2,3,4,5].map(i => (
                                    <div key={i} className={`w-3 h-3 rounded-full ${i <= data.薪资水平 ? 'bg-blue-500' : 'bg-slate-200'}`} />
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">工作强度</span>
                                <div className="flex gap-1">
                                  {[1,2,3,4,5].map(i => (
                                    <div key={i} className={`w-3 h-3 rounded-full ${i <= data.工作强度 ? 'bg-orange-500' : 'bg-slate-200'}`} />
                                  ))}
                                </div>
                              </div>
                              <div className="mt-4 p-3 bg-white rounded">
                                <p className="text-sm text-slate-700">
                                  {data.描述}
                                </p>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* 职业测试功能 */}
              {activeSubFeature === 'test' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800">MBTI职业性格测试</h3>
                  {!testResult ? (
                    <div className="space-y-4">
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-slate-600 mb-2">
                          <span>进度</span>
                          <span>{Math.round((Object.keys(testAnswers).length / 16) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-500 h-2 rounded-full transition-all"
                            style={{ width: `${(Object.keys(testAnswers).length / 16) * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      {[
                        // E/I 维度
                        { id: 1, question: '在社交场合中，你通常：', options: ['主动与人交流', '等待别人来找你'], type: 'E/I' },
                        { id: 2, question: '你更喜欢：', options: ['与很多朋友保持广泛联系', '与少数朋友保持深度关系'], type: 'E/I' },
                        { id: 3, question: '在工作中，你更喜欢：', options: ['团队合作', '独立工作'], type: 'E/I' },
                        { id: 4, question: '当你感到压力时，你会：', options: ['找朋友倾诉', '独自思考解决'], type: 'E/I' },
                        // S/N 维度
                        { id: 5, question: '你更关注：', options: ['具体的事实和细节', '整体的概念和模式'], type: 'S/N' },
                        { id: 6, question: '学习新事物时，你更喜欢：', options: ['通过实践和经验', '通过理论和概念'], type: 'S/N' },
                        { id: 7, question: '你更相信：', options: ['可测量和可验证的事实', '直觉和灵感'], type: 'S/N' },
                        { id: 8, question: '你更关注：', options: ['当前的现实情况', '未来的可能性'], type: 'S/N' },
                        // T/F 维度
                        { id: 9, question: '做决定时，你更依赖：', options: ['逻辑和客观分析', '个人价值观和感受'], type: 'T/F' },
                        { id: 10, question: '你更重视：', options: ['公平和公正', '和谐和包容'], type: 'T/F' },
                        { id: 11, question: '在争论中，你更倾向于：', options: ['就事论事，坚持原则', '考虑他人感受，寻求共识'], type: 'T/F' },
                        { id: 12, question: '你更欣赏：', options: ['客观理性的思考', '温暖共情的态度'], type: 'T/F' },
                        // J/P 维度
                        { id: 13, question: '你更喜欢：', options: ['有计划有条理', '灵活应变'], type: 'J/P' },
                        { id: 14, question: '面对最后期限，你会：', options: ['提前完成，留有缓冲', '临近 deadline才开始'], type: 'J/P' },
                        { id: 15, question: '你更倾向于：', options: ['做出决定并坚持', '保持开放选项'], type: 'J/P' },
                        { id: 16, question: '你的生活方式更倾向于：', options: ['结构化和有规律', '随意和即兴'], type: 'J/P' },
                      ].map((q) => (
                        <div key={q.id} className="bg-slate-50 p-4 rounded-lg">
                          <p className="font-medium text-slate-800 mb-3">{q.question}</p>
                          <div className="space-y-2">
                            {q.options.map((option, idx) => (
                              <button
                                key={idx}
                                className={`w-full p-3 rounded-lg text-left transition-colors ${
                                  testAnswers[q.id] === option 
                                    ? 'bg-indigo-500 text-white' 
                                    : 'bg-white border border-slate-200 hover:bg-indigo-50'
                                }`}
                                onClick={() => setTestAnswers({...testAnswers, [q.id]: option})}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      <Button 
                        className="w-full"
                        disabled={Object.keys(testAnswers).length < 16}
                        onClick={() => {
                          // 基于多题的MBTI计算
                          const scores = {
                            'E': 0, 'I': 0,
                            'S': 0, 'N': 0,
                            'T': 0, 'F': 0,
                            'J': 0, 'P': 0
                          };
                          
                          // 统计各维度得分
                          Object.entries(testAnswers).forEach(([qId, answer]) => {
                            const question = [
                              { id: '1', type: 'E/I', options: ['E', 'I'] },
                              { id: '2', type: 'E/I', options: ['E', 'I'] },
                              { id: '3', type: 'E/I', options: ['E', 'I'] },
                              { id: '4', type: 'E/I', options: ['E', 'I'] },
                              { id: '5', type: 'S/N', options: ['S', 'N'] },
                              { id: '6', type: 'S/N', options: ['S', 'N'] },
                              { id: '7', type: 'S/N', options: ['S', 'N'] },
                              { id: '8', type: 'S/N', options: ['S', 'N'] },
                              { id: '9', type: 'T/F', options: ['T', 'F'] },
                              { id: '10', type: 'T/F', options: ['T', 'F'] },
                              { id: '11', type: 'T/F', options: ['T', 'F'] },
                              { id: '12', type: 'T/F', options: ['T', 'F'] },
                              { id: '13', type: 'J/P', options: ['J', 'P'] },
                              { id: '14', type: 'J/P', options: ['J', 'P'] },
                              { id: '15', type: 'J/P', options: ['J', 'P'] },
                              { id: '16', type: 'J/P', options: ['J', 'P'] },
                            ].find(q => q.id === qId);
                            
                            if (question) {
                              const optionIndex = question.options.length === 2 ? 0 : 1;
                              if (answer === question.options[optionIndex]) {
                                scores[question.type.split('/')[optionIndex] as keyof typeof scores]++;
                              } else {
                                scores[question.type.split('/')[1 - optionIndex] as keyof typeof scores]++;
                              }
                            }
                          });
                          
                          // 确定最终类型
                          const ei = scores['E'] > scores['I'] ? 'E' : 'I';
                          const sn = scores['S'] > scores['N'] ? 'S' : 'N';
                          const tf = scores['T'] > scores['F'] ? 'T' : 'F';
                          const jp = scores['J'] > scores['P'] ? 'J' : 'P';
                          const mbti = ei + sn + tf + jp;
                          
                          const recommendations: Record<string, string> = {
                            'ESTJ': '管理者、项目经理、行政人员、军官、财务经理',
                            'ESFJ': '教师、护士、社会工作者、销售经理、人力资源专员',
                            'ENTJ': 'CEO、企业家、顾问、律师、战略规划师',
                            'ENFJ': '心理咨询师、教师、教练、公关经理、活动策划',
                            'ISTJ': '会计师、审计师、质量控制、工程师、警察',
                            'ISFJ': '护士、教师、行政助理、社会工作者、图书管理员',
                            'INTJ': '战略顾问、系统架构师、研究员、科学家、工程师',
                            'INFJ': '心理咨询师、作家、哲学家、教育工作者、精神导师',
                            'ESTP': '企业家、销售、运动员、警察、消防员',
                            'ESFP': '演员、销售人员、旅游顾问、活动策划、客服',
                            'ENTP': '发明家、企业家、律师、记者、营销策划',
                            'ENFP': '市场营销、产品经理、创业者、教师、咨询师',
                            'ISTP': '工程师、技术专家、运动员、侦探、手工艺人',
                            'ISFP': '艺术家、设计师、音乐家、护士、社会工作者',
                            'INTP': '科学家、程序员、研究员、分析师、哲学家',
                            'INFP': '作家、艺术家、心理咨询师、教师、社会工作者',
                          };
                          setTestResult(`您的MBTI类型是：${mbti}\n\n适合的职业方向：${recommendations[mbti] || '综合型职业'}`);
                        }}
                      >
                        查看测试结果
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-green-700 mb-3">测试结果</h4>
                      <p className="text-slate-700 whitespace-pre-line">{testResult}</p>
                      <Button 
                        className="mt-4"
                        variant="outline"
                        onClick={() => {
                          setTestAnswers({});
                          setTestResult(null);
                        }}
                      >
                        重新测试
                      </Button>
                    </div>
                  )}
                </div>
              )}
              

            </div>
          )}
        </div>
      )
    },
    resume: {
      title: '简历优化',
      icon: Briefcase,
      content: (
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">简历分析工具</h3>
            <div className="space-y-4">
              {!resumeAnalysis ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">目标职位</label>
                    <input 
                      type="text" 
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="例如：前端开发工程师"
                      value={resumeForm.targetPosition}
                      onChange={(e) => setResumeForm({...resumeForm, targetPosition: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">简历内容</label>
                    <textarea 
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-40"
                      placeholder="请粘贴您的简历内容..."
                      value={resumeForm.resumeContent}
                      onChange={(e) => setResumeForm({...resumeForm, resumeContent: e.target.value})}
                    />
                  </div>
                  <Button 
                    className="w-full"
                    disabled={!resumeForm.targetPosition || !resumeForm.resumeContent}
                    onClick={async () => {
                      setIsAnalyzing(true);
                      try {
                        // 模拟分析过程
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        
                        // 分析简历内容
                        const analysis = analyzeResume(resumeForm.targetPosition, resumeForm.resumeContent);
                        setResumeAnalysis(analysis);
                      } catch (error) {

                      } finally {
                        setIsAnalyzing(false);
                      }
                    }}
                  >
                    {isAnalyzing ? '分析中...' : '分析简历'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-800">分析结果</h4>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setResumeAnalysis(null);
                        setResumeForm({ targetPosition: '', resumeContent: '' });
                      }}
                    >
                      重新分析
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-3 h-3 rounded-full ${resumeAnalysis.overallScore >= 70 ? 'bg-green-500' : resumeAnalysis.overallScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      <span className="font-medium">整体评分: {resumeAnalysis.overallScore}/100</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-medium text-slate-700 mb-1">关键词匹配度</h5>
                        <div className="w-full bg-slate-200 rounded-full h-2 mb-1">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${resumeAnalysis.keywordMatch}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600">{resumeAnalysis.keywordMatch}%</span>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-slate-700 mb-1">简历结构完整性</h5>
                        <div className="w-full bg-slate-200 rounded-full h-2 mb-1">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${resumeAnalysis.structureScore}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600">{resumeAnalysis.structureScore}%</span>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-slate-700 mb-1">内容质量</h5>
                        <div className="w-full bg-slate-200 rounded-full h-2 mb-1">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${resumeAnalysis.contentScore}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600">{resumeAnalysis.contentScore}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <h5 className="font-medium text-slate-800 mb-3">优化建议</h5>
                    <ul className="space-y-2">
                      {resumeAnalysis.suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <span className="text-sm text-slate-700">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
          

          

        </div>
      )
    },
    interview: {
      title: '面试模拟',
      icon: Users,
      content: (
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">常见面试问题</h3>
            {(() => {
              // 面试问题数据
              const interviewQuestions = [
                {
                  id: 1,
                  title: '自我介绍',
                  question: '请简要介绍一下你自己。',
                  suggestion: '准备一个1-2分钟的自我介绍，包括个人背景、专业技能、工作经验和职业目标。'
                },
                {
                  id: 2,
                  title: '职业规划',
                  question: '你未来3-5年的职业规划是什么？',
                  suggestion: '结合公司发展和个人目标，展示你对职业发展的清晰规划和学习意愿。'
                },
                {
                  id: 3,
                  title: '优缺点',
                  question: '请谈谈你的优点和缺点。',
                  suggestion: '优点要具体，结合实例；缺点要真实但不影响工作，同时说明改进措施。'
                },
                {
                  id: 4,
                  title: '为什么选择我们公司',
                  question: '你为什么选择我们公司？',
                  suggestion: '了解公司文化、业务和价值观，表达你与公司的契合度和贡献意愿。'
                },
                {
                  id: 5,
                  title: '薪资期望',
                  question: '你的薪资期望是多少？',
                  suggestion: '了解行业薪资水平，给出合理范围，强调关注发展机会。'
                }
              ];
              
              // 状态管理

              
              // 处理回答提交
              const handleSubmitAnswer = () => {
                const newAnswers = { ...userAnswers, [interviewQuestions[currentQuestionIndex].id]: currentAnswer };
                setUserAnswers(newAnswers);
                setCurrentAnswer(''); // 清空当前回答
                
                if (currentQuestionIndex < interviewQuestions.length - 1) {
                  // 进入下一个问题
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                } else {
                  setShowSummary(true);
                }
              };
              
              // 处理重新开始
              const handleRestart = () => {
                setCurrentQuestionIndex(0);
                setUserAnswers({});
                setCurrentAnswer('');
                setShowSummary(false);
              };
              
              if (showSummary) {
                return (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800">面试模拟完成！</h4>
                    <div className="p-4 bg-white rounded-lg border border-slate-200">
                      <h5 className="font-medium text-slate-800 mb-3">你的回答总结</h5>
                      <div className="space-y-4">
                        {interviewQuestions.map((q) => (
                          <div key={q.id} className="p-3 bg-slate-50 rounded-lg">
                            <h6 className="font-medium text-slate-800 mb-1">{q.title}</h6>
                            <p className="text-sm text-slate-600 mb-2">{q.question}</p>
                            <p className="text-sm text-slate-700">你的回答：{userAnswers[q.id] || '未回答'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full" onClick={handleRestart}>重新开始</Button>
                  </div>
                );
              }
              
              const currentQuestion = interviewQuestions[currentQuestionIndex];
              
              return (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-slate-800">问题 {currentQuestionIndex + 1}/{interviewQuestions.length}</h4>
                    <span className="text-sm text-slate-600">{currentQuestion.title}</span>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <p className="text-slate-700 mb-4">{currentQuestion.question}</p>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">你的回答</label>
                      <textarea 
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-32"
                        placeholder="请输入你的回答..."
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                      />
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg mb-4">
                      <h5 className="font-medium text-blue-700 mb-1">建议</h5>
                      <p className="text-sm text-slate-700">{currentQuestion.suggestion}</p>
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={handleSubmitAnswer}
                    >
                      {currentQuestionIndex < interviewQuestions.length - 1 ? '下一个问题' : '完成'}
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
          
          <div className="bg-slate-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">STAR法则</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-3">什么是STAR法则？</h4>
                <p className="text-sm text-slate-600 mb-4">STAR法则是一种结构化的面试回答方法，用于清晰地描述你的工作经历和成就。</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-700 mb-1">S (Situation)</h5>
                    <p className="text-sm text-slate-700">情境：描述你面临的具体情况或任务。</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h5 className="font-medium text-purple-700 mb-1">T (Task)</h5>
                    <p className="text-sm text-slate-700">任务：说明你的责任和目标。</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h5 className="font-medium text-green-700 mb-1">A (Action)</h5>
                    <p className="text-sm text-slate-700">行动：详述你采取的具体步骤和措施。</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <h5 className="font-medium text-orange-700 mb-1">R (Result)</h5>
                    <p className="text-sm text-slate-700">结果：分享你的行动带来的成果和影响。</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-3">STAR法则示例</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-slate-700">问题：请描述一个你解决的困难问题。</p>
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm text-slate-600"><span className="font-medium">S：</span>在我之前的工作中，我们的项目进度滞后，客户满意度下降。</p>
                    <p className="text-sm text-slate-600"><span className="font-medium">T：</span>作为项目负责人，我的任务是找出问题原因并制定解决方案，确保项目按时完成。</p>
                    <p className="text-sm text-slate-600"><span className="font-medium">A：</span>我组织了团队会议，分析了问题根源，重新分配了任务，建立了每日站会制度，并与客户保持密切沟通。</p>
                    <p className="text-sm text-slate-600"><span className="font-medium">R：</span>通过这些措施，我们不仅按时完成了项目，还提高了客户满意度，客户因此与我们签订了长期合作协议。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    skills: {
      title: '技能快速提升',
      icon: TrendingUp,
      content: (
        <div className="space-y-6">
          {/* 核心技能 */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-4">核心技能</h3>
            <p className="text-slate-700 mb-4">基于您的职业，以下是需要重点提升的核心技能：</p>
            <div className="space-y-3">
              {(() => {
                // 根据职位提供核心技能
                const positionSkills: Record<string, string[]> = {
                  frontend: [
                    'JavaScript/TypeScript',
                    'React/Vue框架',
                    'CSS/HTML',
                    '前端工程化',
                    '性能优化',
                    '响应式设计'
                  ],
                  backend: [
                    'Java/Python',
                    '数据库设计',
                    'API开发',
                    '微服务架构',
                    'DevOps',
                    '性能调优'
                  ],
                  data: [
                    'SQL',
                    'Python',
                    '数据分析',
                    '数据可视化',
                    '机器学习',
                    '统计分析'
                  ],
                  design: [
                    'UI/UX设计',
                    'Figma/Sketch',
                    '原型设计',
                    '用户研究',
                    '交互设计',
                    '视觉设计'
                  ],
                  product: [
                    '产品规划',
                    '需求分析',
                    '用户研究',
                    '数据分析',
                    '项目管理',
                    '原型设计'
                  ],
                  hr: [
                    '招聘',
                    '绩效管理',
                    '薪酬设计',
                    '员工关系',
                    '培训与发展',
                    '企业文化'
                  ],
                  admin: [
                    '办公管理',
                    '资源协调',
                    '活动策划',
                    '文件管理',
                    '供应商管理',
                    '成本控制'
                  ],
                  finance: [
                    '财务会计',
                    '成本核算',
                    '预算管理',
                    '财务分析',
                    '税务申报',
                    '内部控制'
                  ],
                  customer: [
                    '客户沟通',
                    '问题解决',
                    '服务标准',
                    '投诉处理',
                    '客户关系管理',
                    '服务质量监控'
                  ],
                  sales: [
                    '销售技巧',
                    '客户开发',
                    '谈判技巧',
                    '产品知识',
                    '客户关系管理',
                    '销售策略'
                  ],
                  marketing: [
                    '市场调研',
                    '营销策略',
                    '品牌建设',
                    '数字营销',
                    '内容创作',
                    '活动策划'
                  ],
                  default: [
                    '沟通能力',
                    '团队协作',
                    '问题解决',
                    '时间管理',
                    '学习能力',
                    '专业知识'
                  ]
                };
                
                const skills = positionSkills[selectedPosition as keyof typeof positionSkills] || positionSkills.default;
                
                return skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-slate-700">{skill}</span>
                  </div>
                ));
              })()}
            </div>
          </div>
          
          {/* 实践项目评分 */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-4">实践项目评分</h3>
            <p className="text-slate-700 mb-4">根据您的职业和项目经验，评估您的实践能力：</p>
            <div className="space-y-4">
              {(() => {
                
                // 评估项目经验
                const evaluateProject = async () => {
                  if (!projectExperience) {
                    alert('请输入项目经验');
                    return;
                  }
                  
                  setIsEvaluatingProject(true);
                  
                  // 模拟评估过程
                  await new Promise(resolve => setTimeout(resolve, 1500));
                  
                  // 基于内容分析的评分逻辑
                  const content = projectExperience.toLowerCase();
                  
                  // 计算各个维度的评分
                  let complexity = 80;
                  let technicalDifficulty = 80;
                  let innovation = 75;
                  let businessValue = 80;
                  
                  // 项目复杂度评分
                  if (content.includes('大型') || content.includes('复杂') || content.includes('多模块')) {
                    complexity += 10;
                  } else if (content.includes('小型') || content.includes('简单')) {
                    complexity -= 5;
                  }
                  
                  // 技术难度评分
                  if (content.includes('技术') || content.includes('架构') || content.includes('算法')) {
                    technicalDifficulty += 10;
                  } else if (content.includes('基础') || content.includes('简单')) {
                    technicalDifficulty -= 5;
                  }
                  
                  // 创新程度评分
                  if (content.includes('创新') || content.includes('新') || content.includes('首创')) {
                    innovation += 10;
                  } else if (content.includes('常规') || content.includes('传统')) {
                    innovation -= 5;
                  }
                  
                  // 商业价值评分
                  if (content.includes('价值') || content.includes('收益') || content.includes('增长')) {
                    businessValue += 10;
                  } else if (content.includes('内部') || content.includes('测试')) {
                    businessValue -= 5;
                  }
                  
                  // 确保评分在合理范围内
                  complexity = Math.max(70, Math.min(100, complexity));
                  technicalDifficulty = Math.max(70, Math.min(100, technicalDifficulty));
                  innovation = Math.max(65, Math.min(100, innovation));
                  businessValue = Math.max(70, Math.min(100, businessValue));
                  
                  const total = Math.round((complexity + technicalDifficulty + innovation + businessValue) / 4);
                  
                  setProjectScore(total);
                  setProjectDetails({
                    complexity,
                    technicalDifficulty,
                    innovation,
                    businessValue
                  });
                  setIsEvaluatingProject(false);
                };
                
                return (
                  <>
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                      <h4 className="font-medium text-slate-800 mb-3">项目经验评估</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">请描述您的实践项目经验</label>
                          <textarea 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24"
                            placeholder="请简要描述您参与或主导的项目，包括项目目标、您的角色和贡献..."
                            value={projectExperience}
                            onChange={(e) => setProjectExperience(e.target.value)}
                          />
                        </div>
                        <Button 
                          className="w-full"
                          onClick={evaluateProject}
                          disabled={isEvaluatingProject}
                        >
                          {isEvaluatingProject ? '评估中...' : '评估项目经验'}
                        </Button>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                      <h4 className="font-medium text-slate-800 mb-3">项目评分结果</h4>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-slate-700">综合评分</span>
                        <span className="text-2xl font-bold text-green-600">{projectScore || 85}/100</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${projectScore || 85}%` }} 
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">项目复杂度</span>
                          <span className="text-slate-800 font-medium">{projectDetails.complexity || 90}/100</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">技术难度</span>
                          <span className="text-slate-800 font-medium">{projectDetails.technicalDifficulty || 85}/100</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">创新程度</span>
                          <span className="text-slate-800 font-medium">{projectDetails.innovation || 80}/100</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">商业价值</span>
                          <span className="text-slate-800 font-medium">{projectDetails.businessValue || 85}/100</span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
          
          {/* 技能认证评分 */}
          <div className="bg-orange-50 p-6 rounded-lg">
            <h3 className="font-semibold text-orange-700 mb-4">技能认证评分</h3>
            <p className="text-slate-700 mb-4">根据您的职业证书，评估您的专业能力：</p>
            <div className="space-y-4">
              {(() => {

                
                // 评估证书价值
                const evaluateCertificate = async () => {
                  if (!certificateName || !certificateIssuer || !certificateDate) {
                    alert('请填写完整的证书信息');
                    return;
                  }
                  
                  setIsEvaluatingCertificate(true);
                  
                  // 模拟评估过程
                  await new Promise(resolve => setTimeout(resolve, 1500));
                  
                  // 基于证书信息分析的评分逻辑
                  const certName = certificateName.toLowerCase();
                  const issuer = certificateIssuer.toLowerCase();
                  const date = new Date(certificateDate);
                  const now = new Date();
                  const yearsDiff = now.getFullYear() - date.getFullYear();
                  
                  // 计算各个维度的评分
                  let industryRecognition = 85;
                  let technicalContent = 85;
                  let timeliness = 80;
                  let relevance = 85;
                  
                  // 行业认可度评分
                  const topIssuers = ['aws', 'microsoft', 'google', 'oracle', 'ibm', 'cisco'];
                  if (topIssuers.some(iss => issuer.includes(iss))) {
                    industryRecognition += 10;
                  }
                  
                  // 技术含量评分
                  if (certName.includes('认证') || certName.includes('专业') || certName.includes('专家')) {
                    technicalContent += 10;
                  } else if (certName.includes('基础') || certName.includes('入门')) {
                    technicalContent -= 5;
                  }
                  
                  // 时效性评分
                  if (yearsDiff <= 1) {
                    timeliness += 10;
                  } else if (yearsDiff >= 5) {
                    timeliness -= 10;
                  } else if (yearsDiff >= 3) {
                    timeliness -= 5;
                  }
                  
                  // 与职业相关性评分
                  const positionKeywords = selectedPosition.toLowerCase();
                  if (certName.includes(positionKeywords)) {
                    relevance += 10;
                  }
                  
                  // 确保评分在合理范围内
                  industryRecognition = Math.max(70, Math.min(100, industryRecognition));
                  technicalContent = Math.max(70, Math.min(100, technicalContent));
                  timeliness = Math.max(60, Math.min(100, timeliness));
                  relevance = Math.max(70, Math.min(100, relevance));
                  
                  const total = Math.round((industryRecognition + technicalContent + timeliness + relevance) / 4);
                  
                  setCertificateScore(total);
                  setCertificateDetails({
                    industryRecognition,
                    technicalContent,
                    timeliness,
                    relevance
                  });
                  setIsEvaluatingCertificate(false);
                };
                
                return (
                  <>
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                      <h4 className="font-medium text-slate-800 mb-3">证书信息</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">证书名称</label>
                          <input 
                            type="text" 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="例如：AWS认证解决方案架构师"
                            value={certificateName}
                            onChange={(e) => setCertificateName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">发证机构</label>
                          <input 
                            type="text" 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="例如：Amazon Web Services"
                            value={certificateIssuer}
                            onChange={(e) => setCertificateIssuer(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">获得日期</label>
                          <input 
                            type="date" 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={certificateDate}
                            onChange={(e) => setCertificateDate(e.target.value)}
                          />
                        </div>
                        <Button 
                          className="w-full"
                          onClick={evaluateCertificate}
                          disabled={isEvaluatingCertificate}
                        >
                          {isEvaluatingCertificate ? '评估中...' : '评估证书价值'}
                        </Button>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                      <h4 className="font-medium text-slate-800 mb-3">证书评分结果</h4>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-slate-700">综合评分</span>
                        <span className="text-2xl font-bold text-orange-600">{certificateScore || 90}/100</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                        <div 
                          className="bg-orange-500 h-2 rounded-full" 
                          style={{ width: `${certificateScore || 90}%` }} 
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">行业认可度</span>
                          <span className="text-slate-800 font-medium">{certificateDetails.industryRecognition || 95}/100</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">技术含量</span>
                          <span className="text-slate-800 font-medium">{certificateDetails.technicalContent || 90}/100</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">时效性</span>
                          <span className="text-slate-800 font-medium">{certificateDetails.timeliness || 85}/100</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">与职业相关性</span>
                          <span className="text-slate-800 font-medium">{certificateDetails.relevance || 90}/100</span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )
    },
    job_hopping: {
      title: '跳槽规划',
      icon: ArrowRight,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-2">时机选择</h3>
            <p className="text-slate-700">把握最佳跳槽时机，通常在工作1-2年后。</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-2">目标设定</h3>
            <p className="text-slate-700">明确跳槽目标，包括职位、薪资和发展空间。</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-2">简历更新</h3>
            <p className="text-slate-700">根据目标职位优化简历，突出相关经验。</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-700 mb-2">面试准备</h3>
            <p className="text-slate-700">针对目标公司和职位进行充分的面试准备。</p>
          </div>
        </div>
      )
    },
    pitfalls: {
      title: '职场避坑指南',
      icon: AlertCircle,
      content: (
        <div className="space-y-6">
          {/* 职场沟通 */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              职场沟通避坑
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-2">常见坑点</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>过度承诺：答应超出能力范围的任务，导致无法按时完成</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>越级汇报：绕过直属领导直接向上级汇报工作</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>情绪化沟通：在情绪激动时做出重要决定或发表意见</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>背后议论：在同事面前批评其他同事或领导</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-2">避坑建议</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>学会说"不"：合理评估自己的能力，不盲目承诺</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>遵循汇报层级：先与直属领导沟通，必要时再向上汇报</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>冷静期原则：重要决定前先冷静24小时</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>当面沟通：有问题直接与当事人沟通，不在背后议论</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* 时间管理 */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              时间管理避坑
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-2">常见坑点</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>完美主义：过度追求细节，导致整体进度延误</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>不会拒绝：接受所有任务，导致工作过载</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>拖延症：总是等到最后一刻才开始工作</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>频繁打断：不断被消息、会议打断，无法专注</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-2">避坑建议</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>80/20法则：把80%精力放在20%关键任务上</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>优先级管理：使用四象限法则区分任务优先级</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>番茄工作法：25分钟专注工作，5分钟休息</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>时间块管理：为深度工作预留不被打扰的时间段</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* 人际关系 */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              人际关系避坑
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-2">常见坑点</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>站队文化：过早加入某个小团体，卷入办公室政治</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>过度分享：向同事透露过多个人隐私或负面情绪</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>抢功推责：抢他人功劳，出问题推卸责任</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>边界不清：与同事关系过于亲密或过于疏远</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-2">避坑建议</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>保持中立：不轻易站队，专注于工作本身</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>适度距离：与同事保持友好但专业的关系</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>主动担当：勇于承担责任，不推诿扯皮</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>互利共赢：寻求合作机会，实现双赢</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* 职业规划 */}
          <div className="bg-orange-50 p-6 rounded-lg">
            <h3 className="font-semibold text-orange-700 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              职业规划避坑
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-2">常见坑点</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>盲目跳槽：为了短期薪资增长频繁跳槽</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>舒适区陷阱：长期停留在舒适区，停止学习成长</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>跟风转行：盲目跟随热门行业，忽视自身优势</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>忽视软技能：只关注技术能力，忽视沟通协作</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-2">避坑建议</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>长期视角：关注3-5年职业发展，不只看眼前利益</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>持续学习：每年至少掌握一项新技能</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>优势导向：基于自身优势选择发展方向</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>全面发展：平衡技术能力与软技能的提升</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* 职场避坑自检工具 */}
          <div className="bg-red-50 p-6 rounded-lg">
            <h3 className="font-semibold text-red-700 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              职场避坑自检工具
            </h3>
            <p className="text-slate-700 mb-4">检查自己是否存在以下职场风险行为：</p>
            {(() => {

              
              const riskItems = [
                { id: '1', text: '经常加班到很晚，工作效率低下' },
                { id: '2', text: '与同事关系紧张，经常发生冲突' },
                { id: '3', text: '工作1年以上，技能没有明显提升' },
                { id: '4', text: '经常抱怨工作，但从不主动改变' },
                { id: '5', text: '不清楚自己的职业发展方向' },
                { id: '6', text: '很少主动与领导沟通工作进展' },
                { id: '7', text: '工作中经常犯同样的错误' },
                { id: '8', text: '对公司的业务和行业趋势不了解' },
              ];
              
              const checkedCount = Object.values(checkedItems).filter(Boolean).length;
              const riskLevel = checkedCount >= 5 ? '高风险' : checkedCount >= 3 ? '中风险' : '低风险';
              const riskColor = checkedCount >= 5 ? 'text-red-600' : checkedCount >= 3 ? 'text-yellow-600' : 'text-green-600';
              
              return (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="space-y-3">
                      {riskItems.map((item) => (
                        <label key={item.id} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
                            checked={checkedItems[item.id] || false}
                            onChange={(e) => setCheckedItems({...checkedItems, [item.id]: e.target.checked})}
                          />
                          <span className="text-slate-700 text-sm">{item.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-700">风险评估</span>
                      <span className={`font-bold ${riskColor}`}>{riskLevel}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                      <div 
                        className={`h-2 rounded-full ${checkedCount >= 5 ? 'bg-red-500' : checkedCount >= 3 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${(checkedCount / riskItems.length) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-slate-600">
                      您勾选了 {checkedCount} 项风险行为，{checkedCount >= 5 ? '建议立即采取行动改善' : checkedCount >= 3 ? '需要注意并改进' : '职场状态良好，继续保持'}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )
    },
    network: {
      title: '人脉建设',
      icon: Users,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-2">行业活动</h3>
            <p className="text-slate-700">参加行业会议、研讨会等活动，拓展人脉。</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-2">社交媒体</h3>
            <p className="text-slate-700">利用LinkedIn等平台，建立专业人脉网络。</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-2">导师关系</h3>
            <p className="text-slate-700">寻找行业导师，获取职业指导和建议。</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-700 mb-2">团队协作</h3>
            <p className="text-slate-700">在工作中建立良好的合作关系，拓展内部人脉。</p>
          </div>
        </div>
      )
    },
    breakthrough: {
      title: '瓶颈突破',
      icon: Lightbulb,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-2">技能升级</h3>
            <p className="text-slate-700">学习新兴技能，突破技术瓶颈。</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-2">职业定位</h3>
            <p className="text-slate-700">重新评估职业定位，明确发展方向。</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-2">挑战新任务</h3>
            <p className="text-slate-700">主动承担挑战性任务，突破舒适区。</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-700 mb-2">学习计划</h3>
            <p className="text-slate-700">制定系统的学习计划，持续提升自己。</p>
          </div>
        </div>
      )
    },
    promotion: {
      title: '晋升指导',
      icon: Award,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-2">晋升条件</h3>
            <p className="text-slate-700">了解公司晋升标准，明确努力方向。</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-2">能力提升</h3>
            <p className="text-slate-700">针对性提升管理能力和专业技能。</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-2">成果展示</h3>
            <p className="text-slate-700">量化工作成果，展示个人价值。</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-700 mb-2">沟通技巧</h3>
            <p className="text-slate-700">学会向上管理，有效沟通职业目标。</p>
          </div>
        </div>
      )
    },
    transition: {
      title: '转型评估',
      icon: ArrowRight,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-2">自我评估</h3>
            <p className="text-slate-700">评估个人技能和兴趣，确定转型方向。</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-2">行业研究</h3>
            <p className="text-slate-700">研究目标行业的发展趋势和需求。</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-2">技能 gap</h3>
            <p className="text-slate-700">识别转型所需的技能差距，制定学习计划。</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-700 mb-2">网络建设</h3>
            <p className="text-slate-700">建立目标行业的人脉网络，获取内推机会。</p>
          </div>
        </div>
      )
    },
    second_curve: {
      title: '第二曲线规划',
      icon: LineChart,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-2">副业探索</h3>
            <p className="text-slate-700">基于现有技能，探索副业机会。</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-2">技能延伸</h3>
            <p className="text-slate-700">将核心技能延伸到相关领域，开拓新方向。</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-2">创业准备</h3>
            <p className="text-slate-700">评估创业可行性，积累相关资源。</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-700 mb-2">投资规划</h3>
            <p className="text-slate-700">制定财务投资计划，为第二曲线做准备。</p>
          </div>
        </div>
      )
    },
    expert_mgmt: {
      title: '专家/管理路线选择',
      icon: Target,
      content: (
        <div className="space-y-6">
          {/* 路线评估工具 */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              路线评估工具
            </h3>
            <p className="text-slate-700 mb-4">通过回答以下问题，评估您更适合专家路线还是管理路线：</p>
            {(() => {

              
              const questions = [
                { id: 'q1', text: '我更享受解决技术/专业问题，而不是管理团队', options: 5 },
                { id: 'q2', text: '我喜欢深入研究一个领域，成为该领域的专家', options: 5 },
                { id: 'q3', text: '我更关注个人专业能力的提升，而非团队绩效', options: 5 },
                { id: 'q4', text: '我喜欢独立工作，而不是协调他人的工作', options: 5 },
                { id: 'q5', text: '我更享受技术挑战，而不是人际挑战', options: 5 },
                { id: 'q6', text: '我喜欢制定策略和计划，而非执行具体任务', options: 5 },
                { id: 'q7', text: '我擅长激励和指导他人', options: 5 },
                { id: 'q8', text: '我更关注团队整体目标的实现，而非个人成就', options: 5 },
                { id: 'q9', text: '我擅长解决团队内部的冲突和问题', options: 5 },
                { id: 'q10', text: '我喜欢管理资源和预算', options: 5 },
              ];
              
              const calculateResult = () => {
                if (Object.keys(answers).length < questions.length) {
                  alert('请回答所有问题');
                  return;
                }
                
                let expertScore = 0;
                let managementScore = 0;
                
                // 前5题是专家路线倾向，后5题是管理路线倾向
                questions.forEach((q, index) => {
                  const score = answers[q.id] || 0;
                  if (index < 5) {
                    expertScore += score;
                  } else {
                    managementScore += score;
                  }
                });
                
                let resultText = '';
                if (expertScore > managementScore + 5) {
                  resultText = '您更适合专家路线：您倾向于专注个人专业能力的提升，享受解决技术/专业问题，适合成为技术或行业专家。';
                } else if (managementScore > expertScore + 5) {
                  resultText = '您更适合管理路线：您倾向于关注团队整体目标，擅长激励和指导他人，适合向管理岗位发展。';
                } else {
                  resultText = '您适合混合型路线：您既具备专业能力，又有管理潜力，适合成为技术管理者，结合专业和管理能力。';
                }
                
                setResult(resultText);
              };
              
              return (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="space-y-4">
                      {questions.map((q, index) => (
                        <div key={q.id} className="space-y-2">
                          <p className="text-sm font-medium text-slate-800">{index + 1}. {q.text}</p>
                          <div className="flex justify-between">
                            {[1, 2, 3, 4, 5].map((option) => (
                              <button
                                key={option}
                                className={`w-10 h-10 rounded-full transition-colors ${answers[q.id] === option ? 'bg-blue-500 text-white' : 'bg-white border border-slate-300 hover:bg-blue-50'}`}
                                onClick={() => setAnswers({...answers, [q.id]: option})}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>非常不同意</span>
                            <span>非常同意</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full" onClick={calculateResult}>评估适合路线</Button>
                  {result && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-700 mb-2">评估结果</h4>
                      <p className="text-slate-700">{result}</p>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
          
          {/* 路线对比 */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              路线对比
            </h3>
            <div className="bg-white p-4 rounded-lg border border-slate-200 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-700">对比维度</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">专家路线</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">管理路线</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">混合型路线</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 font-medium">核心能力</td>
                    <td className="py-3 px-4">专业技术/领域知识</td>
                    <td className="py-3 px-4">领导力/团队管理</td>
                    <td className="py-3 px-4">专业能力+管理能力</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 font-medium">职业发展</td>
                    <td className="py-3 px-4">技术专家 → 首席专家</td>
                    <td className="py-3 px-4">团队领导 → 部门经理 → 总监</td>
                    <td className="py-3 px-4">技术经理 → 技术总监 → CTO</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 font-medium">工作内容</td>
                    <td className="py-3 px-4">解决复杂技术问题，技术创新</td>
                    <td className="py-3 px-4">团队管理，战略规划，资源分配</td>
                    <td className="py-3 px-4">技术指导 + 团队管理</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 font-medium">薪资潜力</td>
                    <td className="py-3 px-4">高（技术专家薪资不低于管理层）</td>
                    <td className="py-3 px-4">高（管理层薪资普遍较高）</td>
                    <td className="py-3 px-4">高（技术+管理双重价值）</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">适合人群</td>
                    <td className="py-3 px-4">喜欢技术挑战，注重个人专业成长</td>
                    <td className="py-3 px-4">擅长人际管理，喜欢团队协作</td>
                    <td className="py-3 px-4">既喜欢技术，又具备管理能力</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* 转型建议 */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5" />
              转型建议
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-3">专家路线转型建议</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>深耕专业领域，成为该领域的权威</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>参与行业标准制定，提升影响力</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>发表专业文章，建立个人品牌</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>参与复杂项目，积累经验</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>持续学习最新技术，保持竞争力</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-3">管理路线转型建议</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>主动承担团队责任，展示领导能力</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>学习管理知识，参加领导力培训</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>建立良好的人际关系网络</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>培养战略思维，关注业务全局</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>学会授权，提升团队整体能力</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-3">混合型路线转型建议</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>保持技术敏感度，同时学习管理知识</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>在技术团队中担任领导角色</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>平衡技术工作和管理工作的时间分配</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>培养技术团队的整体能力</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>在技术决策中融入业务视角</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    resources: {
      title: '行业资源积累',
      icon: Users,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-2">行业人脉</h3>
            <p className="text-slate-700">建立和维护行业内的核心人脉网络。</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-2">知识资源</h3>
            <p className="text-slate-700">积累行业知识和专业资料，建立个人知识库。</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-2">项目经验</h3>
            <p className="text-slate-700">参与和主导重要项目，积累成功案例。</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-700 mb-2">品牌建设</h3>
            <p className="text-slate-700">通过分享和演讲，建立个人专业品牌。</p>
          </div>
        </div>
      )
    },
    side_hustle: {
      title: '副业/自由职业',
      icon: Briefcase,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-2">技能变现</h3>
            <p className="text-slate-700">将专业技能转化为副业收入。</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-2">平台选择</h3>
            <p className="text-slate-700">选择适合的自由职业平台，拓展客户资源。</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-2">时间管理</h3>
            <p className="text-slate-700">平衡主业和副业，合理安排时间。</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-700 mb-2">商业模式</h3>
            <p className="text-slate-700">设计可持续的副业商业模式，实现被动收入。</p>
          </div>
        </div>
      )
    },
    leadership: {
      title: '领导力培养',
      icon: Award,
      content: (
        <div className="space-y-6">
          {/* 领导力评估 */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              领导力评估
            </h3>
            <p className="text-slate-700 mb-4">评估您的领导力水平，了解需要提升的领域：</p>
            {(() => {

              
              const leadershipDimensions = [
                { id: 'ld1', name: '战略思维', description: '制定长期愿景和战略规划的能力' },
                { id: 'ld2', name: '团队管理', description: '建设和管理高效团队的能力' },
                { id: 'ld3', name: '沟通能力', description: '清晰传达信息和愿景的能力' },
                { id: 'ld4', name: '决策能力', description: '在复杂情况下做出明智决策的能力' },
                { id: 'ld5', name: '激励能力', description: '激励和鼓舞团队成员的能力' },
                { id: 'ld6', name: '变革管理', description: '引领和管理变革的能力' },
                { id: 'ld7', name: '冲突管理', description: '有效解决团队内部冲突的能力' },
                { id: 'ld8', name: '执行力', description: '确保战略和计划得到有效执行的能力' },
              ];
              
              const calculateAssessment = () => {
                if (Object.keys(selfAssessment).length < leadershipDimensions.length) {
                  alert('请完成所有评估项目');
                  return;
                }
                
                let totalScore = 0;
                Object.values(selfAssessment).forEach(score => {
                  totalScore += score;
                });
                
                const averageScore = Math.round(totalScore / leadershipDimensions.length);
                let resultText = '';
                
                if (averageScore >= 4.5) {
                  resultText = '您的领导力水平非常高：您具备出色的领导能力，能够有效地引领团队实现目标。';
                } else if (averageScore >= 3.5) {
                  resultText = '您的领导力水平良好：您具备基本的领导能力，但在某些领域还有提升空间。';
                } else if (averageScore >= 2.5) {
                  resultText = '您的领导力水平一般：您需要在多个领域提升您的领导能力。';
                } else {
                  resultText = '您的领导力水平有待提高：您需要系统地学习和实践领导技能。';
                }
                
                setLeadershipAssessmentResult(resultText);
              };
              
              return (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="space-y-4">
                      {leadershipDimensions.map((dimension) => (
                        <div key={dimension.id} className="space-y-2">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-slate-800">{dimension.name}</p>
                            <p className="text-xs text-slate-500">{dimension.description}</p>
                          </div>
                          <div className="flex justify-between">
                            {[1, 2, 3, 4, 5].map((option) => (
                              <button
                                key={option}
                                className={`w-10 h-10 rounded-full transition-colors ${selfAssessment[dimension.id] === option ? 'bg-blue-500 text-white' : 'bg-white border border-slate-300 hover:bg-blue-50'}`}
                                onClick={() => setSelfAssessment({...selfAssessment, [dimension.id]: option})}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>需提升</span>
                            <span>优秀</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full" onClick={calculateAssessment}>评估领导力水平</Button>
                  {leadershipAssessmentResult && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-700 mb-2">评估结果</h4>
                      <p className="text-slate-700">{leadershipAssessmentResult}</p>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
          
          {/* 领导力发展计划 */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              领导力发展计划
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-3">短期目标（1-3个月）</h4>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-purple-600" />
                    </div>
                    <span>参加领导力培训课程，学习基础领导理论</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-purple-600" />
                    </div>
                    <span>每周与团队成员进行1对1沟通，了解他们的需求和挑战</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-purple-600" />
                    </div>
                    <span>学习并实践积极倾听技巧，提高沟通效果</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-purple-600" />
                    </div>
                    <span>制定个人领导风格发展计划，明确优势和改进方向</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-3">中期目标（3-6个月）</h4>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-purple-600" />
                    </div>
                    <span>主导一个跨部门项目，锻炼团队协调和资源整合能力</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-purple-600" />
                    </div>
                    <span>学习并应用教练式领导方法，提升团队成员能力</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-purple-600" />
                    </div>
                    <span>建立团队目标设定和绩效评估体系</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-purple-600" />
                    </div>
                    <span>参与行业领导力论坛，拓展人脉和视野</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-3">长期目标（6-12个月）</h4>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-purple-600" />
                    </div>
                    <span>培养至少2-3名团队骨干，建立人才梯队</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-purple-600" />
                    </div>
                    <span>制定并实施团队文化建设计划，提升团队凝聚力</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-purple-600" />
                    </div>
                    <span>建立个人领导品牌，在行业内树立专业形象</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-purple-600" />
                    </div>
                    <span>学习并应用战略思维，参与公司高层决策</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* 领导力工具 */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              领导力工具
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-3">沟通工具</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>360度反馈：收集来自上级、同事和下属的反馈</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>一对一会议模板：结构化的1对1沟通框架</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>非暴力沟通：有效表达和倾听的技巧</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-3">团队管理工具</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>OKR：目标与关键成果法，设定和跟踪团队目标</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>团队性格测试：了解团队成员的性格特点</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>冲突解决模型：有效解决团队内部冲突</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-3">决策工具</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>SWOT分析：分析优势、劣势、机会和威胁</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>决策矩阵：系统化评估不同选项</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>情景规划：为不同情景制定应对策略</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-3">个人发展工具</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>领导力日志：记录和反思领导行为</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>导师计划：寻找和建立导师关系</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>个人品牌建设：提升专业影响力</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* 领导力案例 */}
          <div className="bg-orange-50 p-6 rounded-lg">
            <h3 className="font-semibold text-orange-700 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              领导力案例
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-3">案例：团队士气低落</h4>
                <div className="space-y-3 text-sm">
                  <p className="text-slate-700"><span className="font-medium">情境：</span>团队连续加班，项目进度滞后，团队成员士气低落，抱怨增多。</p>
                  <p className="text-slate-700"><span className="font-medium">挑战：</span>如何提升团队士气，恢复团队凝聚力，确保项目按时完成。</p>
                  <p className="text-slate-700"><span className="font-medium">解决方案：</span></p>
                  <ul className="space-y-2 text-slate-700 pl-5 list-disc">
                    <li>召开团队会议，倾听团队成员的 concerns</li>
                    <li>调整工作节奏，合理安排工作时间</li>
                    <li>设置小的阶段性目标，提供及时反馈和认可</li>
                    <li>组织团队建设活动，增强团队凝聚力</li>
                    <li>与团队成员1对1沟通，了解个人需求和职业发展目标</li>
                  </ul>
                  <p className="text-slate-700"><span className="font-medium">结果：</span>团队士气明显提升，项目进度恢复正常，团队成员满意度提高。</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-3">案例：团队冲突</h4>
                <div className="space-y-3 text-sm">
                  <p className="text-slate-700"><span className="font-medium">情境：</span>团队中两个核心成员因工作方式和观点不同产生冲突，影响团队协作。</p>
                  <p className="text-slate-700"><span className="font-medium">挑战：</span>如何化解冲突，促进团队成员之间的理解和合作。</p>
                  <p className="text-slate-700"><span className="font-medium">解决方案：</span></p>
                  <ul className="space-y-2 text-slate-700 pl-5 list-disc">
                    <li>分别与冲突双方进行1对1沟通，了解各自的观点和感受</li>
                    <li>组织三方会议，促进双方直接沟通，寻找共同点</li>
                    <li>明确团队目标和工作流程，减少误解</li>
                    <li>建立冲突解决机制，鼓励开放和建设性的沟通</li>
                    <li>关注双方的优势，合理分配任务，发挥各自特长</li>
                  </ul>
                  <p className="text-slate-700"><span className="font-medium">结果：</span>冲突得到化解，团队成员之间的关系得到改善，团队协作更加顺畅。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">职业路径规划</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-4">
            基于您的职业评估结果，为您定制专属的职业发展路径
          </p>
          
          {/* 用户信息卡片 */}
          {positionParam && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-3xl mx-auto shadow-sm">
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700 font-medium">{positionParam}</span>
                </div>
                {industryParam && (
                  <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-700 font-medium">{industryParam}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-medium">{experienceYears}年经验</span>
                </div>
                {salaryParam && (
                  <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full">
                    <DollarSign className="w-4 h-4 text-orange-600" />
                    <span className="text-orange-700 font-medium">当前薪资 {parseInt(salaryParam).toLocaleString()}元</span>
                  </div>
                )}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-white ${userGroupConfig.color}`}>
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{userGroupConfig.name}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 差异化人群专属模块 */}
        <Card className="mb-8 border-l-4 border-l-indigo-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-indigo-500" />
              专属推荐模块 - {userGroupConfig.name}
            </CardTitle>
            <CardDescription>
              根据您的工作年限，为您推荐最适合的职业发展内容
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-4 ${
              userGroupConfig.modules.length === 2 
                ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto' 
                : userGroupConfig.modules.length === 3 
                  ? 'grid-cols-1 md:grid-cols-3' 
                  : 'grid-cols-2 md:grid-cols-4'
            }`}>
              {userGroupConfig.modules.map((module) => {
                const Icon = module.icon;
                return (
                  <button
                    key={module.id}
                    className={`flex flex-col items-center p-6 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-colors group cursor-pointer ${
                      userGroupConfig.modules.length === 2 ? 'py-8' : 'p-4'
                    }`}
                    onClick={() => handleModuleClick(module.id)}
                  >
                    <div className={`bg-white rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors ${
                      userGroupConfig.modules.length === 2 ? 'w-16 h-16' : 'w-12 h-12'
                    }`}>
                      <Icon className={`text-slate-600 group-hover:text-indigo-600 ${
                        userGroupConfig.modules.length === 2 ? 'w-8 h-8' : 'w-6 h-6'
                      }`} />
                    </div>
                    <span className={`font-medium text-slate-700 group-hover:text-indigo-700 ${
                      userGroupConfig.modules.length === 2 ? 'text-base' : 'text-sm'
                    }`}>
                      {module.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 职位选择 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>目标职位选择</CardTitle>
            <CardDescription>基于您的评估结果，推荐以下职业发展路径</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择职位" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((position) => (
                  <SelectItem key={position.id} value={position.id}>
                    {position.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* 功能标签页 */}
        <div className="mb-8 border-b border-slate-200">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'paths', name: '职业路径模拟', icon: MapPin },

              { id: 'salary', name: '薪资趋势', icon: TrendingUp },
              { id: 'learning', name: '学习计划', icon: BookOpen },
              { id: 'growth', name: '成长记录', icon: LineChart },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'border-indigo-500 text-indigo-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* 职业路径模拟 */}
        {activeTab === 'paths' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-indigo-500" />
                职业路径模拟
              </h2>
              <Badge variant="outline" className="text-sm">
                基于{experienceYears}年经验定制
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {paths.map((path) => (
                <Card key={path.id} className="overflow-hidden transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{path.name}</CardTitle>
                        <CardDescription className="mt-2">{path.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
                        {path.time}年
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={getDifficultyColor(path.difficulty)}>
                        难度: {path.difficulty}
                      </Badge>
                      <Badge className={getDifficultyColor(path.cost)}>
                        成本: {path.cost}
                      </Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        薪资: {path.salaryRange}
                      </Badge>
                    </div>
                    
                    {/* 详细发展路径 */}
                    <div className="space-y-3">
                      <h3 className="font-medium text-slate-700">发展阶段</h3>
                      <div className="relative pl-6 space-y-4">
                        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-indigo-200"></div>
                        {path.steps.map((step: any, index: number) => (
                          <div key={index} className="relative">
                            <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-indigo-500 border-2 border-white"></div>
                            <div 
                              className="bg-slate-50 p-3 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors"
                              onClick={() => setSelectedStage(selectedStage === index ? null : index)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-slate-800">{step.title}</span>
                                <Badge variant="outline" className="text-xs">{step.duration}</Badge>
                              </div>
                              
                              {selectedStage === index && (
                                <div className="mt-3 space-y-2 text-sm">
                                  <div>
                                    <span className="text-slate-500">核心技能：</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {step.skills.map((skill: string, i: number) => (
                                        <span key={i} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-slate-500">关键里程碑：</span>
                                    <ul className="mt-1 space-y-1">
                                      {step.milestones.map((milestone: string, i: number) => (
                                        <li key={i} className="flex items-center gap-1 text-slate-700">
                                          <CheckCircle className="w-3 h-3 text-green-500" />
                                          {milestone}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      variant={selectedPath === path.id ? 'default' : 'outline'}
                      onClick={() => setSelectedPath(path.id === selectedPath ? '' : path.id)}
                    >
                      {selectedPath === path.id ? '已选择此路径' : '选择此路径'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}



        {/* 薪资趋势分析 */}
        {activeTab === 'salary' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-indigo-500" />
              薪资趋势预测
            </h2>
            
            <Card>
              <CardHeader>
                <CardTitle>{getPositionName(selectedPosition)} 薪资增长曲线</CardTitle>
                <CardDescription>基于您的当前薪资和行业发展趋势的预测</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-white border border-slate-200 rounded-lg p-4">
                  <div className="h-full flex flex-col">
                    <div className="flex justify-between items-end flex-1">
                      {salaryTrend.map((item, index) => {
                        const maxSalary = Math.max(...salaryTrend.map(s => s.salary));
                        const height = (item.salary / maxSalary) * 100;
                        return (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div className="relative w-12">
                              <div 
                                className="bg-indigo-500 rounded-t-md transition-all duration-500"
                                style={{ 
                                  height: `${height}%`,
                                  minHeight: '20px'
                                }}
                              ></div>
                              <div className="absolute bottom-0 left-0 right-0 bg-indigo-100 h-2 rounded-b-md"></div>
                            </div>
                            <div className="mt-2 text-center">
                              <div className="text-sm font-medium text-slate-800">
                                ¥{item.salary.toLocaleString()}
                              </div>
                              <div className="text-xs text-slate-500">
                                第{item.year}年
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 text-center text-sm text-slate-500">
                      薪资增长趋势（单位：元）
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-800 mb-2">1年后预期</h4>
                    <div className="text-2xl font-bold text-blue-600">
                      ¥{salaryTrend[0]?.salary.toLocaleString() || 0}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">涨幅约25%</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-800 mb-2">3年后预期</h4>
                    <div className="text-2xl font-bold text-purple-600">
                      ¥{salaryTrend[2]?.salary.toLocaleString() || 0}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">涨幅约95%</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-800 mb-2">5年后预期</h4>
                    <div className="text-2xl font-bold text-green-600">
                      ¥{salaryTrend[4]?.salary.toLocaleString() || 0}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">涨幅约150%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 个性化学习计划 */}
        {activeTab === 'learning' && learningPlan && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-500" />
                个性化学习计划
              </h2>
              <Badge variant="outline" className="text-sm">
                总时长: {learningPlan.totalHours}小时
              </Badge>
            </div>
            
            <div className="space-y-6">
              {learningPlan.stages.map((stage: any, stageIndex: number) => (
                <Card key={stageIndex}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-indigo-500" />
                      {stage.stage}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {stage.items.map((item: any, itemIndex: number) => (
                        <div 
                          key={itemIndex} 
                          className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium text-sm">
                            {itemIndex + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-800">{item.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {item.type}
                              </Badge>
                              <span className="text-xs text-slate-500">{item.hours}小时</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">学习建议</h3>
                    <p className="text-slate-600 text-sm mt-1">
                      建议每天投入2-3小时学习，周末可适当增加。完成每个阶段后进行实践项目，巩固所学知识。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 成长记录 */}
        {activeTab === 'growth' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
              <LineChart className="w-6 h-6 text-indigo-500" />
              成长轨迹记录
            </h2>
            
            <Card>
              <CardHeader>
                <CardTitle>技能成长曲线</CardTitle>
                <CardDescription>记录您的技能提升、项目经历和职业发展</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {growthRecords.map((record, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {record.type === 'skill' && <BookOpen className="w-5 h-5 text-indigo-600" />}
                        {record.type === 'project' && <Briefcase className="w-5 h-5 text-indigo-600" />}
                        {record.type === 'salary' && <DollarSign className="w-5 h-5 text-indigo-600" />}
                        {record.type === 'job' && <ArrowRight className="w-5 h-5 text-indigo-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-slate-800">{record.title}</h4>
                          <span className="text-sm text-slate-500">{record.date}</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{record.description}</p>
                        {record.type === 'skill' && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <Progress value={record.value} className="w-32 h-2" />
                              <span className="text-sm text-slate-600">掌握度 {record.value}%</span>
                            </div>
                          </div>
                        )}
                        {record.type === 'salary' && (
                          <div className="mt-2 text-lg font-semibold text-green-600">
                            ¥{record.value.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-indigo-600">5</div>
                  <div className="text-sm text-slate-600">技能掌握</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">3</div>
                  <div className="text-sm text-slate-600">项目经历</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600">75%</div>
                  <div className="text-sm text-slate-600">薪资涨幅</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-orange-600">1</div>
                  <div className="text-sm text-slate-600">职位变动</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* 模块详情模态框 */}
        {isModalOpen && activeModule && moduleContent[activeModule] && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      {React.createElement(moduleContent[activeModule].icon, { className: "w-5 h-5 text-indigo-600" })}
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {moduleContent[activeModule].title}
                    </h2>
                  </div>
                  <button 
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-4">
                  {moduleContent[activeModule].content}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => setIsModalOpen(false)}>
                    关闭
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
