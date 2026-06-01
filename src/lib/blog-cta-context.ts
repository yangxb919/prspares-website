/**
 * 按文章 category / tags / title 推断最相关的产品上下文，
 * 用于 blog CTA 的预填深链 (/wholesale-inquiry?product=...) 和文案。
 *
 * 目的：CTA 越贴文章主题，点击率越高；预填降低询盘表单摩擦。
 * 这是「流量增长 30 天方案」腿1（转化漏桶）的一部分。
 */

export interface BlogCtaContext {
  /** 预填到询盘表单的产品名（也是 ?product= 的值） */
  product: string;
  /** CTA 主文案 */
  headline: string;
  /** CTA 副文案 */
  sub: string;
}

const DEFAULT_CONTEXT: BlogCtaContext = {
  product: '',
  headline: 'Need Wholesale Phone Repair Parts?',
  sub: 'Factory-direct pricing from Shenzhen — OEM-quality screens, batteries & small parts.',
};

/** 关键词 → 上下文。按从具体到宽泛的顺序匹配，命中即返回。 */
const RULES: Array<{ match: RegExp; ctx: BlogCtaContext }> = [
  {
    match: /back\s*glass|rear glass/i,
    ctx: {
      product: 'iPhone Back Glass',
      headline: 'Sourcing iPhone Back Glass in Bulk?',
      sub: 'Factory-direct back glass for all iPhone models — wholesale pricing, fast lead time.',
    },
  },
  {
    match: /charging port|charge port|usb-c|lightning port/i,
    ctx: {
      product: 'Charging Port Flex',
      headline: 'Need Charging Port Flex in Bulk?',
      sub: 'Wholesale charging port assemblies for iPhone & Samsung — tested, factory-direct.',
    },
  },
  {
    match: /battery|draining|lithium/i,
    ctx: {
      product: 'Phone Battery',
      headline: 'Buying Phone Batteries Wholesale?',
      sub: 'OEM-cell batteries with safety packaging — iPhone, Samsung & more, factory-direct.',
    },
  },
  {
    match: /\boled\b|incell|lcd|screen|display|touch/i,
    ctx: {
      product: 'iPhone Screen',
      headline: 'Sourcing Replacement Screens in Bulk?',
      sub: 'Incell / Hard OLED / Soft OLED grades — wholesale pricing, grade comparison on request.',
    },
  },
  {
    match: /camera/i,
    ctx: {
      product: 'Rear Camera Module',
      headline: 'Need Camera Modules in Bulk?',
      sub: 'Wholesale rear camera assemblies — tested, factory-direct pricing.',
    },
  },
  {
    match: /ipad|tablet/i,
    ctx: {
      product: 'iPad Parts',
      headline: 'Sourcing iPad Parts Wholesale?',
      sub: 'Screens, batteries & flex for iPad — factory-direct pricing for repair shops.',
    },
  },
  {
    match: /wholesale|supplier|sourcing|gray market|verify|moq|bulk/i,
    ctx: {
      product: '',
      headline: 'Looking for a Reliable Wholesale Parts Supplier?',
      sub: 'Factory-direct from Shenzhen — transparent grades, invoices & 12-month warranty.',
    },
  },
];

/**
 * @param category 文章分类（meta.category）
 * @param tags 文章标签
 * @param title 文章标题
 */
export function getBlogCtaContext(
  category?: string | null,
  tags?: string[] | null,
  title?: string | null,
): BlogCtaContext {
  const haystack = [category || '', (tags || []).join(' '), title || ''].join(' ').toLowerCase();
  for (const rule of RULES) {
    if (rule.match.test(haystack)) return rule.ctx;
  }
  return DEFAULT_CONTEXT;
}

/** 生成带预填的询盘页深链 */
export function wholesaleInquiryHref(product: string): string {
  return product
    ? `/wholesale-inquiry?product=${encodeURIComponent(product)}`
    : '/wholesale-inquiry';
}
