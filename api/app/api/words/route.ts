import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "../../../lib/prisma";

type WordRequestBody = {
  english?: unknown;
  phonemes?: unknown;
  hint?: unknown;
};

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

export async function GET() {
  try {
    const words =
      await prisma.word.findMany({
        orderBy: {
          english: "asc",
        },
      });

    return NextResponse.json(words);
  } catch (error) {
    console.error(
      "GET /api/words error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to retrieve words.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
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

    const word =
      await prisma.word.create({
        data: {
          english,
          phonemes:
            JSON.stringify(phonemes),
          hint,
        },
      });

    return NextResponse.json(
      word,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/words error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create word.",
      },
      {
        status: 500,
      }
    );
  }
}