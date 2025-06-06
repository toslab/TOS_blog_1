import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
// import EmailProvider from 'next-auth/providers/email'; // 📧 이메일 (매직 링크) 인증을 사용하려면 주석 해제!
// import { PrismaAdapter } from '@next-auth/prisma-adapter'; // Prisma와 NextAuth.js를 연결하는 마법의 다리 - 임시 비활성화
// import { PrismaClient } from '@prisma/client'; // Prisma 데이터베이스와 대화하는 똑똑한 비서 - 임시 비활성화
import bcrypt from 'bcryptjs'; // 🔒 비밀번호 암호화를 위한 든든한 수호자!

// Prisma 클라이언트 인스턴스 생성: 데이터베이스와의 연결고리 - 임시 비활성화
// const prisma = new PrismaClient();

// NextAuth.js 설정 옵션: 우리 애플리케이션 인증 마법의 모든 비밀이 여기에 담깁니다!
export const authOptions: NextAuthOptions = {
  // 🔹 PrismaAdapter 설정 - 임시 비활성화 (개발 단계)
  // adapter: PrismaAdapter(prisma),

  // 🔹 providers: "우리 웹사이트는 어떤 방법으로 사용자를 인증할까요?"를 정하는 곳입니다.
  providers: [
    // --- PROVIDER 1: 이메일/비밀번호 인증 (임시로 간단한 더미 인증) ---
    CredentialsProvider({
      name: '이메일/비밀번호', // 로그인 페이지 등에 표시될 이 인증 방식의 이름
      credentials: { // 로그인 폼에서 사용자에게 어떤 정보를 받을지 정의합니다.
        email: { label: "이메일 주소", type: "email", placeholder: "you@example.com" },
        password: { label: "비밀번호", type: "password" }
      },
      // ✨ authorize 함수: 개발용 더미 인증 로직
      async authorize(credentials) {
        // 개발 단계용 더미 인증 - 실제 운영에서는 사용하면 안됩니다!
        if (!credentials?.email || !credentials?.password) {
          console.error("인증 실패: 이메일 또는 비밀번호가 입력되지 않았습니다.");
          return null;
        }

        // 개발용 더미 사용자 - admin@test.com / password123
        if (credentials.email === 'admin@test.com' && credentials.password === 'password123') {
          console.log("로그인 성공 (개발용 더미 계정):", credentials.email);
          return {
            id: '1',
            name: '개발자',
            email: credentials.email,
            image: null,
          };
        }

        console.warn("인증 실패: 개발용 더미 계정이 아님:", credentials.email);
        return null;

        // 실제 Prisma 인증 로직 (나중에 활성화)
        /*
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (user && user.password) {
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          if (isValidPassword) {
            console.log("로그인 성공 (Credentials):", user.email);
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            };
          }
        }
        return null;
        */
      }
    }),

    // OAuth providers는 환경변수가 설정되어 있을 때만 활성화
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      })
    ] : []),

    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? [
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      })
    ] : []),
  ],

  // 🔹 세션 관리 전략: JWT 사용 (데이터베이스 없이도 작동)
  session: {
    strategy: 'jwt',
  },

  // 🔑 JWT 비밀키
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-key', // 개발용 기본값 추가

  // 📄 페이지 경로 설정
  pages: {
    signIn: '/auth/signin',
  },

  // 📞 콜백 함수
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        if (token.id) {
          (session.user as { id?: string }).id = token.id as string;
        }
      }
      return session;
    },
  },

  // 🐛 디버깅 옵션
  debug: process.env.NODE_ENV === 'development',
};

// NextAuth.js 핸들러를 생성하고 GET, POST 요청에 대해 동일한 핸들러를 사용합니다.
const handler = NextAuth(authOptions);

// Next.js 13+ App Router에서 요구하는 방식으로 GET과 POST 메서드를 각각 export합니다.
export { handler as GET, handler as POST };