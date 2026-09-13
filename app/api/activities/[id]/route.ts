import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "../../../../lib/prisma";

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

function getActivityId(
  id: string
) {
  const activityId = Number(id);

  if (
    !Number.isInteger(activityId) ||
    activityId <= 0
  ) {
    return null;
  }

  return activityId;
}

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
// GET ONE ACTIVITY
// =========================================================

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await context.params;

    const activityId =
      getActivityId(id);

    if (activityId === null) {
      return NextResponse.json(
        {
          error:
            "Invalid activity ID.",
        },
        {
          status: 400,
        }
      );
    }

    const activity =
      await prisma.activity.findUnique({
        where: {
          id: activityId,
        },

        include: {
          wordList: {
            include: {
              words: {
                include: {
                  word: true,
                },
              },
            },
          },
        },
      });

    if (!activity) {
      return NextResponse.json(
        {
          error:
            "Activity not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      activity
    );
  } catch (error) {
    console.error(
      "GET /api/activities/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to retrieve activity.",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================================================
// UPDATE ACTIVITY
// =========================================================

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await context.params;

    const activityId =
      getActivityId(id);

    if (activityId === null) {
      return NextResponse.json(
        {
          error:
            "Invalid activity ID.",
        },
        {
          status: 400,
        }
      );
    }

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

    const existingActivity =
      await prisma.activity.findUnique({
        where: {
          id: activityId,
        },
      });

    if (!existingActivity) {
      return NextResponse.json(
        {
          error:
            "Activity not found.",
        },
        {
          status: 404,
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

    const updatedActivity =
      await prisma.activity.update({
        where: {
          id: activityId,
        },

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
      updatedActivity
    );
  } catch (error) {
    console.error(
      "PUT /api/activities/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to update activity.",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================================================
// DELETE ACTIVITY
// =========================================================

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await context.params;

    const activityId =
      getActivityId(id);

    if (activityId === null) {
      return NextResponse.json(
        {
          error:
            "Invalid activity ID.",
        },
        {
          status: 400,
        }
      );
    }

    const existingActivity =
      await prisma.activity.findUnique({
        where: {
          id: activityId,
        },
      });

    if (!existingActivity) {
      return NextResponse.json(
        {
          error:
            "Activity not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.activity.delete({
      where: {
        id: activityId,
      },
    });

    return NextResponse.json({
      message:
        "Activity deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/activities/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to delete activity.",
      },
      {
        status: 500,
      }
    );
  }
}