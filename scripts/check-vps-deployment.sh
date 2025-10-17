#!/bin/bash

# VPS 部署检查脚本
# 用法: ssh root@your-vps-ip 'bash -s' < scripts/check-vps-deployment.sh

echo "=========================================="
echo "VPS 部署状态检查"
echo "=========================================="
echo ""

# 1. 检查应用目录
APP_DIR="/var/www/prspares-website"
echo "1. 检查应用目录: $APP_DIR"
if [ -d "$APP_DIR" ]; then
  echo "   ✅ 目录存在"
  echo "   最后修改时间: $(stat -c %y "$APP_DIR" 2>/dev/null || stat -f %Sm "$APP_DIR" 2>/dev/null)"
  cd "$APP_DIR"
  echo "   Git 分支: $(git branch --show-current 2>/dev/null || echo '未知')"
  echo "   最新提交: $(git log -1 --oneline 2>/dev/null || echo '未知')"
else
  echo "   ❌ 目录不存在"
fi
echo ""

# 2. 检查 Node.js 版本
echo "2. 检查 Node.js"
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
  echo "   ✅ NVM 已安装"
  echo "   Node 版本: $(node -v 2>/dev/null || echo '未安装')"
  echo "   npm 版本: $(npm -v 2>/dev/null || echo '未安装')"
else
  echo "   ❌ NVM 未安装"
fi
echo ""

# 3. 检查 PM2 状态
echo "3. 检查 PM2 进程"
if command -v pm2 >/dev/null 2>&1; then
  echo "   ✅ PM2 已安装"
  pm2 list
  echo ""
  echo "   prspares-website 进程详情:"
  pm2 describe prspares-website 2>/dev/null || echo "   ❌ 进程不存在"
else
  echo "   ❌ PM2 未安装"
fi
echo ""

# 4. 检查端口占用
echo "4. 检查端口 3000"
if command -v netstat >/dev/null 2>&1; then
  netstat -tlnp | grep :3000 || echo "   ❌ 端口 3000 未被占用"
elif command -v ss >/dev/null 2>&1; then
  ss -tlnp | grep :3000 || echo "   ❌ 端口 3000 未被占用"
else
  echo "   ⚠️  无法检查端口（netstat/ss 未安装）"
fi
echo ""

# 5. 检查应用健康状态
echo "5. 检查应用健康状态"
HTTP_STATUS=$(curl -I -sS http://127.0.0.1:3000/ 2>/dev/null | head -n 1)
if [ -n "$HTTP_STATUS" ]; then
  echo "   ✅ 应用响应: $HTTP_STATUS"
else
  echo "   ❌ 应用无响应"
fi
echo ""

# 6. 检查最近的 PM2 日志
echo "6. 最近的 PM2 错误日志 (最后 20 行)"
if command -v pm2 >/dev/null 2>&1; then
  pm2 logs prspares-website --err --lines 20 --nostream 2>/dev/null || echo "   无错误日志"
else
  echo "   ❌ PM2 未安装"
fi
echo ""

# 7. 检查磁盘空间
echo "7. 检查磁盘空间"
df -h / | tail -n 1
echo ""

# 8. 检查内存使用
echo "8. 检查内存使用"
free -h
echo ""

echo "=========================================="
echo "检查完成"
echo "=========================================="

