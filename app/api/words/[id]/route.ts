import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "../../../../lib/prisma";

type WordRequestBody = {
  english?: unknown;
  phonemes?: unknown;
  hint?: unknown;
};

function getWordId(id: string) {
  const wordId = Number(id);

  if (
    !Number.isInteger(wordId) ||
    wordId <= 0
  ) {
    return null;
  }

  return wordId;
}

function validateWordBody(
  body: WordRequestBody
) {
  if (
    typeof body.english !== "string" ||
    body.english.trim().length === 0
  ) {
    return {
      error: "English word is required.",
    };
  }

  if (!Array.isArray(body.phonemes)) {
    return {
      error:
        "Phonemes must be provided as an array.",
    };
  }

  if (body.phonemes.length === 0) {
    return {
      error:
        "At least one phoneme is required.",
    };
  }

  const validPhonemes =
    body.phonemes.every(
      (phoneme) =>
        typeof phoneme === "string" &&
        phoneme.trim().length > 0
    );

  if (!validPhonemes) {
    return {
      error:
        "All phonemes must contain valid text.",
    };
  }

  if (
    body.hint !== undefined &&
    body.hint !== null &&
    typeof body.hint !== "string"
  ) {
    return {
      error:
        "Hint must be text.",
    };
  }

  return null;
}

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

    const wordId =
      getWordId(id);

    if (wordId === null) {
      return NextResponse.json(
        {
          error:
            "Invalid word ID.",
        },
        {
          status: 400,
        }
      );
    }

    const word =
      await prisma.word.findUnique({
        where: {
          id: wordId,
        },
      });

    if (!word) {
      return NextResponse.json(
        {
          error:
            "Word not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(word);
  } catch (error) {
    console.error(
      "GET /api/words/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to retrieve word.",
      },
      {
        status: 500,
      }
    );
  }
}

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

    const wordId =
      getWordId(id);

    if (wordId === null) {
      return NextResponse.json(
        {
          error:
            "Invalid word ID.",
        },
        {
          status: 400,
        }
      );
    }

    let body: WordRequestBody;

    try {
      body =
        (await request.json()) as WordRequestBody;
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
      validateWordBody(body);

    if (validationError) {
      return NextResponse.json(
        validationError,
        {
          status: 400,
        }
      );
    }

    const existingWord =
      await prisma.word.findUnique({
        where: {
          id: wordId,
        },
      });

    if (!existingWord) {
      return NextResponse.json(
        {
          error:
            "Word not found.",
        },
        {
          status: 404,
        }
      );
    }

    const english =
      (body.english as string).trim();

    const phonemes = (
      body.phonemes as string[]
    ).map((phoneme) =>
      phoneme.trim()
    );

    const hint =
      typeof body.hint === "string"
        ? body.hint.trim() || null
        : null;

    const updatedWord =
      await prisma.word.update({
        where: {
          id: wordId,
        },
        data: {
          english,
          phonemes:
            JSON.stringify(
              phonemes
            ),
          hint,
        },
      });

    return NextResponse.json(
      updatedWord
    );
  } catch (error) {
    console.error(
      "PUT /api/words/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to update word.",
      },
      {
        status: 500,
      }
    );
  }
}

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

    const wordId =
      getWordId(id);

    if (wordId === null) {
      return NextResponse.json(
        {
          error:
            "Invalid word ID.",
        },
        {
          status: 400,
        }
      );
    }

    const existingWord =
      await prisma.word.findUnique({
        where: {
          id: wordId,
        },
      });

    if (!existingWord) {
      return NextResponse.json(
        {
          error:
            "Word not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.word.delete({
      where: {
        id: wordId,
      },
    });

    return NextResponse.json({
      message:
        "Word deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/words/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to delete word.",
      },
      {
        status: 500,
      }
    );
  }
}