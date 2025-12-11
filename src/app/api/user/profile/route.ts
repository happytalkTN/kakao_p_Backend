import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";
import { errorResponse, sucessResponse } from "@/lib/utils/response";
import { connectToDatabase } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // 토큰이 없으면 401 반환
  if (!token) {
    const res = errorResponse("인증 토큰이 없습니다.", 401);
    res.headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
    res.headers.set("Access-Control-Allow-Credentials", "true");
    return res;
  }

  // JWT 검증
  const payload = verifyToken(token);
  if (!payload) {
    const res = errorResponse("유효하지 않은 토큰입니다.", 401);
    res.headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
    res.headers.set("Access-Control-Allow-Credentials", "true");
    return res;
  }

  // DB 연결
  await connectToDatabase();

  // 사용자 조회
  const user = await User.findOne({ id: payload.id });
  if (!user) {
    const res = errorResponse("사용자를 찾을 수 없습니다.", 404);
    res.headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
    res.headers.set("Access-Control-Allow-Credentials", "true");
    return res;
  }

  // 프로필 데이터 구성
  const profileData = {
    id: user.id,
    provider: user.provider,
    nickname: user.nickname,
    profileImageUrl: user.profileImageUrl,
    createdAt: user.createdAt,
  };

  // 성공 응답
  const res = sucessResponse(profileData);
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
  res.headers.set("Access-Control-Allow-Credentials", "true");

  return res;
}
