import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const wordId = Number(id);

    if (Number.isNaN(wordId)) {
      return NextResponse.json(
        { error: "Invalid word ID." },
        { status: 400 }
      );
    }

    const word = await prisma.word.findUnique({
      where: {
        id: wordId,
      },
    });

    if (!word) {
      return NextResponse.json(
        { error: "Word not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(word);
  } catch (error) {
    console.error("GET /api/words/[id] error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve word." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const wordId = Number(id);

    if (Number.isNaN(wordId)) {
      return NextResponse.json(
        { error: "Invalid word ID." },
        { status: 400 }
      );
    }

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

    const existingWord = await prisma.word.findUnique({
      where: {
        id: wordId,
      },
    });

    if (!existingWord) {
      return NextResponse.json(
        { error: "Word not found." },
        { status: 404 }
      );
    }

    const updatedWord = await prisma.word.update({
      where: {
        id: wordId,
      },
      data: {
        english,
        phonemes: JSON.stringify(phonemes),
        hint,
      },
    });

    return NextResponse.json(updatedWord);
  } catch (error) {
    console.error("PUT /api/words/[id] error:", error);

    return NextResponse.json(
      { error: "Unable to update word." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const wordId = Number(id);

    if (Number.isNaN(wordId)) {
      return NextResponse.json(
        { error: "Invalid word ID." },
        { status: 400 }
      );
    }

    const existingWord = await prisma.word.findUnique({
      where: {
        id: wordId,
      },
    });

    if (!existingWord) {
      return NextResponse.json(
        { error: "Word not found." },
        { status: 404 }
      );
    }

    await prisma.word.delete({
      where: {
        id: wordId,
      },
    });

    return NextResponse.json({
      message: "Word deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/words/[id] error:", error);

    return NextResponse.json(
      { error: "Unable to delete word." },
      { status: 500 }
    );
  }
}