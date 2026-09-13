"use client";

import {
  useEffect,
  useState,
} from "react";

import GenerateButton from "../components/GenerateButton";

import {
  phonemes,
} from "../data/phonemes";

import type {
  PhonemeWord,
} from "../data/phonemes";

import {
  generateWordSearch,
  WordSearchPuzzle,
} from "../utils/wordSearchGenerator";

import {
  generateWordSearchHTML,
} from "../utils/generateWordSearchHTML";

/*
 * Maximum number of words requested
 * for each supported grid size.
 */
const gridConfigurations = {
  6: 5,
  8: 8,
  10: 12,
  12: 15,
};

type GridSize =
  keyof typeof gridConfigurations;

type ActivityDifficulty =
  | "EASY"
  | "MEDIUM"
  | "HARD";

type FeedbackType =
  | "success"
  | "error"
  | "";

type DatabaseWord = {
  id: number;
  english: string;
  phonemes: string;
  hint?: string | null;
};

type ActivityWord = {
  word: DatabaseWord;
};

type ActivityWordList = {
  id: number;
  name: string;
  description?: string | null;
  words: ActivityWord[];
};

type WordSearchActivity = {
  id: number;
  name: string;
  type: "WORD_SEARCH";
  difficulty:
    ActivityDifficulty;
  gridSize?: number | null;
  hintsEnabled: boolean;
  theme: string;
  settings?: string | null;
  wordList: ActivityWordList;
};

type LoadedPhonemeWord =
  PhonemeWord & {
    id: number;
    hint?: string | null;
  };

function getDifficultyWordCount(
  size: GridSize,
  difficulty: ActivityDifficulty,
  availableCount: number
) {
  const maximum =
    gridConfigurations[size];

  const requested =
    difficulty === "EASY"
      ? Math.ceil(maximum * 0.6)
      : difficulty === "MEDIUM"
        ? Math.ceil(maximum * 0.8)
        : maximum;

  return Math.min(
    requested,
    availableCount
  );
}

/*
 * Selects a random subset from the
 * database words linked to the activity.
 */
function getRandomWords(
  words: LoadedPhonemeWord[],
  count: number
) {
  return [...words]
    .sort(
      () =>
        Math.random() - 0.5
    )
    .slice(
      0,
      Math.min(
        count,
        words.length
      )
    );
}

/*
 * Generates all cells between
 * a start and end cell.
 *
 * Only horizontal, vertical
 * and diagonal lines are valid.
 */
function calculateLine(
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): string[] | null {
  const rowDifference =
    endRow - startRow;

  const colDifference =
    endCol - startCol;

  const isHorizontal =
    rowDifference === 0;

  const isVertical =
    colDifference === 0;

  const isDiagonal =
    Math.abs(rowDifference) ===
    Math.abs(colDifference);

  if (
    !isHorizontal &&
    !isVertical &&
    !isDiagonal
  ) {
    return null;
  }

  const rowStep =
    Math.sign(rowDifference);

  const colStep =
    Math.sign(colDifference);

  const length =
    Math.max(
      Math.abs(rowDifference),
      Math.abs(colDifference)
    ) + 1;

  const cells: string[] = [];

  for (
    let index = 0;
    index < length;
    index++
  ) {
    const row =
      startRow +
      rowStep * index;

    const col =
      startCol +
      colStep * index;

    cells.push(
      `${row}-${col}`
    );
  }

  return cells;
}

