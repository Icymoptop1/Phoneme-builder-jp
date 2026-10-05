import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import {
  ActivityType,
  UsageEventType,
  UsageResult,
} from "../../../generated/prisma/enums";

export async function GET() {
  try {
    const records = await prisma.usageRecord.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error("Failed to retrieve usage records:", error);

    return NextResponse.json(
      { error: "Failed to retrieve usage records." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      activityType,
      eventType,
      result,
      durationMs,
      activityId,
      message,
    } = body;

    if (
      !eventType ||
      !Object.values(UsageEventType).includes(eventType as UsageEventType)
    ) {
      return NextResponse.json(
        { error: "A valid eventType is required." },
        { status: 400 }
      );
    }

    if (
      activityType !== undefined &&
      activityType !== null &&
      !Object.values(ActivityType).includes(activityType as ActivityType)
    ) {
      return NextResponse.json(
        { error: "activityType must be WORDLE or WORD_SEARCH." },
        { status: 400 }
      );
    }

    if (
      result !== undefined &&
      result !== null &&
      !Object.values(UsageResult).includes(result as UsageResult)
    ) {
      return NextResponse.json(
        { error: "result must be SUCCESS or FAILED." },
        { status: 400 }
      );
    }

    if (
      durationMs !== undefined &&
      durationMs !== null &&
      (!Number.isInteger(durationMs) || durationMs < 0)
    ) {
      return NextResponse.json(
        { error: "durationMs must be a non-negative integer." },
        { status: 400 }
      );
    }

    if (
      activityId !== undefined &&
      activityId !== null &&
      (!Number.isInteger(activityId) || activityId <= 0)
    ) {
      return NextResponse.json(
        { error: "activityId must be a positive integer." },
        { status: 400 }
      );
    }

    if (
      message !== undefined &&
      message !== null &&
      typeof message !== "string"
    ) {
      return NextResponse.json(
        { error: "message must be a string." },
        { status: 400 }
      );
    }

    if (activityId !== undefined && activityId !== null) {
      const activity = await prisma.activity.findUnique({
        where: { id: activityId },
      });

      if (!activity) {
        return NextResponse.json(
          { error: "Referenced activity was not found." },
          { status: 404 }
        );
      }
    }

    const record = await prisma.usageRecord.create({
      data: {
        activityType: activityType ?? null,
        eventType,
        result: result ?? null,
        durationMs: durationMs ?? null,
        activityId: activityId ?? null,
        message: message?.trim() || null,
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Request body contains malformed JSON." },
        { status: 400 }
      );
    }

    console.error("Failed to create usage record:", error);

    return NextResponse.json(
      { error: "Failed to create usage record." },
      { status: 500 }
    );
  }
}