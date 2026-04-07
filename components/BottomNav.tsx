'use client';

import { Home, Search, PlusSquare, User, Settings } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddClick: () => void;
}

export default function BottomNav({
  activeTab,
  onTabChange,
  onAddClick,
}: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: '홈' },
    { id: 'search', icon: Search, label: '검색' },
    { id: 'add', icon: PlusSquare, label: '추가', isSpecial: true },
    { id: 'profile', icon: User, label: '프로필' },
    { id: 'settings', icon: Settings, label: '설정' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-40 max-w-md mx-auto sm:rounded-t-2xl sm:shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        
        if (tab.isSpecial) {
          return (
            <button
              key={tab.id}
              onClick={onAddClick}
              className="p-2 text-gray-900 transition-transform active:scale-90"
            >
              <Icon size={28} strokeWidth={2.5} />
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'p-2 transition-all active:scale-90',
              activeTab === tab.id ? 'text-gray-900' : 'text-gray-400'
            )}
          >
            <Icon
              size={24}
              strokeWidth={activeTab === tab.id ? 2.5 : 2}
            />
          </button>
        );
      })}
    </nav>
  );
}
