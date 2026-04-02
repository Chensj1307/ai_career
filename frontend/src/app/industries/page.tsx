'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RISK_COLORS, INDUSTRIES } from '@/types';
import TrendChart from '@/components/charts/TrendChart';
import TaskTree from '@/components/charts/TaskTree';

// 模拟行业详情数据
const mockIndustryData: Record<string, {
  name: string;
  description: string;
  totalRisk: number;
  tasks: Array<{
    id: string;
    name: string;
    risk: number;
    difficulty: 'low' | 'medium' | 'high';
    year: number;
    skills: string[];
  }>;
  trend: Array<{ year: number; risk: number }>;
}> = {
  '技术/IT': {
    name: '技术/IT',
    description: '信息技术行业包括软件开发、数据分析、系统运维等细分领域。近年来AI技术快速发展，对该行业产生了深远影响。',
    totalRisk: 78,
    tasks: [
      { id: '1', name: '后端开发', risk: 72, difficulty: 'high', year: 2028, skills: ['Java', 'Python', 'Go', '数据库'] },
      { id: '2', name: '前端开发', risk: 68, difficulty: 'medium', year: 2027, skills: ['React', 'Vue', 'TypeScript'] },
      { id: '3', name: '数据分析', risk: 82, difficulty: 'medium', year: 2026, skills: ['SQL', 'Python', '机器学习'] },
      { id: '4', name: '测试工程', risk: 75, difficulty: 'low', year: 2026, skills: ['自动化测试', 'Selenium'] },
      { id: '5', name: 'DevOps', risk: 55, difficulty: 'high', year: 2030, skills: ['K8s', 'Docker', 'CI/CD'] },
      { id: '6', name: '算法工程', risk: 45, difficulty: 'high', year: 2032, skills: ['深度学习', 'TensorFlow'] },
    ],
    trend: [
      { year: 2026, risk: 60 },
      { year: 2027, risk: 68 },
      { year: 2028, risk: 74 },
      { year: 2029, risk: 78 },
      { year: 2030, risk: 82 },
      { year: 2031, risk: 85 },
      { year: 2032, risk: 88 },
      { year: 2033, risk: 90 },
      { year: 2034, risk: 92 },
      { year: 2035, risk: 94 },
    ],
  },
  '金融': {
    name: '金融',
    description: '金融行业涵盖银行、保险、证券、投资等领域。AI在风控、客服、量化交易等方面已有广泛应用。',
    totalRisk: 72,
    tasks: [
      { id: '1', name: '会计核算', risk: 88, difficulty: 'low', year: 2026, skills: ['财务软件', 'Excel'] },
      { id: '2', name: '客户服务', risk: 80, difficulty: 'low', year: 2026, skills: ['沟通技巧', '产品知识'] },
      { id: '3', name: '风险控制', risk: 65, difficulty: 'high', year: 2028, skills: ['风控模型', '数据分析'] },
      { id: '4', name: '投资分析', risk: 58, difficulty: 'high', year: 2029, skills: ['金融模型', '量化分析'] },
      { id: '5', name: '合规审查', risk: 52, difficulty: 'medium', year: 2030, skills: ['法律法规', '合规系统'] },
    ],
    trend: [
      { year: 2026, risk: 55 },
      { year: 2027, risk: 62 },
      { year: 2028, risk: 68 },
      { year: 2029, risk: 72 },
      { year: 2030, risk: 75 },
      { year: 2031, risk: 78 },
      { year: 2032, risk: 80 },
      { year: 2033, risk: 82 },
      { year: 2034, risk: 84 },
      { year: 2035, risk: 86 },
    ],
  },
  '零售': {
    name: '零售',
    description: '零售行业包括实体店、电商平台、连锁超市等。自动化技术正在重塑整个零售业态。',
    totalRisk: 68,
    tasks: [
      { id: '1', name: '收银结算', risk: 95, difficulty: 'low', year: 2026, skills: ['收银系统'] },
      { id: '2', name: '商品导购', risk: 75, difficulty: 'low', year: 2026, skills: ['产品知识', '推销技巧'] },
      { id: '3', name: '库存管理', risk: 70, difficulty: 'low', year: 2026, skills: ['ERP系统', '库存分析'] },
      { id: '4', name: '采购谈判', risk: 45, difficulty: 'high', year: 2032, skills: ['供应链管理', '谈判技巧'] },
      { id: '5', name: '店铺管理', risk: 50, difficulty: 'medium', year: 2030, skills: ['陈列设计', '人员管理'] },
    ],
    trend: [
      { year: 2026, risk: 60 },
      { year: 2027, risk: 64 },
      { year: 2028, risk: 67 },
      { year: 2029, risk: 70 },
      { year: 2030, risk: 72 },
      { year: 2031, risk: 74 },
      { year: 2032, risk: 75 },
      { year: 2033, risk: 76 },
      { year: 2034, risk: 77 },
      { year: 2035, risk: 78 },
    ],
  },
  '制造业': {
    name: '制造业',
    description: '制造业包括汽车、电子、机械等领域。自动化和机器人技术正在改变传统制造流程。',
    totalRisk: 65,
    tasks: [
      { id: '1', name: '流水线操作', risk: 90, difficulty: 'low', year: 2026, skills: ['设备操作', '质量控制'] },
      { id: '2', name: '质检', risk: 78, difficulty: 'medium', year: 2026, skills: ['质量检测', '标准操作'] },
      { id: '3', name: '设备维护', risk: 55, difficulty: 'high', year: 2030, skills: ['设备维修', '故障诊断'] },
      { id: '4', name: '生产计划', risk: 62, difficulty: 'medium', year: 2028, skills: ['生产管理', 'ERP系统'] },
      { id: '5', name: '工艺设计', risk: 48, difficulty: 'high', year: 2031, skills: ['CAD', '工艺规划'] },
    ],
    trend: [
      { year: 2026, risk: 55 },
      { year: 2027, risk: 58 },
      { year: 2028, risk: 61 },
      { year: 2029, risk: 63 },
      { year: 2030, risk: 65 },
      { year: 2031, risk: 67 },
      { year: 2032, risk: 69 },
      { year: 2033, risk: 71 },
      { year: 2034, risk: 73 },
      { year: 2035, risk: 75 },
    ],
  },
  '医疗健康': {
    name: '医疗健康',
    description: '医疗健康行业包括医院、诊所、制药等领域。AI在诊断、药物研发等方面展现出巨大潜力。',
    totalRisk: 45,
    tasks: [
      { id: '1', name: '影像诊断', risk: 70, difficulty: 'medium', year: 2027, skills: ['医学影像', '诊断经验'] },
      { id: '2', name: '护士', risk: 35, difficulty: 'low', year: 2032, skills: ['护理技能', '患者沟通'] },
      { id: '3', name: '药剂', risk: 55, difficulty: 'medium', year: 2029, skills: ['药理学', '配药操作'] },
      { id: '4', name: '医生', risk: 30, difficulty: 'high', year: 2035, skills: ['临床经验', '诊断能力'] },
      { id: '5', name: '医疗管理', risk: 42, difficulty: 'medium', year: 2031, skills: ['医院管理', '医疗法规'] },
    ],
    trend: [
      { year: 2026, risk: 32 },
      { year: 2027, risk: 36 },
      { year: 2028, risk: 39 },
      { year: 2029, risk: 42 },
      { year: 2030, risk: 44 },
      { year: 2031, risk: 45 },
      { year: 2032, risk: 47 },
      { year: 2033, risk: 48 },
      { year: 2034, risk: 49 },
      { year: 2035, risk: 50 },
    ],
  },
  '教育': {
    name: '教育',
    description: '教育行业包括学校、培训机构、在线教育等。AI正在改变传统的教学方式和内容。',
    totalRisk: 52,
    tasks: [
      { id: '1', name: '授课', risk: 40, difficulty: 'high', year: 2030, skills: ['教学能力', '学科知识'] },
      { id: '2', name: '助教', risk: 65, difficulty: 'low', year: 2027, skills: ['辅助教学', '学生管理'] },
      { id: '3', name: '教务', risk: 58, difficulty: 'medium', year: 2028, skills: ['教务管理', '系统操作'] },
      { id: '4', name: '课程设计', risk: 45, difficulty: 'high', year: 2031, skills: ['课程开发', '教学理论'] },
      { id: '5', name: '考试评估', risk: 72, difficulty: 'medium', year: 2026, skills: ['考试管理', '评估系统'] },
    ],
    trend: [
      { year: 2026, risk: 40 },
      { year: 2027, risk: 44 },
      { year: 2028, risk: 47 },
      { year: 2029, risk: 50 },
      { year: 2030, risk: 52 },
      { year: 2031, risk: 54 },
      { year: 2032, risk: 55 },
      { year: 2033, risk: 57 },
      { year: 2034, risk: 58 },
      { year: 2035, risk: 59 },
    ],
  },
  '媒体/娱乐': {
    name: '媒体/娱乐',
    description: '媒体娱乐行业包括影视、音乐、游戏、新闻等领域。AI在内容创作和推荐方面发挥着越来越重要的作用。',
    totalRisk: 58,
    tasks: [
      { id: '1', name: '内容创作', risk: 45, difficulty: 'high', year: 2030, skills: ['创意写作', '内容策划'] },
      { id: '2', name: '编辑', risk: 70, difficulty: 'medium', year: 2027, skills: ['文字编辑', '内容审核'] },
      { id: '3', name: '运营', risk: 55, difficulty: 'medium', year: 2028, skills: ['用户运营', '数据分析'] },
      { id: '4', name: '视频制作', risk: 52, difficulty: 'medium', year: 2029, skills: ['视频剪辑', '特效制作'] },
      { id: '5', name: '记者', risk: 48, difficulty: 'high', year: 2031, skills: ['新闻采访', '写作能力'] },
    ],
    trend: [
      { year: 2026, risk: 45 },
      { year: 2027, risk: 49 },
      { year: 2028, risk: 53 },
      { year: 2029, risk: 56 },
      { year: 2030, risk: 58 },
      { year: 2031, risk: 60 },
      { year: 2032, risk: 62 },
      { year: 2033, risk: 64 },
      { year: 2034, risk: 66 },
      { year: 2035, risk: 68 },
    ],
  },
  '法律': {
    name: '法律',
    description: '法律行业包括律师事务所、企业法务、司法机构等。AI在合同审查、法律检索等方面正在发挥作用。',
    totalRisk: 48,
    tasks: [
      { id: '1', name: '法务', risk: 42, difficulty: 'high', year: 2031, skills: ['法律知识', '合同审查'] },
      { id: '2', name: '律师助理', risk: 65, difficulty: 'low', year: 2027, skills: ['文件整理', '法律检索'] },
      { id: '3', name: '律师', risk: 35, difficulty: 'high', year: 2034, skills: ['诉讼经验', '法律分析'] },
      { id: '4', name: '法律顾问', risk: 40, difficulty: 'high', year: 2032, skills: ['法律咨询', '风险评估'] },
    ],
    trend: [
      { year: 2026, risk: 36 },
      { year: 2027, risk: 39 },
      { year: 2028, risk: 42 },
      { year: 2029, risk: 44 },
      { year: 2030, risk: 46 },
      { year: 2031, risk: 48 },
      { year: 2032, risk: 50 },
      { year: 2033, risk: 51 },
      { year: 2034, risk: 52 },
      { year: 2035, risk: 53 },
    ],
  },
  '交通运输': {
    name: '交通运输',
    description: '交通运输行业包括公路、铁路、航空、物流等领域。自动驾驶和智能物流正在改变行业格局。',
    totalRisk: 62,
    tasks: [
      { id: '1', name: '驾驶', risk: 75, difficulty: 'medium', year: 2028, skills: ['驾驶技能', '交通规则'] },
      { id: '2', name: '调度', risk: 50, difficulty: 'medium', year: 2030, skills: ['调度系统', '协调能力'] },
      { id: '3', name: '物流管理', risk: 48, difficulty: 'high', year: 2031, skills: ['供应链管理', '物流规划'] },
      { id: '4', name: '仓储操作', risk: 68, difficulty: 'low', year: 2027, skills: ['仓储系统', '货物处理'] },
    ],
    trend: [
      { year: 2026, risk: 50 },
      { year: 2027, risk: 54 },
      { year: 2028, risk: 58 },
      { year: 2029, risk: 60 },
      { year: 2030, risk: 62 },
      { year: 2031, risk: 64 },
      { year: 2032, risk: 66 },
      { year: 2033, risk: 68 },
      { year: 2034, risk: 70 },
      { year: 2035, risk: 72 },
    ],
  },
  '餐饮服务': {
    name: '餐饮服务',
    description: '餐饮服务行业包括餐厅、咖啡厅、外卖等。自动化点餐和机器人服务正在逐渐普及。',
    totalRisk: 70,
    tasks: [
      { id: '1', name: '厨师', risk: 55, difficulty: 'high', year: 2030, skills: ['烹饪技能', '菜品创新'] },
      { id: '2', name: '服务员', risk: 85, difficulty: 'low', year: 2026, skills: ['服务态度', '餐桌礼仪'] },
      { id: '3', name: '外卖', risk: 90, difficulty: 'low', year: 2027, skills: ['路线规划', '时间管理'] },
      { id: '4', name: '店长', risk: 45, difficulty: 'high', year: 2032, skills: ['店铺管理', '人员培训'] },
      { id: '5', name: '收银员', risk: 88, difficulty: 'low', year: 2026, skills: ['收银系统', '现金管理'] },
    ],
    trend: [
      { year: 2026, risk: 64 },
      { year: 2027, risk: 67 },
      { year: 2028, risk: 68 },
      { year: 2029, risk: 69 },
      { year: 2030, risk: 70 },
      { year: 2031, risk: 71 },
      { year: 2032, risk: 72 },
      { year: 2033, risk: 73 },
      { year: 2034, risk: 74 },
      { year: 2035, risk: 75 },
    ],
  },
  '艺术/设计': {
    name: '艺术/设计',
    description: '艺术设计行业包括平面设计、插画、工业设计、室内设计等领域。AI在创意生成和设计辅助方面正在发挥作用。',
    totalRisk: 55,
    tasks: [
      { id: '1', name: '平面设计', risk: 72, difficulty: 'medium', year: 2027, skills: ['Photoshop', 'Illustrator', '创意设计'] },
      { id: '2', name: '插画师', risk: 65, difficulty: 'high', year: 2028, skills: ['绘画技能', '创意构思'] },
      { id: '3', name: '工业设计', risk: 58, difficulty: 'high', year: 2029, skills: ['CAD', '产品设计'] },
      { id: '4', name: '室内设计', risk: 55, difficulty: 'medium', year: 2030, skills: ['3D建模', '空间规划'] },
      { id: '5', name: '服装设计', risk: 60, difficulty: 'high', year: 2029, skills: ['设计软件', '时尚趋势'] },
    ],
    trend: [
      { year: 2026, risk: 45 },
      { year: 2027, risk: 50 },
      { year: 2028, risk: 52 },
      { year: 2029, risk: 54 },
      { year: 2030, risk: 55 },
      { year: 2031, risk: 56 },
      { year: 2032, risk: 57 },
      { year: 2033, risk: 58 },
      { year: 2034, risk: 59 },
      { year: 2035, risk: 60 },
    ],
  },
  '体育/健身': {
    name: '体育/健身',
    description: '体育健身行业包括运动员、教练、健身教练、体育管理等领域。AI在训练分析和健康监测方面正在发挥作用。',
    totalRisk: 40,
    tasks: [
      { id: '1', name: '运动员', risk: 35, difficulty: 'high', year: 2032, skills: ['专业技能', '体能训练'] },
      { id: '2', name: '教练', risk: 45, difficulty: 'high', year: 2031, skills: ['训练方法', '战术分析'] },
      { id: '3', name: '健身教练', risk: 50, difficulty: 'medium', year: 2029, skills: ['健身知识', '客户指导'] },
      { id: '4', name: '体育管理', risk: 55, difficulty: 'medium', year: 2030, skills: ['赛事组织', '人员管理'] },
      { id: '5', name: '裁判', risk: 48, difficulty: 'medium', year: 2031, skills: ['规则熟悉', '判罚能力'] },
    ],
    trend: [
      { year: 2026, risk: 30 },
      { year: 2027, risk: 32 },
      { year: 2028, risk: 34 },
      { year: 2029, risk: 36 },
      { year: 2030, risk: 38 },
      { year: 2031, risk: 39 },
      { year: 2032, risk: 40 },
      { year: 2033, risk: 41 },
      { year: 2034, risk: 42 },
      { year: 2035, risk: 43 },
    ],
  },
  '科研': {
    name: '科研',
    description: '科研行业包括自然科学、社会科学、工程研究等领域。AI在数据分析和实验设计方面正在发挥重要作用。',
    totalRisk: 35,
    tasks: [
      { id: '1', name: '自然科学研究', risk: 30, difficulty: 'high', year: 2033, skills: ['实验设计', '数据分析'] },
      { id: '2', name: '社会科学研究', risk: 32, difficulty: 'high', year: 2032, skills: ['研究方法', '统计分析'] },
      { id: '3', name: '工程研究', risk: 45, difficulty: 'high', year: 2030, skills: ['技术研发', '原型设计'] },
      { id: '4', name: '医学研究', risk: 35, difficulty: 'high', year: 2032, skills: ['临床试验', '数据处理'] },
      { id: '5', name: '农业研究', risk: 40, difficulty: 'high', year: 2031, skills: ['作物研究', '土壤分析'] },
    ],
    trend: [
      { year: 2026, risk: 25 },
      { year: 2027, risk: 28 },
      { year: 2028, risk: 30 },
      { year: 2029, risk: 32 },
      { year: 2030, risk: 33 },
      { year: 2031, risk: 34 },
      { year: 2032, risk: 35 },
      { year: 2033, risk: 36 },
      { year: 2034, risk: 37 },
      { year: 2035, risk: 38 },
    ],
  },
  '美容/时尚': {
    name: '美容/时尚',
    description: '美容时尚行业包括美容师、美发师、美甲师、时尚设计等领域。AI在个性化服务和趋势预测方面正在发挥作用。',
    totalRisk: 60,
    tasks: [
      { id: '1', name: '美容师', risk: 55, difficulty: 'medium', year: 2029, skills: ['美容技术', '产品知识'] },
      { id: '2', name: '美发师', risk: 52, difficulty: 'medium', year: 2029, skills: ['剪发技术', '造型设计'] },
      { id: '3', name: '美甲师', risk: 65, difficulty: 'low', year: 2027, skills: ['美甲技术', '色彩搭配'] },
      { id: '4', name: '化妆造型', risk: 58, difficulty: 'medium', year: 2028, skills: ['化妆技术', '时尚感'] },
      { id: '5', name: '时尚设计', risk: 50, difficulty: 'high', year: 2031, skills: ['设计软件', '趋势分析'] },
    ],
    trend: [
      { year: 2026, risk: 45 },
      { year: 2027, risk: 50 },
      { year: 2028, risk: 54 },
      { year: 2029, risk: 57 },
      { year: 2030, risk: 59 },
      { year: 2031, risk: 60 },
      { year: 2032, risk: 61 },
      { year: 2033, risk: 62 },
      { year: 2034, risk: 63 },
      { year: 2035, risk: 64 },
    ],
  },
  '创意产业': {
    name: '创意产业',
    description: '创意产业包括广告、品牌设计、内容营销、社交媒体运营等领域。AI在创意生成和内容优化方面正在发挥作用。',
    totalRisk: 52,
    tasks: [
      { id: '1', name: '广告创意', risk: 65, difficulty: 'high', year: 2028, skills: ['创意构思', '市场分析'] },
      { id: '2', name: '品牌设计', risk: 58, difficulty: 'high', year: 2029, skills: ['品牌策略', '视觉设计'] },
      { id: '3', name: '内容营销', risk: 62, difficulty: 'medium', year: 2027, skills: ['内容创作', '平台运营'] },
      { id: '4', name: '社交媒体运营', risk: 70, difficulty: 'low', year: 2026, skills: ['平台规则', '数据分析'] },
      { id: '5', name: '创意写作', risk: 45, difficulty: 'high', year: 2031, skills: ['写作技巧', '创意表达'] },
    ],
    trend: [
      { year: 2026, risk: 40 },
      { year: 2027, risk: 45 },
      { year: 2028, risk: 48 },
      { year: 2029, risk: 50 },
      { year: 2030, risk: 51 },
      { year: 2031, risk: 52 },
      { year: 2032, risk: 53 },
      { year: 2033, risk: 54 },
      { year: 2034, risk: 55 },
      { year: 2035, risk: 56 },
    ],
  },
  '环境/可持续发展': {
    name: '环境/可持续发展',
    description: '环境可持续发展行业包括环保工程、可持续发展咨询、环境监测等领域。AI在环境数据分析和预测方面正在发挥作用。',
    totalRisk: 48,
    tasks: [
      { id: '1', name: '环保工程师', risk: 55, difficulty: 'high', year: 2030, skills: ['环境工程', '污染治理'] },
      { id: '2', name: '可持续发展顾问', risk: 50, difficulty: 'high', year: 2031, skills: ['可持续发展', '政策分析'] },
      { id: '3', name: '环境监测', risk: 62, difficulty: 'medium', year: 2028, skills: ['监测设备', '数据分析'] },
      { id: '4', name: '资源管理', risk: 58, difficulty: 'medium', year: 2029, skills: ['资源规划', '可持续利用'] },
      { id: '5', name: '生态保护', risk: 45, difficulty: 'high', year: 2032, skills: ['生态知识', '保护策略'] },
    ],
    trend: [
      { year: 2026, risk: 36 },
      { year: 2027, risk: 40 },
      { year: 2028, risk: 43 },
      { year: 2029, risk: 45 },
      { year: 2030, risk: 46 },
      { year: 2031, risk: 47 },
      { year: 2032, risk: 48 },
      { year: 2033, risk: 49 },
      { year: 2034, risk: 50 },
      { year: 2035, risk: 51 },
    ],
  },
  '人力资源': {
    name: '人力资源',
    description: '人力资源行业包括招聘、培训、薪酬福利、员工关系等领域。AI在招聘筛选和人才分析方面正在发挥作用。',
    totalRisk: 65,
    tasks: [
      { id: '1', name: '招聘专员', risk: 72, difficulty: 'medium', year: 2027, skills: ['招聘渠道', '面试技巧'] },
      { id: '2', name: '培训专员', risk: 68, difficulty: 'medium', year: 2028, skills: ['培训设计', '课程开发'] },
      { id: '3', name: '薪酬福利', risk: 65, difficulty: 'medium', year: 2029, skills: ['薪酬设计', '福利管理'] },
      { id: '4', name: '员工关系', risk: 55, difficulty: 'medium', year: 2030, skills: ['沟通技巧', '冲突处理'] },
      { id: '5', name: 'HRBP', risk: 50, difficulty: 'high', year: 2031, skills: ['业务理解', '人才发展'] },
    ],
    trend: [
      { year: 2026, risk: 50 },
      { year: 2027, risk: 55 },
      { year: 2028, risk: 60 },
      { year: 2029, risk: 62 },
      { year: 2030, risk: 63 },
      { year: 2031, risk: 64 },
      { year: 2032, risk: 65 },
      { year: 2033, risk: 66 },
      { year: 2034, risk: 67 },
      { year: 2035, risk: 68 },
    ],
  },
  '市场/销售': {
    name: '市场/销售',
    description: '市场销售行业包括销售代表、市场专员、品牌经理、营销策划等领域。AI在客户分析和销售预测方面正在发挥作用。',
    totalRisk: 68,
    tasks: [
      { id: '1', name: '销售代表', risk: 75, difficulty: 'medium', year: 2027, skills: ['销售技巧', '客户开发'] },
      { id: '2', name: '市场专员', risk: 65, difficulty: 'medium', year: 2028, skills: ['市场调研', '活动策划'] },
      { id: '3', name: '品牌经理', risk: 58, difficulty: 'high', year: 2030, skills: ['品牌策略', '市场定位'] },
      { id: '4', name: '营销策划', risk: 62, difficulty: 'medium', year: 2029, skills: ['策划能力', '创意构思'] },
      { id: '5', name: '客户关系', risk: 70, difficulty: 'medium', year: 2028, skills: ['客户维护', '沟通技巧'] },
    ],
    trend: [
      { year: 2026, risk: 55 },
      { year: 2027, risk: 60 },
      { year: 2028, risk: 64 },
      { year: 2029, risk: 66 },
      { year: 2030, risk: 67 },
      { year: 2031, risk: 68 },
      { year: 2032, risk: 69 },
      { year: 2033, risk: 70 },
      { year: 2034, risk: 71 },
      { year: 2035, risk: 72 },
    ],
  },
  '物流/供应链': {
    name: '物流/供应链',
    description: '物流供应链行业包括供应链管理、物流规划、仓储管理、运输管理等领域。AI在路线优化和库存管理方面正在发挥作用。',
    totalRisk: 62,
    tasks: [
      { id: '1', name: '供应链管理', risk: 55, difficulty: 'high', year: 2030, skills: ['供应链规划', '供应商管理'] },
      { id: '2', name: '物流规划', risk: 60, difficulty: 'medium', year: 2029, skills: ['路线优化', '成本控制'] },
      { id: '3', name: '仓储管理', risk: 68, difficulty: 'medium', year: 2028, skills: ['仓储系统', '库存管理'] },
      { id: '4', name: '运输管理', risk: 72, difficulty: 'medium', year: 2027, skills: ['车队管理', '调度协调'] },
      { id: '5', name: '配送员', risk: 85, difficulty: 'low', year: 2026, skills: ['路线熟悉', '时间管理'] },
    ],
    trend: [
      { year: 2026, risk: 50 },
      { year: 2027, risk: 55 },
      { year: 2028, risk: 58 },
      { year: 2029, risk: 60 },
      { year: 2030, risk: 61 },
      { year: 2031, risk: 62 },
      { year: 2032, risk: 63 },
      { year: 2033, risk: 64 },
      { year: 2034, risk: 65 },
      { year: 2035, risk: 66 },
    ],
  },
  '信息技术服务': {
    name: '信息技术服务',
    description: '信息技术服务行业包括IT支持、技术文档、IT咨询、系统集成等领域。AI在技术支持和自动化服务方面正在发挥作用。',
    totalRisk: 75,
    tasks: [
      { id: '1', name: 'IT支持', risk: 80, difficulty: 'low', year: 2026, skills: ['故障排除', '技术支持'] },
      { id: '2', name: '技术文档', risk: 72, difficulty: 'medium', year: 2027, skills: ['文档编写', '技术理解'] },
      { id: '3', name: 'IT咨询', risk: 65, difficulty: 'high', year: 2029, skills: ['业务分析', '技术方案'] },
      { id: '4', name: '系统集成', risk: 68, difficulty: 'high', year: 2028, skills: ['系统配置', '网络知识'] },
      { id: '5', name: 'IT项目管理', risk: 60, difficulty: 'high', year: 2030, skills: ['项目管理', '团队协调'] },
    ],
    trend: [
      { year: 2026, risk: 60 },
      { year: 2027, risk: 65 },
      { year: 2028, risk: 70 },
      { year: 2029, risk: 72 },
      { year: 2030, risk: 73 },
      { year: 2031, risk: 74 },
      { year: 2032, risk: 75 },
      { year: 2033, risk: 76 },
      { year: 2034, risk: 77 },
      { year: 2035, risk: 78 },
    ],
  },
  '酒店/旅游': {
    name: '酒店/旅游',
    description: '酒店旅游行业包括酒店前台、客房服务、导游、旅游策划等领域。AI在预订系统和个性化服务方面正在发挥作用。',
    totalRisk: 72,
    tasks: [
      { id: '1', name: '酒店前台', risk: 85, difficulty: 'low', year: 2026, skills: ['客户服务', '预订系统'] },
      { id: '2', name: '客房服务', risk: 82, difficulty: 'low', year: 2027, skills: ['清洁服务', '客户需求'] },
      { id: '3', name: '导游', risk: 65, difficulty: 'medium', year: 2029, skills: ['景点知识', '讲解能力'] },
      { id: '4', name: '旅游策划', risk: 58, difficulty: 'medium', year: 2030, skills: ['行程设计', '资源协调'] },
      { id: '5', name: '酒店经理', risk: 50, difficulty: 'high', year: 2032, skills: ['酒店管理', '人员培训'] },
    ],
    trend: [
      { year: 2026, risk: 60 },
      { year: 2027, risk: 65 },
      { year: 2028, risk: 68 },
      { year: 2029, risk: 70 },
      { year: 2030, risk: 71 },
      { year: 2031, risk: 72 },
      { year: 2032, risk: 73 },
      { year: 2033, risk: 74 },
      { year: 2034, risk: 75 },
      { year: 2035, risk: 76 },
    ],
  },
  '电信/通信': {
    name: '电信/通信',
    description: '电信通信行业包括网络工程师、通信技术、客服代表、网络维护等领域。AI在网络优化和客户服务方面正在发挥作用。',
    totalRisk: 68,
    tasks: [
      { id: '1', name: '网络工程师', risk: 65, difficulty: 'high', year: 2029, skills: ['网络配置', '故障排除'] },
      { id: '2', name: '通信技术', risk: 62, difficulty: 'high', year: 2030, skills: ['通信协议', '设备维护'] },
      { id: '3', name: '客服代表', risk: 80, difficulty: 'low', year: 2026, skills: ['客户服务', '问题解决'] },
      { id: '4', name: '网络维护', risk: 70, difficulty: 'medium', year: 2028, skills: ['网络监控', '故障处理'] },
      { id: '5', name: '通信规划', risk: 55, difficulty: 'high', year: 2031, skills: ['网络规划', '资源分配'] },
    ],
    trend: [
      { year: 2026, risk: 55 },
      { year: 2027, risk: 60 },
      { year: 2028, risk: 64 },
      { year: 2029, risk: 66 },
      { year: 2030, risk: 67 },
      { year: 2031, risk: 68 },
      { year: 2032, risk: 69 },
      { year: 2033, risk: 70 },
      { year: 2034, risk: 71 },
      { year: 2035, risk: 72 },
    ],
  },
  '零售科技': {
    name: '零售科技',
    description: '零售科技行业包括电商运营、数据分析师、用户体验、数字营销等领域。AI在个性化推荐和库存管理方面正在发挥作用。',
    totalRisk: 75,
    tasks: [
      { id: '1', name: '电商运营', risk: 72, difficulty: 'medium', year: 2027, skills: ['平台运营', '活动策划'] },
      { id: '2', name: '数据分析师', risk: 68, difficulty: 'medium', year: 2028, skills: ['数据分析', '可视化'] },
      { id: '3', name: '用户体验', risk: 65, difficulty: 'medium', year: 2029, skills: ['用户研究', '界面设计'] },
      { id: '4', name: '数字营销', risk: 70, difficulty: 'medium', year: 2028, skills: ['SEO', '社交媒体'] },
      { id: '5', name: '供应链管理', risk: 62, difficulty: 'medium', year: 2030, skills: ['库存管理', '供应商协调'] },
    ],
    trend: [
      { year: 2026, risk: 65 },
      { year: 2027, risk: 70 },
      { year: 2028, risk: 72 },
      { year: 2029, risk: 73 },
      { year: 2030, risk: 74 },
      { year: 2031, risk: 75 },
      { year: 2032, risk: 76 },
      { year: 2033, risk: 77 },
      { year: 2034, risk: 78 },
      { year: 2035, risk: 79 },
    ],
  },
  '健康/养生': {
    name: '健康/养生',
    description: '健康养生行业包括健身教练、营养师、心理咨询师、瑜伽教练等领域。AI在健康监测和个性化建议方面正在发挥作用。',
    totalRisk: 45,
    tasks: [
      { id: '1', name: '健身教练', risk: 50, difficulty: 'medium', year: 2029, skills: ['健身知识', '训练计划'] },
      { id: '2', name: '营养师', risk: 45, difficulty: 'high', year: 2030, skills: ['营养学', '膳食搭配'] },
      { id: '3', name: '心理咨询师', risk: 38, difficulty: 'high', year: 2032, skills: ['心理学', '咨询技巧'] },
      { id: '4', name: '瑜伽教练', risk: 42, difficulty: 'medium', year: 2031, skills: ['瑜伽技巧', '教学能力'] },
      { id: '5', name: '健康管理', risk: 52, difficulty: 'medium', year: 2029, skills: ['健康评估', '生活指导'] },
    ],
    trend: [
      { year: 2026, risk: 32 },
      { year: 2027, risk: 35 },
      { year: 2028, risk: 38 },
      { year: 2029, risk: 40 },
      { year: 2030, risk: 42 },
      { year: 2031, risk: 43 },
      { year: 2032, risk: 44 },
      { year: 2033, risk: 45 },
      { year: 2034, risk: 46 },
      { year: 2035, risk: 47 },
    ],
  },
};

