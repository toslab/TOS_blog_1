import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
// import EmailProvider from 'next-auth/providers/email'; // 📧 이메일 (매직 링크) 인증을 사용하려면 주석 해제!
import { PrismaAdapter } from '@next-auth/prisma-adapter'; // Prisma와 NextAuth.js를 연결하는 마법의 다리
import { PrismaClient } from '@prisma/client'; // Prisma 데이터베이스와 대화하는 똑똑한 비서
import bcrypt from 'bcryptjs'; // 🔒 비밀번호 암호화를 위한 든든한 수호자!

// Prisma 클라이언트 인스턴스 생성: 데이터베이스와의 연결고리
const prisma = new PrismaClient();

// NextAuth.js 설정 옵션: 우리 애플리케이션 인증 마법의 모든 비밀이 여기에 담깁니다!
export const authOptions: NextAuthOptions = {
  // 🔹 PrismaAdapter 설정: NextAuth.js가 Prisma를 통해 사용자 정보를 저장하고 불러올 수 있도록 합니다.
  // 이렇게 하면 사용자 계정, 세션, OAuth 연동 정보 등이 우리 데이터베이스에 안전하게 보관됩니다.
  adapter: PrismaAdapter(prisma),

  // 🔹 providers: "우리 웹사이트는 어떤 방법으로 사용자를 인증할까요?"를 정하는 곳입니다.
  // 배열 형태로 여러 인증 방식을 동시에 지원할 수 있습니다.
  providers: [
    // --- PROVIDER 1: 이메일/비밀번호 인증 (가장 전통적이지만 여전히 강력한 방식!) ---
    CredentialsProvider({
      name: '이메일/비밀번호', // 로그인 페이지 등에 표시될 이 인증 방식의 이름
      credentials: { // 로그인 폼에서 사용자에게 어떤 정보를 받을지 정의합니다.
        email: { label: "이메일 주소", type: "email", placeholder: "you@example.com" },
        password: { label: "비밀번호", type: "password" }
      },
      // ✨ authorize 함수: 사용자가 입력한 정보가 올바른지 확인하는 핵심 로직!
      async authorize(credentials) {
        // 사용자가 이메일이나 비밀번호 중 하나라도 입력하지 않았다면, 바로 실패 처리!
        if (!credentials?.email || !credentials?.password) {
          console.error("인증 실패: 이메일 또는 비밀번호가 입력되지 않았습니다.");
          // 실제 서비스에서는 사용자에게 좀 더 친절한 에러 메시지를 보여주는 것이 좋습니다.
          // throw new Error("이메일과 비밀번호를 모두 입력해주세요."); // 에러를 발생시켜 pages.error로 리디렉션
          return null; // null을 반환하면 NextAuth.js는 인증 실패로 간주하고, 로그인 페이지에 에러를 표시할 수 있습니다.
        }

        // Prisma를 사용해 데이터베이스에서 입력된 이메일과 일치하는 사용자를 찾아봅니다.
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // 사용자가 존재하고, 데이터베이스에 해당 사용자의 비밀번호(암호화된!)가 저장되어 있다면?
        if (user && user.password) {
          // bcrypt.compare 함수를 사용하여 사용자가 입력한 비밀번호와
          // 데이터베이스에 저장된 해시된 비밀번호를 안전하게 비교합니다.
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);

          if (isValidPassword) {
            // 비밀번호 일치! 인증 성공!
            console.log("로그인 성공 (Credentials):", user.email);
            // NextAuth.js가 세션을 생성하는 데 사용할 사용자 정보를 반환합니다.
            // id, name, email, image는 NextAuth.js가 기본적으로 기대하는 필드입니다.
            return {
              id: user.id,
              name: user.name,     // 사용자 이름 (User 모델에 해당 필드가 있다고 가정)
              email: user.email,   // 사용자 이메일
              image: user.image,   // 사용자 프로필 이미지 URL (User 모델에 해당 필드가 있다고 가정)
              // 필요하다면 여기에 사용자 역할(role) 등의 추가 정보를 포함시킬 수 있습니다.
              // role: user.role, // Prisma User 모델에 role 필드가 정의되어 있어야 합니다.
            };
          } else {
            // 비밀번호 불일치
            console.warn("인증 실패: 비밀번호 불일치 (Credentials):", credentials.email);
            // throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
            return null;
          }
        } else {
          // 사용자가 존재하지 않거나, DB에 비밀번호 필드가 없는 경우
          // (예: OAuth로만 가입하여 비밀번호가 없는 사용자)
          console.warn("인증 실패: 사용자를 찾을 수 없거나 비밀번호가 설정되지 않음 (Credentials):", credentials.email);
          // throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
          return null;
        }
      }
    }),

    // --- PROVIDER 2: Google 로그인 (가장 인기 있는 소셜 로그인 중 하나!) ---
    GoogleProvider({
      // Google Cloud Console에서 발급받은 클라이언트 ID와 시크릿 키를 환경 변수에서 가져옵니다.
      // ❗ .env.local 파일에 GOOGLE_CLIENT_ID와 GOOGLE_CLIENT_SECRET을 반드시 설정해야 합니다!
      clientId: process.env.GOOGLE_CLIENT_ID!, // !는 "이 값은 반드시 존재해!" 라는 TypeScript의 Non-null Assertion Operator
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // 🔑 Google OAuth 2.0 클라이언트 설정에서 "승인된 리디렉션 URI"에 다음을 정확히 추가해야 합니다:
      // (자세한 설명은 아래 "OAuth Provider 콜백 URL 설정의 비밀!" 섹션을 참고하세요.)
      //   - 개발 환경: http://localhost:3000/api/auth/callback/google
      //   - 프로덕션 환경: https://여러분의실제도메인.com/api/auth/callback/google
    }),

    // --- PROVIDER 3: GitHub 로그인 (개발자들에게 특히 사랑받는 로그인 방식!) ---
    GitHubProvider({
      // GitHub Developer Settings > OAuth Apps에서 발급받은 Client ID와 Client Secret을 사용합니다.
      // ❗ .env.local 파일에 GITHUB_CLIENT_ID와 GITHUB_CLIENT_SECRET을 반드시 설정해야 합니다!
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      // 🔑 GitHub OAuth App 설정 페이지의 "Authorization callback URL" 필드에 다음을 정확히 입력해야 합니다:
      // (자세한 설명은 아래 "OAuth Provider 콜백 URL 설정의 비밀!" 섹션을 참고하세요.)
      //   - 개발 환경: http://localhost:3000/api/auth/callback/github
      //   - 프로덕션 환경: https://여러분의실제도메인.com/api/auth/callback/github
    }),

    // --- (선택 사항) PROVIDER 4: 이메일 (매직 링크 또는 일회용 코드) 인증 ---
    // EmailProvider({
    //   // 이메일을 발송할 SMTP 서버 설정 (실제 메일 서버 정보로 대체해야 합니다)
    //   server: {
    //     host: process.env.EMAIL_SERVER_HOST,
    //     port: Number(process.env.EMAIL_SERVER_PORT), // 포트 번호는 숫자로 변환
    //     auth: {
    //       user: process.env.EMAIL_SERVER_USER,
    //       pass: process.env.EMAIL_SERVER_PASSWORD
    //     }
    //   },
    //   // 이메일을 보낼 사람의 주소 (예: 'noreply@내서비스.com')
    //   from: process.env.EMAIL_FROM,
    //   // (선택 사항) 생성된 매직 링크/코드의 유효 기간 설정 (기본값: 24시간)
    //   // maxAge: 24 * 60 * 60, // 초 단위
    //   // (고급) 이메일 발송 로직을 직접 구현하고 싶다면:
    //   // async sendVerificationRequest({ identifier: email, url, provider: { server, from } }) {
    //   //   /* 여기에 여러분의 커스텀 이메일 발송 코드를 작성하세요! */
    //   //   // 예: await resend.emails.send({ from, to: email, subject: '로그인 링크', html: `링크를 클릭하세요: <a href="${url}">${url}</a>` });
    //   // }
    // }),
  ],

  // 🔹 세션 관리 전략: 사용자의 로그인 상태를 어떻게 기억하고 관리할까요?
  session: {
    // 'jwt': JSON Web Token (JWT)을 사용하여 세션을 관리합니다. (기본값이며, 확장성이 좋습니다)
    //        클라이언트 측(브라우저)에 암호화된 토큰을 저장하고, 요청 시마다 토큰을 검증합니다.
    // 'database': 세션 정보를 데이터베이스에 직접 저장합니다. PrismaAdapter와 함께 사용할 때 좋은 선택이 될 수 있습니다.
    //             세션 ID를 클라이언트 쿠키에 저장하고, 요청 시 세션 ID로 DB에서 세션 정보를 조회합니다.
    // 여기서는 JWT 전략을 사용하겠습니다. 필요에 따라 'database'로 변경할 수도 있습니다.
    strategy: 'jwt',
  },

  // 🔑 JWT 비밀키: JWT를 만들고 서명하며, 해독하는 데 사용되는 매우 중요한 비밀 열쇠입니다.
  // 절대로 외부에 노출되어서는 안 됩니다! `.env.local` 파일에 안전하게 보관하고 불러와야 합니다.
  secret: process.env.NEXTAUTH_SECRET, // 이 값은 반드시! .env.local 파일에 설정해야 합니다.

  // 📄 페이지 경로 설정: 로그인, 로그아웃 등 NextAuth.js가 관리하는 페이지들의 주소를 알려줍니다.
  pages: {
    // 사용자가 로그인을 해야 할 때 보여줄 페이지의 경로입니다.
    // 이 페이지는 우리가 직접 만들어야 해요! (예: src/app/auth/signin/page.tsx)
    signIn: '/auth/signin',
    // 필요에 따라 다른 페이지들도 설정할 수 있습니다.
    // signOut: '/auth/signout', // 로그아웃 확인 페이지 (기본 제공 페이지 사용 가능)
    // error: '/auth/error', // 인증 과정 중 에러 발생 시 보여줄 페이지 (기본 제공 페이지 사용 가능, 커스텀 가능)
    // verifyRequest: '/auth/verify-request', // 이메일 인증 Provider 사용 시, 확인 이메일을 보냈다는 안내 페이지
    // newUser: '/auth/new-user' // 새로운 사용자가 처음 로그인했을 때 리디렉션될 페이지 (프로필 설정 등)
  },

  // 📞 콜백 함수: 인증 과정의 특정 중요한 순간(이벤트)에 우리가 원하는 추가 작업을 할 수 있게 해주는 강력한 기능입니다.
  callbacks: {
    // jwt 콜백: JWT가 생성되거나 업데이트될 때마다 호출됩니다. (session.strategy가 'jwt'일 때 필수)
    // 이 콜백에서 반환된 값이 실제 JWT 토큰의 내용이 됩니다.
    async jwt({ token, user, account, profile }) {
      // `user` 객체는 authorize 함수에서 반환된 값 또는 OAuth 로그인 시 Provider로부터 받은 사용자 정보입니다.
      // 최초 로그인 시 (user 객체가 존재할 때) 토큰에 추가 정보를 담을 수 있습니다.
      if (user) {
        token.id = user.id; // JWT(토큰)에 사용자 ID 정보를 추가합니다.
        // Prisma User 모델에 role 필드가 있고, user 객체에 해당 정보가 있다면 토큰에도 추가할 수 있습니다.
        // (user as any).role은 타입스크립트에서 경고를 발생시킬 수 있으므로, User 타입 확장을 권장합니다.
        // (NextAuth.js 타입 선언 파일(next-auth.d.ts)에서 User, Session, JWT 타입을 확장하세요)
        // if (user.role) { // user 객체에 role이 실제로 있다면
        //   token.role = user.role;
        // }
      }
      // `account` 객체는 사용된 로그인 Provider에 대한 정보를 담고 있습니다 (예: 'google', 'github').
      // 필요하다면 account 정보를 활용하여 토큰에 Provider별 특정 정보(예: 액세스 토큰)를 추가할 수도 있습니다.
      // if (account?.provider === "google" && account.access_token) {
      //   token.accessToken = account.access_token;
      // }
      return token; // 정보가 추가되거나 수정된 토큰을 반환합니다.
    },

    // session 콜백: 클라이언트에서 `useSession()` 훅 등을 통해 세션 정보를 요청할 때마다 호출됩니다.
    // 이 콜백에서 반환된 값이 `useSession()`의 결과로 전달됩니다.
    async session({ session, token /*, user */ }) {
      // `token` 객체는 위 jwt 콜백에서 반환된, 정보가 추가된 JWT입니다.
      // `user` 인자는 session.strategy가 'database'일 때 PrismaAdapter로부터 받은 사용자 정보입니다.
      // 여기서는 jwt 콜백에서 토큰에 담았던 추가 정보를 실제 클라이언트 세션 객체(`session.user`)에도 담아줍니다.
      // 이렇게 해야 클라이언트 컴포넌트에서 `session.user.id` 와 같이 해당 정보에 쉽게 접근할 수 있습니다.
      if (session.user) {
        if (token.id) {
          (session.user as { id?: string }).id = token.id as string;
        }
        // if (token.role) {
        //   (session.user as { role?: string }).role = token.role as string;
        // }
        // if (token.accessToken) { // 예시: 토큰에 accessToken이 있다면 세션에도 추가
        //   (session.user as { accessToken?: string }).accessToken = token.accessToken as string;
        // }
      }
      return session; // 정보가 추가되거나 수정된 세션 객체를 반환합니다.
    },
  },

  // 🐛 디버깅 옵션: 개발 환경(`process.env.NODE_ENV === 'development'`)에서만
  // NextAuth.js의 상세한 작동 과정과 관련된 디버그 메시지를 서버 콘솔에 출력합니다.
  // 운영 환경에서는 자동으로 비활성화되므로 안심하고 켜두셔도 됩니다.
  debug: process.env.NODE_ENV === 'development',
};

// NextAuth 마법사 소환!
// 위에서 정성껏 정의한 authOptions를 바탕으로 인증 요청을 처리할 핸들러 함수를 만듭니다.
const handler = NextAuth(authOptions);

// 만들어진 핸들러를 GET 요청과 POST 요청 모두에 대해 export 합니다.
// Next.js App Router의 API Route는 이렇게 export 해야 정상적으로 작동해요!
export { handler as GET, handler as POST };