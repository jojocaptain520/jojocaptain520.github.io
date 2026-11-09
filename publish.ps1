# 一键把本站推到 GitHub 并启用 Pages
# 用法：
#   .\publish.ps1                                  # 默认推到 jojocaptain520/jojocaptain520.github.io
#   .\publish.ps1 -Repo zkdesk-site                # 指定其它仓库名
# 前提：已在本机登录 GitHub（git credential manager 或 gh auth login）

param(
  [string]$User = 'jojocaptain520',
  [string]$Repo = 'jojocaptain520.github.io',
  [string]$Branch = 'main'
)

$ErrorActionPreference = 'Stop'
$remote = "https://github.com/$User/$Repo.git"

Write-Host "→ 目标仓库: $remote" -ForegroundColor Cyan

if (-not (Test-Path '.git')) {
  Write-Host "→ 初始化本地仓库" -ForegroundColor Yellow
  git init -b $Branch | Out-Null
}

git add -A
if ((git status --porcelain)) {
  git commit -m "更新官网内容" | Out-Null
  Write-Host "→ 已提交本地改动" -ForegroundColor Green
}

$existing = (git remote 2>$null) -contains 'origin'
if ($existing) {
  git remote set-url origin $remote
} else {
  git remote add origin $remote
}

Write-Host "→ 推送 $Branch ..." -ForegroundColor Cyan
git push -u origin $Branch

$pagesUrl = if ($Repo -eq "$User.github.io") { "https://$User.github.io/" } else { "https://$User.github.io/$Repo/" }
Write-Host ""
Write-Host "推送完成。接下来（只需做一次）：" -ForegroundColor Green
Write-Host "  1. 打开 https://github.com/$User/$Repo/settings/pages"
Write-Host "  2. Source 选 Deploy from a branch → 分支 $Branch → 目录 / (root) → Save"
Write-Host "  3. Custom domain 填 www.explus.work，勾选 Enforce HTTPS"
Write-Host "  4. 等 1-2 分钟，访问 https://www.explus.work/" -ForegroundColor Cyan
Write-Host ""
Write-Host "提示：仓库需要是 Public，GitHub Pages 才对免费账号开放；CNAME 文件已包含 www.explus.work。" -ForegroundColor DarkYellow
