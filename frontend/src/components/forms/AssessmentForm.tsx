'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { EducationLevel } from '@/types';
import { EDUCATION_LABELS } from '@/types';
import { 
  Briefcase, 
  GraduationCap, 
  Clock, 
  Wrench, 
  Plus, 
  X,
  Building2,
  Sparkles,
  AlertCircle,
  DollarSign,
  MapPin,
  Target,
  Code
} from 'lucide-react';

interface AssessmentFormProps {
  onSubmit: (data: AssessmentFormData) => void;
  isLoading?: boolean;
}

interface AssessmentFormData {
  industry: string;
  position: string;
  education: EducationLevel;
  workYears: number;
  skills: string[];
  salaryRange: string;
  companySize: string;
  city: string;
  careerGoal: string;
}

// 常用技能列表
const COMMON_SKILLS = [
  // 技术技能
  '数据分析', 'Excel', 'SQL', 'Python', 'Java', 'JavaScript', 'C++', 'PHP', 'Go',
  '前端开发', '后端开发', '移动开发', '全栈开发', 'DevOps', '云服务', '数据库管理',
  '网络安全', '人工智能', '机器学习', '深度学习', '数据可视化', '算法设计',
  
  // 设计技能
  'UI设计', 'UX设计', '平面设计', '3D建模', '视频剪辑', 'Photoshop', 'Illustrator', 'Figma',
  
  // 业务技能
  '项目管理', '产品管理', '市场营销', '销售', '客户服务', '公关', '品牌管理',
  '市场调研', '内容营销', '数字营销', '社交媒体运营', 'SEO', 'SEM',
  
  // 管理技能
  '团队管理', '人员管理', '财务管理', '预算管理', '风险管理', '战略规划',
  '绩效管理', '招聘', '培训与发展', '薪酬管理',
  
  // 软技能
  '沟通能力', '团队协作', '问题解决', '批判性思维', '创新思维', '时间管理',
  '压力管理', '领导力', '决策能力', '适应性', '学习能力', '演讲汇报',
  
  // 专业技能
  '文案写作', 'PPT制作', '英语', '日语', '德语', '法语',
  '法律知识', '医学知识', '教育教学', '心理咨询', '财务分析', '审计',
  '供应链管理', '物流管理', '生产管理', '质量管理', '研发能力',
  
  // 新兴技能
  '区块链', '元宇宙', 'Web3', 'NFT', '虚拟现实', '增强现实',
  '自动化测试', '持续集成', '容器技术', '微服务架构', '大数据处理'
];

