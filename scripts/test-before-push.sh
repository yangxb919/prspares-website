#!/bin/bash

# 在 push 到 GitHub 之前运行此脚本，确保所有检查都通过

echo "🧪 开始本地测试..."
echo ""

# 1. 类型检查
echo "📝 1/3 运行 TypeScript 类型检查..."
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ 类型检查失败！请修复错误后再试。"
  exit 1
fi
echo "✅ 类型检查通过"
echo ""

# 2. ESLint 检查
echo "🔧 2/3 运行 ESLint 代码检查..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ ESLint 检查失败！请修复错误后再试。"
  exit 1
fi
echo "✅ ESLint 检查通过"
echo ""

# 3. 构建测试
echo "🔨 3/3 运行构建测试..."
npm run build:fast
if [ $? -ne 0 ]; then
  echo "❌ 构建失败！请修复错误后再试。"
  exit 1
fi
echo "✅ 构建成功"
echo ""

echo "🎉 所有测试通过！可以安全 push 到 GitHub 了。"
echo ""
echo "运行以下命令 push："
echo "  git push origin master"

