import axios from 'axios';
import type {
  Industry,
  IndustryRisk,
  AssessmentInput,
  AssessmentResult,
  TrendData,
  HeatMapData,
  EducationLevel,
} from '@/types';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

/**
 * 获取行业列表
 */
export async function getIndustries(): Promise<Industry[]> {
  const response = await api.get('/industries');
  return response.data;
}

/**
 * 获取行业风险数据
 */
export async function getIndustryRisk(
  industryId: string,
  year: number,
  education?: EducationLevel
): Promise<IndustryRisk> {
  const params = new URLSearchParams();
  params.append('year', year.toString());
  if (education) {
    params.append('education', education);
  }
  
  const response = await api.get(`/industries/${industryId}/risk?${params}`);
  return response.data;
}

/**
 * 获取所有行业风险热力图数据
 */
export async function getHeatMapData(
  year: number,
  education?: EducationLevel
): Promise<HeatMapData[]> {
  const params = new URLSearchParams();
  params.append('year', year.toString());
  if (education) {
    params.append('education', education);
  }
  
  const response = await api.get(`/heatmap?${params}`);
  return response.data;
}

/**
 * 获取趋势数据
 */
export async function getTrendData(
  industryIds: string[],
  startYear: number,
  endYear: number,
  education?: EducationLevel
): Promise<TrendData[]> {
  const params = new URLSearchParams();
  params.append('industries', industryIds.join(','));
  params.append('startYear', startYear.toString());
  params.append('endYear', endYear.toString());
  if (education) {
    params.append('education', education);
  }
  
  const response = await api.get(`/trends?${params}`);
  return response.data;
}

/**
 * 提交评估申请
 */
export async function submitAssessment(
  input: AssessmentInput
): Promise<AssessmentResult> {
  const response = await api.post('/assessment', input);
  return response.data;
}

/**
 * 搜索职位
 */
export async function searchPositions(
  query: string,
  industry?: string
): Promise<string[]> {
  const params = new URLSearchParams();
  params.append('q', query);
  if (industry) {
    params.append('industry', industry);
  }
  
  const response = await api.get(`/positions/search?${params}`);
  return response.data;
}

/**
 * 获取技能列表
 */
export async function getSkills(industry?: string): Promise<string[]> {
  const params = industry ? `?industry=${industry}` : '';
  const response = await api.get(`/skills${params}`);
  return response.data;
}

export default api;
