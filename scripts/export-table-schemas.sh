#!/bin/bash

# 导出源数据库的表结构
# 只导出需要迁移的表

echo "🔍 导出源数据库表结构..."
echo ""

SOURCE_HOST="db.eiikisplpnbeiscunkap.supabase.co"
SOURCE_PORT="5432"
SOURCE_DB="postgres"
SOURCE_USER="postgres"

OUTPUT_DIR="./supabase/exported_schema"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_FILE="${OUTPUT_DIR}/tables_schema_${TIMESTAMP}.sql"

mkdir -p "$OUTPUT_DIR"

echo "📋 需要导出的表:"
echo "   - categories"
echo "   - tags"
echo "   - profiles"
echo "   - products"
echo "   - prices"
echo "   - posts"
echo "   - post_tags"
echo ""

echo "🔐 请输入源数据库密码:"
read -s DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo "❌ 错误: 密码不能为空"
    exit 1
fi

echo "📤 正在导出表结构..."

# 导出指定表的结构
PGPASSWORD="$DB_PASSWORD" pg_dump \
  -h "$SOURCE_HOST" \
  -p "$SOURCE_PORT" \
  -U "$SOURCE_USER" \
  -d "$SOURCE_DB" \
  --schema-only \
  --no-owner \
  --no-privileges \
  --no-tablespaces \
  --table=public.categories \
  --table=public.tags \
  --table=public.profiles \
  --table=public.products \
  --table=public.prices \
  --table=public.posts \
  --table=public.post_tags \
  --file="$OUTPUT_FILE"

if [ $? -eq 0 ]; then
    echo "✅ 导出成功！"
    echo ""
    echo "📄 文件位置: $OUTPUT_FILE"
    echo "📊 文件大小: $(du -h "$OUTPUT_FILE" | cut -f1)"
    echo ""
    echo "📝 下一步:"
    echo "   1. 检查导出的 SQL 文件"
    echo "   2. 在目标数据库的 SQL Editor 中运行此文件"
    echo "   3. 然后重新运行数据迁移脚本"
else
    echo "❌ 导出失败！"
    exit 1
fi

