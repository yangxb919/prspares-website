import { z } from 'zod';

// 邮箱验证
const emailSchema = z.string()
  .min(1, '邮箱不能为空')
  .email('请输入有效的邮箱地址');

// 密码验证
const passwordSchema = z.string()
  .min(8, '密码至少需要8个字符')
  .regex(/[A-Z]/, '密码必须包含至少一个大写字母')
  .regex(/[a-z]/, '密码必须包含至少一个小写字母')
  .regex(/[0-9]/, '密码必须包含至少一个数字')
  .regex(/[^A-Za-z0-9]/, '密码必须包含至少一个特殊字符');

// 电话号码验证
const phoneSchema = z.string()
  .regex(/^[\+]?[\d\s\-\(\)]{10,}$/, '请输入有效的电话号码')
  .optional();

// 联系表单 Schema
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, '姓名至少需要2个字符')
    .max(50, '姓名不能超过50个字符'),
  email: emailSchema,
  phone: phoneSchema,
  message: z.string()
    .min(10, '留言内容至少需要10个字符')
    .max(1000, '留言内容不能超过1000个字符'),
  requestType: z.enum(['contact', 'quote']).default('contact'),
  productName: z.string().optional(),
  productSku: z.string().optional(),
  company: z.string().optional()
});

// 报价表单 Schema
export const quoteFormSchema = z.object({
  name: z.string()
    .min(2, '姓名至少需要2个字符')
    .max(50, '姓名不能超过50个字符'),
  email: emailSchema,
  phone: z.string()
    .regex(/^[\+]?[\d\s\-\(\)]{10,}$/, '请输入有效的电话号码')
    .min(10, '请输入有效的电话号码'),
  company: z.string()
    .min(2, '公司名称至少需要2个字符')
    .max(100, '公司名称不能超过100个字符'),
  product: z.string()
    .min(1, '产品名称不能为空'),
  message: z.string()
    .min(10, '需求描述至少需要10个字符')
    .max(1000, '需求描述不能超过1000个字符'),
  source: z.string().default('Website')
});

// 登录表单 Schema
export const signInFormSchema = z.object({
  email: emailSchema,
  password: z.string()
    .min(1, '密码不能为空'),
  rememberMe: z.boolean().default(false)
});

// 注册表单 Schema
export const signUpFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  displayName: z.string()
    .min(2, '显示名称至少需要2个字符')
    .max(30, '显示名称不能超过30个字符')
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不匹配',
  path: ['confirmPassword']
});

// 重置密码表单 Schema
export const resetPasswordFormSchema = z.object({
  email: emailSchema
});

// 更新密码表单 Schema
export const updatePasswordFormSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不匹配',
  path: ['confirmPassword']
});

// 邮件订阅表单 Schema
export const newsletterFormSchema = z.object({
  email: emailSchema
});

// 文章表单 Schema
export const articleFormSchema = z.object({
  title: z.string()
    .min(5, '标题至少需要5个字符')
    .max(200, '标题不能超过200个字符'),
  slug: z.string()
    .min(5, 'URL别名至少需要5个字符')
    .max(100, 'URL别名不能超过100个字符')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'URL别名只能包含小写字母、数字和连字符'),
  excerpt: z.string()
    .min(50, '摘要至少需要50个字符')
    .max(500, '摘要不能超过500个字符'),
  content: z.string()
    .min(100, '内容至少需要100个字符'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featuredImage: z.string().url().optional(),
  seoTitle: z.string().max(60, 'SEO标题不能超过60个字符').optional(),
  seoDescription: z.string().max(160, 'SEO描述不能超过160个字符').optional(),
  publishedAt: z.string().optional()
});

// 产品表单 Schema
export const productFormSchema = z.object({
  name: z.string()
    .min(2, '产品名称至少需要2个字符')
    .max(100, '产品名称不能超过100个字符'),
  slug: z.string()
    .min(5, 'URL别名至少需要5个字符')
    .max(100, 'URL别名不能超过100个字符')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'URL别名只能包含小写字母、数字和连字符'),
  sku: z.string()
    .min(3, 'SKU至少需要3个字符')
    .max(50, 'SKU不能超过50个字符'),
  type: z.enum(['screen', 'battery', 'camera', 'accessory', 'other']),
  description: z.string()
    .min(20, '产品描述至少需要20个字符')
    .max(2000, '产品描述不能超过2000个字符'),
  shortDescription: z.string()
    .min(10, '简短描述至少需要10个字符')
    .max(200, '简短描述不能超过200个字符'),
  price: z.number()
    .min(0, '价格不能为负数'),
  comparePrice: z.number()
    .min(0, '比较价格不能为负数')
    .optional(),
  cost: z.number()
    .min(0, '成本不能为负数')
    .optional(),
  images: z.array(z.string().url()).optional(),
  status: z.enum(['active', 'inactive', 'discontinued']).default('active'),
  stock: z.number()
    .int('库存必须是整数')
    .min(0, '库存不能为负数')
    .default(0),
  weight: z.number()
    .min(0, '重量不能为负数')
    .optional(),
  dimensions: z.object({
    length: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0)
  }).optional(),
  features: z.array(z.string()).optional(),
  specifications: z.record(z.string()).optional(),
  seoTitle: z.string().max(60, 'SEO标题不能超过60个字符').optional(),
  seoDescription: z.string().max(160, 'SEO描述不能超过160个字符').optional()
});

// 搜索表单 Schema
export const searchFormSchema = z.object({
  query: z.string()
    .min(1, '搜索内容不能为空')
    .max(100, '搜索内容不能超过100个字符')
});

// 类型导出
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type QuoteFormData = z.infer<typeof quoteFormSchema>;
export type SignInFormData = z.infer<typeof signInFormSchema>;
export type SignUpFormData = z.infer<typeof signUpFormSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordFormSchema>;
export type NewsletterFormData = z.infer<typeof newsletterFormSchema>;
export type ArticleFormData = z.infer<typeof articleFormSchema>;
export type ProductFormData = z.infer<typeof productFormSchema>;
export type SearchFormData = z.infer<typeof searchFormSchema>;