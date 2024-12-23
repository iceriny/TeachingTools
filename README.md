# 教学与日常使用工具集合

![MIT License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-0.4.3-blue)

一套为教学和日常需求设计的工具集合，提供便捷的功能与可视化工具。

---

### 快速开始

-   [![Netlify Status](https://api.netlify.com/api/v1/badges/7b11915d-ef16-47de-a5e2-8bd3a776e19b/deploy-status)](https://app.netlify.com/sites/teachingtool/deploys)

1. 打开 >[TeachingTools](https://teachingtool.netlify.app/)< 页面。
2. 选择所需的工具并按照提示操作。

---

## 功能列表

已实现的功能：

-   ✅ 骰子工具
-   ✅ 程序执行演示器
-   ✅ 随机数生成器
-   ✅ 二维码生成器
-   ✅ 工具黄页
    -   ⬜ 持续更新
-   ✅ 时间工具（倒计时、日期时间计算等）

计划中的功能：

-   ⬜ Markdown 实时编辑器
-   ⬜ 正则表达式验证工具

---

## 本地部署

以下是项目的本地部署步骤：

### 环境要求

-   **Node.js** (建议使用最新的 LTS 版本)
-   **Yarn** (包管理器)

### 部署步骤

1. 克隆项目到本地：

    ```bash
    git clone <仓库地址>
    cd <项目文件夹>
    ```

2. 安装依赖：

    ```bash
    yarn
    ```

3. 构建项目：

    ```bash
    yarn run build
    ```

4. 启动开发服务器（可选）：

    ```bash
    yarn run dev
    ```

5. 使用浏览器访问 `http://localhost:3000` 以查看项目。（可选）

    - 如果端口冲突, 请在`vite.config.ts`如下位置修改端口:

        ```typescript
        export default defineConfig({
            server: {
                port: 3000, // 修改端口号
            },
            // ...其他配置
        });
        ```

6. 构建生产环境版本：
    ```
    yarn run build
    ```

---

## 贡献指南

这是一个自用工具集合，旨在方便教学和日常操作。如果这个项目对您有帮助，我们将感到非常高兴。

### 开源精神

本项目完全开源，欢迎任何人参与贡献！您可以通过以下方式帮助我们改进：

1. 提交 Issue：报告 Bug 或提出功能需求。
2. 提交 Pull Request：完善代码、修复问题或添加新功能。

### 贡献流程

1. Fork 仓库。
2. 创建新分支：
    ```bash
    git checkout -b feature/<功能名称>
    ```
3. 提交更改：
    ```bash
    git commit -m "描述你的更改"
    ```
4. 推送到远程分支：
    ```bash
    git push origin feature/<功能名称>
    ```
5. 创建 Pull Request。

---

## 许可证

本项目遵循 [MIT 许可证](./LICENSE)，您可以自由使用和修改代码。

---

## 联系方式

如有任何问题或建议，请通过以下方式与我们联系：

-   提交 Issue
-   发送邮件至 [your-email@example.com]
