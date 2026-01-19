import 'server-only';

import crypto from 'crypto';
import { SUBSCRIPTION_PLANS } from '@/lib/constants';
import type {
  CollectionTask,
  CollectionType,
  ExportRecord,
  Platform,
  Product,
  ProductVariant,
  Statistics,
  Subscription,
  TaskStatus,
  User,
} from '@/types';

type ISODateString = string;

type InternalUser = Omit<User, 'createdAt' | 'updatedAt' | 'subscription'> & {
  createdAt: ISODateString;
  updatedAt: ISODateString;
  passwordHash: string;
};

type InternalSubscription = Omit<Subscription, 'startDate' | 'endDate'> & {
  startDate: ISODateString;
  endDate: ISODateString;
};

type InternalTask = Omit<CollectionTask, 'createdAt' | 'updatedAt' | 'completedAt'> & {
  createdAt: ISODateString;
  updatedAt: ISODateString;
  completedAt?: ISODateString;
};

type InternalVariant = Omit<ProductVariant, 'createdAt' | 'updatedAt'> & {
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

type InternalProduct = Omit<Product, 'createdAt' | 'updatedAt' | 'publishedAt' | 'variants'> & {
  createdAt: ISODateString;
  updatedAt: ISODateString;
  publishedAt?: ISODateString;
  variants: InternalVariant[];
};

type InternalExport = Omit<ExportRecord, 'createdAt' | 'completedAt'> & {
  createdAt: ISODateString;
  completedAt?: ISODateString;
  fileName: string;
  csvContent?: string;
};

interface Session {
  id: string;
  userId: string;
  createdAt: ISODateString;
  expiresAt: ISODateString;
}

interface PasswordResetToken {
  token: string;
  userId: string;
  expiresAt: ISODateString;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success';
  createdAt: ISODateString;
}

export interface ChangelogItem {
  id: string;
  version: string;
  title: string;
  description: string;
  changes: string[];
  publishedAt: ISODateString;
}

interface Store {
  users: Map<string, InternalUser>;
  usersByEmail: Map<string, string>;
  subscriptionsByUserId: Map<string, InternalSubscription>;
  sessions: Map<string, Session>;
  passwordResets: Map<string, PasswordResetToken>;

  tasks: Map<string, InternalTask>;
  products: Map<string, InternalProduct>;
  exports: Map<string, InternalExport>;

  announcements: AnnouncementItem[];
  changelog: ChangelogItem[];
}

const globalForStore = globalThis as unknown as { __pcStore?: Store };

function nowIso(): ISODateString {
  return new Date().toISOString();
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, hash: string): boolean {
  const [salt, derived] = hash.split(':');
  if (!salt || !derived) return false;
  const check = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(check, 'hex'), Buffer.from(derived, 'hex'));
}

function ensureStore(): Store {
  if (globalForStore.__pcStore) return globalForStore.__pcStore;

  const store: Store = {
    users: new Map(),
    usersByEmail: new Map(),
    subscriptionsByUserId: new Map(),
    sessions: new Map(),
    passwordResets: new Map(),

    tasks: new Map(),
    products: new Map(),
    exports: new Map(),

    announcements: [
      {
        id: generateId('ann'),
        title: '欢迎使用商品采集SaaS平台',
        content: '当前为演示版本，采集将生成示例商品数据，用于打通前后台交互。',
        type: 'info',
        createdAt: nowIso(),
      },
    ],
    changelog: [
      {
        id: generateId('log'),
        version: '0.1.0',
        title: '初始版本上线',
        description: '完成核心页面与API打通（认证/任务/商品/导出/设置）。',
        changes: ['新增认证API', '新增采集任务API', '新增商品管理API', '新增导出API'],
        publishedAt: nowIso(),
      },
    ],
  };

  globalForStore.__pcStore = store;
  return store;
}

function sanitizeUser(user: InternalUser, subscription?: InternalSubscription): User {
  const base: User = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  };

  if (subscription) {
    base.subscription = {
      ...subscription,
      startDate: new Date(subscription.startDate),
      endDate: new Date(subscription.endDate),
    };
  }

  return base;
}

