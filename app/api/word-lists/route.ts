import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET all word lists
export async function GET() {
  try {
    const wordLists = await prisma.wordList.findMany({
      include: {
        words: {
          include: {
            word: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(wordLists);
  } catch (error) {
    console.error("GET /api/word-lists error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve word lists." },
      { status: 500 }
    );
  }
}

// CREATE a new word list
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = body.name?.trim();
    const description = body.description?.trim() || null;
    const wordIds = body.wordIds;

    if (!name) {
      return NextResponse.json(
        { error: "Word list name is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(wordIds)) {
      return NextResponse.json(
        { error: "wordIds must be an array." },
        { status: 400 }
      );
    }

    const validWordIds = wordIds.every(
      (id) => Number.isInteger(id) && id > 0
    );

    if (!validWordIds) {
      return NextResponse.json(
        { error: "All word IDs must be valid positive integers." },
        { status: 400 }
      );
    }

    const uniqueWordIds = [...new Set(wordIds)];

    if (uniqueWordIds.length > 0) {
      const existingWords = await prisma.word.findMany({
        where: {
          id: {
            in: uniqueWordIds,
          },
        },
        select: {
          id: true,
        },
      });

      if (existingWords.length !== uniqueWordIds.length) {
        return NextResponse.json(
          { error: "One or more selected words do not exist." },
          { status: 400 }
        );
      }
    }

    const wordList = await prisma.wordList.create({
      data: {
        name,
        description,

        words: {
          create: uniqueWordIds.map((wordId) => ({
            word: {
              connect: {
                id: wordId,
              },
            },
          })),
        },
      },

      include: {
        words: {
          include: {
            word: true,
          },
        },
      },
    });

    return NextResponse.json(wordList, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/word-lists error:", error);

    return NextResponse.json(
      { error: "Unable to create word list." },
      { status: 500 }
    );
  }
}