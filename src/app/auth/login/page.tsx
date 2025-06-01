'use client'

// src/app/login/page.tsx

// 필요한 모듈들을 가져옵니다.
// useState는 컴포넌트 내부에서 상태를 관리하기 위해 사용됩니다. (예: 이메일, 비밀번호 입력 값)
import { useState } from 'react';
// Next.js에서 라우팅(페이지 이동) 기능을 사용하기 위해 useRouter를 가져옵니다.
import { useRouter } from 'next/navigation'; // Next.js 13 App Router 기준
// import { useRouter } from 'next/router'; // Next.js Pages Router 기준
import { signIn } from 'next-auth/react'; // NextAuth.js의 signIn 함수를 가져옵니다.
import { ThemeProvider } from 'next-themes';
import logoGreen from '@/images/logos/logo_green.png';



// 로그인 페이지 컴포넌트를 정의합니다.
export default function LoginPage() {
  // Add isSignUp state to track whether the user is signing up or signing in
  const [isSignUp, setIsSignUp] = useState(false);
  // 이메일 입력 값을 저장할 상태와 해당 상태를 업데이트하는 함수를 정의합니다.
  const [email, setEmail] = useState('');
  // 비밀번호 입력 값을 저장할 상태와 해당 상태를 업데이트하는 함수를 정의합니다.
  const [password, setPassword] = useState('');
  // 로그인 시 발생할 수 있는 오류 메시지를 저장할 상태와 해당 상태를 업데이트하는 함수를 정의합니다.
  const [error, setError] = useState('');
  // 페이지 이동을 위한 router 객체를 가져옵니다.
  const router = useRouter();

  // Update the handleSubmit function to handle both sign-in and sign-up
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (isSignUp) {
      // 회원가입 로직 (API 호출로 수정)
      try {
        console.log("회원가입 시도 (프론트엔드):", { email, password });
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          // API 에러 응답 처리 (예: 중복 이메일, 비밀번호 규칙 위반 등)
          throw new Error(data.message || '회원가입에 실패했습니다. 응답 상태: ' + response.status);
        }

        // 회원가입 성공
        console.log('회원가입 성공 (API):', data);
        setIsSignUp(false); // 로그인 폼으로 전환
        setEmail(''); // 입력 필드 초기화
        setPassword(''); // 입력 필드 초기화
        setError('회원가입이 완료되었습니다. 이제 로그인해주세요.'); // 성공 메시지 표시
        // 또는 router.push('/auth/signin?message=signupSuccess') 등으로 로그인 페이지에 메시지 전달 가능

      } catch (err: any) {
        console.error("회원가입 시도 중 오류:", err);
        setError(err.message || "계정 생성 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
      }
    } else {
      // 로그인 로직 (NextAuth.js 사용)
      try {
        const result = await signIn('credentials', {
          redirect: false,
          email: email,
          password: password,
        });

        if (result?.error) {
          console.error('로그인 실패 (NextAuth):', result.error);
          if (result.error === "CredentialsSignin") {
            setError('이메일 또는 비밀번호가 올바르지 않습니다.');
          } else {
             // authOptions의 authorize 함수에서 throw new Error()로 에러를 던졌다면,
             // 그 메시지가 result.error에 담겨 올 수 있습니다.
             // 하지만 authorize에서 null을 반환하면 "CredentialsSignin"이 기본입니다.
             // 좀 더 상세한 에러를 원한다면 authorize에서 직접 에러를 throw하고
             // pages: { error: '/auth/error' } 페이지에서 처리하거나 여기서 커스텀 핸들링이 필요합니다.
            setError('로그인 정보를 다시 확인해주세요.'); // 좀 더 일반적인 메시지로 변경
          }
        } else if (result?.ok && !result.error) { // result.ok 이면서 에러가 없는 경우
          // 로그인 성공
          console.log('로그인 성공 (NextAuth)');
          router.push('/');
          router.refresh(); // 최신 세션 상태 반영
        } else {
           // result.ok가 false이거나, 다른 이유로 로그인이 안된 경우
           setError('로그인에 실패했습니다. 입력 정보를 확인해주세요.');
        }
      } catch (err: any) {
        // signIn 함수 자체에서 네트워크 오류 등 예기치 않은 에러 발생 시
        console.error("로그인 중 예기치 않은 시스템 오류:", err);
        setError('로그인 처리 중 시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  return (
    <ThemeProvider forcedTheme="light" attribute="class">
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            alt="TOS Logo"
            src={logoGreen.src}
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-4 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            {isSignUp ? "계정 만들기" : "Sign in to your account"}
          </h2>
        </div>

        <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-10 shadow-sm sm:rounded-lg sm:px-12">
            <form onSubmit={handleSubmit} method="POST" className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <div className="flex h-6 shrink-0 items-center">
                    <div className="group grid size-4 grid-cols-1">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                      />
                      <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-checked:opacity-100"
                        />
                        <path
                          d="M3 7H11"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-indeterminate:opacity-100"
                        />
                      </svg>
                    </div>
                  </div>
                  <label htmlFor="remember-me" className="block text-sm/6 text-gray-900">
                    Remember me
                  </label>
                </div>

                {!isSignUp && ( // 로그인 상태일 때만 "비밀번호 찾기" 표시
                  <div className="text-sm/6">
                    <a href="#" className="font-semibold text-[#204d4c] hover:text-[#204d4c]">
                      Forgot password?
                    </a>
                  </div>
                )}
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-[#204d4c] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-[#5be4e1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {isSignUp ? "가입하기" : "Sign in"}
                </button>
              </div>
            </form>

            <div>
              <div className="relative mt-10">
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm/6 font-medium">
                  <span className="bg-white px-6 text-gray-900">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button // Google 로그인 버튼
                  onClick={() => signIn('google', { callbackUrl: '/' })} // 로그인 성공 시 '/'로 리디렉션
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus-visible:ring-transparent"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                    <path
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                      fill="#34A853"
                    />
                  </svg>
                  <span className="text-sm/6 font-semibold">Google</span>
                </button>

                <button // GitHub 로그인 버튼
                  onClick={() => signIn('github', { callbackUrl: '/' })} // 로그인 성공 시 '/'로 리디렉션
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus-visible:ring-transparent"
                >
                  <svg fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" className="size-5 fill-[#24292F]">
                    <path
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                      fillRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm/6 font-semibold">GitHub</span>
                </button>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            {isSignUp ? "이미 계정이 있으신가요?" : "Not a member?"}{' '}
            <button
              onClick={(e) => {
                e.preventDefault();
                setError('');
                setIsSignUp(!isSignUp);
              }}
              type="button"
              className="font-semibold text-[#204d4c] hover:text-[#204d4c])"
            >
              {isSignUp ? "로그인하기" : "Sign up now"}
            </button>
          </p>
        </div>
      </div>
    </ThemeProvider>
  )
}