export function authCreateUser(input: {
  email: string;
  password: string;
  name: string;
}): User {
  const store = ensureStore();
  const email = normalizeEmail(input.email);

  if (!email || !input.password || !input.name) {
    throw new Error('缺少必要字段');
  }

  if (store.usersByEmail.has(email)) {
    throw new Error('邮箱已注册');
  }

  const id = generateId('usr');
  const createdAt = nowIso();

  const user: InternalUser = {
    id,
    email,
    name: input.name.trim(),
    avatar: undefined,
    passwordHash: hashPassword(input.password),
    createdAt,
    updatedAt: createdAt,
  };

  store.users.set(id, user);
  store.usersByEmail.set(email, id);

  const plan = SUBSCRIPTION_PLANS.free;
  const sub: InternalSubscription = {
    id: generateId('sub'),
    userId: id,
    plan: 'free',
    quota: {
      total: plan.quota,
      used: 0,
    },
    features: [...plan.features],
    startDate: createdAt,
    endDate: addDays(new Date(), 30).toISOString(),
    isActive: true,
  };
  store.subscriptionsByUserId.set(id, sub);

  return sanitizeUser(user, sub);
}

export function authVerifyUser(input: { email: string; password: string }): User {
  const store = ensureStore();
  const email = normalizeEmail(input.email);
  const userId = store.usersByEmail.get(email);
  if (!userId) throw new Error('账号或密码错误');
  const user = store.users.get(userId);
  if (!user) throw new Error('账号或密码错误');

  if (!verifyPassword(input.password, user.passwordHash)) {
    throw new Error('账号或密码错误');
  }

  const sub = store.subscriptionsByUserId.get(userId);
  return sanitizeUser(user, sub);
}

export function authCreateSession(userId: string): Session {
  const store = ensureStore();
  const id = generateId('sess');
  const createdAt = nowIso();
  const expiresAt = addDays(new Date(), 30).toISOString();

  const session: Session = { id, userId, createdAt, expiresAt };
  store.sessions.set(id, session);
  return session;
}

export function authDestroySession(sessionId: string): void {
  const store = ensureStore();
  store.sessions.delete(sessionId);
}

export function authGetUserBySession(sessionId?: string): User | null {
  const store = ensureStore();
  if (!sessionId) return null;
  const session = store.sessions.get(sessionId);
  if (!session) return null;

  if (new Date(session.expiresAt).getTime() < Date.now()) {
    store.sessions.delete(sessionId);
    return null;
  }

  const user = store.users.get(session.userId);
  if (!user) return null;
  const sub = store.subscriptionsByUserId.get(user.id);
  return sanitizeUser(user, sub);
}

export function authCreatePasswordReset(emailRaw: string): { token: string } {
  const store = ensureStore();
  const email = normalizeEmail(emailRaw);
  const userId = store.usersByEmail.get(email);
  if (!userId) {
    // 不泄漏用户是否存在
    return { token: generateId('reset') };
  }

  const token = generateId('reset');
  store.passwordResets.set(token, {
    token,
    userId,
    expiresAt: addDays(new Date(), 1).toISOString(),
  });
  return { token };
}

export function authResetPassword(token: string, newPassword: string): void {
  const store = ensureStore();
  const record = store.passwordResets.get(token);
  if (!record) throw new Error('重置链接无效或已过期');
  if (new Date(record.expiresAt).getTime() < Date.now()) {
    store.passwordResets.delete(token);
    throw new Error('重置链接无效或已过期');
  }

  const user = store.users.get(record.userId);
  if (!user) throw new Error('重置链接无效或已过期');

  user.passwordHash = hashPassword(newPassword);
  user.updatedAt = nowIso();
  store.users.set(user.id, user);
  store.passwordResets.delete(token);
}

export function userUpdateProfile(userId: string, input: { name?: string; avatar?: string }): User {
  const store = ensureStore();
  const user = store.users.get(userId);
  if (!user) throw new Error('用户不存在');

  if (typeof input.name === 'string') {
    user.name = input.name.trim() || user.name;
  }
  if (typeof input.avatar === 'string') {
    user.avatar = input.avatar.trim() || undefined;
  }

  user.updatedAt = nowIso();
  store.users.set(userId, user);

  const sub = store.subscriptionsByUserId.get(userId);
  return sanitizeUser(user, sub);
}

export function userGetSubscription(userId: string): Subscription {
  const store = ensureStore();
  const sub = store.subscriptionsByUserId.get(userId);
  if (!sub) {
    throw new Error('订阅不存在');
  }

  return {
    ...sub,
    startDate: new Date(sub.startDate),
    endDate: new Date(sub.endDate),
  };
}

