import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "../../../lib/prisma";

type WordListRequestBody = {
  name?: unknown;
  description?: unknown;
  wordIds?: unknown;
};

function validateWordListBody(
  body: WordListRequestBody
) {
  if (
    typeof body.name !== "string" ||
    body.name.trim().length === 0
  ) {
    return {
      error:
        "Word list name is required.",
    };
  }

  if (
    body.description !== undefined &&
    body.description !== null &&
    typeof body.description !== "string"
  ) {
    return {
      error:
        "Description must be text.",
    };
  }

  if (!Array.isArray(body.wordIds)) {
    return {
      error:
        "wordIds must be an array.",
    };
  }

  const validWordIds =
    body.wordIds.every(
      (wordId) =>
        Number.isInteger(wordId) &&
        wordId > 0
    );

  if (!validWordIds) {
    return {
      error:
        "All word IDs must be valid positive integers.",
    };
  }

  return null;
}

// =========================================================
// GET ALL WORD LISTS
// =========================================================

export async function GET() {
  try {
    const wordLists =
      await prisma.wordList.findMany({
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

    return NextResponse.json(
      wordLists
    );
  } catch (error) {
    console.error(
      "GET /api/word-lists error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to retrieve word lists.",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================================================
// CREATE WORD LIST
// =========================================================

export async function POST(
  request: NextRequest
) {
  try {
    let body: WordListRequestBody;

    try {
      body =
        (await request.json()) as WordListRequestBody;
    } catch {
      return NextResponse.json(
        {
          error:
            "Request body must contain valid JSON.",
        },
        {
          status: 400,
        }
      );
    }

    const validationError =
      validateWordListBody(body);

    if (validationError) {
      return NextResponse.json(
        validationError,
        {
          status: 400,
        }
      );
    }

    const name =
      (body.name as string).trim();

    const description =
      typeof body.description ===
        "string" &&
      body.description.trim().length >
        0
        ? body.description.trim()
        : null;

    const uniqueWordIds = [
      ...new Set(
        body.wordIds as number[]
      ),
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
        existingWords.length !==
        uniqueWordIds.length
      ) {
        return NextResponse.json(
          {
            error:
              "One or more selected words do not exist.",
          },
          {
            status: 400,
          }
        );
      }
    }

    const wordList =
      await prisma.wordList.create({
        data: {
          name,
          description,

          words: {
            create:
              uniqueWordIds.map(
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

    return NextResponse.json(
      wordList,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/word-lists error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create word list.",
      },
      {
        status: 500,
      }
    );
  }
}