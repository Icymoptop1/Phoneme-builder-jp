"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import PhonemeButton from "../components/PhonemeButton";
import GenerateButton from "../components/GenerateButton";

import {
  phonemes,
  PhonemeWord,
} from "../data/phonemes";

import {
  generateWordleHTML,
} from "../utils/generateWordleHTML";

// =========================================================
// TYPES
// =========================================================

type Feedback =
  | "correct"
  | "present"
  | "absent"
  | "";

type DatabaseWord = {
  id: number;
  english: string;
  phonemes: string;
  hint: string | null;
};

type ActivityWord = {
  id: number;
  wordId: number;
  wordListId: number;
  word: DatabaseWord;
};

type ActivityWordList = {
  id: number;
  name: string;
  description: string | null;
  words: ActivityWord[];
};

type WordleActivity = {
  id: number;
  name: string;
  type: "WORDLE" | "WORD_SEARCH";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  maxAttempts: number | null;
  gridSize: number | null;
  hintsEnabled: boolean;
  theme: string;
  wordListId: number;
  wordList?: ActivityWordList;
};

type LoadedPhonemeWord = PhonemeWord & {
  id: number;
  hint: string | null;
};

export type WordleKeyboardKey = {
  symbol: string;
  label: string;
  example: string;
};

// =========================================================
// HELPERS
// =========================================================

function buildKeyboard(
  words: LoadedPhonemeWord[],
  target: LoadedPhonemeWord | null,
  difficulty:
    | "EASY"
    | "MEDIUM"
    | "HARD"
): WordleKeyboardKey[] {
  const allSymbols = Array.from(
    new Set(
      words.flatMap(
        (word) => word.phonemes
      )
    )
  );

  if (!target) {
    return [];
  }

  const targetSymbols =
    Array.from(
      new Set(
        target.phonemes
      )
    );

  const distractors =
    allSymbols.filter(
      (symbol) =>
        !targetSymbols.includes(
          symbol
        )
    );

  let selectedSymbols:
    string[];

  if (
    difficulty === "EASY"
  ) {
    selectedSymbols = [
      ...targetSymbols,
      ...distractors.slice(
        0,
        3
      ),
    ];
  } else if (
    difficulty === "MEDIUM"
  ) {
    selectedSymbols = [
      ...targetSymbols,
      ...distractors.slice(
        0,
        7
      ),
    ];
  } else {
    selectedSymbols =
      allSymbols;
  }

  return selectedSymbols.map(
    (symbol) => {
      const known =
        phonemes.find(
          (phoneme) =>
            phoneme.symbol === symbol
        );

      if (known) {
        return {
          symbol:
            known.symbol,
          label:
            known.label,
          example:
            known.example,
        };
      }

      return {
        symbol,
        label:
          symbol,
        example:
          `Phoneme ${symbol}`,
      };
    }
  );
}

// =========================================================
// PAGE
// =========================================================