function createMockVariants(productId: string): InternalVariant[] {
  const createdAt = nowIso();
  return [
    {
      id: generateId('var'),
      productId,
      title: 'Default Title',
      price: 19.99,
      compareAtPrice: 29.99,
      sku: `SKU-${productId.slice(-6)}`,
      inventoryQuantity: 100,
      weight: 0.5,
      weightUnit: 'kg',
      options: [{ name: 'Default', value: 'Default' }],
      image: undefined,
      createdAt,
      updatedAt: createdAt,
    },
  ];
}

function createMockProduct(userId: string, taskId: string, platform: Platform, idx: number): InternalProduct {
  const createdAt = nowIso();
  const id = generateId('prd');
  const handle = `${platform}-product-${id.slice(-8)}-${idx}`;
  const title = `示例商品 ${idx + 1} (${platform})`;

  return {
    id,
    userId,
    taskId,
    platform,
    handle,
    title,
    description: '这是用于打通前后台交互的示例商品描述。',
    vendor: 'Demo Vendor',
    productType: 'Demo Type',
    tags: ['demo', platform],
    images: [],
    variants: createMockVariants(id),
    options: [{ name: 'Default', values: ['Default'] }],
    status: 'active',
    publishedAt: createdAt,
    createdAt,
    updatedAt: createdAt,
  };
}

export function tasksCreate(input: {
  userId: string;
  platform: Platform;
  type: CollectionType;
  url: string;
}): CollectionTask {
  const store = ensureStore();
  const createdAt = nowIso();
  const id = generateId('task');

  const status: TaskStatus = 'completed';
  const totalProducts = input.type === 'single' ? 1 : 5;

  const task: InternalTask = {
    id,
    userId: input.userId,
    platform: input.platform,
    type: input.type,
    url: input.url,
    status,
    progress: 100,
    totalProducts,
    collectedProducts: totalProducts,
    error: undefined,
    createdAt,
    updatedAt: createdAt,
    completedAt: createdAt,
  };

  store.tasks.set(id, task);

  for (let i = 0; i < totalProducts; i++) {
    const p = createMockProduct(input.userId, id, input.platform, i);
    store.products.set(p.id, p);
  }

  const sub = store.subscriptionsByUserId.get(input.userId);
  if (sub && sub.quota.total !== -1) {
    sub.quota.used += totalProducts;
    store.subscriptionsByUserId.set(input.userId, sub);
  }

  return {
    ...task,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
  };
}

export function tasksList(userId: string): CollectionTask[] {
  const store = ensureStore();
  const tasks = [...store.tasks.values()].filter((t) => t.userId === userId);
  tasks.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return tasks.map((t) => ({
    ...t,
    createdAt: new Date(t.createdAt),
    updatedAt: new Date(t.updatedAt),
    completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
  }));
}

export function tasksGet(userId: string, id: string): CollectionTask {
  const store = ensureStore();
  const task = store.tasks.get(id);
  if (!task || task.userId !== userId) throw new Error('任务不存在');

  return {
    ...task,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
  };
}

export function tasksCancel(userId: string, id: string): CollectionTask {
  const store = ensureStore();
  const task = store.tasks.get(id);
  if (!task || task.userId !== userId) throw new Error('任务不存在');

  if (task.status === 'completed') {
    return tasksGet(userId, id);
  }

  task.status = 'cancelled';
  task.updatedAt = nowIso();
  store.tasks.set(id, task);

  return tasksGet(userId, id);
}

export function productsList(userId: string, input: {
  search?: string;
  platform?: Platform;
  status?: Product['status'];
  page: number;
  limit: number;
}): { items: Product[]; total: number; page: number; limit: number; totalPages: number } {
  const store = ensureStore();

  let products = [...store.products.values()].filter((p) => p.userId === userId);

  if (input.search) {
    const q = input.search.trim().toLowerCase();
    products = products.filter((p) =>
      p.handle.toLowerCase().includes(q) || p.title.toLowerCase().includes(q)
    );
  }

  if (input.platform) {
    products = products.filter((p) => p.platform === input.platform);
  }

  if (input.status) {
    products = products.filter((p) => p.status === input.status);
  }

  products.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / input.limit));
  const page = Math.min(Math.max(1, input.page), totalPages);
  const start = (page - 1) * input.limit;
  const items = products.slice(start, start + input.limit).map((p) => internalToProduct(p));

  return {
    items,
    total,
    page,
    limit: input.limit,
    totalPages,
  };
}

