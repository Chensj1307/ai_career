import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并Tailwind类名的工具函数
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化百分比
 */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * 风险等级颜色映射
 */
export function getRiskColor(level: number): string {
  if (level < 25) return '#22c55e'; // 绿色
  if (level < 50) return '#eab308'; // 黄色
  if (level < 75) return '#f97316'; // 橙色
  return '#ef4434'; // 红色
}

/**
 * 风险等级标签
 */
export function getRiskLabel(level: number): string {
  if (level < 25) return '安全';
  if (level < 50) return '低风险';
  if (level < 75) return '高风险';
  return '极高风险';
}

/**
 * 获取当前年份
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * 生成UUID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
