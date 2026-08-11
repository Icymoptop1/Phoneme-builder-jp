import type { PhonemeWord } from "../data/phonemes";
import { phonemes } from "../data/phonemes";

interface WordleHTMLSettings {
  target: PhonemeWord;
  maxAttempts: number;
}

export function generateWordleHTML({
  target,
  maxAttempts,
}: WordleHTMLSettings): void {
  const targetJSON = JSON.stringify(target);
  const keyboardJSON = JSON.stringify(phonemes);

  const html = `
<!DOCTYPE html>
<html lang="en" data-theme="light">

<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Phoneme Wordle</title>

  <style>
    * {
      box-sizing: border-box;
    }

    :root {
      --background: #f5f7fb;
      --surface: #ffffff;
      --surface-secondary: #eef1f6;
      --text: #172033;
      --muted: #667085;
      --border: #dce1e8;
      --primary: #202936;
      --focus: #4f7cff;
      --success: #22c55e;
      --present: #eab308;
      --error: #dc2626;
    }

    [data-theme="dark"] {
      --background: #11151c;
      --surface: #1b222d;
      --surface-secondary: #252e3a;
      --text: #f4f6f8;
      --muted: #aab3c0;
      --border: #374151;
      --primary: #f4f6f8;
      --focus: #8ca8ff;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      font-family:
        Arial,
        Helvetica,
        sans-serif;

      background: var(--background);
      color: var(--text);

      transition:
        background 0.2s ease,
        color 0.2s ease;
    }

    button {
      font: inherit;
      cursor: pointer;
    }

    button:focus-visible {
      outline: 3px solid var(--focus);
      outline-offset: 2px;
    }

    .site-header {
      background: var(--surface-secondary);
      border-bottom: 1px solid var(--border);
      padding: 28px 5%;
    }

    .header-content {
      max-width: 1100px;
      margin: auto;

      display: flex;
      justify-content: space-between;
      align-items: center;

      gap: 20px;
    }

    .site-header h1 {
      margin: 0 0 6px;
      font-size: clamp(1.6rem, 4vw, 2.4rem);
    }

    .site-header p {
      margin: 0;
      color: var(--muted);
    }

    .theme-toggle {
      width: 42px;
      height: 42px;

      border: 1px solid var(--border);
      border-radius: 8px;

      background: var(--surface);
      color: var(--text);

      font-size: 1rem;
    }

    .page {
      width: min(1100px, 92%);
      margin: 0 auto;
      padding: 45px 0;
    }

    .builder-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      gap: 20px;
      margin-bottom: 28px;
    }

    .builder-header h2 {
      margin: 8px 0;
      font-size: 2rem;
    }

    .builder-header p {
      margin: 0;
      color: var(--muted);
    }

    .badge {
      display: inline-block;

      padding: 5px 10px;

      border-radius: 20px;

      background: var(--surface-secondary);
      color: var(--muted);

      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.06em;
    }

    .wordle-layout {
      display: grid;

      grid-template-columns:
        minmax(300px, 0.9fr)
        minmax(400px, 1.1fr);

      gap: 25px;
    }

    .builder-panel,
    .preview-panel {
      background: var(--surface);

      border: 1px solid var(--border);
      border-radius: 12px;

      padding: 25px;
    }

    .builder-panel h3,
    .preview-panel h3 {
      margin-top: 0;
    }

    .instruction {
      color: var(--muted);
      font-size: 0.9rem;
    }

    .phoneme-grid {
      display: grid;

      grid-template-columns:
        repeat(auto-fit, minmax(88px, 1fr));

      gap: 10px;
      margin-top: 22px;
    }

    .phoneme-button {
      background: var(--surface-secondary);
      color: var(--text);

      border: 1px solid var(--border);
      border-radius: 8px;

      padding: 12px 6px;

      transition:
        transform 0.15s ease,
        border-color 0.15s ease;
    }

    .phoneme-button:hover,
    .phoneme-button:focus {
      border-color: var(--focus);
      transform: translateY(-2px);
    }

    .phoneme-symbol {
      display: block;
      font-size: 1.15rem;
      font-weight: 700;
    }

    .phoneme-label {
      display: block;
      color: var(--muted);
      font-size: 0.75rem;
      margin-top: 4px;
    }

    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      gap: 20px;
    }

    .preview-header p {
      margin: 4px 0 0;
      color: var(--muted);
      font-size: 0.85rem;
    }

    .preview-header span {
      color: var(--muted);
      font-size: 0.75rem;
      font-weight: 800;
    }

    .wordle-grid {
      display: flex;
      flex-direction: column;

      gap: 8px;
      margin: 24px 0;
    }

    .guess-row {
      display: flex;
      justify-content: center;

      gap: 8px;
    }

    .guess-cell {
      width: 64px;
      height: 64px;

      display: flex;
      align-items: center;
      justify-content: center;

      border: 2px solid var(--border);
      border-radius: 8px;

      background: var(--surface);

      font-weight: 700;
      font-size: 1rem;
    }

    .guess-cell.correct {
      background: var(--success);
      border-color: var(--success);
      color: white;
    }

    .guess-cell.present {
      background: var(--present);
      border-color: var(--present);
      color: white;
    }

    .guess-cell.absent {
      background: var(--error);
      border-color: var(--error);
      color: white;
    }

    .game-message {
      margin-top: 15px;

      padding: 13px;

      border-radius: 8px;

      text-align: center;
      font-weight: 700;
    }

    .game-message.success {
      background: rgba(34, 197, 94, 0.12);
      border: 1px solid var(--success);
      color: var(--success);
    }

    .game-message.error {
      background: rgba(220, 38, 38, 0.1);
      border: 1px solid var(--error);
      color: var(--error);
    }

    .game-controls {
      display: flex;
      justify-content: center;

      gap: 10px;
      flex-wrap: wrap;

      margin-top: 20px;
    }

    .primary-button,
    .secondary-button {
      border-radius: 8px;

      padding: 11px 17px;

      font-weight: 700;
    }

    .primary-button {
      background: var(--primary);
      color: var(--background);
      border: none;
    }

    .secondary-button {
      background: var(--surface-secondary);
      color: var(--text);

      border: 1px solid var(--border);
    }

    .feedback-legend {
      display: flex;
      flex-wrap: wrap;

      gap: 15px;

      margin-top: 24px;

      color: var(--muted);
      font-size: 0.88rem;
    }

    .feedback-legend span {
      display: flex;
      align-items: center;

      gap: 7px;
    }

    .feedback-legend i {
      width: 14px;
      height: 14px;

      border-radius: 3px;

      display: inline-block;
    }

    .legend-correct {
      background: var(--success);
    }

    .legend-present {
      background: var(--present);
    }

    .legend-absent {
      background: var(--error);
    }

    .completion-card {
      margin-top: 18px;

      padding: 22px;

      text-align: center;

      border-radius: 10px;

      background: rgba(34, 197, 94, 0.12);
      border: 1px solid var(--success);
    }

    .completion-card h3 {
      margin: 0 0 8px;
    }

    .completion-card strong {
      display: block;

      margin-top: 8px;

      font-size: 1.7rem;
    }

    .completion-card span {
      display: block;

      margin-top: 5px;

      color: var(--muted);
    }

    @media (max-width: 900px) {
      .wordle-layout {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 600px) {
      .header-content,
      .builder-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .guess-cell {
        width: 54px;
        height: 54px;

        font-size: 0.85rem;
      }
    }
  </style>
</head>

<body>

  <header class="site-header">
    <div class="header-content">
      <div>
        <h1>
          Phoneme Learning Activity Builder
        </h1>

        <p>
          Interactive phoneme-based classroom activity
        </p>
      </div>

      <button
        type="button"
        class="theme-toggle"
        id="themeToggle"
        aria-label="Toggle light and dark mode"
        title="Toggle light and dark mode"
      >
        🌙
      </button>
    </div>
  </header>

  <main class="page">

    <div class="builder-header">
      <div>
        <span class="badge">
          PHONEME WORDLE
        </span>

        <h2>
          Wordle Activity
        </h2>

        <p>
          Select phonemes to build the hidden target word.
        </p>
      </div>
    </div>

    <div class="wordle-layout">

      <div class="builder-panel">
        <h3>
          Phoneme Keyboard
        </h3>

        <p class="instruction">
          Hover over each phoneme to see its English
          equivalence and example word.
        </p>

        <div
          class="phoneme-grid"
          id="keyboard"
        ></div>
      </div>

      <div class="preview-panel">

        <div class="preview-header">
          <div>
            <h3>
              Wordle
            </h3>

            <p id="attemptText">
              Attempt 1 of ${maxAttempts}
            </p>
          </div>

          <span>
            ${target.phonemes.length} PHONEMES
          </span>
        </div>

        <div
          class="wordle-grid"
          id="wordleGrid"
        ></div>

        <div
          id="message"
          class="game-message"
          style="display: none;"
        ></div>

        <div
          id="completionCard"
          class="completion-card"
          style="display: none;"
        ></div>

        <div class="game-controls">
          <button
            type="button"
            class="secondary-button"
            id="removeButton"
          >
            ← Remove
          </button>

          <button
            type="button"
            class="secondary-button"
            id="clearButton"
          >
            Clear
          </button>

          <button
            type="button"
            class="primary-button"
            id="submitButton"
          >
            Submit Guess
          </button>
        </div>

        <div class="feedback-legend">
          <span>
            <i class="legend-correct"></i>
            Correct position
          </span>

          <span>
            <i class="legend-present"></i>
            Correct phoneme, wrong position
          </span>

          <span>
            <i class="legend-absent"></i>
            Incorrect phoneme
          </span>
        </div>

      </div>

    </div>

  </main>

<script>
  const target = ${targetJSON};
  const phonemes = ${keyboardJSON};
  const maxAttempts = ${maxAttempts};

  let currentGuess = [];
  let submittedGuesses = [];
  let gameComplete = false;

  const keyboardElement =
    document.getElementById("keyboard");

  const gridElement =
    document.getElementById("wordleGrid");

  const messageElement =
    document.getElementById("message");

  const completionCard =
    document.getElementById("completionCard");

  const attemptText =
    document.getElementById("attemptText");

  const submitButton =
    document.getElementById("submitButton");

  const removeButton =
    document.getElementById("removeButton");

  const clearButton =
    document.getElementById("clearButton");

  const themeToggle =
    document.getElementById("themeToggle");

  function renderKeyboard() {
    keyboardElement.innerHTML = "";

    phonemes.forEach((phoneme) => {
      const button =
        document.createElement("button");

      button.type = "button";
      button.className = "phoneme-button";

      button.title =
        phoneme.symbol +
        " — " +
        phoneme.example;

      button.setAttribute(
        "aria-label",
        phoneme.symbol +
          ". " +
          phoneme.example
      );

      button.innerHTML =
        '<span class="phoneme-symbol">/' +
        phoneme.symbol +
        '/</span>' +
        '<span class="phoneme-label">' +
        phoneme.label +
        "</span>";

      button.addEventListener(
        "click",
        () => addPhoneme(phoneme.symbol)
      );

      keyboardElement.appendChild(button);
    });
  }

  function renderGrid() {
    gridElement.innerHTML = "";

    for (
      let rowIndex = 0;
      rowIndex < maxAttempts;
      rowIndex++
    ) {
      const row =
        document.createElement("div");

      row.className = "guess-row";

      const submitted =
        submittedGuesses[rowIndex];

      const isCurrentRow =
        rowIndex === submittedGuesses.length &&
        !gameComplete;

      for (
        let index = 0;
        index < target.phonemes.length;
        index++
      ) {
        const cell =
          document.createElement("div");

        cell.className = "guess-cell";

        if (submitted) {
          cell.textContent =
            submitted.phonemes[index];

          cell.classList.add(
            submitted.feedback[index]
          );
        } else if (isCurrentRow) {
          cell.textContent =
            currentGuess[index] || "";
        }

        row.appendChild(cell);
      }

      gridElement.appendChild(row);
    }

    updateAttemptText();
  }

  function addPhoneme(symbol) {
    if (gameComplete) {
      return;
    }

    if (
      currentGuess.length >=
      target.phonemes.length
    ) {
      return;
    }

    currentGuess.push(symbol);

    hideMessage();
    renderGrid();
  }

  function removeLast() {
    if (gameComplete) {
      return;
    }

    currentGuess.pop();

    hideMessage();
    renderGrid();
  }

  function clearGuess() {
    if (gameComplete) {
      return;
    }

    currentGuess = [];

    hideMessage();
    renderGrid();
  }

  function evaluateGuess(guess) {
    const result =
      Array(target.phonemes.length)
        .fill("absent");

    const remaining =
      [...target.phonemes];

    guess.forEach(
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

    guess.forEach(
      (phoneme, index) => {
        if (
          result[index] ===
          "correct"
        ) {
          return;
        }

        const foundIndex =
          remaining.indexOf(phoneme);

        if (foundIndex !== -1) {
          result[index] =
            "present";

          remaining[foundIndex] = "";
        }
      }
    );

    return result;
  }

  function submitGuess() {
    if (gameComplete) {
      return;
    }

    if (
      currentGuess.length !==
      target.phonemes.length
    ) {
      showMessage(
        "Select " +
          target.phonemes.length +
          " phonemes before submitting.",
        "error"
      );

      return;
    }

    const feedback =
      evaluateGuess(currentGuess);

    submittedGuesses.push({
      phonemes: [...currentGuess],
      feedback,
    });

    const correct =
      feedback.every(
        (status) =>
          status === "correct"
      );

    if (correct) {
      gameComplete = true;

      renderGrid();

      showMessage(
        "Congratulations! You found the word.",
        "success"
      );

      showCompletion();

      disableControls();

      return;
    }

    currentGuess = [];

    if (
      submittedGuesses.length >=
      maxAttempts
    ) {
      gameComplete = true;

      renderGrid();

      showMessage(
        "Game over. You have used all attempts.",
        "error"
      );

      showCompletion();

      disableControls();

      return;
    }

    renderGrid();

    showMessage(
      "Try again.",
      "error"
    );
  }

  function showCompletion() {
    completionCard.style.display =
      "block";

    completionCard.innerHTML =
      "<h3>" +
      (
        submittedGuesses[
          submittedGuesses.length - 1
        ].feedback.every(
          (status) =>
            status === "correct"
        )
          ? "Congratulations!"
          : "Answer"
      ) +
      "</h3>" +
      "<strong>" +
      target.english.toUpperCase() +
      "</strong>" +
      "<span>/" +
      target.phonemes.join(" ") +
      "/</span>";
  }

  function showMessage(
    message,
    type
  ) {
    messageElement.style.display =
      "block";

    messageElement.textContent =
      message;

    messageElement.className =
      "game-message " + type;
  }

  function hideMessage() {
    messageElement.style.display =
      "none";

    messageElement.textContent = "";
  }

  function updateAttemptText() {
    if (gameComplete) {
      attemptText.textContent =
        "Game complete";

      return;
    }

    const currentAttempt =
      Math.min(
        submittedGuesses.length + 1,
        maxAttempts
      );

    attemptText.textContent =
      "Attempt " +
      currentAttempt +
      " of " +
      maxAttempts;
  }

  function disableControls() {
    submitButton.disabled = true;
    removeButton.disabled = true;
    clearButton.disabled = true;
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme =
      theme;

    localStorage.setItem(
      "phoneme-wordle-theme",
      theme
    );

    themeToggle.textContent =
      theme === "dark"
        ? "☀️"
        : "🌙";
  }

  function toggleTheme() {
    const current =
      document.documentElement.dataset.theme;

    setTheme(
      current === "dark"
        ? "light"
        : "dark"
    );
  }

  function loadTheme() {
    const saved =
      localStorage.getItem(
        "phoneme-wordle-theme"
      );

    if (
      saved === "dark" ||
      saved === "light"
    ) {
      setTheme(saved);
    } else {
      setTheme("light");
    }
  }

  submitButton.addEventListener(
    "click",
    submitGuess
  );

  removeButton.addEventListener(
    "click",
    removeLast
  );

  clearButton.addEventListener(
    "click",
    clearGuess
  );

  themeToggle.addEventListener(
    "click",
    toggleTheme
  );

  loadTheme();
  renderKeyboard();
  renderGrid();
</script>

</body>
</html>
`;

  const blob = new Blob(
    [html],
    {
      type: "text/html",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "phoneme-wordle.html";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}