function internalToProduct(p: InternalProduct): Product {
  return {
    ...p,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
    publishedAt: p.publishedAt ? new Date(p.publishedAt) : undefined,
    variants: p.variants.map((v) => ({
      ...v,
      createdAt: new Date(v.createdAt),
      updatedAt: new Date(v.updatedAt),
    })),
  };
}

export function productsGet(userId: string, id: string): Product {
  const store = ensureStore();
  const p = store.products.get(id);
  if (!p || p.userId !== userId) throw new Error('商品不存在');
  return internalToProduct(p);
}

export function productsUpdate(userId: string, id: string, patch: Partial<Product>): Product {
  const store = ensureStore();
  const p = store.products.get(id);
  if (!p || p.userId !== userId) throw new Error('商品不存在');

  if (typeof patch.title === 'string') p.title = patch.title;
  if (typeof patch.handle === 'string') p.handle = patch.handle;
  if (typeof patch.description === 'string') p.description = patch.description;
  if (typeof patch.vendor === 'string') p.vendor = patch.vendor;
  if (typeof patch.productType === 'string') p.productType = patch.productType;
  if (Array.isArray(patch.tags)) p.tags = patch.tags.filter((t) => typeof t === 'string');
  if (Array.isArray(patch.images)) p.images = patch.images.filter((t) => typeof t === 'string');
  if (patch.status === 'draft' || patch.status === 'active' || patch.status === 'archived') {
    p.status = patch.status;
  }

  p.updatedAt = nowIso();
  store.products.set(id, p);
  return internalToProduct(p);
}

export function productsDelete(userId: string, id: string): void {
  const store = ensureStore();
  const p = store.products.get(id);
  if (!p || p.userId !== userId) throw new Error('商品不存在');
  store.products.delete(id);
}

export function productsBatchDelete(userId: string, ids: string[]): { deleted: number } {
  const store = ensureStore();
  let deleted = 0;
  ids.forEach((id) => {
    const p = store.products.get(id);
    if (p && p.userId === userId) {
      store.products.delete(id);
      deleted += 1;
    }
  });
  return { deleted };
}

export function productsBatchUpdate(
  userId: string,
  input: {
    action: 'updatePrice' | 'updateCategory' | 'addTags' | 'clearTags';
    productIds: string[];
    data?: {
      priceModifier?: { type: 'increase' | 'decrease' | 'multiply' | 'set'; value: number };
      category?: string;
      tags?: string[];
    };
  }
): { updated: number } {
  const store = ensureStore();
  let updated = 0;

  for (const id of input.productIds) {
    const p = store.products.get(id);
    if (!p || p.userId !== userId) continue;

    if (input.action === 'addTags' && input.data?.tags) {
      const set = new Set([...p.tags, ...input.data.tags].filter(Boolean));
      p.tags = [...set];
      updated += 1;
    }

    if (input.action === 'clearTags') {
      p.tags = [];
      updated += 1;
    }

    if (input.action === 'updatePrice' && input.data?.priceModifier) {
      const mod = input.data.priceModifier;
      for (const v of p.variants) {
        if (mod.type === 'set') v.price = mod.value;
        if (mod.type === 'increase') v.price = v.price + mod.value;
        if (mod.type === 'decrease') v.price = Math.max(0, v.price - mod.value);
        if (mod.type === 'multiply') v.price = v.price * mod.value;
        v.updatedAt = nowIso();
      }
      updated += 1;
    }

    if (input.action === 'updateCategory' && typeof input.data?.category === 'string') {
      p.productType = input.data.category;
      updated += 1;
    }

    p.updatedAt = nowIso();
    store.products.set(id, p);
  }

  return { updated };
}

function csvEscape(value: string): string {
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

function productToShopifyCsvRow(p: Product): Record<string, string> {
  const variant = p.variants[0];
  return {
    Handle: p.handle,
    Title: p.title,
    'Body (HTML)': p.description || '',
    Vendor: p.vendor || '',
    'Product Category': p.productType || '',
    Tags: p.tags.join(', '),
    'Variant SKU': variant?.sku || '',
    'Variant Price': variant ? String(variant.price) : '0',
    Status: p.status,
  };
}

function productToWooCsvRow(p: Product): Record<string, string> {
  const variant = p.variants[0];
  return {
    sku: variant?.sku || '',
    name: p.title,
    description: p.description || '',
    regular_price: variant ? String(variant.price) : '0',
    tags: p.tags.join(', '),
    type: 'simple',
    status: p.status === 'active' ? 'publish' : 'draft',
  };
}

function rowsToCsv(rows: Record<string, string>[]): string {
  const headers = Object.keys(rows[0] || {});
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h] ?? '')).join(','));
  }
  return lines.join('\n');
}

