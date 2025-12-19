#!/bin/bash

# Supabase 数据库结构导出脚本
# 用于导出数据库表结构（不包含数据）

echo "🔍 Supabase 数据库结构导出工具"
echo "================================"
echo ""

# 源数据库配置
SOURCE_HOST="prspares.zeabur.app"
SOURCE_PORT="5432"
SOURCE_DB="postgres"
SOURCE_USER="postgres"

# 输出文件
OUTPUT_DIR="./supabase/exported_schema"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_FILE="${OUTPUT_DIR}/schema_${TIMESTAMP}.sql"

# 创建输出目录
mkdir -p "$OUTPUT_DIR"

echo "📋 配置信息:"
echo "  主机: $SOURCE_HOST"
echo "  端口: $SOURCE_PORT"
echo "  数据库: $SOURCE_DB"
echo "  用户: $SOURCE_USER"
echo ""

# 提示输入密码
echo "🔐 请输入数据库密码:"
read -s DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo "❌ 错误: 密码不能为空"
    exit 1
fi

echo "📤 开始导出数据库结构..."
echo ""

# 导出数据库结构（只包含 public schema）
PGPASSWORD="$DB_PASSWORD" pg_dump \
  -h "$SOURCE_HOST" \
  -p "$SOURCE_PORT" \
  -U "$SOURCE_USER" \
  -d "$SOURCE_DB" \
  --schema-only \
  --schema=public \
  --no-owner \
  --no-privileges \
  --no-tablespaces \
  --no-security-labels \
  --no-comments \
  --file="$OUTPUT_FILE"

if [ $? -eq 0 ]; then
    echo "✅ 导出成功！"
    echo ""
    echo "📄 文件位置: $OUTPUT_FILE"
    echo "📊 文件大小: $(du -h "$OUTPUT_FILE" | cut -f1)"
    echo ""
    echo "💡 提示:"
    echo "  1. 请检查导出的 SQL 文件"
    echo "  2. 在新数据库中运行此文件以创建表结构"
    echo "  3. 然后使用数据迁移脚本导入数据"
else
    echo "❌ 导出失败！"
    echo ""
    echo "可能的原因:"
    echo "  1. 密码错误"
    echo "  2. 网络连接问题"
    echo "  3. 未安装 pg_dump 工具"
    echo ""
    echo "💡 安装 PostgreSQL 客户端工具:"
    echo "  macOS: brew install postgresql"
    echo "  Ubuntu: sudo apt-get install postgresql-client"
    exit 1
fi

