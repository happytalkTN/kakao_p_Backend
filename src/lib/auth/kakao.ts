import axios from "axios";

const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;

export interface kakaoUserInfo {
  // 카카오 사용자 정보 인터페이스
  id: number;
  nickname: string;
  profileImageUrl: string | null;
}

export async function getKakaoUserInfo(code: string): Promise<kakaoUserInfo> {
  // 카카오 사용자 정보 가져오기 함수
  const tokenUrl = "https://kauth.kakao.com/oauth/token"; // 토큰 발급 API URL
  const tokenResponse = await axios.post(tokenUrl, null, {
    params: {
      grant_type: "authorization_code",
      client_id: KAKAO_CLIENT_ID,
      client_secret: KAKAO_CLIENT_SECRET,
      redirect_uri: KAKAO_REDIRECT_URI,
      code: code,
    },
  });

  const accessToken = tokenResponse.data.access_token; // 액세스 토큰 추출

  const userUrl = "https://kapi.kakao.com/v2/user/me"; // 사용자 정보 API URL
  const userInfoResponse = await axios.get(userUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`, //  액세스 토큰을 이용한 인증
    },
  });

  const kakaoUser = userInfoResponse.data; // 사용자 정보 추출

  const nickname = kakaoUser.kakao_account.profile.nickname;
  const profileImageUrl =
    kakaoUser.kakao_account.profile.profile_image_url || null;

  return {
    id: kakaoUser.id,
    nickname: nickname,
    profileImageUrl: profileImageUrl,
  };
}
