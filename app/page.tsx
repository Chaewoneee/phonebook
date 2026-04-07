'use client';

import { useState, useEffect, useMemo } from 'react';
import CategoryBar from '@/components/CategoryBar';
import ContactCard from '@/components/ContactCard';
import ContactForm from '@/components/ContactForm';
import BottomNav from '@/components/BottomNav';
import { getCategories } from '@/app/actions/categories';
import { getContacts, addContact, updateContact, deleteContact } from '@/app/actions/contacts';
import { Search, Plus, Filter } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  // Data State
  const [categories, setCategories] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('home');

  // Load Data
  useEffect(() => {
    async function init() {
      const cats = await getCategories();
      const conts = await getContacts();
      setCategories(cats);
      setContacts(conts);
      setLoading(loading => false);
    }
    init();
  }, []);

  // Filtered Contacts
  const filteredContacts = useMemo(() => {
    let result = contacts;
    
    if (selectedCategoryId) {
      result = result.filter(c => c.category_id === selectedCategoryId);
    }
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(lowerQuery) || 
        c.phone.includes(searchQuery)
      );
    }
    
    return result;
  }, [contacts, selectedCategoryId, searchQuery]);

  // Actions
  const handleAddOrUpdate = async (data: any) => {
    try {
      const result = editingContact 
        ? await updateContact(editingContact.id, data)
        : await addContact(data);
        
      if (result.success) {
        const updatedContacts = await getContacts();
        setContacts(updatedContacts);
      } else {
        alert(`실패: ${result.error}`);
      }
    } catch (e: any) {
      alert(`오류: ${e.message || '알 수 없는 오류가 발생했습니다.'}`);
    }
    setEditingContact(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      const result = await deleteContact(id);
      if (result.success) {
        setContacts(contacts.filter(c => c.id !== id));
      }
    }
  };

  return (
    <main className="min-h-screen bg-white max-w-md mx-auto relative pb-20 shadow-lg min-h-screen">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-30 px-6 py-4 flex items-center justify-between border-b border-gray-50">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 font-serif italic">
          Phonegram
        </h1>
        <div className="flex items-center gap-4">
          <button className="text-gray-900">
            <Plus onClick={() => setIsFormOpen(true)} className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Story Bar (Categories) */}
      <div className="py-4 border-b border-gray-50 bg-white">
        <CategoryBar 
          categories={categories} 
          selectedId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="이름 또는 전화번호 검색"
            className="w-full bg-gray-100 border-none rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 transition-all"
          />
        </div>
      </div>

      {/* Contacts Feed */}
      <div className="divide-y divide-gray-50">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50 scale-90">
             <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
             <p className="text-gray-400 text-sm font-medium">연락처를 불러오는 중...</p>
          </div>
        ) : filteredContacts.length > 0 ? (
          filteredContacts.map(contact => (
            <ContactCard 
              key={contact.id} 
              contact={contact}
              onEdit={() => {
                setEditingContact(contact);
                setIsFormOpen(true);
              }}
              onDelete={() => handleDelete(contact.id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
               <Search className="w-8 h-8 text-gray-200" />
            </div>
            <h3 className="text-gray-900 font-bold mb-1">연락처를 찾을 수 없습니다</h3>
            <p className="text-gray-400 text-xs">새로운 연락처를 추가하거나 다른 검색어를 입력해보세요.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <ContactForm 
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingContact(null);
        }}
        onSubmit={handleAddOrUpdate}
        initialData={editingContact}
        categories={categories}
      />

      {/* Bottom Nav */}
      <BottomNav 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddClick={() => setIsFormOpen(true)}
      />
    </main>
  );
}
