'use client';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { Category } from '@/types';

interface CategoryBarProps {
  categories: Category[];
  selectedId?: string;
  onSelect: (id?: string) => void;
}

export default function CategoryBar({
  categories,
  selectedId,
  onSelect,
}: CategoryBarProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-4 -mx-4">
      <button
        onClick={() => onSelect(undefined)}
        className="flex flex-col items-center gap-1 flex-shrink-0 group"
      >
        <div
          className={cn(
            'w-16 h-16 rounded-full p-[2px] flex items-center justify-center border-2 transition-all',
            !selectedId
              ? 'border-pink-500 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'
              : 'border-gray-200 group-hover:border-gray-300'
          )}
        >
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-gray-800">
            ALL
          </div>
        </div>
        <span
          className={cn(
            'text-[10px] font-medium transition-colors',
            !selectedId ? 'text-gray-900 font-semibold' : 'text-gray-500'
          )}
        >
          전체
        </span>
      </button>

      {/* Uncategorized Category */}
      <button
        onClick={() => onSelect('uncategorized')}
        className="flex flex-col items-center gap-1 flex-shrink-0 group"
      >
        <div
          className={cn(
            'w-16 h-16 rounded-full p-[2px] flex items-center justify-center border-2 transition-all',
            selectedId === 'uncategorized'
              ? 'border-pink-500 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'
              : 'border-gray-200 group-hover:border-gray-300'
          )}
        >
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-gray-800 italic">
            None
          </div>
        </div>
        <span
          className={cn(
            'text-[10px] font-medium transition-colors',
            selectedId === 'uncategorized' ? 'text-gray-900 font-semibold' : 'text-gray-500'
          )}
        >
          미분류
        </span>
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className="flex flex-col items-center gap-1 flex-shrink-0 group"
        >
          <div
            className={cn(
              'w-16 h-16 rounded-full p-[2px] flex items-center justify-center border-2 transition-all',
              selectedId === category.id
                ? 'border-pink-500 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'
                : 'border-gray-200 group-hover:border-gray-300'
            )}
          >
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-gray-800 uppercase overflow-hidden">
              {category.name.slice(0, 2)}
            </div>
          </div>
          <span
            className={cn(
              'text-[10px] font-medium transition-colors truncate w-16 text-center',
              selectedId === category.id
                ? 'text-gray-900 font-semibold'
                : 'text-gray-500'
            )}
          >
            {category.name}
          </span>
        </button>
      ))}
    </div>
  );
}
