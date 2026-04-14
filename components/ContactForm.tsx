'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { addCategory } from '@/app/actions/categories';
import { supabase } from '@/utils/supabase/client';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Category {
  id: string;
  name: string;
}

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    phone: string;
    category_id?: string;
    memo?: string;
  }) => void;
  initialData?: {
    id?: string;
    name: string;
    phone: string;
    category_id?: string;
    memo?: string;
  };
  categories: Category[];
}

export default function ContactForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories: initialCategories,
}: ContactFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '');
  const [memo, setMemo] = useState(initialData?.memo || '');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPhone(initialData.phone);
      setCategoryId(initialData.category_id || '');
      setMemo(initialData.memo || '');
    } else {
      setName('');
      setPhone('');
      setCategoryId('');
      setMemo('');
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        alert(`세션 오류: ${sessionError.message}`);
        return;
      }
      
      if (!session) {
        alert('로그인 세션이 없습니다. 다시 로그인해 주세요.');
        window.location.href = '/login';
        return;
      }

      const token = session.access_token;
      const result = await addCategory(token, newCategoryName);
      
      if (result.success && result.data) {
        setCategories([...categories, result.data[0]]);
        setCategoryId(result.data[0].id);
        setNewCategoryName('');
        setIsAddingCategory(false);
      } else {
        alert(`카테고리 추가 실패: ${result.error || '알 수 없는 오류'}`);
      }
    } catch (err: any) {
      alert(`시스템 오류: ${err.message || '알 수 없는 오류가 발생했습니다.'}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      phone,
      category_id: categoryId || undefined,
      memo: memo || undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 overflow-hidden animate-slide-up">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData?.id ? '연락처 수정' : '새 연락처 추가'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                이름
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                전화번호
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                분류
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setCategoryId('')}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium border-2 transition-all',
                    categoryId === ''
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                  )}
                >
                  미분류
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium border-2 transition-all',
                      categoryId === cat.id
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(true)}
                  className="px-4 py-2 rounded-full text-sm font-medium border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-all flex items-center gap-1"
                >
                  <Plus size={14} />
                  추가
                </button>
              </div>

              {isAddingCategory && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <input
                    type="text"
                    autoFocus
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="분류명 입력"
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCategory();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="p-2 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                메모
              </label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="간단한 메모를 입력하세요"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all h-24 resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {initialData?.id ? '저장하기' : '연락처 저장'}
          </button>
        </form>
      </div>
    </div>
  );
}
