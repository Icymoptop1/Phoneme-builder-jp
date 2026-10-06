import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import {
  ActivityType,
  UsageEventType,
  UsageResult,
} from "../../../generated/prisma/enums";

export async function GET() {
  try {
    const [
      totalWords,
      totalWordLists,
      emptyWordLists,
      totalActivities,
      wordleActivities,
      wordSearchActivities,
      successfulGenerations,
      failedGenerations,
      pageTimeRecords,
      wordleUsage,
      wordSearchUsage,
      recentUsage,
    ] = await Promise.all([
      prisma.word.count(),

      prisma.wordList.count(),

      prisma.wordList.count({
        where: {
          words: {
            none: {},
          },
        },
      }),

      prisma.activity.count(),

      prisma.activity.count({
        where: {
          type: ActivityType.WORDLE,
        },
      }),

      prisma.activity.count({
        where: {
          type: ActivityType.WORD_SEARCH,
        },
      }),

      prisma.usageRecord.count({
        where: {
          eventType: UsageEventType.GENERATION,
          result: UsageResult.SUCCESS,
        },
      }),

      prisma.usageRecord.count({
        where: {
          eventType: UsageEventType.GENERATION,
          result: UsageResult.FAILED,
        },
      }),

      prisma.usageRecord.findMany({
        where: {
          eventType: UsageEventType.PAGE_TIME,
          durationMs: {
            not: null,
          },
        },
        select: {
          durationMs: true,
        },
      }),

      prisma.usageRecord.count({
        where: {
          activityType: ActivityType.WORDLE,
          eventType: UsageEventType.GENERATION,
        },
      }),

      prisma.usageRecord.count({
        where: {
          activityType: ActivityType.WORD_SEARCH,
          eventType: UsageEventType.GENERATION,
        },
      }),

      prisma.usageRecord.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),
    ]);

    const totalGenerations =
      successfulGenerations + failedGenerations;

    const totalPageTime = pageTimeRecords.reduce(
      (total, record) =>
        total + (record.durationMs ?? 0),
      0
    );

    const averageTimeOnPageMs =
      pageTimeRecords.length > 0
        ? Math.round(
            totalPageTime / pageTimeRecords.length
          )
        : 0;

    let mostUsedActivityType: string | null = null;

    if (wordleUsage > wordSearchUsage) {
      mostUsedActivityType = "WORDLE";
    } else if (wordSearchUsage > wordleUsage) {
      mostUsedActivityType = "WORD_SEARCH";
    } else if (
      wordleUsage > 0 &&
      wordSearchUsage > 0
    ) {
      mostUsedActivityType = "TIED";
    }

    return NextResponse.json({
      systemStatus: "healthy",

      totals: {
        words: totalWords,
        wordLists: totalWordLists,
        emptyWordLists,
        activities: totalActivities,
        wordleActivities,
        wordSearchActivities,
      },

      generations: {
        total: totalGenerations,
        successful: successfulGenerations,
        failed: failedGenerations,
      },

      usage: {
        wordle: wordleUsage,
        wordSearch: wordSearchUsage,
        mostUsedActivityType,
        averageTimeOnPageMs,
        recordedPageSessions:
          pageTimeRecords.length,
      },

      recentUsage,
    });
  } catch (error) {
    console.error(
      "Failed to calculate dashboard metrics:",
      error
    );

    return NextResponse.json(
      {
        systemStatus: "unhealthy",
        error:
          "Failed to calculate dashboard metrics.",
      },
      { status: 500 }
    );
  }
}