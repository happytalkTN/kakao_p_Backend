export interface UserDocument {
  // UserProfile 인터페이스 정의
  _id: string;
  id: string;
  provider: "kakao";
  nickname: string;
  createdAt: Date;
  profileImageUrl?: string;
}
export interface AuthPayload {
  // JWT 페이로드 인터페이스
  id: string;
  provider: string;
  nickname: string;
}
export interface UserProfileData {
  // 카카오 사용자 정보 인터페이스
  nickname: string;
  profileImageUrl: string | null;
}
export interface AuthStatusData {
  // 인증 상태 데이터 인터페이스
  isLoggedIn: boolean;
  user?: {
    nickname: string;
  };
}
