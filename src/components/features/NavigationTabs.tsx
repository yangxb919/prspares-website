'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Tab {
  id: string;
  label: string;
  href: string;
}

interface NavigationTabsProps {
  tabs: Tab[];
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
}

const NavigationTabs = ({ tabs, activeTabId, onTabChange }: NavigationTabsProps) => {
  const [activeTab, setActiveTab] = useState(activeTabId || tabs[0]?.id || '');

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className="border-b border-gray-200 mb-8">
      <div className="flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm sm:text-base whitespace-nowrap ${isActive ? 'border-[#00B140] text-[#00B140]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationTabs;