export default function WordSearchPage() {
  const [
    activities,
    setActivities,
  ] = useState<
    WordSearchActivity[]
  >([]);

  const [
    selectedActivityId,
    setSelectedActivityId,
  ] = useState<number | null>(
    null
  );

  const [
    availableWords,
    setAvailableWords,
  ] = useState<
    LoadedPhonemeWord[]
  >([]);

  const [
    selectedWordListName,
    setSelectedWordListName,
  ] = useState("");

  const [
    difficulty,
    setDifficulty,
  ] = useState<ActivityDifficulty>(
    "EASY"
  );

  const [
    hintsEnabled,
    setHintsEnabled,
  ] = useState(true);

  const [
    activityTheme,
    setActivityTheme,
  ] = useState("light");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    loadError,
    setLoadError,
  ] = useState("");

  const [size, setSize] =
    useState<GridSize>(6);

  const [puzzle, setPuzzle] =
    useState<WordSearchPuzzle>(() =>
      generateWordSearch(
        6,
        [],
        phonemes.map(
          (phoneme) =>
            phoneme.symbol
        ),
        "EASY"
      )
    );

  const [
    selectionStart,
    setSelectionStart,
  ] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [
    selectedCells,
    setSelectedCells,
  ] = useState<string[]>([]);

  const [
    foundWords,
    setFoundWords,
  ] = useState<string[]>([]);

  const [
    foundCells,
    setFoundCells,
  ] = useState<string[]>([]);

  const [
    feedback,
    setFeedback,
  ] = useState("");

  const [
    feedbackType,
    setFeedbackType,
  ] =
    useState<FeedbackType>("");

  const wordCount =
    getDifficultyWordCount(
      size,
      difficulty,
      availableWords.length
    );

  const resetGameState = () => {
    setSelectionStart(null);
    setSelectedCells([]);
    setFoundWords([]);
    setFoundCells([]);
    setFeedback("");
    setFeedbackType("");
  };

  const buildPuzzle = (
    words: LoadedPhonemeWord[],
    newSize: GridSize,
    newDifficulty:
      ActivityDifficulty =
        difficulty
  ) => {
    const count =
      getDifficultyWordCount(
        newSize,
        newDifficulty,
        words.length
      );

    const selectedWords =
      getRandomWords(
        words,
        count
      );

    const symbols =
      Array.from(
        new Set(
          words.flatMap(
            (word) =>
              word.phonemes
          )
        )
      );

    const newPuzzle =
      generateWordSearch(
        newSize,
        selectedWords,
        symbols.length > 0
          ? symbols
          : phonemes.map(
              (phoneme) =>
                phoneme.symbol
            ),
        newDifficulty
      );

    setPuzzle(newPuzzle);
    resetGameState();
  };

  const loadActivity = async (
    activityId: number
  ) => {
    setLoading(true);
    setLoadError("");

    try {
      const response =
        await fetch(
          `/api/activities/${activityId}`
        );

      if (!response.ok) {
        throw new Error(
          "Unable to load activity."
        );
      }

      const activity =
        (await response.json()) as WordSearchActivity;

      const convertedWords:
        LoadedPhonemeWord[] =
        activity.wordList.words
          .map(
            ({ word }) => {
              try {
                const parsed =
                  JSON.parse(
                    word.phonemes
                  );

                if (
                  !Array.isArray(
                    parsed
                  ) ||
                  parsed.length === 0 ||
                  !parsed.every(
                    (item) =>
                      typeof item ===
                        "string" &&
                      item.trim().length >
                        0
                  )
                ) {
                  return null;
                }

                return {
                  id: word.id,
                  english:
                    word.english,
                  phonemes:
                    parsed,
                  hint:
                    word.hint ??
                    null,
                } as LoadedPhonemeWord;
              } catch {
                return null;
              }
            }
          )
          .filter(
            (
              word
            ): word is LoadedPhonemeWord =>
              word !== null
          );

      setSelectedActivityId(
        activity.id
      );

      setAvailableWords(
        convertedWords
      );

      setSelectedWordListName(
        activity.wordList.name
      );

      setDifficulty(
        activity.difficulty
      );

      setHintsEnabled(
        activity.hintsEnabled
      );

      setActivityTheme(
        activity.theme
      );

      const savedGridSize =
        Number(
          activity.gridSize
        );

      const nextSize =
        [6, 8, 10, 12].includes(
          savedGridSize
        )
          ? (savedGridSize as GridSize)
          : 6;

      setSize(nextSize);

      if (
        convertedWords.length ===
        0
      ) {
        setPuzzle(
          generateWordSearch(
            nextSize,
            [],
            phonemes.map(
              (phoneme) =>
                phoneme.symbol
            ),
            activity.difficulty
          )
        );

        resetGameState();

        setLoadError(
          "This activity's word list does not contain any valid words."
        );

        return;
      }

      buildPuzzle(
        convertedWords,
        nextSize,
        activity.difficulty
      );
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Unable to load activity."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadActivities =
      async () => {
        setLoading(true);
        setLoadError("");

        try {
          const response =
            await fetch(
              "/api/activities"
            );

          if (!response.ok) {
            throw new Error(
              "Unable to load activities."
            );
          }

          const data =
            (await response.json()) as WordSearchActivity[];

          const wordSearchActivities =
            data.filter(
              (activity) =>
                activity.type ===
                "WORD_SEARCH"
            );

          setActivities(
            wordSearchActivities
          );

          if (
            wordSearchActivities.length >
            0
          ) {
            await loadActivity(
              wordSearchActivities[0]
                .id
            );
          } else {
            setLoadError(
              "No WORD_SEARCH activities exist yet. Create one on the Activities page."
            );
            setLoading(false);
          }
        } catch (error) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load activities."
          );
          setLoading(false);
        }
      };

    loadActivities();
  }, []);

  /*
   * Generates a new random puzzle
   * from the selected database word list.
   */
  const createNewPuzzle = (
    newSize: GridSize = size
  ) => {
    if (
      availableWords.length ===
      0
    ) {
      setFeedback(
        "The selected activity does not have any valid database words."
      );
      setFeedbackType(
        "error"
      );
      return;
    }

    buildPuzzle(
      availableWords,
      newSize,
      difficulty
    );
  };

  const changeGridSize = (
    newSize: GridSize
  ) => {
    setSize(newSize);

    if (
      availableWords.length >
      0
    ) {
      buildPuzzle(
        availableWords,
        newSize,
        difficulty
      );
    }
  };

  /*
   * First click = start.
   * Second click = end.
   *
   * The page automatically selects
   * the cells between them.
   */
  const handleCellClick = (
    row: number,
    col: number
  ) => {
    if (!selectionStart) {
      setSelectionStart({
        row,
        col,
      });

      setSelectedCells([
        `${row}-${col}`,
      ]);

      setFeedback(
        "Start selected. Now select the final cell of the word."
      );

      setFeedbackType("");

      return;
    }

    const line =
      calculateLine(
        selectionStart.row,
        selectionStart.col,
        row,
        col
      );

    if (!line) {
      setFeedback(
        "Words must be selected in a straight horizontal, vertical or diagonal line."
      );

      setFeedbackType(
        "error"
      );

      setSelectionStart(null);
      setSelectedCells([]);

      return;
    }

    setSelectedCells(line);

    setFeedback(
      "Selection ready. Press Check Selection."
    );

    setFeedbackType("");
  };

  /*
   * Checks whether the selected line
   * matches one of the placed words.
   *
   * Reverse selections are also valid.
   */
  const checkSelection = () => {
    if (
      selectedCells.length < 2
    ) {
      setFeedback(
        "Select the start and end of a word first."
      );

      setFeedbackType(
        "error"
      );

      return;
    }

    const matchingWord =
      puzzle.placements.find(
        (placement) => {
          if (
            placement.cells.length !==
            selectedCells.length
          ) {
            return false;
          }

          const forward =
            placement.cells.every(
              (
                cell,
                index
              ) =>
                cell ===
                selectedCells[
                  index
                ]
            );

          const reversedCells =
            [...placement.cells]
              .reverse();

          const reverse =
            reversedCells.every(
              (
                cell,
                index
              ) =>
                cell ===
                selectedCells[
                  index
                ]
            );

          return (
            forward ||
            reverse
          );
        }
      );

    if (!matchingWord) {
      setFeedback(
        "Incorrect selection. That sequence is not one of the hidden words."
      );

      setFeedbackType(
        "error"
      );

      setSelectionStart(null);
      setSelectedCells([]);

      return;
    }

    const word =
      matchingWord.word;

    if (
      foundWords.includes(
        word.english
      )
    ) {
      setFeedback(
        `${word.english.toUpperCase()} has already been found.`
      );

      setFeedbackType(
        "error"
      );

      setSelectionStart(null);
      setSelectedCells([]);

      return;
    }

    const updatedFoundWords = [
      ...foundWords,
      word.english,
    ];

    const updatedFoundCells = [
      ...foundCells,
      ...matchingWord.cells,
    ];

    setFoundWords(
      updatedFoundWords
    );

    setFoundCells(
      Array.from(
        new Set(
          updatedFoundCells
        )
      )
    );

    setSelectionStart(null);
    setSelectedCells([]);

    if (
      updatedFoundWords.length ===
      puzzle.words.length
    ) {
      setFeedback(
        `Congratulations! You found all ${puzzle.words.length} words.`
      );

      setFeedbackType(
        "success"
      );

      return;
    }

    setFeedback(
      `Correct! You found ${word.english.toUpperCase()}.`
    );

    setFeedbackType(
      "success"
    );
  };

  const clearSelection = () => {
    setSelectionStart(null);
    setSelectedCells([]);

    setFeedback("");
    setFeedbackType("");
  };

  /*
   * Returns the phoneme's hover
   * information.
   */
  const getPhonemeHint = (
    symbol: string
  ) => {
    const phoneme =
      phonemes.find(
        (item) =>
          item.symbol ===
          symbol
      );

    return phoneme
      ? `${symbol} — ${phoneme.example}`
      : symbol;
  };

  return (
    <section className="page">

      {/* PAGE HEADER */}

      <div className="builder-header">

        <div>
          <span className="badge">
            WORD SEARCH BUILDER
          </span>

          <h2>
            Phoneme Word Search
          </h2>

          <p>
            Configure and preview a
            database-driven phoneme Word
            Search classroom activity.
          </p>
        </div>

        <GenerateButton
          onClick={() =>
            generateWordSearchHTML({
              puzzle,
              size,
              theme: activityTheme,
              difficulty,
            })
          }
        >
          Generate HTML
        </GenerateButton>

      </div>

      {/* BUILDER SETTINGS */}

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
              selectedActivityId ??
              ""
            }
            onChange={(event) =>
              loadActivity(
                Number(
                  event.target.value
                )
              )
            }
            disabled={
              loading ||
              activities.length ===
                0
            }
          >
            {activities.map(
              (activity) => (
                <option
                  key={activity.id}
                  value={
                    activity.id
                  }
                >
                  {activity.name}
                </option>
              )
            )}
          </select>
        </div>

        <div className="setting-group">
          <label
            htmlFor="grid-size"
          >
            Grid Size
          </label>

          <select
            id="grid-size"
            value={size}
            onChange={(
              event
            ) =>
              changeGridSize(
                Number(
                  event.target
                    .value
                ) as GridSize
              )
            }
            disabled={
              availableWords.length ===
              0
            }
          >
            <option value={6}>
              6 × 6 — up to 5 words
            </option>

            <option value={8}>
              8 × 8 — up to 8 words
            </option>

            <option value={10}>
              10 × 10 — up to 12 words
            </option>

            <option value={12}>
              12 × 12 — up to 15 words
            </option>
          </select>
        </div>

        <div className="setting-summary">
          <strong>
            {wordCount}
          </strong>

          <span>
            words at {difficulty.toLowerCase()} difficulty
          </span>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            createNewPuzzle()
          }
          disabled={
            availableWords.length ===
            0
          }
        >
          ↻ Generate New Puzzle
        </button>

      </div>

      {loadError && (
        <div
          className="search-feedback error"
          role="alert"
        >
          {loadError}
        </div>
      )}

      {!loadError &&
        selectedActivityId && (
          <div
            className="builder-panel"
            style={{
              marginTop: "1.5rem",
            }}
          >
            <div
              className="preview-header"
              style={{
                marginBottom: "1rem",
              }}
            >
              <div>
                <h3>
                  Activity Details
                </h3>

                <p>
                  Settings loaded from the
                  selected database activity.
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "1rem",
              }}
            >
              <div
                className="setting-summary"
                style={{
                  alignItems: "flex-start",
                }}
              >
                <span>
                  Word List
                </span>

                <strong
                  style={{
                    fontSize: "1rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {selectedWordListName}
                </strong>
              </div>

              <div
                className="setting-summary"
                style={{
                  alignItems: "flex-start",
                }}
              >
                <span>
                  Stored Words
                </span>

                <strong
                  style={{
                    fontSize: "1rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {availableWords.length}
                </strong>
              </div>

              <div
                className="setting-summary"
                style={{
                  alignItems: "flex-start",
                }}
              >
                <span>
                  Difficulty
                </span>

                <strong
                  style={{
                    fontSize: "1rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {difficulty}
                </strong>
              </div>

              <div
                className="setting-summary"
                style={{
                  alignItems: "flex-start",
                }}
              >
                <span>
                  Hints
                </span>

                <strong
                  style={{
                    fontSize: "1rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {hintsEnabled
                    ? "Enabled"
                    : "Disabled"}
                </strong>
              </div>

              <div
                className="setting-summary"
                style={{
                  alignItems: "flex-start",
                }}
              >
                <span>
                  Theme
                </span>

                <strong
                  style={{
                    fontSize: "1rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {activityTheme}
                </strong>
              </div>
            </div>
          </div>
        )}

      <div
        className="word-search-instructions"
        style={{
          marginTop: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <strong>
          Difficulty behaviour:
        </strong>{" "}
        {difficulty === "EASY"
          ? "Fewer words using horizontal and vertical placement only."
          : difficulty === "MEDIUM"
            ? "More words with horizontal, vertical and diagonal placement."
            : "Maximum word count with all eight placement directions, including reversed directions."}
      </div>

      {/* MAIN PAGE LAYOUT */}

      <div className="word-search-layout">

        {/* LEFT SIDE */}

        <div className="builder-panel">

          <div className="preview-header">

            <div>
              <h3>
                Word List
              </h3>

              <p>
                Find each phoneme-based
                word in the grid.
              </p>
            </div>

            <span>
              {foundWords.length}
              {" / "}
              {puzzle.words.length}
            </span>

          </div>

          <div className="word-list">

            {puzzle.words.map(
              (word) => {
                const found =
                  foundWords.includes(
                    word.english
                  );

                return (
                  <div
                    key={
                      word.english
                    }
                    className={
                      `word-list-item ${
                        found
                          ? "found"
                          : ""
                      }`
                    }
                  >
                    <div>
                      <strong>
                        {word.english
                          .toUpperCase()}
                      </strong>

                      <div className="word-phonemes">
                        /
                        {word.phonemes.join(
                          " "
                        )}
                        /
                      </div>
                    </div>

                    {found && (
                      <span
                        className="found-check"
                        aria-label="Word found"
                      >
                        ✓
                      </span>
                    )}
                  </div>
                );
              }
            )}

          </div>

          <div className="word-search-instructions">

            <h4>
              How to Play
            </h4>

            <p>
              1. Select the first
              phoneme of a word.
            </p>

            <p>
              2. Select the final
              phoneme of the word.
            </p>

            <p>
              3. Press Check Selection.
            </p>

            <p>
              Words may run horizontally,
              vertically or diagonally.
            </p>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="preview-panel">

          <div className="preview-header">

            <div>
              <h3>
                Word Search Preview
              </h3>

              <p>
                Select the start and end
                cells of a hidden word.
              </p>
            </div>

            <span>
              {size} × {size}
            </span>

          </div>

          <div
            className="word-search-grid"
            style={{
              gridTemplateColumns:
                `repeat(${size}, minmax(0, 1fr))`,
            }}
          >

            {puzzle.grid.map(
              (
                row,
                rowIndex
              ) =>
                row.map(
                  (
                    symbol,
                    colIndex
                  ) => {
                    const cellKey =
                      `${rowIndex}-${colIndex}`;

                    const selected =
                      selectedCells.includes(
                        cellKey
                      );

                    const found =
                      foundCells.includes(
                        cellKey
                      );

                    return (
                      <button
                        type="button"
                        key={
                          cellKey
                        }
                        className={
                          `search-cell ${
                            selected
                              ? "selected"
                              : ""
                          } ${
                            found
                              ? "found"
                              : ""
                          }`
                        }
                        onClick={() =>
                          handleCellClick(
                            rowIndex,
                            colIndex
                          )
                        }
                        title={
                          getPhonemeHint(
                            symbol
                          )
                        }
                        aria-label={
                          getPhonemeHint(
                            symbol
                          )
                        }
                      >
                        /{symbol}/
                      </button>
                    );
                  }
                )
            )}

          </div>

          {/* FEEDBACK */}

          {feedback && (
            <div
              className={
                `search-feedback ${
                  feedbackType
                }`
              }
              role="status"
              aria-live="polite"
            >
              {feedback}
            </div>
          )}

          {/* CONTROLS */}

          <div className="search-controls">

            <button
              type="button"
              className="secondary-button"
              onClick={
                clearSelection
              }
              disabled={
                selectedCells.length ===
                0
              }
            >
              Clear Selection
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={
                checkSelection
              }
              disabled={
                selectedCells.length <
                2
              }
            >
              Check Selection
            </button>

          </div>

          {/* PROGRESS */}

          <div className="word-search-progress">

            <div className="progress-text">
              <span>
                Progress
              </span>

              <strong>
                {foundWords.length}
                {" / "}
                {puzzle.words.length}
                {" words"}
              </strong>
            </div>

            <div
              className="progress-bar"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={
                puzzle.words.length
              }
              aria-valuenow={
                foundWords.length
              }
            >
              <div
                className="progress-fill"
                style={{
                  width:
                    puzzle.words.length > 0
                      ? `${(foundWords.length / puzzle.words.length) * 100}%`
                      : "0%",
                }}
              />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
