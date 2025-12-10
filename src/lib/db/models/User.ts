import { model, models, Schema } from "mongoose";

export interface UserProfile {  // UserProfile 인터페이스 정의
  id: string;
  provider: string;
  nickname: string;
  createdAt: Date;
  profileImageUrl?: string;
}

const UserSchema = new Schema<UserProfile>({  // User 스키마 정의
    id: { type: String, required: true, unique: true },
    provider: { type: String, required: true },
    nickname: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    profileImageUrl: { type: String },
});

export const User = models.User || model<UserProfile>("User", UserSchema);  // User 모델 생성 또는 기존 모델 사용