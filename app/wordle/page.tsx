"use client";

import { useState } from "react";

import PhonemeButton from "../components/PhonemeButton";
import GenerateButton from "../components/GenerateButton";

import {
  phonemes,
  allWords,
  PhonemeWord,
} from "../data/phonemes";

import {
  generateWordleHTML,
} from "../utils/generateWordleHTML";

type Feedback =
  | "correct"
  | "present"
  | "absent"
  | "";

export default function WordlePage() {

  const [
    target,
    setTarget,
  ] = useState<PhonemeWord>(
    allWords.find(
      (word) => word.english === "thin"
    ) ?? allWords[0]
  );

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


  const addPhoneme = (
    symbol: string
  ) => {

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


  const removePhoneme = () => {
    setGuess(
      guess.slice(0, -1)
    );
  };


  const clearGuess = () => {
    setGuess([]);
    setMessage("");
  };


  const evaluateGuess = (
    submitted: string[]
  ): Feedback[] => {

    const result: Feedback[] =
      new Array(
        target.phonemes.length
      ).fill("absent");

    const remaining =
      [...target.phonemes];

    // Green first
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

    // Yellow second
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


  const submitGuess = () => {

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

    setGuesses(updatedGuesses);
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
        `Attempt ${updatedGuesses.length} of ${attempts}`
      );
    }
  };


  const resetGame = () => {

    setGuess([]);
    setGuesses([]);
    setFeedbackRows([]);

    setMessage("");

    setGameComplete(false);
    setGameWon(false);
  };


  const changeTarget = (
    word: PhonemeWord
  ) => {

    setTarget(word);

    setGuess([]);
    setGuesses([]);
    setFeedbackRows([]);

    setMessage("");

    setGameComplete(false);
    setGameWon(false);
  };


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
            Configure the phoneme-based
            Wordle activity before generating
            the classroom HTML.
          </p>

        </div>

        <GenerateButton
          onClick={() =>
            generateWordleHTML({
              target,
              maxAttempts: attempts,
            })
          }
        >
          Generate HTML
        </GenerateButton>

      </div>


      {/* GAME SETTINGS */}

      <div className="builder-settings">

        <div className="setting-group">

          <label htmlFor="word-select">
            Target Word
          </label>

          <select
            id="word-select"
            value={target.english}
            onChange={(event) => {

              const selected =
                allWords.find(
                  (word) =>
                    word.english ===
                    event.target.value
                );

              if (selected) {
                changeTarget(selected);
              }
            }}
          >

            {allWords.map(
              (word) => (
                <option
                  key={word.english}
                  value={word.english}
                >
                  {word.english} —{" "}
                  {word.phonemes.join(
                    " "
                  )}
                </option>
              )
            )}

          </select>

        </div>


        <div className="setting-group">

          <label htmlFor="attempts">
            Maximum Attempts
          </label>

          <select
            id="attempts"
            value={attempts}
            onChange={(event) =>
              setAttempts(
                Number(event.target.value)
              )
            }
          >

            {[3, 4, 5, 6, 7, 8].map(
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


        {/* KEYBOARD */}

        <div className="builder-panel">

          <h3>
            Phoneme Keyboard
          </h3>

          <p className="instruction">
            Hover over a phoneme to see its
            English equivalence.
          </p>

          <div className="phoneme-grid">

            {phonemes.map(
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


        {/* GAME */}

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
              {target.phonemes.length}
              {" "}PHONEMES
            </span>

          </div>


          <div className="wordle-grid">

            {Array.from({
              length: attempts,
            }).map(
              (_, rowIndex) => {

                const submitted =
                  guesses[rowIndex];

                const feedback =
                  feedbackRows[
                    rowIndex
                  ];

                return (
                  <div
                    className="guess-row"
                    key={rowIndex}
                  >

                    {target.phonemes.map(
                      (_, index) => {

                        const isCurrent =
                          rowIndex ===
                          guesses.length;

                        const value =
                          submitted?.[
                            index
                          ] ??
                          (
                            isCurrent
                              ? guess[index]
                              : ""
                          );

                        const status =
                          feedback?.[
                            index
                          ] ?? "";

                        return (

                          <div
                            key={index}
                            className={
                              `guess-cell ${
                                status
                              }`
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


          {/* FEEDBACK */}

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
                /{target.phonemes.join(
                  " "
                )}/
              </span>

            </div>

          )}


          {gameComplete && !gameWon && (

            <div className="game-over">

              <strong>
                The correct answer was:
              </strong>

              <span>
                {target.english}
              </span>

              <span>
                /{target.phonemes.join(
                  " "
                )}/
              </span>

            </div>

          )}


          <div className="game-controls">

            <button
              type="button"
              className="secondary-button"
              onClick={removePhoneme}
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
              onClick={clearGuess}
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
              onClick={submitGuess}
              disabled={
                guess.length !==
                  target.phonemes.length ||
                gameComplete
              }
            >
              Submit Guess
            </button>

            {gameComplete && (

              <button
                type="button"
                className="secondary-button"
                onClick={resetGame}
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