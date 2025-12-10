import { NextResponse } from 'next/server';

export async function POST() {      
  const response = NextResponse.json({ message: '로그아웃 성공' }); // 로그아웃 응답 생성
  response.cookies.set('token', '', { maxAge: 0, path: '/' });  // 토큰 쿠키 삭제
  return response;
}