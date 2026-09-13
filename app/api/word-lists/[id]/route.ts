import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// =========================================================
// GET ONE WORD LIST
// =========================================================

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const wordListId = Number(id);

    if (!Number.isInteger(wordListId) || wordListId <= 0) {
      return NextResponse.json(
        { error: "Invalid word list ID." },
        { status: 400 }
      );
    }

    const wordList = await prisma.wordList.findUnique({
      where: {
        id: wordListId,
      },
      include: {
        words: {
          include: {
            word: true,
          },
        },
      },
    });

    if (!wordList) {
      return NextResponse.json(
        { error: "Word list not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(wordList);
  } catch (error) {
    console.error("GET /api/word-lists/[id] error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve word list." },
      { status: 500 }
    );
  }
}

// =========================================================
// UPDATE WORD LIST
// =========================================================

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const wordListId = Number(id);

    if (!Number.isInteger(wordListId) || wordListId <= 0) {
      return NextResponse.json(
        { error: "Invalid word list ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const description =
      typeof body.description === "string" &&
      body.description.trim().length > 0
        ? body.description.trim()
        : null;

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
      (wordId) =>
        Number.isInteger(wordId) &&
        wordId > 0
    );

    if (!validWordIds) {
      return NextResponse.json(
        {
          error:
            "All word IDs must be valid positive integers.",
        },
        { status: 400 }
      );
    }

    const existingList =
      await prisma.wordList.findUnique({
        where: {
          id: wordListId,
        },
      });

    if (!existingList) {
      return NextResponse.json(
        { error: "Word list not found." },
        { status: 404 }
      );
    }

    const uniqueWordIds = [
      ...new Set<number>(wordIds),
    ];

    if (uniqueWordIds.length > 0) {
      const existingWords =
        await prisma.word.findMany({
          where: {
            id: {
              in: uniqueWordIds,
            },
          },
          select: {
            id: true,
          },
        });

      if (
        existingWords.length !== uniqueWordIds.length
      ) {
        return NextResponse.json(
          {
            error:
              "One or more selected words do not exist.",
          },
          { status: 400 }
        );
      }
    }

    const updatedWordList =
      await prisma.wordList.update({
        where: {
          id: wordListId,
        },

        data: {
          name,
          description,

          words: {
            deleteMany: {},

            create: uniqueWordIds.map(
              (wordId) => ({
                word: {
                  connect: {
                    id: wordId,
                  },
                },
              })
            ),
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

    return NextResponse.json(updatedWordList);
  } catch (error) {
    console.error(
      "PUT /api/word-lists/[id] error:",
      error
    );

    return NextResponse.json(
      { error: "Unable to update word list." },
      { status: 500 }
    );
  }
}

// =========================================================
// DELETE WORD LIST
// =========================================================

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const wordListId = Number(id);

    if (!Number.isInteger(wordListId) || wordListId <= 0) {
      return NextResponse.json(
        { error: "Invalid word list ID." },
        { status: 400 }
      );
    }

    const existingList =
      await prisma.wordList.findUnique({
        where: {
          id: wordListId,
        },
      });

    if (!existingList) {
      return NextResponse.json(
        { error: "Word list not found." },
        { status: 404 }
      );
    }

    await prisma.wordList.delete({
      where: {
        id: wordListId,
      },
    });

    return NextResponse.json({
      message: "Word list deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/word-lists/[id] error:",
      error
    );

    return NextResponse.json(
      { error: "Unable to delete word list." },
      { status: 500 }
    );
  }
}