export default function IndustriesPage() {
  const searchParams = useSearchParams();
  const industryCode = searchParams.get('code') || '技术/IT';
  const [data, setData] = useState(mockIndustryData['技术/IT']);
  const [selectedYear, setSelectedYear] = useState(2026);

  useEffect(() => {
    if (mockIndustryData[industryCode]) {
      setData(mockIndustryData[industryCode]);
    } else {
      // 为新增行业创建默认数据
      setData({
        name: industryCode,
        description: `${industryCode}行业的详细信息。该行业涵盖多个细分领域，AI技术的发展正在对其产生深远影响。`,
        totalRisk: 60,
        tasks: [
          { id: '1', name: '基础岗位', risk: 75, difficulty: 'low', year: 2027, skills: ['基础技能', '行业知识'] },
          { id: '2', name: '专业岗位', risk: 55, difficulty: 'medium', year: 2029, skills: ['专业技能', '经验积累'] },
          { id: '3', name: '管理岗位', risk: 45, difficulty: 'high', year: 2031, skills: ['管理能力', '战略思维'] },
        ],
        trend: [
          { year: 2026, risk: 48 },
          { year: 2027, risk: 54 },
          { year: 2028, risk: 58 },
          { year: 2029, risk: 61 },
          { year: 2030, risk: 64 },
          { year: 2031, risk: 67 },
          { year: 2032, risk: 69 },
          { year: 2033, risk: 71 },
          { year: 2034, risk: 73 },
          { year: 2035, risk: 75 },
        ],
      });
    }
  }, [industryCode]);

  const getRiskColor = (value: number) => {
    if (value < 40) return RISK_COLORS.low;
    if (value < 60) return RISK_COLORS.medium;
    if (value < 80) return RISK_COLORS.high;
    return RISK_COLORS.critical;
  };

  const getRiskLabel = (value: number) => {
    if (value < 40) return '安全';
    if (value < 60) return '中等风险';
    if (value < 80) return '高风险';
    return '极高风险';
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'low': return '低';
      case 'medium': return '中';
      case 'high': return '高';
      default: return difficulty;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-slate-500">
          <li><Link href="/" className="hover:text-blue-600">首页</Link></li>
          <li>/</li>
          <li className="text-slate-800">{data.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8 animate-fadeIn">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{data.name}</h1>
        <p className="text-slate-600">{data.description}</p>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 text-center">
          <div className="text-sm text-slate-500 mb-2">当前风险指数</div>
          <div className="text-4xl font-bold mb-2" style={{ color: getRiskColor(data.totalRisk) }}>
            {data.totalRisk}
          </div>
          <div 
            className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: getRiskColor(data.totalRisk) }}
          >
            {getRiskLabel(data.totalRisk)}
          </div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-sm text-slate-500 mb-2">涉及任务数量</div>
          <div className="text-4xl font-bold text-slate-800 mb-2">{data.tasks.length}</div>
          <div className="text-sm text-slate-500">个细分岗位</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-sm text-slate-500 mb-2">高风险任务</div>
          <div className="text-4xl font-bold text-red-600 mb-2">
            {data.tasks.filter(t => t.risk >= 70).length}
          </div>
          <div className="text-sm text-slate-500">个需要关注</div>
        </Card>
      </div>

      {/* Trend Chart */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">📈 风险趋势预测</h2>
        <Card className="p-6">
          <TrendChart data={data.trend} />
        </Card>
      </section>

      {/* Task Breakdown */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">📋 任务风险分解</h2>
        <Card className="p-6">
          <TaskTree 
            tasks={data.tasks} 
            currentYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </Card>
      </section>

      {/* Skills Warning */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">⚠️ 需要关注的技能</h2>
        <div className="flex flex-wrap gap-3">
          {data.tasks
            .filter(t => t.risk >= 65)
            .flatMap(t => t.skills)
            .filter((v, i, a) => a.indexOf(v) === i)
            .map(skill => (
              <span 
                key={skill} 
                className="px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-200"
              >
                {skill}
              </span>
            ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center py-8">
        <Link href="/assessment">
          <div className="relative group inline-block">
            <Button 
              size="lg"
              className="h-16 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 px-8"
            >
              <span className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                🔍 获取个性化评估
              </span>
            </Button>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 blur-lg -z-10 transition-opacity duration-300"></div>
          </div>
        </Link>
      </div>
    </div>
  );
}