const IndustryIcon = ({ id, className = "w-8 h-8" }: { id: string; className?: string }) => {
  const iconDefs = {
    tech: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="url(#techGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M6 14H18M12 8V16" stroke="url(#techGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <defs>
          <linearGradient id="techGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1"/>
            <stop offset="100%" stopColor="#2563eb"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    finance: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 6H21M5 6V18C5 19.1 5.9 20 7 20H17C18.1 20 19 19.1 19 18V6M9 10H15M9 14H15" stroke="url(#financeGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="7" r="1.5" fill="url(#financeGrad)"/>
        <defs>
          <linearGradient id="financeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981"/>
            <stop offset="100%" stopColor="#059669"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    retail: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 6L18 6C19.1 6 20 6.9 20 8V18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18V8C4 6.9 4.9 6 6 6Z" stroke="url(#retailGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M8 12H16M10 16H14" stroke="url(#retailGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <defs>
          <linearGradient id="retailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b"/>
            <stop offset="100%" stopColor="#d97706"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    manufacturing: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 7H20V17C20 18.1 19.1 19 18 19H6C4.9 19 4 18.1 4 17V7Z" stroke="url(#manufacturingGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M8 11H10V15H8V11Z" fill="url(#manufacturingGrad)"/>
        <path d="M14 11H16V15H14V11Z" fill="url(#manufacturingGrad)"/>
        <defs>
          <linearGradient id="manufacturingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748b"/>
            <stop offset="100%" stopColor="#475569"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    healthcare: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="url(#healthcareGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M12 7V17M7 12H17" stroke="url(#healthcareGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <defs>
          <linearGradient id="healthcareGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444"/>
            <stop offset="100%" stopColor="#dc2626"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    education: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L3 7L12 11L21 7L12 3Z" stroke="url(#educationGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M21 10V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V10" stroke="url(#educationGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <defs>
          <linearGradient id="educationGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6"/>
            <stop offset="100%" stopColor="#7c3aed"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    media: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="url(#mediaGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M9 8L16 12L9 16V8Z" fill="url(#mediaGrad)"/>
        <defs>
          <linearGradient id="mediaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899"/>
            <stop offset="100%" stopColor="#db2777"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    legal: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L5 7V12C5 15.87 8.13 19 12 19C15.87 19 19 15.87 19 12V7L12 3Z" stroke="url(#legalGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M10 12H14" stroke="url(#legalGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <defs>
          <linearGradient id="legalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1"/>
            <stop offset="100%" stopColor="#4f46e5"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    transportation: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 11H19V17C19 18.1 18.1 19 17 19H7C5.9 19 5 18.1 5 17V11Z" stroke="url(#transportGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M8 8H16L18 11H6L8 8Z" stroke="url(#transportGrad)" strokeWidth="1.5" fill="white"/>
        <circle cx="8" cy="19" r="1" fill="url(#transportGrad)"/>
        <circle cx="16" cy="19" r="1" fill="url(#transportGrad)"/>
        <defs>
          <linearGradient id="transportGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316"/>
            <stop offset="100%" stopColor="#ea580c"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    food: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="url(#foodGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M8 12L12 8L16 12L12 16L8 12Z" stroke="url(#foodGrad)" strokeWidth="1.5" fill="white"/>
        <defs>
          <linearGradient id="foodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6"/>
            <stop offset="100%" stopColor="#0d9488"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    other: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="url(#otherGrad)" strokeWidth="1.5" fill="white"/>
        <circle cx="12" cy="10" r="2" fill="url(#otherGrad)"/>
        <path d="M12 14V16" stroke="url(#otherGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <defs>
          <linearGradient id="otherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8"/>
            <stop offset="100%" stopColor="#64748b"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    construction: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 21H21M5 21V10L12 5L19 10V21M9 21V15H15V21" stroke="url(#constructionGrad)" strokeWidth="1.5" fill="white"/>
        <defs>
          <linearGradient id="constructionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b"/>
            <stop offset="100%" stopColor="#b45309"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    agriculture: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 22H22L12 2Z" stroke="url(#agricultureGrad)" strokeWidth="1.5" fill="white"/>
        <circle cx="12" cy="14" r="2" fill="url(#agricultureGrad)"/>
        <defs>
          <linearGradient id="agricultureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e"/>
            <stop offset="100%" stopColor="#16a34a"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    energy: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="url(#energyGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M13 7L10 12H14L11 17" stroke="url(#energyGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
          <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eab308"/>
            <stop offset="100%" stopColor="#ca8a04"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    consulting: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="url(#consultingGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M12 8V12L15 15" stroke="url(#consultingGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <defs>
          <linearGradient id="consultingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4"/>
            <stop offset="100%" stopColor="#0891b2"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    publicservice: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#publicGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M2 17L12 22L22 17" stroke="url(#publicGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M2 12L12 17L22 12" stroke="url(#publicGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <defs>
          <linearGradient id="publicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6"/>
            <stop offset="100%" stopColor="#2563eb"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    art: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="url(#artGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M8 15C8 15 9.5 13 12 13C14.5 13 16 15 16 15" stroke="url(#artGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="9" cy="10" r="1" fill="url(#artGrad)"/>
        <circle cx="15" cy="10" r="1" fill="url(#artGrad)"/>
        <defs>
          <linearGradient id="artGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d946ef"/>
            <stop offset="100%" stopColor="#c026d3"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    sports: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="url(#sportsGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M12 7V17M7 12H17" stroke="url(#sportsGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="3" stroke="url(#sportsGrad)" strokeWidth="1.5"/>
        <defs>
          <linearGradient id="sportsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316"/>
            <stop offset="100%" stopColor="#ea580c"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    research: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="7" stroke="url(#researchGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M20 20L16 16" stroke="url(#researchGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M11 8V14M8 11H14" stroke="url(#researchGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <defs>
          <linearGradient id="researchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1"/>
            <stop offset="100%" stopColor="#4f46e5"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    beauty: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12" stroke="url(#beautyGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M12 6V12L16 16" stroke="url(#beautyGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <defs>
          <linearGradient id="beautyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899"/>
            <stop offset="100%" stopColor="#db2777"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    creative: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z" stroke="url(#creativeGrad)" strokeWidth="1.5" fill="white"/>
        <defs>
          <linearGradient id="creativeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b"/>
            <stop offset="100%" stopColor="#d97706"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    environment: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C12 22 20 16 20 10C20 5 16 2 12 2C8 2 4 5 4 10C4 16 12 22 12 22Z" stroke="url(#environmentGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M12 6V14M12 14L9 11M12 14L15 11" stroke="url(#environmentGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
          <linearGradient id="environmentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e"/>
            <stop offset="100%" stopColor="#16a34a"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    hr: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" stroke="url(#hrGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" stroke="url(#hrGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <defs>
          <linearGradient id="hrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6"/>
            <stop offset="100%" stopColor="#7c3aed"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    marketing: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3V21H21" stroke="url(#marketingGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M18 17V9M13 17V5M8 17V13" stroke="url(#marketingGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <defs>
          <linearGradient id="marketingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316"/>
            <stop offset="100%" stopColor="#ea580c"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    logistics: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="8" width="20" height="12" rx="2" stroke="url(#logisticsGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M6 8V5C6 3 8 2 12 2C16 2 18 3 18 5V8" stroke="url(#logisticsGrad)" strokeWidth="1.5"/>
        <circle cx="12" cy="14" r="2" stroke="url(#logisticsGrad)" strokeWidth="1.5"/>
        <defs>
          <linearGradient id="logisticsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4"/>
            <stop offset="100%" stopColor="#0891b2"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    itservice: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="12" rx="2" stroke="url(#itserviceGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M8 20H16M12 16V20" stroke="url(#itserviceGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="10" r="2" stroke="url(#itserviceGrad)" strokeWidth="1.5"/>
        <defs>
          <linearGradient id="itserviceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6"/>
            <stop offset="100%" stopColor="#2563eb"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    hospitality: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 21H21M5 21V10L12 5L19 10V21" stroke="url(#hospitalityGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M9 21V15H15V21" stroke="url(#hospitalityGrad)" strokeWidth="1.5"/>
        <defs>
          <linearGradient id="hospitalityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6"/>
            <stop offset="100%" stopColor="#0d9488"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    telecom: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12C5 8 8 5 12 5C16 5 19 8 19 12" stroke="url(#telecomGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M2 12C2 6 6 2 12 2C18 2 22 6 22 12" stroke="url(#telecomGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="2" fill="url(#telecomGrad)"/>
        <path d="M12 14V22" stroke="url(#telecomGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <defs>
          <linearGradient id="telecomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1"/>
            <stop offset="100%" stopColor="#4f46e5"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    retailtech: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="url(#retailtechGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M3 10H21" stroke="url(#retailtechGrad)" strokeWidth="1.5"/>
        <path d="M8 14H10M14 14H16M8 18H10M14 18H16" stroke="url(#retailtechGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <defs>
          <linearGradient id="retailtechGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899"/>
            <stop offset="100%" stopColor="#db2777"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    wellness: (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="url(#wellnessGrad)" strokeWidth="1.5" fill="white"/>
        <path d="M12 7C12 7 15 10 15 13C15 15.5 13.5 17 12 17C10.5 17 9 15.5 9 13C9 10 12 7 12 7Z" stroke="url(#wellnessGrad)" strokeWidth="1.5" fill="white"/>
        <defs>
          <linearGradient id="wellnessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e"/>
            <stop offset="100%" stopColor="#16a34a"/>
          </linearGradient>
        </defs>
      </svg>
    )
  };
  
  return iconDefs[id as keyof typeof iconDefs] || iconDefs.other;
};

// 行业数据 - 与首页保持一致
const industries = [
  { id: 'tech', name: '技术/IT', risk: 'high' },
  { id: 'finance', name: '金融', risk: 'high' },
  { id: 'retail', name: '零售', risk: 'medium' },
  { id: 'manufacturing', name: '制造业', risk: 'high' },
  { id: 'healthcare', name: '医疗健康', risk: 'low' },
  { id: 'education', name: '教育', risk: 'medium' },
  { id: 'media', name: '媒体/娱乐', risk: 'medium' },
  { id: 'legal', name: '法律', risk: 'low' },
  { id: 'transportation', name: '交通运输', risk: 'high' },
  { id: 'food', name: '餐饮服务', risk: 'high' },
  { id: 'construction', name: '建筑/房地产', risk: 'medium' },
  { id: 'agriculture', name: '农业', risk: 'low' },
  { id: 'energy', name: '能源', risk: 'medium' },
  { id: 'consulting', name: '咨询', risk: 'medium' },
  { id: 'publicservice', name: '公共服务', risk: 'low' },
  { id: 'art', name: '艺术/设计', risk: 'medium' },
  { id: 'sports', name: '体育/健身', risk: 'low' },
  { id: 'research', name: '科研', risk: 'low' },
  { id: 'beauty', name: '美容/时尚', risk: 'medium' },
  { id: 'creative', name: '创意产业', risk: 'medium' },
  { id: 'environment', name: '环境/可持续发展', risk: 'low' },
  { id: 'hr', name: '人力资源', risk: 'high' },
  { id: 'marketing', name: '市场/销售', risk: 'high' },
  { id: 'logistics', name: '物流/供应链', risk: 'high' },
  { id: 'itservice', name: '信息技术服务', risk: 'high' },
  { id: 'hospitality', name: '酒店/旅游', risk: 'high' },
  { id: 'telecom', name: '电信/通信', risk: 'high' },
  { id: 'retailtech', name: '零售科技', risk: 'high' },
  { id: 'wellness', name: '健康/养生', risk: 'low' },
];

// 风险等级颜色
const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'high': return 'text-red-500 bg-red-50 border-red-200';
    case 'medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
    case 'low': return 'text-green-500 bg-green-50 border-green-200';
    default: return 'text-gray-500 bg-gray-50 border-gray-200';
  }
};

// 风险等级标签
const getRiskLabel = (risk: string) => {
  switch (risk) {
    case 'high': return '高风险';
    case 'medium': return '中风险';
    case 'low': return '低风险';
    default: return '未知';
  }
};

export default function AssessmentForm({ onSubmit, isLoading = false }: AssessmentFormProps) {
  const [formData, setFormData] = useState<AssessmentFormData>({
    industry: '',
    position: '',
    education: 'bachelor',
    workYears: 3,
    skills: [],
    salaryRange: '',
    companySize: '',
    city: '',
    careerGoal: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customSkill, setCustomSkill] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.industry) {
      newErrors.industry = '请选择所在行业';
    }
    if (!formData.position) {
      newErrors.position = '请输入当前职位';
    }
    if (formData.workYears < 0 || formData.workYears > 50) {
      newErrors.workYears = '工作年限应在0-50年之间';
    }
    if (formData.skills.length === 0) {
      newErrors.skills = '请至少选择一个技能';
    }
    if (formData.salaryRange === '' || formData.salaryRange === 'placeholder') {
      newErrors.salaryRange = '请选择薪资范围';
    }
    if (formData.companySize === '' || formData.companySize === 'placeholder') {
      newErrors.companySize = '请选择公司规模';
    }
    if (!formData.city) {
      newErrors.city = '请输入所在城市';
    }
    if (formData.careerGoal === '' || formData.careerGoal === 'placeholder') {
      newErrors.careerGoal = '请选择职业目标';
    }
    
    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const scrollToFirstError = (errorObj: Record<string, string>) => {
    // 定义字段的顺序
    const fieldOrder = ['industry', 'position', 'education', 'workYears', 'salaryRange', 'companySize', 'city', 'careerGoal', 'skills'];
    
    // 找到第一个有错误的字段
    for (const field of fieldOrder) {
      if (errorObj[field]) {
        const element = document.getElementById(`field-${field}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // 添加高亮效果
          element.classList.add('ring-2', 'ring-red-500', 'ring-offset-2');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2');
          }, 2000);
        }
        break;
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = validate();
    if (validationResult.isValid) {
      onSubmit(formData);
    } else {
      // 验证失败，滚动到第一个错误字段
      setTimeout(() => {
        scrollToFirstError(validationResult.errors);
      }, 100);
    }
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, customSkill.trim()]
      }));
      setCustomSkill('');
    }
  };

  const selectedIndustry = industries.find(ind => ind.name === formData.industry);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 进度指示器 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">填写进度</span>
          <span className="text-sm text-slate-500">
            {[formData.industry, formData.position, formData.education, formData.workYears > 0, formData.skills.length > 0, formData.salaryRange, formData.companySize, formData.city, formData.careerGoal].filter(Boolean).length}/9
          </span>
        </div>
        <Progress 
          value={[formData.industry, formData.position, formData.education, formData.workYears > 0, formData.skills.length > 0, formData.salaryRange, formData.companySize, formData.city, formData.careerGoal].filter(Boolean).length * (100/9)} 
          className="h-2"
        />
      </div>

      {/* 步骤1: 基本信息 */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">基本信息</h3>
        </div>

        {/* 行业选择 - 使用卡片式布局 */}
        <div id="field-industry">
          <Label className="block mb-3 text-sm font-medium">
            所在行业 <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {industries.map((ind) => (
              <button
                key={ind.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, industry: ind.name }))}
                className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                  formData.industry === ind.name
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <IndustryIcon id={ind.id} className="w-10 h-10" />
                <div className="font-medium text-sm text-slate-800">{ind.name}</div>
                <Badge 
                  variant="outline" 
                  className={`mt-2 text-xs ${getRiskColor(ind.risk)}`}
                >
                  {getRiskLabel(ind.risk)}
                </Badge>
                {formData.industry === ind.name && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
          {errors.industry && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.industry}
            </p>
          )}
        </div>

        {/* 职位输入 */}
        <div className="space-y-4" id="field-position">
          {/* 当前职位 - 更醒目的设计 */}
          <div className="relative group">
            <Label className="block mb-3 text-base font-semibold text-slate-800">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span>当前职位</span>
                <span className="text-red-500">*</span>
                <span className="text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">重要</span>
              </div>
            </Label>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 blur-lg -z-10 transition-opacity duration-300"></div>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
                <Input
                  placeholder="例如: 行政助理、人力资源专员、市场专员、财务助理、数据分析师、产品经理"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className={`pl-14 pr-4 py-4 text-lg border-2 ${errors.position ? 'border-red-500' : 'border-slate-200 hover:border-blue-400'} rounded-xl shadow-sm hover:shadow-md transition-all duration-300`}
                />
              </div>
              {errors.position && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.position}
                </p>
              )}
              <p className="text-sm text-slate-500 mt-2">
                请准确填写您的当前职位，这将直接影响评估结果的准确性
              </p>
            </div>
          </div>

          {/* 学历层次 */}
          <div id="field-education">
            <Label className="block mb-2 text-sm font-medium">学历层次</Label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
              <Select
                value={formData.education}
                onValueChange={(value) => setFormData(prev => ({ ...prev, education: value as EducationLevel }))}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="请选择学历" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  {Object.entries(EDUCATION_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              不同学历在相同岗位的AI替代风险可能不同
            </p>
          </div>

          {/* 工作年限 */}
          <div id="field-workYears">
            <Label className="block mb-3 text-sm font-medium">
              <Clock className="inline w-4 h-4 mr-1" />
              工作年限: <span className="text-blue-600 font-bold">{formData.workYears}</span> 年
            </Label>
            <Slider
              value={[formData.workYears]}
              onValueChange={(vals) => setFormData(prev => ({ ...prev, workYears: vals[0] }))}
              min={0}
              max={50}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>应届生</span>
              <span>5年</span>
              <span>10年</span>
              <span>20年</span>
              <span>30年+</span>
            </div>
          </div>
        </div>



        {/* 新增字段 */}
        <div className="space-y-4">
          {/* 薪资范围 */}
          <div id="field-salaryRange">
            <Label className="block mb-2 text-sm font-medium">
              薪资范围
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Select
                value={formData.salaryRange}
                onValueChange={(value) => setFormData(prev => ({ ...prev, salaryRange: value }))}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="请选择薪资范围" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder">请选择</SelectItem>
                  <SelectItem value="5k以下">5k以下</SelectItem>
                  <SelectItem value="5k-8k">5k-8k</SelectItem>
                  <SelectItem value="8k-12k">8k-12k</SelectItem>
                  <SelectItem value="12k-18k">12k-18k</SelectItem>
                  <SelectItem value="18k-25k">18k-25k</SelectItem>
                  <SelectItem value="25k以上">25k以上</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 公司规模 */}
          <div id="field-companySize">
            <Label className="block mb-2 text-sm font-medium">
              公司规模
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Select
                value={formData.companySize}
                onValueChange={(value) => setFormData(prev => ({ ...prev, companySize: value }))}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="请选择公司规模" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder">请选择</SelectItem>
                  <SelectItem value="100人以下">100人以下</SelectItem>
                  <SelectItem value="100-500人">100-500人</SelectItem>
                  <SelectItem value="500-1000人">500-1000人</SelectItem>
                  <SelectItem value="1000-5000人">1000-5000人</SelectItem>
                  <SelectItem value="5000人以上">5000人以上</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 所在城市 */}
          <div id="field-city">
            <Label className="block mb-2 text-sm font-medium">
              所在城市
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="例如: 北京"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          {/* 职业目标 */}
          <div id="field-careerGoal">
            <Label className="block mb-2 text-sm font-medium">
              职业目标
            </Label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Select
                value={formData.careerGoal}
                onValueChange={(value) => setFormData(prev => ({ ...prev, careerGoal: value }))}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="请选择职业目标" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder">请选择</SelectItem>
                  <SelectItem value="技术专家">技术专家</SelectItem>
                  <SelectItem value="管理岗位">管理岗位</SelectItem>
                  <SelectItem value="创业">创业</SelectItem>
                  <SelectItem value="转行">转行</SelectItem>
                  <SelectItem value="稳定发展">稳定发展</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>


      </div>

      {/* 步骤2: 技能评估 */}
      <div className="space-y-6 pt-4 border-t border-slate-100" id="field-skills">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <Wrench className="w-4 h-4 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">技能评估</h3>
          <Badge variant="secondary" className="ml-2">
            {formData.skills.length} 个技能
          </Badge>
        </div>

        {/* 技能选择 */}
        <div>
          <Label className="block mb-3 text-sm font-medium">
            掌握的技能 <span className="text-red-500">*</span> (可多选)
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {COMMON_SKILLS.map(skill => {
              const isSelected = formData.skills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all w-full text-left ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'
                  }`}
                  onClick={() => handleSkillToggle(skill)}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    isSelected ? 'border-purple-500 bg-purple-500' : 'border-slate-300'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm flex-1">{skill}</span>
                </button>
              );
            })}
          </div>
          
          {/* 自定义技能 */}
          <div className="flex gap-2 mt-4">
            <div className="relative flex-1">
              <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="添加其他技能 (按回车添加)"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSkill())}
                className="pl-10"
              />
            </div>
            <Button type="button" variant="outline" onClick={handleAddCustomSkill}>
              添加
            </Button>
          </div>
          
          {/* 已选技能 */}
          {formData.skills.length > 0 && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-600 mb-3 font-medium">已选择的技能:</p>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map(skill => (
                  <Badge 
                    key={skill} 
                    variant="secondary"
                    className="px-3 py-1 text-sm flex items-center gap-1 bg-white border"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className="ml-1 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {errors.skills && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.skills}
            </p>
          )}
        </div>
      </div>

      {/* 信息提示 */}
      {selectedIndustry && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900">行业提示</p>
              <p className="text-sm text-amber-800 mt-1">
                {selectedIndustry.name} 属于{getRiskLabel(selectedIndustry.risk)}行业，
                建议重点关注技能升级和转型规划。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 提交按钮 */}
      <div className="pt-6 border-t border-slate-100">
        <div className="relative group">
          <Button 
            type="submit" 
            className="w-full h-16 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                AI分析中...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <Sparkles className="w-6 h-6" />
                🔍 开始职业风险评估
              </span>
            )}
          </Button>
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 blur-lg -z-10 transition-opacity duration-300"></div>
        </div>

        <p className="text-xs text-center text-slate-500 mt-3">
          提交即表示您同意我们使用您的信息进行分析 · 评估结果仅供参考
        </p>
      </div>
    </form>
  );
}