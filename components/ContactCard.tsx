'use client';

import Avatar from './Avatar';
import { MoreVertical, Phone, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { Contact } from '@/types';

interface ContactCardProps {
  contact: Contact;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ContactCard({
  contact,
  onEdit,
  onDelete,
}: ContactCardProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="bg-white border-b border-gray-100 py-4 px-4 flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <Avatar name={contact.name} size="md" />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-gray-900">{contact.name}</span>
            {contact.category && (
              <span className="bg-gray-100 text-[10px] px-2 py-0.5 rounded-full text-gray-500 font-medium">
                {contact.category.name}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500 font-medium">{contact.phone}</span>
          {contact.memo && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-1">{contact.memo}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => (window.location.href = `tel:${contact.phone}`)}
          className="p-2 rounded-full text-blue-500 hover:bg-blue-50 transition-colors"
        >
          <Phone size={20} />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-50 transition-colors"
          >
            <MoreVertical size={20} />
          </button>

          {showActions && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowActions(false)}
              />
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1 overflow-hidden">
                <button
                  onClick={() => {
                    onEdit();
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit2 size={14} />
                  수정
                </button>
                <button
                  onClick={() => {
                    onDelete();
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  삭제
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
