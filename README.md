# 火星桌面 ZkDesk — 官方网站

火星桌面（ZkDesk）的产品官网，纯静态多页站点，**零构建、零依赖、无外部 CDN**，由 GitHub Pages 托管，自定义域名 <https://www.explus.work>。

## 目录

```
site/
├── index.html              首页
├── terms.html              用户协议
├── privacy.html            隐私政策
├── 404.html                404 页
├── CNAME                   自定义域名（www.explus.work）
├── robots.txt / sitemap.xml
├── .nojekyll               跳过 Jekyll 处理（必须保留）
├── publish.ps1             一键推送脚本
└── assets/
    ├── css/style.css       样式（设计令牌集中在 :root）
    ├── js/main.js          交互：导航状态 / 移动端菜单 / 滚动动画 / 灯箱 / 提示
    └── img/
        ├── logo.svg        矢量标志（三色缎带六边形）
        ├── logo-512.png    标志位图（分享 / 备用）
        ├── logo-180.png    iOS 主屏图标
        ├── favicon.png     站点图标
        ├── og.png          社交分享图 1200×630
        ├── hero-desktop.jpg  首页桌面实拍（1x / @2x）
        ├── shot-settings.png 设置中心
        ├── shot-saver.png    网页屏保
        └── shot-update.png   更新历史
```

## 本地预览

直接双击 `index.html`；或用任意静态服务器：

```bash
python -m http.server 8080 --directory site
```

## 发布到 GitHub Pages

仓库：`jojocaptain520/jojocaptain520.github.io`（用户主页仓库，域名才能落在 `www.explus.work`）。

```powershell
.\publish.ps1
```

推送后在仓库 Settings → Pages 选择 `main` 分支 `/ (root)`，Custom domain 填 `www.explus.work` 并勾选 Enforce HTTPS。

DNS 需要（在域名服务商处）：

| 类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| CNAME | www | jojocaptain520.github.io |
| A（可选，根域跳转） | @ | 185.199.108.153 等 GitHub Pages IP |

## 内容维护

| 位置 | 说明 |
| --- | --- |
| `index.html` | 功能卡片、更新日志、FAQ 文案 |
| `terms.html` / `privacy.html` | 协议与隐私条款；改动时同步更新页首「最后更新」日期 |
| `assets/img/hero-desktop.jpg` | 首页主视觉；重新生成见仓库外 `_preview/mock.html` |
| 下载按钮 | 安装包发布后把 `.btn-soon` 改成 `<a href="...Releases...">` |

## 设计说明

- 品牌色沿用程序内主色 `#2F7DDA`，深浅两套配色
- 字体使用系统字体栈（Segoe UI / 微软雅黑 / 苹方），中文优先，不加载外部字体
- 响应式断点：1080 / 820 / 620
- 无障碍：跳转链接、`aria-*`、`prefers-reduced-motion` 降级、无 JS 时内容仍可见
