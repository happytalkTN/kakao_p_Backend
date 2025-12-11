import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";
import { errorResponse, sucessResponse } from "@/lib/utils/response";
import { removeAuthCookie } from "@/lib/auth/cookie";
import { AuthStatusData } from "@/types/user";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value; // 인증 쿠키 가져오기

  if (!token) {
    return errorResponse("인증 토큰이 없습니다.", 401);
  }

  const payload = verifyToken(token); // 토큰 검증
  if (payload) {
    const data: AuthStatusData = {
      isLoggedIn: true,
      user: { nickname: payload.nickname },
    };
    return sucessResponse<AuthStatusData>(data);
  } else {
    const response = errorResponse("유효하지 않은 토큰입니다.", 401);
    removeAuthCookie(response); // 유효하지 않은 토큰일 경우 쿠키 제거
    return response;
  }
}
