import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types';
import { ERROR_MESSAGES } from './constants';

// API 客户端配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// HTTP 方法类型
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// 请求选项
interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean>;
}

// API 客户端类
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // 构建URL with query parameters
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(endpoint, this.baseUrl || window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    
    return url.toString();
  }

  // 发送请求
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', headers = {}, body, params } = options;
    
    try {
      const url = this.buildUrl(endpoint, params);
      
      const response = await fetch(url, {
        method,
        headers: {
          ...this.defaultHeaders,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include', // 包含cookies
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // 处理特定HTTP错误码
        switch (response.status) {
          case 401:
            return {
              success: false,
              error: ERROR_MESSAGES.UNAUTHORIZED,
            };
          case 403:
            return {
              success: false,
              error: ERROR_MESSAGES.FORBIDDEN,
            };
          case 404:
            return {
              success: false,
              error: ERROR_MESSAGES.NOT_FOUND,
            };
          case 422:
            return {
              success: false,
              error: errorData.message || ERROR_MESSAGES.VALIDATION_ERROR,
            };
          default:
            return {
              success: false,
              error: errorData.message || ERROR_MESSAGES.SERVER_ERROR,
            };
        }
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  }

  // GET 请求
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  // POST 请求
  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  // PUT 请求
  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  // PATCH 请求
  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body });
  }

  // DELETE 请求
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // 获取分页数据
  async getPaginated<T>(
    endpoint: string,
    pagination: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    return this.get<PaginatedResponse<T>>(endpoint, {
      page: pagination.page,
      limit: pagination.limit,
      sortBy: pagination.sortBy || '',
      sortOrder: pagination.sortOrder || 'desc',
    });
  }

  // 设置授权token
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // 移除授权token
  removeAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }
}

// 导出单例实例
export const apiClient = new ApiClient();

// 导出类供其他地方使用
export default ApiClient;
