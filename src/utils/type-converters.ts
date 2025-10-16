// 统一的类型转换工具
// 解决Supabase查询返回unknown类型的问题

import { Product } from '@/types/product';
import { Post } from '@/types/blog';

// 安全的类型转换函数
export function safeConvert<T>(data: any, defaultValue: T): T {
  if (!data) return defaultValue;
  return data as T;
}

// 安全的字符串转换
export function safeString(value: unknown, defaultValue: string = ''): string {
  if (value === null || value === undefined) return defaultValue;
  return String(value);
}

// 安全的数字转换
export function safeNumber(value: unknown, defaultValue: number = 0): number {
  if (value === null || value === undefined) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

// 安全的布尔转换
export function safeBoolean(value: unknown, defaultValue: boolean = false): boolean {
  if (value === null || value === undefined) return defaultValue;
  return Boolean(value);
}

// 安全的数组转换
export function safeArray<T>(value: unknown, defaultValue: T[] = []): T[] {
  if (!Array.isArray(value)) return defaultValue;
  return value as T[];
}

// 安全的对象转换
export function safeObject(value: unknown, defaultValue: any = {}): any {
  if (typeof value !== 'object' || value === null) return defaultValue;
  return value;
}

// Product类型转换器
export function convertToProduct(data: any): Product {
  if (!data) throw new Error('Product data is required');
  
  return {
    id: safeNumber(data.id),
    author_id: safeString(data.author_id),
    name: safeString(data.name),
    slug: safeString(data.slug),
    sku: data.sku ? safeString(data.sku) : undefined,
    type: data.type ? safeString(data.type) : undefined,
    short_desc: data.short_desc ? safeString(data.short_desc) : undefined,
    description: data.description ? safeString(data.description) : undefined,
    regular_price: data.regular_price ? safeNumber(data.regular_price) : undefined,
    sale_price: data.sale_price ? safeNumber(data.sale_price) : undefined,
    sale_start: data.sale_start ? safeString(data.sale_start) : undefined,
    sale_end: data.sale_end ? safeString(data.sale_end) : undefined,
    tax_status: data.tax_status ? safeString(data.tax_status) : undefined,
    stock_status: data.stock_status ? safeString(data.stock_status) : undefined,
    stock_quantity: data.stock_quantity ? safeNumber(data.stock_quantity) : undefined,
    weight: data.weight ? safeNumber(data.weight) : undefined,
    dim_length: data.dim_length ? safeNumber(data.dim_length) : undefined,
    dim_width: data.dim_width ? safeNumber(data.dim_width) : undefined,
    dim_height: data.dim_height ? safeNumber(data.dim_height) : undefined,
    attributes: safeArray(data.attributes),
    images: safeArray(data.images),
    status: (data.status === 'publish' || data.status === 'draft') ? data.status : 'draft',
    created_at: data.created_at ? safeString(data.created_at) : undefined,
    updated_at: data.updated_at ? safeString(data.updated_at) : undefined,
    meta: safeObject(data.meta)
  };
}

// Post类型转换器
export function convertToPost(data: any): Post {
  if (!data) throw new Error('Post data is required');
  
  return {
    id: safeNumber(data.id),
    title: safeString(data.title),
    slug: safeString(data.slug),
    content: data.content ? safeString(data.content) : undefined,
    excerpt: data.excerpt ? safeString(data.excerpt) : undefined,
    status: (data.status === 'draft' || data.status === 'publish' || data.status === 'private') 
      ? data.status : 'draft',
    published_at: data.published_at ? safeString(data.published_at) : undefined,
    created_at: data.created_at ? safeString(data.created_at) : undefined,
    updated_at: data.updated_at ? safeString(data.updated_at) : undefined,
    author_id: safeString(data.author_id),
    meta: safeObject(data.meta),
    profiles: data.profiles ? safeObject(data.profiles) : undefined
  };
}

// 批量转换函数
export function convertToProducts(dataArray: any[]): Product[] {
  if (!Array.isArray(dataArray)) return [];
  return dataArray.map(convertToProduct);
}

export function convertToPosts(dataArray: any[]): Post[] {
  if (!Array.isArray(dataArray)) return [];
  return dataArray.map(convertToPost);
}

// 通用的联系表单类型
export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  message: string;
  phone?: string;
  company?: string;
  subject?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

// 联系表单转换器
export function convertToContactSubmission(data: any): ContactSubmission {
  if (!data) throw new Error('Contact submission data is required');
  
  return {
    id: safeNumber(data.id),
    name: safeString(data.name),
    email: safeString(data.email),
    message: safeString(data.message),
    phone: data.phone ? safeString(data.phone) : undefined,
    company: data.company ? safeString(data.company) : undefined,
    subject: data.subject ? safeString(data.subject) : undefined,
    status: safeString(data.status, 'new'),
    created_at: safeString(data.created_at),
    updated_at: data.updated_at ? safeString(data.updated_at) : undefined
  };
}

// 通用的新闻订阅类型
export interface NewsletterSubscription {
  id: number;
  email: string;
  status: string;
  ip_address?: string;
  user_agent?: string;
  source?: string;
  confirmed_at?: string;
  created_at: string;
}

// 新闻订阅转换器
export function convertToNewsletterSubscription(data: any): NewsletterSubscription {
  if (!data) throw new Error('Newsletter subscription data is required');
  
  return {
    id: safeNumber(data.id),
    email: safeString(data.email),
    status: safeString(data.status, 'pending'),
    ip_address: data.ip_address ? safeString(data.ip_address) : undefined,
    user_agent: data.user_agent ? safeString(data.user_agent) : undefined,
    source: data.source ? safeString(data.source) : undefined,
    confirmed_at: data.confirmed_at ? safeString(data.confirmed_at) : undefined,
    created_at: safeString(data.created_at)
  };
}

// SEO信息类型
export interface PostSEOInfo {
  id: number;
  title: string;
  slug: string;
  status: string;
  published_at?: string;
  meta?: any;
}

// SEO信息转换器
export function convertToPostSEOInfo(data: any): PostSEOInfo {
  if (!data) throw new Error('Post SEO info data is required');
  
  return {
    id: safeNumber(data.id),
    title: safeString(data.title),
    slug: safeString(data.slug),
    status: safeString(data.status),
    published_at: data.published_at ? safeString(data.published_at) : undefined,
    meta: safeObject(data.meta)
  };
}

// 批量转换函数
export function convertToContactSubmissions(dataArray: any[]): ContactSubmission[] {
  if (!Array.isArray(dataArray)) return [];
  return dataArray.map(convertToContactSubmission);
}

export function convertToNewsletterSubscriptions(dataArray: any[]): NewsletterSubscription[] {
  if (!Array.isArray(dataArray)) return [];
  return dataArray.map(convertToNewsletterSubscription);
}

export function convertToPostSEOInfos(dataArray: any[]): PostSEOInfo[] {
  if (!Array.isArray(dataArray)) return [];
  return dataArray.map(convertToPostSEOInfo);
}
