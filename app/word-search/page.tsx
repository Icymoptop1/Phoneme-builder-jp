"use client";

import { useState } from "react";

import GenerateButton from "../components/GenerateButton";

import {
  allWords,
  phonemes,
} from "../data/phonemes";

import {
  generateWordSearch,
  WordSearchPuzzle,
} from "../utils/wordSearchGenerator";

import {
  generateWordSearchHTML,
} from "../utils/generateWordSearchHTML";

/*
 * Determines how many words are used
 * for each grid size.
 */
const gridConfigurations = {
  6: 5,
  8: 8,
  10: 12,
  12: 15,
};

type GridSize =
  keyof typeof gridConfigurations;

type FeedbackType =
  | "success"
  | "error"
  | "";

/*
 * Creates a random word list.
 */
function getRandomWords(
  count: number
) {
  return [...allWords]
    .sort(
      () =>
        Math.random() - 0.5
    )
    .slice(0, count);
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
  const [size, setSize] =
    useState<GridSize>(6);

  /*
   * Start with a deterministic puzzle.
   * Random puzzles are generated from
   * button presses after the page loads.
   */
  const [puzzle, setPuzzle] =
    useState<WordSearchPuzzle>(() =>
      generateWordSearch(
        6,
        allWords.slice(
          0,
          gridConfigurations[6]
        ),
        phonemes.map(
          (phoneme) =>
            phoneme.symbol
        )
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
    gridConfigurations[size];

  /*
   * Generates a new random puzzle.
   */
  const createNewPuzzle = (
    newSize: GridSize = size
  ) => {
    const count =
      gridConfigurations[
        newSize
      ];

    const selectedWords =
      getRandomWords(count);

    const newPuzzle =
      generateWordSearch(
        newSize,
        selectedWords,
        phonemes.map(
          (phoneme) =>
            phoneme.symbol
        )
      );

    setPuzzle(newPuzzle);

    setSelectionStart(null);
    setSelectedCells([]);
    setFoundWords([]);
    setFoundCells([]);

    setFeedback("");
    setFeedbackType("");
  };

  /*
   * Changes grid size and creates
   * a completely new puzzle.
   */
  const changeGridSize = (
    newSize: GridSize
  ) => {
    setSize(newSize);

    createNewPuzzle(
      newSize
    );
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
            phoneme-based Word Search
            classroom activity.
          </p>
        </div>

        <GenerateButton
          onClick={() =>
            generateWordSearchHTML({
              puzzle,
              size,
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
          >
            <option value={6}>
              6 × 6 — 5 words
            </option>

            <option value={8}>
              8 × 8 — 8 words
            </option>

            <option value={10}>
              10 × 10 — 12 words
            </option>

            <option value={12}>
              12 × 12 — 15 words
            </option>
          </select>

        </div>

        <div className="setting-summary">
          <strong>
            {wordCount}
          </strong>

          <span>
            hidden words
          </span>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            createNewPuzzle()
          }
        >
          ↻ Generate New Puzzle
        </button>

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