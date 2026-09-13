import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "../../../lib/prisma";

type ActivityRequestBody = {
  name?: unknown;
  type?: unknown;
  difficulty?: unknown;
  wordListId?: unknown;
  maxAttempts?: unknown;
  gridSize?: unknown;
  hintsEnabled?: unknown;
  theme?: unknown;
  settings?: unknown;
};

function validateActivityBody(
  body: ActivityRequestBody
) {
  if (
    typeof body.name !== "string" ||
    body.name.trim().length === 0
  ) {
    return {
      error: "Activity name is required.",
    };
  }

  if (
    body.type !== "WORDLE" &&
    body.type !== "WORD_SEARCH"
  ) {
    return {
      error: "Invalid activity type.",
    };
  }

  if (
    body.difficulty !== "EASY" &&
    body.difficulty !== "MEDIUM" &&
    body.difficulty !== "HARD"
  ) {
    return {
      error: "Invalid difficulty.",
    };
  }

  const wordListId =
    Number(body.wordListId);

  if (
    !Number.isInteger(wordListId) ||
    wordListId <= 0
  ) {
    return {
      error:
        "A valid word list is required.",
    };
  }

  if (
    body.hintsEnabled !== undefined &&
    typeof body.hintsEnabled !==
      "boolean"
  ) {
    return {
      error:
        "hintsEnabled must be true or false.",
    };
  }

  if (
    body.theme !== undefined &&
    body.theme !== "light" &&
    body.theme !== "dark"
  ) {
    return {
      error:
        "Theme must be light or dark.",
    };
  }

  if (body.type === "WORDLE") {
    const maxAttempts =
      Number(body.maxAttempts);

    if (
      !Number.isInteger(maxAttempts) ||
      maxAttempts < 1
    ) {
      return {
        error:
          "Wordle activities require a valid maximum number of attempts.",
      };
    }
  }

  if (
    body.type === "WORD_SEARCH"
  ) {
    const gridSize =
      Number(body.gridSize);

    if (
      !Number.isInteger(gridSize) ||
      ![6, 8, 10, 12].includes(
        gridSize
      )
    ) {
      return {
        error:
          "Word Search grid size must be 6, 8, 10, or 12.",
      };
    }
  }

  return null;
}

// =========================================================
// GET ALL ACTIVITIES
// =========================================================

export async function GET() {
  try {
    const activities =
      await prisma.activity.findMany({
        include: {
          wordList: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(
      activities
    );
  } catch (error) {
    console.error(
      "GET /api/activities error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to retrieve activities.",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================================================
// CREATE ACTIVITY
// =========================================================

export async function POST(
  request: NextRequest
) {
  try {
    let body: ActivityRequestBody;

    try {
      body =
        (await request.json()) as ActivityRequestBody;
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
      validateActivityBody(body);

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

    const type =
      body.type as
        | "WORDLE"
        | "WORD_SEARCH";

    const difficulty =
      body.difficulty as
        | "EASY"
        | "MEDIUM"
        | "HARD";

    const wordListId =
      Number(body.wordListId);

    const maxAttempts =
      type === "WORDLE"
        ? Number(
            body.maxAttempts
          )
        : null;

    const gridSize =
      type === "WORD_SEARCH"
        ? Number(body.gridSize)
        : null;

    const hintsEnabled =
      typeof body.hintsEnabled ===
      "boolean"
        ? body.hintsEnabled
        : true;

    const theme =
      body.theme === "dark"
        ? "dark"
        : "light";

    let settings: string | null =
      null;

    if (
      body.settings !== undefined &&
      body.settings !== null
    ) {
      try {
        settings =
          JSON.stringify(
            body.settings
          );
      } catch {
        return NextResponse.json(
          {
            error:
              "Activity settings could not be stored.",
          },
          {
            status: 400,
          }
        );
      }
    }

    const existingWordList =
      await prisma.wordList.findUnique({
        where: {
          id: wordListId,
        },

        include: {
          words: {
            select: {
              id: true,
            },
          },
        },
      });

    if (!existingWordList) {
      return NextResponse.json(
        {
          error:
            "Selected word list does not exist.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      existingWordList.words.length ===
      0
    ) {
      return NextResponse.json(
        {
          error:
            "Selected word list must contain at least one word.",
        },
        {
          status: 400,
        }
      );
    }

    const activity =
      await prisma.activity.create({
        data: {
          name,
          type,
          difficulty,
          wordListId,
          maxAttempts,
          gridSize,
          hintsEnabled,
          theme,
          settings,
        },

        include: {
          wordList: true,
        },
      });

    return NextResponse.json(
      activity,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/activities error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create activity.",
      },
      {
        status: 500,
      }
    );
  }
}