"use client";

import { FormEvent, useEffect, useState } from "react";

type Word = {
  id: number;
  english: string;
  phonemes: string;
  hint: string | null;
};

export default function WordsPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [english, setEnglish] = useState("");
  const [phonemes, setPhonemes] = useState("");
  const [hint, setHint] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  async function loadWords() {
    try {
      const response = await fetch("/api/words");
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Unable to load words.");
        return;
      }

      setWords(data);
    } catch {
      setMessage("Unable to connect to the server.");
    }
  }

  useEffect(() => {
    loadWords();
  }, []);

  function resetForm() {
    setEnglish("");
    setPhonemes("");
    setHint("");
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    const phonemeArray = phonemes
      .split(",")
      .map((phoneme) => phoneme.trim())
      .filter((phoneme) => phoneme.length > 0);

    const payload = {
      english,
      phonemes: phonemeArray,
      hint,
    };

    try {
      const response = await fetch(
        editingId ? `/api/words/${editingId}` : "/api/words",
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
        setMessage(data.error || "Unable to save word.");
        return;
      }

      setMessage(
        editingId
          ? "Word updated successfully."
          : "Word created successfully."
      );

      resetForm();
      await loadWords();
    } catch {
      setMessage("Unable to connect to the server.");
    }
  }

  function handleEdit(word: Word) {
    setEditingId(word.id);
    setEnglish(word.english);

    try {
      const parsedPhonemes = JSON.parse(word.phonemes);

      if (Array.isArray(parsedPhonemes)) {
        setPhonemes(parsedPhonemes.join(", "));
      } else {
        setPhonemes("");
      }
    } catch {
      setPhonemes("");
    }

    setHint(word.hint || "");
    setMessage("");
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this word?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/words/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Unable to delete word.");
        return;
      }

      setMessage("Word deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await loadWords();
    } catch {
      setMessage("Unable to connect to the server.");
    }
  }

  return (
    <main className="word-management-page">
      <section className="word-management-header">
        <h1>Word Management</h1>
        <p>
          Create and manage phoneme words for Wordle and Word Search activities.
        </p>
      </section>

      <section className="word-form-section">
        <h2>{editingId ? "Edit Word" : "Add Word"}</h2>

        <form onSubmit={handleSubmit} className="word-form">
          <label>
            English Word
            <input
              type="text"
              value={english}
              onChange={(event) => setEnglish(event.target.value)}
              placeholder="e.g. thin"
              required
            />
          </label>

          <label>
            Phonemes
            <input
              type="text"
              value={phonemes}
              onChange={(event) => setPhonemes(event.target.value)}
              placeholder="e.g. θ, ɪ, n"
              required
            />
          </label>

          <p className="form-help">
            Separate each phoneme with a comma. Multi-character phonemes such as
            tʃ and dʒ are supported.
          </p>

          <label>
            Hint
            <input
              type="text"
              value={hint}
              onChange={(event) => setHint(event.target.value)}
              placeholder="Optional hint"
            />
          </label>

          <div className="word-form-actions">
            <button type="submit">
              {editingId ? "Update Word" : "Add Word"}
            </button>

            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {message && <p className="word-message">{message}</p>}
      </section>

      <section className="word-list-section">
        <h2>Saved Words</h2>

        {words.length === 0 ? (
          <p>No words have been added yet.</p>
        ) : (
          <div className="word-table-wrapper">
            <table className="word-table">
              <thead>
                <tr>
                  <th>English</th>
                  <th>Phonemes</th>
                  <th>Hint</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {words.map((word) => {
                  let displayPhonemes = word.phonemes;

                  try {
                    const parsed = JSON.parse(word.phonemes);

                    if (Array.isArray(parsed)) {
                      displayPhonemes = parsed.join(" · ");
                    }
                  } catch {
                    // Leave original value if parsing fails.
                  }

                  return (
                    <tr key={word.id}>
                      <td>{word.english}</td>
                      <td>{displayPhonemes}</td>
                      <td>{word.hint || "—"}</td>
                      <td>
                        <div className="word-actions">
                          <button
                            type="button"
                            onClick={() => handleEdit(word)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(word.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}