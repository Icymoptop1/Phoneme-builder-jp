import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "phoneme-learning-activity-builder",
    },
    {
      status: 200,
    }
  );
}