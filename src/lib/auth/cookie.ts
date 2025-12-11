import { NextResponse } from "next/server";

const COOKIE_NAME = "auth_token";
const MAX_AGE = 60 * 60 * 24 * 7;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export function setAuthCookie(response: NextResponse, token: string): void {
  // 인증 쿠키 설정 함수
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    maxAge: MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
}

export function removeAuthCookie(response: NextResponse): void {
  // 인증 쿠키 제거 함수
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: IS_PRODUCTION,
    maxAge: 0,
    path: "/",
  });
}

