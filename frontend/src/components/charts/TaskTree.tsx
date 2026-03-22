'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RISK_COLORS } from '@/types';

interface Task {
  id: string;
  name: string;
  risk: number;
  difficulty: 'low' | 'medium' | 'high';
  year: number;
  skills: string[];
}

interface TaskTreeProps {
  tasks: Task[];
  currentYear: number;
  onYearChange: (year: number) => void;
}

export default function TaskTree({ tasks, currentYear, onYearChange }: TaskTreeProps) {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const getRiskColor = (risk: number) => {
    if (risk < 40) return RISK_COLORS.low;
    if (risk < 60) return RISK_COLORS.medium;
    if (risk < 80) return RISK_COLORS.high;
    return RISK_COLORS.critical;
  };

  const getRiskLabel = (risk: number) => {
    if (risk < 40) return '安全';
    if (risk < 60) return '中等';
    if (risk < 80) return '高风险';
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

  const getUrgencyLevel = (year: number) => {
    if (year <= currentYear) return 'critical';
    if (year <= currentYear + 2) return 'high';
    if (year <= currentYear + 5) return 'medium';
    return 'low';
  };

  // 按风险等级分组
  const criticalTasks = tasks.filter(t => t.risk >= 80);
  const highTasks = tasks.filter(t => t.risk >= 60 && t.risk < 80);
  const mediumTasks = tasks.filter(t => t.risk >= 40 && t.risk < 60);
  const lowTasks = tasks.filter(t => t.risk < 40);

  const renderTaskList = (taskList: Task[], title: string, color: string) => {
    if (taskList.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          {title}
          <span className="text-xs font-normal text-slate-500">({taskList.length}个)</span>
        </h3>
        <div className="space-y-2">
          {taskList.map(task => (
            <div
              key={task.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedTask === task.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
              onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-800">{task.name}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    预计 {task.year} 年被替代 · 替代难度{getDifficultyLabel(task.difficulty)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold" style={{ color: getRiskColor(task.risk) }}>
                    {task.risk}%
                  </div>
                  <div className="text-xs" style={{ color: getRiskColor(task.risk) }}>
                    {getRiskLabel(task.risk)}
                  </div>
                </div>
              </div>
              
              {/* 进度条 */}
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ 
                    width: `${task.risk}%`,
                    backgroundColor: getRiskColor(task.risk)
                  }}
                />
              </div>

              {/* 展开详情 */}
              {selectedTask === task.id && (
                <div className="mt-3 pt-3 border-t border-slate-200 animate-fadeIn">
                  <div className="text-xs text-slate-500 mb-2">所需技能:</div>
                  <div className="flex flex-wrap gap-1">
                    {task.skills.map(skill => (
                      <span 
                        key={skill} 
                        className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-slate-500">紧迫程度:</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      getUrgencyLevel(task.year) === 'critical' ? 'bg-red-100 text-red-700' :
                      getUrgencyLevel(task.year) === 'high' ? 'bg-orange-100 text-orange-700' :
                      getUrgencyLevel(task.year) === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {getUrgencyLevel(task.year) === 'critical' ? '紧急' :
                       getUrgencyLevel(task.year) === 'high' ? '需关注' :
                       getUrgencyLevel(task.year) === 'medium' ? '规划中' : '安全'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Year Slider */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
        <Label className="block mb-2">查看特定年份的任务状态</Label>
        <div className="flex items-center gap-4">
          <Slider
            value={[currentYear]}
            onValueChange={(vals) => onYearChange(vals[0])}
            min={2024}
            max={2035}
            step={1}
            className="flex-1"
          />
          <span className="text-lg font-semibold text-slate-700 min-w-[80px] text-center">
            {currentYear} 年
          </span>
        </div>
        <div className="text-xs text-slate-500 mt-2">
          移动滑块查看各年份的任务替代情况
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: RISK_COLORS.critical }} />
          <span>极高风险 (&gt;80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: RISK_COLORS.high }} />
          <span>高风险 (60-80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: RISK_COLORS.medium }} />
          <span>中等 (40-60%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: RISK_COLORS.low }} />
          <span>安全 (&lt;40%)</span>
        </div>
      </div>

      {/* Task Lists */}
      {renderTaskList(criticalTasks, '🚨 极高风险任务', RISK_COLORS.critical)}
      {renderTaskList(highTasks, '⚠️ 高风险任务', RISK_COLORS.high)}
      {renderTaskList(mediumTasks, '📊 中等风险任务', RISK_COLORS.medium)}
      {renderTaskList(lowTasks, '✅ 低风险任务', RISK_COLORS.low)}

      {/* Summary */}
      <div className="mt-6 p-4 bg-slate-100 rounded-lg">
        <div className="text-sm text-slate-600">
          共 <span className="font-semibold">{tasks.length}</span> 个任务，
          其中 <span className="font-semibold text-red-600">{criticalTasks.length + highTasks}</span> 个处于高风险状态
        </div>
      </div>
    </div>
  );
}
