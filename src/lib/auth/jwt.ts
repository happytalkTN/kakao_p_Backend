import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d"; // 토큰 만료 기간 설정 (7일) 환경변수에 세팅 했으나 사용하면 sign에서 오류발생

export interface JwtPayload {
  // JWT 페이로드 인터페이스
  id: string;
  provider: string;
  nickname: string;
}

export function createToken(payload: JwtPayload): string {
  // JWT 토큰 생성 함수
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET 환경 변수가 설정되지 않았습니다.");
  }
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload | null {
  // JWT 토큰 검증 함수
  if (!JWT_SECRET) {
    return null;
  }
  try {
    return jwt.verify(token, JWT_SECRET as string) as JwtPayload; // 검증된 페이로드 반환
  } catch {
    return null;
  }
}
