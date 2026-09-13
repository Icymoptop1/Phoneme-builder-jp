import type {
  WordSearchPuzzle,
} from "./wordSearchGenerator";

interface WordSearchHTMLSettings {
  puzzle: WordSearchPuzzle;
  size: number;
  theme?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
}

export function generateWordSearchHTML({
  puzzle,
  size,
  theme = "light",
  difficulty = "MEDIUM",
}: WordSearchHTMLSettings): void {
  const initialTheme =
    theme === "dark" ? "dark" : "light";
  const puzzleJSON =
    JSON.stringify(puzzle);

  const html = `
<!DOCTYPE html>
<html lang="en" data-theme="${initialTheme}">

<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Phoneme Word Search</title>

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
      --error: #dc2626;
      --selection: #6366f1;
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

      background:
        var(--background);

      color:
        var(--text);

      transition:
        background 0.2s ease,
        color 0.2s ease;
    }

    button {
      font: inherit;
      cursor: pointer;
    }

    button:focus-visible {
      outline:
        3px solid
        var(--focus);

      outline-offset:
        2px;
    }

    .site-header {
      padding:
        28px 5%;

      background:
        var(--surface-secondary);

      border-bottom:
        1px solid
        var(--border);
    }

    .header-content {
      max-width:
        1100px;

      margin:
        auto;

      display:
        flex;

      justify-content:
        space-between;

      align-items:
        center;

      gap:
        20px;
    }

    .site-header h1 {
      margin:
        0 0 6px;

      font-size:
        clamp(
          1.6rem,
          4vw,
          2.4rem
        );
    }

    .site-header p {
      margin:
        0;

      color:
        var(--muted);
    }

    .theme-toggle {
      width:
        42px;

      height:
        42px;

      border:
        1px solid
        var(--border);

      border-radius:
        8px;

      background:
        var(--surface);

      color:
        var(--text);

      font-size:
        1rem;
    }

    .page {
      width:
        min(
          1100px,
          92%
        );

      margin:
        0 auto;

      padding:
        45px 0;
    }

    .page-header {
      margin-bottom:
        28px;
    }

    .page-header h2 {
      margin:
        8px 0;

      font-size:
        2rem;
    }

    .page-header p {
      margin:
        0;

      color:
        var(--muted);
    }

    .badge {
      display:
        inline-block;

      padding:
        5px 10px;

      border-radius:
        20px;

      background:
        var(--surface-secondary);

      color:
        var(--muted);

      font-size:
        0.72rem;

      font-weight:
        800;

      letter-spacing:
        0.06em;
    }

    .word-search-layout {
      display:
        grid;

      grid-template-columns:
        minmax(240px, 0.65fr)
        minmax(0, 1.35fr);

      gap:
        25px;
    }

    .panel {
      padding:
        25px;

      background:
        var(--surface);

      border:
        1px solid
        var(--border);

      border-radius:
        12px;
    }

    .panel-header {
      display:
        flex;

      justify-content:
        space-between;

      align-items:
        flex-start;

      gap:
        15px;

      margin-bottom:
        20px;
    }

    .panel-header h3 {
      margin:
        0;
    }

    .panel-header p {
      margin:
        5px 0 0;

      color:
        var(--muted);

      font-size:
        0.85rem;
    }

    .panel-header span {
      color:
        var(--muted);

      font-size:
        0.8rem;

      font-weight:
        700;
    }

    .word-list {
      display:
        flex;

      flex-direction:
        column;

      gap:
        10px;
    }

    .word-item {
      display:
        flex;

      justify-content:
        space-between;

      align-items:
        center;

      gap:
        15px;

      padding:
        14px;

      background:
        var(--surface-secondary);

      border:
        1px solid
        var(--border);

      border-radius:
        8px;
    }

    .word-item strong {
      display:
        block;

      margin-bottom:
        4px;
    }

    .word-phonemes {
      color:
        var(--muted);

      font-size:
        0.85rem;
    }

    .word-item.found {
      background:
        rgba(
          34,
          197,
          94,
          0.1
        );

      border-color:
        var(--success);
    }

    .word-item.found strong {
      text-decoration:
        line-through;
    }

    .found-check {
      color:
        var(--success);

      font-size:
        1.3rem;

      font-weight:
        800;
    }

    .instructions {
      margin-top:
        25px;

      padding:
        15px;

      background:
        var(--surface-secondary);

      border-radius:
        8px;
    }

    .instructions h4 {
      margin:
        0 0 10px;
    }

    .instructions p {
      margin:
        6px 0;

      color:
        var(--muted);

      font-size:
        0.85rem;
    }

    .word-search-grid {
      display:
        grid;

      grid-template-columns:
        repeat(
          ${size},
          minmax(0, 1fr)
        );

      gap:
        6px;

      width:
        min(100%, 720px);

      max-width:
        100%;

      margin:
        25px auto;

      overflow:
        hidden;
    }

    .search-cell {
      aspect-ratio:
        1;

      min-width:
        0;

      display:
        flex;

      align-items:
        center;

      justify-content:
        center;

      padding:
        3px;

      background:
        var(--surface-secondary);

      color:
        var(--text);

      border:
        2px solid
        var(--border);

      border-radius:
        7px;

      font-weight:
        600;

      font-size:
        clamp(
          0.55rem,
          1.4vw,
          0.95rem
        );

      transition:
        background 0.15s ease,
        border-color 0.15s ease,
        transform 0.15s ease;
    }

    .search-cell:hover {
      border-color:
        var(--focus);

      transform:
        scale(1.04);
    }

    .search-cell.selected {
      background:
        var(--selection);

      border-color:
        var(--selection);

      color:
        white;
    }

    .search-cell.found {
      background:
        var(--success);

      border-color:
        var(--success);

      color:
        white;
    }

    .feedback {
      display:
        none;

      margin-top:
        18px;

      padding:
        14px;

      border-radius:
        8px;

      text-align:
        center;

      font-weight:
        600;
    }

    .feedback.success {
      display:
        block;

      background:
        rgba(
          34,
          197,
          94,
          0.12
        );

      border:
        1px solid
        var(--success);

      color:
        #16a34a;
    }

    .feedback.error {
      display:
        block;

      background:
        rgba(
          220,
          38,
          38,
          0.1
        );

      border:
        1px solid
        var(--error);

      color:
        var(--error);
    }

    .controls {
      display:
        flex;

      justify-content:
        center;

      flex-wrap:
        wrap;

      gap:
        10px;

      margin-top:
        20px;
    }

    .primary-button,
    .secondary-button {
      padding:
        11px 17px;

      border-radius:
        8px;

      font-weight:
        700;
    }

    .primary-button {
      background:
        var(--primary);

      color:
        var(--background);

      border:
        none;
    }

    .secondary-button {
      background:
        var(--surface-secondary);

      color:
        var(--text);

      border:
        1px solid
        var(--border);
    }

    .progress-area {
      margin-top:
        25px;

      padding-top:
        20px;

      border-top:
        1px solid
        var(--border);
    }

    .progress-text {
      display:
        flex;

      justify-content:
        space-between;

      margin-bottom:
        8px;

      color:
        var(--muted);

      font-size:
        0.85rem;
    }

    .progress-text strong {
      color:
        var(--text);
    }

    .progress-bar {
      width:
        100%;

      height:
        10px;

      overflow:
        hidden;

      border-radius:
        20px;

      background:
        var(--surface-secondary);
    }

    .progress-fill {
      width:
        0%;

      height:
        100%;

      border-radius:
        20px;

      background:
        var(--success);

      transition:
        width 0.3s ease;
    }

    @media (
      max-width: 900px
    ) {
      .word-search-layout {
        grid-template-columns:
          1fr;
      }
    }

    @media (
      max-width: 760px
    ) {
      .page {
        width: min(96%, 1100px);
      }

      .panel {
        padding: 16px;
        min-width: 0;
      }

      .word-search-grid {
        gap: 4px;
        margin: 18px auto;
      }

      .search-cell {
        border-radius: 5px;
        font-size:
          clamp(
            0.48rem,
            2vw,
            0.8rem
          );
      }
    }

    @media (
      max-width: 600px
    ) {
      .header-content {
        flex-direction:
          column;

        align-items:
          flex-start;
      }

      .word-search-grid {
        gap:
          3px;
      }

      .search-cell {
        border-width:
          1px;

        padding:
          1px;

        font-size:
          0.52rem;
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
      id="themeToggle"
      class="theme-toggle"
      aria-label="Toggle light and dark mode"
      title="Toggle light and dark mode"
    >
      🌙
    </button>

  </div>

</header>

<main class="page">

  <div class="page-header">

    <span class="badge">
      PHONEME WORD SEARCH · ${difficulty}
    </span>

    <h2>
      Word Search Activity
    </h2>

    <p>
      Find each hidden word by selecting
      the first and final phoneme.
    </p>

  </div>

  <div class="word-search-layout">

    <!-- WORD LIST -->

    <section class="panel">

      <div class="panel-header">

        <div>
          <h3>
            Word List
          </h3>

          <p>
            Find each word in the grid.
          </p>
        </div>

        <span id="wordCounter">
          0 / ${puzzle.words.length}
        </span>

      </div>

      <div
        id="wordList"
        class="word-list"
      ></div>

      <div class="instructions">

        <h4>
          How to Play
        </h4>

        <p>
          1. Select the first phoneme of a word.
        </p>

        <p>
          2. Select the final phoneme of the word.
        </p>

        <p>
          3. Press Check Selection.
        </p>

        <p>
          Keyboard: use the arrow keys to move
          through the grid and Enter or Space
          to select a cell.
        </p>

        <p>
          Words can run horizontally,
          vertically or diagonally.
        </p>

      </div>

    </section>

    <!-- GAME -->

    <section class="panel">

      <div class="panel-header">

        <div>
          <h3>
            Word Search
          </h3>

          <p>
            Select the start and end cells
            of a hidden word.
          </p>
        </div>

        <span>
          ${size} × ${size}
        </span>

      </div>

      <div
        id="grid"
        class="word-search-grid"
      ></div>

      <div
        id="feedback"
        class="feedback"
        role="status"
        aria-live="polite"
      ></div>

      <div class="controls">

        <button
          type="button"
          id="clearButton"
          class="secondary-button"
        >
          Clear Selection
        </button>

        <button
          type="button"
          id="checkButton"
          class="primary-button"
        >
          Check Selection
        </button>

      </div>

      <div class="progress-area">

        <div class="progress-text">

          <span>
            Progress
          </span>

          <strong id="progressText">
            0 / ${puzzle.words.length} words
          </strong>

        </div>

        <div
          class="progress-bar"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="${puzzle.words.length}"
          aria-valuenow="0"
          id="progressBar"
        >

          <div
            id="progressFill"
            class="progress-fill"
          ></div>

        </div>

      </div>

    </section>

  </div>

</main>

<script>
  const puzzle =
    ${puzzleJSON};

  let selectionStart = null;

  let selectedCells = [];

  let foundWords = [];

  let foundCells = [];


  const gridElement =
    document.getElementById(
      "grid"
    );

  const wordListElement =
    document.getElementById(
      "wordList"
    );

  const feedbackElement =
    document.getElementById(
      "feedback"
    );

  const counterElement =
    document.getElementById(
      "wordCounter"
    );

  const progressText =
    document.getElementById(
      "progressText"
    );

  const progressFill =
    document.getElementById(
      "progressFill"
    );

  const progressBar =
    document.getElementById(
      "progressBar"
    );

  const themeToggle =
    document.getElementById(
      "themeToggle"
    );


  function cellKey(
    row,
    col
  ) {
    return (
      row +
      "-" +
      col
    );
  }


  function calculateLine(
    startRow,
    startCol,
    endRow,
    endCol
  ) {
    const rowDifference =
      endRow - startRow;

    const colDifference =
      endCol - startCol;

    const horizontal =
      rowDifference === 0;

    const vertical =
      colDifference === 0;

    const diagonal =
      Math.abs(
        rowDifference
      ) ===
      Math.abs(
        colDifference
      );

    if (
      !horizontal &&
      !vertical &&
      !diagonal
    ) {
      return null;
    }

    const rowStep =
      Math.sign(
        rowDifference
      );

    const colStep =
      Math.sign(
        colDifference
      );

    const length =
      Math.max(
        Math.abs(
          rowDifference
        ),
        Math.abs(
          colDifference
        )
      ) + 1;

    const cells = [];

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
        cellKey(
          row,
          col
        )
      );
    }

    return cells;
  }


  function createGrid() {
    gridElement.innerHTML =
      "";

    puzzle.grid.forEach(
      (
        row,
        rowIndex
      ) => {

        row.forEach(
          (
            phoneme,
            colIndex
          ) => {

            const key =
              cellKey(
                rowIndex,
                colIndex
              );

            const button =
              document.createElement(
                "button"
              );

            button.type =
              "button";

            button.className =
              "search-cell";

            button.dataset.cell =
              key;

            button.textContent =
              "/" +
              phoneme +
              "/";

            button.setAttribute(
              "aria-label",
              "Phoneme " +
              phoneme
            );

            button.title =
              "Phoneme " +
              phoneme;

            button.dataset.row =
              String(rowIndex);

            button.dataset.col =
              String(colIndex);

            button.addEventListener(
              "click",
              () =>
                selectCell(
                  rowIndex,
                  colIndex
                )
            );

            button.addEventListener(
              "keydown",
              (event) =>
                handleGridKeydown(
                  event,
                  rowIndex,
                  colIndex
                )
            );

            gridElement.appendChild(
              button
            );
          }
        );
      }
    );
  }


  function focusGridCell(
    row,
    col
  ) {
    const safeRow =
      Math.max(
        0,
        Math.min(
          puzzle.grid.length - 1,
          row
        )
      );

    const safeCol =
      Math.max(
        0,
        Math.min(
          puzzle.grid[0].length - 1,
          col
        )
      );

    const target =
      gridElement.querySelector(
        '[data-cell="' +
        cellKey(
          safeRow,
          safeCol
        ) +
        '"]'
      );

    if (target) {
      target.focus();
    }
  }


  function handleGridKeydown(
    event,
    row,
    col
  ) {
    if (
      event.key ===
        "ArrowUp" ||
      event.key ===
        "ArrowDown" ||
      event.key ===
        "ArrowLeft" ||
      event.key ===
        "ArrowRight"
    ) {
      event.preventDefault();

      const rowChange =
        event.key === "ArrowUp"
          ? -1
          : event.key === "ArrowDown"
            ? 1
            : 0;

      const colChange =
        event.key === "ArrowLeft"
          ? -1
          : event.key === "ArrowRight"
            ? 1
            : 0;

      focusGridCell(
        row + rowChange,
        col + colChange
      );
    }
  }


  function createWordList() {
    wordListElement.innerHTML =
      "";

    puzzle.words.forEach(
      (word) => {

        const item =
          document.createElement(
            "div"
          );

        item.className =
          "word-item";

        item.id =
          "word-" +
          word.english;

        const details =
          document.createElement(
            "div"
          );

        const name =
          document.createElement(
            "strong"
          );

        name.textContent =
          word.english
            .toUpperCase();

        const phonemes =
          document.createElement(
            "div"
          );

        phonemes.className =
          "word-phonemes";

        phonemes.textContent =
          "/" +
          word.phonemes.join(
            " "
          ) +
          "/";

        details.appendChild(
          name
        );

        details.appendChild(
          phonemes
        );

        item.appendChild(
          details
        );

        wordListElement.appendChild(
          item
        );
      }
    );
  }


  function selectCell(
    row,
    col
  ) {
    if (
      selectionStart === null
    ) {
      selectionStart = {
        row,
        col
      };

      selectedCells = [
        cellKey(
          row,
          col
        )
      ];

      showFeedback(
        "Start selected. Now select the final cell.",
        ""
      );

      updateGridClasses();

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
      showFeedback(
        "Words must be selected horizontally, vertically or diagonally.",
        "error"
      );

      clearSelection();

      return;
    }

    selectedCells =
      line;

    showFeedback(
      "Selection ready. Press Check Selection.",
      ""
    );

    updateGridClasses();
  }


  function checkSelection() {
    if (
      selectedCells.length <
      2
    ) {
      showFeedback(
        "Select the first and last cells of a word.",
        "error"
      );

      return;
    }

    const match =
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

          const reversed =
            [...placement.cells]
              .reverse();

          const reverse =
            reversed.every(
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

    if (!match) {
      showFeedback(
        "Incorrect selection. Try again.",
        "error"
      );

      clearSelection();

      return;
    }

    const word =
      match.word.english;

    if (
      foundWords.includes(
        word
      )
    ) {
      showFeedback(
        word.toUpperCase() +
          " has already been found.",
        "error"
      );

      clearSelection();

      return;
    }

    foundWords.push(
      word
    );

    foundCells = [
      ...new Set([
        ...foundCells,
        ...match.cells
      ])
    ];

    markWordFound(
      word
    );

    clearSelection();

    updateProgress();

    if (
      foundWords.length ===
      puzzle.words.length
    ) {
      showFeedback(
        "Congratulations! You found all " +
          puzzle.words.length +
          " words.",
        "success"
      );
    } else {
      showFeedback(
        "Correct! You found " +
          word.toUpperCase() +
          ".",
        "success"
      );
    }
  }


  function markWordFound(
    word
  ) {
    const item =
      document.getElementById(
        "word-" + word
      );

    if (!item) {
      return;
    }

    item.classList.add(
      "found"
    );

    const check =
      document.createElement(
        "span"
      );

    check.className =
      "found-check";

    check.textContent =
      "✓";

    item.appendChild(
      check
    );
  }


  function clearSelection() {
    selectionStart =
      null;

    selectedCells =
      [];

    updateGridClasses();
  }


  function updateGridClasses() {
    document
      .querySelectorAll(
        ".search-cell"
      )
      .forEach(
        (element) => {

          const key =
            element.dataset.cell;

          element.classList
            .toggle(
              "selected",
              selectedCells.includes(
                key
              )
            );

          element.classList
            .toggle(
              "found",
              foundCells.includes(
                key
              )
            );
        }
      );
  }


  function updateProgress() {
    const total =
      puzzle.words.length;

    const current =
      foundWords.length;

    counterElement.textContent =
      current +
      " / " +
      total;

    progressText.textContent =
      current +
      " / " +
      total +
      " words";

    const percentage =
      total > 0
        ? (
            current /
            total
          ) * 100
        : 0;

    progressFill.style.width =
      percentage +
      "%";

    progressBar.setAttribute(
      "aria-valuenow",
      String(current)
    );
  }


  function showFeedback(
    message,
    type
  ) {
    feedbackElement.textContent =
      message;

    if (
      type === "success"
    ) {
      feedbackElement.className =
        "feedback success";
    } else if (
      type === "error"
    ) {
      feedbackElement.className =
        "feedback error";
    } else {
      feedbackElement.className =
        "feedback";

      feedbackElement.style.display =
        "block";
    }
  }


  function setTheme(
    theme
  ) {
    document.documentElement
      .dataset.theme =
      theme;

    localStorage.setItem(
      "phoneme-word-search-theme",
      theme
    );

    themeToggle.textContent =
      theme === "dark"
        ? "☀️"
        : "🌙";
  }


  function toggleTheme() {
    const current =
      document.documentElement
        .dataset.theme;

    setTheme(
      current === "dark"
        ? "light"
        : "dark"
    );
  }


  function loadTheme() {
    const saved =
      localStorage.getItem(
        "phoneme-word-search-theme"
      );

    if (
      saved === "dark" ||
      saved === "light"
    ) {
      setTheme(
        saved
      );
    } else {
      setTheme(
        "${initialTheme}"
      );
    }
  }


  document
    .getElementById(
      "clearButton"
    )
    .addEventListener(
      "click",
      () => {
        clearSelection();

        showFeedback(
          "",
          ""
        );
      }
    );


  document
    .getElementById(
      "checkButton"
    )
    .addEventListener(
      "click",
      checkSelection
    );


  themeToggle
    .addEventListener(
      "click",
      toggleTheme
    );


  loadTheme();

  createGrid();

  createWordList();

  updateProgress();
</script>

</body>

</html>
`;

  const blob =
    new Blob(
      [html],
      {
        type: "text/html",
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      "a"
    );

  link.href =
    url;

  link.download =
    "phoneme-word-search.html";

  document.body.appendChild(
    link
  );

  link.click();

  document.body.removeChild(
    link
  );

  URL.revokeObjectURL(
    url
  );
}