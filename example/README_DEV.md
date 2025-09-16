# jsMind 开发环境配置指南

本指南说明如何正确使用 rollup 构建系统进行开发和调试。

## 🎯 开发理念

-   **使用构建后的文件**：始终使用 rollup 构建的 es6 目录文件，不直接使用 src 源码
-   **标准开发流程**：修改源码 → 构建 → 测试
-   **环境自动切换**：开发环境使用本地构建文件，生产环境使用 CDN

## 🚀 快速开始

### 标准开发流程

```bash
# 1. 安装依赖
npm install

# 2. 构建并启动开发服务器
npm run dev

# 或者分步执行：
npm run build          # 构建项目
npm run server         # 启动服务器
```

### 监听模式开发（推荐）

```bash
# 监听源码变化，自动重新构建
npm run dev:watch

# 在另一个终端启动服务器
npm run server
```

### 针对示例页面的开发

```bash
# 构建并配置示例页面为开发模式
npm run dev:server

# 切换示例页面到生产模式
npm run prod-examples
```

## 🔧 开发流程详解

### 1. 修改源码

编辑 `src/` 目录下的文件：

-   `src/jsmind.js` - 核心库
-   `src/jsmind.*.js` - 各个模块
-   `src/plugins/` - 插件代码

### 2. 构建项目

```bash
npm run build
```

这会将 src 目录下的 ES6 模块源码打包成 es6 目录下的可用文件。

### 3. 测试验证

```bash
# 启动开发服务器
npm run server

# 访问示例页面
http://localhost:8080/example/2_features_cn.html
```

## 📋 文件结构说明

```
jsmind/
├── src/                  # 源码目录（开发时修改）
│   ├── jsmind.js        # 主文件
│   ├── jsmind.*.js      # 各个模块
│   └── plugins/         # 插件源码
├── es6/                  # 构建输出（实际使用）
│   ├── jsmind.js        # 构建后的主文件
│   └── *.js             # 构建后的其他文件
├── example/              # 示例页面
│   ├── 2_features_cn.html  # 主要演示页面
│   └── rich_text_multiline.html  # 富文本演示
└── style/               # 样式文件
    └── jsmind.css
```

## 🎨 开发新功能的流程

### 例：添加富文本功能

1. **修改源码**

    ```bash
    # 编辑核心选项
    vim src/jsmind.option.js

    # 编辑视图提供者
    vim src/jsmind.view_provider.js

    # 编辑工具函数
    vim src/jsmind.util.js
    ```

2. **构建测试**

    ```bash
    # 构建项目
    npm run build

    # 启动服务器测试
    npm run server
    ```

3. **调试优化**

    ```bash
    # 开启监听模式，源码变化自动构建
    npm run dev:watch

    # 修改源码 → 自动构建 → 刷新浏览器测试
    ```

## 🌐 环境说明

### 开发环境

-   **检测条件**：localhost、127.0.0.1、file:// 协议，或 URL 参数包含 `dev=true`
-   **资源加载**：使用本地 `../es6/jsmind.js` 和 `../style/jsmind.css`
-   **特色功能**：启用富文本和多行编辑功能
-   **日志输出**：详细的开发日志

### 生产环境

-   **检测条件**：其他所有情况
-   **资源加载**：使用 CDN 资源
-   **优化配置**：标准配置，性能优先

## 📝 npm 脚本说明

| 命令                    | 功能             | 使用场景           |
| ----------------------- | ---------------- | ------------------ |
| `npm run build`         | 构建项目         | 修改源码后必须执行 |
| `npm run dev`           | 构建+启动服务器  | 一键开发模式       |
| `npm run dev:watch`     | 监听构建         | 持续开发，推荐     |
| `npm run dev:server`    | 开发环境示例页面 | 测试示例页面       |
| `npm run server`        | 启动 HTTP 服务器 | 查看构建结果       |
| `npm run prod-examples` | 生产环境示例页面 | 准备发布           |
| `npm test`              | 运行测试         | 验证功能正确性     |

## 🛠️ 调试技巧

### 1. 查看构建输出

```bash
# 查看构建后的文件
ls -la es6/

# 检查主文件大小
wc -l es6/jsmind.js
```

### 2. 验证 ES6 模块

```javascript
// 在浏览器控制台测试
import('./es6/jsmind.js').then(module => {
    console.log('jsMind loaded:', module.default);
});
```

### 3. 开发环境标识

浏览器控制台会显示：

```
🔧 开发环境：使用本地构建文件
✅ 本地jsMind加载成功
✅ 开发环境初始化完成
```

## 🔄 工作流最佳实践

### 日常开发

```bash
# 开启监听模式（推荐）
npm run dev:watch    # 终端1：自动构建
npm run server       # 终端2：HTTP服务器

# 修改src代码 → 自动构建 → 刷新浏览器测试
```

### 功能测试

```bash
# 构建并测试
npm run build
npm run dev:server

# 访问 http://localhost:8080/example/2_features_cn.html
```

### 发布准备

```bash
# 切换到生产模式
npm run prod-examples

# 最终构建
npm run build

# 运行测试
npm test
```

## ⚠️ 注意事项

1. **始终构建后测试**：修改 src 代码后必须运行 `npm run build`
2. **不要直接使用 src**：示例页面不应该直接引用 src 目录文件
3. **使用 ES6 模块**：构建输出是 ES6 模块，支持现代浏览器
4. **检查构建错误**：如果功能异常，先检查构建过程是否有错误
5. **监听模式开发**：推荐使用 `npm run dev:watch` 进行持续开发

这样的开发流程确保了代码质量和构建一致性，同时提供了高效的开发体验。