export default function WordlePage() {
  // =======================================================
  // BACKEND / ACTIVITY STATE
  // =======================================================

  const [
    activities,
    setActivities,
  ] = useState<WordleActivity[]>([]);

  const [
    selectedActivityId,
    setSelectedActivityId,
  ] = useState("");

  const [
    availableWords,
    setAvailableWords,
  ] = useState<LoadedPhonemeWord[]>([]);

  const [
    target,
    setTarget,
  ] = useState<LoadedPhonemeWord | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    loadError,
    setLoadError,
  ] = useState("");

  const [
    hintsEnabled,
    setHintsEnabled,
  ] = useState(true);

  const [
    activityTheme,
    setActivityTheme,
  ] = useState("light");

  const [
    difficulty,
    setDifficulty,
  ] = useState<
    "EASY" | "MEDIUM" | "HARD"
  >("EASY");

  const [
    selectedWordListName,
    setSelectedWordListName,
  ] = useState("");

  // =======================================================
  // WORDLE GAME STATE
  // =======================================================

  const [
    attempts,
    setAttempts,
  ] = useState(6);

  const [
    guess,
    setGuess,
  ] = useState<string[]>([]);

  const [
    guesses,
    setGuesses,
  ] = useState<string[][]>([]);

  const [
    feedbackRows,
    setFeedbackRows,
  ] = useState<Feedback[][]>([]);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    gameComplete,
    setGameComplete,
  ] = useState(false);

  const [
    gameWon,
    setGameWon,
  ] = useState(false);

  // =======================================================
  // DATABASE-DRIVEN PHONEME KEYBOARD
  // =======================================================

  const keyboardPhonemes =
    useMemo(
      () =>
        buildKeyboard(
          availableWords,
          target,
          difficulty
        ),
      [
        availableWords,
        target,
        difficulty,
      ]
    );

  // =======================================================
  // INITIAL DATABASE LOAD
  // =======================================================

  useEffect(() => {
    loadWordleActivities();
  }, []);

  // =======================================================
  // LOAD SAVED WORDLE ACTIVITIES
  // =======================================================

  async function loadWordleActivities() {
    try {
      setLoading(true);
      setLoadError("");

      const response =
        await fetch("/api/activities");

      const data = await response.json();

      if (!response.ok) {
        setLoadError(
          data.error ||
            "Unable to load Wordle activities."
        );

        return;
      }

      const wordleActivities:
        WordleActivity[] =
        data.filter(
          (activity: WordleActivity) =>
            activity.type === "WORDLE"
        );

      setActivities(
        wordleActivities
      );

      if (
        wordleActivities.length === 0
      ) {
        setLoadError(
          "No saved Wordle activities are available."
        );

        return;
      }

      await loadActivity(
        wordleActivities[0].id
      );
    } catch {
      setLoadError(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }

  // =======================================================
  // LOAD ONE ACTIVITY + ITS WORD LIST
  // =======================================================

  async function loadActivity(
    activityId: number
  ) {
    try {
      setLoadError("");

      const response =
        await fetch(
          `/api/activities/${activityId}`
        );

      const data: WordleActivity =
        await response.json();

      if (!response.ok) {
        setLoadError(
          "Unable to load the selected activity."
        );

        return;
      }

      if (data.type !== "WORDLE") {
        setLoadError(
          "The selected activity is not a Wordle activity."
        );

        return;
      }

      const databaseWords =
        data.wordList?.words ?? [];

      const convertedWords:
        LoadedPhonemeWord[] = [];

      databaseWords.forEach(
        (entry) => {
          try {
            const parsedPhonemes =
              JSON.parse(
                entry.word.phonemes
              );

            if (
              !Array.isArray(
                parsedPhonemes
              ) ||
              parsedPhonemes.length ===
                0
            ) {
              return;
            }

            const valid =
              parsedPhonemes.every(
                (phoneme) =>
                  typeof phoneme ===
                    "string" &&
                  phoneme.trim().length >
                    0
              );

            if (!valid) {
              return;
            }

            convertedWords.push({
              id: entry.word.id,
              english:
                entry.word.english,
              phonemes:
                parsedPhonemes.map(
                  (phoneme) =>
                    phoneme.trim()
                ),
              hint:
                entry.word.hint,
            });
          } catch {
            // Skip malformed phoneme data.
          }
        }
      );

      if (
        convertedWords.length === 0
      ) {
        setAvailableWords([]);
        setTarget(null);

        setLoadError(
          "This activity's word list does not contain any valid phoneme words."
        );

        return;
      }

      setSelectedActivityId(
        String(data.id)
      );

      setAvailableWords(
        convertedWords
      );

      setTarget(
        convertedWords[0]
      );

      setAttempts(
        data.maxAttempts ?? 6
      );

      setHintsEnabled(
        data.hintsEnabled
      );

      setActivityTheme(
        data.theme
      );

      setDifficulty(
        data.difficulty
      );

      setSelectedWordListName(
        data.wordList?.name ?? ""
      );

      resetGame();
    } catch {
      setLoadError(
        "Unable to connect to the server."
      );
    }
  }

  // =======================================================
  // ADD PHONEME
  // =======================================================

  const addPhoneme = (
    symbol: string
  ) => {
    if (!target) return;

    if (gameComplete) return;

    if (
      guess.length >=
      target.phonemes.length
    ) {
      return;
    }

    setGuess([
      ...guess,
      symbol,
    ]);

    setMessage("");
  };

  // =======================================================
  // REMOVE PHONEME
  // =======================================================

  const removePhoneme = () => {
    if (gameComplete) return;

    setGuess(
      guess.slice(0, -1)
    );

    setMessage("");
  };

  // =======================================================
  // CLEAR GUESS
  // =======================================================

  const clearGuess = () => {
    if (gameComplete) return;

    setGuess([]);
    setMessage("");
  };

  // =======================================================
  // EVALUATE GUESS
  // =======================================================

  const evaluateGuess = (
    submitted: string[]
  ): Feedback[] => {
    if (!target) {
      return [];
    }

    const result:
      Feedback[] =
      new Array(
        target.phonemes.length
      ).fill("absent");

    const remaining = [
      ...target.phonemes,
    ];

    submitted.forEach(
      (phoneme, index) => {
        if (
          phoneme ===
          target.phonemes[index]
        ) {
          result[index] =
            "correct";

          remaining[index] = "";
        }
      }
    );

    submitted.forEach(
      (phoneme, index) => {
        if (
          result[index] ===
          "correct"
        ) {
          return;
        }

        const found =
          remaining.indexOf(
            phoneme
          );

        if (found !== -1) {
          result[index] =
            "present";

          remaining[found] = "";
        }
      }
    );

    return result;
  };

  // =======================================================
  // SUBMIT GUESS
  // =======================================================

  const submitGuess = () => {
    if (!target) return;

    if (gameComplete) return;

    if (
      guess.length !==
      target.phonemes.length
    ) {
      setMessage(
        `Select ${target.phonemes.length} phonemes before submitting.`
      );

      return;
    }

    const result =
      evaluateGuess(guess);

    const updatedGuesses = [
      ...guesses,
      guess,
    ];

    const updatedFeedback = [
      ...feedbackRows,
      result,
    ];

    setGuesses(
      updatedGuesses
    );

    setFeedbackRows(
      updatedFeedback
    );

    const correct =
      result.every(
        (value) =>
          value === "correct"
      );

    if (correct) {
      setGameWon(true);
      setGameComplete(true);

      setMessage(
        `Congratulations! You found ${target.english}.`
      );
    } else if (
      updatedGuesses.length >=
      attempts
    ) {
      setGameComplete(true);
      setGameWon(false);

      setMessage(
        `Game over. The answer was ${target.english}.`
      );
    } else {
      setGuess([]);

      setMessage(
        `Attempt ${updatedGuesses.length + 1} of ${attempts}`
      );
    }
  };

  // =======================================================
  // RESET GAME
  // =======================================================

  const resetGame = () => {
    setGuess([]);
    setGuesses([]);
    setFeedbackRows([]);
    setMessage("");
    setGameComplete(false);
    setGameWon(false);
  };

  // =======================================================
  // CHANGE TARGET WORD
  // =======================================================

  const changeTarget = (
    word: LoadedPhonemeWord
  ) => {
    setTarget(word);
    resetGame();
  };

  // =======================================================
  // LOADING SCREEN
  // =======================================================

  if (loading) {
    return (
      <section className="page">
        <div className="builder-panel">
          <h2>
            Phoneme Wordle
          </h2>

          <p>
            Loading saved Wordle
            activities...
          </p>
        </div>
      </section>
    );
  }

  // =======================================================
  // ERROR / NO ACTIVITY SCREEN
  // =======================================================

  if (
    loadError ||
    !target
  ) {
    return (
      <section className="page">
        <div className="builder-panel">
          <h2>
            Phoneme Wordle
          </h2>

          <p>
            {loadError ||
              "No Wordle activity is available."}
          </p>

          <p>
            Create a Wordle activity
            from the Saved Activities
            page and assign it a word
            list containing valid
            phoneme words.
          </p>
        </div>
      </section>
    );
  }

  // =======================================================
  // MAIN PAGE
  // =======================================================

  return (
    <section className="page">

      <div className="builder-header">

        <div>
          <span className="badge">
            WORDLE BUILDER
          </span>

          <h2>
            Phoneme Wordle
          </h2>

          <p>
            Configure the teacher activity
            before generating the student
            classroom HTML.
          </p>
        </div>

        <GenerateButton
          onClick={() =>
            generateWordleHTML({
              target,
              maxAttempts:
                attempts,
              hintsEnabled,
              theme:
                activityTheme,
              keyboardPhonemes,
            })
          }
        >
          Generate HTML
        </GenerateButton>

      </div>

      <div className="builder-panel">

        <h3>
          Saved Activity
        </h3>

        <p>
          <strong>
            Word List:
          </strong>{" "}
          {selectedWordListName}
        </p>

        <p>
          <strong>
            Words available:
          </strong>{" "}
          {availableWords.length}
        </p>

        <p>
          <strong>
            Keyboard keys:
          </strong>{" "}
          {keyboardPhonemes.length}
        </p>

        <p>
          <strong>
            Difficulty:
          </strong>{" "}
          {difficulty}
        </p>

        <p>
          <strong>
            Hints:
          </strong>{" "}
          {hintsEnabled
            ? "Enabled"
            : "Disabled"}
        </p>

        <p>
          <strong>
            Saved Theme:
          </strong>{" "}
          {activityTheme}
        </p>

      </div>

      <div className="builder-settings">

        <div className="setting-group">
          <label
            htmlFor="activity-select"
          >
            Saved Activity
          </label>

          <select
            id="activity-select"
            value={
              selectedActivityId
            }
            onChange={(
              event
            ) => {
              const activityId =
                Number(
                  event.target.value
                );

              if (activityId) {
                loadActivity(
                  activityId
                );
              }
            }}
          >
            {activities.map(
              (activity) => (
                <option
                  key={
                    activity.id
                  }
                  value={
                    activity.id
                  }
                >
                  {
                    activity.name
                  }
                </option>
              )
            )}
          </select>
        </div>

        <div className="setting-group">
          <label
            htmlFor="word-select"
          >
            Target Word
          </label>

          <select
            id="word-select"
            value={target.id}
            onChange={(
              event
            ) => {
              const selectedId =
                Number(
                  event.target.value
                );

              const selected =
                availableWords.find(
                  (word) =>
                    word.id ===
                    selectedId
                );

              if (selected) {
                changeTarget(
                  selected
                );
              }
            }}
          >
            {availableWords.map(
              (word) => (
                <option
                  key={word.id}
                  value={word.id}
                >
                  {
                    word.english
                  }{" "}
                  —{" "}
                  {
                    word.phonemes.join(
                      " "
                    )
                  }
                </option>
              )
            )}
          </select>
        </div>

        <div className="setting-group">
          <label
            htmlFor="attempts"
          >
            Maximum Attempts
          </label>

          <select
            id="attempts"
            value={attempts}
            onChange={(
              event
            ) => {
              setAttempts(
                Number(
                  event.target.value
                )
              );

              resetGame();
            }}
          >
            {[
              3,
              4,
              5,
              6,
              7,
              8,
            ].map(
              (number) => (
                <option
                  key={number}
                  value={number}
                >
                  {number} attempts
                </option>
              )
            )}
          </select>
        </div>

      </div>

      <div className="wordle-layout">

        <div className="builder-panel">

          <h3>
            Phoneme Keyboard
          </h3>

          <p className="instruction">
            The keyboard is generated from
            the selected database word list
            and adjusted by difficulty.
            EASY uses the target phonemes plus
            up to 3 distractors, MEDIUM adds
            up to 7 distractors, and HARD uses
            every unique phoneme in the list.
          </p>

          <div className="phoneme-grid">

            {keyboardPhonemes.map(
              (phoneme) => (

                <PhonemeButton
                  key={
                    phoneme.symbol
                  }
                  symbol={
                    phoneme.symbol
                  }
                  label={
                    phoneme.label
                  }
                  example={
                    phoneme.example
                  }
                  selected={
                    guess.includes(
                      phoneme.symbol
                    )
                  }
                  onClick={() =>
                    addPhoneme(
                      phoneme.symbol
                    )
                  }
                />

              )
            )}

          </div>

        </div>

        <div className="preview-panel">

          <div className="preview-header">

            <div>
              <h3>
                Wordle Preview
              </h3>

              <p>
                {guesses.length} /{" "}
                {attempts} attempts
              </p>
            </div>

            <span>
              {
                target.phonemes
                  .length
              }{" "}
              PHONEMES
            </span>

          </div>

          {hintsEnabled &&
            target.hint && (

              <div className="instruction">
                <strong>
                  Hint:
                </strong>{" "}
                {target.hint}
              </div>

            )}

          <div className="wordle-grid">

            {Array.from({
              length:
                attempts,
            }).map(
              (_, rowIndex) => {

                const submitted =
                  guesses[
                    rowIndex
                  ];

                const feedback =
                  feedbackRows[
                    rowIndex
                  ];

                return (
                  <div
                    className="guess-row"
                    key={
                      rowIndex
                    }
                  >

                    {target.phonemes.map(
                      (
                        _,
                        index
                      ) => {

                        const isCurrent =
                          rowIndex ===
                          guesses.length;

                        const value =
                          submitted?.[
                            index
                          ] ??
                          (
                            isCurrent
                              ? guess[
                                  index
                                ]
                              : ""
                          );

                        const status =
                          feedback?.[
                            index
                          ] ?? "";

                        return (
                          <div
                            key={
                              index
                            }
                            className={
                              `guess-cell ${status}`
                            }
                          >
                            {value}
                          </div>
                        );
                      }
                    )}

                  </div>
                );
              }
            )}

          </div>

          {message && (
            <div
              className={
                `game-message ${
                  gameWon
                    ? "success"
                    : gameComplete
                    ? "failure"
                    : ""
                }`
              }
            >
              {message}
            </div>
          )}

          {gameWon && (
            <div className="congratulations">

              <div className="congratulations-icon">
                ✓
              </div>

              <h3>
                Congratulations!
              </h3>

              <p>
                You correctly identified:
              </p>

              <strong>
                {target.english}
              </strong>

              <span>
                /
                {
                  target.phonemes.join(
                    " "
                  )
                }
                /
              </span>

            </div>
          )}

          {gameComplete &&
            !gameWon && (
              <div className="game-over">

                <strong>
                  The correct answer was:
                </strong>

                <span>
                  {target.english}
                </span>

                <span>
                  /
                  {
                    target.phonemes.join(
                      " "
                    )
                  }
                  /
                </span>

              </div>
            )}

          <div className="game-controls">

            <button
              type="button"
              className="secondary-button"
              onClick={
                removePhoneme
              }
              disabled={
                guess.length === 0 ||
                gameComplete
              }
            >
              ← Remove
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={
                clearGuess
              }
              disabled={
                guess.length === 0 ||
                gameComplete
              }
            >
              Clear
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={
                submitGuess
              }
              disabled={
                guess.length !==
                  target.phonemes
                    .length ||
                gameComplete
              }
            >
              Submit Guess
            </button>

            {gameComplete && (
              <button
                type="button"
                className="secondary-button"
                onClick={
                  resetGame
                }
              >
                New Game
              </button>
            )}

          </div>

          <div className="feedback-legend">

            <span>
              <i className="legend-correct" />
              Correct position
            </span>

            <span>
              <i className="legend-present" />
              Correct phoneme, wrong position
            </span>

            <span>
              <i className="legend-absent" />
              Incorrect phoneme
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}
