import { apiClient } from './api-client';
import { API_ENDPOINTS } from './constants';
import type {
  CollectionTask,
  CollectionType,
  ExportRecord,
  PaginatedResponse,
  Platform,
  Product,
  Statistics,
  Subscription,
  User,
} from '@/types';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<User>(API_ENDPOINTS.auth.login, { email, password }),

  register: (email: string, password: string, name: string) =>
    apiClient.post<User>(API_ENDPOINTS.auth.register, { email, password, name }),

  logout: () => apiClient.post<null>(API_ENDPOINTS.auth.logout),

  getSession: () => apiClient.get<User>(API_ENDPOINTS.auth.session),
};

export const userApi = {
  getProfile: () => apiClient.get<User>(API_ENDPOINTS.user.profile),

  updateProfile: (data: { name?: string; avatar?: string }) =>
    apiClient.put<User>(API_ENDPOINTS.user.profile, data),

  getSubscription: () => apiClient.get<Subscription>(API_ENDPOINTS.user.subscription),

  getStatistics: () => apiClient.get<Statistics>(API_ENDPOINTS.user.statistics),

  deleteAccount: () => apiClient.post<null>('/api/user/delete'),
};

export const tasksApi = {
  list: () => apiClient.get<CollectionTask[]>(API_ENDPOINTS.tasks.list),

  create: (data: { platform: Platform; type: CollectionType; url: string }) =>
    apiClient.post<CollectionTask>(API_ENDPOINTS.tasks.create, data),

  get: (id: string) => apiClient.get<CollectionTask>(API_ENDPOINTS.tasks.get(id)),

  cancel: (id: string) => apiClient.post<CollectionTask>(API_ENDPOINTS.tasks.cancel(id)),
};

export const productsApi = {
  list: (params: {
    page?: number;
    limit?: number;
    search?: string;
    platform?: Platform;
    status?: Product['status'];
  }) =>
    apiClient.get<PaginatedResponse<Product>>(API_ENDPOINTS.products.list, {
      page: params.page || 1,
      limit: params.limit || 20,
      search: params.search || '',
      platform: params.platform || '',
      status: params.status || '',
    }),

  get: (id: string) => apiClient.get<Product>(API_ENDPOINTS.products.get(id)),

  update: (id: string, data: Partial<Product>) =>
    apiClient.patch<Product>(API_ENDPOINTS.products.update(id), data),

  delete: (id: string) => apiClient.delete<null>(API_ENDPOINTS.products.delete(id)),

  batchDelete: (productIds: string[]) =>
    apiClient.post<{ deleted: number }>(API_ENDPOINTS.products.batchDelete, { productIds }),

  batchUpdate: (input: {
    action: 'updatePrice' | 'updateCategory' | 'addTags' | 'clearTags';
    productIds: string[];
    data?: {
      priceModifier?: { type: 'increase' | 'decrease' | 'multiply' | 'set'; value: number };
      category?: string;
      tags?: string[];
    };
  }) => apiClient.post<{ updated: number }>(API_ENDPOINTS.products.batchUpdate, input),
};

export const exportApi = {
  list: () => apiClient.get<ExportRecord[]>(API_ENDPOINTS.export.list),

  create: (data: { format: 'shopify' | 'woocommerce'; productIds?: string[] }) =>
    apiClient.post<ExportRecord>(API_ENDPOINTS.export.create, data),

  download: (id: string) => {
    const url = API_ENDPOINTS.export.download(id);
    window.open(url, '_blank');
  },
};

export const systemApi = {
  getAnnouncements: () => apiClient.get<Array<{ id: string; title: string; content: string; type: string; createdAt: string }>>('/api/system/announcements'),
  getChangelog: () => apiClient.get<Array<{ id: string; version: string; title: string; description: string; changes: string[]; publishedAt: string }>>('/api/system/changelog'),
};

export type Api = {
  auth: typeof authApi;
  user: typeof userApi;
  tasks: typeof tasksApi;
  products: typeof productsApi;
  export: typeof exportApi;
  system: typeof systemApi;
};

export const api: Api = {
  auth: authApi,
  user: userApi,
  tasks: tasksApi,
  products: productsApi,
  export: exportApi,
  system: systemApi,
};
