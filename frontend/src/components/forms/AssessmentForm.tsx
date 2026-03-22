'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { EducationLevel, INDUSTRIES } from '@/types';
import { EDUCATION_LABELS } from '@/types';

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
}

// 常用技能列表
const COMMON_SKILLS = [
  '数据分析', 'Excel', 'SQL', 'Python', 'Java', 'PPT制作', 
  '文案写作', '项目管理', '市场营销', '客户服务', 
  '财务管理', '人力资源', '设计软件', '英语', '演讲汇报'
];

export default function AssessmentForm({ onSubmit, isLoading = false }: AssessmentFormProps) {
  const [formData, setFormData] = useState<AssessmentFormData>({
    industry: '',
    position: '',
    education: 'bachelor',
    workYears: 3,
    skills: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customSkill, setCustomSkill] = useState('');

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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
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

  const industries = [
    { id: 'tech', name: '技术/IT' },
    { id: 'finance', name: '金融' },
    { id: 'retail', name: '零售' },
    { id: 'manufacturing', name: '制造业' },
    { id: 'healthcare', name: '医疗健康' },
    { id: 'education', name: '教育' },
    { id: 'media', name: '媒体/娱乐' },
    { id: 'legal', name: '法律' },
    { id: 'transportation', name: '交通运输' },
    { id: 'food', name: '餐饮服务' },
    { id: 'other', name: '其他' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 行业选择 */}
      <div>
        <Label className="block mb-2">所在行业 *</Label>
        <Select
          value={formData.industry}
          onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
          className={errors.industry ? 'border-red-500' : ''}
        >
          <option value="">请选择行业</option>
          {industries.map(ind => (
            <option key={ind.id} value={ind.name}>{ind.name}</option>
          ))}
        </Select>
        {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
      </div>

      {/* 职位输入 */}
      <div>
        <Label className="block mb-2">当前职位 *</Label>
        <Input
          placeholder="例如: 数据分析师、运营专员、销售代表"
          value={formData.position}
          onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
          className={errors.position ? 'border-red-500' : ''}
        />
        {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
      </div>

      {/* 学历选择 */}
      <div>
        <Label className="block mb-2">学历层次</Label>
        <Select
          value={formData.education}
          onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value as EducationLevel }))}
        >
          {Object.entries(EDUCATION_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
        <p className="text-xs text-slate-500 mt-1">
          不同学历在相同岗位的AI替代风险可能不同
        </p>
      </div>

      {/* 工作年限 */}
      <div>
        <Label className="block mb-2">工作年限: {formData.workYears} 年</Label>
        <Slider
          value={[formData.workYears]}
          onValueChange={(vals) => setFormData(prev => ({ ...prev, workYears: vals[0] }))}
          min={0}
          max={50}
          step={1}
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>应届</span>
          <span>50年+</span>
        </div>
      </div>

      {/* 技能选择 */}
      <div>
        <Label className="block mb-2">掌握的技能 * (可多选)</Label>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-3">
          {COMMON_SKILLS.map(skill => (
            <Checkbox
              key={skill}
              id={skill}
              checked={formData.skills.includes(skill)}
              onChange={() => handleSkillToggle(skill)}
              label={skill}
            />
          ))}
        </div>
        
        {/* 自定义技能 */}
        <div className="flex gap-2">
          <Input
            placeholder="添加其他技能"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSkill())}
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={handleAddCustomSkill}>
            添加
          </Button>
        </div>
        
        {/* 已选技能 */}
        {formData.skills.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-slate-500 mb-2">已选择 {formData.skills.length} 个技能:</p>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map(skill => (
                <span 
                  key={skill} 
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleSkillToggle(skill)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
        {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
      </div>

      {/* 提交按钮 */}
      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            分析中...
          </span>
        ) : (
          '开始评估'
        )}
      </Button>

      <p className="text-xs text-center text-slate-500">
        提交即表示您同意我们使用您的信息进行分析
      </p>
    </form>
  );
}
