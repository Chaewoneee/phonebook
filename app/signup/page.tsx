'use client';

import { useState } from 'react';
import { signUp } from '@/app/actions/auth';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      const result = await signUp(formData);
      
      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // After server-side signup, perform client-side signin to sync session
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError('가입은 완료되었으나 로그인 중 오류가 발생했습니다. 직접 로그인해 주세요.');
        setLoading(false);
        return;
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || '가입 중 오류가 발생했습니다.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[350px] space-y-3">
        {/* Main Box */}
        <div className="bg-white border border-gray-300 p-8 pt-12 pb-10 flex flex-col items-center text-center">
          <h1 className="text-4xl font-serif italic font-bold mb-4 tracking-tighter">
            Phonegram
          </h1>
          
          <p className="text-gray-500 font-semibold text-base mb-6 px-4">
            친구들의 연락처를 보고 관리하려면 가입하세요.
          </p>

          <button className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold py-1.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 mb-4">
            Facebook으로 로그인
          </button>

          <div className="flex items-center w-full mb-6">
            <div className="flex-1 h-[1px] bg-gray-300"></div>
            <span className="px-4 text-[13px] text-gray-400 font-semibold uppercase tracking-wider">또는</span>
            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>
          
          <form onSubmit={handleSubmit} className="w-full space-y-2">
            <input
              name="email"
              type="email"
              placeholder="이메일 주소"
              required
              className="w-full bg-gray-50 border border-gray-300 rounded-[3px] py-2 px-3 text-sm focus:outline-none focus:border-gray-400"
            />
            <input
              name="password"
              type="password"
              placeholder="비밀번호"
              required
              className="w-full bg-gray-50 border border-gray-300 rounded-[3px] py-2 px-3 text-sm focus:outline-none focus:border-gray-400"
            />
            
            <p className="text-[12px] text-gray-400 mt-4 px-2">
              저희 서비스를 이용하는 사람이 귀하의 연락처 정보를 Phonegram에 업로드했을 수도 있습니다.{' '}
              <span className="text-[#385185] cursor-pointer">더 알아보기</span>
            </p>
            
            <p className="text-[12px] text-gray-400 mt-4 px-2">
              가입하면 Phonegram의 <span className="text-[#385185] cursor-pointer">약관</span>,{' '}
              <span className="text-[#385185] cursor-pointer">개인정보처리방침</span> 및{' '}
              <span className="text-[#385185] cursor-pointer">쿠키 정책</span>에 동의하게 됩니다.
            </p>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#0095f6] hover:bg-[#1877f2] disabled:opacity-50 text-white font-semibold py-1.5 rounded-lg text-sm mt-4 transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              가입하기
            </button>
            
            {error && (
              <p className="text-red-500 text-xs mt-4 text-center">{error}</p>
            )}
            {message && (
              <p className="text-[#0095f6] text-xs mt-4 text-center">{message}</p>
            )}
          </form>
        </div>

        {/* Login Link Box */}
        <div className="bg-white border border-gray-300 p-6 flex justify-center text-sm">
          <p className="text-gray-900">
            계정이 있으신가요?{' '}
            <Link href="/login" className="text-[#0095f6] font-semibold">
              로그인
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
