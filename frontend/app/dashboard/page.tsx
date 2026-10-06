"use client";

import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";

type Metrics = {
  systemStatus: string;
  totals: {
    words: number;
    wordLists: number;
    emptyWordLists: number;
    activities: number;
    wordleActivities: number;
    wordSearchActivities: number;
  };
  generations: {
    total: number;
    successful: number;
    failed: number;
  };
  usage: {
    wordle: number;
    wordSearch: number;
    mostUsedActivityType: string | null;
    averageTimeOnPageMs: number;
    recordedPageSessions: number;
  };
  recentUsage: {
    id: number;
    activityType: "WORDLE" | "WORD_SEARCH" | null;
    eventType: "PAGE_VIEW" | "PAGE_TIME" | "GENERATION";
    result: "SUCCESS" | "FAILED" | null;
    durationMs: number | null;
    activityId: number | null;
    message: string | null;
    createdAt: string;
  }[];
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const response = await fetch("/api/metrics", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load dashboard metrics.");
        }

        const data: Metrics = await response.json();
        setMetrics(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard metrics."
        );
      }
    };

    loadMetrics();
  }, []);

  if (error) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Dashboard</h1>
        <p role="alert">{error}</p>
      </main>
    );
  }

  if (!metrics) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Dashboard</h1>
        <p>Loading dashboard metrics...</p>
      </main>
    );
  }

  const averageSeconds = (
    metrics.usage.averageTimeOnPageMs / 1000
  ).toFixed(1);

  const mostUsedActivity =
    metrics.usage.mostUsedActivityType === "WORD_SEARCH"
      ? "Word Search"
      : metrics.usage.mostUsedActivityType === "WORDLE"
        ? "Wordle"
        : metrics.usage.mostUsedActivityType === "TIED"
          ? "Tied"
          : "No usage recorded";

  const successRate =
    metrics.generations.total > 0
      ? Math.round(
          (metrics.generations.successful /
            metrics.generations.total) *
            100
        )
      : 0;

  const hasFailedGenerations =
    metrics.generations.failed > 0;

  const hasEmptyWordLists =
    metrics.totals.emptyWordLists > 0;

  return (
    <main className={styles.dashboard}>
      <header className={styles.heading}>
        <h1>Dashboard</h1>
        <p>
          Operational and usage statistics for the Phoneme Learning
          Activity Builder.
        </p>
      </header>

      <div className={styles.health}>
        <span
          className={styles.statusDot}
          aria-hidden="true"
        />
        System{" "}
        {metrics.systemStatus === "healthy"
          ? "Healthy"
          : "Unhealthy"}
      </div>

      <section
        className={styles.summaryGrid}
        aria-label="Dashboard summary"
      >
        <article className={styles.summaryCard}>
          <p className={styles.label}>Word Lists</p>
          <p className={styles.value}>
            {metrics.totals.wordLists}
          </p>
        </article>

        <article className={styles.summaryCard}>
          <p className={styles.label}>Activities</p>
          <p className={styles.value}>
            {metrics.totals.activities}
          </p>
        </article>

        <article className={styles.summaryCard}>
          <p className={styles.label}>Generations</p>
          <p className={styles.value}>
            {metrics.generations.total}
          </p>
        </article>

        <article className={styles.summaryCard}>
          <p className={styles.label}>Average Time</p>
          <p className={styles.value}>
            {averageSeconds}s
          </p>
        </article>
      </section>

      <section className={styles.alertSection}>
        <h2>Operational Status</h2>

        {hasFailedGenerations && (
          <div
            className={`${styles.alert} ${styles.alertWarning}`}
            role="alert"
          >
            <strong>Generation warning:</strong>{" "}
            {metrics.generations.failed} failed generation
            {metrics.generations.failed === 1 ? "" : "s"} recorded.
          </div>
        )}

        {hasEmptyWordLists && (
          <div
            className={`${styles.alert} ${styles.alertWarning}`}
            role="alert"
          >
            <strong>Word list warning:</strong>{" "}
            {metrics.totals.emptyWordLists} empty word list
            {metrics.totals.emptyWordLists === 1 ? "" : "s"} detected.
          </div>
        )}

        {!hasFailedGenerations && !hasEmptyWordLists && (
          <div
            className={`${styles.alert} ${styles.alertOk}`}
          >
            <strong>No operational warnings detected.</strong>{" "}
            Generation activity and stored word lists are operating
            normally.
          </div>
        )}
      </section>

      <div className={styles.reportGrid}>
        <section className={styles.panel}>
          <h2>Activity Usage</h2>

          <div className={styles.statRow}>
            <span>Wordle Activities</span>
            <span>{metrics.totals.wordleActivities}</span>
          </div>

          <div className={styles.statRow}>
            <span>Word Search Activities</span>
            <span>{metrics.totals.wordSearchActivities}</span>
          </div>

          <div className={styles.statRow}>
            <span>Most Used</span>
            <span>{mostUsedActivity}</span>
          </div>
        </section>

        <section className={styles.panel}>
          <h2>Generation Health</h2>

          <div className={styles.statRow}>
            <span>Successful</span>
            <span>{metrics.generations.successful}</span>
          </div>

          <div className={styles.statRow}>
            <span>Failed</span>
            <span>{metrics.generations.failed}</span>
          </div>

          <div className={styles.statRow}>
            <span>Success Rate</span>
            <span>{successRate}%</span>
          </div>
        </section>
      </div>

      <section className={styles.additional}>
        <h2>Additional Statistics</h2>

        <div className={styles.additionalGrid}>
          <div className={styles.statRow}>
            <span>Total Words</span>
            <span>{metrics.totals.words}</span>
          </div>

          <div className={styles.statRow}>
            <span>Empty Word Lists</span>
            <span>{metrics.totals.emptyWordLists}</span>
          </div>

          <div className={styles.statRow}>
            <span>Page Sessions</span>
            <span>
              {metrics.usage.recordedPageSessions}
            </span>
          </div>

          <div className={styles.statRow}>
            <span>Wordle Generations</span>
            <span>{metrics.usage.wordle}</span>
          </div>

          <div className={styles.statRow}>
            <span>Word Search Generations</span>
            <span>{metrics.usage.wordSearch}</span>
          </div>
        </div>
      </section>

      <section className={styles.recentSection}>
        <h2>Recent Usage</h2>

        <p className={styles.sectionDescription}>
          Latest activity and monitoring records stored in the database.
        </p>

        {metrics.recentUsage.length === 0 ? (
          <p>No usage records have been recorded yet.</p>
        ) : (
          <div className={styles.recentList}>
            {metrics.recentUsage.slice(0, 5).map((record) => (
              <div
                key={record.id}
                className={styles.recentRow}
              >
                <div>
                  <strong>
                    {record.activityType === "WORD_SEARCH"
                      ? "Word Search"
                      : record.activityType === "WORDLE"
                        ? "Wordle"
                        : "System"}
                  </strong>

                  <p className={styles.recentMessage}>
                    {record.message ?? "Usage event recorded"}
                  </p>
                </div>

                <div className={styles.recentDetails}>
                  <span>
                    {record.eventType === "PAGE_TIME"
                      ? "Page Time"
                      : record.eventType === "PAGE_VIEW"
                        ? "Page View"
                        : "Generation"}
                  </span>

                  <span>
                    {new Date(
                      record.createdAt
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}