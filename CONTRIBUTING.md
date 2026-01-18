# 贡献指南

感谢您对商品采集SaaS平台的关注！我们欢迎所有形式的贡献。

## 如何贡献

### 报告Bug

如果您发现了bug，请创建一个Issue并包含以下信息：

- Bug的详细描述
- 复现步骤
- 预期行为
- 实际行为
- 环境信息（浏览器、操作系统等）
- 截图或错误日志（如果有）

### 提出新功能

如果您有新功能的想法：

1. 先查看Issue列表，确保该功能尚未被提出
2. 创建一个Feature Request Issue
3. 详细描述功能需求和使用场景
4. 等待维护者反馈

### 提交代码

1. **Fork仓库**
```bash
# 点击GitHub上的Fork按钮
```

2. **克隆到本地**
```bash
git clone https://github.com/your-username/project-name.git
cd project-name
```

3. **创建分支**
```bash
git checkout -b feature/your-feature-name
```

分支命名规范：
- `feature/xxx` - 新功能
- `fix/xxx` - Bug修复
- `docs/xxx` - 文档更新
- `refactor/xxx` - 代码重构
- `test/xxx` - 测试相关

4. **安装依赖**
```bash
npm install
```

5. **开发**
- 遵循代码规范
- 编写测试用例
- 更新相关文档

6. **提交代码**
```bash
git add .
git commit -m "feat: add your feature"
```

提交信息格式：
```
<type>(<scope>): <subject>

<body>

<footer>
```

类型(type):
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链相关

示例：
```
feat(products): add batch delete functionality

- Add batch delete API endpoint
- Implement UI for batch operations
- Add confirmation modal

Closes #123
```

7. **推送到远程**
```bash
git push origin feature/your-feature-name
```

8. **创建Pull Request**
- 访问GitHub仓库
- 点击"New Pull Request"
- 填写PR描述
- 等待代码审查

## 代码规范

### TypeScript/JavaScript

- 使用TypeScript编写新代码
- 遵循ESLint规则
- 使用函数式编程风格
- 避免使用any类型

### React组件

- 优先使用函数组件
- 使用Hooks管理状态
- Props使用TypeScript接口定义
- 组件应该是可复用的

### 样式

- 使用Tailwind CSS类名
- 遵循移动优先原则
- 保持样式一致性

### 注释

- 复杂逻辑添加注释
- 公共API添加JSDoc注释
- 避免无意义的注释

示例：
```typescript
/**
 * 格式化商品价格
 * @param price - 原始价格
 * @param currency - 货币类型
 * @returns 格式化后的价格字符串
 */
export function formatPrice(price: number, currency: string = 'CNY'): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
  }).format(price);
}
```

## 测试

### 单元测试

- 为新功能编写单元测试
- 保持测试覆盖率在80%以上
- 使用Jest和React Testing Library

```bash
npm run test
```

### E2E测试

- 关键流程添加E2E测试
- 使用Playwright或Cypress

```bash
npm run test:e2e
```

## 文档

- 更新相关的Markdown文档
- 添加JSDoc注释
- 更新CHANGELOG.md

## Pull Request检查清单

在提交PR之前，请确保：

- [ ] 代码遵循项目规范
- [ ] 添加了必要的测试
- [ ] 所有测试通过
- [ ] 更新了相关文档
- [ ] 提交信息规范
- [ ] 没有未解决的冲突
- [ ] PR描述清晰完整

## PR模板

```markdown
## 描述
简要描述这个PR的目的和改动

## 类型
- [ ] 新功能
- [ ] Bug修复
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化
- [ ] 其他

## 改动内容
- 改动点1
- 改动点2
- 改动点3

## 测试
描述如何测试这些改动

## 截图（如果适用）
添加截图说明改动

## 相关Issue
Closes #issue_number

## 检查清单
- [ ] 代码遵循规范
- [ ] 添加了测试
- [ ] 测试通过
- [ ] 更新了文档
- [ ] 自己review了代码
```

## 代码审查

所有PR都需要经过代码审查：

### 审查重点

1. **正确性**: 代码是否正确实现了功能
2. **性能**: 是否存在性能问题
3. **安全**: 是否存在安全漏洞
4. **可维护性**: 代码是否易于理解和维护
5. **测试**: 测试是否充分

### 审查流程

1. 维护者审查代码
2. 提出修改建议
3. 贡献者修改代码
4. 再次审查
5. 合并PR

## 开发环境

### 推荐工具

- **IDE**: VS Code
- **插件**:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - GitLens

### VS Code配置

`.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## 社区准则

### 行为准则

- 尊重他人
- 包容不同观点
- 接受建设性批评
- 关注对项目最有利的事情
- 对社区成员表示同理心

### 沟通

- 使用清晰、专业的语言
- 保持友好和建设性
- 避免人身攻击
- 尊重不同的意见和经验

## 获取帮助

如果您在贡献过程中遇到问题：

- 查看文档: [DEVELOPMENT.md](./DEVELOPMENT.md)
- 搜索已有的Issues
- 在GitHub Discussions提问
- 发送邮件: dev@example.com

## 认可贡献者

我们会在以下地方认可贡献者：

- README.md中的贡献者列表
- Release Notes中的感谢
- 项目网站的贡献者页面

## 许可证

通过贡献代码，您同意您的贡献将按照MIT许可证授权。

---

再次感谢您的贡献！🎉
