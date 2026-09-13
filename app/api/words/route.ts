import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const words = await prisma.word.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(words);
  } catch (error) {
    console.error("GET /api/words error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve words." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const english = body.english?.trim();
    const phonemes = body.phonemes;
    const hint = body.hint?.trim() || null;

    if (!english) {
      return NextResponse.json(
        { error: "English word is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(phonemes) || phonemes.length === 0) {
      return NextResponse.json(
        { error: "At least one phoneme is required." },
        { status: 400 }
      );
    }

    const validPhonemes = phonemes.every(
      (phoneme) =>
        typeof phoneme === "string" &&
        phoneme.trim().length > 0
    );

    if (!validPhonemes) {
      return NextResponse.json(
        { error: "All phonemes must contain valid text." },
        { status: 400 }
      );
    }

    const word = await prisma.word.create({
      data: {
        english,
        phonemes: JSON.stringify(phonemes),
        hint,
      },
    });

    return NextResponse.json(word, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/words error:", error);

    return NextResponse.json(
      { error: "Unable to create word." },
      { status: 500 }
    );
  }
}