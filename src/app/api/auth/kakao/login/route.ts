import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { User } from "@/lib/db/models/User";
import { createToken } from "@/lib/auth/jwt";
import { connectToDatabase } from "@/lib/db/connect";

// 카카오 설정 값
const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;

// CORS 설정
const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

// preflight 대응
export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  const { code } = await req.json(); // 프론트에서 받아온 코드

  if (!code) {
    return NextResponse.json(
      { message: "인증 코드가 없습니다." },
      { status: 400, headers: corsHeaders }
    );
  }

  await connectToDatabase(); // DB 연결

  try {
    // 카카오 토큰 요청
    const tokenRes = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: KAKAO_CLIENT_ID,
          client_secret: KAKAO_CLIENT_SECRET,
          redirect_uri: KAKAO_REDIRECT_URI,
          code,
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // 카카오 사용자 정보 가져오기
    const userRes = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = userRes.data;

    const nickname = data.kakao_account.profile.nickname;
    const profileImageUrl = data.kakao_account.profile.profile_image_url;

    // 기존 유저 체크
    let user = await User.findOne({
      id: data.id.toString(),
      provider: "kakao",
    });

    // 없으면 새로 저장
    if (!user) {
      user = new User({
        id: data.id.toString(),
        provider: "kakao",
        nickname,
        profileImageUrl,
      });
      await user.save();
    }

    // JWT 발급
    const token = createToken({
      id: user.id,
      provider: user.provider,
      nickname: user.nickname,
    });

    const res = NextResponse.json({ message: "로그인 성공" }, { status: 200 });

    // 쿠키 저장
    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    // CORS 헤더 적용
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.headers.set(key, value);
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { message: "카카오 로그인 처리 중 오류 발생" },
      { status: 500, headers: corsHeaders }
    );
  }
}
