'use client';

import React, { useState, useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCursorChange?: (start: number, end: number) => void;
  uploadingImage?: boolean;
  onImageUpload?: () => void;
  onInsertQuoteButton?: (type: string) => void;
  placeholder?: string;
  rows?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  onCursorChange,
  uploadingImage = false,
  onImageUpload,
  onInsertQuoteButton,
  placeholder = "文章内容 (支持Markdown格式)",
  rows = 15,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showQuoteButtonMenu, setShowQuoteButtonMenu] = useState(false);

  // 预定义的颜色
  const colors = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC',
    '#FF0000', '#FF6600', '#FFCC00', '#00FF00', '#0099FF',
    '#0066CC', '#9933FF', '#FF3399', '#00B140', '#FF4444',
    '#FFA500', '#32CD32', '#1E90FF', '#9370DB', '#FF69B4'
  ];

  // 处理光标位置变化
  const handleCursorChange = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      setCursorPosition({ start, end });
      if (onCursorChange) {
        onCursorChange(start, end);
      }
    }
  };

  // 处理文本变化
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    handleCursorChange();
  };

  // 插入格式化文本
  const insertFormatText = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = cursorPosition.start || textarea.selectionStart;
      const end = cursorPosition.end || textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const newText = `${prefix}${selectedText || defaultText}${suffix}`;
      
      onChange(
        value.substring(0, start) + newText + value.substring(end)
      );

      // 设置新的光标位置
      setTimeout(() => {
        const newPosition = start + newText.length;
        textarea.setSelectionRange(newPosition, newPosition);
        textarea.focus();
        setCursorPosition({ start: newPosition, end: newPosition });
      }, 50);
    }
  };

  // 插入带颜色的文本
  const insertColorText = (color: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = cursorPosition.start || textarea.selectionStart;
      const end = cursorPosition.end || textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      
      // 使用HTML标签来设置颜色
      const colorText = `<span style="color: ${color}">${selectedText || '彩色文本'}</span>`;
      
      onChange(
        value.substring(0, start) + colorText + value.substring(end)
      );

      setTimeout(() => {
        const newPosition = start + colorText.length;
        textarea.setSelectionRange(newPosition, newPosition);
        textarea.focus();
        setCursorPosition({ start: newPosition, end: newPosition });
      }, 50);
    }
    setShowColorPicker(false);
  };

  // 插入链接
  const insertLink = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = cursorPosition.start || textarea.selectionStart;
      const end = cursorPosition.end || textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      
      // 如果有选中文本，则用作链接文本，否则使用默认文本
      const linkText = selectedText || '链接文本';
      const linkMarkdown = `[${linkText}](https://example.com)`;
      
      onChange(
        value.substring(0, start) + linkMarkdown + value.substring(end)
      );

      setTimeout(() => {
        // 选中URL部分以便用户编辑
        const urlStart = start + linkText.length + 2; // [linkText](
        const urlEnd = urlStart + 'https://example.com'.length;
        textarea.setSelectionRange(urlStart, urlEnd);
        textarea.focus();
      }, 50);
    }
  };

  // 插入表单按钮
  const insertQuoteButton = (type: string) => {
    const buttonTypes = {
      'default': '[获取报价](quote:产品名)',
      'cta': '[获取报价](quote-cta:产品名)',
      'inline': '[点击获取](quote-inline:产品名)',
      'banner': '[立即获取](quote-banner:产品名)'
    };
    
    const buttonText = buttonTypes[type as keyof typeof buttonTypes] || buttonTypes.default;
    insertFormatText(buttonText);
    setShowQuoteButtonMenu(false);
    
    if (onInsertQuoteButton) {
      onInsertQuoteButton(type);
    }
  };

  // 创建带语法高亮的预览层 - 修复重影问题
  const createHighlightedText = () => {
    return value
      // 链接语法高亮 - [文本](URL) - 使用更明显的蓝色区分
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="bg-blue-200 text-blue-800 px-1 rounded font-medium border border-blue-400">[$1]($2)</span>')
      // 加粗语法高亮 - **文本**
      .replace(/\*\*([^*]+)\*\*/g, '<span class="bg-gray-200 text-gray-800 px-1 rounded font-bold">**$1**</span>')
      // 斜体语法高亮 - *文本*
      .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<span class="bg-gray-100 text-gray-700 px-1 rounded italic">*$1*</span>')
      // 删除线语法高亮 - ~~文本~~
      .replace(/~~([^~]+)~~/g, '<span class="bg-red-100 text-red-600 px-1 rounded line-through">~~$1~~</span>')
      // HTML颜色标签高亮 - 保持原有颜色显示
      .replace(/<span style="color: ([^"]+)">([^<]+)<\/span>/g, '<span class="bg-yellow-200 px-1 rounded border border-yellow-400" style="color: $1; font-weight: 500;">$2</span>')
      // 图片语法高亮 - ![alt](src)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<span class="bg-green-200 text-green-800 px-1 rounded font-medium border border-green-400">![图片]($2)</span>')
      // 换行符
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="relative">
      {/* 工具栏 */}
      <div className="mb-2 flex flex-wrap items-center gap-2 p-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-t-md">
        <span className="text-sm text-gray-600 font-medium">格式:</span>
        
        {/* 基本格式按钮 */}
        <button
          type="button"
          onClick={() => insertFormatText('**', '**', '粗体文本')}
          className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
          title="粗体"
        >
          <strong>B</strong>
        </button>
        
        <button
          type="button"
          onClick={() => insertFormatText('*', '*', '斜体文本')}
          className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
          title="斜体"
        >
          <em>I</em>
        </button>

        <button
          type="button"
          onClick={() => insertFormatText('~~', '~~', '删除线文本')}
          className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
          title="删除线"
        >
          <span style={{ textDecoration: 'line-through' }}>S</span>
        </button>
        
        <button
          type="button"
          onClick={insertLink}
          className="px-3 py-1.5 text-sm bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 hover:border-blue-400 transition-all duration-200 shadow-sm text-blue-700"
          title="插入链接"
        >
          🔗 链接
        </button>

        <div className="border-l border-gray-300 h-6 mx-1"></div>

        {/* 颜色选择器 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
            title="文字颜色"
          >
            🎨 颜色
          </button>
          
          {showColorPicker && (
            <div className="absolute top-full mt-2 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-20">
              <div className="grid grid-cols-5 gap-2 w-48">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => insertColorText(color)}
                    className="w-8 h-8 rounded-md border-2 border-gray-300 hover:border-gray-500 transition-all duration-200 hover:scale-110"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowColorPicker(false)}
                className="mt-3 w-full px-2 py-1 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
              >
                关闭
              </button>
            </div>
          )}
        </div>

        <div className="border-l border-gray-300 h-6 mx-1"></div>
        
        {/* 图片上传按钮 */}
        {onImageUpload && (
          <button
            type="button"
            disabled={uploadingImage}
            onClick={onImageUpload}
            className={`inline-flex items-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm ${
              uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="插入图片"
          >
            {uploadingImage ? (
              <>
                <svg className="animate-spin -ml-1 mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                上传中
              </>
            ) : (
              <>
                📷 图片
              </>
            )}
          </button>
        )}

        {/* 表单按钮菜单 */}
        {onInsertQuoteButton && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowQuoteButtonMenu(!showQuoteButtonMenu)}
              className="inline-flex items-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
              title="插入表单按钮"
            >
              📝 表单
              <svg className="ml-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {showQuoteButtonMenu && (
              <div className="absolute top-full mt-2 left-0 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => insertQuoteButton('default')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    🔵 默认按钮 - [获取报价](quote:产品名)
                  </button>
                  <button
                    type="button"
                    onClick={() => insertQuoteButton('cta')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    🎯 CTA横幅 - [获取报价](quote-cta:产品名)
                  </button>
                  <button
                    type="button"
                    onClick={() => insertQuoteButton('inline')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    🔗 内联链接 - [点击获取](quote-inline:产品名)
                  </button>
                  <button
                    type="button"
                    onClick={() => insertQuoteButton('banner')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    ⚡ 醒目横幅 - [立即获取](quote-banner:产品名)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="ml-auto text-xs text-gray-500">
          支持 Markdown 格式 • 链接自动高亮
        </div>
      </div>

      {/* 编辑器容器 - 修复重影问题 */}
      <div className="relative bg-white border border-gray-300 rounded-b-md">
        {/* 语法高亮背景层 - 降低透明度避免重影 */}
        <div
          className="absolute inset-0 p-3 text-sm font-mono leading-6 pointer-events-none overflow-hidden whitespace-pre-wrap break-words z-10"
          style={{
            minHeight: `${rows * 1.5}rem`,
            color: 'transparent',
            fontSize: '14px',
            lineHeight: '1.5',
            tabSize: 2,
            background: 'rgba(255, 255, 255, 0.1)' // 添加轻微背景避免完全透明
          }}
          dangerouslySetInnerHTML={{ __html: createHighlightedText() }}
        />

        {/* 实际的文本框 - 调整透明度和颜色 */}
        <textarea
          ref={textareaRef}
          rows={rows}
          className="relative z-20 w-full text-sm font-mono leading-6 resize-none p-3 outline-none border-transparent focus:ring-2 focus:ring-[#00B140] focus:border-[#00B140] text-gray-800"
          placeholder={placeholder}
          value={value}
          onChange={handleTextareaChange}
          onKeyDown={handleCursorChange}
          onMouseUp={handleCursorChange}
          style={{
            minHeight: `${rows * 1.5}rem`,
            background: 'rgba(255, 255, 255, 0.7)', // 降低透明度，减少重影
            fontSize: '14px',
            lineHeight: '1.5',
            tabSize: 2,
            caretColor: '#374151' // 设置光标颜色
          }}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;