import mongoose from "mongoose";                        // mongoose 불러오기
const MONGODB_URI = process.env.MONGODB_URI;            // 환경변수에서 MongoDB URI 불러오기
let isConnected = false;                              // 데이터베이스 연결 상태 변수

export async function connectToDatabase() {
    if (isConnected) {                         
        console.log("=> Using existing database connection");  
        return;
    }
    try {
        await mongoose.connect(MONGODB_URI!, {          // MongoDB에 연결
            dbName: "kakao",
        });
        isConnected = true;                              // 연결 상태 업데이트
        console.log("=> 연결성공");
    } catch (error) {
        console.error("=> 연결실패", error);            // 연결 실패 시 에러 로그 출력
    }
}
