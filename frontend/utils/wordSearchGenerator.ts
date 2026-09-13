import type {
  PhonemeWord,
} from "../data/phonemes";

export type WordSearchDifficulty =
  | "EASY"
  | "MEDIUM"
  | "HARD";

export type PlacedWord = {
  word: PhonemeWord;
  cells: string[];
};

export type WordSearchPuzzle = {
  grid: string[][];
  words: PhonemeWord[];
  placements: PlacedWord[];
};

type Direction = {
  row: number;
  col: number;
};

const easyDirections: Direction[] = [
  { row: 0, col: 1 },
  { row: 1, col: 0 },
];

const mediumDirections: Direction[] = [
  { row: 0, col: 1 },
  { row: 1, col: 0 },
  { row: 1, col: 1 },
  { row: 1, col: -1 },
];

const hardDirections: Direction[] = [
  { row: 0, col: 1 },
  { row: 0, col: -1 },
  { row: 1, col: 0 },
  { row: -1, col: 0 },
  { row: 1, col: 1 },
  { row: 1, col: -1 },
  { row: -1, col: 1 },
  { row: -1, col: -1 },
];

function getDirections(
  difficulty: WordSearchDifficulty
): Direction[] {
  if (difficulty === "EASY") {
    return easyDirections;
  }

  if (difficulty === "HARD") {
    return hardDirections;
  }

  return mediumDirections;
}

function shuffle<T>(
  values: T[]
): T[] {
  const copy = [...values];

  for (
    let index =
      copy.length - 1;
    index > 0;
    index--
  ) {
    const randomIndex =
      Math.floor(
        Math.random() *
          (index + 1)
      );

    [
      copy[index],
      copy[randomIndex],
    ] = [
      copy[randomIndex],
      copy[index],
    ];
  }

  return copy;
}

function canPlaceWord(
  grid: (string | null)[][],
  word: PhonemeWord,
  startRow: number,
  startCol: number,
  direction: Direction
) {
  for (
    let index = 0;
    index <
    word.phonemes.length;
    index++
  ) {
    const row =
      startRow +
      direction.row *
        index;

    const col =
      startCol +
      direction.col *
        index;

    if (
      row < 0 ||
      row >= grid.length ||
      col < 0 ||
      col >= grid.length
    ) {
      return false;
    }

    const existing =
      grid[row][col];

    if (
      existing !== null &&
      existing !==
        word.phonemes[index]
    ) {
      return false;
    }
  }

  return true;
}

function placeWord(
  grid: (string | null)[][],
  word: PhonemeWord,
  startRow: number,
  startCol: number,
  direction: Direction
): string[] {
  const cells: string[] = [];

  word.phonemes.forEach(
    (symbol, index) => {
      const row =
        startRow +
        direction.row *
          index;

      const col =
        startCol +
        direction.col *
          index;

      grid[row][col] =
        symbol;

      cells.push(
        `${row}-${col}`
      );
    }
  );

  return cells;
}

export function generateWordSearch(
  size: number,
  requestedWords: PhonemeWord[],
  fillerPhonemes: string[],
  difficulty:
    WordSearchDifficulty =
      "MEDIUM"
): WordSearchPuzzle {
  const grid:
    (string | null)[][] =
    Array.from(
      { length: size },
      () =>
        Array.from(
          { length: size },
          () => null
        )
    );

  const placements:
    PlacedWord[] = [];

  const placedWords:
    PhonemeWord[] = [];

  const directions =
    getDirections(
      difficulty
    );

  /*
   * Longer words are attempted
   * first because they are harder
   * to fit after the grid fills.
   */
  const words =
    shuffle(
      requestedWords
    ).sort(
      (first, second) =>
        second.phonemes
          .length -
        first.phonemes.length
    );

  for (const word of words) {
    if (
      word.phonemes.length ===
        0 ||
      word.phonemes.length >
        size
    ) {
      continue;
    }

    let placed = false;

    /*
     * Try many random positions so
     * different generated puzzles
     * remain visually varied.
     */
    for (
      let attempt = 0;
      attempt < 250;
      attempt++
    ) {
      const direction =
        directions[
          Math.floor(
            Math.random() *
              directions.length
          )
        ];

      const startRow =
        Math.floor(
          Math.random() *
            size
        );

      const startCol =
        Math.floor(
          Math.random() *
            size
        );

      if (
        !canPlaceWord(
          grid,
          word,
          startRow,
          startCol,
          direction
        )
      ) {
        continue;
      }

      const cells =
        placeWord(
          grid,
          word,
          startRow,
          startCol,
          direction
        );

      placements.push({
        word,
        cells,
      });

      placedWords.push(
        word
      );

      placed = true;
      break;
    }

    /*
     * If a requested word cannot
     * fit safely, it is omitted
     * rather than corrupting the
     * puzzle.
     */
    if (!placed) {
      continue;
    }
  }

  const fillers =
    fillerPhonemes.length > 0
      ? fillerPhonemes
      : ["ə"];

  for (
    let row = 0;
    row < size;
    row++
  ) {
    for (
      let col = 0;
      col < size;
      col++
    ) {
      if (
        grid[row][col] ===
        null
      ) {
        grid[row][col] =
          fillers[
            Math.floor(
              Math.random() *
                fillers.length
            )
          ];
      }
    }
  }

  return {
    grid:
      grid as string[][],
    words: placedWords,
    placements,
  };
}
