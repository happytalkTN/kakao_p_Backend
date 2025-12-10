import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextResponse } from "next/server";

const COOKIE_NAME = "auth_token"; // 쿠키 이름
const MAX_AGE = 60 * 60 * 24 * 7; // 7일 (초 단위)
const IS_PRODUCTION = process.env.NODE_ENV === "production"; // 프로덕션 환경 여부

export function setAuthCookie(response: NextResponse, token: string) {
  // 인증 쿠키 설정 함수
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    maxAge: MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
}
export function removeAuthCookie(response: NextResponse) {
  // 인증 쿠키 제거 함수
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: IS_PRODUCTION,
    maxAge: 0,
    path: "/",
  });
}
export function getAuthCookie( // 인증 쿠키 가져오기 함수
  cookies: ReadonlyRequestCookies
): string | undefined {
  return cookies.get(COOKIE_NAME)?.value;
}
