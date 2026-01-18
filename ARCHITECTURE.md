# 系统架构文档

## 概述

商品采集SaaS平台采用现代化的全栈架构，基于Next.js 16构建，支持多平台电商商品数据采集和管理。

## 技术选型

### 前端层
- **框架**: Next.js 16 (React 19)
- **路由**: App Router (Server Components + Client Components)
- **状态管理**: React Context API + Hooks
- **样式**: Tailwind CSS 4
- **类型检查**: TypeScript 5
- **HTTP客户端**: Fetch API

### 后端层
- **API**: Next.js API Routes
- **认证**: Manus OAuth 2.0
- **会话管理**: JWT + HTTP-only Cookies
- **数据库**: PostgreSQL 15+
- **ORM**: Prisma 5 (推荐)
- **缓存**: Redis 7+
- **任务队列**: Bull + Redis

### 基础设施
- **部署**: Vercel / AWS / 自建服务器
- **文件存储**: AWS S3 / 本地存储
- **CDN**: Cloudflare / AWS CloudFront
- **监控**: Sentry / DataDog
- **日志**: Winston / Pino

## 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         客户端层                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ 浏览器   │  │ 移动端   │  │ 桌面应用  │  │ API客户端│   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                        │
                   HTTPS/WSS
                        │
┌───────────────────────┼──────────────────────────────────────┐
│                       │      CDN层                            │
│                 ┌─────▼─────┐                                │
│                 │ Cloudflare│                                │
│                 └─────┬─────┘                                │
└───────────────────────┼──────────────────────────────────────┘
                        │
