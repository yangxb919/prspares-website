'use client';

import { useEffect, useState } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

interface N8NChatProps {
  webhookUrl?: string;
}

const N8NChat = ({
  webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://yangxb.zeabur.app/webhook/e104e40e-6134-4825-a6f0-8a646d882662/chat'
}: N8NChatProps) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Ensure it only runs on client side and initializes once
    if (typeof window !== 'undefined' && !isInitialized) {
      let headingObserver: MutationObserver | null = null;

      const downgradeChatHeadings = () => {
        const root = document.getElementById('n8n-chat');
        if (!root) return;

        const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading) => {
          const replacement = document.createElement('div');
          replacement.innerHTML = heading.innerHTML;
          replacement.className = heading.className;

          for (const attr of Array.from(heading.attributes)) {
            if (attr.name !== 'class') {
              replacement.setAttribute(attr.name, attr.value);
            }
          }

          replacement.setAttribute('role', 'heading');
          replacement.setAttribute('aria-level', heading.tagName.slice(1));
          replacement.setAttribute('data-seo-normalized-heading', '1');
          heading.replaceWith(replacement);
        });
      };

      const initializeChat = async () => {
        try {
          console.log('🚀 Initializing N8N Chat with webhook:', webhookUrl);

          // Create chat instance
          createChat({
            webhookUrl: webhookUrl,
            mode: 'window', // 窗口模式，会在右下角显示聊天按钮
            target: '#n8n-chat', // 目标容器
            initialMessages: [
              'Hi there! 👋',
              'I\'m here to help you with mobile repair parts and technical questions. How can I assist you today?'
            ],
            i18n: {
              en: {
                title: 'PRSPARES Support',
                subtitle: 'Mobile Repair Parts Expert - We\'re here to help you 24/7.',
                footer: '',
                getStarted: 'Start Chat',
                inputPlaceholder: 'Ask about repair parts, compatibility, or technical support...',
                closeButtonTooltip: 'Close Chat',
              },
            },
          });

          // n8n chat uses heading tags in the widget header. Downgrade them so
          // they don't create duplicate page-level H1/H2 signals for SEO crawlers.
          downgradeChatHeadings();
          const chatRoot = document.getElementById('n8n-chat');
          if (chatRoot) {
            headingObserver = new MutationObserver(() => {
              downgradeChatHeadings();
            });
            headingObserver.observe(chatRoot, { childList: true, subtree: true });
          }

          // 创建全局函数来打开聊天
          (window as any).openN8NChat = () => {
            console.log('🎯 Opening N8N chat via global function...');
            try {
              // 首先尝试点击聊天切换按钮
              const toggleButton = document.querySelector('.chat-window-toggle');
              if (toggleButton && toggleButton instanceof HTMLElement) {
                console.log('✅ Found chat toggle button, clicking...');
                toggleButton.click();

                // 强制显示聊天窗口
                setTimeout(() => {
                  const chatWindow = document.querySelector('.chat-window-wrapper, .chat-window');
                  if (chatWindow && chatWindow instanceof HTMLElement) {
                    console.log('🔧 Making chat window visible...');
                    chatWindow.style.display = 'block';
                    chatWindow.style.visibility = 'visible';
                    chatWindow.style.opacity = '1';
                    chatWindow.style.zIndex = '9999';
                    chatWindow.style.position = 'fixed';
                    chatWindow.style.bottom = '20px';
                    chatWindow.style.right = '20px';

                    // 也确保父容器可见
                    const wrapper = document.querySelector('.chat-window-wrapper');
                    if (wrapper && wrapper instanceof HTMLElement) {
                      wrapper.style.display = 'block';
                      wrapper.style.visibility = 'visible';
                      wrapper.style.opacity = '1';
                    }

                    console.log('✅ Chat window should now be visible!');
                  }
                }, 100);

                return;
              }

              // 备用方案：直接强制显示聊天窗口
              console.log('🔧 Toggle button not found, trying to force show chat window...');
              const chatWindow = document.querySelector('.chat-window-wrapper, .chat-window');
              if (chatWindow && chatWindow instanceof HTMLElement) {
                console.log('� Found chat window, making it visible...');

                // 强制显示聊天窗口
                chatWindow.style.display = 'block !important';
                chatWindow.style.visibility = 'visible !important';
                chatWindow.style.opacity = '1 !important';
                chatWindow.style.zIndex = '9999';
                chatWindow.style.position = 'fixed';
                chatWindow.style.bottom = '20px';
                chatWindow.style.right = '20px';
                chatWindow.style.width = '400px';
                chatWindow.style.height = '600px';
                chatWindow.style.maxHeight = '80vh';
                chatWindow.style.border = '1px solid #ccc';
                chatWindow.style.borderRadius = '12px';
                chatWindow.style.backgroundColor = 'white';
                chatWindow.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';

                // 确保所有子元素也可见
                const allChatElements = chatWindow.querySelectorAll('*');
                allChatElements.forEach(el => {
                  if (el instanceof HTMLElement) {
                    el.style.visibility = 'visible';
                    el.style.opacity = '1';
                  }
                });

                console.log('✅ Chat window forced to be visible!');
                return;
              }

              console.log('❌ No chat window found to display');
            } catch (error) {
              console.error('Error opening N8N chat:', error);
            }
          };

          setIsEnabled(true);
          setIsInitialized(true);
          console.log('✅ N8N Chat initialized successfully with global function');

        } catch (error) {
          console.warn('⚠️ N8N Chat initialization failed:', error);
          setIsInitialized(true);
        }
      };

      // 延迟初始化，避免与页面加载冲突
      const timer = setTimeout(initializeChat, 1500);

      return () => {
        clearTimeout(timer);
        if (headingObserver) {
          headingObserver.disconnect();
          headingObserver = null;
        }
      };
    }
  }, [webhookUrl, isInitialized]);

  // 始终返回容器，让N8N内部决定是否显示聊天按钮
  return <div id="n8n-chat"></div>;
};

export default N8NChat;
