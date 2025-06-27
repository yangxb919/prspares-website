// 产品类型定义

// 产品规格类型
export interface ProductSpec {
  name: string;
  value: string;
}

// 产品图片类型
export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
}

// 产品元数据类型
export interface ProductMeta {
  features?: string[];
  applications?: string[];
  materials?: string[];
  [key: string]: any;
}

// 数据库产品类型（匹配Supabase表结构）
export interface Product {
  id: number;
  author_id?: string;
  name: string;
  slug: string;
  sku?: string;
  type?: string;
  short_desc?: string;
  description?: string;
  regular_price?: number;
  sale_price?: number;
  sale_start?: string;
  sale_end?: string;
  tax_status?: string;
  stock_status?: string;
  stock_quantity?: number;
  weight?: number;
  dim_length?: number;
  dim_width?: number;
  dim_height?: number;
  attributes?: any[];
  images?: ProductImage[];
  status: 'draft' | 'publish';
  created_at?: string;
  updated_at?: string;
  meta?: ProductMeta;
}

// 前端产品卡片类型
export interface ProductCard {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: string;
  price?: number;
  currency?: string;
  imageSrc: string;
  features?: string[];
}

// 产品分类类型
export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

// 产品标签类型
export interface ProductTag {
  id: number;
  name: string;
  slug: string;
}

// 扩展的产品类型（包含关联数据）
export interface ProductWithRelations extends Product {
  product_to_category?: {
    product_categories: ProductCategory;
  }[];
  product_to_tag?: {
    product_tags: ProductTag;
  }[];
} 