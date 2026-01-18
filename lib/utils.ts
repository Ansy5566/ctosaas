import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind CSS class name merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 格式化日期
export function formatDate(date: Date | string, format: 'short' | 'long' | 'time' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'time') {
    return d.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

// 格式化相对时间
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 7) {
    return formatDate(d);
  }
  
  if (days > 0) {
    return `${days}天前`;
  }
  
  if (hours > 0) {
    return `${hours}小时前`;
  }
  
  if (minutes > 0) {
    return `${minutes}分钟前`;
  }
  
  return '刚刚';
}

// 格式化数字
export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// 格式化价格
export function formatPrice(price: number, currency: string = 'CNY'): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
  }).format(price);
}

// 格式化文件大小
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// 验证URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// 验证邮箱
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 生成随机ID
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// 防抖函数
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}

// 节流函数
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// 深度克隆
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  
  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as T;
  }
  
  if (obj instanceof Object) {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  
  return obj;
}

// 数组分组
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const group = String(item[key]);
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

// 休眠函数
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 重试函数
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await sleep(delay * (i + 1));
      }
    }
  }
  
  throw lastError!;
}

// 截断文本
export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - suffix.length) + suffix;
}

// 从URL提取域名
export function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

// 计算百分比
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// 获取平台从URL
export function getPlatformFromUrl(url: string): string | null {
  const domain = extractDomain(url);
  if (!domain) return null;
  
  if (domain.includes('shopify.com')) return 'shopify';
  if (domain.includes('shoplazza.com')) return 'shoplazza';
  if (domain.includes('aliexpress.com')) return 'aliexpress';
  if (domain.includes('shopline')) return 'shopline';
  if (domain.includes('alibaba.com')) return 'alibaba';
  if (domain.includes('amazon.')) return 'amazon';
  
  return null;
}

// 复制到剪贴板
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// 下载文件
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