┌───────────────────────┼──────────────────────────────────────┐
│                       │      应用层 (Next.js)                 │
│  ┌────────────────────┴────────────────────┐                │
│  │          Web服务器 (Node.js)             │                │
│  │  ┌──────────────┐    ┌──────────────┐  │                │
│  │  │ Server Side  │    │ API Routes   │  │                │
│  │  │ Rendering    │    │              │  │                │
│  │  └──────┬───────┘    └──────┬───────┘  │                │
│  └─────────┼───────────────────┼──────────┘                │
│            │                   │                            │
│  ┌─────────▼──────┐  ┌─────────▼──────┐                    │
│  │ 页面路由        │  │ API路由        │                    │
│  │ - Landing      │  │ - /auth/*      │                    │
│  │ - Dashboard    │  │ - /products/*  │                    │
│  │ - Products     │  │ - /tasks/*     │                    │
│  │ - Tasks        │  │ - /export/*    │                    │
│  └────────────────┘  └────────┬───────┘                    │
└────────────────────────────────┼──────────────────────────┘
                                │
┌───────────────────────────────┼──────────────────────────────┐
│                               │      服务层                    │
│  ┌────────────┐  ┌───────────▼────┐  ┌──────────────┐      │
│  │ 认证服务   │  │ 采集服务        │  │ 导出服务     │      │
│  │ - OAuth    │  │ - Shopify      │  │ - CSV生成    │      │
│  │ - JWT      │  │ - AliExpress   │  │ - 文件存储   │      │
│  └─────┬──────┘  │ - Amazon       │  └──────────────┘      │
│        │         │ - 其他平台      │                        │
│  ┌─────▼──────┐  └────────┬───────┘                        │
│  │ 用户服务   │            │                                │
│  │ - Profile  │            │                                │
│  │ - Settings │  ┌─────────▼──────┐                        │
│  └────────────┘  │ 任务队列        │                        │
│                  │ - Bull          │                        │
│  ┌────────────┐  │ - Worker Pool  │  ┌──────────────┐     │
│  │ 商品服务   │  └─────────┬───────┘  │ 通知服务     │     │
│  │ - CRUD     │            │          │ - Email      │     │
│  │ - Search   │            │          │ - WebSocket  │     │
│  │ - Batch Ops│            │          └──────────────┘     │
│  └────────────┘            │                               │
└────────────────────────────┼───────────────────────────────┘
                             │
┌────────────────────────────┼───────────────────────────────┐
│                            │      数据层                     │
│  ┌────────────────┐  ┌─────▼─────┐  ┌──────────────┐      │
│  │ PostgreSQL     │  │ Redis     │  │ AWS S3       │      │
│  │ - users        │  │ - Cache   │  │ - Images     │      │
│  │ - products     │  │ - Session │  │ - Exports    │      │
│  │ - tasks        │  │ - Queue   │  └──────────────┘      │
│  │ - exports      │  └───────────┘                         │
│  └────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

## 数据流

### 1. 用户认证流程

```
用户 → 登录页面 → Manus OAuth → 授权 → 回调处理 → JWT生成 → Cookie设置 → 重定向到Dashboard
```

### 2. 商品采集流程

```
用户 → 提交采集URL
    → API验证请求
    → 创建任务记录
    → 加入任务队列
    → 返回任务ID
    
Worker → 从队列获取任务
      → 调用平台采集器
      → 解析商品数据
      → 保存到数据库
      → 更新任务状态
      → 发送通知
```

### 3. 商品管理流程

```
用户 → 访问商品列表
    → API查询 (带分页/筛选)
    → 数据库查询
    → 返回商品列表
    → 渲染UI

批量操作:
用户 → 选择商品
    → 执行操作 (删除/修改)
    → API批量处理
    → 数据库事务
    → 返回结果
    → 刷新列表
```

### 4. 数据导出流程

```
用户 → 选择导出格式
    → API创建导出任务
    → 查询商品数据
    → 生成CSV文件
    → 上传到S3
    → 返回下载链接
    → 用户下载
```

## 核心模块设计

### 认证模块 (Authentication)

**职责**: 处理用户认证、授权和会话管理

**组件**:
- OAuth客户端: 与Manus OAuth集成
- JWT管理器: 生成和验证JWT
- 会话管理: 管理用户会话
- 权限检查: 验证用户权限

**API端点**:
- `POST /api/auth/login` - 登录
- `POST /api/auth/logout` - 登出
- `GET /api/auth/session` - 获取会话
- `POST /api/auth/refresh` - 刷新token

### 采集模块 (Collector)

**职责**: 从各电商平台采集商品数据

**组件**:
- 平台适配器: 各平台的采集逻辑
- URL解析器: 解析和验证URL
- 数据转换器: 统一数据格式
- 重试机制: 处理失败重试

**平台适配器**:
```typescript
interface PlatformAdapter {
  name: string;
  validateUrl(url: string): boolean;
  collectProduct(url: string): Promise<Product>;
  collectCategory(url: string): Promise<Product[]>;
}
```

### 任务队列模块 (Task Queue)

**职责**: 管理异步采集任务

**组件**:
- 任务调度器: 调度任务执行
- Worker进程: 执行任务
- 进度追踪: 更新任务进度
- 错误处理: 处理任务失败

**任务状态机**:
```
pending → processing → completed
                    → failed → (retry) → processing
                    → cancelled
```

### 商品管理模块 (Product Management)

**职责**: 商品的CRUD操作和管理

**组件**:
- 商品服务: 基本CRUD
- 搜索引擎: 商品搜索
- 批量操作: 批量更新/删除
- 变体管理: 管理商品变体

**API端点**:
- `GET /api/products` - 列表
- `GET /api/products/:id` - 详情
- `PUT /api/products/:id` - 更新
- `DELETE /api/products/:id` - 删除
- `POST /api/products/batch/*` - 批量操作

### 导出模块 (Export)

**职责**: 将商品数据导出为不同格式

**组件**:
- CSV生成器: 生成CSV文件
- 格式转换器: 不同平台格式
- 文件存储: S3/本地存储
- 下载管理: 提供下载链接

## 数据库设计

### 核心表结构

#### users (用户表)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  oauth_provider VARCHAR(50),
  oauth_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### subscriptions (订阅表)
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan VARCHAR(50) NOT NULL,
  quota_total INTEGER NOT NULL,
  quota_used INTEGER DEFAULT 0,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### tasks (任务表)
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  platform VARCHAR(50) NOT NULL,
  type VARCHAR(20) NOT NULL,
  url TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  total_products INTEGER DEFAULT 0,
  collected_products INTEGER DEFAULT 0,
  error TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

#### products (商品表)
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  task_id UUID REFERENCES tasks(id),
  platform VARCHAR(50) NOT NULL,
  handle VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  vendor VARCHAR(255),
  product_type VARCHAR(255),
  tags TEXT[],
  images TEXT[],
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### product_variants (商品变体表)
```sql
CREATE TABLE product_variants (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  inventory_quantity INTEGER,
  weight DECIMAL(10,2),
  weight_unit VARCHAR(10),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### exports (导出记录表)
```sql
CREATE TABLE exports (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  format VARCHAR(50) NOT NULL,
  product_ids UUID[],
  file_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

## 安全设计

### 认证安全
- OAuth 2.0 标准流程
- JWT with HTTP-only cookies
- CSRF token 保护
- 会话过期管理

### 数据安全
- 密码加密存储 (bcrypt)
- 敏感数据加密 (AES-256)
- SQL注入防护 (参数化查询)
- XSS防护 (输入过滤)

### API安全
- Rate limiting (限流)
- API密钥认证
- CORS配置
- 请求签名验证

### 权限控制
- 基于角色的访问控制 (RBAC)
- 资源级权限检查
- 套餐功能限制
- 操作审计日志

## 性能优化

### 前端优化
- 代码分割 (Code Splitting)
- 懒加载 (Lazy Loading)
- 图片优化 (Next.js Image)
- 静态生成 (SSG)
- 增量静态再生成 (ISR)

### 后端优化
- 数据库索引优化
- 查询优化 (N+1问题)
- Redis缓存
- CDN加速
- API响应压缩

### 采集优化
- 并发控制
- 请求池管理
- 断点续传
- 增量更新

## 监控和日志

### 应用监控
- 错误追踪 (Sentry)
- 性能监控 (APM)
- 用户行为分析
- 实时告警

### 日志管理
- 结构化日志
- 日志级别分类
- 日志聚合和搜索
- 日志保留策略

## 扩展性设计

### 水平扩展
- 无状态应用设计
- 负载均衡
- 数据库读写分离
- 分库分表

### 垂直扩展
- 资源优化
- 缓存策略
- 异步处理
- 批量操作

## 部署架构

### 生产环境
```
Internet → CDN → Load Balancer → Web Servers (多实例)
                                  ↓
                            Database (主从)
                                  ↓
                            Redis Cluster
                                  ↓
                            Worker Pool
```

### 开发环境
```
本地开发服务器 → 本地PostgreSQL → 本地Redis
```

### 测试环境
```
测试服务器 → 测试数据库 → 测试Redis
```

## 技术债务和改进方向

### 短期目标
- [ ] 完善单元测试覆盖
- [ ] 添加E2E测试
- [ ] 优化数据库查询
- [ ] 实现API文档

### 中期目标
- [ ] 实现微服务拆分
- [ ] 添加GraphQL支持
- [ ] 实现实时通信
- [ ] 增加更多平台支持

### 长期目标
- [ ] AI智能推荐
- [ ] 数据分析平台
- [ ] 移动App开发
- [ ] 国际化支持

## 总结

本架构设计遵循以下原则:
- **可扩展性**: 支持水平和垂直扩展
- **可维护性**: 模块化设计，职责清晰
- **安全性**: 多层安全防护
- **性能**: 优化关键路径
- **可靠性**: 错误处理和恢复机制
