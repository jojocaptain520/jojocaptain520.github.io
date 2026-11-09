# 火星桌面 ZkDesk — 官方网站

火星桌面（ZkDesk）的产品官网，纯静态单页，**零构建、零依赖、无外部 CDN**，由 GitHub Pages 直接托管。

## 目录

```
site/
├── index.html              单页站点
├── .nojekyll               跳过 Jekyll 处理（必须保留）
├── assets/
│   ├── css/style.css       样式（设计令牌集中在 :root）
│   ├── js/main.js          交互：导航状态 / 移动端菜单 / 滚动动画 / 提示
│   └── img/
│       ├── logo-256.png    产品图标（从 main.ico 提取）
│       ├── favicon.png     站点图标
│       ├── shot-settings.png   设置中心截图
│       ├── shot-update.png     更新历史截图
│       └── shot-saver.png      屏保设置截图
└── README.md
```

## 本地预览

直接双击 `index.html` 即可；或用任意静态服务器：

```bash
python -m http.server 8080 --directory site
```

## 发布到 GitHub Pages

1. 新建仓库（建议 `zkdesk-site`，或 `<用户名>.github.io` 作为个人主页）
2. 把本目录**内容**推到仓库根目录
3. 仓库 Settings → Pages → Source 选 `Deploy from a branch`，分支 `main`、目录 `/ (root)`
4. 等 1–2 分钟，访问 `https://<用户名>.github.io/zkdesk-site/`

本目录已是一个独立的 git 仓库（含首次提交）。可直接用脚本推送：

```powershell
.\publish.ps1 -User <你的GitHub用户名>              # 仓库名默认 zkdesk-site
.\publish.ps1 -User <你的GitHub用户名> -Repo rorsoft
```

自定义域名：在仓库根放 `CNAME` 文件，内容为域名（如 `zkdesk.example.com`），并在 DNS 添加 CNAME 记录指向 `<用户名>.github.io`。

## 待替换的占位内容

| 位置 | 当前值 | 说明 |
| --- | --- | --- |
| `index.html` 中所有 `https://github.com/` | 占位 | 换成真实仓库地址 |
| 页脚「问题反馈」 | 占位 | 换成 Issues 地址或邮箱 |
| 下载按钮 | 「即将发布」 | 安装包发布后改为 Releases 直链 |
| `assets/img/shot-*.png` | 设置中心截图 | 可替换为桌面全景等更完整的截图 |

## 设计说明

- 品牌色沿用程序内主色 `#2F7DDA`（关于页链接色），深浅两套配色
- 字体使用系统字体栈（Segoe UI / 微软雅黑 / 苹方），中文优先，避免加载外部字体
- 响应式断点：1080 / 820 / 620
- 无障碍：跳转链接、`aria-*`、`prefers-reduced-motion` 降级
