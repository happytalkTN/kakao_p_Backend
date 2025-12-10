import mongoose from "mongoose";                        // mongoose 불러오기
const MONGODB_URI = process.env.MONGODB_URI;            // 환경변수에서 MongoDB URI 불러오기
const MONGODB_DATABASE = process.env.MONGODB_DATABASE     
let isConnected = false;                                // 데이터베이스 연결 상태 변수

export async function connectToDatabase() {
    if (isConnected) {                         
        console.log("=> Using existing database connection");  
        return;
    }
    try {
        await mongoose.connect(MONGODB_URI!, {
          // MongoDB에 연결
          dbName: MONGODB_DATABASE, // 사용할 데이터베이스 이름 설정
        });
        isConnected = true;                              // 연결 상태 업데이트
        console.log("=> 연결성공");
    } catch (error) {
        console.error("=> 연결실패", error);            // 연결 실패 시 에러 로그 출력
    }
}