export function exportCreate(userId: string, input: { format: 'shopify' | 'woocommerce'; productIds?: string[] }): ExportRecord {
  const store = ensureStore();

  const allProducts = [...store.products.values()].filter((p) => p.userId === userId);
  const products = input.productIds?.length
    ? allProducts.filter((p) => input.productIds?.includes(p.id))
    : allProducts;

  const createdAt = nowIso();
  const id = generateId('exp');

  const rows = products.map((p) => internalToProduct(p)).map((p) => {
    return input.format === 'shopify' ? productToShopifyCsvRow(p) : productToWooCsvRow(p);
  });

  const csv = rowsToCsv(rows);
  const fileName = `${input.format}-export-${new Date().toISOString().slice(0, 10)}.csv`;

  const record: InternalExport = {
    id,
    userId,
    format: input.format,
    productIds: products.map((p) => p.id),
    fileUrl: `/api/export/${id}/download`,
    fileName,
    status: 'completed',
    createdAt,
    completedAt: createdAt,
    csvContent: csv,
  };

  store.exports.set(id, record);

  return {
    id: record.id,
    userId: record.userId,
    format: record.format,
    productIds: record.productIds,
    fileUrl: record.fileUrl || '',
    status: record.status,
    createdAt: new Date(record.createdAt),
    completedAt: record.completedAt ? new Date(record.completedAt) : undefined,
  };
}

export function exportList(userId: string): ExportRecord[] {
  const store = ensureStore();
  const records = [...store.exports.values()].filter((e) => e.userId === userId);
  records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return records.map((r) => ({
    id: r.id,
    userId: r.userId,
    format: r.format,
    productIds: r.productIds,
    fileUrl: r.fileUrl || '',
    status: r.status,
    createdAt: new Date(r.createdAt),
    completedAt: r.completedAt ? new Date(r.completedAt) : undefined,
  }));
}

export function exportDownload(userId: string, id: string): { fileName: string; csv: string } {
  const store = ensureStore();
  const record = store.exports.get(id);
  if (!record || record.userId !== userId) throw new Error('导出记录不存在');
  return {
    fileName: record.fileName,
    csv: record.csvContent || '',
  };
}

export function userStatistics(userId: string): Statistics {
  const store = ensureStore();
  const products = [...store.products.values()].filter((p) => p.userId === userId);
  const tasks = [...store.tasks.values()].filter((t) => t.userId === userId);

  const productsByPlatform = {
    shopify: 0,
    shoplazza: 0,
    aliexpress: 0,
    shopline: 0,
    wordpress: 0,
    alibaba: 0,
    amazon: 0,
  } satisfies Record<Platform, number>;

  for (const p of products) {
    productsByPlatform[p.platform] += 1;
  }

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const failedTasks = tasks.filter((t) => t.status === 'failed').length;

  const recentTasks = tasks
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)
    .map((t) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
      completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
    }));

  return {
    totalProducts: products.length,
    totalTasks: tasks.length,
    completedTasks,
    failedTasks,
    productsByPlatform,
    recentTasks,
  };
}

export function systemAnnouncements(): AnnouncementItem[] {
  const store = ensureStore();
  return store.announcements;
}

export function systemChangelog(): ChangelogItem[] {
  const store = ensureStore();
  return store.changelog;
}

export function userDeleteAccount(userId: string): void {
  const store = ensureStore();

  for (const [sid, sess] of store.sessions) {
    if (sess.userId === userId) store.sessions.delete(sid);
  }

  for (const [id, t] of store.tasks) {
    if (t.userId === userId) store.tasks.delete(id);
  }

  for (const [id, p] of store.products) {
    if (p.userId === userId) store.products.delete(id);
  }

  for (const [id, e] of store.exports) {
    if (e.userId === userId) store.exports.delete(id);
  }

  store.subscriptionsByUserId.delete(userId);

  const user = store.users.get(userId);
  if (user) {
    store.usersByEmail.delete(user.email);
  }

  store.users.delete(userId);
}
