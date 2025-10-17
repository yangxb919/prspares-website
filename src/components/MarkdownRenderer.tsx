'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { QuoteButtonDefault, QuoteButtonCTA, QuoteButtonInline, QuoteButtonBanner } from './QuoteButton';

interface MarkdownRendererProps {
  content: string;
  articleTitle?: string;
  className?: string;
}

export default function MarkdownRenderer({ content, articleTitle, className = '' }: MarkdownRendererProps) {
  // 预处理内容，将特殊标记转换为组件
  const processContent = (markdown: string) => {
    return markdown
      // 处理引用按钮的各种变体
      .replace(
        /\[([^\]]+)\]\(quote:([^)]*)\)/g,
        '<QuoteButton text="$1" productName="$2" />'
      )
      .replace(
        /\[([^\]]+)\]\(quote-cta:([^)]*)\)/g,
        '<QuoteButtonCTA text="$1" productName="$2" />'
      )
      .replace(
        /\[([^\]]+)\]\(quote-inline:([^)]*)\)/g,
        '<QuoteButtonInline text="$1" productName="$2" />'
      )
      .replace(
        /\[([^\]]+)\]\(quote-banner:([^)]*)\)/g,
        '<QuoteButtonBanner text="$1" productName="$2" />'
      )
      // 处理简化语法
      .replace(
        /\[([^\]]+)\]\(quote\)/g,
        '<QuoteButton text="$1" />'
      );
  };

  const components = {
    // 自定义组件渲染
    QuoteButton: ({ text, productName }: { text?: string; productName?: string }) => (
      <QuoteButtonDefault text={text} productName={productName} articleTitle={articleTitle} />
    ),
    QuoteButtonCTA: ({ text, productName }: { text?: string; productName?: string }) => (
      <QuoteButtonCTA text={text} productName={productName} articleTitle={articleTitle} />
    ),
    QuoteButtonInline: ({ text, productName }: { text?: string; productName?: string }) => (
      <QuoteButtonInline text={text} productName={productName} articleTitle={articleTitle} />
    ),
    QuoteButtonBanner: ({ text, productName }: { text?: string; productName?: string }) => (
      <QuoteButtonBanner text={text} productName={productName} articleTitle={articleTitle} />
    ),

    // 标准Markdown元素的样式 - 修复类型问题
    h1: ({ children, ...props }: any) => (
      <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8" {...props}>{children}</h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-6" {...props}>{children}</h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 className="text-xl font-bold text-gray-900 mb-3 mt-5" {...props}>{children}</h3>
    ),
    h4: ({ children, ...props }: any) => (
      <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-4" {...props}>{children}</h4>
    ),
    p: ({ children, ...props }: any) => (
      <p className="text-gray-700 mb-4 leading-relaxed" {...props}>{children}</p>
    ),
    ul: ({ children, ...props }: any) => (
      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1" {...props}>{children}</ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1" {...props}>{children}</ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="mb-1" {...props}>{children}</li>
    ),
    blockquote: ({ children, ...props }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 text-gray-700 italic" {...props}>
        {children}
      </blockquote>
    ),
    code: ({ children, ...props }: any) => (
      <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    ),
    pre: ({ children, ...props }: any) => (
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props}>
        {children}
      </pre>
    ),
    a: ({ href, children, ...props }: any) => (
      <a
        href={href}
        className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 font-medium transition-colors duration-200 hover:bg-blue-50 px-1 py-0.5 rounded"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    ),
    img: ({ src, alt, ...props }: any) => {
      const base = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      let supabaseOrigin = '';
      try { supabaseOrigin = base ? new URL(base).origin : ''; } catch {}
      const normalize = (input?: string): string => {
        if (!input) return '';
        let url = String(input).trim().replace(/^\"|\"$/g, '').replace(/^'|'$/g, '');
        if (!url) return '';
        if (url.startsWith('data:')) return url;
        if (url.startsWith('//')) url = `https:${url}`;
        if (url.startsWith('http://')) url = `https://${url.slice(7)}`;
        if (/^\/?storage\/v1\//i.test(url) && supabaseOrigin) {
          url = `${supabaseOrigin}/${url.replace(/^\//,'')}`;
        } else if (/^\/?post-images\//i.test(url) && supabaseOrigin) {
          url = `${supabaseOrigin}/storage/v1/object/public/${url.replace(/^\//,'')}`;
        } else if (/^[\w.-]+\.[A-Za-z]{2,}\/.*$/.test(url) && !/^https?:/i.test(url)) {
          url = `https://${url}`;
        }
        try { url = encodeURI(url); } catch {}
        return url;
      };
      const safeSrc = normalize(typeof src === 'string' ? src : (src as any));
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[MarkdownRenderer img] raw=', src, ' normalized=', safeSrc);
      }
      return (
        <img
          src={safeSrc}
          alt={alt}
          className="max-w-full h-auto rounded-lg shadow-md my-4"
          referrerPolicy="no-referrer"
          {...props}
        />
      );
    },
    table: ({ children, ...props }: any) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border-collapse border border-gray-300" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }: any) => (
      <th className="border border-gray-300 bg-gray-50 px-4 py-2 text-left font-semibold text-gray-900" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td className="border border-gray-300 px-4 py-2 text-gray-700" {...props}>{children}</td>
    ),
  };

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {processContent(content)}
      </ReactMarkdown>
    </div>
  );
}
