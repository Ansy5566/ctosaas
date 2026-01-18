// 平台类型
export type Platform = 
  | 'shopify' 
  | 'shoplazza' 
  | 'aliexpress' 
  | 'shopline' 
  | 'wordpress' 
  | 'alibaba' 
  | 'amazon';

// 采集类型
export type CollectionType = 'single' | 'category';

// 任务状态
export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

// 用户信息
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription?: Subscription;
  createdAt: Date;
  updatedAt: Date;
}

// 订阅套餐
export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  quota: {
    total: number;
    used: number;
  };
  features: string[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

// 采集任务
export interface CollectionTask {
  id: string;
  userId: string;
  platform: Platform;
  type: CollectionType;
  url: string;
  status: TaskStatus;
  progress: number;
  totalProducts: number;
  collectedProducts: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// 商品变体
export interface ProductVariant {
  id: string;
  productId: string;
  sku?: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  inventoryQuantity?: number;
  weight?: number;
  weightUnit?: string;
  options: {
    name: string;
    value: string;
  }[];
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 商品
export interface Product {
  id: string;
  userId: string;
  taskId: string;
  platform: Platform;
  handle: string;
  title: string;
  description?: string;
  vendor?: string;
  productType?: string;
  tags: string[];
  images: string[];
  variants: ProductVariant[];
  options: {
    name: string;
    values: string[];
  }[];
  status: 'draft' | 'active' | 'archived';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 导出记录
export interface ExportRecord {
  id: string;
  userId: string;
  format: 'shopify' | 'woocommerce';
  productIds: string[];
  fileUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}

// 批量操作
export interface BatchOperation {
  action: 'delete' | 'updatePrice' | 'updateCategory' | 'addTags' | 'clearTags';
  productIds: string[];
  data?: {
    price?: number;
    priceModifier?: {
      type: 'increase' | 'decrease' | 'multiply' | 'set';
      value: number;
    };
    category?: string;
    tags?: string[];
  };
}

// 统计数据
export interface Statistics {
  totalProducts: number;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  productsByPlatform: Record<Platform, number>;
  recentTasks: CollectionTask[];
}

// API 响应
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页参数
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 筛选参数
export interface ProductFilters {
  platform?: Platform;
  search?: string;
  tags?: string[];
  status?: Product['status'];
  dateFrom?: Date;
  dateTo?: Date;
}
