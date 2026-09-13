"use client";

import { useEffect, useState } from "react";

type Word = {
  id: number;
  english: string;
  phonemes: string;
  hint: string | null;
};

type WordListWord = {
  id: number;
  wordId: number;
  wordListId: number;
  word: Word;
};

type WordList = {
  id: number;
  name: string;
  description: string | null;
  words: WordListWord[];
};

export default function WordListsPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [wordLists, setWordLists] = useState<WordList[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedWordIds, setSelectedWordIds] = useState<number[]>([]);
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
    loadWords();
    loadWordLists();
  }, []);

  function resetForm() {
    setName("");
    setDescription("");
    setSelectedWordIds([]);
    setEditingId(null);
  }

  function toggleWordSelection(wordId: number) {
    setSelectedWordIds((currentIds) => {
      if (currentIds.includes(wordId)) {
        return currentIds.filter((id) => id !== wordId);
      }

      return [...currentIds, wordId];
    });
  }

  async function handleSubmit(
    event: { preventDefault: () => void }
  ) {
    event.preventDefault();

    setMessage("");

    const payload = {
      name,
      description,
      wordIds: selectedWordIds,
    };

    try {
      const response = await fetch(
        editingId
          ? `/api/word-lists/${editingId}`
          : "/api/word-lists",
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
        setMessage(data.error || "Unable to save word list.");
        return;
      }

      setMessage(
        editingId
          ? "Word list updated successfully."
          : "Word list created successfully."
      );

      resetForm();
      await loadWordLists();
    } catch {
      setMessage("Unable to connect to the server.");
    }
  }

  function handleEdit(wordList: WordList) {
    setEditingId(wordList.id);
    setName(wordList.name);
    setDescription(wordList.description || "");

    setSelectedWordIds(
      wordList.words.map((entry) => entry.word.id)
    );

    setMessage("");
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this word list?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/word-lists/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Unable to delete word list.");
        return;
      }

      setMessage("Word list deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await loadWordLists();
    } catch {
      setMessage("Unable to connect to the server.");
    }
  }

  function displayPhonemes(phonemes: string) {
    try {
      const parsed = JSON.parse(phonemes);

      if (Array.isArray(parsed)) {
        return parsed.join(" · ");
      }
    } catch {
      // Use original value if JSON parsing fails.
    }

    return phonemes;
  }

  return (
    <main className="word-list-management-page">
      <section className="word-list-management-header">
        <h1>Word Lists</h1>

        <p>
          Create reusable groups of phoneme words for Wordle and Word Search
          activities.
        </p>
      </section>

      <section className="word-list-form-section">
        <h2>
          {editingId ? "Edit Word List" : "Create Word List"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="word-list-form"
        >
          <label>
            List Name

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Week 1 Phonemes"
              required
            />
          </label>

          <label>
            Description

            <input
              type="text"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Optional description"
            />
          </label>

          <div className="word-selection-section">
            <h3>Select Words</h3>

            {words.length === 0 ? (
              <p>
                No words are available. Add words first from the Word
                Management page.
              </p>
            ) : (
              <div className="word-selection-grid">
                {words.map((word) => (
                  <label
                    key={word.id}
                    className="word-selection-item"
                  >
                    <input
                      type="checkbox"
                      checked={selectedWordIds.includes(word.id)}
                      onChange={() =>
                        toggleWordSelection(word.id)
                      }
                    />

                    <div>
                      <strong>{word.english}</strong>

                      <span>
                        {displayPhonemes(word.phonemes)}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="word-list-form-actions">
            <button type="submit">
              {editingId
                ? "Update Word List"
                : "Create Word List"}
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
          <p className="word-list-message">
            {message}
          </p>
        )}
      </section>

      <section className="saved-word-lists-section">
        <h2>Saved Word Lists</h2>

        {wordLists.length === 0 ? (
          <p>No word lists have been created yet.</p>
        ) : (
          <div className="saved-word-lists-grid">
            {wordLists.map((wordList) => (
              <article
                key={wordList.id}
                className="saved-word-list-card"
              >
                <h3>{wordList.name}</h3>

                <p>
                  {wordList.description ||
                    "No description provided."}
                </p>

                <div className="saved-word-list-count">
                  {wordList.words.length}{" "}
                  {wordList.words.length === 1
                    ? "word"
                    : "words"}
                </div>

                <div className="saved-word-list-words">
                  {wordList.words.length === 0 ? (
                    <span>No words selected.</span>
                  ) : (
                    wordList.words.map((entry) => (
                      <span key={entry.id}>
                        {entry.word.english}
                      </span>
                    ))
                  )}
                </div>

                <div className="saved-word-list-actions">
                  <button
                    type="button"
                    onClick={() => handleEdit(wordList)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(wordList.id)
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