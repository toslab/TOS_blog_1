import { NextResponse, type NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// 기존 PrismaClient 인스턴스를 재사용합니다
// (prisma는 이미 src/app/api/auth/[...nextauth]/route.ts에서 사용 중)
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // 요청 본문에서 이메일과 비밀번호 추출
    const body = await request.json();
    const { email, password } = body;
    
    // 기본 유효성 검사
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: '이메일과 비밀번호를 모두 입력해주세요.' }, 
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: '비밀번호는 최소 6자 이상이어야 합니다.' }, 
        { status: 400 }
      );
    }
    
    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: '이미 사용 중인 이메일입니다.' }, 
        { status: 409 }
      );
    }
    
    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 새 사용자 생성
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        // name은 선택적으로 추가 (email에서 추출)
        name: email.split('@')[0],
      }
    });
    
    // 비밀번호 제외하고 응답
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({
      success: true,
      message: '회원가입이 성공적으로 완료되었습니다.',
      user: userWithoutPassword
    }, { status: 201 });
    
  } catch (error) {
    console.error('회원가입 API 오류:', error);
    
    // JSON 파싱 오류 처리
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return NextResponse.json(
        { success: false, message: '잘못된 요청 형식입니다.' }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' }, 
      { status: 500 }
    );
  }
}
