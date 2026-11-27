# 火星桌面 marsDesk — 官方网站

火星桌面（marsDesk）的产品官网，纯静态多页站点，**零构建、零依赖、无外部 CDN**，由 GitHub Pages 托管，自定义域名 <https://www.explus.work>。

## 页面

- `index.html`：首页、核心能力、1.5 系列变化、产品展示、数据与联网说明、FAQ、下载。
- `screensavers.html`：20 款在线屏保，支持分类筛选与键盘灯箱。
- `changelog.html`：1.0.0.0 至 1.5.1.0 的稳定版更新记录。
- `terms.html`：用户协议。
- `privacy.html`：隐私政策。
- `404.html`：统一品牌的错误页。

## 目录

```text
site/
├── index.html
├── screensavers.html
├── changelog.html
├── terms.html
├── privacy.html
├── 404.html
├── CNAME
├── robots.txt / sitemap.xml
├── .nojekyll
├── publish.ps1
└── assets/
    ├── css/style.css
    ├── js/main.js
    ├── video/papercraft-city-sunrise.mp4
    └── img/
        ├── logo.svg / logo-512.png / logo-180.png / favicon.png
        ├── og.jpg
        ├── hero-desktop.jpg / hero-desktop@2x.jpg
        ├── shot-settings.png / shot-update.png
        ├── shot-saver-settings.png / shot-saver-online.png
        ├── themes/*.webp
        ├── screensavers/*.webp
        └── wallpapers/papercraft-city-sunrise.jpg
```

## 本地预览

直接双击 `index.html`，或用静态服务器：

```powershell
python -m http.server 8080 --directory site
```

访问 <http://localhost:8080/>。

## 发布到 GitHub Pages

仓库：`jojocaptain520/jojocaptain520.github.io`，分支 `main`，根目录。

```powershell
.\publish.ps1
```

发布前请确认 `CNAME`、`.nojekyll` 和所有本地资源均已保留。

## 内容维护

| 位置 | 说明 |
| --- | --- |
| `index.html` | 首页功能、版本变化、FAQ、数据与联网说明 |
| `screensavers.html` | 20 款屏保名称、简介、分类与封面 |
| `changelog.html` | 稳定版更新记录；产品发布后同步 |
| `terms.html` / `privacy.html` | 法律文本；改动时同步更新页首日期与版本 |
| 下载按钮 | 固定指向 `https://update.explus.work/deskupdate/stable/x64/latest.zip` |
| 版本与包大小 | 当前静态写在页面中；发版时统一更新，不再从 `latest.json` 自动读取 |

## 设计与无障碍

- 内容优先的现代产品布局，轻纸艺细节。
- 品牌色 `#2F7DDA`，暖白纸底与深墨文字。
- 系统字体栈，不加载外部字体。
- 响应式断点：1080 / 820 / 620。
- 支持跳转链接、键盘灯箱、`aria-*`、`prefers-reduced-motion`。
- 动态壁纸演示在移动端与减少动态模式下不自动播放。
