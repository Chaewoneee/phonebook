'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      // Successful login - now we can redirect
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || '로그인 중 오류가 발생했습니다.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[350px] space-y-3">
        {/* Main Box */}
        <div className="bg-white border border-gray-300 p-8 pt-12 pb-10 flex flex-col items-center text-center">
          <h1 className="text-4xl font-serif italic font-bold mb-8 tracking-tighter">
            Phonegram
          </h1>
          
          <form onSubmit={handleSubmit} className="w-full space-y-2">
            <div className="relative group">
              <input
                name="email"
                type="email"
                placeholder="이메일"
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-[3px] py-2 px-3 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            <div className="relative group">
              <input
                name="password"
                type="password"
                placeholder="비밀번호"
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-[3px] py-2 px-3 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#0095f6] hover:bg-[#1877f2] disabled:opacity-50 text-white font-semibold py-1.5 rounded-lg text-sm mt-4 transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              로그인
            </button>
            
            {error && (
              <p className="text-red-500 text-xs mt-4 text-center">{error}</p>
            )}
          </form>

          <div className="flex items-center w-full my-6">
            <div className="flex-1 h-[1px] bg-gray-300"></div>
            <span className="px-4 text-[13px] text-gray-400 font-semibold uppercase tracking-wider">또는</span>
            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>

          <button className="flex items-center gap-2 text-[#385185] text-sm font-semibold">
            <span className="font-bold">Facebook</span>으로 로그인
          </button>
          
          <p className="text-[12px] text-[#385185] mt-4 cursor-pointer">
            비밀번호를 잊으셨나요?
          </p>
        </div>

        {/* Signup Link Box */}
        <div className="bg-white border border-gray-300 p-6 flex justify-center text-sm">
          <p className="text-gray-900">
            계정이 없으신가요?{' '}
            <Link href="/signup" className="text-[#0095f6] font-semibold">
              가입하기
            </Link>
          </p>
        </div>

        {/* App Links */}
        <div className="flex flex-col items-center gap-4 mt-4">
          <p className="text-sm">앱을 다운로드하세요.</p>
          <div className="flex gap-2">
             <div className="bg-black text-white px-4 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                <span>App Store</span>
             </div>
             <div className="bg-black text-white px-4 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                <span>Google Play</span>
             </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-auto py-8 w-full max-w-[800px]">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[12px] text-gray-400 mb-4">
          <span>Meta</span><span>소개</span><span>블로그</span><span>채용 정보</span><span>도움말</span><span>API</span><span>개인정보처리방침</span><span>약관</span><span>위치</span><span>Phonegram Lite</span><span>연락처 업로드 및 비사용자</span><span>Meta Verified</span>
        </div>
        <div className="text-center text-[12px] text-gray-400 mt-4">
          © 2026 Phonegram from Meta
        </div>
      </footer>
    </div>
  );
}
