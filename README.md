# 商品采集SaaS平台

一个支持多平台电商商品采集的SaaS平台，帮助用户快速采集和管理来自不同电商平台的商品数据。

## 功能特性

### 🔐 用户认证
- 集成Manus OAuth认证系统
- 安全的用户会话管理
- 用户注册与登录

### 📊 工作台仪表盘
- 直观的数据统计展示
- 商品采集数量统计
- 快速操作导航

### 🛍️ 多平台商品采集
支持以下电商平台的商品采集：
- Shopify（单品、分类采集）
- Shoplazza
- AliExpress
- ShopLine
- WordPress/WooCommerce
- 阿里巴巴国际站
- Amazon

### 📦 商品数据管理
- 商品列表展示与搜索
- 按Handle、分类、平台筛选
- 商品详情查看与编辑
- 单个/批量删除功能

### ⚡ 批量操作
- 批量修改价格
- 批量修改分类
- 批量管理标签
- 批量删除商品

### 📤 数据导出
- Shopify CSV格式导出
- WooCommerce CSV格式导出
- 自定义导出范围

### 💎 套餐系统
- 免费/付费套餐管理
- 采集额度控制
- 功能权限管理

## 技术栈

- **前端框架**: Next.js 16 (App Router)
- **UI框架**: React 19
- **样式**: Tailwind CSS 4
- **语言**: TypeScript 5
- **认证**: Manus OAuth

## 开发指南

### 环境要求
- Node.js 20+
- npm/yarn/pnpm

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本
```bash
npm run build
npm start
```

### 代码检查
```bash
npm run lint
```

## 项目结构

```
.
├── app/                    # Next.js App Router 目录
│   ├── (auth)/            # 认证相关页面
│   ├── (dashboard)/       # 工作台页面
│   ├── api/               # API路由
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── ui/               # 通用UI组件
│   └── features/         # 功能组件
├── lib/                   # 工具函数和配置
├── types/                 # TypeScript 类型定义
├── public/               # 静态资源
└── CHECKLIST.md          # 功能开发清单
```

## 开发清单

详细的功能开发清单请查看 [CHECKLIST.md](./CHECKLIST.md)

## 部署

### Vercel (推荐)
项目已针对 Vercel 平台优化，可一键部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo)

### 其他平台
项目支持所有支持 Next.js 的托管平台。

## 环境变量

创建 `.env.local` 文件并配置以下环境变量：

```env
# Manus OAuth 配置
NEXT_PUBLIC_OAUTH_CLIENT_ID=your_client_id
OAUTH_CLIENT_SECRET=your_client_secret

# 数据库配置
DATABASE_URL=your_database_url

# 其他配置
NEXT_PUBLIC_API_URL=your_api_url
```

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件至：support@example.com
