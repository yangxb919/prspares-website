/**
 * 调试元素杀手 - 专门用于移除N8N聊天组件的调试信息
 */

export class DebugKiller {
  private observer: MutationObserver | null = null;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private isActive = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // 立即添加CSS规则
    this.addKillerCSS();
    
    // 立即执行清理
    this.killDebugElements();
    
    // 启动持续监控
    this.startContinuousKilling();
  }

  private addKillerCSS() {
    const existingStyle = document.getElementById('debug-killer-css');
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = 'debug-killer-css';
    style.textContent = `
      /* 调试元素杀手CSS */
      div[style*="position: fixed"]:not([id*="n8n-chat"]):not([class*="n8n-chat"]),
      div[style*="position: absolute"]:not([id*="n8n-chat"]):not([class*="n8n-chat"]),
      div[style*="background: white"]:not([id*="n8n-chat"]):not([class*="n8n-chat"]),
      div[style*="background: rgb(255, 255, 255)"]:not([id*="n8n-chat"]):not([class*="n8n-chat"]),
      div[style*="border: 1px"]:not([id*="n8n-chat"]):not([class*="n8n-chat"]),
      div[style*="padding: 10px"]:not([id*="n8n-chat"]):not([class*="n8n-chat"]),
      div[style*="z-index: 9999"]:not([id*="n8n-chat"]):not([class*="n8n-chat"]) {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        position: absolute !important;
        left: -99999px !important;
        top: -99999px !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        transform: scale(0) !important;
        z-index: -9999 !important;
      }
    `;
    document.head.appendChild(style);
  }

  private killDebugElements() {
    // 查找并移除所有可能的调试元素
    const selectors = [
      'div[style*="position: fixed"]',
      'div[style*="position: absolute"]',
      'div[style*="background: white"]',
      'div[style*="background: rgb(255, 255, 255)"]',
      'div[style*="border: 1px"]',
      'div[style*="padding: 10px"]',
      'div[style*="z-index: 9999"]'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const text = element.textContent || '';
        const id = element.id || '';
        const className = element.className || '';

        // 检查是否是调试元素
        const isDebugElement = (
          text.includes('N8N Chat Debug') ||
          text.includes('Elements found') ||
          text.includes('Has container') ||
          text.includes('Has toggle') ||
          text.includes('Has window') ||
          text.includes('debug') ||
          className.includes('debug') ||
          id.includes('debug')
        ) && !id.includes('n8n-chat') && !className.includes('n8n-chat');

        if (isDebugElement) {
          console.log('🗑️ DebugKiller: Removing debug element:', element);
          element.remove();
        }
      });
    });

    // 也检查所有div元素的文本内容
    const allDivs = document.querySelectorAll('div:not([id*="n8n-chat"]):not([class*="n8n-chat"])');
    allDivs.forEach(div => {
      const text = div.textContent || '';
      if (text.includes('N8N Chat Debug') ||
          text.includes('Elements found') ||
          text.includes('Has container') ||
          text.includes('Has toggle') ||
          text.includes('Has window')) {
        console.log('🗑️ DebugKiller: Removing debug text element:', div);
        div.remove();
      }
    });
  }

  private startContinuousKilling() {
    if (this.isActive) return;
    this.isActive = true;

    // 使用MutationObserver监听DOM变化
    this.observer = new MutationObserver(() => {
      this.killDebugElements();
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 定期清理
    this.cleanupInterval = setInterval(() => {
      this.killDebugElements();
    }, 50); // 每50ms检查一次

    // 10秒后减少频率
    setTimeout(() => {
      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
        this.cleanupInterval = setInterval(() => {
          this.killDebugElements();
        }, 500); // 改为每500ms检查一次
      }
    }, 10000);

    // 60秒后停止
    setTimeout(() => {
      this.stop();
    }, 60000);
  }

  public stop() {
    this.isActive = false;
    
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    console.log('🛑 DebugKiller: Stopped');
  }

  public restart() {
    this.stop();
    setTimeout(() => {
      this.init();
    }, 100);
  }
}

// 创建全局实例
let debugKillerInstance: DebugKiller | null = null;

export const startDebugKiller = () => {
  if (typeof window === 'undefined') return;
  
  if (debugKillerInstance) {
    debugKillerInstance.stop();
  }
  
  debugKillerInstance = new DebugKiller();
  return debugKillerInstance;
};

export const stopDebugKiller = () => {
  if (debugKillerInstance) {
    debugKillerInstance.stop();
    debugKillerInstance = null;
  }
};
