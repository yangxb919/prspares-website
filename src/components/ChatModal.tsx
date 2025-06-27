'use client';

import { useState, useEffect, useRef } from 'react';
import { X, MessageCircle } from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal = ({ isOpen, onClose }: ChatModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatInstanceRef = useRef<any>(null);

  // Load N8N chat script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadN8NChat = () => {
      try {
        // Check if script is already loaded
        if ((window as any).createChat) {
          setIsScriptLoaded(true);
          return;
        }

        // Load CSS
        const cssLink = document.createElement('link');
        cssLink.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
        cssLink.rel = 'stylesheet';
        if (!document.querySelector(`link[href="${cssLink.href}"]`)) {
          document.head.appendChild(cssLink);
        }

        // Load JS script
        const script = document.createElement('script');
        script.type = 'module';
        script.innerHTML = `
          import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
          window.createChat = createChat;
          window.dispatchEvent(new CustomEvent('n8nChatLoaded'));
        `;

        // Listen for script load event
        window.addEventListener('n8nChatLoaded', () => {
          setIsScriptLoaded(true);
          console.log('✅ N8N Chat script loaded successfully');
        }, { once: true });

        document.head.appendChild(script);
      } catch (error) {
        console.error('❌ Failed to load N8N Chat script:', error);
        setIsLoading(false);
      }
    };

    loadN8NChat();
  }, []);

  // Initialize chat when modal opens
  useEffect(() => {
    if (isOpen && isScriptLoaded && chatContainerRef.current && !chatInstanceRef.current) {
      try {
        console.log('🚀 Initializing N8N Chat in modal...');

        const createChat = (window as any).createChat;
        if (createChat) {
          // Clear any existing content
          chatContainerRef.current.innerHTML = '';

          // Create chat instance
          chatInstanceRef.current = createChat({
            webhookUrl: 'https://yangxb.zeabur.app/webhook/e104e40e-6134-4825-a6f0-8a646d882662/chat',
            target: chatContainerRef.current,
            mode: 'fullscreen',
            showWelcomeScreen: true,
            initialMessages: [
              'Hi there! 👋',
              'I\'m your mobile repair parts expert. How can I help you today?'
            ],
            i18n: {
              en: {
                title: 'Mobile Repair Assistant',
                subtitle: 'Ask me anything about mobile repair parts and compatibility',
                footer: 'Powered by PRSPARES AI',
                getStarted: 'Start Chat',
                inputPlaceholder: 'Ask about repair parts, compatibility, installation...',
              },
            },
          });

          setIsLoading(false);
          console.log('✅ N8N Chat initialized successfully in modal');
        }
      } catch (error) {
        console.error('❌ Failed to initialize N8N Chat:', error);
        setIsLoading(false);
      }
    }
  }, [isOpen, isScriptLoaded]);

  // Cleanup when modal closes
  useEffect(() => {
    if (!isOpen && chatInstanceRef.current) {
      try {
        // Clean up chat instance
        if (chatContainerRef.current) {
          chatContainerRef.current.innerHTML = '';
        }
        chatInstanceRef.current = null;
        console.log('🧹 Chat instance cleaned up');
      } catch (error) {
        console.error('Error cleaning up chat:', error);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl h-[80vh] my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl relative">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-[#00B140] to-[#00D155]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  AI Assistant
                </h3>
                <p className="text-white/80 text-sm">
                  Mobile repair parts expert - Ask me anything!
                </p>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#00B140] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading AI Assistant...</p>
                <p className="text-gray-500 text-sm mt-2">Initializing chat interface...</p>
              </div>
            </div>
          )}

          {/* Chat container */}
          <div
            ref={chatContainerRef}
            className="w-full h-full"
            style={{ height: 'calc(100% - 80px)' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
