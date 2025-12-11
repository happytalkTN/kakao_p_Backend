import { NextResponse } from "next/server";

export function sucessResponse<T>(data: T, status: number = 200): NextResponse {
  //  성공 응답 함수
  return NextResponse.json(
    {
      success: true,
      data: data,
      message: "요청 성공",
    },
    { status }
  );
}
export function errorResponse( //  에러 응답 함수
  message: string,
  status: number = 500
): NextResponse {
  return NextResponse.json(
    {
      sucess: false,
      data: null,
      message: message,
    },
    { status }
  );
}
