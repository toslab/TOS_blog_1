'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import Image from 'next/image';
import logoLight from '@/images/photos/TOS LAB.svg';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (isSignUp) {
      // 회원가입 로직
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || '회원가입에 실패했습니다.');
        }

        setSuccess('회원가입이 완료되었습니다. 이제 로그인해주세요.');
        setIsSignUp(false);
        setEmail('');
        setPassword('');
      } catch (err: any) {
        setError(err.message || "회원가입 중 오류가 발생했습니다.");
      }
    } else {
      // 로그인 로직
      try {
        const result = await signIn('credentials', {
          redirect: false,
          email: email,
          password: password,
        });

        if (result?.error) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        } else if (result?.ok) {
          router.push('/');
          router.refresh();
        }
      } catch (err: any) {
        setError('로그인 처리 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <ThemeProvider forcedTheme="light" attribute="class">
      <div className="flex min-h-screen flex-1 flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* TOS LAB 로고 */}
          <div className="flex justify-center mb-6">
            <Image
              src={logoLight}
              alt="TOS LAB"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>
          
          <h1 className="text-center text-3xl font-bold text-gray-900">
            {isSignUp ? "회원가입" : "로그인"}
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            안녕하세요, 해다운입니다.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-6 py-8 shadow-sm rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {isSignUp ? "이메일" : "아이디"}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={isSignUp ? "이메일을 입력해주세요." : "아이디를 입력해주세요."}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="비밀번호를 입력해주세요."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              {!isSignUp && (
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    자동로그인
                  </label>
                </div>
              )}

              {error && (
                <div className="text-sm text-red-600 text-center">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-sm text-green-600 text-center">
                  {success}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  {isSignUp ? "회원가입" : "로그인"}
                </button>
              </div>
            </form>

            {!isSignUp && (
              <div className="mt-4 text-center">
                <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
                  아이디 찾기
                </a>
                <span className="mx-2 text-gray-400">|</span>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
                  비밀번호 찾기
                </a>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <button
                onClick={() => signIn('google', { callbackUrl: '/' })}
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-md bg-yellow-400 px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                <svg className="h-5 w-5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z" fill="#4285F4"/>
                  <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853"/>
                  <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
                  <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
                </svg>
                카카오로 로그인
              </button>

              <button
                onClick={() => signIn('google', { callbackUrl: '/' })}
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-md bg-green-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <span className="font-bold text-lg">N</span>
                네이버로 로그인
              </button>

              <button
                onClick={() => signIn('google', { callbackUrl: '/' })}
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                구글로 로그인
              </button>
            </div>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                {isSignUp ? "이미 회원이신가요?" : "해다운 회원이 아니신가요?"}
              </span>
              <button
                onClick={() => {
                  setError('');
                  setSuccess('');
                  setIsSignUp(!isSignUp);
                }}
                type="button"
                className="ml-1 text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                {isSignUp ? "로그인" : "회원가입"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}