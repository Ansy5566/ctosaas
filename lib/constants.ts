import { Platform } from '@/types';

// 平台配置
export const PLATFORM_CONFIG: Record<Platform, { 
  name: string; 
  icon: string;
  color: string;
  supportedTypes: ('single' | 'category')[];
}> = {
  shopify: {
    name: 'Shopify',
    icon: '🛍️',
    color: '#95BF47',
    supportedTypes: ['single', 'category'],
  },
  shoplazza: {
    name: 'Shoplazza',
    icon: '🏪',
    color: '#FF6B35',
    supportedTypes: ['single', 'category'],
  },
  aliexpress: {
    name: 'AliExpress',
    icon: '🛒',
    color: '#FF4747',
    supportedTypes: ['single', 'category'],
  },
  shopline: {
    name: 'ShopLine',
    icon: '🏬',
    color: '#4A90E2',
    supportedTypes: ['single', 'category'],
  },
  wordpress: {
    name: 'WordPress',
    icon: '📝',
    color: '#21759B',
    supportedTypes: ['single', 'category'],
  },
  alibaba: {
    name: '阿里巴巴国际站',
    icon: '🌐',
    color: '#FF6A00',
    supportedTypes: ['single', 'category'],
  },
  amazon: {
    name: 'Amazon',
    icon: '📦',
    color: '#FF9900',
    supportedTypes: ['single'],
  },
};

// 套餐配置
export const SUBSCRIPTION_PLANS = {
  free: {
    name: '免费版',
    price: 0,
    quota: 100,
    features: [
      '每月100个商品采集',
      '支持Shopify平台',
      '基础数据导出',
      '商品列表管理',
    ],
  },
  basic: {
    name: '基础版',
    price: 29,
    quota: 1000,
    features: [
      '每月1000个商品采集',
      '支持所有平台',
      '批量操作功能',
      '多格式导出',
      '邮件支持',
    ],
  },
  pro: {
    name: '专业版',
    price: 99,
    quota: 10000,
    features: [
      '每月10000个商品采集',
      '支持所有平台',
      '高级批量操作',
      'API访问',
      '优先技术支持',
      '数据分析报表',
    ],
  },
  enterprise: {
    name: '企业版',
    price: 299,
    quota: -1, // 无限制
    features: [
      '无限商品采集',
      '支持所有平台',
      '所有高级功能',
      'API访问',
      '专属客户经理',
      '定制化服务',
      'SLA保障',
    ],
  },
};

// 任务状态配置
export const TASK_STATUS_CONFIG = {
  pending: {
    label: '等待中',
    color: 'gray',
    icon: '⏳',
  },
  processing: {
    label: '处理中',
    color: 'blue',
    icon: '⚙️',
  },
  completed: {
    label: '已完成',
    color: 'green',
    icon: '✅',
  },
  failed: {
    label: '失败',
    color: 'red',
    icon: '❌',
  },
  cancelled: {
    label: '已取消',
    color: 'gray',
    icon: '🚫',
  },
};

// 导出格式配置
export const EXPORT_FORMATS = {
  shopify: {
    name: 'Shopify CSV',
    extension: 'csv',
    mimeType: 'text/csv',
  },
  woocommerce: {
    name: 'WooCommerce CSV',
    extension: 'csv',
    mimeType: 'text/csv',
  },
};

// 分页配置
export const PAGINATION_CONFIG = {
  defaultLimit: 20,
  maxLimit: 100,
  pageSizeOptions: [10, 20, 50, 100],
};

// API 端点
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    session: '/api/auth/session',
  },
  tasks: {
    list: '/api/tasks',
    create: '/api/tasks',
    get: (id: string) => `/api/tasks/${id}`,
    cancel: (id: string) => `/api/tasks/${id}/cancel`,
  },
  products: {
    list: '/api/products',
    get: (id: string) => `/api/products/${id}`,
    update: (id: string) => `/api/products/${id}`,
    delete: (id: string) => `/api/products/${id}`,
    batchDelete: '/api/products/batch/delete',
    batchUpdate: '/api/products/batch/update',
  },
  export: {
    create: '/api/export',
    list: '/api/export',
    download: (id: string) => `/api/export/${id}/download`,
  },
  user: {
    profile: '/api/user/profile',
    subscription: '/api/user/subscription',
    statistics: '/api/user/statistics',
  },
};

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络错误，请检查您的网络连接',
  UNAUTHORIZED: '未授权，请先登录',
  FORBIDDEN: '无权限执行此操作',
  NOT_FOUND: '资源不存在',
  VALIDATION_ERROR: '数据验证失败',
  SERVER_ERROR: '服务器错误，请稍后重试',
  QUOTA_EXCEEDED: '已达到套餐限额，请升级套餐',
  INVALID_URL: '无效的URL地址',
  UNSUPPORTED_PLATFORM: '不支持的平台',
};

// 成功消息
export const SUCCESS_MESSAGES = {
  TASK_CREATED: '采集任务已创建',
  TASK_CANCELLED: '任务已取消',
  PRODUCT_DELETED: '商品已删除',
  PRODUCTS_DELETED: '商品已批量删除',
  PRODUCT_UPDATED: '商品已更新',
  EXPORT_STARTED: '导出任务已开始',
  SETTINGS_SAVED: '设置已保存',
};
