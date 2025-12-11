import { NextResponse } from "next/server";

export async function POST() {
  // 쿠키 삭제
  const response = NextResponse.json({ message: "로그아웃 성공" });
  response.cookies.set("auth_token", "", { maxAge: 0, path: "/" });
  response.headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}
