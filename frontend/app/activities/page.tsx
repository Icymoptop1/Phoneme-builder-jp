"use client";

import { useEffect, useState } from "react";

type WordList = {
  id: number;
  name: string;
};

type Activity = {
  id: number;
  name: string;
  type: "WORDLE" | "WORD_SEARCH";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  maxAttempts: number | null;
  gridSize: number | null;
  hintsEnabled: boolean;
  theme: string;
  wordListId: number;
  wordList: WordList;
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [wordLists, setWordLists] = useState<WordList[]>([]);

  const [name, setName] = useState("");
  const [type, setType] = useState<"WORDLE" | "WORD_SEARCH">("WORDLE");
  const [difficulty, setDifficulty] =
    useState<"EASY" | "MEDIUM" | "HARD">("EASY");

  const [wordListId, setWordListId] = useState("");
  const [maxAttempts, setMaxAttempts] = useState("6");
  const [gridSize, setGridSize] = useState("6");
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  async function loadActivities() {
    try {
      const response = await fetch("/api/activities");
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Unable to load activities.");
        return;
      }

      setActivities(data);
    } catch {
      setMessage("Unable to connect to the server.");
    }
  }

  async function loadWordLists() {
    try {
      const response = await fetch("/api/word-lists");
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Unable to load word lists.");
        return;
      }

      setWordLists(data);
    } catch {
      setMessage("Unable to connect to the server.");
    }
  }

  useEffect(() => {
    loadActivities();
    loadWordLists();
  }, []);

  function resetForm() {
    setName("");
    setType("WORDLE");
    setDifficulty("EASY");
    setWordListId("");
    setMaxAttempts("6");
    setGridSize("6");
    setHintsEnabled(true);
    setTheme("light");
    setEditingId(null);
  }

  async function handleSubmit(
    event: { preventDefault: () => void }
  ) {
    event.preventDefault();

    setMessage("");

    const payload = {
      name,
      type,
      difficulty,
      wordListId: Number(wordListId),
      maxAttempts:
        type === "WORDLE"
          ? Number(maxAttempts)
          : null,
      gridSize:
        type === "WORD_SEARCH"
          ? Number(gridSize)
          : null,
      hintsEnabled,
      theme,
      settings: null,
    };

    try {
      const response = await fetch(
        editingId
          ? `/api/activities/${editingId}`
          : "/api/activities",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Unable to save activity.");
        return;
      }

      setMessage(
        editingId
          ? "Activity updated successfully."
          : "Activity created successfully."
      );

      resetForm();
      await loadActivities();
    } catch {
      setMessage("Unable to connect to the server.");
    }
  }

  function handleEdit(activity: Activity) {
    setEditingId(activity.id);
    setName(activity.name);
    setType(activity.type);
    setDifficulty(activity.difficulty);
    setWordListId(String(activity.wordListId));
    setMaxAttempts(String(activity.maxAttempts ?? 6));
    setGridSize(String(activity.gridSize ?? 6));
    setHintsEnabled(activity.hintsEnabled);
    setTheme(
      activity.theme === "dark"
        ? "dark"
        : "light"
    );

    setMessage("");
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this activity?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Unable to delete activity.");
        return;
      }

      setMessage("Activity deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await loadActivities();
    } catch {
      setMessage("Unable to connect to the server.");
    }
  }

  return (
    <main className="activity-management-page">
      <section className="activity-management-header">
        <h1>Saved Activities</h1>

        <p>
          Create and manage reusable Wordle and Word Search activity
          configurations.
        </p>
      </section>

      <section className="activity-form-section">
        <h2>
          {editingId
            ? "Edit Activity"
            : "Create Activity"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="activity-form"
        >
          <label>
            Activity Name

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="e.g. Week 1 Wordle"
              required
            />
          </label>

          <label>
            Activity Type

            <select
              value={type}
              onChange={(event) =>
                setType(
                  event.target.value as
                    | "WORDLE"
                    | "WORD_SEARCH"
                )
              }
            >
              <option value="WORDLE">
                Wordle
              </option>

              <option value="WORD_SEARCH">
                Word Search
              </option>
            </select>
          </label>

          <label>
            Difficulty

            <select
              value={difficulty}
              onChange={(event) =>
                setDifficulty(
                  event.target.value as
                    | "EASY"
                    | "MEDIUM"
                    | "HARD"
                )
              }
            >
              <option value="EASY">
                Easy
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HARD">
                Hard
              </option>
            </select>
          </label>

          <label>
            Word List

            <select
              value={wordListId}
              onChange={(event) =>
                setWordListId(event.target.value)
              }
              required
            >
              <option value="">
                Select a word list
              </option>

              {wordLists.map((wordList) => (
                <option
                  key={wordList.id}
                  value={wordList.id}
                >
                  {wordList.name}
                </option>
              ))}
            </select>
          </label>

          {type === "WORDLE" && (
            <label>
              Maximum Attempts

              <input
                type="number"
                min="1"
                max="12"
                value={maxAttempts}
                onChange={(event) =>
                  setMaxAttempts(event.target.value)
                }
                required
              />
            </label>
          )}

          {type === "WORD_SEARCH" && (
            <label>
              Grid Size

              <select
                value={gridSize}
                onChange={(event) =>
                  setGridSize(event.target.value)
                }
              >
                <option value="6">
                  6 × 6
                </option>

                <option value="8">
                  8 × 8
                </option>

                <option value="10">
                  10 × 10
                </option>

                <option value="12">
                  12 × 12
                </option>
              </select>
            </label>
          )}

          <label className="activity-checkbox-label">
            <input
              type="checkbox"
              checked={hintsEnabled}
              onChange={(event) =>
                setHintsEnabled(event.target.checked)
              }
            />

            Enable Hints
          </label>

          <label>
            Activity Theme

            <select
              value={theme}
              onChange={(event) =>
                setTheme(
                  event.target.value as
                    | "light"
                    | "dark"
                )
              }
            >
              <option value="light">
                Light
              </option>

              <option value="dark">
                Dark
              </option>
            </select>
          </label>

          <div className="activity-form-actions">
            <button type="submit">
              {editingId
                ? "Update Activity"
                : "Create Activity"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {message && (
          <p className="activity-message">
            {message}
          </p>
        )}
      </section>

      <section className="saved-activities-section">
        <h2>Saved Activity Configurations</h2>

        {activities.length === 0 ? (
          <p>
            No activities have been created yet.
          </p>
        ) : (
          <div className="saved-activities-grid">
            {activities.map((activity) => (
              <article
                key={activity.id}
                className="saved-activity-card"
              >
                <h3>{activity.name}</h3>

                <p>
                  <strong>Type:</strong>{" "}
                  {activity.type === "WORDLE"
                    ? "Wordle"
                    : "Word Search"}
                </p>

                <p>
                  <strong>Difficulty:</strong>{" "}
                  {activity.difficulty}
                </p>

                <p>
                  <strong>Word List:</strong>{" "}
                  {activity.wordList.name}
                </p>

                {activity.type === "WORDLE" && (
                  <p>
                    <strong>
                      Maximum Attempts:
                    </strong>{" "}
                    {activity.maxAttempts}
                  </p>
                )}

                {activity.type === "WORD_SEARCH" && (
                  <p>
                    <strong>
                      Grid Size:
                    </strong>{" "}
                    {activity.gridSize} ×{" "}
                    {activity.gridSize}
                  </p>
                )}

                <p>
                  <strong>Hints:</strong>{" "}
                  {activity.hintsEnabled
                    ? "Enabled"
                    : "Disabled"}
                </p>

                <p>
                  <strong>Theme:</strong>{" "}
                  {activity.theme}
                </p>

                <div className="saved-activity-actions">
                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(activity)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(activity.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}