// AI职业罗盘 - 类型定义

// 行业类型
export interface Industry {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  children?: Industry[];
}

// 任务替代信息
export interface TaskReplacement {
  id: string;
  taskName: string;
  replacementRate: number; // 0-100, 替代率
  difficulty: 'low' | 'medium' | 'high';
  estimatedYear: number; // 预计被替代的年份
  relatedSkills: string[];
}

// 行业风险数据
export interface IndustryRisk {
  industryId: string;
  industryName: string;
  year: number;
  riskLevel: number; // 0-100
  taskCount: number;
  replacedTasks: number;
  tasks: TaskReplacement[];
}

// 学历类型
export type EducationLevel = 'high_school' | 'associate' | 'bachelor' | 'master' | 'doctor';

// 用户评估输入
export interface AssessmentInput {
  industry: string;
  position: string;
  education: EducationLevel;
  workYears: number;
  skills: string[];
}

// 评估结果
export interface AssessmentResult {
  riskIndex: number; // 0-100, 风险指数
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  taskBreakdown: TaskReplacement[];
  transitionSuggestions: TransitionSuggestion[];
  skillUpgradePath: SkillUpgrade[];
}

// 转型建议
export interface TransitionSuggestion {
  id: string;
  title: string;
  description: string;
  targetIndustry?: string;
  targetPosition?: string;
  urgency: 'low' | 'medium' | 'high';
}

// 技能升级路径
export interface SkillUpgrade {
  skill: string;
  currentLevel: number; // 0-5
  targetLevel: number; // 0-5
  priority: 'low' | 'medium' | 'high';
  learningResources: LearningResource[];
}

// 学习资源
export interface LearningResource {
  title: string;
  url: string;
  type: 'course' | 'book' | 'article' | 'project';
}

// 热力图数据
export interface HeatMapData {
  name: string;
  value: number;
  children?: HeatMapData[];
}

// 趋势图数据
export interface TrendData {
  year: number;
  industry: string;
  riskLevel: number;
}

// 筛选条件
export interface FilterOptions {
  year: number;
  education?: EducationLevel;
  industryIds?: string[];
}

// 图表颜色配置
export const RISK_COLORS = {
  low: '#22c55e',      // 绿色 - 安全
  medium: '#eab308',   // 黄色 - 中等风险
  high: '#f97316',     // 橙色 - 高风险
  critical: '#ef4444', // 红色 - 极高风险
} as const;

// 学历映射
export const EDUCATION_LABELS: Record<EducationLevel, string> = {
  high_school: '高中',
  associate: '大专',
  bachelor: '本科',
  master: '硕士',
  doctor: '博士',
};

// 行业列表（示例）
export const INDUSTRIES = [
  { id: 'tech', name: '技术/IT', code: 'tech' },
  { id: 'finance', name: '金融', code: 'finance' },
  { id: 'retail', name: '零售', code: 'retail' },
  { id: 'manufacturing', name: '制造业', code: 'manufacturing' },
  { id: 'healthcare', name: '医疗健康', code: 'healthcare' },
  { id: 'education', name: '教育', code: 'education' },
  { id: 'media', name: '媒体/娱乐', code: 'media' },
  { id: 'legal', name: '法律', code: 'legal' },
  { id: 'transportation', name: '交通运输', code: 'transportation' },
  { id: 'food', name: '餐饮服务', code: 'food' },
] as const;
