import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// =========================================================
// GET ONE ACTIVITY
// =========================================================

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const activityId = Number(id);

    if (
      !Number.isInteger(activityId) ||
      activityId <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid activity ID." },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.findUnique({
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
        { error: "Activity not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(activity);
  } catch (error) {
    console.error(
      "GET /api/activities/[id] error:",
      error
    );

    return NextResponse.json(
      { error: "Unable to retrieve activity." },
      { status: 500 }
    );
  }
}

// =========================================================
// UPDATE ACTIVITY
// =========================================================

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const activityId = Number(id);

    if (
      !Number.isInteger(activityId) ||
      activityId <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid activity ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const type = body.type;
    const difficulty = body.difficulty;
    const wordListId = Number(body.wordListId);

    const maxAttempts =
      body.maxAttempts === null ||
      body.maxAttempts === undefined ||
      body.maxAttempts === ""
        ? null
        : Number(body.maxAttempts);

    const gridSize =
      body.gridSize === null ||
      body.gridSize === undefined ||
      body.gridSize === ""
        ? null
        : Number(body.gridSize);

    const hintsEnabled =
      typeof body.hintsEnabled === "boolean"
        ? body.hintsEnabled
        : true;

    const theme =
      body.theme === "dark"
        ? "dark"
        : "light";

    const settings =
      body.settings === undefined ||
      body.settings === null
        ? null
        : JSON.stringify(body.settings);

    if (!name) {
      return NextResponse.json(
        { error: "Activity name is required." },
        { status: 400 }
      );
    }

    if (
      type !== "WORDLE" &&
      type !== "WORD_SEARCH"
    ) {
      return NextResponse.json(
        { error: "Invalid activity type." },
        { status: 400 }
      );
    }

    if (
      difficulty !== "EASY" &&
      difficulty !== "MEDIUM" &&
      difficulty !== "HARD"
    ) {
      return NextResponse.json(
        { error: "Invalid difficulty." },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(wordListId) ||
      wordListId <= 0
    ) {
      return NextResponse.json(
        { error: "A valid word list is required." },
        { status: 400 }
      );
    }

    if (
      type === "WORDLE" &&
      (maxAttempts === null ||
        !Number.isInteger(maxAttempts) ||
        maxAttempts < 1)
    ) {
      return NextResponse.json(
        {
          error:
            "Wordle activities require a valid maximum number of attempts.",
        },
        { status: 400 }
      );
    }

    if (
      type === "WORD_SEARCH" &&
      (gridSize === null ||
        !Number.isInteger(gridSize) ||
        ![6, 8, 10, 12].includes(gridSize))
    ) {
      return NextResponse.json(
        {
          error:
            "Word Search grid size must be 6, 8, 10, or 12.",
        },
        { status: 400 }
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
        { error: "Activity not found." },
        { status: 404 }
      );
    }

    const existingWordList =
      await prisma.wordList.findUnique({
        where: {
          id: wordListId,
        },
      });

    if (!existingWordList) {
      return NextResponse.json(
        { error: "Selected word list does not exist." },
        { status: 400 }
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

          maxAttempts:
            type === "WORDLE"
              ? maxAttempts
              : null,

          gridSize:
            type === "WORD_SEARCH"
              ? gridSize
              : null,

          hintsEnabled,
          theme,
          settings,
        },

        include: {
          wordList: true,
        },
      });

    return NextResponse.json(updatedActivity);
  } catch (error) {
    console.error(
      "PUT /api/activities/[id] error:",
      error
    );

    return NextResponse.json(
      { error: "Unable to update activity." },
      { status: 500 }
    );
  }
}

// =========================================================
// DELETE ACTIVITY
// =========================================================

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const activityId = Number(id);

    if (
      !Number.isInteger(activityId) ||
      activityId <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid activity ID." },
        { status: 400 }
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
        { error: "Activity not found." },
        { status: 404 }
      );
    }

    await prisma.activity.delete({
      where: {
        id: activityId,
      },
    });

    return NextResponse.json({
      message: "Activity deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/activities/[id] error:",
      error
    );

    return NextResponse.json(
      { error: "Unable to delete activity." },
      { status: 500 }
    );
  }
}