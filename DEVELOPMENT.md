# 开发文档

## 项目概述

商品采集SaaS平台是一个支持多平台电商商品数据采集的Web应用，旨在帮助用户快速从各大电商平台采集商品数据，并提供强大的数据管理和导出功能。

## 技术架构

### 前端技术栈
- **框架**: Next.js 16 (App Router)
- **UI库**: React 19
- **样式**: Tailwind CSS 4
- **语言**: TypeScript 5
- **状态管理**: React Context + Hooks
- **HTTP客户端**: Fetch API

### 后端技术栈
- **API**: Next.js API Routes
- **认证**: Manus OAuth
- **数据库**: PostgreSQL
- **ORM**: Prisma (待集成)
- **任务队列**: Bull + Redis (待集成)
- **文件存储**: AWS S3 / 本地存储

## 项目结构

```
.
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 认证相关页面组
│   │   ├── login/               # 登录页
│   │   └── register/            # 注册页
│   ├── (dashboard)/             # 工作台页面组
│   │   ├── dashboard/           # 仪表盘
│   │   ├── products/            # 商品管理
│   │   ├── tasks/               # 任务管理
│   │   ├── export/              # 导出管理
│   │   └── settings/            # 设置
│   ├── api/                     # API路由
│   │   ├── auth/               # 认证API
│   │   ├── products/           # 商品API
│   │   ├── tasks/              # 任务API
│   │   ├── export/             # 导出API
│   │   └── user/               # 用户API
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页
│   └── globals.css             # 全局样式
├── components/                  # React组件
│   ├── ui/                     # 通用UI组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   └── ...
│   └── features/               # 功能组件
│       ├── CollectionForm/     # 采集表单
│       ├── ProductTable/       # 商品列表
│       ├── TaskList/           # 任务列表
│       ├── BatchOperations/    # 批量操作
│       └── ...
├── lib/                        # 工具库
│   ├── api-client.ts          # API客户端
│   ├── constants.ts           # 常量配置
│   ├── utils.ts               # 工具函数
│   ├── validators.ts          # 数据验证
│   └── hooks/                 # 自定义Hooks
├── types/                      # TypeScript类型定义
│   └── index.ts
├── public/                     # 静态资源
└── prisma/                     # Prisma配置(待添加)
    └── schema.prisma
```

## 开发指南

### 环境准备

1. **安装依赖**
```bash
npm install
```

2. **配置环境变量**
```bash
cp .env.example .env.local
# 编辑 .env.local 填入实际配置
```

3. **启动开发服务器**
```bash
npm run dev
```

访问 http://localhost:3000

### 代码规范

#### 命名规范
- **组件**: PascalCase (如: `ProductTable.tsx`)
- **函数/变量**: camelCase (如: `formatDate`)
- **常量**: UPPER_SNAKE_CASE (如: `API_ENDPOINTS`)
- **类型**: PascalCase (如: `Product`, `User`)

#### 组件结构
```typescript
// 1. 导入
import { useState } from 'react';
import { cn } from '@/lib/utils';

// 2. 类型定义
interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

// 3. 组件定义
export default function MyComponent({ title, onClick }: MyComponentProps) {
  // 3.1 状态
  const [state, setState] = useState(false);
  
  // 3.2 副作用
  // useEffect...
  
  // 3.3 事件处理
  const handleClick = () => {
    // ...
  };
  
  // 3.4 渲染
  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

#### API路由结构
```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET 请求
export async function GET(request: NextRequest) {
  try {
    // 处理逻辑
    return NextResponse.json({
      success: true,
      data: {},
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error message' },
      { status: 500 }
    );
  }
}

// POST 请求
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // 处理逻辑
    return NextResponse.json({
      success: true,
      data: {},
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error message' },
      { status: 500 }
    );
  }
}
```

### Git工作流

1. **创建功能分支**
```bash
git checkout -b feature/your-feature-name
```

2. **提交代码**
```bash
git add .
git commit -m "feat: add your feature description"
```

提交信息格式:
- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具链相关

3. **推送代码**
```bash
git push origin feature/your-feature-name
```

### 测试

```bash
# 单元测试
npm run test

# E2E测试
npm run test:e2e

# 测试覆盖率
npm run test:coverage
```

### 构建部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## API文档

### 认证API

#### POST /api/auth/login
登录接口

**请求体:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "User Name"
    }
  }
}
```

### 商品API

#### GET /api/products
获取商品列表

**查询参数:**
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `search`: 搜索关键词
- `platform`: 平台筛选
- `sortBy`: 排序字段
- `sortOrder`: 排序方向 (asc/desc)

**响应:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

#### POST /api/products/batch/delete
批量删除商品

**请求体:**
```json
{
  "productIds": ["id1", "id2", "id3"]
}
```

### 任务API

#### POST /api/tasks
创建采集任务

**请求体:**
```json
{
  "platform": "shopify",
  "type": "single",
  "url": "https://example.myshopify.com/products/product-handle"
}
```

## 常见问题

### Q: 如何添加新的电商平台支持？

A: 
1. 在 `types/index.ts` 中添加平台类型
2. 在 `lib/constants.ts` 中添加平台配置
3. 实现平台采集逻辑
4. 更新UI组件

### Q: 如何自定义样式？

A: 本项目使用Tailwind CSS，可以：
1. 使用内联类名
2. 在 `globals.css` 中添加自定义样式
3. 修改 `tailwind.config.js` 配置

### Q: 如何处理大量商品采集？

A: 使用后台任务队列：
1. 创建任务记录
2. 将任务加入队列
3. Worker进程处理任务
4. 更新任务状态和进度

## 性能优化建议

1. **代码分割**: 使用动态导入 `import()`
2. **图片优化**: 使用 Next.js Image组件
3. **数据缓存**: 实现适当的缓存策略
4. **懒加载**: 对非首屏内容使用懒加载
5. **API优化**: 实现分页、筛选、排序

## 安全建议

1. **输入验证**: 所有用户输入必须验证
2. **XSS防护**: 避免直接渲染用户输入
3. **CSRF防护**: 使用CSRF token
4. **SQL注入防护**: 使用参数化查询
5. **敏感数据**: 加密存储敏感信息
6. **权限检查**: 实现完善的权限系统

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork项目
2. 创建功能分支
3. 提交代码
4. 创建Pull Request
5. 等待代码审查

## 许可证

MIT License

## 联系方式

- 项目维护者: dev@example.com
- 技术支持: support@example.com
- GitHub Issues: https://github.com/your-repo/issues
